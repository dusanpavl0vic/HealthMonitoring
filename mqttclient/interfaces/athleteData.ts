import { HealthRecord, ValidationResult } from "./healthData";

export interface AthleteData {
  athleteId: string;
  currentData: ValidationResult | null;
  history: HealthRecord[];
  lastUpdate: Date;
}
