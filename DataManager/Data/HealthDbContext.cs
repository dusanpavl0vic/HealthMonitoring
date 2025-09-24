using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using Microsoft.EntityFrameworkCore;

namespace DataManager.Data;

public class HealthRecordDbContext : DbContext
{
    public HealthRecordDbContext(DbContextOptions<HealthRecordDbContext> options) : base(options)
    {
    }

    public DbSet<HealthRecord> HealthRecords { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<HealthRecord>()
            .HasKey(r => r.RecordId);

        modelBuilder.Entity<HealthRecord>()
            .Property(r => r.RecordId)
            .ValueGeneratedOnAdd();
    }
    public async Task CreateHealthRecordAsync(HealthRecordRequest record)
    {
        var entity = new HealthRecord
        {
            AthleteId = record.AthleteId,
            Timestamp = record.Timestamp,
            HeartRate = record.HeartRate,
            BodyTemperature = record.BodyTemperature,
            BloodPressure = record.BloodPressure,
            BloodOxygen = record.BloodOxygen,
            StepCount = record.StepCount,
            ActivityStatus = (ActivityStatus)record.ActivityStatus,
            Latitude = record.Latitude,
            Longitude = record.Longitude,
            SecureTransmissionStatus = record.SecureTransmissionStatus,
        };

        await HealthRecords.AddAsync(entity);
        await SaveChangesAsync();
    }

    public async Task<List<HealthRecord>> GetAthleteHealthRecordsAsync(string athleteId, ActivityStatus activityStatus)
    {
        return await HealthRecords
            .AsNoTracking()
            .Where(r => r.AthleteId == athleteId)
            .Where(r => r.ActivityStatus == activityStatus)
            .ToListAsync();
    }

    public async Task<List<HealthRecord>> GetAllHealthRecordsAsync()
    {
        return await HealthRecords
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<HealthRecord?> GetHealthRecordAsync(int recordId)
    {
        var result = await HealthRecords
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.RecordId == recordId);

        return result;
    }

    public async Task<Message> DeleteHealthRecordAsync(int recordId)
    {
        var record = await HealthRecords.FindAsync(recordId);
        if (record != null)
        {
            HealthRecords.Remove(record);
            await SaveChangesAsync();
        }

        return new Message { RecordId = recordId, Message_ = "Record was deleted" };
    }

    public async Task<Message> UpdateHealthRecordAsync(HealthRecord record)
    {
        HealthRecords.Update(record);
        await SaveChangesAsync();

        return new Message { RecordId = record.RecordId, Message_ = "Record was updated" };
    }
}