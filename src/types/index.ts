// ============= UTILISATEURS & PERSONNEL =============

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'nurse' | 'pharmacist' | 'receptionist' | 'lab_tech' | 'surgeon';
  department?: string;
  phone?: string;
  avatar?: string;
  permissions?: string[];
  specialization?: string;
  licenseNumber?: string;
  status?: 'active' | 'inactive' | 'on-leave';
  active?: boolean;
  passwordHash?: string;
  createdAt: string;
}

// ============= PATIENTS =============

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  medicalHistory?: MedicalRecord[];
  allergies: string[];
  bloodType?: string;
  insuranceId?: string;
  insuranceName?: string;
  socialSecurityNumber?: string;
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  occupation?: string;
  primaryDoctorId?: string;
  status: 'active' | 'inactive' | 'deceased';
  active?: boolean;
  createdAt: string;
}

// ============= DOSSIERS MÉDICAUX =============

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  type: 'consultation' | 'diagnosis' | 'treatment' | 'surgery' | 'emergency' | 'follow-up';
  title: string;
  description: string;
  symptoms: string[];
  diagnosis: string;
  treatment: string;
  prescriptions: Prescription[];
  attachments: Attachment[];
  followUp?: string;
  notes?: string;
  status: 'draft' | 'active' | 'archived';
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'document' | 'lab_result';
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Prescription {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  status: 'pending' | 'dispensed' | 'completed' | 'cancelled';
  dispensedBy?: string;
  dispensedAt?: string;
}

// ============= PHARMACIE =============

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  category?: string;
  manufacturer?: string;
  stock: number;
  minStock: number;
  maxStock?: number;
  price: number;
  unitPrice?: number;
  expiryDate?: string;
  batchNumber?: string;
  barcode?: string;
  qrCode?: string;
  description?: string;
  dosageForm?: 'tablet' | 'capsule' | 'injection' | 'syrup' | 'cream' | 'drops';
  strength?: string;
  requiresPrescription?: boolean;
  location?: string;
  supplier?: string;
  storageCondition?: 'ambient' | 'cold_2_8' | 'frozen_minus_20' | 'cryo_minus_80';
  isBiotech?: boolean;
  atcCode?: string;
  status?: 'active' | 'inactive' | 'discontinued';
  createdAt?: string;
}

export interface MedicationMovement {
  id: string;
  medicationId: string;
  type: 'in' | 'out' | 'adjustment' | 'return';
  quantity: number;
  reason: string;
  performedBy: string;
  date: string;
  referenceId?: string;
}

// ============= RENDEZ-VOUS =============

export interface Appointment {
  id: string;
  patientId: string;
  doctor?: string;
  doctorId?: string;
  date: string;
  time: string;
  duration?: number;
  type: 'consultation' | 'follow-up' | 'emergency' | 'surgery' | 'checkup';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  reason?: string;
  roomId?: string;
  createdAt: string;
}

// ============= FACTURATION & FINANCE =============

export interface Invoice {
  id: string;
  invoiceNumber?: string;
  patientId: string;
  patient?: Partial<Patient>;
  admissionId?: string;
  date: string;
  dueDate?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount?: number;
  tax?: number;
  discountPercent?: number;
  discountAmount?: number;
  discount?: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'partial' | 'cancelled' | 'overdue';
  payments?: Payment[];
  insuranceClaimId?: string;
  notes?: string;
  createdAt: string;
  createdBy?: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId?: string;
  description: string;
  type?: 'consultation' | 'procedure' | 'medication' | 'lab' | 'room' | 'other';
  category?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: 'cash' | 'card' | 'transfer' | 'check' | 'insurance';
  reference?: string;
  date: string;
  receivedBy: string;
}

export interface Insurance {
  id: string;
  name: string;
  code: string;
  type: 'public' | 'private' | 'mutual';
  coveragePercent: number;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  active: boolean;
}

export interface PatientInsurance {
  id: string;
  patientId: string;
  insuranceId: string;
  policyNumber: string;
  subscriberNumber?: string;
  validFrom: string;
  validTo: string;
  beneficiary: boolean;
}

export interface InsuranceClaim {
  id: string;
  patientId: string;
  insuranceId: string;
  invoiceId: string;
  date: string;
  amount: number;
  status: 'pending' | 'submitted' | 'approved' | 'rejected' | 'paid';
  rejectionReason?: string;
  processedAt?: string;
  reference?: string;
}

// ============= ADMISSSIONS & LITS =============

