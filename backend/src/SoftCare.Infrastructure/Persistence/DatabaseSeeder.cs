using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SoftCare.Domain.Entities;

namespace SoftCare.Infrastructure.Persistence;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // 1. Ensure Organization Settings
        if (!await context.OrganizationSettings.AnyAsync())
        {
            context.OrganizationSettings.Add(new OrganizationSetting
            {
                Id = "1",
                Name = "SoftCare Hôpital Universitaire",
                Type = "hospital",
                Address = "123 Avenue de la Santé",
                City = "Paris",
                Country = "France",
                Phone = "+33 1 23 45 67 89",
                Email = "contact@softcare.fr",
                Currency = "EUR",
                CurrencySymbol = "€",
                TaxRate = 20,
                TaxName = "TVA",
                HeaderColor = "#0e7490",
                PrimaryColor = "#0891b2"
            });
        }

        // 2. Ensure Departments
        if (!await context.Departments.AnyAsync())
        {
            context.Departments.AddRange(
                new Department { Id = "1", Name = "Cardiologie", Code = "CARD", Location = "Bâtiment A, 2ème étage", Type = "medical", Beds = 30 },
                new Department { Id = "2", Name = "Chirurgie & Bloc", Code = "CHIR", Location = "Bâtiment B, RDC", Type = "surgical", Beds = 25 },
                new Department { Id = "3", Name = "Urgences & Triage", Code = "URG", Location = "Bâtiment Principal, RDC", Type = "medical", Beds = 15 },
                new Department { Id = "5", Name = "Pharmacie Hospitalière", Code = "PHARM", Location = "Bâtiment Principal, Sous-sol", Type = "support", Beds = 0 },
                new Department { Id = "6", Name = "Laboratoire & Biotech", Code = "LAB", Location = "Bâtiment B, 1er étage", Type = "support", Beds = 0 }
            );
        }

        // 3. Ensure Users (Password for all: demo123)
        if (!await context.Users.AnyAsync())
        {
            var hashedPw = BCrypt.Net.BCrypt.HashPassword("demo123");
            context.Users.AddRange(
                new User
                {
                    Id = "1",
                    Name = "Dr. Marie Dubois",
                    Email = "marie.dubois@hopital.fr",
                    PasswordHash = hashedPw,
                    Role = "doctor",
                    DepartmentId = "1",
                    Phone = "+33 1 23 45 67 89",
                    Specialization = "Cardiologie",
                    LicenseNumber = "MED-2015-0042",
                    Status = "active"
                },
                new User
                {
                    Id = "2",
                    Name = "Sophie Martin",
                    Email = "sophie.martin@hopital.fr",
                    PasswordHash = hashedPw,
                    Role = "nurse",
                    DepartmentId = "3",
                    Phone = "+33 1 23 45 67 90",
                    Status = "active"
                },
                new User
                {
                    Id = "3",
                    Name = "Pierre Leroy",
                    Email = "pierre.leroy@hopital.fr",
                    PasswordHash = hashedPw,
                    Role = "pharmacist",
                    DepartmentId = "5",
                    Phone = "+33 1 23 45 67 91",
                    LicenseNumber = "PHA-2018-0023",
                    Status = "active"
                },
                new User
                {
                    Id = "4",
                    Name = "Admin Système",
                    Email = "admin@hopital.fr",
                    PasswordHash = hashedPw,
                    Role = "admin",
                    Status = "active"
                },
                new User
                {
                    Id = "5",
                    Name = "Dr. Thomas Leroy",
                    Email = "thomas.leroy@hopital.fr",
                    PasswordHash = hashedPw,
                    Role = "surgeon",
                    DepartmentId = "2",
                    Specialization = "Chirurgie Viscérale & Oncologique",
                    Status = "active"
                },
                new User
                {
                    Id = "6",
                    Name = "Claire Fontaine",
                    Email = "claire.fontaine@hopital.fr",
                    PasswordHash = hashedPw,
                    Role = "lab_tech",
                    DepartmentId = "6",
                    Specialization = "Génétique Moléculaire",
                    Status = "active"
                }
            );
        }

        // 4. Ensure Patients
        if (!await context.Patients.AnyAsync())
        {
            context.Patients.AddRange(
                new Patient
                {
                    Id = "1",
                    FirstName = "Jean",
                    LastName = "Dupont",
                    DateOfBirth = new DateTime(1980, 5, 15, 0, 0, 0, DateTimeKind.Utc),
                    Gender = "male",
                    Phone = "+33 6 12 34 56 78",
                    Email = "jean.dupont@email.fr",
                    Address = "123 Rue de la Paix",
                    City = "Paris",
                    BloodType = "A+",
                    SocialSecurityNumber = "1 80 05 75 001 123",
                    AllergiesJson = "[\"Pénicilline\", \"Aspirine\"]",
                    Status = "active"
                },
                new Patient
                {
                    Id = "2",
                    FirstName = "Anne",
                    LastName = "Bernard",
                    DateOfBirth = new DateTime(1992, 8, 22, 0, 0, 0, DateTimeKind.Utc),
                    Gender = "female",
                    Phone = "+33 6 23 45 67 89",
                    Email = "anne.bernard@email.fr",
                    Address = "45 Avenue Victor Hugo",
                    City = "Lyon",
                    BloodType = "O-",
                    SocialSecurityNumber = "2 92 08 69 002 456",
                    AllergiesJson = "[\"Iode\"]",
                    Status = "active"
                }
            );
        }

        // 5. Ensure Medications with Barcodes & Biotech Info
        if (!await context.Medications.AnyAsync())
        {
            context.Medications.AddRange(
                new Medication
                {
                    Id = "1",
                    Name = "Doliprane 1000mg",
                    GenericName = "Paracétamol",
                    Category = "Antalgique",
                    Manufacturer = "Sanofi",
                    Stock = 500,
                    MinStock = 100,
                    Price = 2.85m,
                    ExpiryDate = new DateTime(2026, 12, 31, 0, 0, 0, DateTimeKind.Utc),
                    BatchNumber = "DOL-2026-A1",
                    Barcode = "3400938472910",
                    QrCode = "SOFTCARE|MED:Doliprane|LOT:DOL-2026-A1",
                    DosageForm = "tablet",
                    Strength = "1000mg",
                    StorageCondition = "ambient",
                    RequiresPrescription = false,
                    Location = "Étagère A1"
                },
                new Medication
                {
                    Id = "2",
                    Name = "Amoxicilline 500mg",
                    GenericName = "Amoxicilline trihydrate",
                    Category = "Antibiotique",
                    Manufacturer = "Biogaran",
                    Stock = 250,
                    MinStock = 50,
                    Price = 8.90m,
                    ExpiryDate = new DateTime(2026, 6, 30, 0, 0, 0, DateTimeKind.Utc),
                    BatchNumber = "AMX-2026-B4",
                    Barcode = "3400938472927",
                    DosageForm = "capsule",
                    Strength = "500mg",
                    StorageCondition = "ambient",
                    RequiresPrescription = true,
                    Location = "Étagère B2"
                },
                new Medication
                {
                    Id = "4",
                    Name = "Plavix 75mg (PGx Cible)",
                    GenericName = "Clopidogrel",
                    Category = "Antiagrégant",
                    Manufacturer = "Sanofi",
                    Stock = 180,
                    MinStock = 40,
                    Price = 18.50m,
                    ExpiryDate = new DateTime(2026, 11, 20, 0, 0, 0, DateTimeKind.Utc),
                    BatchNumber = "PLV-2026-D2",
                    Barcode = "3400938472941",
                    DosageForm = "tablet",
                    Strength = "75mg",
                    StorageCondition = "ambient",
                    IsBiotech = true,
                    AtcCode = "B01AC04",
                    RequiresPrescription = true,
                    Location = "Étagère A2"
                },
                new Medication
                {
                    Id = "5",
                    Name = "Lantus SoloStar (Chaîne Froid)",
                    GenericName = "Insuline Glargine",
                    Category = "Antidiabétique",
                    Manufacturer = "Sanofi-Aventis",
                    Stock = 30,
                    MinStock = 50,
                    Price = 45.00m,
                    ExpiryDate = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc),
                    BatchNumber = "LAN-2026-E9",
                    Barcode = "3400938472958",
                    DosageForm = "injection",
                    Strength = "100 U/ml",
                    StorageCondition = "cold_2_8",
                    IsBiotech = true,
                    RequiresPrescription = true,
                    Location = "Réfrigérateur R1 (2-8°C)"
                },
                new Medication
                {
                    Id = "6",
                    Name = "Herceptin 150mg (Biothérapie)",
                    GenericName = "Trastuzumab",
                    Category = "Oncologie / Biothérapie",
                    Manufacturer = "Roche",
                    Stock = 15,
                    MinStock = 10,
                    Price = 680.00m,
                    ExpiryDate = new DateTime(2027, 1, 15, 0, 0, 0, DateTimeKind.Utc),
                    BatchNumber = "HER-2026-BT01",
                    Barcode = "3400938472965",
                    DosageForm = "injection",
                    Strength = "150mg",
                    StorageCondition = "cold_2_8",
                    IsBiotech = true,
                    AtcCode = "L01FD01",
                    RequiresPrescription = true,
                    Location = "Chambre Froide Oncologie (2-8°C)"
                }
            );
        }

        // 6. Ensure Biotech Samples & Genomic Profiles
        if (!await context.GenomicProfiles.AnyAsync())
        {
            context.GenomicProfiles.AddRange(
                new GenomicProfile
                {
                    Id = "1",
                    PatientId = "1",
                    PatientName = "Jean Dupont",
                    TestDate = new DateTime(2025, 11, 10, 0, 0, 0, DateTimeKind.Utc),
                    PanelName = "Cardio-PGx & Métabolisme Élargi",
                    GenesJson = "[{\"gene\":\"CYP2C19\",\"diplotype\":\"*2/*2\",\"phenotype\":\"Poor Metabolizer\",\"clinicalImpact\":\"Incapacité à bioactiver le clopidogrel (Plavix).\"}]",
                    PhenotypesJson = "{\"CYP2C19\":\"Métaboliseur Lent (*2/*2)\",\"CYP2D6\":\"Métaboliseur Normal (*1/*1)\"}",
                    RecommendationsJson = "[\"Éviter le Clopidogrel (Plavix) : Remplacer par Prasugrel ou Ticagrelor.\"]",
                    Status = "validated"
                }
            );
        }

        if (!await context.BiobankFreezers.AnyAsync())
        {
            context.BiobankFreezers.AddRange(
                new BiobankFreezer { Id = "FRZ-80-01", Name = "CryoConservateur Principal A (-80°C)", Temperature = "-80°C", Location = "Labo Biotech - Salle Cryo 01", CapacityBoxes = 100, UsedBoxes = 42, Status = "optimal" },
                new BiobankFreezer { Id = "FRZ-196-01", Name = "Cuve Azote Liquide N2 (-196°C)", Temperature = "-196°C (Azote Liquide)", Location = "Sous-sol Biobanque sécurisée", CapacityBoxes = 50, UsedBoxes = 28, Status = "optimal" }
            );
        }

        if (!await context.BioSamples.AnyAsync())
        {
            context.BioSamples.AddRange(
                new BioSample
                {
                    Id = "1",
                    SampleCode = "BS-2026-DNA-0142",
                    PatientId = "1",
                    PatientName = "Jean Dupont",
                    SampleType = "DNA",
                    CollectionDate = new DateTime(2025, 11, 10, 0, 0, 0, DateTimeKind.Utc),
                    VolumeMl = 0.5m,
                    Concentration = "145 ng/µL",
                    FreezerId = "FRZ-80-01",
                    RackNumber = "Rack-03",
                    BoxNumber = "Boîte-ADN-12",
                    WellPosition = "C04",
                    StorageTemp = "-80°C",
                    ConsentSigned = true,
                    Status = "available"
                }
            );
        }

        // 7. Ensure Beds
        if (!await context.Beds.AnyAsync())
        {
            context.Beds.AddRange(
                new Bed { Id = "1", RoomNumber = "101", BedNumber = "A", DepartmentId = "1", Type = "standard", Status = "available", DailyRate = 150 },
                new Bed { Id = "2", RoomNumber = "101", BedNumber = "B", DepartmentId = "1", Type = "standard", Status = "available", DailyRate = 150 },
                new Bed { Id = "3", RoomNumber = "ICU-01", BedNumber = "1", DepartmentId = "1", Type = "icu", Status = "available", DailyRate = 500 }
            );
        }

        await context.SaveChangesAsync();
    }
}
