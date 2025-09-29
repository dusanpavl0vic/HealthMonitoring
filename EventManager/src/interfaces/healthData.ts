export interface HealthRecord {
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

export interface ValidationMessage {
  type: "warning" | "critical";
  message: string;
  value?: any;
}

export interface ValidationResult {
  record: HealthRecord;
  messages: ValidationMessage[];
}
export enum ActivityStatus {
  Walking = 0,
  Cycling = 1,
  Running = 2,
  Resting = 3,
  UNRECOGNIZED = -1,
}