using DataManager.Grpc;
using DataManager.Models;
using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using Microsoft.EntityFrameworkCore;

namespace DataManager.Data
{

    public class HealthRecordDbContext : DbContext
    {
        public HealthRecordDbContext(DbContextOptions<HealthRecordDbContext> options) : base(options)
        {
        }

        public DbSet<HealthRecordModel> HealthRecords { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<HealthRecordModel>()
                .HasKey(r => r.RecordId);

            modelBuilder.Entity<HealthRecordModel>()
                .Property(r => r.RecordId)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<HealthRecordModel>(entity =>
            {
                entity.Property(e => e.ActivityStatus)
                    .HasConversion<string>()
                    .HasColumnName("Activity_Status");
            });
        }
        public async Task<int> CreateHealthRecordAsync(
            HealthRecordModel record
        )
        {
            await HealthRecords.AddAsync(record);
            await SaveChangesAsync();

            return record.RecordId;
        }

        public async Task<List<HealthRecordModel>?> GetAllHealthRecordsAsync()
        {
            return await HealthRecords
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<List<HealthRecordModel>?> GetAthleteHealthRecordsAsync(
            string athleteId,
            ActivityStatusModel? activityStatus,
            Timestamp? startTime,
            Timestamp? endTime
        )
        {
            var query = HealthRecords
                .AsNoTracking()
                .Where(r => r.AthleteId == athleteId);

            if (activityStatus.HasValue)
            {
                query = query.Where(r => r.ActivityStatus == activityStatus.Value);
            }

            if (startTime != null)
            {
                var start = startTime.ToDateTime().ToUniversalTime();
                query = query.Where(r => r.Timestamp >= start);
            }

            if (endTime != null)
            {
                var start = endTime.ToDateTime().ToUniversalTime();
                query = query.Where(r => r.Timestamp >= start);
            }

            return await query.ToListAsync();
        }


        public async Task<HealthRecordModel?> GetHealthRecordAsync(int recordId)
        {
            var result = await HealthRecords
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.RecordId == recordId);

            return result;
        }

        public async Task<bool> DeleteHealthRecordAsync(int recordId)
        {
            var record = await HealthRecords.FindAsync(recordId);
            if (record == null)
                return false;

            HealthRecords.Remove(record);
            await SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateHealthRecordAsync(HealthRecordModel record)
        {
            var exists = await HealthRecords.AnyAsync(r => r.RecordId == record.RecordId);
            if (!exists)
            {
                return false;
            }

            HealthRecords.Update(record);
            await SaveChangesAsync();

            return true;
        }
    }
}