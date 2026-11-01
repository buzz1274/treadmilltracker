from fastapi import APIRouter, status
from starlette.responses import JSONResponse

from app.api.runs import routes as runs_routes
from app.api.auth import routes as auth_routes
from app.api.user import routes as user_routes
from fastapi_utils.cbv import cbv

main_router = APIRouter()


@cbv(main_router)
class MainRouter:
    @main_router.get("/health_check", status_code=status.HTTP_200_OK)
    def main(self) -> JSONResponse:
        return JSONResponse({"message": "ok"})


api_router = APIRouter()
api_router.include_router(runs_routes.router)
api_router.include_router(auth_routes.router)
api_router.include_router(user_routes.router)
api_router.include_router(main_router)


# forced change
