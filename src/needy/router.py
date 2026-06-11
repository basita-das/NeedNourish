from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from src.utils.db import get_db
from src.utils.auth import get_current_needy # Import our auth dependency
from src.food.dtos import FoodRead # Import Food DTO for history
from src.food.controller import format_food # Import the formatter
from . import controller, dtos, models
from src.utils.helper import create_access_token, verify_password

router = APIRouter(prefix="/needies", tags=["Receivers"])

@router.post("/register", response_model=dtos.NeedyRead)
async def register(needy_in: dtos.NeedyCreate, db: Session = Depends(get_db)):
    return await controller.create_needy(db, needy_in)

@router.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.Needy).filter(models.Needy.email == form.username).first()
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = create_access_token({"sub": str(user.id), "role": "needy"})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=dtos.NeedyRead)
def get_my_profile(current_user: models.Needy = Depends(get_current_needy)):
    """
    Returns the profile of the currently logged-in Needy user.
    Used to check if the Access Token is valid.
    """
    return current_user

@router.get("/me/history", response_model=List[FoodRead])
def get_my_history(
    db: Session = Depends(get_db), 
    current_user: models.Needy = Depends(get_current_needy)
):
    """
    Returns a list of all food items successfully claimed by this user.
    """
    # 1. Fetch raw food items from controller
    history = controller.get_needy_history(db, current_user.id)
    
    # 2. Format items to handle PostGIS binary location
    return [format_food(item) for item in history]