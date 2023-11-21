"""
SQL Alchemy models declaration.
https://docs.sqlalchemy.org/en/14/orm/declarative_styles.html#example-two-datagroups-with-declarative-table
Dataclass style for powerful autocompletion support.

https://alembic.sqlalchemy.org/en/latest/tutorial.html
Note, it is used by alembic migrations logic, see `alembic/env.py`

Alembic shortcuts:
# create migration
alembic revision --autogenerate -m "migration_name"

# apply all migrations
alembic upgrade head
"""
import uuid
from enum import Enum

from sqlalchemy import TIMESTAMP, Column, DateTime
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy import ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class UserRole(Enum):
    ADMINISTRATOR = "administrator"
    PROFESSOR = "profesor"
    STUDENT = "student"
    TA = "asistent"
    GUEST = "gost"


class Role(Base):
    __tablename__ = "roles"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), primary_key=True, default=lambda _: str(uuid.uuid4())
    )
    role = Column(SQLAlchemyEnum(UserRole, name="user_role_enum"), nullable=False)


class User(Base):
    __tablename__ = "user_model"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), primary_key=True, default=lambda _: str(uuid.uuid4())
    )
    email: Mapped[str] = mapped_column(
        String(254), nullable=False, unique=True, index=True
    )
    role_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("roles.id"), nullable=True
    )
    name = mapped_column(String(100), nullable=True)
    surname = mapped_column(String(100), nullable=True)
    username = mapped_column(String(100), nullable=True)
    Role: Mapped[Role] = relationship("Role", backref="users", lazy="joined")
    hashed_password: Mapped[str] = mapped_column(String(128), nullable=False)


class HomeworkStatus(Enum):
    NOT_STARTED = "not started"
    IN_PROGRESS = "in progress"
    FINISHED = "finished"


class Homework(Base):
    __tablename__ = "homework"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), primary_key=True, default=lambda _: str(uuid.uuid4())
    )
    name = mapped_column(String(100), nullable=True)
    dateOfCreation = mapped_column(TIMESTAMP, nullable=True)
    deadline = mapped_column(TIMESTAMP, nullable=True)
    maxNumbersOfTasks = mapped_column(Integer, nullable=True)
    status = Column(
        SQLAlchemyEnum(HomeworkStatus, name="homeworkstatus"),
        nullable=False,
        default=HomeworkStatus.NOT_STARTED,
    )


class Class(Base):
    __tablename__ = "class"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), primary_key=True, default=lambda _: str(uuid.uuid4())
    )
    name = mapped_column(String(100), nullable=True)


class ClassHomework(Base):
    __tablename__ = "classHomework"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), primary_key=True, default=lambda _: str(uuid.uuid4())
    )
    class_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("class.id"), nullable=True
    )
    homework_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("homework.id"), nullable=True
    )
    Class: Mapped[Class] = relationship("Class", backref="class_homeworks")
    Homework: Mapped[Homework] = relationship("Homework", backref="class_homeworks")


class HomeworkUser(Base):
    __tablename__ = "homework-user"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), primary_key=True, default=lambda _: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("user_model.id"), nullable=True
    )
    homework_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("homework.id"), nullable=True
    )
    grade: Mapped[Integer] = mapped_column(Integer, nullable=True)
    note: Mapped[String] = mapped_column(String(255), nullable=True)

    User: Mapped[User] = relationship("User", backref="homework_users")
    Homework: Mapped[Homework] = relationship("Homework", backref="homework_users")


class taskUserHomework(Base):
    __tablename__ = "task-user-homework"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), primary_key=True, default=lambda _: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("user_model.id"), nullable=True
    )
    homework_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("homework.id"), nullable=True
    )
    order_number_of_the_task: Mapped[Integer] = mapped_column(Integer, nullable=True)
    commentProfessor: Mapped[String] = mapped_column(String(255), nullable=True)
    commentStudent: Mapped[String] = mapped_column(String(255), nullable=True)
    User: Mapped[User] = relationship("User", backref="task_user_homeworks")
    Homework: Mapped[Homework] = relationship("Homework", backref="task_user_homeworks")


class Image(Base):
    __tablename__ = "images"

    id = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True
    )
    filename = mapped_column(String, nullable=False)
    file_path = mapped_column(String, nullable=False)
    created_at = mapped_column(DateTime(timezone=True), server_default=func.now())


class taskUserHomeworkImage(Base):
    __tablename__ = "task-user-homework-image"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), primary_key=True, default=lambda _: str(uuid.uuid4())
    )
    task_user_homework_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("task-user-homework.id"), nullable=True
    )
    image_id = mapped_column(UUID(as_uuid=True), ForeignKey("images.id"), nullable=True)
    comment_professor: Mapped[str] = mapped_column(String(255), nullable=True)
    comment_student: Mapped[str] = mapped_column(String(255), nullable=True)

    # Relationship to the taskUserHomework model
    taskUserHomework: Mapped[taskUserHomework] = relationship(
        "taskUserHomework", backref="images"
    )


class UserClass(Base):
    __tablename__ = "user-class"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), primary_key=True, default=lambda _: str(uuid.uuid4())
    )
    class_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("class.id"), nullable=True
    )
    user_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("user_model.id"), nullable=True
    )

    # Relationships to the Class and User models
    Class: Mapped[Class] = relationship("Class", backref="class_users")
    User: Mapped[User] = relationship("User", backref="class_users")
