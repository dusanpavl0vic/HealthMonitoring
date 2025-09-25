import { AthleteFilter, HealthRecord, HealthRecordIdRequest, HealthRecordRequest, Message } from "../interface/healthDataInterface";

import { client } from '../grpc/healtDataClient';

async function CreateHealthRecord(r: HealthRecordRequest): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = {
      ...r,
      timestamp: toProtoTimestamp(r.timestamp as string),
    };
    client.CreateHealthRecord(request, (error: any, _response: any) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

async function GetHealthRecords(recordId: number): Promise<HealthRecord> {
  return new Promise((resolve, reject) => {
    const request: HealthRecordIdRequest = { recordId };

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

async function UpdateHealthRecord(record: HealthRecord): Promise<Message> {
  return new Promise((resolve, reject) => {
    const request = {
      ...record,
      timestamp: toProtoTimestamp(record.timestamp as string),
    };
    client.UpdateHealthRecord(request, (error: any, response: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(response as Message);
      }
    });
  });
}

async function DeleteHealthRecord(recordId: number): Promise<Message> {
  return new Promise((resolve, reject) => {
    const request: HealthRecordIdRequest = { recordId };
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
  return new Promise((resolve, reject) => {

    const filter = {
      athleteId: req.athleteId,
      activityStatus: req.activityStatus,
      startTime: toProtoTimestamp(req.startTime),
      endTime: toProtoTimestamp(req.endTime),
    };

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

function toProtoTimestamp(dateString?: string) {
  if (!dateString) {
    return null;
  }
  const d = new Date(dateString.replace(" ", "T") + "Z");
  const seconds = Math.floor(d.getTime() / 1000);
  const nanos = (d.getTime() % 1000) * 1e6;
  return { seconds, nanos };
}

export { CreateHealthRecord, DeleteHealthRecord, GetAllHealthRecords, GetAthleteHealthRecords, GetHealthRecords, UpdateHealthRecord };
