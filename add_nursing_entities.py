import re

with open('backend/src/SoftCare.Domain/Entities/Entities.cs', 'r', encoding='utf-8') as f:
    content = f.read()

new_entities = """

public class VitalRecord : BaseEntity
{
    public string PatientId { get; set; } = string.Empty;
    public string NurseId { get; set; } = string.Empty;
    public string NurseName { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    
    public int BloodPressureSys { get; set; }
    public int BloodPressureDia { get; set; }
    public int HeartRate { get; set; }
    public decimal Temperature { get; set; }
    public int SpO2 { get; set; }
    public int RespiratoryRate { get; set; }
    public int PainScale { get; set; }
    public decimal? BloodGlucose { get; set; }
    public string? Notes { get; set; }
}

public class CarePlan : BaseEntity
{
    public string PatientId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Frequency { get; set; } = string.Empty;
    public string Instructions { get; set; } = string.Empty;
    public string Status { get; set; } = "active"; // active, completed, paused
}

public class NursingNote : BaseEntity
{
    public string PatientId { get; set; } = string.Empty;
    public string NurseId { get; set; } = string.Empty;
    public string NurseName { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string Category { get; set; } = "observation"; // observation, transmission, incident
    public string Content { get; set; } = string.Empty;
}
"""

content = content + new_entities

with open('backend/src/SoftCare.Domain/Entities/Entities.cs', 'w', encoding='utf-8') as f:
    f.write(content)
