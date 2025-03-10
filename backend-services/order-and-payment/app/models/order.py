"""Order model."""
from sqlalchemy import Column, String, TIMESTAMP, func, Float, Enum
from db.base import Base
from sqlalchemy.orm import relationship
from . import generate_uuid, ALLOWED_STATUSES

class Order(Base):
    __tablename__ = "orders"

    id = Column(String(36), primary_key=True, index=True, default=generate_uuid)
    user_id = Column(String(36), nullable=False)
    vendor_id = Column(String(36), nullable=False)
    description = Column(String(255))
    order_date = Column(TIMESTAMP, server_default=func.current_timestamp(), nullable=False)
    delivery_date = Column(TIMESTAMP, nullable=True)
    total_price = Column(Float, nullable=False)
    delivery_address = Column(String(255), nullable=False)
    status = Column(Enum(*ALLOWED_STATUSES), nullable=False, default="Pending")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    payment = relationship("Payment", back_populates="order", uselist=False)
