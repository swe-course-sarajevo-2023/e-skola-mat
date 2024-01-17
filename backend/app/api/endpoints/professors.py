import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy import delete, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.security import get_password_hash
from app.models import (
    Homework,
    HomeworkUser,
    Role,
    User,
    UserClass,
    UserRole,
    taskUserHomework,
    taskUserHomeworkImage,
)
from app.schemas.requests import (
    ProfessorCommentsHomework,
    ProfessorGradesHomework,
    TaskComment,
    UserCreateRequest,
    UserDeleteRequest,
)
from app.schemas.responses import (
    CommentResponse,
    GradeResponse,
    TaskCommentResponse,
    UserResponse,
)

router = APIRouter()
# #naredne dvije linije nigdje se ne koriste pa cemo ih zakomentraisat da ne prave gresku
# BASE_DIR = Path(__file__).resolve().parent.parent.parent
# IMAGES_DIR = BASE_DIR / "images"


def is_valid_uuid(uuid_str):
    try:
        uuid.UUID(uuid_str)
        return True
    except ValueError:
        return False


@router.post("/register_student", response_model=UserResponse)
async def add_student(
    group_id: str,
    new_student: UserCreateRequest,
    session: AsyncSession = Depends(deps.get_session),
    _: User = Depends(deps.RoleCheck([UserRole.PROFESSOR, UserRole.ADMINISTRATOR])),
):
    email = await session.execute(select(User).where(User.email == new_student.email))
    if email.scalar() is not None:
        raise HTTPException(status_code=400, detail="Cannot use this email address")
    user = User(
        email=new_student.email,
        hashed_password=get_password_hash(new_student.password),
        role_id=select(Role.id).where(Role.role == UserRole.STUDENT),
        name=new_student.name,
        surname=new_student.surname,
    )
    session.add(user)
    await session.commit()

    user_group = UserClass(class_id=group_id, user_id=user.id)
    session.add(user_group)
    await session.commit()
    return user


@router.delete("/delete_student", response_model=UserResponse)
async def delete_student(
    student: UserDeleteRequest,
    session: AsyncSession = Depends(deps.get_session),
    _: User = Depends(deps.RoleCheck([UserRole.PROFESSOR, UserRole.ADMINISTRATOR])),
):
    user = await session.execute(select(User).where(User.email == student.email))
    user = user.scalar()
    if user is None:
        raise HTTPException(status_code=400, detail="This student doesn't exist")
    user_role = await session.execute(select(Role.role).where(Role.id == user.role_id))
    user_role = user_role.scalar()
    user_group = await session.execute(
        select(UserClass).where(UserClass.user_id == user.id)
    )
    if user_role != UserRole.STUDENT:
        raise HTTPException(
            status_code=400, detail="The user connected to given email is not a student"
        )
    if user_group is not None:
        await session.execute(delete(UserClass).where(UserClass.user_id == user.id))
        await session.commit()
    await session.execute(delete(User).where(User.email == student.email))
    await session.commit()
    return JSONResponse(
        content={"detail": "Student deleted successfully"}, status_code=200
    )


@router.get("/list_students/{class_id}", response_model=UserResponse, summary="List Students in a Class",
    description="Retrieves a list of students belonging to a specified class. Accessible only by users with PROFESSOR or ADMINISTRATOR roles. Requires a valid class UUID.",)
async def list_students(
    class_id,
    session: AsyncSession = Depends(deps.get_session),
    _: User = Depends(deps.RoleCheck([UserRole.PROFESSOR, UserRole.ADMINISTRATOR])),
):
    if not is_valid_uuid(class_id):
        raise HTTPException(status_code=400, detail="id is not valid")

    class_users = await session.execute(
        select(UserClass).where(UserClass.class_id == class_id)
    )
    class_users = class_users.scalars().all()

    if len(class_users) == 0:
        raise HTTPException(status_code=204, detail="id does not exist")

    response_data = []
    for class_user in class_users:
        user = await session.execute(select(User).where(User.id == class_user.user_id))
        user = user.scalar()

        response_data.append(
            {
                "name": user.name,
                "surname": user.surname,
                "email": user.email,
            }
        )

    return JSONResponse(content={"data": response_data}, status_code=200)


