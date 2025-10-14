package mqtt

import (
	"fmt"
	"log"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

func NewMqttClient(broker string) mqtt.Client {
	opts := mqtt.NewClientOptions()
	opts.AddBroker(broker)

	client := mqtt.NewClient(opts)
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		log.Fatalf("Failed to connect to MQTT broker: %v", token.Error())
	}

	fmt.Println("✅ Connected to MQTT broker:", broker)
	return client
}