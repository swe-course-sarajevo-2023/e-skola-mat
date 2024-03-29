import shutil
import json
from datetime import datetime, date
import uuid
from datetime import datetime
from typing import List, Optional
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import JSONResponse, StreamingResponse
from sqlalchemy import and_, delete, desc, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api import deps
from app.core.storage import Client, get_storage_client
from app.models import (
    Class,
    ClassHomework,
    Homework,
    HomeworkStatus,
    HomeworkUser,
    Image,
    User,
    UserClass,
    UserRole,
    taskUserHomework,
    taskUserHomeworkImage,
)
from app.schemas.requests import ClassHomeworkCreateRequest, SubmitTaskRequest
from app.schemas.responses import (
    ClassHomeworkResponse,
    HomeworkResponse,
    HomeworkUserDetailsResponse,
    ReviewedHomeworkResponse,
    taskUserHomeworkImageResponse,
    taskUserHomeworkResponse,
)

router = APIRouter()


def is_valid_uuid(uuid_str):
    try:
        uuid.UUID(uuid_str)
        return True
    except ValueError:
        return False
    


################homework endpointi koje koristi profesor profil


@router.get(
    "/get_homework_data/{id}", response_model=list[HomeworkResponse]
)  ##endpoint koji salje podatke za rutu profesor/profiles/homework/homework_id,
async def get_homework_data(  ##tj. za stranicu gdje profesor pregleda konkretnu zadaću jednog studenta
    id,
    session: AsyncSession = Depends(deps.get_session),
    _: User = Depends(deps.RoleCheck([UserRole.PROFESSOR])),
):
    if not is_valid_uuid(id):
        raise HTTPException(status_code=400, detail="id is not valid")

    homework = await session.execute(select(HomeworkUser).where(HomeworkUser.id == id))
    homework = homework.scalar()

    if not homework:
        raise HTTPException(status_code=204, detail="Homework not found")

    homework2 = await session.execute(
        select(Homework).where(Homework.id == homework.homework_id)
    )
    homework2 = homework2.scalar()

    user = await session.execute(select(User).where(User.id == homework.user_id))
    user = user.scalar()

    tasks = await session.execute(
        select(taskUserHomework)
        .where(
            and_(
                taskUserHomework.user_id == homework.user_id,
                taskUserHomework.homework_id == homework.homework_id,
            )
        )
        .order_by(taskUserHomework.order_number_of_the_task)
    )
    tasks = tasks.scalars().all()

    tasks_data = []
    for task in tasks:
        images = await session.execute(
            select(taskUserHomeworkImage).where(
                taskUserHomeworkImage.task_user_homework_id == task.id
            )
        )
        images = images.scalars().all()
        images2 = []
        for i in images:
            image = await session.execute(select(Image).where(Image.id == i.image_id))
            image = image.scalar()
            images2.append(
                {
                    "id": i.id,
                    "comment_professor": i.comment_professor,
                    "comment_student": i.comment_student,
                    "file_path": image.file_path,
                }
            )
        tasks_data.append(
            {
                "id": task.id,
                "order_num": task.order_number_of_the_task,
                "teacher_comment": task.commentProfessor,
                "student_comment": task.commentStudent,
                "images": images2,
            }
        )

    return JSONResponse(
        content={
            "homework": {
                "id": homework2.id,
                "name": homework2.name,
                "number_of_tasks": homework2.maxNumbersOfTasks,
            },
            "user": {"id": user.id, "name": user.name, "surname": user.surname},
            "data": {
                "grade": homework.grade,
                "comment": homework.note,
                "comment_student": homework.note_student,
            },
            "problems": tasks_data,
        },
        status_code=200,
    )


@router.get(
    "/get_homeworks/{homework_id}", response_model=list[HomeworkResponse]
)  ##sve predate zadaće jedne zadate zadaće za konkretnu grupu, endpoint salje podatke za rutu
async def get_homeworks(  ##profiles/profesor/zadaca/zadaca_id
    homework_id,
    session: AsyncSession = Depends(deps.get_session),
    _: User = Depends(deps.RoleCheck([UserRole.PROFESSOR])),
):
    if not is_valid_uuid(homework_id):
        raise HTTPException(status_code=400, detail="id is not valid")

    homeworks = await session.execute(
        select(HomeworkUser)
        .where(HomeworkUser.homework_id == homework_id)
        .order_by(desc(HomeworkUser.grade))
    )
    homeworks = homeworks.scalars().all()

    response_data = []
    homework = await session.execute(select(Homework).where(Homework.id == homework_id))
    homework = homework.scalar()
    for h in homeworks:
        user = await session.execute(select(User).where(User.id == h.user_id))
        user = user.scalar()
        response_data.append(
            {
                "id": h.id,
                "grade": h.grade,
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "surname": user.surname,
                    "username": user.username,
                },
            }
        )

    if not homework and not homeworks:
        raise HTTPException(status_code=204, detail="Homeworks not found")

    return JSONResponse(
        content={
            "homework": {
                "id": homework.id,
                "name": homework.name,
                "status": homework.status.name,
            },
            "data": response_data,
        },
        status_code=200,
    )


