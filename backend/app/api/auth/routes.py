from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi_utils.cbv import cbv
from app.api.auth.service import AuthService
from app.api.auth.models import GoogleAuthRequest, AuthResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@cbv(router)
class AuthRouter:
    def __init__(
        self,
        auth_service: Annotated[AuthService, Depends(AuthService)],
    ):
        self.auth_service = auth_service

    @router.post("/login")
    async def auth(self, payload: GoogleAuthRequest):
        """authenticate credentials"""
        return AuthResponse(
            token=await self.auth_service.authenticate(payload.credential)
        )
