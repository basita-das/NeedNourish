from sqlalchemy.orm import Session
from fastapi import HTTPException
from src.utils.mail import send_welcome_email
from .models import Needy
from .dtos import NeedyCreate
from src.food.models import Food
from src.utils.helper import hash_password


async def create_needy(db: Session, needy_in: NeedyCreate):
    if db.query(Needy).filter(Needy.email == needy_in.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")
    db_needy = Needy(
        **needy_in.model_dump(exclude={"password"}),
        hashed_password=hash_password(needy_in.password)
    )
    db.add(db_needy)
    db.commit()
    db.refresh(db_needy)
    await send_welcome_email(db_needy.email, db_needy.full_name, "Needy (Receiver)")
    return db_needy

def get_needy_history(db: Session, needy_id: int):
    return db.query(Food).filter(Food.receiver_id == needy_id).all()