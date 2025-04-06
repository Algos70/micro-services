"""
Saga Orchestrator
Handles the orchestration of the Saga pattern.
"""# saga_orchestrator.py

"""
"""
import uuid

from fastapi import Depends
from services.auth_http_client import get_auth_service
from services.message_publisher import get_publisher_service
from models.saga_state import OrderSagaState, ProductSagaState, PaymentSagaState
from models.order import OrderCreateRequest, OrderResponse
from models.payment import PaymentCreate
from services.redis_saga_store import get_redis_saga_store, RedisSagaStore

class SagaOrchestrator:
    def __init__(self, saga_store: RedisSagaStore):
        self.auth_client = get_auth_service()  # Synchronous calls
        self.publisher = get_publisher_service()  # Publishes to RabbitMQ
        self.saga_store = saga_store  

    def start_order_saga(self, order_data: OrderCreateRequest, token: str):
        verified = self.auth_client.authenticate_customer(jwt_token=token)
        if not verified:
            raise Exception("Authentication failed")
        
        transaction_id = str(uuid.uuid4())
        # If verified, store saga state
        order_saga_state = OrderSagaState(
            transaction_id=transaction_id,
            user_email=order_data.user_email,
            vendor_email=order_data.vendor_email,
            delivery_address=order_data.delivery_address,
            description=order_data.description,
            status=order_data.status,
            items=order_data.items,
            payment_method=order_data.payment_method
        )
        prouct_saga_state = ProductSagaState(
            transaction_id=transaction_id,
            product_id=order_data.items[0].product_id,
            quantity=order_data.items[0].quantity
        )

        self.saga_store.save_product_saga(prouct_saga_state)
        self.saga_store.save_order_saga(order_saga_state)

        self.publisher.publish_reduce_stock_command(
            transaction_id=transaction_id, 
            products=order_data.items
        )
        return True



    def handle_stock_reduced_event(self, message: dict):
        # Update saga state
        transaction_id : str = message["transaction_id"]
        data : dict = message["data"]
        status : str = message["status"]
        saga_state = self.saga_store.get_product_saga(transaction_id)
        order_saga_state = self.saga_store.get_order_saga(transaction_id)
        if not saga_state:
            print(f"Transaction ID {transaction_id} not found in saga store.")

        if "error" in status:
            print(f"Error reducing stock: {status}")
        
        payment_saga_state = PaymentSagaState(
            transaction_id=transaction_id,
            user_email=order_saga_state.user_email,
            amount=order_saga_state.total_price(),
            payment_method=order_saga_state.payment_method,
            payment_status="Pending"
        )
        self.saga_store.save_payment_saga(payment_saga_state)
        self.publisher.publish_take_payment_command(payment_data=payment_saga_state)

    def hande_take_payment_event(self, message: dict):
        transaction_id : str = message["transaction_id"]
        data : dict = message["data"]
        status : str = message["status"]
        saga_state = self.saga_store.get_payment_saga(transaction_id)
        if not saga_state:
            print(f"Transaction ID {transaction_id} not found in saga store.")
        if "error" in status:
            print(f"Error taking payment: {status}")
            # Trigger rollback stock if needed
            self.publisher.publish_rollback_stock_command(
                transaction_id=transaction_id
            )
            return
        
        # Update saga state
        saga_state.payment_status = status
        self.saga_store.save_payment_saga(saga_state)

        order_saga_state = self.saga_store.get_order_saga(transaction_id)
        if not order_saga_state:
            print(f"Transaction ID {transaction_id} not found in saga store.")
        
        # next step: publih create order command
        self.publisher.publish_create_order_command(
            order_data=order_saga_state,
            transaction_id=transaction_id
        )
        return
    
    def handle_create_order_event(self, message: dict):
        transaction_id : str = message["transaction_id"]
        data : dict = message["data"]
        status : str = message["status"]
        saga_state = self.saga_store.get_order_saga(transaction_id)
        if not saga_state:
            print(f"Transaction ID {transaction_id} not found in saga store.")
        
        if "error" in status:
            print(f"Error creating order: {status}")
            # Trigger rollback stock if needed
            self.publisher.publish_rollback_stock_command(
                transaction_id=transaction_id
            )
            self.publisher.publish_rollback_payment_command(
                transaction_id=transaction_id
            )
            return
        
        # Update saga state
        saga_state.status = status
        self.saga_store.save_order_saga(saga_state)
        # Notify user(can send e mail to user at a later date)


    # etc.

def get_saga_orchestrator(saga_store: RedisSagaStore = Depends(get_redis_saga_store)) -> SagaOrchestrator:
    return SagaOrchestrator(saga_store=saga_store)