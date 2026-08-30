using System;
using System.Collections.Generic;
using SoftCare.Domain.Common;

namespace SoftCare.Domain.Entities;

public class User : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "doctor"; // admin, doctor, nurse, pharmacist, receptionist, lab_tech, surgeon
    public string? DepartmentId { get; set; }
    public string? Phone { get; set; }
    public string? Avatar { get; set; }
    public string? Specialization { get; set; }
    public string? LicenseNumber { get; set; }
    public string Status { get; set; } = "active"; // active, inactive, on-leave
}

public class Patient : BaseEntity
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string Gender { get; set; } = "other"; // male, female, other
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? EmergencyContactName { get; set; }
    public string? EmergencyContactPhone { get; set; }
    public string? EmergencyContactRelationship { get; set; }
    public string? BloodType { get; set; }
    public string? SocialSecurityNumber { get; set; }
    public string? MaritalStatus { get; set; }
    public string? Occupation { get; set; }
    public string? PrimaryDoctorId { get; set; }
    public string? InsuranceId { get; set; }
    public string? InsurancePolicyNumber { get; set; }
    public string Status { get; set; } = "active"; // active, inactive, deceased
    public string AllergiesJson { get; set; } = "[]"; // JSON array of allergies
}

public class MedicalRecord : BaseEntity
{
    public string PatientId { get; set; } = string.Empty;
    public string DoctorId { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public string Type { get; set; } = "consultation"; // consultation, diagnosis, treatment, surgery, emergency, follow-up
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string SymptomsJson { get; set; } = "[]";
    public string Diagnosis { get; set; } = string.Empty;
    public string Treatment { get; set; } = string.Empty;
    public string? FollowUp { get; set; }
    public string? Notes { get; set; }
    public string Status { get; set; } = "active"; // draft, active, archived
    public ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
}

public class Prescription : BaseEntity
{
    public string MedicalRecordId { get; set; } = string.Empty;
    public string MedicationId { get; set; } = string.Empty;
    public string MedicationName { get; set; } = string.Empty;
    public string Dosage { get; set; } = string.Empty;
    public string Frequency { get; set; } = string.Empty;
    public string Duration { get; set; } = string.Empty;
    public string Instructions { get; set; } = string.Empty;
    public string Status { get; set; } = "pending"; // pending, dispensed, completed, cancelled
    public string? DispensedBy { get; set; }
    public DateTime? DispensedAt { get; set; }
}

public class Medication : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? GenericName { get; set; }
    public string Category { get; set; } = "Général";
    public string? Manufacturer { get; set; }
    public int Stock { get; set; } = 0;
    public int MinStock { get; set; } = 10;
    public decimal Price { get; set; } = 0;
    public DateTime? ExpiryDate { get; set; }
    public string? BatchNumber { get; set; }
    public string? Barcode { get; set; }
    public string? QrCode { get; set; }
    public string? Description { get; set; }
    public string DosageForm { get; set; } = "tablet"; // tablet, capsule, injection, syrup, cream, drops
    public string? Strength { get; set; }
    public bool RequiresPrescription { get; set; } = false;
    public string? Location { get; set; }
    public string? Supplier { get; set; }
    public string StorageCondition { get; set; } = "ambient"; // ambient, cold_2_8, frozen_minus_20, cryo_minus_80
    public bool IsBiotech { get; set; } = false;
    public string? AtcCode { get; set; }
    public string Status { get; set; } = "active";
}

