package main

import (
	"encoding/json"
	"log"
	"os"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

const MAX_RETRIES = 3

func processMessage(ch *amqp.Channel, msg amqp.Delivery) {
	var weatherMsg WeatherMessage

	err := json.Unmarshal(msg.Body, &weatherMsg)
	if err != nil {
		log.Println("Invalid JSON")
		msg.Ack(false)
		return
	}

	if !weatherMsg.IsValid() {
		log.Println("Invalid message")
		msg.Ack(false)
		return
	}

	err = sendToAPI(weatherMsg)
	if err != nil {
		handleRetry(ch, msg)
		return
	}

	msg.Ack(false)
	log.Println("Message processed successfully")
}

func handleRetry(ch *amqp.Channel, msg amqp.Delivery) {
	retries := 0

	if msg.Headers != nil {
		if val, ok := msg.Headers["x-retry-count"]; ok {
			retries = int(val.(int32))
		}
	}

	retries++

	if retries > MAX_RETRIES {
		log.Println("Max retries exceeded → DLQ")

		ch.Publish(
			"",
			"weather.logs.dlq",
			false,
			false,
			amqp.Publishing{
				ContentType: "application/json",
				Body:        msg.Body,
			},
		)

		msg.Ack(false)
		return
	}

	log.Printf("Retry %d/%d\n", retries, MAX_RETRIES)

	headers := amqp.Table{
		"x-retry-count": int32(retries),
	}

	ch.Publish(
		"",
		"weather.logs.retry",
		false,
		false,
		amqp.Publishing{
			ContentType: "application/json",
			Headers:     headers,
			Body:        msg.Body,
		},
	)

	msg.Ack(false)
}

func connectWithRetry() *amqp.Connection {
	rabbitURL := os.Getenv("RABBITMQ_URL")

	for {
		conn, err := amqp.Dial(rabbitURL)
		if err != nil {
			log.Println("RabbitMQ unavailable, retrying in 5s...")
			time.Sleep(5 * time.Second)
			continue
		}

		log.Println("Connected to RabbitMQ")
		return conn
	}
}

func startConsumer() {
	conn := connectWithRetry()
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatal(err)
	}
	defer ch.Close()

	err = declareQueues(ch)
	if err != nil {
		log.Fatal(err)
	}

	msgs, err := ch.Consume(
		"weather.logs",
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Worker started. Waiting for messages...")

	for msg := range msgs {
		processMessage(ch, msg)
	}
}
