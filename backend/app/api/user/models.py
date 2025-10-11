from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from app.api.runs.models import Run


class User(SQLModel, table=True):
    id: int = Field(primary_key=True, index=True)
    email: EmailStr = Field(unique=True, index=True)
    full_name: str | None = Field(default=None, max_length=255)
    runs: List["Run"] = Relationship(back_populates="user")
