# Architecture de l'application SoftCare HMS

## Vue d'ensemble

SoftCare est un systeme de gestion hospitaliere (HMS) construit en React + TypeScript + Vite + Tailwind CSS. L'application est actuellement 100% frontend avec des donnees mock en memoire. Pour connecter un backend SQL Server, il suffit de remplacer les operations CRUD dans `AppContext.tsx` par des appels API.

---

## 1. Structure des dossiers

```
src/
├── main.tsx                    # Point d'entree React
├── App.tsx                     # Racine: enveloppe AppProvider + ToastProvider + MainApp
├── index.css                   # Styles globaux Tailwind
├── context/
│   ├── AppContext.tsx          # COEUR: tout l'etat global + CRUD (a connecter au backend)
│   └── ToastContext.tsx        # Notifications toast
├── types/
│   └── index.ts               # Toutes les interfaces TypeScript (modele de donnees)
├── data/
│   └── mockData.ts            # Donnees de demonstration (a remplacer par l'API)
├── utils/
│   └── exportUtils.ts         # Export PDF/Excel, formatage monnaie/date
└── components/
    ├── Login.tsx              # Page de connexion
    ├── MainApp.tsx            # Routeur principal (auth gate + views)
    ├── Dashboard.tsx          # Layout principal (Sidebar + Header + content)
    ├── Header.tsx             # Barre du haut (recherche, notifications, profil)
    ├── Sidebar.tsx            # Menu lateral (filtre par role)
    ├── admin/                 # Gestion des utilisateurs
    ├── admissions/            # Gestion des lits
    ├── appointments/         # Rendez-vous
    ├── billing/               # Facturation
    ├── common/                # Composants reutilisables (ConfirmDialog, ExportButtons)
    ├── dashboard/             # Tableau de bord (stats, graphiques, activites)
    ├── emergency/             # Urgences
    ├── hr/                    # Planning personnel
    ├── lab/                   # Laboratoire
    ├── medical/               # Dossiers medicaux
    ├── nursing/               # Soins infirmiers
    ├── patients/              # Gestion patients
    ├── pharmacy/               # Pharmacie + POS
    ├── reports/               # Rapports
    ├── settings/              # Parametres (organisation, dropdowns, profil, preferences)
    └── surgery/                # Bloc operatoire
```

---

## 2. Modele de donnees (types TypeScript)

Tous les types sont dans `src/types/index.ts`. Voici les entites principales et leurs champs:

### User (Utilisateur/Personnel)
```typescript
id, name, email, role ('admin'|'doctor'|'nurse'|'pharmacist'|'receptionist'|'lab_tech'|'surgeon'),
department, phone, avatar, permissions[], specialization, licenseNumber,
status ('active'|'inactive'|'on-leave'), active, createdAt
```

### Patient
```typescript
id, firstName, lastName, dateOfBirth, gender ('male'|'female'|'other'),
phone, email, address, city,
emergencyContact: { name, phone, relationship },
allergies[], bloodType, insuranceId, insuranceName,
socialSecurityNumber, maritalStatus, occupation, primaryDoctorId,
status ('active'|'inactive'|'deceased'), active, createdAt
```

### Appointment (Rendez-vous)
```typescript
id, patientId, doctorId, date, time, duration,
type ('consultation'|'follow-up'|'emergency'|'surgery'|'checkup'),
status ('scheduled'|'confirmed'|'in-progress'|'completed'|'cancelled'|'no-show'),
notes, reason, createdAt
```

### MedicalRecord (Dossier medical)
```typescript
id, patientId, doctorId, date,
type ('consultation'|'diagnosis'|'treatment'|'surgery'|'emergency'|'follow-up'),
title, description, symptoms[], diagnosis, treatment,
prescriptions: Prescription[], attachments: Attachment[],
followUp, notes, status ('draft'|'active'|'archived')
```

### Medication (Medicament)
```typescript
id, name, genericName, category, manufacturer,
stock, minStock, maxStock, price, unitPrice,
expiryDate, batchNumber, barcode, description,
dosageForm ('tablet'|'capsule'|'injection'|'syrup'|'cream'|'drops'),
requiresPrescription, location, supplier,
status ('active'|'inactive'|'discontinued'), createdAt
```

