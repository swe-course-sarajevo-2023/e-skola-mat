from fastapi import APIRouter

from app.api.endpoints import admins, auth, files, groups, homeworks, professors, users

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(groups.router, prefix="/groups", tags=["groups"])
api_router.include_router(homeworks.router, prefix="/homeworks", tags=["homeworks"])
api_router.include_router(admins.router, prefix="/admins", tags=["admins"])
api_router.include_router(professors.router, prefix="/professors", tags=["professors"])

api_router.include_router(files.router, prefix="/files", tags=["files"])
