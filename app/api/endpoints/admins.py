from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, select
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.security import get_password_hash
from app.models import User, Role, UserRole
from app.schemas.requests import UserCreateRequest, UserUpdatePasswordRequest, UserDeleteRequest
from app.schemas.responses import UserResponse

router = APIRouter()


@router.post("/register_teacher", response_model=UserResponse)
async def add_teacher(
        new_teacher: UserCreateRequest,
        session: AsyncSession = Depends(deps.get_session),
        _: User = Depends(deps.RoleCheck([UserRole.ADMINISTRATOR])),
):

    email = await session.execute(select(User).where(User.email == new_teacher.email))
    if email.scalar() is not None:
        raise HTTPException(status_code=400, detail="Cannot use this email address")

    user = User(
        email=new_teacher.email,
        hashed_password=get_password_hash(new_teacher.password),
        role_id=select(Role.id).where(Role.role == "teacher")
        
    )
    session.add(user)
    await session.commit()
    return user


@router.delete("/delete_teacher", response_model=UserResponse)
async def delete_teacher(
        teacher: UserDeleteRequest,
        session: AsyncSession = Depends(deps.get_session),
        _: User = Depends(deps.RoleCheck([UserRole.ADMINISTRATOR])),
):
    
    user = await session.execute(select(User).where(User.email == teacher.email))
    user = user.scalar()
    if user is None:
        raise HTTPException(status_code=400, detail="This teacher doesn't exist")

    user_role = await session.execute(select(Role.role).where(Role.id == user.role_id))
    user_role = user_role.scalar()
    if user_role != "teacher":
        raise HTTPException(status_code=400, detail="The user connected to given email is not a teacher")

    await session.execute(delete(User).where(User.email == teacher.email))
    await session.commit()
    return JSONResponse(content={"detail": "Teacher deleted successfully"}, status_code=200)
