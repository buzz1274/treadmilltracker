from typing import Annotated

from fastapi import APIRouter, Depends

from app.core.authentication import get_current_user
from fastapi_utils.cbv import cbv
from app.api.runs.models import RunsPublic
from app.api.runs.repository import RunsRepository

router = APIRouter(prefix="/runs", tags=["runs"])


@cbv(router)
class RunRouter:
    user_id: int = Depends(get_current_user)

    def __init__(
        self,
        runs_repository: Annotated[RunsRepository, Depends(RunsRepository)],
    ):
        self.runs_repository = runs_repository

    @router.get("/")
    def get_runs(self, group_by: str = "daily") -> RunsPublic:
        """Retrieve Runs"""
        return RunsPublic(
            data=self.runs_repository.get_runs(self.user_id, group_by)
        )

    @router.post("/")
    def post(self) -> None:
        pass
