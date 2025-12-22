import secrets
from fastapi import APIRouter, Request
from fastapi_utils.cbv import cbv

router = APIRouter(prefix="/auth", tags=["auth"])


@cbv(router)
class AuthRouter:
    @router.get("/csrf")
    def get_csrf_token(self, request: Request) -> str:
        """retrieve csrf token"""

        print(request)
        print(request.session)

        if "csrf_token" not in request.session:
            request.session["csrf_token"] = secrets.token_urlsafe(32)

        return request.session["csrf_token"]
