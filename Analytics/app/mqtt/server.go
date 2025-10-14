package mqtt

import (
	"Analytics/app/mlaas"
	"Analytics/app/nats"
	"fmt"
)

var (
	mlaasClient *mlaas.MLaaSClient
	natsClient  *nats.NATSClient
)

func RunMqttServer(){

	mlaasClient = mlaas.NewMLaaSClient("http://mlaas:8001")
	fmt.Println("✅ MLaaS client initialized")
	
	var err error
	natsClient, err = nats.NewNATSClient("nats://nats:4222")
	if err != nil {
		fmt.Printf("❌ Failed to initialize NATS client: %v\n", err)
	} else {
		fmt.Println("✅ NATS client initialized")
	}


	client := NewMqttClient("mqtt://mosquitto:1883")
	SubHealthRecord(client)
}

func GetMLaaSClient() *mlaas.MLaaSClient {
	return mlaasClient
}

func GetNATSClient() *nats.NATSClient {
	return natsClient
}