from datetime import datetime
import shutil
from uuid import uuid4

from fastapi import APIRouter, File, UploadFile, Depends, HTTPException
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session
from app.api import deps
from app.models import Homework, Class, ClassHomework, User, HomeworkStatus, ProblemUserHomework, ProblemUserHomeworkImage, Image, HomeworkUser, ProblemUserHomework, ProblemUserHomeworkImage
from app.schemas.responses import ClassHomeworkResponse, HomeworkUserDetailsResponse, HomeworkResponse, ProblemUserHomeworkImageResponse, ProblemUserHomeworkResponse
from app.schemas.requests import TaskComment, GeneralComment, ClassHomeworkCreateRequest
from typing import List
from uuid import UUID
from sqlalchemy.orm import joinedload
import logging
from fastapi.responses import JSONResponse
from sqlalchemy.orm import selectinload
from sqlalchemy.future import select
from typing import List


router = APIRouter()
@router.get("/homework-user/{homework_user_id}", response_model=HomeworkUserDetailsResponse)
async def get_homework_user_details(
    homework_user_id: str,
    session: AsyncSession = Depends(deps.get_session),
):
    query = select(HomeworkUser).where(HomeworkUser.id == homework_user_id)
    result = await session.execute(query)
    homework_user = result.scalar()

    if not homework_user:
        return None

    query = select(ProblemUserHomework) \
        .where(ProblemUserHomework.user_id == homework_user.user_id) \
        .options(selectinload(ProblemUserHomework.images))
    
    result = await session.execute(query)
    problem_user_homeworks = result.scalars().all()

    problem_user_homework_responses = []
    for pu_homework in problem_user_homeworks:
        image_responses = [
            ProblemUserHomeworkImageResponse(
                id=image.id,
                image_path=image.image_path,
                comment_teacher=image.comment_teacher,
                comment_student=image.comment_student,
            )
            for image in pu_homework.images
        ]

        pu_homework_response = ProblemUserHomeworkResponse(
            id=pu_homework.id,
            order_number_of_the_task=pu_homework.order_number_of_the_task,
            commentTeacher=pu_homework.commentTeacher,
            commentStudent=pu_homework.commentStudent,
            images=image_responses,
        )

        problem_user_homework_responses.append(pu_homework_response)

    homework_user_response = HomeworkUserDetailsResponse(
        id=homework_user.id,
        user_id=homework_user.user_id,
        grade=homework_user.grade,
        note=homework_user.note,
        problems=problem_user_homework_responses,
    )

    return homework_user_response

@router.get("/", response_model=List[ClassHomeworkResponse])
async def list_all_homeworks(
    _: User = Depends(deps.is_professor),
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
    _: User = Depends(deps.is_professor),
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
    _: User = Depends(deps.is_professor),
    session: AsyncSession = Depends(deps.get_session),):
    await session.execute(delete(ClassHomework).where(ClassHomework.homework_id == homework_id))
    await session.execute(delete(Homework).where(Homework.id == homework_id))
    await session.commit()

@router.patch("/update-homework-status/{homework_id}/{status}")
def update_homework_status(
    homework_id: str,
    status: str,
    db: Session = Depends(deps.get_db)
):
    # Nadjemo zadacu koju trazimo
    homework = db.query(Homework).filter(Homework.id == homework_id).first()

    if not homework:
        raise HTTPException(status_code=404, detail="Homework not found")

    if status == "not_started":
        homework.status = HomeworkStatus.NOT_STARTED
    elif status == "in_progress":
        homework.status = HomeworkStatus.IN_PROGRESS
    else:
        homework.status = HomeworkStatus.FINISHED

    # Spasimo promjene
    db.commit()

    return {"message": "Homework status updated successfully"}

@router.post("/submit-homework/{homework_id}")
def submit_homework(
    homework_id: str,
    task_comments: List[TaskComment],
    general_comment: GeneralComment,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    images: List[UploadFile] = File(None),
):
    # Trazimo bazu
    homework = db.query(Homework).filter(Homework.id == homework_id).first()
    if not homework:
        raise HTTPException(status_code=404, detail="Homework not found")

    # Postavljanje generalnog komentara
    general_comment_text = general_comment.comment
    homework.general_comment = general_comment_text

    if images:
        for image in images:
            unique_filename = f"{uuid4()}_{image.filename}"
            file_path = f"images/{unique_filename}"

            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)

            single_image = Image(filename=image.filename, file_path=file_path, \
                created_at=datetime.now(),
            )
            db.add(single_image)
            db.flush()  # Flush metoda dodaje ID za ovu instancu \
            # ali nakon sto se doda u bazu

            problem_image = ProblemUserHomeworkImage(
                problem_user_homework_id=homework_id,  
                image_id=single_image.id, # Ovdje vezemo zadatak za sliku
                # Komentare cemo svakako updateovati dole
            )
            db.add(problem_image)  # Bice adekvatno dodano u bazu jer SQLAlchemy moze skontati
            # po modelu gdje treba da je doda. Odnosno, bice adekvatno namapirana.

    # Updateovanje komentara zadatak
    for task_comment in task_comments:
        task_id = task_comment.task_id
        comment = task_comment.comment

        # Treba naci odgovarajuci task u bazi
        # Te ukoliko ih greskom ima vise, uzeti prvi
        task = db.query(ProblemUserHomework).filter(
            ProblemUserHomework.homework_id == homework_id,
            ProblemUserHomework.id == task_id
        ).first()

        # Ako smo nasli trazeni task, postaviti da
        if task:
            task.commentStudent = comment
        else:
            raise HTTPException(status_code=404, detail="Task not found")

    # Kada submitamo zadacu mijenja se status u finished
    homework.status = HomeworkStatus.FINISHED

    db.commit()
    return {"message": "Homework submitted successfully"}

@router.post(f"/submit-comment")
def submit_comment(
    task_id: str,
    comment: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),  
):
    # Provjeriti ako task postoji
    task = db.query(ProblemUserHomework).filter(ProblemUserHomework.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Setovanje tog komentara
    task.commentStudent = comment
    db.commit()
    return {"message": "Comment submitted successfully"}