# Profesor ukoliko pozove bez parametara vraća sve zadaće,
# a sa parametrom samo zadaće da određenu grupu. Endpoint salje podatke za rutu profiles/profesor/grupa/grupa_id
# Student ako pozove sa ili bez parametara uvijek vraća samo za njegovu grupu.
@router.get("/homeworks", response_model=List[HomeworkResponse])
async def get_homeworks(
    class_id: Optional[str] = None,
    current_user: User = Depends(deps.get_current_user),
    session: AsyncSession = Depends(deps.get_session),
):
    if class_id is not None and not is_valid_uuid(class_id):
        raise HTTPException(status_code=400, detail="id is not valid")

    # Initialize the query
    query = select(Homework).order_by(desc(Homework.dateOfCreation))

    # Check if the current user is a student
    if current_user.Role.role.value == UserRole.STUDENT.value:
        # Query the UserClass table to get class IDs for this student
        student_class_query = select(UserClass.class_id).where(
            UserClass.user_id == current_user.id
        )
        student_class_result = await session.execute(student_class_query)
        student_class_id = student_class_result.scalars().one()
        # Modify query to filter homeworks based on these class IDs
        query = query.join(ClassHomework).where(
            ClassHomework.class_id == student_class_id
        )
    elif class_id:
        # If a specific class_id is provided, modify query based on that
        query = query.join(ClassHomework).where(ClassHomework.class_id == class_id)

    result = await session.execute(query)
    homeworks = result.scalars().all()

    if not homeworks:
        raise HTTPException(status_code=204, detail="Homeworks not found")

    current_time = datetime.utcnow()

    for homework in homeworks:
        if (
            homework.status == HomeworkStatus.NOT_STARTED
            and homework.deadline < current_time
        ):
            # Update the status of the homework to indicate that the deadline has passed
            homework.status = HomeworkStatus.IN_PROGRESS
            await session.commit()

    result2 = await session.execute(query)
    homeworks2 = result2.scalars().all()

    return homeworks2