export interface Bed {
  id: string;
  name?: string;
  roomNumber: string;
  bedNumber: string;
  number?: string;
  roomId?: string;
  admissionId?: string;
  department?: string;
  departmentId?: string;
  type?: 'standard' | 'icu' | 'pediatric' | 'maternity' | 'emergency';
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  patientId?: string;
  currentPatientId?: string;
  currentAdmissionId?: string;
  admissionDate?: string;
  features?: string[];
  dailyRate?: number;
  createdAt?: string;
}

export interface Admission {
  id: string;
  patientId: string;
  patientName?: string;
  bedId?: string;
  bedNumber?: string;
  roomId?: string;
  roomNumber?: string;
  doctorId?: string;
  attendingDoctorId?: string;
  attendingDoctorName?: string;
  type?: 'planned' | 'emergency' | 'transfer';
  reason?: string;
  diagnosis?: string;
  admissionDate: string;
  dischargeDate?: string;
  expectedDischargeDate?: string;
  actualDischargeDate?: string;
  status: 'pending' | 'admitted' | 'discharged' | 'transferred';
  departmentId: string;
  departmentName?: string;
  notes?: string;
  dischargeSummary?: string;
  dischargeBy?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  dailyRate?: number;
  totalAmount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Room {
  id: string;
  number: string;
  departmentId: string;
  type: 'examination' | 'operation' | 'recovery' | 'consultation';
  capacity: number;
  equipment: string[];
  status: 'available' | 'occupied' | 'maintenance';
}

// ============= LABORATOIRE =============

export interface LabTest {
  id: string;
  name: string;
  code: string;
  category: 'blood' | 'urine' | 'imaging' | 'biopsy' | 'other';
  description: string;
  sampleType: string;
  turnaroundTime: number;
  price: number;
  preparationInstructions?: string;
  referenceRanges: ReferenceRange[];
  active: boolean;
}

export interface ReferenceRange {
  min: number | string;
  max: number | string;
  unit: string;
  gender?: 'male' | 'female';
  ageMin?: number;
  ageMax?: number;
  interpretation: string;
}

export interface LabOrder {
  id: string;
  patientId: string;
  doctorId?: string;
  testName?: string;
  testType?: string;
  tests?: LabOrderItem[];
  priority: 'routine' | 'urgent' | 'stat' | 'normal';
  status: 'pending' | 'collected' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  result?: string;
  resultDate?: string;
  createdAt: string;
  collectedAt?: string;
  collectedBy?: string;
  completedAt?: string;
}

export interface LabOrderItem {
  id: string;
  labTestId: string;
  testName: string;
  result?: string;
  unit?: string;
  flag?: 'normal' | 'low' | 'high' | 'critical';
  referenceRange?: string;
  notes?: string;
}

export interface LabResult {
  id: string;
  labOrderId: string;
  labOrderItemId: string;
  value: string;
  unit: string;
  flag: 'normal' | 'low' | 'high' | 'critical' | 'abnormal';
  referenceRange: string;
  interpretation?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

// ============= MODULE INFIRMIER =============

export interface VitalSigns {
  id: string;
  patientId: string;
  recordedBy: string;
  date: string;
  time: string;
  temperature: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  weight?: number;
  height?: number;
  painLevel?: number;
  notes?: string;
}

export interface CarePlan {
  id: string;
  patientId: string;
  admissionId?: string;
  createdBy: string;
  createdAt: string;
  diagnosis: string;
  goals: CareGoal[];
  interventions: CareIntervention[];
  status: 'active' | 'completed' | 'discontinued';
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface CareGoal {
  id: string;
  description: string;
  targetDate: string;
  status: 'pending' | 'in-progress' | 'achieved' | 'not-achieved';
}

export interface CareIntervention {
  id: string;
  description: string;
  frequency: string;
  assignedTo: string;
  status: 'pending' | 'in-progress' | 'completed';
  lastPerformed?: string;
  nextDue?: string;
}

export interface NursingNote {
  id: string;
  patientId: string;
  admissionId?: string;
  nurseId: string;
  date: string;
  time: string;
  type: 'assessment' | 'intervention' | 'medication' | 'observation' | 'other';
  content: string;
  vitalSignsId?: string;
}

export interface MedicationAdministration {
  id: string;
  patientId: string;
  prescriptionId: string;
  medicationId: string;
  administeredBy: string;
  administeredAt: string;
  dosage: string;
  route: 'oral' | 'iv' | 'im' | 'sc' | 'topical' | 'other';
  site?: string;
  notes?: string;
  status: 'given' | 'held' | 'refused' | 'missed';
}

// ============= URGENCES =============

export interface EmergencyVisit {
  id: string;
  patientId: string;
  arrivalTime: string;
  arrivalMode: 'walking' | 'ambulance' | 'helicopter' | 'police' | 'other';
  chiefComplaint: string;
  triageLevel: 1 | 2 | 3 | 4 | 5;
  triageTime: string;
  triageBy: string;
  vitalSignsId?: string;
  status: 'waiting' | 'in-treatment' | 'admitted' | 'discharged' | 'transferred' | 'left-ama';
  assignedDoctorId?: string;
  assignedBedId?: string;
  dischargeTime?: string;
  dischargeDisposition?: 'home' | 'admitted' | 'transferred' | 'deceased' | 'left-ama';
  notes?: string;
}

export interface TriageAssessment {
  id: string;
  visitId: string;
  nurseId: string;
  time: string;
  chiefComplaint: string;
  symptoms: string[];
  allergies: string[];
  currentMedications: string[];
  vitalSignsId: string;
  painLevel: number;
  consciousnessLevel: 'alert' | 'verbal' | 'pain' | 'unresponsive';
  triageLevel: 1 | 2 | 3 | 4 | 5;
  notes: string;
}

// ============= BLOC OPÉRATOIRE =============

export interface Surgery {
  id: string;
  patientId: string;
  admissionId?: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  type: 'elective' | 'urgent' | 'emergency';
  procedure: string;
  procedureCode?: string;
  surgeonId: string;
  anesthesiologistId?: string;
  assistantSurgeonId?: string;
  scrubNurseId?: string;
  operatingRoomId: string;
  status: 'scheduled' | 'pre-op' | 'in-progress' | 'completed' | 'cancelled';
  anesthesiaType: 'general' | 'regional' | 'local' | 'sedation' | 'none';
  preOpDiagnosis: string;
  postOpDiagnosis?: string;
  complications?: string;
  notes?: string;
  startTime?: string;
  endTime?: string;
}

export interface OperatingRoom {
  id: string;
  name: string;
  number: string;
  type: 'general' | 'cardiac' | 'neuro' | 'orthopedic' | 'pediatric';
  status: 'available' | 'in-use' | 'cleaning' | 'maintenance';
  equipment: string[];
}

export interface SurgeryChecklist {
  id: string;
  surgeryId: string;
  preOpCompleted: boolean;
  preOpBy?: string;
  preOpAt?: string;
  signInProgress: boolean;
  signOutCompleted: boolean;
  signOutBy?: string;
  signOutAt?: string;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  phase: 'pre-op' | 'sign-in' | 'sign-out';
  description: string;
  checked: boolean;
  checkedBy?: string;
  checkedAt?: string;
}

// ============= RESSOURCES HUMAINES =============

export interface WorkSchedule {
  id: string;
  userId: string;
  date: string;
  shiftType: 'day' | 'night' | 'on-call';
  startTime: string;
  endTime: string;
  departmentId: string;
  status: 'scheduled' | 'completed' | 'absent' | 'leave';
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  type: 'annual' | 'sick' | 'maternity' | 'paternity' | 'other';
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  reason?: string;
  rejectionReason?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headId?: string;
  description: string;
  location: string;
  phone?: string;
  email?: string;
  type: 'medical' | 'surgical' | 'support' | 'administrative';
  beds: number;
  active: boolean;
}

// ============= NOTIFICATIONS =============

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

// ============= PARAMÈTRES SYSTÈME =============

export interface SystemSettings {
  hospitalName: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  timezone: string;
  currency: string;
  currencySymbol: string;
  invoicePrefix: string;
  receiptPrefix: string;
  taxRate: number;
  taxName: string;
}

export interface QuickInvoiceItem {
  id: string;
  category: 'consultation' | 'procedure' | 'lab' | 'room' | 'medication' | 'other';
  label: string;
  price: number;
  active: boolean;
  order: number;
}

export interface OrganizationSettings {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'pharmacy' | 'laboratory' | 'health_center';
  logo?: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  taxId?: string;
  registrationNumber?: string;
  bankName?: string;
  bankAccount?: string;
  bankIban?: string;
  headerColor: string;
  primaryColor: string;
  updatedAt: string;
  currency: string;
  currencySymbol: string;
  taxRate: number;
  taxName: string;
  defaultDiscount: number;
  invoicePrefix: string;
  receiptPrefix: string;
  quickInvoiceItems: QuickInvoiceItem[];
}

export interface DropdownOption {
  id: string;
  category: string;
  value: string;
  label: string;
  order: number;
  active: boolean;
  createdAt: string;
}

export interface DropdownCategory {
  id: string;
  name: string;
  description: string;
  system: boolean;
}

export interface ExportTemplate {
  id: string;
  name: string;
  type: 'invoice' | 'receipt' | 'report' | 'prescription' | 'lab_result';
  headerHtml?: string;
  footerHtml?: string;
  logoPosition: 'left' | 'center' | 'right';
  showBorder: boolean;
  fontSize: 'small' | 'medium' | 'large';
  primaryColor: string;
}

// ============= PHARMACY SALE (POS) =============

export interface PharmacySale {
  id: string;
  items: PharmacySaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  totalAmount?: number;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'check' | 'insurance';
  amountReceived?: number;
  change?: number;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  patientId?: string;
  patient?: Patient;
  cashierId: string;
  cashierName: string;
  createdAt: string;
  saleDate?: string;
  receiptNumber: string;
  notes?: string;
}

export interface PharmacySaleItem {
  id: string;
  medicationId: string;
  medicationName: string;
  medication?: Medication;
  barcode?: string;
  quantity: number;
  unitPrice: number;
  subtotal?: number;
  total: number;
}

// ============= BIOTECH & MÉDECINE DE PRÉCISION =============

export interface GenomicProfile {
  id: string;
  patientId: string;
  patientName?: string;
  testDate: string;
  panelName: string;
  genes: GeneVariant[];
  phenotypes: Record<string, string>;
  recommendations: string[];
  status: 'draft' | 'validated' | 'archived';
  labTechnicianId?: string;
  notes?: string;
}

export interface GeneVariant {
  gene: string;
  diplotype: string;
  phenotype: 'Poor Metabolizer' | 'Intermediate Metabolizer' | 'Normal Metabolizer' | 'Rapid Metabolizer' | 'Ultra-rapid Metabolizer' | 'Pathogenic Variant' | 'Normal';
  activityScore?: number;
  clinicalImpact: string;
}

export interface PGxDrugInteraction {
  id: string;
  gene: string;
  medicationName: string;
  riskLevel: 'contraindicated' | 'dose_adjustment' | 'caution' | 'normal';
  clinicalSummary: string;
  recommendation: string;
  source: 'CPIC' | 'DPWG' | 'FDA';
}

export interface BioSample {
  id: string;
  sampleCode: string;
  patientId: string;
  patientName?: string;
  sampleType: 'DNA' | 'RNA' | 'Plasma' | 'Serum' | 'Tissue Biopsy' | 'Bone Marrow' | 'Cell Culture';
  collectionDate: string;
  volumeMl: number;
  concentration?: string;
  freezerId: string;
  freezerName?: string;
  rackNumber: string;
  boxNumber: string;
  wellPosition: string;
  storageTemp: '-80°C' | '-196°C' | '-20°C' | '4°C';
  consentSigned: boolean;
  consentType: 'Research & Diagnostics' | 'General Biobanking' | 'Clinical Trial Only';
  qualityScore: 'A' | 'B' | 'C' | 'Degraded';
  status: 'available' | 'reserved' | 'depleted' | 'destroyed';
  notes?: string;
}

export interface BiobankFreezer {
  id: string;
  name: string;
  temperature: '-80°C' | '-196°C (Azote Liquide)' | '-20°C';
  location: string;
  capacityBoxes: number;
  usedBoxes: number;
  status: 'optimal' | 'warning' | 'maintenance';
}

export interface ClinicalTrial {
  id: string;
  code: string;
  title: string;
  phase: 'Phase I' | 'Phase II' | 'Phase III' | 'Phase IV' | 'Translational';
  principalInvestigator: string;
  targetEnrollment: number;
  currentEnrollment: number;
  startDate: string;
  endDate?: string;
  status: 'recruiting' | 'active' | 'completed' | 'suspended';
  description: string;
  inclusionCriteria: string[];
  exclusionCriteria: string[];
  participants?: TrialParticipant[];
}

export interface TrialParticipant {
  id: string;
  patientId: string;
  patientName: string;
  trialId: string;
  enrolledDate: string;
  armGroup: 'Arm A (Biothérapie active)' | 'Arm B (Standard Care)' | 'Placebo';
  status: 'active' | 'completed' | 'withdrawn' | 'adverse_event';
  lastVisitDate?: string;
}

