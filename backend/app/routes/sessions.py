from datetime import datetime

from fastapi import APIRouter, Depends

from app.db import get_pool
from app.deps import get_profile
from app.errors import ApiError

router = APIRouter()
PAGE_SIZE = 20


@router.get("/v1/sessions")
async def list_sessions(cursor: str | None = None,
                        profile: dict = Depends(get_profile)):
    before = None
    if cursor:
        try:
            before = datetime.fromisoformat(cursor)
        except ValueError:
            raise ApiError(400, "BAD_CURSOR", "cursor must be an ISO timestamp")

    rows = await get_pool().fetch(
        """
        select id, question, image_url, answer, model, cost_usd, created_at
        from sessions
        where user_id = $1 and ($2::timestamptz is null or created_at < $2)
        order by created_at desc
        limit $3
        """,
        profile["id"], before, PAGE_SIZE,
    )
    items = [dict(r) | {"id": str(r["id"])} for r in rows]
    next_cursor = (
        items[-1]["created_at"].isoformat() if len(items) == PAGE_SIZE else None
    )
    return {"items": items, "next_cursor": next_cursor}
