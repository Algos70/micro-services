import uuid

class SagaState:
    def __init__(self, order_id: str, status: str, current_step: str, order_data: dict = None, payment_info: dict = None):
        """
        Represents the state of a Saga.

        :param order_id: The ID of the order associated with the Saga.
        :param status: The current status of the Saga (e.g., "AUTH_VERIFIED", "FAILED").
        :param current_step: The current step in the Saga process (e.g., "REDUCE_STOCK").
        :param order_data: Optional data related to the order.
        :param payment_info: Optional payment information.
        """
        self.transaction_id = str(uuid.uuid4())  # Generate a unique transaction ID
        self.order_id = order_id
        self.status = status
        self.current_step = current_step
        self.order_data = order_data or {}
        self.payment_info = payment_info or {}
