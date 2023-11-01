from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.models import Homework, Class, ClassHomework, User
from app.schemas.homework import HomeworkCreateRequest
from app.schemas.homework import HomeworkResponse
from fastapi import HTTPException
from typing import List

router = APIRouter()


async def is_profesor(current_user: User = Depends(deps.get_current_user)):
    if current_user.Role.name != "Profesor" and False:
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user

@router.get("/", response_model=List[HomeworkResponse])
async def list_all_homeworks(
    current_user: User = Depends(is_profesor),
    session: AsyncSession = Depends(deps.get_session),):
    """List all homeworks"""
    result = await session.execute(select(Homework))
    return result.scalars().all()

@router.post("/", response_model=HomeworkResponse)
async def add_homework(
    new_homework: HomeworkCreateRequest,
    current_user: User = Depends(is_profesor),
    session: AsyncSession = Depends(deps.get_session),):
    """Add a new homework"""
    homework = Homework(
        naziv=new_homework.naziv,
        datum_kreiranja=new_homework.datum_kreiranja,
        rok=new_homework.rok,
        maksimalan_broj_zadatak=new_homework.maksimalan_broj_zadatak,
    )
    session.add(homework)
    await session.flush()  
    
    if isinstance(new_homework.groups, str) and new_homework.groups == "all":
        all_groups = await session.execute(select(Class))
        groups = all_groups.scalars().all()
    elif isinstance(new_homework.groups, list):
        groups = await session.execute(select(Class).where(Class.id.in_(new_homework.groups))).scalars().all()
        if len(groups) != len(new_homework.groups):
            raise HTTPException(status_code=400, detail="One or more groups dont exist.")
    else:
        raise HTTPException(status_code=400, detail="Invalid groups input.")
    
    for group in groups:
        class_homework = ClassHomework(Homework_id=homework.id, Class_id=group.id)
        session.add(class_homework)
    
    await session.commit()
    return homework

@router.delete("/{homework_id}", status_code=204)
async def delete_homework(
    homework_id: int,
    current_user: User = Depends(is_profesor),
    session: AsyncSession = Depends(deps.get_session),):
    """Delete a homework"""
    await session.execute(delete(Homework).where(Homework.id == homework_id))
    await session.commit()
