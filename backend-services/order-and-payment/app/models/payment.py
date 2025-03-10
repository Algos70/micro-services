"""Payment model."""
from sqlalchemy import Column, String, TIMESTAMP, func, Float, Integer, ForeignKey, Enum
from sqlalchemy.orm import relationship
from db.base import Base
from . import PAYMENT_METHODS, PAYMENT_STATUSES, generate_uuid


class Payment(Base):
    __tablename__ = "payments"

    id = Column(String(36), primary_key=True, autoincrement=True, default=generate_uuid)
    order_id = Column(String(36), ForeignKey("orders.id"), nullable=False, unique=True)
    amount = Column(Float, nullable=False)
    payment_method = Column(Enum(*PAYMENT_METHODS), nullable=False) 
    payment_status = Column(Enum(*PAYMENT_STATUSES), nullable=False, default="Pending")
    transaction_id = Column(String(100))
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp(), nullable=False)
    
    order = relationship("Order", back_populates="payment")