using Grpc.Core;
using Google.Protobuf.WellKnownTypes;
using DataManager.Data;
using DataManager.Models;
using DataManager.Massaging;
using DataManager.Grpc;
using Microsoft.AspNetCore.Builder.Extensions;
using System.Globalization;

namespace DataManager.Services
{

    public class HealthDataService : HealthData.HealthDataBase
    {
        private readonly HealthRecordDbContext _context;
        private readonly ILogger<HealthDataService> _logger;

        private readonly MqttPublisher _mqttPublisher;
        public HealthDataService(
            HealthRecordDbContext context,
            ILogger<HealthDataService> logger,
            MqttPublisher mqttPublisher
        )
        {
            _logger = logger;
            _context = context;
            _mqttPublisher = mqttPublisher;

        }

        public override async Task<Empty> CreateHealthRecord(
            HealthRecordRequest request,
            ServerCallContext context
        )
        {
            try
            {
                int recordId = await _context.CreateHealthRecordAsync(new HealthRecordModel
                {
                    AthleteId = request.AthleteId,
                    Timestamp = request.Timestamp.ToDateTime(),
                    HeartRate = request.HeartRate,
                    BodyTemperature = request.BodyTemperature,
                    BloodPressure = request.BloodPressure,
                    BloodOxygen = request.BloodOxygen,
                    StepCount = request.StepCount,
                    ActivityStatus = (ActivityStatusModel)request.ActivityStatus,
                    Latitude = request.Latitude,
                    Longitude = request.Longitude,
                    SecureTransmissionStatus = request.SecureTransmissionStatus
                });

                await _mqttPublisher.PublishHealthRecord(record);

                _logger.LogInformation($"Created health record with ID: {recordId}");
                return new Empty();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while creating health record");
                throw new RpcException(new Status(
                    StatusCode.Internal,
                    $"Failed to create health record: {ex.Message}"
                ));
            }
        }


        public override async Task<HealthRecord> GetHealthRecord(HealthRecordIdRequest request, ServerCallContext context)
        {
            var record = await _context.GetHealthRecordAsync(request.RecordId);
            if (record == null)
            {
                throw new RpcException(new Status(StatusCode.NotFound, $"Record with ID {request.RecordId} not found."));
            }
            return new HealthRecord
            {
                RecordId = record.RecordId,
                AthleteId = record.AthleteId,
                Timestamp = Timestamp.FromDateTime(record.Timestamp.ToUniversalTime()),
                HeartRate = record.HeartRate,
                BodyTemperature = record.BodyTemperature,
                BloodPressure = record.BloodPressure,
                BloodOxygen = record.BloodOxygen,
                StepCount = record.StepCount,
                ActivityStatus = (ActivityStatus)record.ActivityStatus,
                Latitude = record.Latitude,
                Longitude = record.Longitude,
                SecureTransmissionStatus = record.SecureTransmissionStatus
            };
        }

        public override async Task<HealthRecordResponse> GetAllHealthRecords(Empty request, ServerCallContext context)
        {
            var records = await _context.GetAllHealthRecordsAsync();

            var response = new HealthRecordResponse();
            if (records != null)
            {
                foreach (var record in records)
                {
                    response.Records.Add(new HealthRecord
                    {
                        RecordId = record.RecordId,
                        AthleteId = record.AthleteId,
                        Timestamp = Timestamp.FromDateTime(record.Timestamp.ToUniversalTime()),
                        HeartRate = record.HeartRate,
                        BodyTemperature = record.BodyTemperature,
                        BloodPressure = record.BloodPressure,
                        BloodOxygen = record.BloodOxygen,
                        StepCount = record.StepCount,
                        ActivityStatus = (ActivityStatus)record.ActivityStatus,
                        Latitude = record.Latitude,
                        Longitude = record.Longitude,
                        SecureTransmissionStatus = record.SecureTransmissionStatus
                    });
                }
            }

            return await Task.FromResult(response);
        }

        public override async Task<Message> UpdateHealthRecord(HealthRecord request, ServerCallContext context)
        {
            bool update = await _context.UpdateHealthRecordAsync(new HealthRecordModel
            {
                RecordId = request.RecordId,
                AthleteId = request.AthleteId,
                Timestamp = request.Timestamp.ToDateTime(),
                HeartRate = request.HeartRate,
                BodyTemperature = request.BodyTemperature,
                BloodPressure = request.BloodPressure,
                BloodOxygen = request.BloodOxygen,
                StepCount = request.StepCount,
                ActivityStatus = (ActivityStatusModel)request.ActivityStatus,
                Latitude = request.Latitude,
                Longitude = request.Longitude,
                SecureTransmissionStatus = request.SecureTransmissionStatus
            });

            if (update == false)
            {
                throw new RpcException(new Status(StatusCode.NotFound, $"Record with ID {request.RecordId} not found."));
            }

            return await Task.FromResult(new Message { RecordId = request.RecordId, Message_ = "Record was updated" });
        }

        public override async Task<Message> DeleteHealthRecord(HealthRecordIdRequest request, ServerCallContext context)
        {
            var delete = await _context.DeleteHealthRecordAsync(request.RecordId);
            if (delete == false)
            {
                throw new RpcException(new Status(StatusCode.NotFound, $"Record with ID {request.RecordId} not found."));
            }

            return await Task.FromResult(new Message { RecordId = request.RecordId, Message_ = "Record was deleted" });
        }

        public override async Task<HealthRecordResponse> GetAthleteHealthRecords(AthleteFilter request, ServerCallContext context)
        {
            var records = await _context.GetAthleteHealthRecordsAsync(request.AthleteId, (ActivityStatusModel)request.ActivityStatus, request.StartTime, request.EndTime);

            var response = new HealthRecordResponse();
            if (records != null)
            {
                foreach (var record in records)
                {
                    response.Records.Add(new HealthRecord
                    {
                        RecordId = record.RecordId,
                        AthleteId = record.AthleteId,
                        Timestamp = Timestamp.FromDateTime(record.Timestamp.ToUniversalTime()),
                        HeartRate = record.HeartRate,
                        BodyTemperature = record.BodyTemperature,
                        BloodPressure = record.BloodPressure,
                        BloodOxygen = record.BloodOxygen,
                        StepCount = record.StepCount,
                        ActivityStatus = (ActivityStatus)record.ActivityStatus,
                        Latitude = record.Latitude,
                        Longitude = record.Longitude,
                        SecureTransmissionStatus = record.SecureTransmissionStatus
                    });
                }
            }

            _logger.LogInformation($"request");

            return await Task.FromResult(response);
        }

    }
}