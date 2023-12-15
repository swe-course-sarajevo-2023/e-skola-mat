from pathlib import Path
from uuid import uuid4

from app.api import deps
from app.models import Image, taskUserHomeworkImage
from fastapi import APIRouter, Depends, HTTPException, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent.parent
IMAGES_DIR = BASE_DIR / "images"


@router.post("/upload/")
async def upload_file(
    file: UploadFile,
    task_user_homework_id: str,  # da znamo kojem tasku slika pripada
    db: AsyncSession = Depends(deps.get_session),
):
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    unique_filename = str(uuid4())
    file_path = IMAGES_DIR / unique_filename
    with file_path.open("wb") as buffer:
        buffer.write(await file.read())

    new_image = Image(filename=file.filename, file_path=str(file_path))
    db.add(new_image)
    await db.commit()

    task_image = taskUserHomeworkImage(
        image_path=str(file_path),
        image_id=new_image.id,
        task_user_homework_id=task_user_homework_id,
    )
    db.add(task_image)

    # Postavljanje originalImageID na ID same slike jer je ovo original
    new_image.originalImageID = new_image.id
    await db.commit()
    return {"image_id": str(new_image.id), "filename": file.filename}


@router.post("/edit-image/")
async def edit_image(
    file: UploadFile,
    original_image_id: str,
    db: AsyncSession = Depends(deps.get_session),
):
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    unique_filename = str(uuid4())
    file_path = IMAGES_DIR / unique_filename
    with file_path.open("wb") as buffer:
        buffer.write(await file.read())

    original_image = await db.execute(
        select(taskUserHomeworkImage).where(
            taskUserHomeworkImage.image_id == original_image_id
        )
    )
    original_image = original_image.scalar_one_or_none()

    if original_image is None:
        raise HTTPException(status_code=404, detail="Original image not found")

    new_image = Image(
        filename=file.filename,
        file_path=str(file_path),
        originalImageID=original_image_id,
    )
    db.add(new_image)
    await db.commit()

    task_image = taskUserHomeworkImage(
        image_path=str(file_path),
        image_id=new_image.id,
        task_user_homework_id=original_image.task_user_homework_id,
    )

    db.add(task_image)
    await db.commit()

    return {"image_id": str(new_image.id), "filename": file.filename}


@router.get("/images/{image_id}")
async def read_image(image_id: str, db: AsyncSession = Depends(deps.get_session)):
    image = await db.execute(
        select(taskUserHomeworkImage).where(taskUserHomeworkImage.image_id == image_id)
    )
    image = image.scalar_one_or_none()
    if image is None:
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(Path(image.image_path))


@router.delete("/images/{image_id}")
async def delete_image(image_id: str, db: AsyncSession = Depends(deps.get_session)):
    image = await db.execute(
        select(taskUserHomeworkImage).where(taskUserHomeworkImage.image_id == image_id)
    )
    image = image.scalar_one_or_none()
    if image is None:
        raise HTTPException(status_code=404, detail="Image not found")
    await db.execute(
        delete(taskUserHomeworkImage).where(taskUserHomeworkImage.id == image_id)
    )
    await db.commit()
    file_path = Path(image.image_path)
    if file_path.exists():
        file_path.unlink()
    return {"detail": "Image deleted successfully"}
