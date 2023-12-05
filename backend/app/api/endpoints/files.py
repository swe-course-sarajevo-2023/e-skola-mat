from pathlib import Path

from app.models import taskUserHomeworkImage
from fastapi import APIRouter, Depends, HTTPException, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent.parent
IMAGES_DIR = BASE_DIR / "images"


@router.post("/upload/")
async def upload_file(file: UploadFile, db: AsyncSession = Depends(deps.get_session)):
    file_path = IMAGES_DIR / file.filename
    with file_path.open("wb") as buffer:
        buffer.write(await file.read())  # Dodato await za asinhrono čitanje fajla

    new_image = taskUserHomeworkImage(image_path=str(file_path))
    db.add(new_image)
    await db.commit()

    # Postavljanje originalImageID na ID same slike jer je ovo original
    new_image.originalImageID = new_image.id
    await db.commit()  # Dodatni commit za ažuriranje sa originalImageID

    return {"image_id": str(new_image.id), "filename": file.filename}


@router.get("/images/{image_id}")
async def read_image(image_id: str, db: AsyncSession = Depends(deps.get_session)):
    image = await db.execute(
        select(taskUserHomeworkImage).where(taskUserHomeworkImage.id == image_id)
    )
    image = image.scalar_one_or_none()
    if image is None:
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(Path(image.image_path))


@router.delete("/images/{image_id}")
async def delete_image(image_id: str, db: AsyncSession = Depends(deps.get_session)):
    image = await db.execute(
        select(taskUserHomeworkImage).where(taskUserHomeworkImage.id == image_id)
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
