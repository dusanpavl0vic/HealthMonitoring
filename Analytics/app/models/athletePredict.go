package models

type AthletePredictRequest struct{
  HeartRate float64 `json:"heartRate"`
  BodyTemperature float64 `json:"bodyTemperature"`
  BloodPressure string `json:"bloodPressure"`
  BloodOxygen float64 `json:"bloodOxygen"`
  StepCount int32 `json:"stepCount"`
}

type AthletePredictResponse struct {
    AthleteId string `json:"athleteId"`
    Timestamp string `json:"timestamp"`
    HealthRecord AthletePredictRequest `json:"healthRecord"`
    Prediction MLaaSResponse `json:"prediction"`
}

type MLaaSResponse struct {
    Prediction string `json:"predicted_activity"`
    Confidence float64 `json:"confidence"`
    Error string  `json:"error,omitempty"`
}