### Invoice (Facture)
```typescript
id, invoiceNumber, patientId, date, dueDate,
items: InvoiceItem[], subtotal, tax, taxAmount,
discount, discountAmount, discountPercent, total,
status ('draft'|'sent'|'paid'|'partial'|'cancelled'|'overdue'),
payments: Payment[], notes, createdAt, createdBy
```

### Bed (Lit)
```typescript
id, roomNumber, bedNumber, departmentId,
type ('standard'|'icu'|'pediatric'|'maternity'|'emergency'),
status ('available'|'occupied'|'maintenance'|'reserved'),
patientId, currentPatientId, currentAdmissionId, admissionDate,
features[], dailyRate, createdAt
```

### Admission
```typescript
id, patientId, bedId, doctorId,
type ('planned'|'emergency'|'transfer'),
reason, admissionDate, expectedDischargeDate, actualDischargeDate,
status ('pending'|'admitted'|'discharged'|'transferred'),
departmentId, notes, dischargeSummary, dischargeBy
```

### LabTest / LabOrder
```typescript
// LabTest
id, name, code, category ('blood'|'urine'|'imaging'|'biopsy'|'other'),
description, sampleType, turnaroundTime, price,
preparationInstructions, referenceRanges: ReferenceRange[], active

// LabOrder
id, patientId, doctorId, tests: LabOrderItem[],
priority ('routine'|'urgent'|'stat'|'normal'),
status ('pending'|'collected'|'in-progress'|'completed'|'cancelled'),
notes, createdAt, collectedAt, collectedBy, completedAt
```

### EmergencyVisit
```typescript
id, patientId, arrivalTime, arrivalMode ('walking'|'ambulance'|'helicopter'|'police'|'other'),
chiefComplaint, triageLevel (1-5), triageTime, triageBy,
status ('waiting'|'in-treatment'|'admitted'|'discharged'|'transferred'|'left-ama'),
assignedDoctorId, assignedBedId, notes
```

### Surgery / OperatingRoom
```typescript
// Surgery
id, patientId, admissionId, scheduledDate, scheduledTime, duration,
type ('elective'|'urgent'|'emergency'), procedure, procedureCode,
surgeonId, anesthesiologistId, assistantSurgeonId, scrubNurseId,
operatingRoomId, status ('scheduled'|'pre-op'|'in-progress'|'completed'|'cancelled'),
anesthesiaType, preOpDiagnosis, postOpDiagnosis, complications, notes,
startTime, endTime

// OperatingRoom
id, name, number, type ('general'|'cardiac'|'neuro'|'orthopedic'|'pediatric'),
status ('available'|'in-use'|'cleaning'|'maintenance'), equipment[]
```

### OrganizationSettings
```typescript
id, name, type, logo, address, city, country, phone, email, website,
taxId, registrationNumber, bankName, bankAccount, bankIban,
headerColor, primaryColor, currency, currencySymbol,
taxRate, taxName, defaultDiscount, invoicePrefix, receiptPrefix,
quickInvoiceItems: QuickInvoiceItem[], updatedAt
```

### Autres types
- `Department`: id, name, code, headId, description, location, phone, type, beds, active
- `Room`: id, number, departmentId, type, capacity, equipment[], status
- `Notification`: id, userId, type, title, message, link, read, createdAt
- `WorkSchedule`: id, userId, date, shiftType, startTime, endTime, departmentId, status
- `Insurance`: id, name, code, type, coveragePercent, contactPhone, contactEmail, address, active
- `PatientInsurance`: id, patientId, insuranceId, policyNumber, subscriberNumber, validFrom, validTo, beneficiary
- `PharmacySale`: id, items[], subtotal, tax, discount, total, paymentMethod, cashierId, createdAt, receiptNumber
- `MedicationMovement`: id, medicationId, type, quantity, reason, performedBy, date, referenceId
- `VitalSigns`: id, patientId, recordedBy, date, time, temperature, bloodPressureSystolic/Diastolic, heartRate, respiratoryRate, oxygenSaturation, weight, height, painLevel, notes
- `CarePlan`: id, patientId, admissionId, createdBy, createdAt, diagnosis, goals[], interventions[], status
- `DropdownOption`: id, category, value, label, order, active, createdAt

---

## 3. Le coeur: AppContext.tsx

### Etat global gere
L'AppContext gere tout l'etat de l'application via `useState`. Chaque entite a son state + ses fonctions CRUD.

