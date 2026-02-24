from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from sqlalchemy.orm.exc import NoResultFound
from app.core.authentication import get_current_user
from fastapi_utils.cbv import cbv
from app.api.runs.models import RunsPublic, RunPublic, PersonalBestsPublic
from app.api.runs.repository import RunsRepository


router = APIRouter(prefix="/runs", tags=["runs"])


@cbv(router)
class RunRouter:
    ERROR_MESSAGE_404: str = "Run not found"

    def __init__(
        self,
        runs_repository: Annotated[RunsRepository, Depends(RunsRepository)],
        user_id: Annotated[int, Depends(get_current_user)],
    ):
        self.runs_repository = runs_repository
        self.user_id = user_id

    @router.get("/", status_code=status.HTTP_200_OK)
    def get_runs(
        self,
        start_date: str | None = None,
        end_date: str | None = None,
        group_by: str = "daily",
    ) -> RunsPublic:
        """retrieve Runs"""
        try:
            return RunsPublic(
                data=self.runs_repository.get_runs(
                    self.user_id, start_date, end_date, group_by
                )
            )
        except NoResultFound:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=self.ERROR_MESSAGE_404,
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            )

    @router.get("/personal_bests", status_code=status.HTTP_200_OK)
    def get_personal_bests(self) -> PersonalBestsPublic:
        """retrieve personal bests"""
        try:
            return PersonalBestsPublic(
                data=self.runs_repository.personal_bests(self.user_id)
            )
        except NoResultFound:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=self.ERROR_MESSAGE_404,
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            )

    @router.post("/", status_code=status.HTTP_201_CREATED)
    def post(self, run: RunPublic) -> None:
        """create a run"""
        try:
            self.runs_repository.add_run(self.user_id, run)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            )

    @router.patch("/", status_code=status.HTTP_200_OK)
    def patch(self, run: RunPublic) -> None:
        """update a run"""
        try:
            self.runs_repository.update_run(self.user_id, run)
        except NoResultFound:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=self.ERROR_MESSAGE_404,
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            )

    @router.delete("/{run_id}", status_code=status.HTTP_204_NO_CONTENT)
    def delete(self, run_id: int) -> None:
        """delete a run"""
        try:
            self.runs_repository.delete_run(self.user_id, run_id)
        except (ValueError, NoResultFound):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=self.ERROR_MESSAGE_404,
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            )
