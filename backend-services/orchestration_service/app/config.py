"""
Configuration settings for the application.
"""
import os

RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", default="rabbitmq")
RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", default=5672))
RABBITMQ_USER = os.getenv("RABBITMQ_USER", default="guest")
RABBITMQ_PASSWORD = os.getenv("RABBITMQ_PASSWORD", default="guest")
RABBITMQ_PRODUCTS_QUEUE = "products_queue"
RABBITMQ_ORDERS_QUEUE = "orders_queue"
RABBITMQ_PAYMENT_QUEUE = "payment_queue"
RABBITMQ_ORCHESTRATION_QUEUE = "orchestration_queue"
