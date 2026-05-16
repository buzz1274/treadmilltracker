from typing import Optional

from app.core.repository import Repository
from app.api.user.models import User
from sqlmodel import select


class UserRepository(Repository):
    def create_user(self, email: str, name: str):
        """create a new user"""
        return self.add(User(email=email, name=name))

    def get_user(
        self, *, user_id: Optional[int] = None, email: Optional[str] = None
    ):
        """retrieve a user"""
        query = select(User)

        if user_id:
            query = query.where(User.id == user_id)

        if email:
            query = query.where(User.email == email)

        return self.execute_query(query).one_or_none()
