using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SoftCare.Domain.Entities;

namespace SoftCare.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Patient> Patients { get; }
    DbSet<MedicalRecord> MedicalRecords { get; }
    DbSet<Prescription> Prescriptions { get; }
    DbSet<Medication> Medications { get; }
    DbSet<MedicationMovement> MedicationMovements { get; }
    DbSet<Appointment> Appointments { get; }
    DbSet<Invoice> Invoices { get; }
    DbSet<InvoiceItem> InvoiceItems { get; }
    DbSet<Bed> Beds { get; }
    DbSet<Admission> Admissions { get; }
    DbSet<LabTest> LabTests { get; }
    DbSet<LabOrder> LabOrders { get; }
    DbSet<EmergencyVisit> EmergencyVisits { get; }
    DbSet<Surgery> Surgeries { get; }
    DbSet<GenomicProfile> GenomicProfiles { get; }
    DbSet<BioSample> BioSamples { get; }
    DbSet<BiobankFreezer> BiobankFreezers { get; }
    DbSet<ClinicalTrial> ClinicalTrials { get; }
    DbSet<Department> Departments { get; }
    DbSet<OrganizationSetting> OrganizationSettings { get; }
    DbSet<AuditLog> AuditLogs { get; }
    DbSet<PharmacySale> PharmacySales { get; }
    DbSet<PharmacySaleItem> PharmacySaleItems { get; }

    DbSet<VitalRecord> VitalRecords { get; }
    DbSet<CarePlan> CarePlans { get; }
    DbSet<NursingNote> NursingNotes { get; }


    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
