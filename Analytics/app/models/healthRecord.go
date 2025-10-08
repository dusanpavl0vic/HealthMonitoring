package models

type HealthRecord struct{
  AthleteId string `json:"athleteId"`
  Timestamp string `json:"timestamp"`
  HeartRate float64 `json:"heartRate"`
  BodyTemperature float64 `json:"bodyTemperature"`
  BloodPressure string `json:"bloodPressure"`
  BloodOxygen float64 `json:"bloodOxygen"`
  StepCount int32 `json:"stepCount"`
  ActivityStatus ActivityStatus `json:"activityStatus"`
  Latitude float64 `json:"latitude"`
  Longitude float64 `json:"longitude"`
  SecureTransmissionStatus int32 `json:"secureTransmissionStatus"`
}

type ActivityStatus int

const ( 
		Walking ActivityStatus = iota
  	Cycling
  	Running
  	Resting
)