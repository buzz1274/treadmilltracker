from sqlalchemy import Sequence, Row
from sqlmodel import select, col
from app.api.runs.models import Run
from app.core.database import Repository


class RunsRepository(Repository):
    def get_runs(self, user_id: int) -> Sequence[Row]:
        return self.execute_query(
            select(Run)
            .where(Run.user_id == user_id)
            .order_by(col(Run.run_date).desc())
        ).all()
