from datetime import datetime, date
from typing import Type

from sqlalchemy import Sequence, Row, func, cast, String, DECIMAL, Select
from sqlalchemy.exc import NoResultFound
from sqlalchemy.sql.functions import Function
from sqlmodel import select, col

from app.api.runs.models import (
    PersonalBests,
    PersonalBestPublic,
    PersonalBestType,
)
from app.api.runs.models import Run, RunPublic
from app.core.repository import Repository


class RunsRepository(Repository):
    def get_run(self, user_id: int, run_id: int | None) -> Type[Run] | None:
        """retrieve a single run"""
        if not run_id:
            return None

        return self.execute_query(
            select(Run).where(Run.user_id == user_id).where(Run.id == run_id)
        ).one()

    def delete_run(self, user_id: int, run_id: int) -> None:
        """delete a single run"""
        run: Type[Run] | None = self.get_run(user_id, run_id)

        if not run:
            raise ValueError("Run not found")

        self.delete(run)

    def add_run(self, user_id: int, run: RunPublic) -> None:
        run: Run = Run(**run.model_dump(exclude={"user_id"}))
        run.user_id = user_id
        run.run_date = self._parse_date(run.run_date)

        self.add(run)

    def update_run(self, user_id: int, updated_run: RunPublic) -> None:
        run: Type[Run] | None = self.get_run(user_id, updated_run.id)

        if not run:
            raise NoResultFound("Run not found")

        run.run_date = self._parse_date(updated_run.run_date)
        run.distance_m = updated_run.distance_m
        run.duration_s = updated_run.duration_s
        run.calories = updated_run.calories
        run.vo2max = int(updated_run.vo2max)

        self.add(run)

    def personal_bests(self, user_id: int) -> list[PersonalBestPublic]:
        """get personal bests for a user, ordered by sort order"""
        personal_best_types = self.execute_query(
            select(PersonalBests)
            .where(PersonalBests.user_id == user_id)
            .order_by(col(PersonalBests.sort_order).asc())
        ).all()

        if not personal_best_types:
            raise NoResultFound("No personal best types found")

        personal_bests = []

        for personal_best_type in personal_best_types:
            personal_bests_public = PersonalBestPublic(
                **personal_best_type.model_dump()
            )
            personal_bests_public.runs = self._get_personal_best_runs(
                user_id,
                personal_best_type.type,
                personal_best_type.min_distance_m,
                personal_best_type.max_distance_m,
            )

            personal_bests.append(personal_bests_public)

        if not personal_bests:
            raise NoResultFound("No personal bests found")

        return personal_bests

    def get_runs(
        self,
        user_id: int,
        start_date: str | None,
        end_date: str | None,
        group_by: str = "daily",
    ) -> Sequence[Row]:
        """get all runs for a user, grouped by daily week, month or year"""
        if group_by == "daily":
            runs: Sequence[Row] = self._get_runs(user_id, start_date, end_date)
        else:
            runs: Sequence[Row] = self._get_grouped_runs(
                user_id, start_date, end_date, group_by
            )

        if not runs:
            raise NoResultFound("No runs found")

        return runs

    def _get_personal_best_runs(
        self,
        user_id: int,
        personal_best_type: str,
        min_distance_m: int | None,
        max_distance_m: int | None,
    ) -> list[RunPublic | None]:
        """get personal best runs for a user, ordered by distance or duration"""
        query: Select = select(Run).where(Run.user_id == user_id).limit(10)

        if max_distance_m:
            query = query.where(col(Run.distance_m) <= max_distance_m)

        if min_distance_m:
            query = query.where(col(Run.distance_m) >= min_distance_m)

        if personal_best_type == PersonalBestType.SPEED:
            query = query.order_by(col(Run.duration_s).asc())

        if personal_best_type == PersonalBestType.DURATION:
            query = query.order_by(col(Run.duration_s).desc())

        if personal_best_type == PersonalBestType.DISTANCE:
            query = query.order_by(col(Run.distance_m).desc())

        return [
            RunPublic(**run.model_dump())
            for run in self.execute_query(query).all()
        ]

    def _parse_date(self, run_date: str | date) -> date:
        """parse date string to date object"""
        if isinstance(run_date, str):
            return datetime.strptime(run_date, "%Y-%m-%d").date()
        else:
            return run_date

    def _get_runs(
        self, user_id: int, start_date: str | None, end_date: str | None
    ) -> Sequence[Row]:
        """get all runs for a user, ordered by date"""
        query: Select = (
            select(Run)
            .where(Run.user_id == user_id)
            .order_by(col(Run.run_date).desc())
        )

        query = self._apply_date_filters(query, start_date, end_date)

        return self.execute_query(query).all()

    def _get_grouped_runs(
        self,
        user_id: int,
        start_date: str | None,
        end_date: str | None,
        group_by: str,
    ) -> Sequence[Row]:
        """get all runs for a user, grouped by daily week,
        month or year, ordered by date"""
        group_filter: Function = self._get_group_filter(group_by)

        # noinspection PyArgumentList
        query: Select = (
            select(  # ty: ignore[no-matching-overload]
                func.sum(Run.duration_s).label("duration_s"),
                func.sum(Run.distance_m).label("distance_m"),
                func.sum(Run.calories).label("calories"),
                cast(group_filter, String).label("run_date"),
                func.round(cast(func.avg(Run.vo2max), DECIMAL), 1).label(
                    "vo2max"
                ),
            )
            .where(Run.user_id == user_id)
            .group_by(group_filter)
            .order_by(group_filter.desc())
        )

        query = self._apply_date_filters(query, start_date, end_date)

        return self.execute_query(query).all()

    def _apply_date_filters(
        self, query: Select, start_date: str | None, end_date: str | None
    ) -> Select:
        """apply date filters to query"""
        if start_date:
            query = query.where(
                col(Run.run_date) >= self._parse_date(start_date)
            )

        if end_date:
            query = query.where(col(Run.run_date) <= self._parse_date(end_date))

        return query

    def _get_group_filter(self, group_by: str) -> Function:
        """get group filter so runs are grouped by daily week, month or year"""
        if group_by == "weekly":
            return func.date(func.date_trunc("week", Run.run_date))
        elif group_by == "monthly":
            return func.concat(
                cast(func.date_part("year", Run.run_date), String),
                "-",
                func.lpad(
                    cast(func.date_part("month", Run.run_date), String), 2, "0"
                ),
            )
        else:
            return func.date_part("year", Run.run_date)
