interface NatsMessage {
  athleteId: string;
  timestamp: string;
  healthRecord: {
    heartRate: number;
    bodyTemperature: number;
    bloodPressure: string;
    bloodOxygen: number;
    stepCount: number;
  };
  prediction: {
    predicted_activity: string;
    confidence: number;
    error: string;
  };
}