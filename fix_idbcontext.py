import re

with open('backend/src/SoftCare.Application/Common/Interfaces/IApplicationDbContext.cs', 'r', encoding='utf-8') as f:
    content = f.read()

dbsets = """
    DbSet<VitalRecord> VitalRecords { get; }
    DbSet<CarePlan> CarePlans { get; }
    DbSet<NursingNote> NursingNotes { get; }
"""

content = content.replace("DbSet<PharmacySaleItem> PharmacySaleItems { get; }", "DbSet<PharmacySaleItem> PharmacySaleItems { get; }\n" + dbsets)

with open('backend/src/SoftCare.Application/Common/Interfaces/IApplicationDbContext.cs', 'w', encoding='utf-8') as f:
    f.write(content)