### Authentification (mock actuelle)
```typescript
signIn(email, password)  // Verifie email dans mockUsers, mot de passe: "demo123"
signOut()                 // Vide currentUser + localStorage
```
**Pour SQL Server:** Remplacer `signIn` par un appel `POST /api/auth/login` qui retourne un JWT token. Stocker le token dans localStorage et l'envoyer dans les headers Authorization.

### Donnees (mock actuel)
```typescript
refreshData()  // Charge toutes les donnees depuis mockData.ts en memoire
```
**Pour SQL Server:** Remplacer chaque `setX([...mockX])` par un appel `GET /api/x` et setX avec la reponse.

### CRUD (mock actuel)
Chaque operation (addPatient, updatePatient, deletePatient, etc.) modifie directement le state React en memoire.

**Pour SQL Server:** Remplacer par des appels API:
```
POST   /api/patients       -> addPatient
PUT    /api/patients/:id   -> updatePatient
DELETE /api/patients/:id   -> deletePatient
```
Apres chaque mutation, mettre a jour le state local avec la reponse de l'API.

---

## 4. Guide de connexion SQL Server

### Etape 1: Creer une couche API
Creer un backend (Node.js/Express, .NET Core, ou autre) qui expose des endpoints REST et se connecte a SQL Server. L'API doit retourner du JSON au format camelCase (correspondant aux types TypeScript).

### Etape 2: Creer un client API
Remplacer `src/lib/supabase.ts` par un client HTTP:
```typescript
// src/lib/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('softcare_token');
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export { request as api };
```

### Etape 3: Remplacer les operations dans AppContext.tsx
Pour chaque fonction CRUD, remplacer la logique mock par des appels API. Exemple pour les patients:

```typescript
const addPatient = async (patient: Partial<Patient>) => {
  const created = await api.post<Patient>('/patients', patient);
  setPatients(prev => [created, ...prev]);
  success('Patient cree');
};

const updatePatient = async (id: string, updates: Partial<Patient>) => {
  const updated = await api.put<Patient>(`/patients/${id}`, updates);
  setPatients(prev => prev.map(p => p.id === id ? updated : p));
  success('Patient mis a jour');
};

const deletePatient = async (id: string) => {
  await api.delete(`/patients/${id}`);
  setPatients(prev => prev.filter(p => p.id !== id));
  success('Patient supprime');
};
```

### Etape 4: Authentification
```typescript
const signIn = async (email: string, password: string) => {
  try {
    const { token, user } = await api.post('/auth/login', { email, password });
    localStorage.setItem('softcare_token', token);
    setCurrentUser(user);
    return { error: null };
  } catch (err) {
    return { error: 'Email ou mot de passe incorrect' };
  }
};
```

---

## 5. Endpoints API necessaires

| Entite | GET (liste) | GET (detail) | POST (creer) | PUT (modifier) | DELETE |
|---|---|---|---|---|---|
| Auth | - | - | `/api/auth/login` | - | `/api/auth/logout` |
| Patients | `/api/patients` | `/api/patients/:id` | `/api/patients` | `/api/patients/:id` | `/api/patients/:id` |
| Users | `/api/users` | `/api/users/:id` | `/api/users` | `/api/users/:id` | `/api/users/:id` |
| Appointments | `/api/appointments` | - | `/api/appointments` | `/api/appointments/:id` | `/api/appointments/:id` |
| MedicalRecords | `/api/medical-records` | - | `/api/medical-records` | - | - |
| Medications | `/api/medications` | - | `/api/medications` | `/api/medications/:id` | `/api/medications/:id` |
| MedicationMovements | `/api/medication-movements` | - | `/api/medication-movements` | - | - |
| Invoices | `/api/invoices` | `/api/invoices/:id` | `/api/invoices` | `/api/invoices/:id` | `/api/invoices/:id` |
| InvoiceItems | - | - | `/api/invoices/:id/items` | - | `/api/invoice-items/:id` |
| Beds | `/api/beds` | - | - | `/api/beds/:id` | - |
| Admissions | `/api/admissions` | - | `/api/admissions` | `/api/admissions/:id` | - |
| LabTests | `/api/lab-tests` | - | `/api/lab-tests` | `/api/lab-tests/:id` | - |
| LabOrders | `/api/lab-orders` | - | `/api/lab-orders` | `/api/lab-orders/:id` | `/api/lab-orders/:id` |
| EmergencyVisits | `/api/emergency-visits` | - | `/api/emergency-visits` | `/api/emergency-visits/:id` | - |
| Surgeries | `/api/surgeries` | - | `/api/surgeries` | `/api/surgeries/:id` | `/api/surgeries/:id` |
| OperatingRooms | `/api/operating-rooms` | - | `/api/operating-rooms` | `/api/operating-rooms/:id` | - |
| Departments | `/api/departments` | - | - | - | - |
| Rooms | `/api/rooms` | - | - | - | - |
| WorkSchedules | `/api/work-schedules` | - | `/api/work-schedules` | `/api/work-schedules/:id` | - |
| Notifications | `/api/notifications` | - | `/api/notifications` | `/api/notifications/:id` | - |
| OrganizationSettings | `/api/org-settings` | - | - | `/api/org-settings` | - |
| QuickInvoiceItems | `/api/quick-invoice-items` | - | `/api/quick-invoice-items` | `/api/quick-invoice-items/:id` | `/api/quick-invoice-items/:id` |
| DropdownOptions | `/api/dropdown-options` | - | `/api/dropdown-options` | `/api/dropdown-options/:id` | `/api/dropdown-options/:id` |
| PharmacySales | `/api/pharmacy-sales` | - | `/api/pharmacy-sales` | - | - |
| Insurances | `/api/insurances` | - | - | - | - |
| PatientInsurances | `/api/patient-insurances` | - | - | - | - |
| VitalSigns | `/api/vital-signs` | - | `/api/vital-signs` | - | - |
| CarePlans | `/api/care-plans` | - | `/api/care-plans` | - | - |

