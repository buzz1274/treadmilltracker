from fastapi import APIRouter
from app.api.runs import routes as runs_routes
from app.api.auth import routes as auth_routes

api_router = APIRouter()
api_router.include_router(runs_routes.router)
api_router.include_router(auth_routes.router)
#####
