using Microsoft.EntityFrameworkCore;

namespace DataManager.Data;

class HealthRecordDbContext : DbContext
{
    public HealthRecordDbContext(DbContextOptions<HealthRecordDbContext> options) : base(options)
    {
    }

    public DbSet<HealthRecord> HealthRecords { get; set; }

    public async Task CreateHealthRecordAsync(HealthRecord record)
    {
        await HealthRecords.AddAsync(record);
        await SaveChangesAsync();
    }

    public async Task<List<HealthRecord>> GetAthleteHealthRecordsAsync(string athleteId)
    {
        return await HealthRecords
            .AsNoTracking()
            .Where(r => r.AthleteId == athleteId)
            .ToListAsync();
    }

    public async Task<List<HealthRecord>> GetAllHealthRecordsAsync()
    {
        return await HealthRecords
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<HealthRecord?> GetHealthRecord(int recordId)
    {
        return await HealthRecords
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.RecordId == recordId);
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