package main

import (
	"encoding/json"
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
)

const MAX_RETRIES = 3

func processMessage(ch *amqp.Channel, msg amqp.Delivery) {
	var weatherMsg WeatherMessage

	err := json.Unmarshal(msg.Body, &weatherMsg)
	if err != nil {
		log.Println("JSON inválido")
		msg.Ack(false)
		return
	}

	if !weatherMsg.IsValid() {
		log.Println("Mensagem inválida")
		msg.Ack(false)
		return
	}

	err = sendToAPI(weatherMsg)
	if err != nil {
		handleRetry(ch, msg)
		return
	}

	msg.Ack(false)
	log.Println("Mensagem processada com sucesso")
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
		log.Println("Max retries excedido → DLQ")

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

func startConsumer() {
	conn, err := amqp.Dial("amqp://user:password@rabbitmq:5672/")
	if err != nil {
		log.Fatal(err)
	}
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

	log.Println("Worker iniciado. Aguardando mensagens...")

	for msg := range msgs {
		processMessage(ch, msg)
	}
}
