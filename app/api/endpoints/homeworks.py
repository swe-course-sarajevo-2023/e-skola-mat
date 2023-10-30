from fastapi import APIRouter, Depends, HTTPException
from app.api import deps
from app.database import get_db
from app.models import HomeworkUser, ProblemUserHomework, User, Homework
from app.schemas.requests import TaskComment, GeneralComment
from typing import List

router = APIRouter()

async def get_db() -> AsyncSession:

    async_engine = create_async_engine(DATABASE_URL, echo=True)
    AsyncSessionFactory = sessionmaker(
        bind=async_engine, class_=AsyncSession, expire_on_commit=False
    )
    db = AsyncSession(engine)
    try:
        yield db
    finally:
        await db.close()

@router.post("/submit-homework/{homework_id}")
def submit_homework(
    homework_id: str,
    task_comments: List[TaskComment],
    general_comment: GeneralComment,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
):
    # Trazimo bazu
    homework = db.query(Homework).filter(Homework.id == homework_id).first()
    if not homework:
        raise HTTPException(status_code=404, detail="Homework not found")

    # Postavljanje generalnog komentara
    general_comment_text = general_comment.comment
    homework.general_comment = general_comment_text

    # Obrada komentara zadataka
    for task_comment in task_comments:
        task_id = task_comment.task_id
        comment = task_comment.comment

        # Treba naci odgovarajuci task u bazi
        # Te ukoliko ih ima vise, uzeti prvi
        task = db.query(ProblemUserHomework).filter(
            ProblemUserHomework.homework_id == homework_id,
            ProblemUserHomework.id == task_id
        ).first()

        # Ako smo nasli trazeni task, postaviti da
        if task:
            task.commentStudent = comment
        else:
            raise HTTPException(status_code=404, detail="Task not found")

    db.commit()
    return {"message": "Homework submitted successfully"}

@router.post("/submit-comment")
def submit_comment(
    task_id: str,
    comment: str,
    db: Session = Depends(get_db),
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