public class MedicationMovement : BaseEntity
{
    public string MedicationId { get; set; } = string.Empty;
    public string Type { get; set; } = "out"; // in, out, adjustment, return
    public int Quantity { get; set; } = 0;
    public string Reason { get; set; } = string.Empty;
    public string PerformedBy { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public string? ReferenceId { get; set; }
}

public class Appointment : BaseEntity
{
    public string PatientId { get; set; } = string.Empty;
    public string? DoctorId { get; set; }
    public DateTime Date { get; set; }
    public string Time { get; set; } = "09:00";
    public int DurationMinutes { get; set; } = 30;
    public string Type { get; set; } = "consultation"; // consultation, follow-up, emergency, surgery, checkup
    public string Status { get; set; } = "scheduled"; // scheduled, confirmed, in-progress, completed, cancelled, no-show
    public string? Reason { get; set; }
    public string? Notes { get; set; }
    public string? RoomId { get; set; }
}

public class Invoice : BaseEntity
{
    public string InvoiceNumber { get; set; } = string.Empty;
    public string PatientId { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public DateTime? DueDate { get; set; }
    public decimal Subtotal { get; set; }
    public decimal TaxRate { get; set; } = 20;
    public decimal TaxAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal Total { get; set; }
    public string Status { get; set; } = "sent"; // draft, sent, paid, partial, cancelled, overdue
    public string? Notes { get; set; }
    public string? CreatedBy { get; set; }
    public ICollection<InvoiceItem> Items { get; set; } = new List<InvoiceItem>();
}

public class InvoiceItem : BaseEntity
{
    public string InvoiceId { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Type { get; set; } // consultation, procedure, medication, lab, room, other
    public int Quantity { get; set; } = 1;
    public decimal UnitPrice { get; set; }
    public decimal Total { get; set; }
}

public class Bed : BaseEntity
{
    public string RoomNumber { get; set; } = string.Empty;
    public string BedNumber { get; set; } = string.Empty;
    public string? DepartmentId { get; set; }
    public string Type { get; set; } = "standard"; // standard, icu, pediatric, maternity, emergency
    public string Status { get; set; } = "available"; // available, occupied, maintenance, reserved
    public string? CurrentPatientId { get; set; }
    public string? CurrentAdmissionId { get; set; }
    public decimal DailyRate { get; set; } = 150;
}

public class Admission : BaseEntity
{
    public string PatientId { get; set; } = string.Empty;
    public string BedId { get; set; } = string.Empty;
    public string DoctorId { get; set; } = string.Empty;
    public string Type { get; set; } = "planned"; // planned, emergency, transfer
    public string Reason { get; set; } = string.Empty;
    public DateTime AdmissionDate { get; set; } = DateTime.UtcNow;
    public DateTime? ExpectedDischargeDate { get; set; }
    public DateTime? ActualDischargeDate { get; set; }
    public string Status { get; set; } = "admitted"; // pending, admitted, discharged, transferred
    public string? DepartmentId { get; set; }
    public string? Notes { get; set; }
    public string? DischargeSummary { get; set; }
}

public class LabTest : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Category { get; set; } = "blood"; // blood, urine, imaging, biopsy, genetic, other
    public string? Description { get; set; }
    public string? SampleType { get; set; }
    public string? TurnaroundTime { get; set; }
    public decimal Price { get; set; }
    public string ReferenceRangesJson { get; set; } = "[]";
}

public class LabOrder : BaseEntity
{
    public string PatientId { get; set; } = string.Empty;
    public string DoctorId { get; set; } = string.Empty;
    public string Priority { get; set; } = "routine"; // routine, urgent, stat
    public string Status { get; set; } = "pending"; // pending, collected, in-progress, completed, cancelled
    public string TestsJson { get; set; } = "[]"; // List of tests & results
    public string? Notes { get; set; }
    public DateTime? CollectedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}

public class EmergencyVisit : BaseEntity
{
    public string PatientId { get; set; } = string.Empty;
    public DateTime ArrivalTime { get; set; } = DateTime.UtcNow;
    public string ArrivalMode { get; set; } = "walking"; // walking, ambulance, helicopter, police, other
    public string ChiefComplaint { get; set; } = string.Empty;
    public int TriageLevel { get; set; } = 3; // 1 (Vital Emergency) to 5 (Non-urgent)
    public DateTime TriageTime { get; set; } = DateTime.UtcNow;
    public string TriageBy { get; set; } = string.Empty;
    public string Status { get; set; } = "waiting"; // waiting, in-treatment, admitted, discharged, transferred, left-ama
    public string? AssignedDoctorId { get; set; }
    public string? AssignedBedId { get; set; }
    public string? Notes { get; set; }
}

public class Surgery : BaseEntity
{
    public string PatientId { get; set; } = string.Empty;
    public string? AdmissionId { get; set; }
    public DateTime ScheduledDate { get; set; }
    public string ScheduledTime { get; set; } = "09:00";
    public int DurationMinutes { get; set; } = 60;
    public string Type { get; set; } = "elective"; // elective, urgent, emergency
    public string Procedure { get; set; } = string.Empty;
    public string SurgeonId { get; set; } = string.Empty;
    public string? AnesthesiologistId { get; set; }
    public string? OperatingRoomId { get; set; }
    public string Status { get; set; } = "scheduled"; // scheduled, pre-op, in-progress, completed, cancelled
    public string? AnesthesiaType { get; set; }
    public string? PreOpDiagnosis { get; set; }
    public string? PostOpDiagnosis { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
}

// ============= BIOTECH & MÉDECINE DE PRÉCISION =============

public class GenomicProfile : BaseEntity
{
    public string PatientId { get; set; } = string.Empty;
    public string PatientName { get; set; } = string.Empty;
    public DateTime TestDate { get; set; } = DateTime.UtcNow;
    public string PanelName { get; set; } = "Cardio-PGx & Métabolisme";
    public string GenesJson { get; set; } = "[]"; // Variants, Diplotypes, Phenotypes
    public string PhenotypesJson { get; set; } = "{}";
    public string RecommendationsJson { get; set; } = "[]";
    public string Status { get; set; } = "validated"; // draft, validated, archived
    public string? LabTechnicianId { get; set; }
    public string? Notes { get; set; }
}

public class BioSample : BaseEntity
{
    public string SampleCode { get; set; } = string.Empty;
    public string PatientId { get; set; } = string.Empty;
    public string? PatientName { get; set; }
    public string SampleType { get; set; } = "DNA"; // DNA, RNA, Plasma, Serum, Tissue Biopsy, Bone Marrow, Cell Culture
    public DateTime CollectionDate { get; set; } = DateTime.UtcNow;
    public decimal VolumeMl { get; set; } = 1.0m;
    public string? Concentration { get; set; }
    public string FreezerId { get; set; } = "FRZ-80-01";
    public string RackNumber { get; set; } = "Rack-01";
    public string BoxNumber { get; set; } = "Boîte-01";
    public string WellPosition { get; set; } = "A01";
    public string StorageTemp { get; set; } = "-80°C"; // -80°C, -196°C, -20°C, 4°C
    public bool ConsentSigned { get; set; } = true;
    public string ConsentType { get; set; } = "Research & Diagnostics";
    public string QualityScore { get; set; } = "A";
    public string Status { get; set; } = "available"; // available, reserved, depleted, destroyed
    public string? Notes { get; set; }
}

public class BiobankFreezer : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Temperature { get; set; } = "-80°C";
    public string Location { get; set; } = string.Empty;
    public int CapacityBoxes { get; set; } = 100;
    public int UsedBoxes { get; set; } = 0;
    public string Status { get; set; } = "optimal";
}

public class ClinicalTrial : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Phase { get; set; } = "Phase II"; // Phase I, Phase II, Phase III, Phase IV, Translational
    public string PrincipalInvestigator { get; set; } = string.Empty;
    public int TargetEnrollment { get; set; } = 50;
    public int CurrentEnrollment { get; set; } = 0;
    public DateTime StartDate { get; set; } = DateTime.UtcNow;
    public DateTime? EndDate { get; set; }
    public string Status { get; set; } = "recruiting"; // recruiting, active, completed, suspended
    public string Description { get; set; } = string.Empty;
    public string InclusionCriteriaJson { get; set; } = "[]";
    public string ExclusionCriteriaJson { get; set; } = "[]";
}

public class Department : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? HeadId { get; set; }
    public string? Description { get; set; }
    public string? Location { get; set; }
    public string? Phone { get; set; }
    public string Type { get; set; } = "medical"; // medical, surgical, support, administrative
    public int Beds { get; set; } = 0;
}

