"""Payment model."""
from sqlalchemy import Column, String, TIMESTAMP, func, Float, ForeignKey, Enum
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

    def __init__(self, order_id: str, amount: float, payment_method: str, payment_status: str = "Pending", transaction_id: str = None):
        """
        Initializes a new Payment instance.

        :param order_id: Order ID.
        :param amount: Payment amount.
        :param payment_method: Payment method.
        :param payment_status: Payment status (default is "Pending").
        :param transaction_id: Payment transaction ID.
        """
        self.order_id = order_id
        self.amount = amount
        self.payment_method = payment_method
        self.payment_status = payment_status
        self.transaction_id = transaction_id
    
    def __str__(self):
        """
        Returns a readable string representation of the Payment instance.
        """
        return (f"<Payment(id={self.id}, order_id={self.order_id}, amount={self.amount}, "
                f"payment_method={self.payment_method}, payment_status={self.payment_status})>")