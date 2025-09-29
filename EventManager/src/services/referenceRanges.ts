import { ActivityStatus, HealthRecord, ValidationMessage, ValidationResult } from "../interfaces/healthData";

type ReferenceRange = {
  heartRate: { min: number; max: number };
  systolicBP: { min: number; max: number };
  diastolicBP: { min: number; max: number };
};

export const referenceRanges: Record<ActivityStatus, ReferenceRange> = {
  [ActivityStatus.Resting]: {
    heartRate: { min: 50, max: 90 },
    systolicBP: { min: 100, max: 120 },
    diastolicBP: { min: 60, max: 80 },
  },
  [ActivityStatus.Walking]: {
    heartRate: { min: 90, max: 120 },
    systolicBP: { min: 110, max: 130 },
    diastolicBP: { min: 70, max: 85 },
  },
  [ActivityStatus.Running]: {
    heartRate: { min: 120, max: 180 },
    systolicBP: { min: 120, max: 140 },
    diastolicBP: { min: 70, max: 90 },
  },
  [ActivityStatus.Cycling]: {
    heartRate: { min: 100, max: 160 },
    systolicBP: { min: 115, max: 135 },
    diastolicBP: { min: 70, max: 88 },
  },
  [ActivityStatus.UNRECOGNIZED]: {
    heartRate: { min: 0, max: 0 },
    systolicBP: { min: 0, max: 0 },
    diastolicBP: { min: 0, max: 0 },
  },
};

export function validateHealthRecord(record: HealthRecord): ValidationResult {
  const messages: ValidationMessage[] = [];

  const bp = parseBloodPressure(record.bloodPressure);
  const ranges = referenceRanges[record.activityStatus];
  if (!ranges) {
    messages.push({
      type: "critical",
      message: `Unknown activity status: ${ActivityStatus[record.activityStatus]}`,
      value: record.activityStatus,
    });
    return { record, messages };
  }

  if (record.heartRate < ranges.heartRate.min) {
    messages.push({
      type: "warning",
      message: `Heart rate too low for ${ActivityStatus[record.activityStatus]}`,
      value: record.heartRate,
    });
  }
  if (record.heartRate > ranges.heartRate.max) {
    messages.push({
      type: "critical",
      message: `Heart rate too high for ${ActivityStatus[record.activityStatus]}`,
      value: record.heartRate,
    });
  }

  if (bp) {
    if (bp.systolic < ranges.systolicBP.min || bp.systolic > ranges.systolicBP.max) {
      messages.push({
        type: "warning",
        message: `Systolic pressure abnormal for ${ActivityStatus[record.activityStatus]}`,
        value: bp.systolic,
      });
    }
    if (bp.diastolic < ranges.diastolicBP.min || bp.diastolic > ranges.diastolicBP.max) {
      messages.push({
        type: "warning",
        message: `Diastolic pressure abnormal for ${ActivityStatus[record.activityStatus]})`,
        value: bp.diastolic,
      });
    }
  } else {
    messages.push({
      type: "warning",
      message: "Invalid blood pressure format",
      value: record.bloodPressure,
    });
  }

  if (record.bodyTemperature > 38.0) {
    messages.push({
      type: "critical",
      message: "High body temperature detected",
      value: record.bodyTemperature,
    });
  }

  if (record.bloodOxygen < 92) {
    messages.push({
      type: "critical",
      message: "Low blood oxygen detected",
      value: record.bloodOxygen,
    });
  }

  if (record.secureTransmissionStatus === 0) {
    messages.push({
      type: "warning",
      message: "Data transmission not secure",
    });
  }

  return { record, messages };
}

export function parseBloodPressure(bp: string): { systolic: number; diastolic: number } | null {
  if (!bp) return null;
  const parts = bp.split("/");
  if (parts.length !== 2) return null;
  const systolic = parseInt(parts[0], 10);
  const diastolic = parseInt(parts[1], 10);
  if (isNaN(systolic) || isNaN(diastolic)) return null;
  return { systolic, diastolic };
}

export function normalizeRecord(record: any): HealthRecord {
  return {
    athleteId: record.AthleteId,
    timestamp: record.Timestamp,
    heartRate: record.HeartRate,
    bodyTemperature: record.BodyTemperature,
    bloodPressure: record.BloodPressure,
    bloodOxygen: record.BloodOxygen,
    stepCount: record.StepCount,
    activityStatus: record.ActivityStatus,
    latitude: record.Latitude,
    longitude: record.Longitude,
    secureTransmissionStatus: record.SecureTransmissionStatus,
  };
}

function getActivityStatus(status: string) {
  switch (status) {
    case "Walking":
      return 0;
    case "Cycling":
      return 1;
    case "Running":
      return 2;
    case "Resting":
      return 3;
    default:
      throw new Error(`Nepoznat status aktivnosti: ${status}`);
  }
}