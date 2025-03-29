"""
Saga Orchestrator
Handles the orchestration of the Saga pattern.
"""# saga_orchestrator.py

"""
TODO: Implement the Saga Orchestrator from scratch. These are just examples.
"""
from services.auth_http_client import AuthHttpClient
from services.message_publisher import RabbitMQPublisher
from models.saga_state import SagaState

class SagaOrchestrator:
    def __init__(self):
        self.auth_client = AuthHttpClient()  # Synchronous calls
        self.publisher = RabbitMQPublisher()  # Publishes to RabbitMQ
        self.saga_store = {}  # In-memory or DB for storing saga states

    def start_order_saga(self, order_id: str, order_data: dict):
        # Step 1: Verify user over HTTP
        verified = self.auth_client.verify_customer(order_data["customer_id"])
        if not verified:
            # End saga immediately
            # Possibly notify the client or publish an 'OrderFailedEvent'
            return False

        # If verified, store saga state
        saga_state = SagaState(
            order_id=order_id,
            status="AUTH_VERIFIED",
            current_step="REDUCE_STOCK",
            order_data=order_data
        )
        self.saga_store[saga_state.transaction_id] = saga_state  # Store by transaction_id

        # Step 2: Publish command to reduce stock
        self.publisher.publish_reduce_stock_command(
            transaction_id=saga_state.transaction_id,  # Include transaction_id
            order_id=order_id,
            product_id=order_data["product_id"],
            quantity=order_data["quantity"]
        )
        return True

    def handle_stock_reduced_event(self, transaction_id: str):
        # Update saga state
        saga_state = self.saga_store.get(transaction_id)
        if not saga_state:
            return  # Not found, or possibly handle error

        saga_state.current_step = "TAKE_PAYMENT"

        # Step 3: Publish "TakePaymentCommand"
        self.publisher.publish_take_payment_command(
            transaction_id=transaction_id,  # Include transaction_id
            order_id=saga_state.order_id,
            payment_info=saga_state.payment_info
        )

    def handle_insufficient_stock_event(self, transaction_id: str):
        # Saga fails here; possibly trigger compensation or just end
        saga_state = self.saga_store.get(transaction_id)
        saga_state.status = "FAILED"
        # Notify client or publish "OrderFailedEvent" if desired

    def handle_payment_verified_event(self, transaction_id: str):
        # Next step: publish "CreateOrderCommand"
        saga_state = self.saga_store.get(transaction_id)
        saga_state.current_step = "CREATE_ORDER"
        self.publisher.publish_create_order_command(saga_state.order_id, saga_state.order_data)

    def handle_payment_unverified_event(self, transaction_id: str):
        # Trigger rollback stock if needed
        saga_state = self.saga_store.get(transaction_id)
        saga_state.status = "FAILED"
        self.publisher.publish_rollback_stock_command(saga_state.order_id, ...)
        # Possibly notify the user or publish "OrderFailedEvent"

    # etc.
