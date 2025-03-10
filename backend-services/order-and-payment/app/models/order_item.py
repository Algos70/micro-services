"""Order item model."""
from sqlalchemy import Column, String, Integer, ForeignKey, Float
from sqlalchemy.orm import relationship
from db.base import Base



class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(String(36), ForeignKey("orders.id"), nullable=False, index=True)
    product_id = Column(String(36), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    unit_price = Column(Float, nullable=False)
    order = relationship("Order", back_populates="items")