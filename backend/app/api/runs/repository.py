from datetime import datetime, date
from typing import Type

from sqlalchemy import Sequence, Row, func, cast, String, DECIMAL, Select
from sqlalchemy.exc import NoResultFound
from sqlalchemy.sql.functions import Function
from sqlmodel import select, col

from app.api.runs.models import Run, RunPublic
from app.core.database import Repository


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

        self.database.session.delete(run)
        self.database.session.commit()

    def add_run(self, user_id: int, run: RunPublic) -> None:
        run: Run = Run(**run.model_dump(exclude={"user_id"}))
        run.user_id = user_id
        run.run_date = self._parse_date(run.run_date)

        self.database.session.add(run)
        self.database.session.commit()

    def update_run(self, user_id: int, updated_run: RunPublic) -> None:
        run: Type[Run] | None = self.get_run(user_id, updated_run.id)

        if not run:
            raise NoResultFound("Run not found")

        run.run_date = self._parse_date(updated_run.run_date)
        run.distance_m = updated_run.distance_m
        run.duration_s = updated_run.duration_s
        run.calories = updated_run.calories
        run.vo2max = int(updated_run.vo2max)

        self.database.session.add(run)
        self.database.session.commit()

    def get_runs(
        self,
        user_id: int,
        start_date: str | None,
        end_date: str | None,
        group_by: str = "daily",
    ) -> Sequence[Row]:
        """get all runs for a user, grouped by daily week, month or year"""
        if group_by == "daily":
            return self._get_runs(user_id, start_date, end_date)
        else:
            return self._get_grouped_runs(
                user_id, start_date, end_date, group_by
            )

    def _parse_date(self, run_date: str | date) -> date:
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
