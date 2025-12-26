import secrets
from fastapi import APIRouter, Request
from fastapi_utils.cbv import cbv

router = APIRouter(prefix="/auth", tags=["auth"])


@cbv(router)
class AuthRouter:
    @router.get("/csrf")
    def get_csrf_token(self, request: Request) -> str:
        """retrieve csrf token"""

        print("AUTH ROUTER")
        print(request.session)

        if "X-CSRF-Token" not in request.session:
            request.session["X-CSRF-Token"] = secrets.token_urlsafe(32)

        print("POST CSRF", request.session["X-CSRF-Token"])

        return request.session["X-CSRF-Token"]
