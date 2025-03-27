""" RabbitMQ Consumer Service
Message structure:
{
  "event": "order_created",
  "data": {
    "order_id": 123,
    "customer": "Alice"
  }
}

"""
import pika
import json
from core import config

class RabbitMQConsumer:
    def __init__(self, queue: str):
        self.queue = queue
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

        # Mapping event types to handler methods
        self.event_handlers = {
            "order_created": self.handle_order_created,
            "order_updated": self.handle_order_updated,
            # Add more event mappings as needed
        }

    def connect(self):
        """Establish the connection and declare the queue."""
        self.connection = pika.BlockingConnection(self.connection_params)
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue=self.queue, durable=True)

    def callback(self, ch, method, properties, body):
        """Callback function to process incoming messages."""
        try:
            message = json.loads(body)
            event_type = message.get("event")

            # Dispatch the message to the appropriate handler if it exists
            if event_type in self.event_handlers:
                self.event_handlers[event_type](message.get("data"))
            else:
                print(f"Unhandled event type: {event_type}")

            # Acknowledge the message after processing
            ch.basic_ack(delivery_tag=method.delivery_tag)
        except Exception as e:
            print("Error processing message:", e)
            # Optionally, you might choose to nack the message or log it for further inspection

    def handle_order_created(self, data):
        """Handle order creation logic."""
        print("Processing order created with data:", data)
        # Add your business logic for order creation here

    def handle_order_updated(self, data):
        """Handle order update logic."""
        print("Processing order updated with data:", data)
        # Add your business logic for order update here

    def start_consuming(self):
        """Start consuming messages from the specified queue."""
        if not self.connection or self.connection.is_closed:
            self.connect()
        
        self.channel.basic_qos(prefetch_count=1)
        self.channel.basic_consume(
            queue=self.queue,
            on_message_callback=self.callback
        )
        print(f"Started consuming on queue: {self.queue}")
        try:
            self.channel.start_consuming()
        except Exception as e:
            print("Error during consuming:", e)
        finally:
            if self.connection and not self.connection.is_closed:
                self.connection.close()

    def stop_consuming(self):
        """Signal the consumer to stop consuming messages."""
        if self.channel and self.channel.is_open:
            # Signal the consumer's thread to stop consuming in a thread-safe manner
            self.connection.add_callback_threadsafe(self.channel.stop_consuming)

def get_consumer_service(queue: str):
    return RabbitMQConsumer(queue)
"""Usage example: run this script to start the consumer
if __name__ == "__main__":
    consumer = RabbitMQConsumer(queue="orders_queue")
    try:
        consumer.start_consuming()
    except KeyboardInterrupt:
        consumer.stop_consuming()
        print("Stopped consuming.")
"""