---

## 6. Tables SQL Server suggerees

```sql
-- Utilisateurs
CREATE TABLE Users (
  Id NVARCHAR(50) PRIMARY KEY,
  Name NVARCHAR(200) NOT NULL,
  Email NVARCHAR(200) UNIQUE NOT NULL,
  Role NVARCHAR(50) NOT NULL,
  Department NVARCHAR(50),
  Phone NVARCHAR(50),
  Avatar NVARCHAR(MAX),
  Permissions NVARCHAR(MAX), -- JSON array
  Specialization NVARCHAR(200),
  LicenseNumber NVARCHAR(100),
  Status NVARCHAR(20) DEFAULT 'active',
  PasswordHash NVARCHAR(MAX),
  CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Patients
CREATE TABLE Patients (
  Id NVARCHAR(50) PRIMARY KEY,
  FirstName NVARCHAR(100) NOT NULL,
  LastName NVARCHAR(100) NOT NULL,
  DateOfBirth DATE,
  Gender NVARCHAR(20),
  Phone NVARCHAR(50),
  Email NVARCHAR(200),
  Address NVARCHAR(MAX),
  City NVARCHAR(100),
  BloodType NVARCHAR(10),
  Allergies NVARCHAR(MAX), -- JSON array
  InsuranceId NVARCHAR(50),
  InsuranceName NVARCHAR(200),
  EmergencyContactName NVARCHAR(200),
  EmergencyContactPhone NVARCHAR(50),
  SocialSecurityNumber NVARCHAR(100),
  MaritalStatus NVARCHAR(20),
  Occupation NVARCHAR(200),
  PrimaryDoctorId NVARCHAR(50),
  Status NVARCHAR(20) DEFAULT 'active',
  CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Appointments
CREATE TABLE Appointments (
  Id NVARCHAR(50) PRIMARY KEY,
  PatientId NVARCHAR(50) FOREIGN KEY REFERENCES Patients(Id),
  DoctorId NVARCHAR(50) FOREIGN KEY REFERENCES Users(Id),
  Date DATE NOT NULL,
  Time NVARCHAR(10) NOT NULL,
  Duration INT DEFAULT 30,
  Type NVARCHAR(50),
  Status NVARCHAR(50) DEFAULT 'scheduled',
  Notes NVARCHAR(MAX),
  Reason NVARCHAR(MAX),
  CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Medications
CREATE TABLE Medications (
  Id NVARCHAR(50) PRIMARY KEY,
  Name NVARCHAR(200) NOT NULL,
  GenericName NVARCHAR(200),
  Category NVARCHAR(100),
  Manufacturer NVARCHAR(200),
  Stock INT DEFAULT 0,
  MinStock INT DEFAULT 0,
  MaxStock INT,
  Price DECIMAL(10,2),
  ExpiryDate DATE,
  BatchNumber NVARCHAR(100),
  Barcode NVARCHAR(100),
  Description NVARCHAR(MAX),
  DosageForm NVARCHAR(50),
  RequiresPrescription BIT DEFAULT 0,
  Location NVARCHAR(100),
  Supplier NVARCHAR(200),
  Status NVARCHAR(20) DEFAULT 'active',
  CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Invoices
CREATE TABLE Invoices (
  Id NVARCHAR(50) PRIMARY KEY,
  InvoiceNumber NVARCHAR(100),
  PatientId NVARCHAR(50) FOREIGN KEY REFERENCES Patients(Id),
  Date DATE NOT NULL,
  DueDate DATE,
  Subtotal DECIMAL(10,2),
  Tax DECIMAL(10,2) DEFAULT 0,
  Discount DECIMAL(10,2) DEFAULT 0,
  Total DECIMAL(10,2),
  Status NVARCHAR(50) DEFAULT 'draft',
  Notes NVARCHAR(MAX),
  CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
  CreatedBy NVARCHAR(50)
);

CREATE TABLE InvoiceItems (
  Id NVARCHAR(50) PRIMARY KEY,
  InvoiceId NVARCHAR(50) FOREIGN KEY REFERENCES Invoices(Id) ON DELETE CASCADE,
  Description NVARCHAR(MAX),
  Type NVARCHAR(50),
  Quantity INT DEFAULT 1,
  UnitPrice DECIMAL(10,2),
  Total DECIMAL(10,2)
);

-- Beds
CREATE TABLE Beds (
  Id NVARCHAR(50) PRIMARY KEY,
  RoomNumber NVARCHAR(20),
  BedNumber NVARCHAR(20),
  DepartmentId NVARCHAR(50),
  Type NVARCHAR(50) DEFAULT 'standard',
  Status NVARCHAR(50) DEFAULT 'available',
  PatientId NVARCHAR(50),
  AdmissionDate DATETIME2,
  Features NVARCHAR(MAX), -- JSON array
  DailyRate DECIMAL(10,2),
  CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Admissions
CREATE TABLE Admissions (
  Id NVARCHAR(50) PRIMARY KEY,
  PatientId NVARCHAR(50) FOREIGN KEY REFERENCES Patients(Id),
  BedId NVARCHAR(50) FOREIGN KEY REFERENCES Beds(Id),
  DoctorId NVARCHAR(50) FOREIGN KEY REFERENCES Users(Id),
  Type NVARCHAR(50),
  Reason NVARCHAR(MAX),
  AdmissionDate DATETIME2,
  ExpectedDischargeDate DATETIME2,
  ActualDischargeDate DATETIME2,
  Status NVARCHAR(50) DEFAULT 'admitted',
  DepartmentId NVARCHAR(50),
  Notes NVARCHAR(MAX)
);

-- LabTests, LabOrders
CREATE TABLE LabTests (
  Id NVARCHAR(50) PRIMARY KEY,
  Name NVARCHAR(200), Code NVARCHAR(50), Category NVARCHAR(50),
  Description NVARCHAR(MAX), SampleType NVARCHAR(100),
  TurnaroundTime INT, Price DECIMAL(10,2),
  PreparationInstructions NVARCHAR(MAX),
  ReferenceRanges NVARCHAR(MAX), -- JSON
  Active BIT DEFAULT 1
);

CREATE TABLE LabOrders (
  Id NVARCHAR(50) PRIMARY KEY,
  PatientId NVARCHAR(50), DoctorId NVARCHAR(50),
  Tests NVARCHAR(MAX), -- JSON array of LabOrderItem
  Priority NVARCHAR(50), Status NVARCHAR(50),
  Notes NVARCHAR(MAX),
  CreatedAt DATETIME2, CollectedAt DATETIME2,
  CollectedBy NVARCHAR(50), CompletedAt DATETIME2
);

-- EmergencyVisits
CREATE TABLE EmergencyVisits (
  Id NVARCHAR(50) PRIMARY KEY,
  PatientId NVARCHAR(50), ArrivalTime DATETIME2,
  ArrivalMode NVARCHAR(50), ChiefComplaint NVARCHAR(MAX),
  TriageLevel INT, TriageTime DATETIME2, TriageBy NVARCHAR(50),
  Status NVARCHAR(50), AssignedDoctorId NVARCHAR(50),
  AssignedBedId NVARCHAR(50), Notes NVARCHAR(MAX)
);

-- Surgeries, OperatingRooms
CREATE TABLE OperatingRooms (
  Id NVARCHAR(50) PRIMARY KEY,
  Name NVARCHAR(100), Number NVARCHAR(20),
  Type NVARCHAR(50), Status NVARCHAR(50),
  Equipment NVARCHAR(MAX) -- JSON array
);

CREATE TABLE Surgeries (
  Id NVARCHAR(50) PRIMARY KEY,
  PatientId NVARCHAR(50), AdmissionId NVARCHAR(50),
  ScheduledDate DATE, ScheduledTime NVARCHAR(10), Duration INT,
  Type NVARCHAR(50), Procedure NVARCHAR(MAX), ProcedureCode NVARCHAR(50),
  SurgeonId NVARCHAR(50), AnesthesiologistId NVARCHAR(50),
  AssistantSurgeonId NVARCHAR(50), ScrubNurseId NVARCHAR(50),
  OperatingRoomId NVARCHAR(50), Status NVARCHAR(50),
  AnesthesiaType NVARCHAR(50),
  PreOpDiagnosis NVARCHAR(MAX), PostOpDiagnosis NVARCHAR(MAX),
  Complications NVARCHAR(MAX), Notes NVARCHAR(MAX),
  StartTime DATETIME2, EndTime DATETIME2
);

-- OrganizationSettings
CREATE TABLE OrganizationSettings (
  Id NVARCHAR(50) PRIMARY KEY,
  Name NVARCHAR(200), Type NVARCHAR(50),
  Logo NVARCHAR(MAX), Address NVARCHAR(MAX),
  City NVARCHAR(100), Country NVARCHAR(100),
  Phone NVARCHAR(50), Email NVARCHAR(200), Website NVARCHAR(200),
  TaxId NVARCHAR(100), RegistrationNumber NVARCHAR(100),
  BankName NVARCHAR(200), BankAccount NVARCHAR(100), BankIban NVARCHAR(100),
  HeaderColor NVARCHAR(20), PrimaryColor NVARCHAR(20),
  Currency NVARCHAR(10), CurrencySymbol NVARCHAR(10),
  TaxRate DECIMAL(5,2), TaxName NVARCHAR(100),
  DefaultDiscount DECIMAL(5,2),
  InvoicePrefix NVARCHAR(20), ReceiptPrefix NVARCHAR(20),
  UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Departments, Rooms
CREATE TABLE Departments (
  Id NVARCHAR(50) PRIMARY KEY,
  Name NVARCHAR(200), Code NVARCHAR(20),
  HeadId NVARCHAR(50), Description NVARCHAR(MAX),
  Location NVARCHAR(MAX), Phone NVARCHAR(50),
  Type NVARCHAR(50), Beds INT, Active BIT
);

CREATE TABLE Rooms (
  Id NVARCHAR(50) PRIMARY KEY,
  Number NVARCHAR(20), DepartmentId NVARCHAR(50),
  Type NVARCHAR(50), Capacity INT,
  Equipment NVARCHAR(MAX), Status NVARCHAR(50)
);

-- Notifications, WorkSchedules
CREATE TABLE Notifications (
  Id NVARCHAR(50) PRIMARY KEY,
  UserId NVARCHAR(50), Type NVARCHAR(50),
  Title NVARCHAR(200), Message NVARCHAR(MAX),
  Link NVARCHAR(MAX), Read BIT DEFAULT 0,
  CreatedAt DATETIME2
);

CREATE TABLE WorkSchedules (
  Id NVARCHAR(50) PRIMARY KEY,
  UserId NVARCHAR(50), Date DATE,
  ShiftType NVARCHAR(50), StartTime NVARCHAR(10), EndTime NVARCHAR(10),
  DepartmentId NVARCHAR(50), Status NVARCHAR(50), Notes NVARCHAR(MAX)
);

-- Insurances
CREATE TABLE Insurances (
  Id NVARCHAR(50) PRIMARY KEY,
  Name NVARCHAR(200), Code NVARCHAR(50),
  Type NVARCHAR(50), CoveragePercent DECIMAL(5,2),
  ContactPhone NVARCHAR(50), ContactEmail NVARCHAR(200),
  Address NVARCHAR(MAX), Active BIT
);

CREATE TABLE PatientInsurances (
  Id NVARCHAR(50) PRIMARY KEY,
  PatientId NVARCHAR(50), InsuranceId NVARCHAR(50),
  PolicyNumber NVARCHAR(100), SubscriberNumber NVARCHAR(100),
  ValidFrom DATE, ValidTo DATE, Beneficiary BIT
);

-- PharmacySales, MedicationMovements
CREATE TABLE PharmacySales (
  Id NVARCHAR(50) PRIMARY KEY,
  Items NVARCHAR(MAX), -- JSON
  Subtotal DECIMAL(10,2), Tax DECIMAL(10,2),
  Discount DECIMAL(10,2), Total DECIMAL(10,2),
  PaymentMethod NVARCHAR(50), AmountReceived DECIMAL(10,2),
  Change DECIMAL(10,2), CustomerId NVARCHAR(50),
  CustomerName NVARCHAR(200), CustomerPhone NVARCHAR(50),
  CashierId NVARCHAR(50), CashierName NVARCHAR(200),
  CreatedAt DATETIME2, ReceiptNumber NVARCHAR(100), Notes NVARCHAR(MAX)
);

CREATE TABLE MedicationMovements (
  Id NVARCHAR(50) PRIMARY KEY,
  MedicationId NVARCHAR(50), Type NVARCHAR(50),
  Quantity INT, Reason NVARCHAR(MAX),
  PerformedBy NVARCHAR(50), Date DATETIME2,
  ReferenceId NVARCHAR(100)
);

-- VitalSigns, CarePlans
CREATE TABLE VitalSigns (
  Id NVARCHAR(50) PRIMARY KEY,
  PatientId NVARCHAR(50), RecordedBy NVARCHAR(50),
  Date DATE, Time NVARCHAR(10),
  Temperature DECIMAL(5,2), BloodPressureSystolic INT, BloodPressureDiastolic INT,
  HeartRate INT, RespiratoryRate INT, OxygenSaturation INT,
  Weight DECIMAL(5,2), Height DECIMAL(5,2), PainLevel INT, Notes NVARCHAR(MAX)
);

CREATE TABLE CarePlans (
  Id NVARCHAR(50) PRIMARY KEY,
  PatientId NVARCHAR(50), AdmissionId NVARCHAR(50),
  CreatedBy NVARCHAR(50), CreatedAt DATETIME2,
  Diagnosis NVARCHAR(MAX),
  Goals NVARCHAR(MAX), -- JSON
  Interventions NVARCHAR(MAX), -- JSON
  Status NVARCHAR(50)
);

-- QuickInvoiceItems
CREATE TABLE QuickInvoiceItems (
  Id NVARCHAR(50) PRIMARY KEY,
  Category NVARCHAR(50), Label NVARCHAR(200),
  Price DECIMAL(10,2), Active BIT DEFAULT 1,
  SortOrder INT
);

-- DropdownOptions
CREATE TABLE DropdownOptions (
  Id NVARCHAR(50) PRIMARY KEY,
  Category NVARCHAR(100), Value NVARCHAR(200),
  Label NVARCHAR(200), SortOrder INT,
  Active BIT DEFAULT 1, CreatedAt DATETIME2
);

-- MedicalRecords
CREATE TABLE MedicalRecords (
  Id NVARCHAR(50) PRIMARY KEY,
  PatientId NVARCHAR(50), DoctorId NVARCHAR(50),
  Date DATE, Type NVARCHAR(50),
  Title NVARCHAR(200), Description NVARCHAR(MAX),
  Symptoms NVARCHAR(MAX), -- JSON array
  Diagnosis NVARCHAR(MAX), Treatment NVARCHAR(MAX),
  Prescriptions NVARCHAR(MAX), -- JSON array
  Attachments NVARCHAR(MAX), -- JSON array
  FollowUp NVARCHAR(MAX), Notes NVARCHAR(MAX),
  Status NVARCHAR(50) DEFAULT 'active'
);
```

