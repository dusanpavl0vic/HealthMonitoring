namespace DataManager.Models;
public class HealthRecord
{
    public int RecordId { get; set; }
    public required string AthleteId { get; set; }
    public required DateTime Timestamp { get; set; }
    public required int HeartRate { get; set; }
    public required float BodyTemperature { get; set; }
    public required string BloodPressure { get; set; }
    public required int BloodOxygen { get; set; }
    public required int StepCount { get; set; }
    public required ActivityStatus ActivityStatus { get; set; }
    public required double Latitude { get; set; }
    public required double Longitude { get; set; }
    public required int SecureTransmissionStatus { get; set; }
}

public enum ActivityStatus
{
    Walking = 0,
    Cycling = 1,
    Running = 2,
    Resting = 3
}

