import { Timestamp } from '../grpc/google/protobuf/timestamp';
import { client } from '../grpc/healtDataClient';
import { AthleteFilter, HealthRecord, HealthRecordIdRequest, HealthRecordRequest, Message } from '../grpc/healthData';
import { HealthRecordAggregation } from '../interface/healthDataInterface';

async function CreateHealthRecord(r: HealthRecordRequest): Promise<void> {
  const record = {
    ...r,
    timestamp: r.timestamp ? toProtoTimestamp(new Date(r.timestamp)) : undefined,
  };
  return new Promise((resolve, reject) => {
    client.CreateHealthRecord(record, (error: any, _response: any) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

async function GetHealthRecords(recordId: number): Promise<HealthRecord> {
  const request: HealthRecordIdRequest = { recordId };
  return new Promise((resolve, reject) => {
    client.GetHealthRecord(request, (error: any, response: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(response as HealthRecord);
      }
    });
  });
}

async function GetAllHealthRecords(): Promise<HealthRecord[]> {
  return new Promise((resolve, reject) => {
    client.GetAllHealthRecords({}, (error: any, response: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(response.records as HealthRecord[]);
      }
    });
  });
}

async function UpdateHealthRecord(r: HealthRecord): Promise<Message> {
  const record = {
    ...r,
    timestamp: r.timestamp ? toProtoTimestamp(new Date(r.timestamp)) : undefined,
  };
  return new Promise((resolve, reject) => {
    client.UpdateHealthRecord(record, (error: any, response: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(response as Message);
      }
    });
  });
}

async function DeleteHealthRecord(recordId: number): Promise<Message> {
  const request: HealthRecordIdRequest = { recordId };
  return new Promise((resolve, reject) => {
    client.DeleteHealthRecord(request, (error: any, response: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(response as Message);
      }
    });
  });
}

async function GetAthleteHealthRecords(req: AthleteFilter): Promise<HealthRecord[]> {
  if (!req.athleteId || req.athleteId == "") {
    throw new Error("athleteId is required");
  }
  const filter = {
    athleteId: req.athleteId,
    activityStatus: req.activityStatus,
    startTime: req.startTime ? toProtoTimestamp(new Date(req.startTime)) : undefined,
    endTime: req.endTime ? toProtoTimestamp(new Date(req.endTime)) : undefined,
  };
  return new Promise((resolve, reject) => {
    console.log("Filter:", filter);
    client.GetAthleteHealthRecords(filter, (error: any, response: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(response.records as HealthRecord[]);
      }
    });
  });
}

async function AggregateAthleteRecords(
  filter: AthleteFilter
): Promise<HealthRecordAggregation | null> {
  const records = await GetAthleteHealthRecords(filter);
  if (!records || records.length === 0) {
    return null;
  }

  const systolics: number[] = [];
  const diastolics: number[] = [];

  const heartRateValues = records.map((r) => r.heartRate);
  const tempValues = records.map((r) => r.bodyTemperature);
  const oxygenValues = records.map((r) => r.bloodOxygen);
  const stepValues = records.map((r) => r.stepCount);

  const recordSummaries = records.map((r) => ({
    timestamp: r.timestamp!,
    bloodPressure: r.bloodPressure,
    latitude: r.latitude,
    longitude: r.longitude,
    secureTransmissionStatus: r.secureTransmissionStatus,
  }));

  records.forEach((r) => {
    const parsed = parseBloodPressure(r.bloodPressure);
    if (parsed) {
      systolics.push(parsed.systolic);
      diastolics.push(parsed.diastolic);
    }
  });

  const bpStats = {
    systolic: {
      min: Math.min(...systolics),
      max: Math.max(...systolics),
    },
    diastolic: {
      min: Math.min(...diastolics),
      max: Math.max(...diastolics),
    },
  };

  return {
    athleteId: filter.athleteId,
    activityStatus: filter.activityStatus,
    startTime: filter.startTime,
    endTime: filter.endTime,

    heartRate: calcStats(heartRateValues),
    bodyTemperature: calcStats(tempValues),
    bloodOxygen: calcStats(oxygenValues),
    stepCount: {
      sum: stepValues.reduce((a, b) => a + b, 0),
    },
    bloodPressure: {
      min: `${bpStats.systolic.min}/${bpStats.diastolic.min}`,
      max: `${bpStats.systolic.max}/${bpStats.diastolic.max}`,
    },

    records: recordSummaries,
  };
}

function calcStats(values: number[]) {
  return {
    min: Math.min(...values),
    max: Math.max(...values),
    avg: values.reduce((a, b) => a + b, 0) / values.length,
  };
}

function toProtoTimestamp(date: Date): Timestamp | null {

  if (!date) {
    return null;
  }
  return {
    seconds: Math.floor(date.getTime() / 1000),
    nanos: (date.getTime() % 1000) * 1_000_000,
  };
}

function parseBloodPressure(bp: string): { systolic: number; diastolic: number } | null {
  if (!bp) return null;
  const parts = bp.split("/");
  if (parts.length !== 2) return null;
  const systolic = parseInt(parts[0], 10);
  const diastolic = parseInt(parts[1], 10);
  if (isNaN(systolic) || isNaN(diastolic)) return null;
  return { systolic, diastolic };
}


export { AggregateAthleteRecords, CreateHealthRecord, DeleteHealthRecord, GetAllHealthRecords, GetAthleteHealthRecords, GetHealthRecords, UpdateHealthRecord };