---

## 7. Composants et leurs dependances

| Composant | Donnees utilisees (via useApp) | Operations CRUD |
|---|---|---|
| DashboardHome | patients, appointments, medications, users, surgeries, beds, organizationSettings | setCurrentView |
| PatientManagement | patients, organizationSettings | deletePatient |
| PatientForm | patients, departments | addPatient, updatePatient |
| PatientDetails | patients | - |
| AppointmentManagement | appointments, patients, users | deleteAppointment |
| AppointmentForm | patients, users | addAppointment, updateAppointment |
| MedicalRecords | medicalRecords, patients, users, medications | - |
| MedicalRecordForm | patients, medications | addMedicalRecord |
| PharmacyManagement | medications, organizationSettings | deleteMedication |
| MedicationForm | - | addMedication, updateMedication |
| PharmacyPOS | medications | addPharmacySale, addMedicationMovement |
| BedManagement | beds, admissions, patients, departments, users, rooms | updateBed (via addAdmission) |
| LabManagement | labOrders, labTests | addLabOrder, updateLabOrder |
| EmergencyModule | emergencyVisits, patients, users | addEmergencyVisit, updateEmergencyVisit |
| SurgeryModule | surgeries, operatingRooms, patients, users | addSurgery, updateSurgery |
| InvoiceList | invoices, patients | - |
| InvoiceForm | patients, organizationSettings, quickInvoiceItems | addInvoice |
| UserManagement | users, organizationSettings | deleteUser |
| UserForm | - | addUser, updateUser |
| ScheduleModule | workSchedules, users, departments | setWorkSchedules |
| Reports | patients, appointments, medications, medicalRecords, users | - |
| SettingsModule | currentUser | - |
| OrganizationSettingsForm | organizationSettings | setOrganizationSettings, updateOrganizationSettings |
| DropdownManager | dropdownOptions | addDropdownOption, updateDropdownOption, deleteDropdownOption |
| ProfileSettings | currentUser, users | setCurrentUser, setUsers |
| Header | currentUser, notifications | signOut, markNotificationRead, setCurrentView |
| Sidebar | currentUser, organizationSettings | signOut, setCurrentView |

