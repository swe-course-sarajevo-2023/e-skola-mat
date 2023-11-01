from fastapi import APIRouter

from app.api.endpoints import auth, users,homework

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(homework.router, prefix="/homework", tags=["homeworks"])
