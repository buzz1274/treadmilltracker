from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.core.config import settings
from app.core.lifespan import lifespan
from app.api.main import api_router
from app.middleware.CSRFMiddleware import CSRFMiddleware


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# noinspection PyTypeChecker
app.add_middleware(CSRFMiddleware)  # ty: ignore[invalid-argument-type]

# noinspection PyTypeChecker
app.add_middleware(
    CORSMiddleware,  # ty: ignore[invalid-argument-type]
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# noinspection PyTypeChecker
app.add_middleware(
    SessionMiddleware,  # ty: ignore[invalid-argument-type]
    secret_key=settings.SESSION_SECRET,
    https_only=settings.SESSION_COOKIE_SECURE,
    same_site=settings.SESSION_SAME_SITE,
)

app.include_router(api_router, prefix=settings.API_V1_STR)
