using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataManager.Models;

[Table("health_data")]
public class HealthRecordModel
{
    [Key]
    [Column("record_id")]
    public int recordId { get; set; }

    [Column("athlete_id")]
    public string athleteId { get; set; } = null!;

    [Column("timestamp")]
    public DateTime timestamp { get; set; }

    [Column("heart_rate")]
    public int heartRate { get; set; }

    [Column("body_temperature")]
    public float bodyTemperature { get; set; }

    [Column("plood_pressure")]
    public string bloodPressure { get; set; } = null!;

    [Column("blood_oxygen")]
    public int bloodOxygen { get; set; }

    [Column("step_count")]
    public int stepCount { get; set; }

    [Column("activity_status")]
    public ActivityStatusModel activityStatus { get; set; }

    [Column("latitude")]
    public double latitude { get; set; }

    [Column("longitude")]
    public double longitude { get; set; }

    [Column("secure_transmission_status")]
    public int secureTransmissionStatus { get; set; }
}


public enum ActivityStatusModel
{
    Walking = 0,
    Cycling = 1,
    Running = 2,
    Resting = 3
}

