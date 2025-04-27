package rabbitmq

import (
	"encoding/json"
	"github.com/rabbitmq/amqp091-go"
	"log"
)

type Envelope struct {
	Event string          `json:"event"`
	Data  json.RawMessage `json:"data"`
}

type ReduceStockPayload struct {
	TransactionID string `json:"transaction_id"`
	Products      []struct {
		ProductID string `json:"product_id"`
		Quantity  int    `json:"quantity"`
	} `json:"products"`
}

type RollbackStockPayload struct {
	TransactionID string `json:"transaction_id"`
}

func HandleConsumer(consumer *Consumer) {
	err := consumer.Start(func(delivery amqp091.Delivery) {
		var env Envelope
		if err := json.Unmarshal(delivery.Body, &env); err != nil {
			log.Printf("rabbitmq: invalid envelope: %v", err)
			return
		}
		switch env.Event {
		case "reduce_stock":
			var payload ReduceStockPayload
			if err := json.Unmarshal(env.Data, &payload); err != nil {
				log.Printf("rabbitmq: bad reduce_stock payload: %v", err)
				return
			}
			handleReduceStock(payload)

		case "rollback_stock":
			var payload RollbackStockPayload
			if err := json.Unmarshal(env.Data, &payload); err != nil {
				log.Printf("rabbitmq: bad rollback_stock payload: %v", err)
				return
			}
			handleRollbackStock(payload)

		default:
			log.Printf("rabbitmq: unknown event %q", env.Event)
			err := delivery.Nack(false, false)
			if err != nil {
				return
			}
			return
		}

	})
	if err != nil {
		log.Fatal(err)
	}
}
