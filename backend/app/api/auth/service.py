from typing import Annotated
from fastapi.security import HTTPAuthorizationCredentials
from fastapi import Depends
from google.oauth2 import id_token
from google.auth.transport import requests
from jose import jwt, JWTError
import datetime

from app.api.user.repository import UserRepository
from app.api.user.models import User
from app.api.user.service import UserService
from app.core.config import settings


class AuthService:
    INVALID_CREDENTIAL_ERROR: str = "Invalid credentials"
    TOKEN_EXPIRY_MINUTES: int = 15
    JWT_ALGORITHM: str = "HS256"

    def __init__(
        self,
        user_service: Annotated[UserService, Depends(UserService)],
        user_repository: Annotated[UserRepository, Depends(UserRepository)],
    ):
        self.user_service = user_service
        self.user_repository = user_repository

    async def authenticate(self, credential: str) -> str:
        """authenticate user with google id token"""
        try:
            user_info = id_token.verify_oauth2_token(
                credential, requests.Request(), settings.GOOGLE_OAUTH2_CLIENT_ID
            )
        except ValueError:
            raise ValueError(self.INVALID_CREDENTIAL_ERROR)

        if (
            not user_info.get("email")
            or not user_info.get("given_name")
            or not user_info.get("email_verified")
        ):
            raise ValueError(self.INVALID_CREDENTIAL_ERROR)

        user = self.user_service.get_or_create(
            user_info.get("email"), user_info.get("given_name")
        )

        return self._create_access_token(user.id)

    def get_authenticated_user(
        self, token: HTTPAuthorizationCredentials
    ) -> User:
        try:
            jwt_payload = jwt.decode(
                token.credentials,
                settings.SESSION_SECRET,
                algorithms=[self.JWT_ALGORITHM],
            )
        except (
            JWTError,
            KeyError,
        ):
            raise RuntimeError(AuthService.INVALID_CREDENTIAL_ERROR)

        user = self.user_repository.get_user(user_id=jwt_payload["user_id"])

        if not user:
            raise RuntimeError(AuthService.INVALID_CREDENTIAL_ERROR)

        return user

    def _create_access_token(self, user_id: int) -> str:
        """create jwt access token for user"""
        payload: dict = {
            "user_id": user_id,
            "exp": self._calculate_token_expiry(),
        }

        return jwt.encode(
            payload, settings.SESSION_SECRET, algorithm=self.JWT_ALGORITHM
        )

    def _calculate_token_expiry(self) -> datetime.datetime:
        """calculate token expiry time"""
        return datetime.datetime.now(datetime.UTC) + datetime.timedelta(
            minutes=self.TOKEN_EXPIRY_MINUTES
        )
