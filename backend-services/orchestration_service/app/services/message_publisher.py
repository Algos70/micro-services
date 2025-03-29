"""
RabbitMQ message publisher for sending messages to a queue.
This module provides a simple interface for publishing messages to RabbitMQ queues.
"""
import pika
import json
import config
class RabbitMQPublisher:
    def __init__(self):
        credentials = pika.PlainCredentials(
            username=config.RABBITMQ_USER, 
            password=config.RABBITMQ_PASSWORD
        )
        self.connection_params = pika.ConnectionParameters(
            host=config.RABBITMQ_HOST,
            port=config.RABBITMQ_PORT,
            credentials=credentials
        )
        self.connection = None
        self.channel = None

    def connect(self):
        """Establish connection and channel."""
        self.connection = pika.BlockingConnection(self.connection_params)
        self.channel = self.connection.channel()

    def publish_message(self, message: dict, queue: str):
        """Publish a message to the specified RabbitMQ queue."""
        if not self.connection or self.connection.is_closed:
            self.connect()

        # Declare the queue dynamically based on the provided name
        self.channel.queue_declare(queue=queue, durable=True)
        
        self.channel.basic_publish(
            exchange='',
            routing_key=queue,
            body=json.dumps(message),
            properties=pika.BasicProperties(
                delivery_mode=2  # make message persistent
            )
        )

    def publish_reduce_stock_command(self, order_id: str, product_id: str, quantity: int):
        command = {
            "event": "ReduceStockCommand",
            "data": {
                "order_id": order_id,
                "product_id": product_id,
                "quantity": quantity
            }
        }
        self.publish_message(command, config.RABBITMQ_PRODUCTS_QUEUE)

    def close(self):
        if self.connection and not self.connection.is_closed:
            self.connection.close()

def get_publisher_service():
    return RabbitMQPublisher()