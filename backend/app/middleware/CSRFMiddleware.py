from typing import Callable

from starlette.requests import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse, Response
from fastapi import status


class CSRFMiddleware(BaseHTTPMiddleware):
    CSRF_ERROR_MESSAGE: str = "CSRF token missing"

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return await call_next(request)

        header_token = request.headers.get("X-CSRF-Token")
        session_token = request.session.get("X-CSRF-Token")

        if (
            not header_token
            or not session_token
            or header_token != session_token
        ):
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content=self.CSRF_ERROR_MESSAGE,
            )

        return await call_next(request)
