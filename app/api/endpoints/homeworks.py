from datetime import datetime
import shutil
from uuid import uuid4

from fastapi import APIRouter, File, UploadFile, Depends, HTTPException
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.models import Homework, Class, ClassHomework, User, ProblemUserHomework, ProblemUserHomeworkImage, Image, HomeworkStatus, UserRole
from app.schemas.responses import ClassHomeworkResponse
from app.schemas.requests import TaskComment, GeneralComment, ClassHomeworkCreateRequest
from typing import List
from datetime import datetime
from uuid import UUID

router = APIRouter()

@router.get("/", response_model=List[ClassHomeworkResponse])
async def list_all_homeworks(
    _: User = Depends(deps.RoleCheck([UserRole.PROFESSOR])),
    session: AsyncSession = Depends(deps.get_session),
    ):
    result = await session.execute(
            select(Homework, ClassHomework.class_id.label("group_id"))
            .select_from(Homework)
            .join(ClassHomework, Homework.id == ClassHomework.homework_id)
        )

    homeworks_map = {}
    for hw, group_id in result.all():
            if hw.id not in homeworks_map:
                homeworks_map[hw.id] = vars(hw).copy()
                homeworks_map[hw.id]["dateOfCreation"] = hw.dateOfCreation.date()
                homeworks_map[hw.id]["deadline"] = hw.deadline.date()
                homeworks_map[hw.id]["groups"] = []
            homeworks_map[hw.id]["groups"].append(group_id)

    return [ClassHomeworkResponse(**data) for data in homeworks_map.values()]

@router.post("/", response_model=ClassHomeworkResponse)
async def add_homework(
    new_homework: ClassHomeworkCreateRequest,
    _: User = Depends(deps.RoleCheck([UserRole.PROFESSOR])),
    session: AsyncSession = Depends(deps.get_session),):
    
    current_date = datetime.utcnow().date()
    homework = Homework(**new_homework.dict(exclude={"groups"}),status=HomeworkStatus.NOT_STARTED,
            dateOfCreation=current_date)
    session.add(homework)
    await session.flush() #Nuzno kako ne bi skipalo par grupa

    group_names = []
    if isinstance(new_homework.groups, str) and new_homework.groups == "all":
        all_groups = await session.execute(select(Class))
        groups = all_groups.scalars().all()
    elif isinstance(new_homework.groups, list):
        group_query = await session.execute(select(Class).where(Class.id.in_(new_homework.groups)))
        groups = group_query.scalars().all()
        if len(groups) != len(new_homework.groups):
            raise HTTPException(status_code=400, detail="One or more groups don't exist.")
    else:
        raise HTTPException(status_code=400, detail="Invalid groups input.")
    
    if not groups:
        raise HTTPException(status_code=400, detail="Groups list is empty.")


    for group in groups:
        class_homework = ClassHomework(homework_id=homework.id, class_id=group.id)
        session.add(class_homework)
        group_names.append(group.id)

    await session.commit()

    return ClassHomeworkResponse(
            **vars(homework),
            groups=group_names
        )

@router.delete("/{homework_id}", status_code=204)
async def delete_homework(
    homework_id: str,
    _: User = Depends(deps.RoleCheck([UserRole.PROFESSOR])),
    session: AsyncSession = Depends(deps.get_session),):
    await session.execute(delete(ClassHomework).where(ClassHomework.homework_id == homework_id))
    await session.execute(delete(Homework).where(Homework.id == homework_id))
    await session.commit()

@router.patch("/update-homework-status/{homework_id}/{status}")
async def update_homework_status(
    homework_id: str,
    status: str,
    session: AsyncSession = Depends(deps.get_session),
    _: User = Depends(deps.RoleCheck([])),
):
    # Nadjemo zadacu koju trazimo
    homework_query = await session.execute(select(Homework).where(Homework.id == homework_id))
    homework = homework_query.first()

    if not homework:
        raise HTTPException(status_code=404, detail="Homework not found")

    if status == "not_started":
        homework.status = HomeworkStatus.NOT_STARTED
    elif status == "in_progress":
        homework.status = HomeworkStatus.IN_PROGRESS
    else:
        homework.status = HomeworkStatus.FINISHED

    # Spasimo promjene
    await session.commit()

    return {"message": "Homework status updated successfully"}

@router.post("/submit-homework/{homework_id}/task/{task_number}")
async def submit_homework(
    homework_id: str,
    task_number: int,
    task_comment: str,
    images: List[UploadFile],
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
):
    homework_query = await session.execute(select(Homework).where(Homework.id == homework_id))
    homework: Homework = homework_query.first()
    if not homework:
        raise HTTPException(status_code=404, detail="Homework not found")
    
    if task_number > homework.maxNumbersOfProblems:
        raise HTTPException(status_code=404, detail=f"Homework has only {homework.maxNumbersOfProblems} problems, trying to submit to problem number {task_number}")

    # Treba naci odgovarajuci task u bazi
    # Te ukoliko ih greskom ima vise, uzeti prvi
    task_query = await session.execute(select(ProblemUserHomework).where(
        ProblemUserHomework.homework_id == homework_id,
        ProblemUserHomework.id == task_number
    ))
    task = task_query.first()

    # Ako smo nasli trazeni task, postaviti da
    if task:
        task.commentStudent = task_comment
        problem_user_homework_id = task.id
    else:
        new_task_submission = ProblemUserHomework(
            user_id=current_user.id,
            homework_id=homework_id,
            order_number_of_the_task=task_number,
            commentStudent=task_comment
        )
        session.add(new_task_submission)
        session.flush()
        problem_user_homework_id = new_task_submission.id
    
    for image in images:
        unique_filename = f"{uuid4()}_{image.filename}"
        file_path = f"images/{unique_filename}"

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        single_image = Image(filename=image.filename, file_path=file_path, \
            created_at=datetime.now(),
        )
        session.add(single_image)
        session.flush()  # Flush metoda dodaje ID za ovu instancu \
        # ali nakon sto se doda u bazu

        problem_image = ProblemUserHomeworkImage(
            problem_user_homework_id=problem_user_homework_id,
            image_id=single_image.id, # Ovdje vezemo zadatak za sliku
        )
        session.add(problem_image)  # Bice adekvatno dodano u bazu jer SQLAlchemy moze skontati
        # po modelu gdje treba da je doda. Odnosno, bice adekvatno namapirana

    session.commit()
    return {"message": "Homework problem submitted successfully"}

@router.post(f"/submit-comment")
async def submit_comment(
    task_id: str,
    comment: str,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),  
):
    # Provjeriti ako task postoji
    task_query = await session.execute(select(ProblemUserHomework).where(ProblemUserHomework.id == task_id))
    task = task_query.first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Setovanje tog komentara
    task.commentStudent = comment
    session.commit()
    return {"message": "Comment submitted successfully"}
