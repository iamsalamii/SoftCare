-- ==========================================================
-- PHARMACY SALES
-- ==========================================================

CREATE TABLE IF NOT EXISTS "PharmacySales" (
    "Id" text PRIMARY KEY,
    "ReceiptNumber" text NOT NULL,
    "SaleDate" timestamp with time zone NOT NULL,
    "PatientId" text NULL,
    "CustomerName" text NULL,
    "TotalAmount" numeric NOT NULL,
    "PaymentMethod" text NOT NULL,
    "Status" text NOT NULL,
    "UserId" text NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    "IsActive" boolean NOT NULL,
    CONSTRAINT "FK_PharmacySales_Patients_PatientId" FOREIGN KEY ("PatientId") REFERENCES "Patients" ("Id"),
    CONSTRAINT "FK_PharmacySales_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id")
);

CREATE TABLE IF NOT EXISTS "PharmacySaleItems" (
    "Id" text PRIMARY KEY,
    "PharmacySaleId" text NOT NULL,
    "MedicationId" text NOT NULL,
    "Quantity" integer NOT NULL,
    "UnitPrice" numeric NOT NULL,
    "Subtotal" numeric NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    "IsActive" boolean NOT NULL,
    CONSTRAINT "FK_PharmacySaleItems_PharmacySales_PharmacySaleId" FOREIGN KEY ("PharmacySaleId") REFERENCES "PharmacySales" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_PharmacySaleItems_Medications_MedicationId" FOREIGN KEY ("MedicationId") REFERENCES "Medications" ("Id")
);