public class OrganizationSetting : BaseEntity
{
    public string Name { get; set; } = "SoftCare Hôpital";
    public string Type { get; set; } = "hospital";
    public string Address { get; set; } = "123 Avenue de la Santé";
    public string City { get; set; } = "Paris";
    public string Country { get; set; } = "France";
    public string Phone { get; set; } = "+33 1 23 45 67 89";
    public string Email { get; set; } = "contact@softcare.fr";
    public string Currency { get; set; } = "EUR";
    public string CurrencySymbol { get; set; } = "€";
    public decimal TaxRate { get; set; } = 20;
    public string TaxName { get; set; } = "TVA";
    public string HeaderColor { get; set; } = "#0e7490";
    public string PrimaryColor { get; set; } = "#0891b2";
}

public class AuditLog : BaseEntity
{
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string UserRole { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty; // "CONSULTATION", "MODIFICATION", "EXPORT_DPI", "PGX_ACCES", "DELIVRANCE_POS"
    public string ResourceType { get; set; } = string.Empty; // "Patient", "MedicalRecord", "GenomicProfile", "Medication", "Invoice"
    public string ResourceId { get; set; } = string.Empty;
    public string PatientName { get; set; } = string.Empty;
    public string IpAddress { get; set; } = "192.168.1.50";
    public string UserAgent { get; set; } = "SoftCare WebApp/2.4";
    public string SecurityHash { get; set; } = string.Empty; // Empreinte cryptographique HMAC-SHA256 non répudiable
    public string DetailsJson { get; set; } = "{}";
}

