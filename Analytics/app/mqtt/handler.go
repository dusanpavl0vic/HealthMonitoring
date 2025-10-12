package mqtt

import (
	"Analytics/app/models"
	"encoding/json"
	"fmt"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)


func HealthRecordHandler(client mqtt.Client, msg mqtt.Message) {
	if client == nil {
		fmt.Println("❌ ERROR: MQTT client is nil!")
		return
	}

	fmt.Printf("Received message on topic %s: %s\n", msg.Topic(), msg.Payload())

	fmt.Println("Ovde 1")

	var data models.HealthRecord
	if err := json.Unmarshal(msg.Payload(), &data); err != nil {
		fmt.Println("Error parsing JSON:", err)
		return
	}

	fmt.Println("Ovde 2")

	fmt.Printf("AthletId: %s", data.AthleteId)

	predictRequest := models.AthletePredictRequest{
			HeartRate:       data.HeartRate,
			BodyTemperature: data.BodyTemperature,
			BloodPressure:   data.BloodPressure,
			BloodOxygen:     data.BloodOxygen,
			StepCount:       data.StepCount,
	}

	fmt.Printf("Ovde 3: %+v\n", predictRequest)

	mlaasClient := GetMLaaSClient()
	if mlaasClient == nil {
		fmt.Println("ERROR: MLaaS client is not initialized!")
		return
	}

	fmt.Printf("Ovde 4: %+v\n", mlaasClient)

	mlaasPrediction, err := mlaasClient.PredictActivity(predictRequest)
	fmt.Printf("Error calling MLaaS for athlete %s: %v\n", data.AthleteId, err)
	fmt.Printf("Ovde 5: %+v\n", mlaasPrediction)
	
	// Pripremi odgovor sa predikcijom

	athleteResponse := models.AthletePredictResponse{
		AthleteId:    data.AthleteId,
		Timestamp:    data.Timestamp,
		HealthRecord: predictRequest,
		Prediction: models.MLaaSResponse{
				Prediction: mlaasPrediction.Prediction,
				Confidence: mlaasPrediction.Confidence,
				Error:      "",
		},
	}

	if err != nil {
		fmt.Printf("Error calling MLaaS for athlete %s: %v\n", data.AthleteId, err)
		athleteResponse.Prediction.Error = err.Error()
	} else {
		fmt.Printf("Prediction for athlete %s: %s (confidence: %.2f)\n", 
			data.AthleteId, mlaasPrediction.Prediction, mlaasPrediction.Confidence)
	}

	natsCli := GetNATSClient()
	if natsCli != nil {
		if err := natsCli.PublishPrediction(athleteResponse); err != nil {
			fmt.Printf("❌ Failed to publish to NATS: %v\n", err)
		} else {
			fmt.Printf("Prediction published to NATS: %+v\n", athleteResponse)
		}
	} else {
		fmt.Println("⚠️  NATS client not available")
	}
}