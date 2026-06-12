from sqlalchemy.orm import Session
from sqlalchemy import func
from geoalchemy2.shape import to_shape
from geoalchemy2.elements import WKTElement
from fastapi import HTTPException
from .models import Food, FoodStatus

import random

def format_food(food: Food):
    """
    Converts a SQLAlchemy Food object into a dictionary and removes
    binary PostGIS data that crashes FastAPI's JSON encoder.
    """
    shape = to_shape(food.location)
    
    # Create a copy of the attributes
    data = food.__dict__.copy()
    
    data["supplier_name"] = food.supplier.business_name if food.supplier else "Unknown"
    data["receiver_name"] = food.receiver.full_name if food.receiver else None
    
    # REMOVE THE BINARY OBJECTS THAT CAUSE CRASHES
    data.pop("location", None)
    data.pop("_sa_instance_state", None)
    
    # ADD HUMAN READABLE COORDINATES
    data["latitude"] = shape.y
    data["longitude"] = shape.x
    
    return data

def create_food(db: Session, food_in, supplier_id: int):
    point = f'POINT({food_in.longitude} {food_in.latitude})'
    db_food = Food(
        **food_in.model_dump(exclude={"latitude", "longitude"}),
        location=WKTElement(point, srid=4326),
        supplier_id=supplier_id
    )
    db.add(db_food)
    db.commit()
    db.refresh(db_food)
    return db_food

def get_nearby(db: Session, lat, lon, radius):
    user_loc = WKTElement(f'POINT({lon} {lat})', srid=4326)
    return db.query(Food).filter(
        Food.status == FoodStatus.AVAILABLE,
        func.ST_DistanceSphere(Food.location, user_loc) <= radius
    ).all()

def update_food(db: Session, food_id: int, food_in, supplier_id: int):
    food = db.query(Food).filter(Food.id == food_id).first()
    if not food or food.supplier_id != supplier_id:
        raise HTTPException(status_code=403, detail="Permission denied")
    
    # NEW RULE: Cannot edit if already claimed or completed
    if food.status != FoodStatus.AVAILABLE:
        raise HTTPException(status_code=400, detail="Cannot edit an item that is already claimed")
    
    data = food_in.model_dump(exclude_unset=True)
    if "latitude" in data or "longitude" in data:
        lat = data.get("latitude", to_shape(food.location).y)
        lon = data.get("longitude", to_shape(food.location).x)
        food.location = WKTElement(f'POINT({lon} {lat})', srid=4326)
    
    for k, v in data.items():
        if k not in ["latitude", "longitude"]: setattr(food, k, v)
    db.commit()
    db.refresh(food)
    return food

def delete_food(db: Session, food_id: int, supplier_id: int):
    food = db.query(Food).filter(Food.id == food_id).first()
    if not food or food.supplier_id != supplier_id:
        raise HTTPException(status_code=403, detail="Permission denied")
    
    # NEW RULE: Cannot delete if already claimed
    if food.status != FoodStatus.AVAILABLE:
        raise HTTPException(status_code=400, detail="Cannot delete an item that is already claimed")

    db.delete(food)
    db.commit()



def get_food_by_id(db: Session, food_id: int):
    """Standard detail fetcher."""
    food = db.query(Food).filter(Food.id == food_id).first()
    if not food:
        raise HTTPException(status_code=404, detail="Food item not found")
    return food

# UPDATED: Generates a 4-digit code when food is claimed
def claim_food_item(db: Session, food_id: int, needy_id: int):
    food = db.query(Food).filter(Food.id == food_id, Food.status == FoodStatus.AVAILABLE).first()
    if not food:
        raise HTTPException(status_code=400, detail="Item is already claimed or unavailable")
    
    food.status = FoodStatus.CLAIMED
    food.receiver_id = needy_id
    
    # GENERATE 4-DIGIT VERIFICATION CODE
    food.verification_code = str(random.randint(1000, 9999)) 
    
    db.commit()
    db.refresh(food)
    return food

# NEW: Verification logic for the Supplier
def verify_pickup_logic(db: Session, food_id: int, supplier_id: int, input_code: str):
    food = db.query(Food).filter(
        Food.id == food_id, 
        Food.supplier_id == supplier_id
    ).first()
    
    if not food:
        raise HTTPException(status_code=404, detail="Food listing not found")
    
    if food.status != FoodStatus.CLAIMED:
        raise HTTPException(status_code=400, detail="Food is not in claimed state")

    if food.verification_code != input_code:
        raise HTTPException(status_code=400, detail="Invalid verification code")
    
    # Mark as COMPLETED upon correct code
    food.status = FoodStatus.COMPLETED
    db.commit()
    db.refresh(food)
    return food