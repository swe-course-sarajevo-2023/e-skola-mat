from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, select, update
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from app.api import deps
from app.core.security import get_password_hash
from app.models import User, Role, Homework, ProblemUserHomework, HomeworkUser
from app.schemas.requests import UserCreateRequest, UserUpdatePasswordRequest, UserDeleteRequest, \
    TeacherCommentsHomework, TeacherGradesHomework
from app.schemas.responses import UserResponse, GradeResponse

router = APIRouter()


def is_valid_uuid(uuid_str):
    try:
        uuid_obj = uuid.UUID(uuid_str)
        return True
    except ValueError:
        return False


@router.post("/register_student", response_model=UserResponse)
async def add_teacher(
        new_student: UserCreateRequest,
        session: AsyncSession = Depends(deps.get_session),
        current_user: User = Depends(deps.get_current_user),
):
    role = await session.execute(select(Role.role).where(Role.id == current_user.role_id))
    role = role.scalar()
    if role not in ["admin", "teacher"]:
        raise HTTPException(status_code=403, detail="Only admins and teachers can add students")

    email = await session.execute(select(User).where(User.email == new_student.email))
    if email.scalar() is not None:
        raise HTTPException(status_code=403, detail="Cannot use this email address")
    user = User(
        email=new_student.email,
        hashed_password=get_password_hash(new_student.password),
        role_id=select(Role.id).where(Role.role == "student")
    )
    session.add(user)
    await session.commit()
    return user


@router.delete("/delete_student", response_model=UserResponse)
async def delete_teacher(
        student: UserDeleteRequest,
        session: AsyncSession = Depends(deps.get_session),
        current_user: User = Depends(deps.get_current_user),
):
    role = await session.execute(select(Role.role).where(Role.id == current_user.role_id))
    role = role.scalar()
    if role not in ["admin", "teacher"]:
        raise HTTPException(status_code=403, detail="Only admins and teachers can delete students")

    user = await session.execute(select(User).where(User.email == student.email))
    user = user.scalar()
    if user is None:
        raise HTTPException(status_code=400, detail="This student doesn't exist")

    user_role = await session.execute(select(Role.role).where(Role.id == user.role_id))
    user_role = user_role.scalar()
    if user_role != "student":
        raise HTTPException(status_code=400, detail="The user connected to given email is not a student")

    await session.execute(delete(User).where(User.email == student.email))
    await session.commit()
    return JSONResponse(content={"detail": "Student deleted successfully"}, status_code=200)


@router.get("/get_homeworks/{homework_id}", response_model=UserResponse)
async def get_homeworks(
        homework_id,
        session: AsyncSession = Depends(deps.get_session),
        current_user: User = Depends(deps.get_current_user),
):
    role = await session.execute(select(Role.role).where(Role.id == current_user.role_id))
    role = role.scalar()
    if role not in ["admin", "teacher"]:
        raise HTTPException(status_code=403, detail="Only admins and teachers can see submited homeworks")

    if not is_valid_uuid(homework_id):
        raise HTTPException(status_code=400, detail="id is not valid")

    problem_user_homeworks = await session.execute(
        select(ProblemUserHomework).where(ProblemUserHomework.homework_id == homework_id))
    problem_user_homeworks = problem_user_homeworks.scalars().all()

    print("OVO", problem_user_homeworks)
    if len(problem_user_homeworks) == 0:
        raise HTTPException(status_code=400, detail="id does not exist")

    response_data = []
    for problem_user_homework in problem_user_homeworks:
        user = await session.execute(select(User).where(User.id == problem_user_homework.user_id))
        user = user.scalar()
        homework = await session.execute(select(Homework).where(Homework.id == problem_user_homework.homework_id))
        homework = homework.scalar()
        response_data.append({
            "id": problem_user_homework.id,
            "user": {"id": user.id, "name": user.name, "surname": user.surname, "username": user.username},
            "homework": {"id": homework.id, "name": homework.name,
                         "date_of_creation": homework.dateOfCreation.isoformat(),
                         "deadline": homework.deadline.isoformat(),
                         "number_of_problems": homework.maxNumbersOfProblems},
            "order_number_of_task": problem_user_homework.order_number_of_the_task
        })

    return JSONResponse(content={"data": response_data}, status_code=200)


