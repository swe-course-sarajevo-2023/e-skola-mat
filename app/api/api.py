from fastapi import APIRouter

from app.api.endpoints import auth, users, admins, teachers

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(admins.router, prefix="/admins", tags=["admins"])
api_router.include_router(teachers.router, prefix="/teachers", tags=["teachers"])
