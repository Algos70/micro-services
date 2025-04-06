import uuid
from pydantic import BaseModel, EmailStr, Field

class ProductSagaState:
    def __init__(self, product_id: str, quantity: int):
        """
        Represents the state of a Product in a Saga.

        :param transaction_id: The unique transaction ID for the Saga.
        :param product_id: The ID of the product.
        :param quantity: The quantity of the product.
        """
        self.transaction_id = str(uuid.uuid4())
        self.product_id = product_id
        self.quantity = quantity

class OrderSagaState:
    def __init__(self, description: str, user_email: str, vendor_email: str, delivery_address: str, payment_method: str, status: str = "Pending", items: list = None):
        """
        Represents the state of an Order in a Saga.

        :param transaction_id: The unique transaction ID for the Saga.
        :param order_id: The ID of the order.
        :param user_email: The email of the user who placed the order.
        :param vendor_email: The email of the vendor fulfilling the order.
        :param delivery_address: The delivery address for the order.
        """
        self.transaction_id = str(uuid.uuid4())
        self.description = description
        self.user_email = user_email
        self.vendor_email = vendor_email
        self.delivery_address = delivery_address
        self.status = status
        self.items = items or []
        self.payment_method = payment_method

    def total_price(self) -> float:
        """
        Calculates the total price of all items.
        Assumes each item has 'quantity' and 'unit_price' attributes.
        """
        return sum(item.quantity * item.unit_price for item in self.items)
class PaymentSagaState:
    def __init__(self, user_email: str, amount: float, payment_method: str, payment_status: str = "Pending", order_id: str = None):
        """
        Represents the state of a Payment in a Saga.

        :param transaction_id: The unique transaction ID for the Saga.
        :param payment_info: The payment information.
        """
        self.transaction_id = str(uuid.uuid4())
        self.user_email = user_email
        self.order_id = order_id
        self.amount = amount
        self.payment_method = payment_method
        self.payment_status = payment_status



class SagaEvent(BaseModel):
    """
    Base class for all Saga events.
    """
    event: str
    data: dict
    