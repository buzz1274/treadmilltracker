from fastapi import FastAPI, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from starlette.responses import JSONResponse

from app.core.config import settings
from app.core.lifespan import lifespan
from app.api.main import api_router
from app.middleware.CSRFMiddleware import CSRFMiddleware


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request, exc: RequestValidationError
):
    return JSONResponse(
        status_code=422,
        content=jsonable_encoder(
            {"detail": "\n".join([error["msg"] for error in exc.errors()])}
        ),
    )


# noinspection PyTypeChecker
# app.add_middleware(CSRFMiddleware)  # ty: ignore[invalid-argument-type]

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
