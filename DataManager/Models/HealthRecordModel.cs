using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataManager.Models
{
    [Table("health_data")]
    public class HealthRecordModel
    {
        [Key]
        [Column("record_id")]
        public int RecordId { get; set; }

        [Column("athlete_id")]
        public string AthleteId { get; set; } = null!;

        [Column("timestamp")]
        public DateTime Timestamp { get; set; }

        [Column("heart_rate")]
        public int HeartRate { get; set; }

        [Column("body_temperature")]
        public float BodyTemperature { get; set; }

        [Column("plood_pressure")]
        public string BloodPressure { get; set; } = null!;

        [Column("blood_oxygen")]
        public int BloodOxygen { get; set; }

        [Column("step_count")]
        public int StepCount { get; set; }

        [Column("activity_status")]
        public ActivityStatusModel ActivityStatus { get; set; }

        [Column("latitude")]
        public double Latitude { get; set; }

        [Column("longitude")]
        public double Longitude { get; set; }

        [Column("secure_transmission_status")]
        public int SecureTransmissionStatus { get; set; }
    }


    public enum ActivityStatusModel
    {
        Walking = 0,
        Cycling = 1,
        Running = 2,
        Resting = 3
    }

}