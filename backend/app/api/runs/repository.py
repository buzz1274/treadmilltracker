from datetime import date
from typing import Type

from sqlalchemy import Sequence, Row, func, cast, String, DECIMAL
from sqlalchemy.orm import Mapped
from sqlmodel import select, col
from app.api.runs.models import Run
from app.core.database import Repository


class RunsRepository(Repository):
    def get_run(self, user_id: int, run_id: int) -> Type[Run] | None:
        """retrieve a single run"""
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

    def get_runs(self, user_id: int, group_by: str = "daily") -> Sequence[Row]:
        """get all runs for a user, grouped by daily week, month or year"""
        if group_by == "daily":
            return self._get_runs(user_id)
        else:
            return self._get_grouped_runs(user_id, group_by)

    def _get_runs(self, user_id: int) -> Sequence[Row]:
        """get all runs for a user, ordered by date"""
        return self.execute_query(
            select(Run)
            .where(Run.user_id == user_id)
            .order_by(col(Run.run_date).desc())
        ).all()

    def _get_grouped_runs(self, user_id: int, group_by: str) -> Sequence[Row]:
        """get all runs for a user, grouped by daily week,
        month or year, ordered by date"""
        date_filter: Mapped[date] = self._get_date_filter(group_by)

        # noinspection PyArgumentList
        return self.execute_query(
            select(
                func.sum(Run.duration_s).label("duration_s"),
                func.sum(Run.distance_m).label("distance_m"),
                func.sum(Run.calories).label("calories"),
                cast(date_filter, String).label("run_date"),
                func.round(cast(func.avg(Run.vo2max), DECIMAL), 1).label(
                    "vo2max"
                ),
            )
            .where(Run.user_id == user_id)
            .group_by(date_filter)
            .order_by(date_filter.desc())
        ).all()

    def _get_date_filter(self, group_by: str) -> Mapped[date]:
        """get date filter so runs are grouped by daily week, month or year"""
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
