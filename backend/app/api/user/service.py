from typing import Annotated
from fastapi import Depends

from app.api.user.models import User
from app.api.user.repository import UserRepository


class UserService:
    def __init__(
        self,
        user_repository: Annotated[UserRepository, Depends(UserRepository)],
    ):
        self.user_repository = user_repository

    def get_or_create(self, email: str, name: str) -> User:
        """get or create a new user"""
        if user := self.user_repository.get_user(email=email):
            return user

        return self.user_repository.create_user(email=email, name=name)
