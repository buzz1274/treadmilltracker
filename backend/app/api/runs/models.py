from datetime import date

from sqlmodel import Field, Relationship, SQLModel

from app.api.user.models import User
from typing import List


class RunBase(SQLModel):
    distance_m: int
    duration_s: int
    calories: int
    vo2max: int
    run_date: date


class Run(RunBase, table=True):
    id: int = Field(primary_key=True, index=True)
    user_id: int = Field(foreign_key="user.id")
    user: "User" = Relationship(back_populates="runs")


class RunPublic(RunBase):
    id: int


class RunsPublic(SQLModel):
    data: List[RunPublic]
