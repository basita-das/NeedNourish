from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional
from .models import FoodStatus, FoodCategory

class FoodBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: Optional[str] = None
    category: FoodCategory = FoodCategory.OTHER
    expiry_time: datetime

class FoodCreate(FoodBase):
    # We take lat/long separately from the frontend
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)

class FoodUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[FoodCategory] = None
    status: Optional[FoodStatus] = None
    expiry_time: Optional[datetime] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class FoodRead(FoodBase):
    id: int
    status: FoodStatus
    supplier_id: int
    receiver_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # We will map the Geometry point back to these floats in the controller
    latitude: float 
    longitude: float

    model_config = ConfigDict(from_attributes=True)