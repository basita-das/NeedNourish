from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime
from typing import Optional

class SupplierBase(BaseModel):
    business_name: str = Field(..., min_length=2)
    email: EmailStr
    phone_number: Optional[str] = None
    address: Optional[str] = None

class SupplierCreate(SupplierBase):
    password: str = Field(..., min_length=8)

class SupplierRead(SupplierBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)