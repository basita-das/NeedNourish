from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime
from typing import Optional

class NeedyBase(BaseModel):
    full_name: str = Field(..., min_length=2)
    email: EmailStr
    phone_number: Optional[str] = None
    address: Optional[str] = None

class NeedyCreate(NeedyBase):
    password: str = Field(..., min_length=8)

class NeedyRead(NeedyBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)