package mqtt

import (
	"fmt"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

func SubHealthRecord(client mqtt.Client){

	topic := "health/records"
	token := client.Subscribe(topic, 0, HealthRecordHandler)
	token.Wait()

	fmt.Println("Subscribed to topic:", topic)
	select{}

}