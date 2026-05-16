from pydantic import EmailStr, field_validator
from sqlmodel import Field, Relationship, SQLModel
from typing import List, TYPE_CHECKING, Optional
from pydantic import BaseModel, ConfigDict
from datetime import date

if TYPE_CHECKING:
    from app.api.runs.models import Run, PersonalBests


class User(SQLModel, table=True):
    id: int = Field(primary_key=True, index=True)
    email: str = Field(unique=True, index=True)
    full_name: Optional[str] = Field(default=None, max_length=255)
    registered_date: date = Field(default=date.today(), nullable=True)
    runs: List["Run"] = Relationship(back_populates="user")
    personal_bests: List["PersonalBests"] = Relationship(back_populates="user")

    @field_validator("email")
    def validate_email(cls, value: str) -> str:
        return EmailStr.validate(value)


class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    full_name: str
    registered_date: date
