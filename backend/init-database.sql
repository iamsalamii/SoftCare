-- ==========================================================
-- SOFTCARE HOSPITAL MANAGEMENT & BIOTECH DATABASE SCHEMA
-- Target Database: PostgreSQL 14+ / 16+
-- ==========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Table Utilisateurs
CREATE TABLE IF NOT EXISTS "Users" (
    "Id" TEXT PRIMARY KEY,
    "Name" VARCHAR(255) NOT NULL,
    "Email" VARCHAR(255) UNIQUE NOT NULL,
    "PasswordHash" TEXT NOT NULL,
    "Role" VARCHAR(50) NOT NULL,
    "DepartmentId" TEXT,
    "Phone" VARCHAR(50),
    "Avatar" TEXT,
    "Specialization" VARCHAR(255),
    "LicenseNumber" VARCHAR(100),
    "Status" VARCHAR(50) DEFAULT 'active',
    "IsActive" BOOLEAN DEFAULT TRUE,
    "CreatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMPTZ
);

-- 2. Table Patients
CREATE TABLE IF NOT EXISTS "Patients" (
    "Id" TEXT PRIMARY KEY,
    "FirstName" VARCHAR(100) NOT NULL,
    "LastName" VARCHAR(100) NOT NULL,
    "DateOfBirth" DATE NOT NULL,
    "Gender" VARCHAR(20) NOT NULL,
    "Phone" VARCHAR(50) NOT NULL,
    "Email" VARCHAR(255),
    "Address" TEXT,
    "City" VARCHAR(100),
    "EmergencyContactName" VARCHAR(255),
    "EmergencyContactPhone" VARCHAR(50),
    "EmergencyContactRelationship" VARCHAR(50),
    "BloodType" VARCHAR(10),
    "SocialSecurityNumber" VARCHAR(50),
    "MaritalStatus" VARCHAR(50),
    "Occupation" VARCHAR(100),
    "PrimaryDoctorId" TEXT,
    "InsuranceId" TEXT,
    "InsurancePolicyNumber" VARCHAR(100),
    "AllergiesJson" JSONB DEFAULT '[]',
    "Status" VARCHAR(50) DEFAULT 'active',
    "IsActive" BOOLEAN DEFAULT TRUE,
    "CreatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS "IX_Patients_SSN" ON "Patients" ("SocialSecurityNumber");

-- 3. Table Médicaments & Pharmacie
CREATE TABLE IF NOT EXISTS "Medications" (
    "Id" TEXT PRIMARY KEY,
    "Name" VARCHAR(255) NOT NULL,
    "GenericName" VARCHAR(255),
    "Category" VARCHAR(100) DEFAULT 'Général',
    "Manufacturer" VARCHAR(255),
    "Stock" INT DEFAULT 0,
    "MinStock" INT DEFAULT 10,
    "Price" NUMERIC(12, 2) DEFAULT 0.00,
    "ExpiryDate" DATE,
    "BatchNumber" VARCHAR(100),
    "Barcode" VARCHAR(100),
    "QrCode" TEXT,
    "Description" TEXT,
    "DosageForm" VARCHAR(50) DEFAULT 'tablet',
    "Strength" VARCHAR(50),
    "RequiresPrescription" BOOLEAN DEFAULT FALSE,
    "Location" VARCHAR(100),
    "Supplier" VARCHAR(255),
    "StorageCondition" VARCHAR(50) DEFAULT 'ambient',
    "IsBiotech" BOOLEAN DEFAULT FALSE,
    "AtcCode" VARCHAR(50),
    "Status" VARCHAR(50) DEFAULT 'active',
    "IsActive" BOOLEAN DEFAULT TRUE,
    "CreatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS "IX_Medications_Barcode" ON "Medications" ("Barcode");
CREATE INDEX IF NOT EXISTS "IX_Medications_BatchNumber" ON "Medications" ("BatchNumber");

-- 4. Table Mouvements de Stock
CREATE TABLE IF NOT EXISTS "MedicationMovements" (
    "Id" TEXT PRIMARY KEY,
    "MedicationId" TEXT REFERENCES "Medications"("Id") ON DELETE CASCADE,
    "Type" VARCHAR(50) NOT NULL,
    "Quantity" INT NOT NULL,
    "Reason" TEXT NOT NULL,
    "PerformedBy" VARCHAR(255) NOT NULL,
    "Date" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "ReferenceId" TEXT,
    "IsActive" BOOLEAN DEFAULT TRUE,
    "CreatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMPTZ
);

-- 5. Table Dossiers Médicaux & Prescriptions
CREATE TABLE IF NOT EXISTS "MedicalRecords" (
    "Id" TEXT PRIMARY KEY,
    "PatientId" TEXT REFERENCES "Patients"("Id") ON DELETE CASCADE,
    "DoctorId" TEXT NOT NULL,
    "Date" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "Type" VARCHAR(50) DEFAULT 'consultation',
    "Title" VARCHAR(255) NOT NULL,
    "Description" TEXT NOT NULL,
    "SymptomsJson" JSONB DEFAULT '[]',
    "Diagnosis" TEXT NOT NULL,
    "Treatment" TEXT NOT NULL,
    "FollowUp" TEXT,
    "Notes" TEXT,
    "Status" VARCHAR(50) DEFAULT 'active',
    "IsActive" BOOLEAN DEFAULT TRUE,
    "CreatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "Prescriptions" (
    "Id" TEXT PRIMARY KEY,
    "MedicalRecordId" TEXT REFERENCES "MedicalRecords"("Id") ON DELETE CASCADE,
    "MedicationId" TEXT NOT NULL,
    "MedicationName" VARCHAR(255) NOT NULL,
    "Dosage" VARCHAR(100) NOT NULL,
    "Frequency" VARCHAR(100) NOT NULL,
    "Duration" VARCHAR(100) NOT NULL,
    "Instructions" TEXT,
    "Status" VARCHAR(50) DEFAULT 'pending',
    "DispensedBy" VARCHAR(255),
    "DispensedAt" TIMESTAMPTZ,
    "IsActive" BOOLEAN DEFAULT TRUE,
    "CreatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMPTZ
);

-- 6. Table Biotechnologies & Pharmacogénomique (PGx)
CREATE TABLE IF NOT EXISTS "GenomicProfiles" (
    "Id" TEXT PRIMARY KEY,
    "PatientId" TEXT REFERENCES "Patients"("Id") ON DELETE CASCADE,
    "PatientName" VARCHAR(255) NOT NULL,
    "TestDate" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "PanelName" VARCHAR(255) DEFAULT 'Cardio-PGx & Métabolisme',
    "GenesJson" JSONB DEFAULT '[]',
    "PhenotypesJson" JSONB DEFAULT '{}',
    "RecommendationsJson" JSONB DEFAULT '[]',
    "Status" VARCHAR(50) DEFAULT 'validated',
    "LabTechnicianId" TEXT,
    "Notes" TEXT,
    "IsActive" BOOLEAN DEFAULT TRUE,
    "CreatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "BiobankFreezers" (
    "Id" TEXT PRIMARY KEY,
    "Name" VARCHAR(255) NOT NULL,
    "Temperature" VARCHAR(50) DEFAULT '-80°C',
    "Location" VARCHAR(255) NOT NULL,
    "CapacityBoxes" INT DEFAULT 100,
    "UsedBoxes" INT DEFAULT 0,
    "Status" VARCHAR(50) DEFAULT 'optimal',
    "IsActive" BOOLEAN DEFAULT TRUE,
    "CreatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "BioSamples" (
    "Id" TEXT PRIMARY KEY,
    "SampleCode" VARCHAR(100) UNIQUE NOT NULL,
    "PatientId" TEXT,
    "PatientName" VARCHAR(255),
    "SampleType" VARCHAR(50) NOT NULL,
    "CollectionDate" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "VolumeMl" NUMERIC(6, 2) DEFAULT 1.00,
    "Concentration" VARCHAR(50),
    "FreezerId" TEXT REFERENCES "BiobankFreezers"("Id"),
    "RackNumber" VARCHAR(50),
    "BoxNumber" VARCHAR(50),
    "WellPosition" VARCHAR(20),
    "StorageTemp" VARCHAR(50) DEFAULT '-80°C',
    "ConsentSigned" BOOLEAN DEFAULT TRUE,
    "ConsentType" VARCHAR(100) DEFAULT 'Research & Diagnostics',
    "QualityScore" VARCHAR(10) DEFAULT 'A',
    "Status" VARCHAR(50) DEFAULT 'available',
    "Notes" TEXT,
    "IsActive" BOOLEAN DEFAULT TRUE,
    "CreatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS "IX_BioSamples_SampleCode" ON "BioSamples" ("SampleCode");

-- 7. Table Essais Cliniques
CREATE TABLE IF NOT EXISTS "ClinicalTrials" (
    "Id" TEXT PRIMARY KEY,
    "Code" VARCHAR(100) UNIQUE NOT NULL,
    "Title" TEXT NOT NULL,
    "Phase" VARCHAR(50) DEFAULT 'Phase II',
    "PrincipalInvestigator" VARCHAR(255) NOT NULL,
    "TargetEnrollment" INT DEFAULT 50,
    "CurrentEnrollment" INT DEFAULT 0,
    "StartDate" DATE DEFAULT CURRENT_DATE,
    "EndDate" DATE,
    "Status" VARCHAR(50) DEFAULT 'recruiting',
    "Description" TEXT,
    "InclusionCriteriaJson" JSONB DEFAULT '[]',
    "ExclusionCriteriaJson" JSONB DEFAULT '[]',
    "IsActive" BOOLEAN DEFAULT TRUE,
    "CreatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMPTZ
);

-- ==========================================================
-- 8. POSTGRESQL 16 NATIVE ROW LEVEL SECURITY (RLS) & AUDIT
-- ==========================================================
ALTER TABLE IF EXISTS "Users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Patients" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "MedicalRecords" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Prescriptions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Medications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "MedicationMovements" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "GenomicProfiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "BioSamples" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "ClinicalTrials" ENABLE ROW LEVEL SECURITY;

-- Security & Audit Indexes
CREATE INDEX IF NOT EXISTS "IX_Users_Email" ON "Users" ("Email");
CREATE INDEX IF NOT EXISTS "IX_Patients_Email" ON "Patients" ("Email");
CREATE INDEX IF NOT EXISTS "IX_Patients_Phone" ON "Patients" ("Phone");
CREATE INDEX IF NOT EXISTS "IX_MedicalRecords_PatientId" ON "MedicalRecords" ("PatientId");
CREATE INDEX IF NOT EXISTS "IX_MedicalRecords_DoctorId" ON "MedicalRecords" ("DoctorId");
CREATE INDEX IF NOT EXISTS "IX_Prescriptions_MedicalRecordId" ON "Prescriptions" ("MedicalRecordId");
CREATE INDEX IF NOT EXISTS "IX_GenomicProfiles_PatientId" ON "GenomicProfiles" ("PatientId");
CREATE INDEX IF NOT EXISTS "IX_BioSamples_FreezerId" ON "BioSamples" ("FreezerId");

