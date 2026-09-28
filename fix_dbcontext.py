import re

with open('backend/src/SoftCare.Infrastructure/Persistence/ApplicationDbContext.cs', 'r', encoding='utf-8') as f:
    content = f.read()

config = """
        modelBuilder.Entity<VitalRecord>()
            .HasOne<Patient>()
            .WithMany()
            .HasForeignKey(v => v.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<CarePlan>()
            .HasOne<Patient>()
            .WithMany()
            .HasForeignKey(c => c.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<NursingNote>()
            .HasOne<Patient>()
            .WithMany()
            .HasForeignKey(n => n.PatientId)
            .OnDelete(DeleteBehavior.Cascade);
"""

content = content.replace("        modelBuilder.Entity<MedicalRecord>()", config + "\n        modelBuilder.Entity<MedicalRecord>()")

with open('backend/src/SoftCare.Infrastructure/Persistence/ApplicationDbContext.cs', 'w', encoding='utf-8') as f:
    f.write(content)