@router.get("/get_homework/{problem_user_homework_id}", response_model=UserResponse)
async def get_homeworks(
        problem_user_homework_id,
        session: AsyncSession = Depends(deps.get_session),
        current_user: User = Depends(deps.get_current_user),
):
    role = await session.execute(select(Role.role).where(Role.id == current_user.role_id))
    role = role.scalar()
    if role not in ["admin", "teacher"]:
        raise HTTPException(status_code=403, detail="Only admins and teachers can see submited homeworks")

    if not is_valid_uuid(problem_user_homework_id):
        raise HTTPException(status_code=400, detail="id is not valid")

    problem_user_homework = await session.execute(
        select(ProblemUserHomework).where(ProblemUserHomework.id == problem_user_homework_id))
    problem_user_homework = problem_user_homework.scalar()

    if problem_user_homework is None:
        raise HTTPException(status_code=400, detail="id does not exist")

    user = await session.execute(select(User).where(User.id == problem_user_homework.user_id))
    user = user.scalar()
    homework = await session.execute(select(Homework).where(Homework.id == problem_user_homework.homework_id))
    homework = homework.scalar()
    response_data = {
        "id": problem_user_homework.id,
        "user": {"id": user.id, "name": user.name, "surname": user.surname, "username": user.username},
        "homework": {"id": homework.id, "name": homework.name,
                     "date_of_creation": homework.dateOfCreation.isoformat(),
                     "deadline": homework.deadline.isoformat(),
                     "number_of_problems": homework.maxNumbersOfProblems},
        "order_number_of_task": problem_user_homework.order_number_of_the_task
    }
    return JSONResponse(content={"data": response_data}, status_code=200)


@router.post("/comment_homework", response_model=UserResponse)
async def comment_homework(
        comment: TeacherCommentsHomework,
        session: AsyncSession = Depends(deps.get_session),
        current_user: User = Depends(deps.get_current_user),
):
    role = await session.execute(select(Role.role).where(Role.id == current_user.role_id))
    role = role.scalar()
    if role not in ["admin", "teacher"]:
        raise HTTPException(status_code=403, detail="Only admins and teachers comment homeworks")

    if not is_valid_uuid(comment.id):
        raise HTTPException(status_code=400, detail="id is not valid")

    problem_user_homework = await session.execute(select(ProblemUserHomework)
                                                  .where(ProblemUserHomework.id == comment.id))
    problem_user_homework = problem_user_homework.scalar()
    if not problem_user_homework:
        raise HTTPException(status_code=400, detail="That homework does not exist")

    await session.execute(update(ProblemUserHomework).where(ProblemUserHomework.id == comment.id)
                          .values(commentTeacher=comment.comment))

    return JSONResponse(content={"detail": "Successfully added a comment"}, status_code=200)


@router.post("/grade_homework", response_model=GradeResponse)
async def grade_homework(
        grade: TeacherGradesHomework,
        session: AsyncSession = Depends(deps.get_session),
        current_user: User = Depends(deps.get_current_user),
):
    role = await session.execute(select(Role.role).where(Role.id == current_user.role_id))
    role = role.scalar()
    if role not in ["admin", "teacher"]:
        raise HTTPException(status_code=403, detail="Only admins and teachers grade homeworks")

    if not is_valid_uuid(grade.user_id) or not is_valid_uuid(grade.homework_id):
        raise HTTPException(status_code=400, detail="id is not valid")

    homework = await session.execute(select(Homework).where(Homework.id == grade.homework_id))
    homework = homework.scalar()
    if not homework:
        raise HTTPException(status_code=400, detail="That homework does not exist")

    user = await session.execute(select(User).where(User.id == grade.user_id))
    user = user.scalar()
    if not user:
        raise HTTPException(status_code=400, detail="That user does not exist")

    homework_user = HomeworkUser(
        user_id=user.id,
        homework_id=homework.id,
        grade=grade.grade,
        note=grade.note
    )
    session.add(homework_user)
    await session.commit()
    return homework_user
