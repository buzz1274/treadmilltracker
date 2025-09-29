from datetime import date

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel


class Run(SQLModel, table=True):
    id: int = Field(primary_key=True, index=True)
    user_id: int = Field(foreign_key="user.id")
    user: "User" = Relationship(back_populates="runs")
    distance_m: int = Field(default=0)
    duration_s: int = Field(default=0)
    calories: int = Field(default=0)
    vo2max: int = Field(default=0)
    run_date: date = Field(default="")


class User(SQLModel, table=True):
    id: int = Field(primary_key=True, index=True)
    email: EmailStr = Field(unique=True, index=True)
    full_name: str | None = Field(default=None, max_length=255)
    runs: list[Run] = Relationship(back_populates="user")
