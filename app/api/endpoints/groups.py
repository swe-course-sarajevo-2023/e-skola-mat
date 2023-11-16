from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.api import deps
from app.models import User, Class, UserRole
from app.schemas.requests import ClassCreateRequest
from app.schemas.responses import ClassResponse

router = APIRouter()

@router.get("/classes", response_model=List[ClassResponse])
async def get_all_classes(
     _: User = Depends(deps.RoleCheck([UserRole.PROFESSOR])),
    session: AsyncSession = Depends(deps.get_session),
):
    # Check if the current user is a professor
    """Get all classes"""
    result = await session.execute(select(Class))
    classes = result.scalars().all()
    return classes


@router.post("/classes", response_model=ClassResponse)
async def create_class(
    class_data: ClassCreateRequest,
    _: User = Depends(deps.RoleCheck([UserRole.PROFESSOR])),
    session: AsyncSession = Depends(deps.get_session),
):
    new_class = Class(name=class_data.name)
    session.add(new_class)
    await session.commit()
    await session.refresh(new_class)

    # Return the created class
    return new_class

