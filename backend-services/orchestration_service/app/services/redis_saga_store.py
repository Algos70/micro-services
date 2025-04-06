import redis
import json
from models.saga_state import OrderSagaState, ProductSagaState, PaymentSagaState

class RedisSagaStore:
    def __init__(self, host="localhost", port=6379, db=0):
        self.client = redis.Redis(host=host, port=port, db=db, decode_responses=True)

    def save_order_saga(self, saga: OrderSagaState, ttl: int = 600):
        key = f"order_saga:{saga.transaction_id}"
        self.client.set(key, json.dumps(saga.dict()), ex=ttl)

    def get_order_saga(self, transaction_id: str) -> OrderSagaState | None:
        key = f"order_saga:{transaction_id}"
        data = self.client.get(key)
        return OrderSagaState(**json.loads(data)) if data else None

    def delete_order_saga(self, transaction_id: str):
        key = f"order_saga:{transaction_id}"
        self.client.delete(key)

    def save_product_saga(self, saga: ProductSagaState, ttl: int = 600):
        key = f"product_saga:{saga.transaction_id}"
        self.client.set(key, json.dumps(saga.dict()), ex=ttl)

    def get_product_saga(self, transaction_id: str) -> ProductSagaState | None:
        key = f"product_saga:{transaction_id}"
        data = self.client.get(key)
        return ProductSagaState(**json.loads(data)) if data else None

    def delete_product_saga(self, transaction_id: str):
        key = f"product_saga:{transaction_id}"
        self.client.delete(key)
    
    def save_payment_saga(self, saga: PaymentSagaState, ttl: int = 600):
        key = f"payment_saga:{saga.transaction_id}"
        self.client.set(key, json.dumps(saga.dict()), ex=ttl)
    
    def get_payment_saga(self, transaction_id: str) -> PaymentSagaState | None:
        key = f"payment_saga:{transaction_id}"
        data = self.client.get(key)
        return PaymentSagaState(**json.loads(data)) if data else None
    def delete_payment_saga(self, transaction_id: str):
        key = f"payment_saga:{transaction_id}"
        self.client.delete(key)
    
    
def get_redis_saga_store() -> RedisSagaStore:
    return RedisSagaStore(
    )