from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, select
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.security import get_password_hash
from app.models import User, Role, UserClass
from app.schemas.requests import UserCreateRequest, UserUpdatePasswordRequest, UserDeleteRequest
from app.schemas.responses import UserResponse

router = APIRouter()


@router.post("/register_student/{group_id}", response_model=UserResponse)
async def add_teacher(
        group_id: str,
        new_student: UserCreateRequest,
        session: AsyncSession = Depends(deps.get_session),
        current_user: User = Depends(deps.get_current_user),
):
    role = await session.execute(select(Role.role).where(Role.id == current_user.role_id))
    role = role.scalar()
    if role == "Administrator" or role == "Profesor":
        print("2")
        email = await session.execute(select(User).where(User.email == new_student.email))
        print("3")
        if email.scalar() is not None:
            raise HTTPException(status_code=400, detail="Cannot use this email address")
        user = User(
            email=new_student.email,
            hashed_password=get_password_hash(new_student.password),
            role_id=select(Role.id).where(Role.role == "Student")
        )
        session.add(user)
        await session.commit()

        user_group = UserClass(
            class_id = group_id,
            user_id = user.id
        )
        session.add(user_group)
        await session.commit()
        return user
    else:
        raise HTTPException(status_code=400, detail="Only administrators and teachers can add students")


@router.delete("/delete_student", response_model=UserResponse)
async def delete_teacher(
        student: UserDeleteRequest,
        session: AsyncSession = Depends(deps.get_session),
        current_user: User = Depends(deps.get_current_user),
):
    role = await session.execute(select(Role.role).where(Role.id == current_user.role_id))
    role = role.scalar()
    if role == "Administrator" or role == "Profesor":
        user = await session.execute(select(User).where(User.email == student.email))
        user = user.scalar()
        if user is None:
            raise HTTPException(status_code=400, detail="This student doesn't exist")
        user_role = await session.execute(select(Role.role).where(Role.id == user.role_id))
        user_role = user_role.scalar()
        user_group = await session.execute(select(UserClass).where(UserClass.user_id == user.id))
        if user_role != "Student":
            raise HTTPException(status_code=400, detail="The user connected to given email is not a student")
        if user_group is not None:
            await session.execute(delete(UserClass).where(UserClass.user_id == user.id))
            await session.commit()
        await session.execute(delete(User).where(User.email == student.email))
        await session.commit()
        return JSONResponse(content={"detail": "Student deleted successfully"}, status_code=200)
    else:
        raise HTTPException(status_code=400, detail="Only admins and teachers can delete students")
