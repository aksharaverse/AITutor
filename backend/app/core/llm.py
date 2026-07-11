"""LLM adapter — the only file that talks to model vendors.

Routing (three ifs, no router service):
  - question has an image  -> Gemini 2.5 Pro (vision)
  - plain text             -> DeepSeek chat (primary; cache-friendly prefix)
  - DeepSeek fails early   -> Gemini (failover)

Yields answer tokens (str), then exactly one final Usage."""

import base64
import json
from dataclasses import dataclass
from typing import AsyncIterator

import httpx

from app.config import settings

DEEPSEEK_MODEL = "deepseek-chat"
GEMINI_MODEL = "gemini-2.5-pro"

# Indicative mid-2026 list prices, USD per token — for metering, not billing.
PRICES = {
    "deepseek-chat": {"in": 0.28e-6, "in_cached": 0.028e-6, "out": 0.42e-6},
    "gemini-2.5-pro": {"in": 1.25e-6, "in_cached": 1.25e-6, "out": 10.0e-6},
}


@dataclass
class Usage:
    model: str
    tokens_in: int
    tokens_out: int
    cost_usd: float


def _cost(model: str, tokens_in: int, tokens_out: int, cached: int = 0) -> float:
    p = PRICES[model]
    fresh = max(tokens_in - cached, 0)
    return round(fresh * p["in"] + cached * p["in_cached"] + tokens_out * p["out"], 6)


async def stream_answer(
    messages: list[dict], image_url: str | None
) -> AsyncIterator[str | Usage]:
    if image_url:
        async for item in _stream_gemini(messages, image_url):
            yield item
        return
    try:
        stream = _stream_deepseek(messages)
        first = await anext(stream)
    except (httpx.HTTPError, StopAsyncIteration):
        # Failover only if DeepSeek died before producing anything.
        async for item in _stream_gemini(messages, None):
            yield item
        return
    yield first
    async for item in stream:
        yield item


async def _stream_deepseek(messages: list[dict]) -> AsyncIterator[str | Usage]:
    tokens_in = tokens_out = cached = 0
    async with httpx.AsyncClient(timeout=httpx.Timeout(120, connect=10)) as client:
        async with client.stream(
            "POST",
            "https://api.deepseek.com/chat/completions",
            headers={"Authorization": f"Bearer {settings.deepseek_api_key}"},
            json={
                "model": DEEPSEEK_MODEL,
                "messages": messages,
                "stream": True,
                "stream_options": {"include_usage": True},
                "temperature": 0.3,
            },
        ) as r:
            r.raise_for_status()
            async for line in r.aiter_lines():
                if not line.startswith("data:"):
                    continue
                data = line[5:].strip()
                if data == "[DONE]":
                    break
                chunk = json.loads(data)
                if chunk.get("usage"):
                    u = chunk["usage"]
                    tokens_in = u.get("prompt_tokens", 0)
                    tokens_out = u.get("completion_tokens", 0)
                    cached = u.get("prompt_cache_hit_tokens", 0)
                if chunk.get("choices"):
                    delta = chunk["choices"][0].get("delta", {}).get("content")
                    if delta:
                        yield delta
    yield Usage(
        DEEPSEEK_MODEL, tokens_in, tokens_out,
        _cost(DEEPSEEK_MODEL, tokens_in, tokens_out, cached),
    )


async def _stream_gemini(
    messages: list[dict], image_url: str | None
) -> AsyncIterator[str | Usage]:
    system = next((m["content"] for m in messages if m["role"] == "system"), "")
    contents = []
    for m in messages:
        if m["role"] == "system":
            continue
        contents.append(
            {"role": "user" if m["role"] == "user" else "model",
             "parts": [{"text": m["content"]}]}
        )
    if image_url and contents:
        async with httpx.AsyncClient(timeout=30) as client:
            img = await client.get(image_url)
            img.raise_for_status()
        contents[-1]["parts"].append({
            "inline_data": {
                "mime_type": img.headers.get("content-type", "image/jpeg"),
                "data": base64.b64encode(img.content).decode(),
            }
        })

    tokens_in = tokens_out = 0
    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"{GEMINI_MODEL}:streamGenerateContent"
    )
    async with httpx.AsyncClient(timeout=httpx.Timeout(120, connect=10)) as client:
        async with client.stream(
            "POST",
            url,
            params={"alt": "sse", "key": settings.gemini_api_key},
            json={
                "system_instruction": {"parts": [{"text": system}]},
                "contents": contents,
                "generationConfig": {"temperature": 0.3},
            },
        ) as r:
            r.raise_for_status()
            async for line in r.aiter_lines():
                if not line.startswith("data:"):
                    continue
                chunk = json.loads(line[5:].strip())
                meta = chunk.get("usageMetadata")
                if meta:
                    tokens_in = meta.get("promptTokenCount", 0)
                    tokens_out = meta.get("candidatesTokenCount", 0)
                for cand in chunk.get("candidates", []):
                    for part in cand.get("content", {}).get("parts", []):
                        if part.get("text"):
                            yield part["text"]
    yield Usage(
        GEMINI_MODEL, tokens_in, tokens_out,
        _cost(GEMINI_MODEL, tokens_in, tokens_out),
    )
