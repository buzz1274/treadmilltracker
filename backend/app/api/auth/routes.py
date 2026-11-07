from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from fastapi_utils.cbv import cbv
from starlette import status

from app.api.auth.service import AuthService, AuthError
from app.api.auth.models import GoogleAuthRequest, AuthResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@cbv(router)
class AuthRouter:
    ERROR_MESSAGE_401: str = "Unauthorized"

    def __init__(
        self,
        auth_service: Annotated[AuthService, Depends(AuthService)],
    ):
        self.auth_service = auth_service

    @router.post("/login")
    async def auth(self, payload: GoogleAuthRequest):
        """authenticate credentials"""
        try:
            return AuthResponse(
                token=await self.auth_service.authenticate(payload.credential)
            )
        except AuthError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=self.ERROR_MESSAGE_401,
            )
