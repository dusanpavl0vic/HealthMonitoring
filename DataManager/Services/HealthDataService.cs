using Grpc.Core;
using DataManager;
using Google.Protobuf.WellKnownTypes;
using Microsoft.AspNetCore.Hosting.Server;

namespace DataManager.Services;

public class HealthDataService : HealthData.HealthDataBase
{
    private readonly ILogger<HealthDataService> _logger;
    public HealthDataService(ILogger<HealthDataService> logger)
    {
        _logger = logger;
    }

    public override async Task<Empty> CreateHealthRecords(
        IAsyncStreamReader<HealthRecordRequest> requestStream,
        ServerCallContext context)
    {
        await foreach (var request in requestStream.ReadAllAsync())
        {
            // Process each HealthRecordRequest here
            // For example: Save to database, log, etc.
            _logger.LogInformation($"Received HealthRecordRequest: {request}");
        }
        return new Empty();
    }
}
