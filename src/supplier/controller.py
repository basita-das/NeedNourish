from sqlalchemy.orm import Session
from fastapi import HTTPException
from .models import Supplier
from .dtos import SupplierCreate
from src.food.models import Food, FoodStatus
from src.utils.helper import hash_password

def create_supplier(db: Session, supplier_in: SupplierCreate):
    if db.query(Supplier).filter(Supplier.email == supplier_in.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")
    db_supplier = Supplier(
        **supplier_in.model_dump(exclude={"password"}),
        hashed_password=hash_password(supplier_in.password)
    )
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)
    return db_supplier

def get_supplier_dashboard_stats(db: Session, supplier_id: int):
    query = db.query(Food).filter(Food.supplier_id == supplier_id)
    return {
        "total": query.count(),
        "active": query.filter(Food.status == FoodStatus.AVAILABLE).count(),
        "claimed": query.filter(Food.status == FoodStatus.CLAIMED).count()
    }

def get_supplier_inventory(db: Session, supplier_id: int):
    return db.query(Food).filter(Food.supplier_id == supplier_id).all()