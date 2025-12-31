import json
import pika
from config import RABBITMQ_URL, QUEUE_NAME

def publish(message: dict):
    connection = pika.BlockingConnection(pika.URLParameters(RABBITMQ_URL))
    channel = connection.channel()

    channel.queue_declare(queue=QUEUE_NAME, durable=True, arguments={"x-dead-letter-exchange": "", "x-dead-letter-routing-key": f"{QUEUE_NAME}.retry"})

    channel.basic_publish(
        exchange="",
        routing_key=QUEUE_NAME,
        body=json.dumps(message),
        properties=pika.BasicProperties(delivery_mode=2),
    )

    connection.close()
