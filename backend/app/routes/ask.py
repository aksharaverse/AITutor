import json
import logging
from typing import AsyncIterator

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field, model_validator

from app.config import settings
from app.core import rag
from app.core.llm import Usage, stream_answer
from app.core.prompts import build_messages
from app.db import get_pool
from app.deps import get_profile
from app.errors import ApiError

log = logging.getLogger(__name__)
router = APIRouter()


class AskRequest(BaseModel):
    text: str | None = Field(default=None, max_length=4000)
    image_url: str | None = None
    chapter: str | None = None

    @model_validator(mode="after")
    def _something_asked(self):
        if not (self.text or self.image_url):
            raise ValueError("Provide text and/or image_url")
        return self


def _sse(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data, default=str)}\n\n"


@router.post("/v1/ask")
async def ask(body: AskRequest, profile: dict = Depends(get_profile)):
    pool = get_pool()

    # Atomic lazy-reset + cap-check + increment in one statement (no race).
    # Free is gated by the daily counter (UTC calendar day); Pro no longer
    # bypasses entirely — it's gated by a monthly fair-use counter instead
    # (calendar month, IST — students live in IST, not UTC).
    claimed = await pool.fetchrow(
        """
        update profiles set
          questions_today = case when questions_reset_on < current_date
                                 then 1 else questions_today + 1 end,
          questions_reset_on = current_date,
          questions_month = case when plan = 'pro' then
              case when date_trunc('month', questions_month_reset_on)
                        < date_trunc('month', (now() at time zone 'Asia/Kolkata')::date)
                   then 1 else questions_month + 1 end
            else questions_month end,
          questions_month_reset_on = case when plan = 'pro'
            then (now() at time zone 'Asia/Kolkata')::date
            else questions_month_reset_on end
        where id = $1
          and (
            (plan = 'pro' and
              (case when date_trunc('month', questions_month_reset_on)
                         < date_trunc('month', (now() at time zone 'Asia/Kolkata')::date)
                    then 0 else questions_month end) < $3)
            or
            (plan <> 'pro' and
              (case when questions_reset_on < current_date
                    then 0 else questions_today end) < $2)
          )
        returning id
        """,
        profile["id"],
        settings.free_daily_limit,
        settings.pro_monthly_limit,
    )
    if claimed is None:
        if profile["plan"] == "pro":
            raise ApiError(
                402, "PRO_FAIR_USE_LIMIT",
                f"You've hit the Pro fair-use limit ({settings.pro_monthly_limit} "
                "questions/month). Contact support if you need more.",
            )
        raise ApiError(
            402, "QUOTA_EXCEEDED",
            f"Free plan is limited to {settings.free_daily_limit} questions per "
            "day. Upgrade to Pro for unlimited questions.",
        )

    question = body.text or "Solve the problem shown in the attached image."

    # Retrieval happens before the stream opens so retrieval errors are clean 5xx.
    try:
        chunks = await rag.retrieve(pool, question, body.chapter)
    except Exception:
        log.exception("retrieval failed; answering without context")
        chunks = []

    messages = build_messages(chunks, [], question)

    async def event_stream() -> AsyncIterator[str]:
        answer_parts: list[str] = []
        usage: Usage | None = None
        try:
            async for item in stream_answer(messages, body.image_url):
                if isinstance(item, Usage):
                    usage = item
                else:
                    answer_parts.append(item)
                    yield _sse("token", {"t": item})
        except Exception:
            log.exception("llm stream failed")
            yield _sse("error", {"code": "LLM_UNAVAILABLE",
                                 "message": "The tutor is unavailable. Try again."})
            return

        answer = "".join(answer_parts)
        row = await pool.fetchrow(
            """
            insert into sessions
              (user_id, question, image_url, answer, model,
               tokens_in, tokens_out, cost_usd)
            values ($1, $2, $3, $4, $5, $6, $7, $8)
            returning id, created_at
            """,
            profile["id"], question, body.image_url, answer,
            usage.model if usage else None,
            usage.tokens_in if usage else None,
            usage.tokens_out if usage else None,
            usage.cost_usd if usage else None,
        )
        yield _sse("meta", {
            "session_id": str(row["id"]),
            "model": usage.model if usage else None,
            "tokens_in": usage.tokens_in if usage else 0,
            "tokens_out": usage.tokens_out if usage else 0,
            "cost_usd": usage.cost_usd if usage else 0,
            "sources": [c["source_ref"] for c in chunks],
        })
        yield _sse("done", {})

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
