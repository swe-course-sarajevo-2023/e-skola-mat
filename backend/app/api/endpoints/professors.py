import uuid

from app.core.security import get_password_hash
from app.models import (
    Homework,
    HomeworkUser,
    Role,
    User,
    UserClass,
    UserRole,
    taskUserHomework,
)
from app.schemas.requests import (
    ProfessorCommentsHomework,
    ProfessorGradesHomework,
    UserCreateRequest,
    UserDeleteRequest,
)
from app.schemas.responses import GradeResponse, UserResponse
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy import delete, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps

router = APIRouter()


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
        surname=new_student.surname
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


@router.get("/list_students/{class_id}", response_model=UserResponse)
async def list_students(
    class_id,
    session: AsyncSession = Depends(deps.get_session),
    _: User = Depends(deps.RoleCheck([UserRole.PROFESSOR, UserRole.ADMINISTRATOR])),
):
    if not is_valid_uuid(class_id):
        raise HTTPException(status_code=204, detail="id is not valid")

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


@router.get("/get_homeworks/{homework_id}", response_model=UserResponse)
async def get_homeworks(
    homework_id,
    session: AsyncSession = Depends(deps.get_session),
    _: User = Depends(deps.RoleCheck([UserRole.PROFESSOR, UserRole.ADMINISTRATOR])),
):
    if not is_valid_uuid(homework_id):
        raise HTTPException(status_code=400, detail="id is not valid")

    task_user_homeworks = await session.execute(
        select(taskUserHomework).where(taskUserHomework.homework_id == homework_id)
    )
    task_user_homeworks = task_user_homeworks.scalars().all()

    if len(task_user_homeworks) == 0:
        raise HTTPException(status_code=400, detail="id does not exist")

    response_data = []
    for task_user_homework in task_user_homeworks:
        user = await session.execute(
            select(User).where(User.id == task_user_homework.user_id)
        )
        user = user.scalar()
        homework = await session.execute(
            select(Homework).where(Homework.id == task_user_homework.homework_id)
        )
        homework = homework.scalar()
        response_data.append(
            {
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
        )

    return JSONResponse(content={"data": response_data}, status_code=200)


@router.get("/get_homework/{task_user_homework_id}", response_model=UserResponse)
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


@router.post("/comment_homework", response_model=UserResponse)
async def comment_homework(
    comment: ProfessorCommentsHomework,
    session: AsyncSession = Depends(deps.get_session),
    _: User = Depends(deps.RoleCheck([UserRole.PROFESSOR, UserRole.ADMINISTRATOR])),
):
    if not is_valid_uuid(comment.id):
        raise HTTPException(status_code=400, detail="id is not valid")

    task_user_homework = await session.execute(
        select(taskUserHomework).where(taskUserHomework.id == comment.id)
    )
    task_user_homework = task_user_homework.scalar()
    if not task_user_homework:
        raise HTTPException(status_code=400, detail="That homework does not exist")

    await session.execute(
        update(taskUserHomework)
        .where(taskUserHomework.id == comment.id)
        .values(commentProfessor=comment.comment)
    )

    return JSONResponse(
        content={"detail": "Successfully added a comment"}, status_code=200
    )


@router.post("/grade_homework", response_model=GradeResponse)
async def grade_homework(
    grade: ProfessorGradesHomework,
    session: AsyncSession = Depends(deps.get_session),
    _: User = Depends(deps.RoleCheck([UserRole.PROFESSOR, UserRole.ADMINISTRATOR])),
):
    if not is_valid_uuid(grade.user_id) or not is_valid_uuid(grade.homework_id):
        raise HTTPException(status_code=400, detail="id is not valid")

    homework = await session.execute(
        select(Homework).where(Homework.id == grade.homework_id)
    )
    homework = homework.scalar()
    if not homework:
        raise HTTPException(status_code=400, detail="That homework does not exist")

    user = await session.execute(select(User).where(User.id == grade.user_id))
    user = user.scalar()
    if not user:
        raise HTTPException(status_code=400, detail="That user does not exist")

    homework_user = HomeworkUser(
        user_id=user.id, homework_id=homework.id, grade=grade.grade, note=grade.note
    )
    session.add(homework_user)
    await session.commit()
    return homework_user
