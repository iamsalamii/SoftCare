using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SoftCare.Application.Common.Interfaces;
using SoftCare.Domain.Entities;

namespace SoftCare.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Patient> Patients => Set<Patient>();
    public DbSet<MedicalRecord> MedicalRecords => Set<MedicalRecord>();
    public DbSet<Prescription> Prescriptions => Set<Prescription>();
    public DbSet<Medication> Medications => Set<Medication>();
    public DbSet<MedicationMovement> MedicationMovements => Set<MedicationMovement>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<InvoiceItem> InvoiceItems => Set<InvoiceItem>();
    public DbSet<Bed> Beds => Set<Bed>();
    public DbSet<Admission> Admissions => Set<Admission>();
    public DbSet<LabTest> LabTests => Set<LabTest>();
    public DbSet<LabOrder> LabOrders => Set<LabOrder>();
    public DbSet<EmergencyVisit> EmergencyVisits => Set<EmergencyVisit>();
    public DbSet<Surgery> Surgeries => Set<Surgery>();
    public DbSet<GenomicProfile> GenomicProfiles => Set<GenomicProfile>();
    public DbSet<BioSample> BioSamples => Set<BioSample>();
    public DbSet<BiobankFreezer> BiobankFreezers => Set<BiobankFreezer>();
    public DbSet<ClinicalTrial> ClinicalTrials => Set<ClinicalTrial>();
    public DbSet<Department> Departments => Set<Department>();
    public DbSet<OrganizationSetting> OrganizationSettings => Set<OrganizationSetting>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Indexes for performance in healthcare lookups
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Patient>()
            .HasIndex(p => p.SocialSecurityNumber);

        modelBuilder.Entity<Medication>()
            .HasIndex(m => m.Barcode);

        modelBuilder.Entity<Medication>()
            .HasIndex(m => m.BatchNumber);

        modelBuilder.Entity<BioSample>()
            .HasIndex(b => b.SampleCode)
            .IsUnique();

        modelBuilder.Entity<MedicalRecord>()
            .HasMany(m => m.Prescriptions)
            .WithOne()
            .HasForeignKey(p => p.MedicalRecordId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Invoice>()
            .HasMany(i => i.Items)
            .WithOne()
            .HasForeignKey(item => item.InvoiceId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
