import logging
import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app import db
from app.config import settings
from app.errors import ApiError
from app.routes import ask, billing, me, sessions

logging.basicConfig(level=logging.INFO)

if settings.sentry_dsn:
    import sentry_sdk

    sentry_sdk.init(dsn=settings.sentry_dsn, traces_sample_rate=0.1)


@asynccontextmanager
async def lifespan(_: FastAPI):
    await db.connect()
    yield
    await db.disconnect()


app = FastAPI(title="AITutor API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def request_id_middleware(request: Request, call_next):
    request.state.request_id = uuid.uuid4().hex[:16]
    response = await call_next(request)
    response.headers["X-Request-Id"] = request.state.request_id
    return response


def _envelope(request: Request, status: int, code: str, message: str):
    return JSONResponse(
        status_code=status,
        content={"error": {
            "code": code,
            "message": message,
            "request_id": getattr(request.state, "request_id", None),
        }},
    )


@app.exception_handler(ApiError)
async def api_error_handler(request: Request, exc: ApiError):
    return _envelope(request, exc.status, exc.code, exc.message)


@app.exception_handler(RequestValidationError)
async def validation_handler(request: Request, exc: RequestValidationError):
    return _envelope(request, 422, "VALIDATION_ERROR", str(exc.errors()[:3]))


@app.exception_handler(Exception)
async def unhandled_handler(request: Request, exc: Exception):
    logging.getLogger(__name__).exception("unhandled error")
    return _envelope(request, 500, "INTERNAL", "Something went wrong")


@app.get("/healthz")
async def healthz():
    await db.get_pool().fetchval("select 1")
    return {"ok": True}


app.include_router(ask.router)
app.include_router(sessions.router)
app.include_router(me.router)
app.include_router(billing.router)
