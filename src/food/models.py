import enum
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
from src.utils.db import Base

class FoodStatus(str, enum.Enum):
    AVAILABLE = "available"
    CLAIMED = "claimed"
    REMOVED = "removed"

class FoodCategory(str, enum.Enum):
    BAKERY = "bakery"
    PRODUCE = "produce"
    COOKED_MEALS = "cooked_meals"
    DAIRY = "dairy"
    OTHER = "other"

class Food(Base):
    __tablename__ = "foods"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(Enum(FoodCategory), default=FoodCategory.OTHER)
    location = Column(Geometry(geometry_type='POINT', srid=4326), nullable=False)
    expiry_time = Column(DateTime(timezone=True), nullable=False)
    status = Column(Enum(FoodStatus), default=FoodStatus.AVAILABLE)
    
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("needies.id"), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    supplier = relationship("Supplier", back_populates="posted_foods")
    receiver = relationship("Needy", back_populates="claimed_foods")