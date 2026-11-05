import decimal
from datetime import date

from pydantic_core.core_schema import ValidationInfo

from app.api.runs.enums import PersonalBestType

from sqlalchemy import CheckConstraint
from sqlmodel import Field, Relationship, SQLModel
from pydantic import computed_field, model_validator, ConfigDict

from decimal import Decimal

from app.api.user.models import User
from typing import List, Self


class RunBase(SQLModel):
    distance_m: int = Field(gt=0)
    duration_s: int = Field(gt=0)
    calories: int | None = Field(default=None, nullable=True, gt=0)
    vo2max: int | None = Field(default=None, nullable=True, gt=0)
    run_date: date
    avg_heart_rate: int | None = Field(default=None, nullable=True, gt=0)
    max_heart_rate: int | None = Field(default=None, nullable=True, gt=0)
    weight_kg: Decimal | None = Field(
        default=None, max_digits=5, decimal_places=2, nullable=True, gt=0
    )


class Run(RunBase, table=True):
    id: int = Field(primary_key=True, index=True, default=None)
    user_id: int = Field(foreign_key="user.id")
    user: "User" = Relationship(back_populates="runs")

    __table_args__ = (
        CheckConstraint("distance_m > 0", name="distance_m_positive"),
        CheckConstraint("duration_s > 0", name="duration_s_positive"),
        CheckConstraint("calories > 0", name="calories_positive"),
        CheckConstraint("vo2max > 0", name="vo2max_positive"),
        CheckConstraint("avg_heart_rate > 0", name="avg_heart_rate_positive"),
        CheckConstraint("max_heart_rate > 0", name="max_heart_rate_positive"),
        CheckConstraint("weight_kg > 0", name="weight_kg_positive"),
        CheckConstraint(
            "avg_heart_rate <= max_heart_rate", name="heart_rate_range_valid"
        ),
    )


class RunPublic(RunBase):
    model_config = ConfigDict(revalidate_instances="always")

    id: int | None = None
    run_date: str | date
    calories: int | None = Field(default=None, ge=0)
    vo2max: decimal.Decimal

    @model_validator(mode="after")
    def validate_metrics(self, info: ValidationInfo) -> Self:
        existing = (info.context or {}).get("existing")

        if existing is None:
            return self

        for field in (
            "weight_kg",
            "avg_heart_rate",
            "max_heart_rate",
            "calories",
            "vo2max",
        ):
            if (
                getattr(existing, field) is not None
                and getattr(self, field) is None
            ):
                raise ValueError(f"{field} cannot be removed once recorded")

        return self

    @computed_field
    @property
    def pace(self) -> float:
        if self.distance_m > 0:
            pace: float = round(
                (self.distance_m * 3600) / (self.duration_s * 1000), 2
            )
            return float(f"{pace:.2f}")
        return 0.0


class RunUpdate(RunPublic):
    calories: int | None = Field(default=None, gt=0)


class RunCreate(RunUpdate):
    avg_heart_rate: int
    max_heart_rate: int
    weight_kg: Decimal = Field(max_digits=5, decimal_places=2)


class RunsPublic(SQLModel):
    data: List[RunPublic]


class PersonalBestsBase(SQLModel):
    title: str
    sort_order: int
    type: PersonalBestType
    min_distance_m: int | None = None
    max_distance_m: int | None = None
    max_duration_s: int | None = None


class PersonalBests(PersonalBestsBase, table=True):
    id: int = Field(primary_key=True, index=True)
    user_id: int = Field(foreign_key="user.id")
    user: "User" = Relationship(back_populates="personal_bests")


class PersonalBestPublic(PersonalBestsBase):
    id: int | None = None
    runs: List[RunPublic] | None = None


class PersonalBestsPublic(SQLModel):
    data: List[PersonalBestPublic]
