from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from src.utils.db import get_db
from src.utils.auth import get_current_supplier
from src.utils.helper import create_access_token, verify_password
from src.food.dtos import FoodRead # Import the FoodRead DTO
from src.food.controller import format_food # Import the formatter
from . import controller, dtos, models


router = APIRouter(prefix="/suppliers", tags=["Suppliers"])

@router.post("/register", response_model=dtos.SupplierRead)
async def register(supplier_in: dtos.SupplierCreate, db: Session = Depends(get_db)):
    return await controller.create_supplier(db, supplier_in)

@router.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.Supplier).filter(models.Supplier.email == form.username).first()
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = create_access_token({"sub": str(user.id), "role": "supplier"})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me/inventory", response_model=List[FoodRead])
def get_my_inventory(
    db: Session = Depends(get_db), 
    current_supplier: models.Supplier = Depends(get_current_supplier)
):
    """
    Returns all food items posted by the currently logged-in supplier.
    """
    # 1. Get raw food models from the database
    inventory = controller.get_supplier_inventory(db, current_supplier.id)
    
    # 2. Format each item to handle the PostGIS binary location
    return [format_food(item) for item in inventory]

@router.get("/me/stats")
def get_my_stats(
    db: Session = Depends(get_db),
    current_supplier: models.Supplier = Depends(get_current_supplier)
):
    """
    Returns dashboard statistics (Total, Active, Claimed) for the supplier.
    """
    return controller.get_supplier_dashboard_stats(db, current_supplier.id)