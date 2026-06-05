from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import List
from src.utils.db import get_db
from src.utils.auth import get_current_supplier, get_current_needy
from . import controller, dtos

router = APIRouter(prefix="/food", tags=["Food"])

@router.post("/", response_model=dtos.FoodRead)
def create_listing(
    food_in: dtos.FoodCreate, 
    db: Session = Depends(get_db), 
    s=Depends(get_current_supplier)
):
    """Create a new food listing. Restricted to Suppliers."""
    new_food = controller.create_food(db, food_in, s.id)
    return controller.format_food(new_food)

@router.get("/nearby", response_model=List[dtos.FoodRead])
def list_nearby_food(
    lat: float = Query(...), 
    lon: float = Query(...), 
    radius: float = Query(5000), 
    db: Session = Depends(get_db)
):
    """Search for available food near GPS coordinates. Open to all."""
    foods = controller.get_nearby(db, lat, lon, radius)
    return [controller.format_food(f) for f in foods]

@router.get("/{id}", response_model=dtos.FoodRead)
def get_food_detail(id: int, db: Session = Depends(get_db)):
    """Get details of a specific food item by ID."""
    food = controller.get_food_by_id(db, id)
    return controller.format_food(food)

@router.patch("/{id}", response_model=dtos.FoodRead)
def update_listing(
    id: int, 
    food_in: dtos.FoodUpdate, 
    db: Session = Depends(get_db), 
    s=Depends(get_current_supplier)
):
    """Update a listing. Only the owner (Supplier) can do this."""
    updated_food = controller.update_food(db, id, food_in, s.id)
    return controller.format_food(updated_food)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_listing(
    id: int, 
    db: Session = Depends(get_db), 
    s=Depends(get_current_supplier)
):
    """Delete a listing. Only the owner (Supplier) can do this."""
    controller.delete_food(db, id, s.id)
    return None

@router.post("/{id}/claim", response_model=dtos.FoodRead)
def claim_item(
    id: int, 
    db: Session = Depends(get_db), 
    n=Depends(get_current_needy)
):
    """Claim a food item. Restricted to Needy users (Receivers)."""
    claimed_food = controller.claim_food_item(db, id, n.id)
    return controller.format_food(claimed_food)


# NEW: The Verification Endpoint for OTP feature
@router.post("/{id}/verify", response_model=dtos.FoodRead)
def verify_pickup(
    id: int, 
    code: str = Query(..., min_length=4, max_length=4), 
    db: Session = Depends(get_db), 
    s=Depends(get_current_supplier)
):
    """
    Verify the 4-digit code provided by the receiver. 
    Restricted to the original Supplier.
    """
    verified_food = controller.verify_pickup_logic(db, id, s.id, code)
    return controller.format_food(verified_food)