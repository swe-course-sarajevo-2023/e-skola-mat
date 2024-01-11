from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.security import get_password_hash
from app.models import Role, User, UserRole
from app.schemas.requests import UserCreateRequest, UserDeleteRequest
from app.schemas.responses import UserResponse

router = APIRouter()


@router.post("/register_profesor", response_model=UserResponse)
async def add_profesor(
    new_profesor: UserCreateRequest,
    session: AsyncSession = Depends(deps.get_session),
    _: User = Depends(deps.RoleCheck([UserRole.ADMINISTRATOR])),
):
    email = await session.execute(select(User).where(User.email == new_profesor.email))
    if email.scalar() is not None:
        raise HTTPException(status_code=400, detail="Cannot use this email address")

    user = User(
        email=new_profesor.email,
        hashed_password=get_password_hash(new_profesor.password),
        role_id=select(Role.id).where(Role.role == UserRole.PROFESSOR),
    )
    session.add(user)
    await session.commit()
    return user


@router.delete("/delete_profesor", response_model=UserResponse)
async def delete_profesor(
    profesor: UserDeleteRequest,
    session: AsyncSession = Depends(deps.get_session),
    _: User = Depends(deps.RoleCheck([UserRole.ADMINISTRATOR])),
):
    user = await session.execute(select(User).where(User.email == profesor.email))
    user = user.scalar()
    if user is None:
        raise HTTPException(status_code=400, detail="This professor doesn't exist")

    user_role = await session.execute(select(Role.role).where(Role.id == user.role_id))
    user_role = user_role.scalar()
    if user_role != UserRole.PROFESSOR:
        raise HTTPException(
            status_code=400,
            detail="The user connected to given email is not a profesor",
        )

    await session.execute(delete(User).where(User.email == profesor.email))
    await session.commit()
    return JSONResponse(
        content={"detail": "Profesor deleted successfully"}, status_code=200
    )