@router.get(
    "", response_model=List[ClassHomeworkResponse]
)  ##endpoint koji se koristi za rutu profiles/profesor/professor-homework, i salje na tu rutu sve zadace svih grupa koje se onda brisu
async def list_all_homeworks(  ##ili se dodaju nove zadace
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


@router.post("", response_model=ClassHomeworkResponse)
async def add_homework(
    new_homework: ClassHomeworkCreateRequest,
    _: User = Depends(deps.RoleCheck([UserRole.PROFESSOR])),
    session: AsyncSession = Depends(deps.get_session),
):
    current_date = datetime.utcnow().date()
    homework = Homework(
        **new_homework.dict(exclude={"groups"}),
        status=HomeworkStatus.NOT_STARTED,
        dateOfCreation=current_date,
    )
    session.add(homework)
    await session.flush()  # Nuzno kako ne bi skipalo par grupa

    group_names = []
    if isinstance(new_homework.groups, str) and new_homework.groups == "all":
        all_groups = await session.execute(select(Class))
        groups = all_groups.scalars().all()
    elif isinstance(new_homework.groups, list):
        group_query = await session.execute(
            select(Class).where(Class.id.in_(new_homework.groups))
        )
        groups = group_query.scalars().all()
        if len(groups) != len(new_homework.groups):
            raise HTTPException(
                status_code=400, detail="One or more groups don't exist."
            )
    else:
        raise HTTPException(status_code=400, detail="Invalid groups input.")

    if not groups:
        raise HTTPException(status_code=400, detail="Groups list is empty.")

    for group in groups:
        class_homework = ClassHomework(homework_id=homework.id, class_id=group.id)
        session.add(class_homework)
        group_names.append(group.id)

    await session.commit()

    return ClassHomeworkResponse(**vars(homework), groups=group_names)


@router.delete("/{homework_id}", status_code=204)
async def delete_homework(
    homework_id: str,
    _: User = Depends(deps.RoleCheck([UserRole.PROFESSOR])),
    session: AsyncSession = Depends(deps.get_session),
):
    if not is_valid_uuid(homework_id):
        raise HTTPException(status_code=400, detail="id is not valid")

    await session.execute(
        delete(ClassHomework).where(ClassHomework.homework_id == homework_id)
    )
    await session.execute(delete(Homework).where(Homework.id == homework_id))
    await session.commit()


@router.patch("/update-homework-status/{homework_id}/{status}")
async def update_homework_status(
    homework_id: str,
    status: str,
    _: User = Depends(deps.RoleCheck([UserRole.PROFESSOR])),
    session: AsyncSession = Depends(deps.get_session),
):
    if not is_valid_uuid(homework_id):
        raise HTTPException(status_code=400, detail="id is not valid")

    # Nadjemo zadacu koju trazimo
    homework_query = await session.execute(
        select(Homework).where(Homework.id == homework_id)
    )

    homework = homework_query.scalar()

    if not homework:
        raise HTTPException(status_code=404, detail="Homework not found")

    if status == "NOT_STARTED":
        homework.status = HomeworkStatus.NOT_STARTED.name
    elif status == "IN_PROGRESS":
        homework.status = HomeworkStatus.IN_PROGRESS.name
    else:
        homework.status = HomeworkStatus.FINISHED.name

    # Spasimo promjene
    await session.commit()

    # return {"message": "Homework status updated successfully"}


##########################################################################################################################################################


@router.get(
    "/get_homework/{user_homework_task_id}", response_model=list[HomeworkResponse]
)
async def get_homework(
    user_homework_task_id,
    session: AsyncSession = Depends(deps.get_session),
    _: User = Depends(deps.RoleCheck([UserRole.ADMINISTRATOR])),
):
    homework = await session.execute(
        select(taskUserHomework).where(taskUserHomework.id == user_homework_task_id)
    )
    homework = homework.scalar()

    if not homework:
        raise HTTPException(status_code=204, detail="Homework not found")

    homework2 = await session.execute(
        select(Homework).where(Homework.id == homework.homework_id)
    )

    homework2 = homework2.scalar()

    user = await session.execute(select(User).where(User.id == homework.user_id))
    user = user.scalar()
    user_homework_temp = await session.execute(
        select(HomeworkUser).where(
            HomeworkUser.homework_id == homework2.id and HomeworkUser.user_id == user.id
        )
    )
    user_homework_temp = user_homework_temp.scalar()

    tasks = await session.execute(
        select(taskUserHomework)
        .where(
            and_(
                taskUserHomework.user_id == homework.user_id,
                taskUserHomework.homework_id == homework.homework_id,
            )
        )
        .order_by(taskUserHomework.order_number_of_the_task)
    )
    tasks = tasks.scalars().all()
    tasks_data = []
    for task in tasks:
        images = await session.execute(
            select(taskUserHomeworkImage).where(
                taskUserHomeworkImage.task_user_homework_id == task.id
            )
        )
        images = images.scalars().all()
        images2 = []
        for i in images:
            image = await session.execute(select(Image).where(Image.id == i.image_id))
            image = image.scalar()

            images2.append(
                {
                    "id": str(image.id),
                    "comment_professor": i.comment_professor,
                    "comment_student": i.comment_student,
                    "file_path": image.file_path,
                }
            )

        tasks_data.append(
            {
                "id": str(task.id),
                "order_num": task.order_number_of_the_task,
                "teacher_comment": task.commentProfessor,
                "student_comment": task.commentStudent,
                "images": images2,
            }
        )

    if user_homework_temp is None:
        return JSONResponse(
            content={
                "homework": {
                    "id": str(homework2.id),
                    "name": homework2.name,
                    "number_of_tasks": homework2.maxNumbersOfTasks,
                },
                "user": {
                    "id": str(user.id),
                    "name": user.name,
                    "surname": user.surname,
                },
                "problems": tasks_data,
                "grade": None,
                "comment_proffesor": None,
                "comment": False,
            },
            status_code=200,
        )

    return JSONResponse(
        content={
            "homework": {
                "id": str(homework2.id),
                "name": homework2.name,
                "number_of_tasks": homework2.maxNumbersOfTasks,
            },
            "user": {"id": str(user.id), "name": user.name, "surname": user.surname},
            "problems": tasks_data,
            "grade": user_homework_temp.grade,
            "comment_proffesor": user_homework_temp.note,
            "comment": user_homework_temp.note is None,
        },
        status_code=200,
    )



@router.get(
    "/get_student_homework_data/{student_id}", response_model=list[HomeworkResponse]
)
async def get_homework_data(
    student_id,
    session: AsyncSession = Depends(deps.get_session),
    _: User = Depends(deps.RoleCheck([UserRole.STUDENT, UserRole.PROFESSOR])),
):
    # print("s id", student_id)
    student_homeworks = await session.execute(
        select(HomeworkUser).where(HomeworkUser.user_id == student_id)
    )

    student_homeworks = student_homeworks.scalars().all()

    if not student_homeworks:
        raise HTTPException(status_code=204, detail="Homeworks not found")

    student_homeworks2 = []
    for homework in student_homeworks:
        homework2 = await session.execute(
            select(Homework).where(Homework.id == homework.homework_id)
        )
        homework2 = homework2.scalar()
        # print(homework2,'hw2')
        # homework2.deadline = json_serial(homework2.deadline)
        student_homeworks2.append(
            {
                "id": homework2.id,
                "name": homework2.name,
                "grade": homework.grade,
                "note": homework.note,
                "number_of_tasks": homework2.maxNumbersOfTasks,
                "deadline": homework2.deadline.date(),
                "status": homework2.status,
            }
        )

    # user = await session.execute(select(User).where(User.id == student_id))
    # user = user.scalar()
    student_homeworks3 = []
    for homework in student_homeworks2:
        # print(homework, "hw loop")
        tasks = await session.execute(
            select(taskUserHomework)
            .where(
                and_(
                    taskUserHomework.user_id == student_id,
                    taskUserHomework.homework_id == homework["id"],
                )
            )
            .order_by(taskUserHomework.order_number_of_the_task)
        )
        tasks = tasks.scalars().all()
        student_homeworks3.append(
            {
                "id": homework["id"],
                "name": homework["name"],
                "grade": homework["grade"],
                "note": homework["note"],
                "number_of_tasks": homework["number_of_tasks"],
                "deadline": homework["deadline"],
                "status": homework["status"].value,
                "tasks": tasks,
            }
        )

    tasks_data = []
    student_homeworks4 = []
    for homework in student_homeworks3:
        for task in tasks:
            images = await session.execute(
                select(taskUserHomeworkImage).where(
                    taskUserHomeworkImage.task_user_homework_id == task.id
                )
            )
            images = images.scalars().all()
            images2 = []
            for i in images:
                image = await session.execute(
                    select(Image).where(Image.id == i.image_id)
                )
                image = image.scalar()
                images2.append(
                    {
                        "id": i.id,
                        "comment_professor": i.comment_professor,
                        "comment_student": i.comment_student,
                        "file_path": image.file_path,
                    }
                )
            tasks_data.append(
                {
                    "id": task.id,
                    "order_num": task.order_number_of_the_task,
                    "teacher_comment": task.commentProfessor,
                    "student_comment": task.commentStudent,
                    "images": images2,
                }
            )
        # print("TEST")
        json_str_date = json.dumps(homework["deadline"].isoformat())
        # print(json_str_date)
        student_homeworks4.append(
            {
                "id": homework["id"],
                "name": homework["name"],
                "grade": homework["grade"],
                "note": homework["note"],
                "number_of_tasks": homework["number_of_tasks"],
                "deadline": json_str_date,
                "status": homework["status"],
                "tasks": tasks_data,
            }
        )
        tasks_data = []

    print(student_homeworks4, "pred kraj")

    return JSONResponse(content={"data": student_homeworks4}, status_code=200)

@router.get(
    "/get_all_student_homework_data", response_model=list[HomeworkResponse]
)
async def get_homework_data(
    session: AsyncSession = Depends(deps.get_session),
    _: User = Depends(deps.RoleCheck([UserRole.STUDENT, UserRole.PROFESSOR])),
):
    homeworks = await session.execute(select(Homework))
    homeworks = homeworks.scalars().all()
    # print(homeworks)

    homeworks_serialized = []
    for homework in homeworks:
        json_str_date = json.dumps(homework.deadline.date().isoformat())
        homeworks_serialized.append({
            "id": homework.id,
            "name": homework.name,
            "dateOfCreation": homework.dateOfCreation,
            "number_of_tasks": homework.maxNumbersOfTasks,
            "deadline": json_str_date,
            "status": homework.status.value,
        })

    # print("hws", homeworks_serialized)

    return JSONResponse(content={"data": homeworks_serialized}, status_code=200)



@router.get(
    "/{homework_id}/homework-user/{homework_user_id}",
    response_model=Optional[HomeworkUserDetailsResponse],
)
async def get_homework_user_details(
    homework_id: str,
    homework_user_id: str,
    current_user: User = Depends(
        deps.RoleCheck([UserRole.PROFESSOR, UserRole.ADMINISTRATOR, UserRole.STUDENT])
    ),
    session: AsyncSession = Depends(deps.get_session),
):
    query = select(HomeworkUser).where(
        HomeworkUser.user_id == homework_user_id,
        HomeworkUser.homework_id == homework_id,
    )
    result = await session.execute(query)
    homework_user = result.scalar()
    if not homework_user:
        return None
    # ovo je nuzno da vidimo da li student zeli da cita tuđu zadaću
    if (
        current_user.Role.role.value != "profesor"
        and homework_user.user_id != current_user.id
    ):
        raise HTTPException(
            status_code=403, detail="Nemate pravo pristupa tudjoj zadaci"
        )

    query = (
        select(taskUserHomework)
        .where(
            taskUserHomework.user_id == homework_user.user_id,
            taskUserHomework.homework_id == homework_id,
        )
        .options(selectinload(taskUserHomework.images))
    )

    result = await session.execute(query)
    task_user_homeworks = result.scalars().all()

    task_user_homework_responses = []
    for pu_homework in task_user_homeworks:
        image_responses = [
            taskUserHomeworkImageResponse(
                id=image.id,
                image_path=image.image_path,
                comment_professor=image.comment_professor,
                comment_student=image.comment_student,
            )
            for image in pu_homework.images
        ]

        pu_homework_response = taskUserHomeworkResponse(
            id=pu_homework.id,
            order_number_of_the_task=pu_homework.order_number_of_the_task,
            commentProfessor=pu_homework.commentProfessor,
            commentStudent=pu_homework.commentStudent,
            images=image_responses,
        )

        task_user_homework_responses.append(pu_homework_response)

    homework_user_response = HomeworkUserDetailsResponse(
        id=homework_user.id,
        user_id=homework_user.user_id,
        grade=homework_user.grade,
        note=homework_user.note,
        note_user=homework_user.note_student,
        tasks=task_user_homework_responses,
    )

    return homework_user_response


@router.post("/submit-task/{homework_id}/task/{task_number}")
async def submit_task(
    homework_id: str,
    task_number: int,
    task_comment: str = Form(...),
    images: List[UploadFile] = File(...),
    session: AsyncSession = Depends(deps.get_session),
    storage_client: Client = Depends(get_storage_client),
    current_user: User = Depends(deps.get_current_user),
):
    homework_query = await session.execute(
        select(Homework).where(Homework.id == homework_id)
    )
    homework: Homework = homework_query.scalar()
    if not homework:
        raise HTTPException(status_code=404, detail="Homework not found")

    homework_user_query = await session.execute(
        select(HomeworkUser).where(
            HomeworkUser.user_id == current_user.id,
            HomeworkUser.homework_id == homework.id,
        )
    )
    homework_user = homework_user_query.scalars().first()
    if not homework_user:
        new_homework_submission = HomeworkUser(
            user_id=current_user.id,
            homework_id=homework_id,
        )
        session.add(new_homework_submission)
        await session.flush()

    if task_number > homework.maxNumbersOfTasks:
        raise HTTPException(
            status_code=404,
            detail=f"Homework has only {homework.maxNumbersOfTasks} tasks, not {task_number}",
        )

    # Treba naci odgovarajuci task u bazi
    # Te ukoliko ih greskom ima vise, uzeti prvi
    task_query = await session.execute(
        select(taskUserHomework).where(
            taskUserHomework.homework_id == homework_id,
            taskUserHomework.order_number_of_the_task == task_number,
        )
    )
    task = task_query.scalar()
    # Ako smo nasli trazeni task, postaviti da
    if task:
        task.commentStudent = task_comment
        task_user_homework_id = task.id
    else:
        new_task_submission = taskUserHomework(
            user_id=current_user.id,
            homework_id=homework_id,
            order_number_of_the_task=task_number,
            commentStudent=task_comment,
        )
        session.add(new_task_submission)
        await session.flush()
        task_user_homework_id = new_task_submission.id

    for image in images:
        (url, filename) = storage_client.save_image(image)

        single_image = Image(
            filename=filename,
            file_path=url,
            created_at=datetime.now(),
        )
        session.add(single_image)
        await session.flush()  # Flush metoda dodaje ID za ovu instancu \
        # ali nakon sto se doda u bazu

        task_image = taskUserHomeworkImage(
            task_user_homework_id=task_user_homework_id,
            image_id=single_image.id,  # Ovdje vezemo zadatak za sliku
            image_path=url,
        )
        session.add(
            task_image
        )  # Bice adekvatno dodano u bazu jer SQLAlchemy moze skontati
        # po modelu gdje treba da je doda. Odnosno, bice adekvatno namapirana

    await session.commit()
    return {"message": "Homework task submitted successfully"}


@router.get("/homeworks/{homework_id}/task/{task_number}/image/{image_id}")
async def get_task_image(
    homework_id: str,
    task_number: int,
    image_id: str,
    session: AsyncSession = Depends(deps.get_session),
    storage_client: Client = Depends(Client),
    current_user: User = Depends(deps.get_current_user),
):
    image_query = await session.execute(select(Image).where(Image.id == image_id))
    image: Image = image_query.scalar()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    # Vracanje slike kopirano sa https://github.com/TrueFaces/fastapi-test/blob/f5b25291d04b5f1dcf740404b48d5b2055199ee9/app/utils/storage.py#L41
    return StreamingResponse(
        storage_client.get_image(image.file_path),
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename={image.file_path}"},
    )


@router.post("/submit-general-comment/{homework_id}")
async def submit_comment(
    homework_id: str,
    comment: str,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
):
    print(homework_id, comment, "submit general comment")

    homework_user_query = await session.execute(
        select(HomeworkUser).where(
            HomeworkUser.user_id == current_user.id,
            HomeworkUser.homework_id == homework_id,
        )
    )
    homework_user = homework_user_query.scalars().first()
    if not homework_user:
        new_homework_submission = HomeworkUser(
            user_id=current_user.id,
            homework_id=homework_id,
        )
        session.add(new_homework_submission)
        session.flush()

    # Setovanje generalnog komentara komentara
    homework_user.note = comment
    await session.commit()
    return {"message": "General comment submitted successfully"}


@router.post("/submit-comment")
async def submit_comment(
    task_id: str,
    comment: str,
    session: AsyncSession = Depends(deps.get_session),
):
    # Query for the task
    task_query = select(taskUserHomework).where(taskUserHomework.id == task_id)
    result = await session.execute(task_query)
    task = result.scalar()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.commentStudent = comment

    await session.commit()

    return {"message": "Comment submitted successfully"}


@router.get("/reviewed", response_model=List[ReviewedHomeworkResponse])
async def reviewed_homework(
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
):
    results = await session.execute(
        select(HomeworkUser, Homework)
        .join(Homework, HomeworkUser.homework_id == Homework.id)
        .where(HomeworkUser.user_id == current_user.id, HomeworkUser.grade.isnot(None))
    )

    reviewed_homeworks = results.fetchall()

    response_data = []
    for homework_user, homework in reviewed_homeworks:
        response_data.append(
            {
                "id": homework_user.id,
                "homework_id": homework.id,
                "name": homework.name,
                "maxNumbersOfTasks": homework.maxNumbersOfTasks,
                "grade": homework_user.grade,
                "note": homework_user.note,
                "note_student": homework_user.note_student,
                "deadline": homework.deadline.date(),
                "dateOfCreation": homework.dateOfCreation.date(),
                "status": homework.status,
            }
        )

    return response_data


@router.post("/submit-general-student-comment/{homework_id}")
async def submit_comment(
    homework_id: str,
    comment: str,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
):
    homework_user_query = await session.execute(
        select(HomeworkUser).where(
            HomeworkUser.user_id == current_user.id,
            HomeworkUser.homework_id == homework_id,
        )
    )
    homework_user = homework_user_query.scalars().first()
    if not homework_user:
        new_homework_submission = HomeworkUser(
            user_id=current_user.id,
            homework_id=homework_id,
        )
        session.add(new_homework_submission)
        session.flush()

    homework_user.note_student = comment
    await session.commit()
    return {"message": "General comment submitted successfully"}