---

## 8. Modules par role (filtrage Sidebar)

| Module | admin | doctor | nurse | pharmacist | receptionist | lab_tech | surgeon |
|---|---|---|---|---|---|---|---|
| Tableau de bord | Oui | Oui | Oui | Oui | Oui | Oui | Oui |
| Patients | Oui | Oui | Oui | - | Oui | - | Oui |
| Rendez-vous | Oui | Oui | - | - | Oui | - | - |
| Dossiers medicaux | Oui | Oui | Oui | - | - | - | Oui |
| Pharmacie | Oui | - | - | Oui | - | - | - |
| POS Pharmacie | Oui | - | - | Oui | - | - | - |
| Lits & Admissions | Oui | Oui | Oui | - | Oui | - | - |
| Laboratoire | Oui | Oui | - | - | - | Oui | - |
| Soins infirmiers | Oui | - | Oui | - | - | - | - |
| Urgences | Oui | Oui | Oui | - | Oui | - | - |
| Bloc operatoire | Oui | - | - | - | - | - | Oui |
| Facturation | Oui | - | - | - | Oui | - | - |
| Planning | Oui | Oui | Oui | Oui | Oui | Oui | Oui |
| Utilisateurs | Oui | - | - | - | - | - | - |
| Rapports | Oui | Oui | - | Oui | - | - | - |
| Parametres | Oui | Oui | Oui | Oui | Oui | Oui | Oui |

