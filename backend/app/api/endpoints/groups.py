from typing import List
import uuid

from app.models import Class, User, UserRole
from app.schemas.requests import ClassCreateRequest
from app.schemas.responses import ClassResponse
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps

router = APIRouter()

def is_valid_uuid(uuid_str):
    try:
        uuid.UUID(uuid_str)
        return True
    except ValueError:
        return False

@router.get("/class", response_model=ClassResponse)
async def get_group(
    class_id: str,
    _: User = Depends(deps.RoleCheck([UserRole.PROFESSOR])),
    session: AsyncSession = Depends(deps.get_session),
):
    if not is_valid_uuid(class_id):
        raise HTTPException(status_code=400, detail="id is not valid")
    
    result = await session.execute(select(Class).where(Class.id == class_id))
    class_ = result.scalars().one()
    
    if not class_:
        raise HTTPException(status_code=204, detail="Class not found")
    return class_


@router.get("/groups", response_model=List[ClassResponse])
async def get_all_groups(
    _: User = Depends(deps.RoleCheck([UserRole.PROFESSOR])),
    session: AsyncSession = Depends(deps.get_session),
):
    # Check if the current user is a professor
    """Get all groups"""
    result = await session.execute(select(Class))
    groups = result.scalars().all()
    if not groups:
        raise HTTPException(status_code=204, detail="Classes not found")
    return groups


@router.post("/groups", response_model=ClassResponse)
async def create_group(
    class_data: ClassCreateRequest,
    _: User = Depends(deps.RoleCheck([UserRole.PROFESSOR])),
    session: AsyncSession = Depends(deps.get_session),
):
    class1 = await session.execute(
        select(Class).where(Class.name == class_data.name))
    class1 = class1.scalar()

    if class1:
        raise HTTPException(status_code=409, detail="Class of that name already exists!")
    
    new_class = Class(name=class_data.name)
    session.add(new_class)
    await session.commit()
    await session.refresh(new_class)

    # Return the created class
    return new_class
