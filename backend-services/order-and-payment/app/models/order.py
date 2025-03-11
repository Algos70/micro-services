"""Order model."""
from sqlalchemy import Column, String, TIMESTAMP, func, Float, Enum
from db.base import Base
from sqlalchemy.orm import relationship
from . import generate_uuid, ALLOWED_STATUSES

class Order(Base):
    __tablename__ = "orders"

    id = Column(String(36), primary_key=True, index=True, default=generate_uuid)
    user_email = Column(String(100), nullable=False, index=True)
    vendor_email = Column(String(100), nullable=False)
    description = Column(String(255))
    order_date = Column(TIMESTAMP, server_default=func.current_timestamp(), nullable=False)
    delivery_date = Column(TIMESTAMP, nullable=True)
    total_price = Column(Float, nullable=False)
    delivery_address = Column(String(255), nullable=False)
    status = Column(Enum(*ALLOWED_STATUSES), nullable=False, default="Pending")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    payment = relationship("Payment", back_populates="order", uselist=False)

    def __init__(self, email: str, vendor_email: str, total_price: float, delivery_address: str,
                 description: str = None, delivery_date = None, status: str = "Pending"):
        """
        Initializes a new Order instance.

        :param email: Email of the customer placing the order.
        :param vendor_email: Email of the vendor fulfilling the order.
        :param total_price: Total price of the order.
        :param delivery_address: Delivery address for the order.
        :param description: Optional description for the order.
        :param delivery_date: Optional scheduled delivery date.
        :param status: Order status (default is "Pending").
        """
        self.email = email
        self.vendor_email = vendor_email
        self.total_price = total_price
        self.delivery_address = delivery_address
        self.description = description
        self.delivery_date = delivery_date
        self.status = status

    def __str__(self):
        """
        Returns a readable string representation of the Order instance.
        """
        return (f"<Order(id={self.id}, email={self.email}, vendor_email={self.vendor_email}, "
                f"total_price={self.total_price}, status={self.status})>")
    