---

## 9. Points d'attention pour l'integration backend

1. **Format des donnees:** L'API doit retourner du JSON en camelCase correspondant aux types TypeScript dans `src/types/index.ts`.

2. **Champs JSON:** Les tableaux (allergies, symptoms, prescriptions, equipment, features, referenceRanges, tests, goals, interventions) sont stockes en JSON dans SQL Server (type NVARCHAR(MAX)) et doivent etre parses/serialises par l'API.

3. **Generation d'ID:** Actuellement les IDs sont generes avec `Date.now() + random`. Avec SQL Server, utiliser des GUID (NEWID()) ou des auto-increment selon votre preference.

4. **Authentification:** L'API doit gerer login (POST /api/auth/login) avec retour d'un JWT. Le token est stocke dans localStorage et envoye dans le header Authorization: Bearer.

5. **Filtres par role:** Le filtrage des modules par role se fait cote frontend dans Sidebar.tsx. L'API doit aussi verifier les permissions cote serveur.

6. **Fichiers (avatars, logos, attachments):** Utiliser un stockage de fichiers (Azure Blob Storage, ou stockage local) et stocker l'URL dans la base.

7. **Temps reel:** Pour les notifications et mises a jour en temps reel (lits, urgences), considerer SignalR (natif avec SQL Server/.NET).
