export interface HealthRecordRequest {
  athleteId: string;
  timestamp: string;
  heartRate: number;
  bodyTemperature: number;
  bloodPressure: string;
  bloodOxygen: number;
  stepCount: number;
  activityStatus: ActivityStatus;
  latitude: number;
  longitude: number;
  secureTransmissionStatus: number;
}

enum ActivityStatus {
  Walking = 0,
  Cycling = 1,
  Running = 2,
  Resting = 3
}

export interface AthleteFilter {
  athleteId: string;
  activityStatus: ActivityStatus;
}

export interface HealthRecord extends HealthRecordRequest {
  recordId: number;
}

export interface Message {
  recordId: number;
  message: string;
}

export interface HealthRecordIdRequest {
  recordId: number;
}