@router.get("/get_homeworks/{homework_id}", response_model=UserResponse, summary="Get List of Homeworks",
    description="Retrieves a list of all homework tasks for a specific homework, along with student details and grades, accessible to professors and administrators."
)
async def get_homeworks(
    homework_id,
    session: AsyncSession = Depends(deps.get_session),
    _: User = Depends(deps.RoleCheck([UserRole.PROFESSOR, UserRole.ADMINISTRATOR])),
):
    if not is_valid_uuid(homework_id):
        raise HTTPException(status_code=400, detail="id is not valid")

    user_homeworks = await session.execute(
        select(taskUserHomework).where(taskUserHomework.homework_id == homework_id)
    )
    user_homeworks = user_homeworks.scalars().all()
    if len(user_homeworks) == 0:
        raise HTTPException(status_code=400, detail="id does not exist")
    response_data = []
    ids = []

    for user_homework in user_homeworks:
        user = await session.execute(
            select(User).where(User.id == user_homework.user_id)
        )
        user_homework_temp = await session.execute(
            select(HomeworkUser).where(
                HomeworkUser.homework_id == user_homework.homework_id
                and HomeworkUser.user_id == user_homework.user_id
            )
        )
        user_homework_temp = user_homework_temp.scalar()
        user = user.scalar()
        grade = None
        if user_homework_temp is not None:
            grade = user_homework_temp.grade
        if user_homework.user_id not in ids:
            response_data.append(
                {
                    "id": user_homework.id,
                    "user": {
                        "id": user.id,
                        "name": user.name,
                        "surname": user.surname,
                        "username": user.username,
                    },
                    "grade": grade,
                }
            )
        ids.append(user_homework.user_id)

    homework = await session.execute(
        select(Homework).where(Homework.id == user_homeworks[0].homework_id)
    )
    homework = homework.scalar()
    res = {
        "homework": {
            "id": homework.id,
            "name": homework.name,
            "date_of_creation": homework.dateOfCreation.isoformat(),
            "deadline": homework.deadline.isoformat(),
            "number_of_tasks": homework.maxNumbersOfTasks,
        },
        "students": response_data,
    }

    return JSONResponse(content={"data": res}, status_code=200)


@router.get("/get_homework/{task_user_homework_id}", response_model=UserResponse, summary="Get Homework Details",
    description="Retrieves the details of a specific homework task assigned to a student, accessible by professors and administrators."
)
async def get_homework(
    task_user_homework_id,
    session: AsyncSession = Depends(deps.get_session),
    _: User = Depends(deps.RoleCheck([UserRole.PROFESSOR, UserRole.ADMINISTRATOR])),
):
    if not is_valid_uuid(task_user_homework_id):
        raise HTTPException(status_code=400, detail="id is not valid")

    task_user_homework = await session.execute(
        select(taskUserHomework).where(taskUserHomework.id == task_user_homework_id)
    )
    task_user_homework = task_user_homework.scalar()

    if task_user_homework is None:
        raise HTTPException(status_code=400, detail="id does not exist")

    user = await session.execute(
        select(User).where(User.id == task_user_homework.user_id)
    )
    user = user.scalar()
    homework = await session.execute(
        select(Homework).where(Homework.id == task_user_homework.homework_id)
    )
    homework = homework.scalar()
    response_data = {
        "id": task_user_homework.id,
        "user": {
            "id": user.id,
            "name": user.name,
            "surname": user.surname,
            "username": user.username,
        },
        "homework": {
            "id": homework.id,
            "name": homework.name,
            "date_of_creation": homework.dateOfCreation.isoformat(),
            "deadline": homework.deadline.isoformat(),
            "number_of_tasks": homework.maxNumbersOfTasks,
        },
        "order_number_of_task": task_user_homework.order_number_of_the_task,
    }
    return JSONResponse(content={"data": response_data}, status_code=200)


