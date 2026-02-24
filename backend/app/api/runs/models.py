import decimal
from datetime import date
from enum import Enum

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
    id: int | None = None
    run_date: str | date
    vo2max: decimal.Decimal

    @computed_field
    @property
    def pace(self) -> float:
        if self.distance_m > 0:
            pace: float = round(
                (self.distance_m * 3600) / (self.duration_s * 1000), 2
            )
            return float(f"{pace:.2f}")
        return 0.0


class RunsPublic(SQLModel):
    data: List[RunPublic]


class PersonalBestType(str, Enum):
    DISTANCE = "distance"
    DURATION = "duration"
    SPEED = "speed"


class PersonalBestsBase(SQLModel):
    title: str
    sort_order: int
    type: PersonalBestType
    min_distance_m: int | None = None
    max_distance_m: int | None = None


class PersonalBests(PersonalBestsBase, table=True):
    id: int = Field(primary_key=True, index=True)
    user_id: int = Field(foreign_key="user.id")
    user: "User" = Relationship(back_populates="personal_bests")


class PersonalBestPublic(PersonalBestsBase):
    id: int | None = None
    runs: List[RunPublic] | None = None


class PersonalBestsPublic(SQLModel):
    data: List[PersonalBestPublic]
