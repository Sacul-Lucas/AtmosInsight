package main

import amqp "github.com/rabbitmq/amqp091-go"

func declareQueues(ch *amqp.Channel) error {

	// DLQ
	_, err := ch.QueueDeclare(
		"weather.logs.dlq",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return err
	}

	// Retry queue
	_, err = ch.QueueDeclare(
		"weather.logs.retry",
		true,
		false,
		false,
		false,
		amqp.Table{
			"x-message-ttl":             int64(10000), // 10s
			"x-dead-letter-exchange":    "",
			"x-dead-letter-routing-key": "weather.logs",
		},
	)
	if err != nil {
		return err
	}

	return err
}
