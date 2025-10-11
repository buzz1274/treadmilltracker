from fastapi import APIRouter
from app.api.runs import routes as runs_routes

api_router = APIRouter()
api_router.include_router(runs_routes.router)
