package mqtt

import (
	"Analytics/app/models"
	"encoding/json"
	"fmt"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

func HealthRecordHandler(client mqtt.Client, msg mqtt.Message) {
	fmt.Printf("📩 Received message on topic %s: %s\n", msg.Topic(), msg.Payload())

	var data models.HealthRecord
	if err := json.Unmarshal(msg.Payload(), &data); err != nil {
		fmt.Println("❌ Error parsing JSON:", err)
		return
	}

	fmt.Printf("AthletId: %s", data.AthleteId)
}