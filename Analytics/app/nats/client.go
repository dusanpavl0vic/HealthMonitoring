package nats

import (
	"Analytics/app/models"
	"encoding/json"
	"fmt"

	"github.com/nats-io/nats.go"
)

type NATSClient struct {
	conn *nats.Conn
}

func NewNATSClient(url string) (*NATSClient, error) {
	conn, err := nats.Connect(url)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to NATS: %v", err)
	}
	
	fmt.Printf("✅ Connected to NATS: %s\n", url)
	return &NATSClient{conn: conn}, nil
}

func (c *NATSClient) PublishPrediction(prediction models.AthletePredictResponse) error {
	jsonData, err := json.Marshal(prediction)
	if err != nil {
		return fmt.Errorf("failed to marshal prediction: %v", err)
	}

	subject := "athlete/predictions"
	err = c.conn.Publish(subject, jsonData)
	if err != nil {
		return fmt.Errorf("failed to publish to NATS: %v", err)
	}

	fmt.Printf("✅ Prediction published to NATS subject: %s\n", subject)
	return nil
}

func (c *NATSClient) Close() {
	if c.conn != nil {
		c.conn.Close()
	}
}