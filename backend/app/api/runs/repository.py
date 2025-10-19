from datetime import date

from sqlalchemy import Sequence, Row, func, cast, String, DECIMAL
from sqlalchemy.orm import Mapped
from sqlmodel import select, col
from app.api.runs.models import Run
from app.core.database import Repository


class RunsRepository(Repository):
    def get_runs(self, user_id: int, group_by: str = "daily") -> Sequence[Row]:
        """get all runs for a user, grouped by daily week, month or year"""
        date_filter = self._get_date_filter(group_by)

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

    def _get_date_filter(self, group_by: str) -> str | Mapped[date]:
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
        elif group_by == "yearly":
            return func.date_part("year", Run.run_date)
        else:
            return col(Run.run_date)
