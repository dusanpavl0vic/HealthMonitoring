using Grpc.Core;
using Google.Protobuf.WellKnownTypes;
using DataManager.Data;
using DataManager.Models;
using DataManager.Grpc;
using Microsoft.AspNetCore.Builder.Extensions;
using System.Globalization;
using DataManager.MQTT;
using System.Text.Json;

namespace DataManager.Services;

public class HealthDataService : HealthData.HealthDataBase
{
    private readonly HealthRecordDbContext _context;
    private readonly MqttPublisher _mqttPublisher;
    private readonly ILogger<HealthDataService> _logger;

    public HealthDataService(
        HealthRecordDbContext context,
        ILogger<HealthDataService> logger,
        MqttPublisher mqttPublisher
    ) {
        _logger = logger;
        _context = context;
        _mqttPublisher = mqttPublisher;
    }

    public override async Task<Empty> CreateHealthRecord(
        HealthRecordRequest request,
        ServerCallContext context
    ){
        try
        {
            int recordId = await _context.CreateHealthRecordAsync(new HealthRecordModel
            {
                athleteId = request.AthleteId,
                timestamp = request.Timestamp.ToDateTime(),
                heartRate = request.HeartRate,
                bodyTemperature = request.BodyTemperature,
                bloodPressure = request.BloodPressure,
                bloodOxygen = request.BloodOxygen,
                stepCount = request.StepCount,
                activityStatus = (ActivityStatusModel)request.ActivityStatus,
                latitude = request.Latitude,
                longitude = request.Longitude,
                secureTransmissionStatus = request.SecureTransmissionStatus
            });

            HealthRecordModel record = new HealthRecordModel
            {
                recordId = recordId,
                athleteId = request.AthleteId,
                timestamp = request.Timestamp.ToDateTime(),
                heartRate = request.HeartRate,
                bodyTemperature = request.BodyTemperature,
                bloodPressure = request.BloodPressure,
                bloodOxygen = request.BloodOxygen,
                stepCount = request.StepCount,
                activityStatus = (ActivityStatusModel)request.ActivityStatus,
                latitude = request.Latitude,
                longitude = request.Longitude,
                secureTransmissionStatus = request.SecureTransmissionStatus
            };

            await _mqttPublisher.PublishAsync("health/records", record, retain: true);

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
                RecordId = record.recordId,
                AthleteId = record.athleteId,
                Timestamp = Timestamp.FromDateTime(record.timestamp.ToUniversalTime()),
                HeartRate = record.heartRate,
                BodyTemperature = record.bodyTemperature,
                BloodPressure = record.bloodPressure,
                BloodOxygen = record.bloodOxygen,
                StepCount = record.stepCount,
                ActivityStatus = (ActivityStatus)record.activityStatus,
                Latitude = record.latitude,
                Longitude = record.longitude,
                SecureTransmissionStatus = record.secureTransmissionStatus
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
                    RecordId = record.recordId,
                    AthleteId = record.athleteId,
                    Timestamp = Timestamp.FromDateTime(record.timestamp.ToUniversalTime()),
                    HeartRate = record.heartRate,
                    BodyTemperature = record.bodyTemperature,
                    BloodPressure = record.bloodPressure,
                    BloodOxygen = record.bloodOxygen,
                    StepCount = record.stepCount,
                    ActivityStatus = (ActivityStatus)record.activityStatus,
                    Latitude = record.latitude,
                    Longitude = record.longitude,
                    SecureTransmissionStatus = record.secureTransmissionStatus
                });
            }
        }

        return await Task.FromResult(response);
    }

    public override async Task<Message> UpdateHealthRecord(HealthRecord request, ServerCallContext context)
    {
        bool update = await _context.UpdateHealthRecordAsync(new HealthRecordModel
        {
            recordId = request.RecordId,
            athleteId = request.AthleteId,
            timestamp = request.Timestamp.ToDateTime(),
            heartRate = request.HeartRate,
            bodyTemperature = request.BodyTemperature,
            bloodPressure = request.BloodPressure,
            bloodOxygen = request.BloodOxygen,
            stepCount = request.StepCount,
            activityStatus = (ActivityStatusModel)request.ActivityStatus,
            latitude = request.Latitude,
            longitude = request.Longitude,
            secureTransmissionStatus = request.SecureTransmissionStatus
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
                    RecordId = record.recordId,
                    AthleteId = record.athleteId,
                    Timestamp = Timestamp.FromDateTime(record.timestamp.ToUniversalTime()),
                    HeartRate = record.heartRate,
                    BodyTemperature = record.bodyTemperature,
                    BloodPressure = record.bloodPressure,
                    BloodOxygen = record.bloodOxygen,
                    StepCount = record.stepCount,
                    ActivityStatus = (ActivityStatus)record.activityStatus,
                    Latitude = record.latitude,
                    Longitude = record.longitude,
                    SecureTransmissionStatus = record.secureTransmissionStatus
                });
            }
        }

        _logger.LogInformation($"request");

        return await Task.FromResult(response);
    }

}
