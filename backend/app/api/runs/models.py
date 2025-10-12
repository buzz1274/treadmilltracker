from datetime import date

from sqlmodel import Field, Relationship, SQLModel
from pydantic import computed_field

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

    @computed_field
    @property
    def pace(self) -> float:
        if self.distance_m > 0:
            return round((self.distance_m * 3600) / (self.duration_s * 1000), 1)
        return 0.0


class RunsPublic(SQLModel):
    data: List[RunPublic]
