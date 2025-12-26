from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from sqlalchemy.orm.exc import NoResultFound
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
        """retrieve Runs"""
        return RunsPublic(
            data=self.runs_repository.get_runs(self.user_id, group_by)
        )

    @router.post("/")
    def post(self) -> None:
        pass

    @router.delete("/{run_id}", status_code=status.HTTP_204_NO_CONTENT)
    def delete(self, run_id: int) -> None:
        """delete a run"""
        try:
            self.runs_repository.delete_run(self.user_id, run_id)

            return
        except (ValueError, NoResultFound):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Run not found"
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            )