@router.post("/grade_homework", response_model=GradeResponse, summary="Grade Homework",
    description="Allows a professor or an administrator to assign a grade to a student's homework."
)
async def grade_homework(
    grade: ProfessorGradesHomework,
    session: AsyncSession = Depends(deps.get_session),
    _: User = Depends(deps.RoleCheck([UserRole.PROFESSOR, UserRole.ADMINISTRATOR])),
):
    if not is_valid_uuid(grade.user_id) or not is_valid_uuid(grade.homework_id):
        raise HTTPException(status_code=400, detail="ids are not valid")

    homework_user = await session.execute(
        select(HomeworkUser)
        .where(HomeworkUser.user_id == grade.user_id)
        .where(HomeworkUser.homework_id == grade.homework_id)
    )
    homework_user = homework_user.scalar()

    if not homework_user:
        raise HTTPException(
            status_code=400, detail="The user doesn't have that homework"
        )

    homework_user.grade = grade.grade

    await session.commit()
    return homework_user


@router.post("/comment_homework", response_model=CommentResponse, summary="Comment on Homework",
    description="Enables a professor or administrator to add comments or notes to a student's homework."
)
async def comment_homework(
    comment: ProfessorCommentsHomework,
    session: AsyncSession = Depends(deps.get_session),
    _: User = Depends(deps.RoleCheck([UserRole.PROFESSOR, UserRole.ADMINISTRATOR])),
):
    if not is_valid_uuid(comment.user_id) or not is_valid_uuid(comment.homework_id):
        raise HTTPException(status_code=400, detail="ids are not valid")

    homework_user = await session.execute(
        select(HomeworkUser)
        .where(HomeworkUser.user_id == comment.user_id)
        .where(HomeworkUser.homework_id == comment.homework_id)
    )
    homework_user = homework_user.scalar()

    if not homework_user:
        raise HTTPException(
            status_code=400, detail="The user doesn't have that homework"
        )

    homework_user.note = comment.note

    await session.commit()
    return homework_user


@router.post("/comment_homework_task", response_model=TaskCommentResponse, summary="Comment on Homework Task",
    description="Allows a professor or an administrator to add a comment to a student's homework task."
)
async def comment_homework_task(
    comment: TaskComment,
    session: AsyncSession = Depends(deps.get_session),
    _: User = Depends(deps.RoleCheck([UserRole.PROFESSOR, UserRole.ADMINISTRATOR])),
):
    if not is_valid_uuid(comment.task_id):
        raise HTTPException(status_code=400, detail="id is not valid")

    homework_task = await session.execute(
        select(taskUserHomework).where(taskUserHomework.id == comment.task_id)
    )
    homework_task = homework_task.scalar()

    if not homework_task:
        raise HTTPException(
            status_code=400, detail="The user doesn't have that task in that homework"
        )

    homework_task.commentProfessor = comment.comment

    await session.commit()
    return homework_task


@router.post("/comment_homework_task_image", response_model=TaskCommentResponse,  summary="Comment on Homework Task Image",
    description="Allows a professor or an administrator to add a comment to a homework task image."
)
async def comment_homework_task_image(
    comment: TaskComment,
    session: AsyncSession = Depends(deps.get_session),
    _: User = Depends(deps.RoleCheck([UserRole.PROFESSOR, UserRole.ADMINISTRATOR])),
):
    if not is_valid_uuid(comment.task_id):
        raise HTTPException(status_code=400, detail="id is not valid")

    homework_task_image = await session.execute(
        select(taskUserHomeworkImage).where(taskUserHomeworkImage.id == comment.task_id)
    )
    homework_task_image = homework_task_image.scalar()

    if not homework_task_image:
        raise HTTPException(
            status_code=400, detail="The user doesn't have that image for that task"
        )

    homework_task_image.comment_professor = comment.comment

    await session.commit()
    return homework_task_image
