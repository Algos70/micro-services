"""Order model."""
from sqlalchemy import Column, Integer, String
from db.base import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String(255))
    status = Column(String(50))