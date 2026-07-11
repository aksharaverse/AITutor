"""Embedding adapter — the only file that knows which embedding vendor we use.
Currently Gemini's embedding model at 1024 dims to match vector(1024) in schema.sql."""

import httpx

from app.config import settings

EMBED_MODEL = "gemini-embedding-001"
EMBED_DIM = 1024
_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    f"{EMBED_MODEL}:embedContent"
)


async def embed(text: str, *, task: str = "RETRIEVAL_QUERY") -> list[float]:
    """task: RETRIEVAL_QUERY for questions, RETRIEVAL_DOCUMENT for ingestion."""
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(
            _URL,
            params={"key": settings.gemini_api_key},
            json={
                "content": {"parts": [{"text": text[:8000]}]},
                "taskType": task,
                "outputDimensionality": EMBED_DIM,
            },
        )
        r.raise_for_status()
        return r.json()["embedding"]["values"]


def to_pgvector(vec: list[float]) -> str:
    """asyncpg-friendly pgvector literal."""
    return "[" + ",".join(f"{x:.7f}" for x in vec) + "]"
