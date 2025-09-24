using Grpc.Core;
using Google.Protobuf.WellKnownTypes;
using DataManager.Data;
using DataManager.Models;

namespace DataManager.Services;

public class HealthDataService : HealthData.HealthDataBase
{
    private readonly HealthRecordDbContext _context;
    private readonly ILogger<HealthDataService> _logger;
    public HealthDataService(
        HealthRecordDbContext context,
        ILogger<HealthDataService> logger
        )
    {
        _logger = logger;
        _context = context;
    }

    public override async Task<Empty> CreateHealthRecord(
        IAsyncStreamReader<HealthRecordRequest> request,
        ServerCallContext context
    )
    {
        await foreach (var record in request.ReadAllAsync())
        {
            await _context.CreateHealthRecordAsync(record);
        }
        return new Empty();
    }

    public override async Task<HealthRecord> GetHealthRecord(HealthRecordIdRequest request, ServerCallContext context)
    {
        var record = await _context.GetHealthRecordAsync(request.RecordId);
        if (record == null)
        {
            throw new RpcException(new Status(StatusCode.NotFound, $"Record with ID {request.RecordId} not found."));
        }
        return record;
    }

    public override async Task GetAllHealthRecords(Empty request, IServerStreamWriter<HealthRecord> response, ServerCallContext context)
    {
        var records = await _context.GetAllHealthRecordsAsync();
        foreach (HealthRecord record in records)
        {
            await response.WriteAsync(record);
        }
    }

    public override async Task<Message> UpdateHealthRecord(HealthRecord request, ServerCallContext context)
    {
        var record = _context.UpdateHealthRecordAsync(request);
        if (record == null)
        {
            throw new RpcException(new Status(StatusCode.NotFound, $"Record with ID {request.RecordId} not found."));
        }
        return await Task.FromResult(record.Result);
    }

    public override async Task<Message> DeleteHealthRecord(HealthRecordIdRequest request, ServerCallContext context)
    {
        var record = await _context.DeleteHealthRecordAsync(request.RecordId);
        return await Task.FromResult(record.Result);
    }

    public override async Task GetAthleteHealthRecords(AthleteFilter request, IServerStreamWriter<HealthRecord> response, ServerCallContext context)
    {
        var records = await _context.GetAthleteHealthRecordsAsync(request.AthleteId, request.ActivityStatus);
        foreach (HealthRecord record in records)
        {
            await response.WriteAsync(record);
        }
    }

}
