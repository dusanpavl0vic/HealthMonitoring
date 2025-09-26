export interface HealthRecordAggregation {
  athleteId: string;
  activityStatus?: number;
  startTime?: Date;
  endTime?: Date;

  // Agregacije
  heartRate: {
    min: number;
    max: number;
    avg: number;
  };
  bodyTemperature: {
    min: number;
    max: number;
    avg: number;
  };
  bloodOxygen: {
    min: number;
    max: number;
    avg: number;
  };
  stepCount: {
    sum: number;
  };
  bloodPressure: {
    min: string;
    max: string;
  };

  records: {
    timestamp: Date;
    bloodPressure: string;
    latitude: number;
    longitude: number;
    secureTransmissionStatus: number;
  }[];
}
