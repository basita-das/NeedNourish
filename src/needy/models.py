from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.utils.db import Base

class Needy(Base):
    __tablename__ = "needies"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    phone_number = Column(String(20), nullable=True)
    address = Column(String(512), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    claimed_foods = relationship("Food", back_populates="receiver")