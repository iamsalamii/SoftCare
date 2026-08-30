import {
  User, Patient, MedicalRecord, Medication, Appointment,
  Invoice, Insurance, PatientInsurance, Bed, Admission,
  LabTest, LabOrder, VitalSigns, CarePlan, EmergencyVisit,
  Surgery, OperatingRoom, Department, WorkSchedule, Notification,
  MedicationMovement, Room, GenomicProfile, PGxDrugInteraction,
  BioSample, BiobankFreezer, ClinicalTrial
} from '../types';

// ============= UTILISATEURS =============

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Marie Dubois',
    email: 'marie.dubois@hopital.fr',
    role: 'doctor',
    department: '1',
    phone: '+33 1 23 45 67 89',
    specialization: 'Cardiologie',
    licenseNumber: 'MED-2015-0042',
    active: true,
    createdAt: '2020-01-15',
    permissions: ['view_patients', 'edit_patients', 'create_prescriptions', 'view_medical_records', 'perform_surgery']
  },
  {
    id: '2',
    name: 'Sophie Martin',
    email: 'sophie.martin@hopital.fr',
    role: 'nurse',
    department: '3',
    phone: '+33 1 23 45 67 90',
    active: true,
    createdAt: '2019-03-20',
    permissions: ['view_patients', 'edit_vital_signs', 'view_medical_records', 'administer_medications']
  },
  {
    id: '3',
    name: 'Pierre Lefebvre',
    email: 'pierre.l@hopital.fr',
    role: 'pharmacist',
    department: '5',
    phone: '+33 1 23 45 67 91',
    active: true,
    createdAt: '2018-06-10',
    permissions: ['manage_medications', 'dispense_prescriptions', 'manage_stock']
  },
  {
    id: 'admin-1',
    name: 'Administrateur Principal',
    email: 'admin@hopital.com',
    role: 'admin',
    department: '7',
    phone: '+33 1 23 45 67 92',
    active: true,
    createdAt: '2020-01-01',
    permissions: ['manage_users', 'system_admin', 'view_all_data', 'manage_permissions']
  },
  {
    id: '4',
    name: 'Admin Système',
    email: 'admin@hopital.fr',
    role: 'admin',
    department: '7',
    phone: '+33 1 23 45 67 92',
    active: true,
    createdAt: '2020-01-01',
    permissions: ['manage_users', 'system_admin', 'view_all_data', 'manage_permissions']
  },
  {
    id: '5',
    name: 'Dr. Jean Rousseau',
    email: 'jean.rousseau@hopital.fr',
    role: 'surgeon',
    department: '2',
    phone: '+33 1 23 45 67 93',
    specialization: 'Chirurgie générale',
    licenseNumber: 'MED-2010-0128',
    active: true,
    createdAt: '2017-09-05',
    permissions: ['view_patients', 'edit_patients', 'perform_surgery', 'view_medical_records']
  },
  {
    id: '6',
    name: 'Claire Petit',
    email: 'claire.petit@hopital.fr',
    role: 'lab_tech',
    department: '6',
    phone: '+33 1 23 45 67 94',
    active: true,
    createdAt: '2021-02-15',
    permissions: ['manage_lab_tests', 'view_lab_orders', 'enter_results']
  },
  {
    id: '7',
    name: 'Marc Durand',
    email: 'marc.durand@hopital.fr',
    role: 'receptionist',
    department: '7',
    phone: '+33 1 23 45 67 95',
    active: true,
    createdAt: '2022-05-10',
    permissions: ['view_patients', 'create_appointments', 'manage_admissions']
  }
];

// ============= DÉPARTEMENTS =============

export const mockDepartments: Department[] = [
  { id: '1', name: 'Cardiologie', code: 'CARD', headId: '1', description: 'Service de cardiologie', location: 'Bâtiment A, 2ème étage', phone: '+33 1 23 45 68 01', type: 'medical', beds: 30, active: true },
  { id: '2', name: 'Chirurgie', code: 'CHIR', headId: '5', description: 'Service de chirurgie', location: 'Bâtiment B, RDC', phone: '+33 1 23 45 68 02', type: 'surgical', beds: 25, active: true },
  { id: '3', name: 'Urgences', code: 'URG', headId: '2', description: 'Service des urgences', location: 'Bâtiment Principal, RDC', phone: '+33 1 23 45 68 03', type: 'medical', beds: 15, active: true },
  { id: '4', name: 'Pédiatrie', code: 'PED', description: 'Service de pédiatrie', location: 'Bâtiment C, 1er étage', phone: '+33 1 23 45 68 04', type: 'medical', beds: 20, active: true },
  { id: '5', name: 'Pharmacie', code: 'PHARM', headId: '3', description: 'Service pharmacie', location: 'Bâtiment Principal, Sous-sol', phone: '+33 1 23 45 68 05', type: 'support', beds: 0, active: true },
  { id: '6', name: 'Laboratoire', code: 'LAB', headId: '6', description: 'Service de biologie médicale', location: 'Bâtiment B, 1er étage', phone: '+33 1 23 45 68 06', type: 'support', beds: 0, active: true },
  { id: '7', name: 'Administration', code: 'ADMIN', headId: '4', description: 'Service administratif', location: 'Bâtiment Principal, 3ème étage', phone: '+33 1 23 45 68 07', type: 'administrative', beds: 0, active: true }
];

// ============= PATIENTS =============

export const mockPatients: Patient[] = [
  {
    id: '1',
    firstName: 'Jean',
    lastName: 'Dupont',
    dateOfBirth: '1980-05-15',
    gender: 'male',
    phone: '+33 6 12 34 56 78',
    email: 'jean.dupont@email.fr',
    address: '123 Rue de la Paix, 75001 Paris',
    emergencyContact: {
      name: 'Marie Dupont',
      phone: '+33 6 12 34 56 79',
      relationship: 'Épouse'
    },
    medicalHistory: [],
    allergies: ['Pénicilline', 'Aspirine'],
    bloodType: 'A+',
    insuranceId: '1',
    socialSecurityNumber: '1 80 05 75 001 123',
    maritalStatus: 'married',
    occupation: 'Ingénieur',
    primaryDoctorId: '1',
    active: true,
    createdAt: '2023-01-10'
  },
  {
    id: '2',
    firstName: 'Anne',
    lastName: 'Bernard',
    dateOfBirth: '1992-08-22',
    gender: 'female',
    phone: '+33 6 23 45 67 89',
    email: 'anne.bernard@email.fr',
    address: '456 Avenue des Champs, 75008 Paris',
    emergencyContact: {
      name: 'Paul Bernard',
      phone: '+33 6 23 45 67 90',
      relationship: 'Père'
    },
    medicalHistory: [],
    allergies: [],
    bloodType: 'O-',
    insuranceId: '2',
    socialSecurityNumber: '2 92 08 75 008 456',
    maritalStatus: 'single',
    occupation: 'Professeur',
    primaryDoctorId: '1',
    active: true,
    createdAt: '2023-02-15'
  },
  {
    id: '3',
    firstName: 'Michel',
    lastName: 'Leroy',
    dateOfBirth: '1965-11-30',
    gender: 'male',
    phone: '+33 6 34 56 78 90',
    email: 'michel.leroy@email.fr',
    address: '789 Boulevard Haussmann, 75009 Paris',
    emergencyContact: {
      name: 'Françoise Leroy',
      phone: '+33 6 34 56 78 91',
      relationship: 'Épouse'
    },
    medicalHistory: [],
    allergies: ['Sulfamides'],
    bloodType: 'B+',
    insuranceId: '1',
    socialSecurityNumber: '1 65 11 75 009 789',
    maritalStatus: 'married',
    occupation: 'Retraité',
    primaryDoctorId: '1',
    active: true,
    createdAt: '2023-03-20'
  }
];

// ============= MÉDICAMENTS =============

export const mockMedications: Medication[] = [
  {
    id: '1',
    name: 'Doliprane 1000mg',
    genericName: 'Paracétamol',
    category: 'Antalgique',
    manufacturer: 'Sanofi',
    stock: 500,
    minStock: 100,
    price: 2.85,
    unitPrice: 2.85,
    expiryDate: '2026-12-31',
    batchNumber: 'DOL-2026-A1',
    barcode: '3400938472910',
    qrCode: 'SOFTCARE|MED:Doliprane|LOT:DOL-2026-A1|EXP:2026-12-31',
    description: 'Antalgique et antipyrétique de première intention',
    dosageForm: 'tablet',
    strength: '1000mg',
    storageCondition: 'ambient',
    requiresPrescription: false,
    location: 'Étagère A1'
  },
  {
    id: '2',
    name: 'Amoxicilline 500mg',
    genericName: 'Amoxicilline trihydrate',
    category: 'Antibiotique',
    manufacturer: 'Biogaran',
    stock: 250,
    minStock: 50,
    price: 8.90,
    unitPrice: 8.90,
    expiryDate: '2026-06-30',
    batchNumber: 'AMX-2026-B4',
    barcode: '3400938472927',
    qrCode: 'SOFTCARE|MED:Amoxicilline|LOT:AMX-2026-B4|EXP:2026-06-30',
    description: 'Antibactérien bêta-lactamine à large spectre',
    dosageForm: 'capsule',
    strength: '500mg',
    storageCondition: 'ambient',
    requiresPrescription: true,
    location: 'Étagère B2'
  },
  {
    id: '3',
    name: 'Ventoline 100µg',
    genericName: 'Salbutamol',
    category: 'Bronchodilatateur',
    manufacturer: 'GlaxoSmithKline',
    stock: 75,
    minStock: 20,
    price: 12.50,
    unitPrice: 12.50,
    expiryDate: '2026-09-15',
    batchNumber: 'VEN-2026-C8',
    barcode: '3400938472934',
    qrCode: 'SOFTCARE|MED:Ventoline|LOT:VEN-2026-C8|EXP:2026-09-15',
    description: 'Traitement symptomatique de la crise d\'asthme',
    dosageForm: 'injection',
    strength: '100µg/dose',
    storageCondition: 'ambient',
    requiresPrescription: true,
    location: 'Étagère C1'
  },
  {
    id: '4',
    name: 'Plavix 75mg (PGx Cible)',
    genericName: 'Clopidogrel',
    category: 'Antiagrégant',
    manufacturer: 'Sanofi',
    stock: 180,
    minStock: 40,
    price: 18.50,
    unitPrice: 18.50,
    expiryDate: '2026-11-20',
    batchNumber: 'PLV-2026-D2',
    barcode: '3400938472941',
    qrCode: 'SOFTCARE|MED:Plavix|LOT:PLV-2026-D2|EXP:2026-11-20',
    description: 'Antiagrégant plaquettaire - Bioactivation dépendante du gène CYP2C19',
    dosageForm: 'tablet',
    strength: '75mg',
    storageCondition: 'ambient',
    isBiotech: true,
    atcCode: 'B01AC04',
    requiresPrescription: true,
    location: 'Étagère A2'
  },
  {
    id: '5',
    name: 'Lantus SoloStar (Chaîne Froid)',
    genericName: 'Insuline Glargine',
    category: 'Antidiabétique',
    manufacturer: 'Sanofi-Aventis',
    stock: 30,
    minStock: 50,
    price: 45.00,
    unitPrice: 45.00,
    expiryDate: '2026-04-01',
    batchNumber: 'LAN-2026-E9',
    barcode: '3400938472958',
    qrCode: 'SOFTCARE|MED:Lantus|LOT:LAN-2026-E9|EXP:2026-04-01',
    description: 'Insuline basale d\'action prolongée (Biotechnologie recombinante)',
    dosageForm: 'injection',
    strength: '100 U/ml',
    storageCondition: 'cold_2_8',
    isBiotech: true,
    requiresPrescription: true,
    location: 'Réfrigérateur R1 (2-8°C)'
  },
  {
    id: '6',
    name: 'Herceptin 150mg (Biothérapie)',
    genericName: 'Trastuzumab',
    category: 'Oncologie / Biothérapie',
    manufacturer: 'Roche',
    stock: 15,
    minStock: 10,
    price: 680.00,
    unitPrice: 680.00,
    expiryDate: '2027-01-15',
    batchNumber: 'HER-2026-BT01',
    barcode: '3400938472965',
    qrCode: 'SOFTCARE|MED:Herceptin|LOT:HER-2026-BT01|EXP:2027-01-15',
    description: 'Anticorps monoclonal humanisé ciblant HER2/neu (Cancer du sein/gastrique)',
    dosageForm: 'injection',
    strength: '150mg',
    storageCondition: 'cold_2_8',
    isBiotech: true,
    atcCode: 'L01FD01',
    requiresPrescription: true,
    location: 'Chambre Froide Oncologie (2-8°C)'
  },
  {
    id: '7',
    name: 'Codoliprane 500mg/30mg (PGx Cible)',
    genericName: 'Paracétamol / Codéine',
    category: 'Antalgique Palier 2',
    manufacturer: 'Sanofi',
    stock: 120,
    minStock: 30,
    price: 4.80,
    unitPrice: 4.80,
    expiryDate: '2026-10-10',
    batchNumber: 'COD-2026-F3',
    barcode: '3400938472972',
    qrCode: 'SOFTCARE|MED:Codoliprane|LOT:COD-2026-F3|EXP:2026-10-10',
    description: 'Association antalgique - Conversion de la codéine en morphine régulée par CYP2D6',
    dosageForm: 'tablet',
    strength: '500mg/30mg',
    storageCondition: 'ambient',
    isBiotech: true,
    requiresPrescription: true,
    location: 'Armoire Sécurisée P2'
  }
];

export const mockMedicationMovements: MedicationMovement[] = [
  { id: '1', medicationId: '1', type: 'in', quantity: 200, reason: 'Réception commande F12345', performedBy: '3', date: '2024-01-10', referenceId: 'PO-2024-001' },
  { id: '2', medicationId: '2', type: 'out', quantity: 20, reason: 'Dispensation prescription', performedBy: '3', date: '2024-01-12', referenceId: 'RX-2024-045' },
  { id: '3', medicationId: '5', type: 'adjustment', quantity: -5, reason: 'Correction inventaire', performedBy: '3', date: '2024-01-15' }
];

// ============= RENDEZ-VOUS =============

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: 30,
    type: 'consultation',
    status: 'scheduled',
    notes: 'Contrôle cardiologique de routine',
    reason: 'Suivi hypertension',
    createdAt: '2024-01-10'
  },
  {
    id: '2',
    patientId: '2',
    doctorId: '1',
    date: new Date().toISOString().split('T')[0],
    time: '10:30',
    duration: 45,
    type: 'follow-up',
    status: 'confirmed',
    notes: 'Suivi post-opératoire',
    reason: 'Contrail post-appendicectomie',
    createdAt: '2024-01-08'
  },
  {
    id: '3',
    patientId: '3',
    doctorId: '5',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    duration: 60,
    type: 'surgery',
    status: 'scheduled',
    notes: 'Chirurgie programmée',
    reason: 'Hernie inguinale',
    createdAt: '2024-01-05'
  }
];

// ============= DOSSIERS MÉDICAUX =============

export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    date: '2024-01-05',
    type: 'consultation',
    title: 'Consultation cardiologie',
    description: 'Patient vu pour suivi de son hypertension artérielle. PA stable sous traitement.',
    symptoms: ['Céphalées occasionnelles'],
    diagnosis: 'Hypertension artérielle essentielle contrôlée',
    treatment: 'Maintien traitement actuel: Kardégic 75mg x1/jour, Ramipril 5mg x1/jour',
    prescriptions: [],
    attachments: [],
    followUp: 'Revoir dans 3 mois',
    notes: 'Patient compliant au traitement',
    status: 'active'
  },
  {
    id: '2',
    patientId: '2',
    doctorId: '1',
    date: '2024-01-08',
    type: 'consultation',
    title: 'Suivi post-opératoire',
    description: 'Contrôle post-appendicectomie. Cicatrisation normale.',
    symptoms: [],
    diagnosis: 'Post-appendicectomie - évolution favorable',
    treatment: 'Surveillance simple',
    prescriptions: [
      {
        id: '1',
        medicationId: '1',
        medicationName: 'Doliprane 1000mg',
        dosage: '1000mg',
        frequency: 'Toutes les 6h si douleur',
        duration: '5 jours',
        instructions: 'À prendre avec un verre d\'eau',
        status: 'pending'
      }
    ],
    attachments: [],
    followUp: 'Contrôle dans 15 jours',
    status: 'active'
  }
];

// ============= ASSURANCES =============

export const mockInsurances: Insurance[] = [
  {
    id: '1',
    name: 'Sécurité Sociale',
    code: 'SS',
    type: 'public',
    coveragePercent: 70,
    contactPhone: '3646',
    contactEmail: 'contact@ameli.fr',
    address: 'Paris, France',
    active: true
  },
  {
    id: '2',
    name: 'Mutuelle Générale',
    code: 'MG',
    type: 'mutual',
    coveragePercent: 100,
    contactPhone: '+33 1 40 41 30 00',
    contactEmail: 'contact@mutuellegenerale.fr',
    address: '3 Villa Gaudelet, 75011 Paris',
    active: true
  },
  {
    id: '3',
    name: 'AXA Santé',
    code: 'AXA',
    type: 'private',
    coveragePercent: 95,
    contactPhone: '+33 1 55 12 44 44',
    contactEmail: 'sante@axa.fr',
    address: '313 Avenue Gambetta, 75020 Paris',
    active: true
  }
];

export const mockPatientInsurances: PatientInsurance[] = [
  { id: '1', patientId: '1', insuranceId: '1', policyNumber: 'SS-1-80-05', subscriberNumber: '1 80 05 75 001 123', validFrom: '2020-01-01', validTo: '2099-12-31', beneficiary: false },
  { id: '2', patientId: '1', insuranceId: '2', policyNumber: 'MG-2023-456789', validFrom: '2023-01-01', validTo: '2024-12-31', beneficiary: true },
  { id: '3', patientId: '2', insuranceId: '1', policyNumber: 'SS-2-92-08', subscriberNumber: '2 92 08 75 008 456', validFrom: '2022-01-01', validTo: '2099-12-31', beneficiary: false },
  { id: '4', patientId: '2', insuranceId: '3', policyNumber: 'AXA-2023-123456', validFrom: '2023-06-01', validTo: '2024-06-01', beneficiary: true }
];

// ============= FACTURES =============

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    patientId: '1',
    date: '2024-01-05',
    dueDate: '2024-02-05',
    items: [
      { id: '1', description: 'Consultation cardiologie', type: 'consultation', quantity: 1, unitPrice: 50, total: 50 },
      { id: '2', description: 'ECG', type: 'procedure', quantity: 1, unitPrice: 35, total: 35 }
    ],
    subtotal: 85,
    tax: 0,
    discount: 0,
    total: 85,
    status: 'paid',
    payments: [
      { id: '1', invoiceId: '1', amount: 85, method: 'card', date: '2024-01-05', receivedBy: '7' }
    ],
    notes: 'Payé par carte bancaire',
    createdAt: '2024-01-05',
    createdBy: '7'
  }
];

// ============= LITS & CHAMBRES =============

export const mockBeds: Bed[] = [
  { id: '1', roomNumber: '101', bedNumber: 'A', departmentId: '1', type: 'standard', status: 'available', features: ['TV', 'Salle de bain'], dailyRate: 150 },
  { id: '2', roomNumber: '101', bedNumber: 'B', departmentId: '1', type: 'standard', status: 'occupied', currentPatientId: '1', currentAdmissionId: '1', features: ['TV', 'Salle de bain'], dailyRate: 150 },
  { id: '3', roomNumber: '102', bedNumber: 'A', departmentId: '1', type: 'icu', status: 'available', features: ['Monitoring', 'Ventilateur', 'TV'], dailyRate: 500 },
  { id: '4', roomNumber: '201', bedNumber: 'A', departmentId: '2', type: 'standard', status: 'available', features: ['TV', 'Salle de bain'], dailyRate: 150 },
  { id: '5', roomNumber: '301', bedNumber: 'A', departmentId: '3', type: 'emergency', status: 'available', features: ['Monitoring'], dailyRate: 200 },
  { id: '6', roomNumber: '301', bedNumber: 'B', departmentId: '3', type: 'emergency', status: 'occupied', currentPatientId: '2', currentAdmissionId: '2', features: ['Monitoring'], dailyRate: 200 }
];

export const mockRooms: Room[] = [
  { id: '1', number: 'C1', departmentId: '1', type: 'consultation', capacity: 1, equipment: ['Table d\'examen', 'ECG'], status: 'available' },
  { id: '2', number: 'C2', departmentId: '1', type: 'consultation', capacity: 1, equipment: ['Table d\'examen', 'Échographe'], status: 'occupied' },
  { id: '3', number: 'OP1', departmentId: '2', type: 'operation', capacity: 1, equipment: ['Table opératoire', 'Lampe scialytique', 'Monitoring'], status: 'available' },
  { id: '4', number: 'OP2', departmentId: '2', type: 'operation', capacity: 1, equipment: ['Table opératoire', 'Lampe scialytique', 'Monitoring', 'Armoire à endoscopie'], status: 'in-use' }
];

export const mockAdmissions: Admission[] = [
  {
    id: '1',
    patientId: '1',
    bedId: '2',
    doctorId: '1',
    type: 'planned',
    reason: 'Explorations cardiologiques',
    admissionDate: '2024-01-15',
    expectedDischargeDate: '2024-01-18',
    status: 'admitted',
    departmentId: '1',
    notes: 'Admission programmée pour coronarographie'
  },
  {
    id: '2',
    patientId: '2',
    bedId: '6',
    doctorId: '2',
    type: 'emergency',
    reason: 'Douleurs abdominales aiguës',
    admissionDate: '2024-01-12',
    expectedDischargeDate: '2024-01-16',
    status: 'admitted',
    departmentId: '3',
    notes: 'Suspicion appendicite'
  }
];

// ============= LABORATOIRE =============

export const mockLabTests: LabTest[] = [
  {
    id: '1',
    name: 'Numération Formule Sanguine',
    code: 'NFS',
    category: 'blood',
    description: 'Analyse complète des cellules sanguines',
    sampleType: 'Sang veineux',
    turnaroundTime: 2,
    price: 15,
    referenceRanges: [
      { min: 4.0, max: 10.0, unit: 'G/L', interpretation: 'Leucocytes normaux' },
      { min: 120, max: 160, unit: 'G/L', interpretation: 'Hémoglobine normale (homme)' },
      { min: 130, max: 170, unit: 'G/L', interpretation: 'Hémoglobine normale (femme)', gender: 'female' }
    ],
    active: true
  },
  {
    id: '2',
    name: 'Glycémie à jeun',
    code: 'GLY',
    category: 'blood',
    description: 'Taux de glucose sanguin',
    sampleType: 'Sang veineux',
    turnaroundTime: 1,
    price: 5,
    preparationInstructions: 'À jeun depuis 12h',
    referenceRanges: [
      { min: 0.70, max: 1.10, unit: 'g/L', interpretation: 'Normale' }
    ],
    active: true
  },
  {
    id: '3',
    name: 'Créatininémie',
    code: 'CREA',
    category: 'blood',
    description: 'Fonction rénale',
    sampleType: 'Sang veineux',
    turnaroundTime: 1,
    price: 8,
    referenceRanges: [
      { min: 60, max: 110, unit: 'µmol/L', interpretation: 'Normale (homme)', gender: 'male' },
      { min: 45, max: 90, unit: 'µmol/L', interpretation: 'Normale (femme)', gender: 'female' }
    ],
    active: true
  },
  {
    id: '4',
    name: 'ECBU',
    code: 'ECBU',
    category: 'urine',
    description: 'Examen cytobactériologique des urines',
    sampleType: 'Urine',
    turnaroundTime: 24,
    price: 20,
    referenceRanges: [],
    active: true
  },
  {
    id: '5',
    name: 'Troponine',
    code: 'TROP',
    category: 'blood',
    description: 'Marqueur cardiaque',
    sampleType: 'Sang veineux',
    turnaroundTime: 1,
    price: 25,
    referenceRanges: [
      { min: 0, max: 0.04, unit: 'µg/L', interpretation: 'Négatif' }
    ],
    active: true
  }
];

export const mockLabOrders: LabOrder[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    tests: [
      { id: '1', labTestId: '1', testName: 'Numération Formule Sanguine' },
      { id: '2', labTestId: '5', testName: 'Troponine' },
      { id: '3', labTestId: '3', testName: 'Créatininémie' }
    ],
    priority: 'urgent',
    status: 'pending',
    notes: 'Bilan pré-coronarographie',
    createdAt: '2024-01-15T08:00:00'
  },
  {
    id: '2',
    patientId: '2',
    doctorId: '1',
    tests: [
      { id: '1', labTestId: '1', testName: 'Numération Formule Sanguine', result: '11.2', unit: 'G/L', flag: 'high', referenceRange: '4.0-10.0' },
      { id: '2', labTestId: '2', testName: 'Glycémie à jeun', result: '0.95', unit: 'g/L', flag: 'normal', referenceRange: '0.70-1.10' }
    ],
    priority: 'routine',
    status: 'completed',
    notes: 'Bilan pré-opératoire',
    createdAt: '2024-01-10T10:00:00',
    collectedAt: '2024-01-10T11:00:00',
    collectedBy: '6',
    completedAt: '2024-01-10T14:00:00'
  }
];

// ============= SIGNES VITAUX =============

export const mockVitalSigns: VitalSigns[] = [
  {
    id: '1',
    patientId: '1',
    recordedBy: '2',
    date: '2024-01-15',
    time: '08:00',
    temperature: 36.8,
    bloodPressureSystolic: 135,
    bloodPressureDiastolic: 85,
    heartRate: 72,
    respiratoryRate: 16,
    oxygenSaturation: 98,
    weight: 82,
    painLevel: 2
  },
  {
    id: '2',
    patientId: '1',
    recordedBy: '2',
    date: '2024-01-15',
    time: '14:00',
    temperature: 36.5,
    bloodPressureSystolic: 128,
    bloodPressureDiastolic: 82,
    heartRate: 68,
    respiratoryRate: 16,
    oxygenSaturation: 99,
    weight: 82
  },
  {
    id: '3',
    patientId: '2',
    recordedBy: '2',
    date: '2024-01-12',
    time: '22:00',
    temperature: 37.5,
    bloodPressureSystolic: 110,
    bloodPressureDiastolic: 70,
    heartRate: 88,
    respiratoryRate: 20,
    oxygenSaturation: 97,
    painLevel: 6,
    notes: 'Douleur abdominale'
  }
];

// ============= PLANS DE SOINS =============

export const mockCarePlans: CarePlan[] = [
  {
    id: '1',
    patientId: '1',
    admissionId: '1',
    createdBy: '2',
    createdAt: '2024-01-15',
    diagnosis: 'Exploration cardiologique - Coronarographie programmée',
    goals: [
      { id: '1', description: 'Maintenir PA stable', targetDate: '2024-01-18', status: 'in-progress' },
      { id: '2', description: 'Préparer le patient pour coronarographie', targetDate: '2024-01-16', status: 'achieved' }
    ],
    interventions: [
      { id: '1', description: 'Surveillance PA toutes les 4h', frequency: 'Toutes les 4h', assignedTo: '2', status: 'in-progress', lastPerformed: '2024-01-15T14:00', nextDue: '2024-01-15T18:00' },
      { id: '2', description: 'Administration prémédication', frequency: 'Unique', assignedTo: '2', status: 'pending' }
    ],
    status: 'active'
  }
];

// ============= URGENCES =============

export const mockEmergencyVisits: EmergencyVisit[] = [
  {
    id: '1',
    patientId: '2',
    arrivalTime: '2024-01-12T21:30:00',
    arrivalMode: 'walking',
    chiefComplaint: 'Douleurs abdominales aiguës',
    triageLevel: 2,
    triageTime: '2024-01-12T21:45:00',
    triageBy: '2',
    status: 'admitted',
    assignedDoctorId: '1',
    assignedBedId: '6',
    notes: 'Suspicion appendicite aiguë'
  },
  {
    id: '2',
    patientId: '3',
    arrivalTime: '2024-01-14T10:00:00',
    arrivalMode: 'ambulance',
    chiefComplaint: 'Douleur thoracique',
    triageLevel: 1,
    triageTime: '2024-01-14T10:05:00',
    triageBy: '2',
    status: 'in-treatment',
    assignedDoctorId: '1',
    assignedBedId: '3',
    notes: 'Suspicion syndrome coronaire aigu'
  }
];

// ============= BLOC OPÉRATOIRE =============

export const mockOperatingRooms: OperatingRoom[] = [
  { id: '1', name: 'Salle 1', number: 'OP1', type: 'general', status: 'available', equipment: ['Table opératoire', 'Lampe scialytique', 'Monitoring', 'Armoire à endoscopie'] },
  { id: '2', name: 'Salle 2', number: 'OP2', type: 'cardiac', status: 'in-use', equipment: ['Table opératoire', 'Lampe scialytique', 'Monitoring', 'Circulation extracorporelle'] },
  { id: '3', name: 'Salle 3', number: 'OP3', type: 'neuro', status: 'cleaning', equipment: ['Table opératoire', 'Lampe scialytique', 'Monitoring', 'Microscope'] }
];

export const mockSurgeries: Surgery[] = [
  {
    id: '1',
    patientId: '2',
    admissionId: '2',
    scheduledDate: '2024-01-13',
    scheduledTime: '09:00',
    duration: 90,
    type: 'emergency',
    procedure: 'Appendicectomie',
    surgeonId: '5',
    anesthesiologistId: '8',
    scrubNurseId: '2',
    operatingRoomId: '1',
    status: 'completed',
    anesthesiaType: 'general',
    preOpDiagnosis: 'Appendicite aiguë',
    postOpDiagnosis: 'Appendicite aiguë confirmée',
    startTime: '2024-01-13T09:15',
    endTime: '2024-01-13T10:30'
  },
  {
    id: '2',
    patientId: '1',
    scheduledDate: '2024-01-16',
    scheduledTime: '14:00',
    duration: 60,
    type: 'elective',
    procedure: 'Coronarographie',
    surgeonId: '1',
    operatingRoomId: '2',
    status: 'scheduled',
    anesthesiaType: 'local',
    preOpDiagnosis: 'Angor stable'
  }
];

// ============= PLANNING PERSONNEL =============

export const mockWorkSchedules: WorkSchedule[] = [
  { id: '1', userId: '1', date: '2024-01-15', shiftType: 'day', startTime: '08:00', endTime: '18:00', departmentId: '1', status: 'scheduled' },
  { id: '2', userId: '2', date: '2024-01-15', shiftType: 'day', startTime: '06:00', endTime: '14:00', departmentId: '3', status: 'scheduled' },
  { id: '3', userId: '2', date: '2024-01-15', shiftType: 'night', startTime: '18:00', endTime: '02:00', departmentId: '3', status: 'scheduled' },
  { id: '4', userId: '3', date: '2024-01-15', shiftType: 'day', startTime: '08:00', endTime: '16:00', departmentId: '5', status: 'scheduled' }
];

// ============= NOTIFICATIONS =============

export const mockNotifications: Notification[] = [
  { id: '1', userId: '1', type: 'warning', title: 'Résultat urgent', message: 'Nouveau résultat de laboratoire pour patient Jean Dupont', link: '/lab-orders/1', read: false, createdAt: '2024-01-15T10:00' },
  { id: '2', userId: '3', type: 'critical', title: 'Stock faible', message: 'Insuline Glargine - Stock critique (30 unités)', link: '/pharmacy', read: false, createdAt: '2024-01-15T08:00' },
  { id: '3', userId: '2', type: 'info', title: 'Nouvelle admission', message: 'Nouveau patient aux urgences - Salle 301-B', link: '/emergencies', read: true, createdAt: '2024-01-14T22:00' }
];

// ============= BIOTECH & PHARMACOGÉNOMIQUE =============

export const mockGenomicProfiles: GenomicProfile[] = [
  {
    id: '1',
    patientId: '1', // Jean Dupont
    patientName: 'Jean Dupont',
    testDate: '2025-11-10',
    panelName: 'Cardio-PGx & Métabolisme Élargi',
    genes: [
      {
        gene: 'CYP2C19',
        diplotype: '*2/*2',
        phenotype: 'Poor Metabolizer',
        activityScore: 0,
        clinicalImpact: 'Incapacité à bioactiver le clopidogrel (Plavix). Risque élevé d\'échec thérapeutique post-stent.'
      },
      {
        gene: 'CYP2D6',
        diplotype: '*1/*1',
        phenotype: 'Normal Metabolizer',
        activityScore: 2.0,
        clinicalImpact: 'Métabolisme standard des antalgiques opioïdes et bêta-bloquants.'
      },
      {
        gene: 'SLCO1B1',
        diplotype: '*5/*5',
        phenotype: 'Poor Metabolizer',
        activityScore: 0,
        clinicalImpact: 'Risque accru de myopathie sous statines (Simvastatine / Atorvastatine).'
      }
    ],
    phenotypes: {
      'CYP2C19': 'Métaboliseur Lent (*2/*2)',
      'CYP2D6': 'Métaboliseur Normal (*1/*1)',
      'SLCO1B1': 'Fonction Réduite (*5/*5)'
    },
    recommendations: [
      'Éviter le Clopidogrel (Plavix) : Remplacer par Prasugrel ou Ticagrelor.',
      'Ajuster la posologie des statines à dose réduite ou privilégier la Rosuvastatine.'
    ],
    status: 'validated',
    labTechnicianId: '6',
    notes: 'Profil validé par le Laboratoire de Génétique Moléculaire.'
  },
  {
    id: '2',
    patientId: '2', // Anne Bernard
    patientName: 'Anne Bernard',
    testDate: '2026-01-20',
    panelName: 'Onco-Génomique & DPYD',
    genes: [
      {
        gene: 'CYP2D6',
        diplotype: '*1/*2xN',
        phenotype: 'Ultra-rapid Metabolizer',
        activityScore: 3.0,
        clinicalImpact: 'Conversion ultra-rapide de la codéine en morphine. Risque de surdosage toxique à dose standard.'
      },
      {
        gene: 'DPYD',
        diplotype: '*1/*1',
        phenotype: 'Normal Metabolizer',
        activityScore: 2.0,
        clinicalImpact: 'Tolérance normale aux fluoropyrimidines (5-FU, Capécitabine).'
      },
      {
        gene: 'BRCA1',
        diplotype: 'c.5266dupC (p.Gln1756Profs*74)',
        phenotype: 'Pathogenic Variant',
        clinicalImpact: 'Mutation délétère conférant une sensibilité aux inhibiteurs de PARP (Olaparib).'
      }
    ],
    phenotypes: {
      'CYP2D6': 'Métaboliseur Ultra-Rapide (*1/*2xN)',
      'DPYD': 'Activité Dihydropyrimidine Déshydrogénase Normale',
      'BRCA1': 'Mutation Pathogène Détectée'
    },
    recommendations: [
      'Contre-indication stricte à la Codéine et au Tramadol en raison du risque de dépression respiratoire aiguë.',
      'Discussion en RCP Oncogénétique pour éligibilité aux thérapies ciblées PARPi.'
    ],
    status: 'validated',
    labTechnicianId: '6',
    notes: 'Alerte pharmacovigilance transmise au dossier patient.'
  }
];

export const mockPGxInteractions: PGxDrugInteraction[] = [
  {
    id: '1',
    gene: 'CYP2C19',
    medicationName: 'Plavix (Clopidogrel)',
    riskLevel: 'contraindicated',
    clinicalSummary: 'Chez les métaboliseurs lents (*2/*2), le clopidogrel ne génère pas de métabolite actif, entraînant une résistance antiagrégante majeure.',
    recommendation: 'Privilégier Ticagrélor (Brilique) ou Prasugrel (Efient) qui ne dépendent pas du CYP2C19.',
    source: 'CPIC'
  },
  {
    id: '2',
    gene: 'CYP2D6',
    medicationName: 'Codoliprane (Codéine)',
    riskLevel: 'contraindicated',
    clinicalSummary: 'Chez les métaboliseurs ultra-rapides, la codéine est transformée massivement en morphine libre dans le sang en quelques minutes.',
    recommendation: 'Éviter la codéine. Utiliser un analgésique non dépendant du CYP2D6 (Paracétamol seul, AINS, ou Morphine titrée).',
    source: 'FDA'
  },
  {
    id: '3',
    gene: 'DPYD',
    medicationName: '5-Fluorouracile / Capécitabine',
    riskLevel: 'contraindicated',
    clinicalSummary: 'Le déficit en enzyme DPYD empêche l\'élimination de la chimiothérapie, entraînant des toxicités hématologiques et digestives mortelles.',
    recommendation: 'Réduction de dose de 50% ou contre-indication absolue selon le génotype.',
    source: 'DPWG'
  }
];

// ============= BIOBANQUE & GESTION D'ÉCHANTILLONS =============

export const mockBiobankFreezers: BiobankFreezer[] = [
  { id: 'FRZ-80-01', name: 'CryoConservateur Principal A (-80°C)', temperature: '-80°C', location: 'Labo Biotech - Salle Cryo 01', capacityBoxes: 100, usedBoxes: 42, status: 'optimal' },
  { id: 'FRZ-80-02', name: 'CryoConservateur B (-80°C)', temperature: '-80°C', location: 'Labo Biotech - Salle Cryo 01', capacityBoxes: 100, usedBoxes: 68, status: 'optimal' },
  { id: 'FRZ-196-01', name: 'Cuve Azote Liquide N2 (-196°C)', temperature: '-196°C (Azote Liquide)', location: 'Sous-sol Biobanque sécurisée', capacityBoxes: 50, usedBoxes: 28, status: 'optimal' }
];

export const mockBioSamples: BioSample[] = [
  {
    id: '1',
    sampleCode: 'BS-2026-DNA-0142',
    patientId: '1',
    patientName: 'Jean Dupont',
    sampleType: 'DNA',
    collectionDate: '2025-11-10',
    volumeMl: 0.5,
    concentration: '145 ng/µL (A260/280: 1.85)',
    freezerId: 'FRZ-80-01',
    freezerName: 'CryoConservateur Principal A (-80°C)',
    rackNumber: 'Rack-03',
    boxNumber: 'Boîte-ADN-12',
    wellPosition: 'C04',
    storageTemp: '-80°C',
    consentSigned: true,
    consentType: 'Research & Diagnostics',
    qualityScore: 'A',
    status: 'available',
    notes: 'Extraction par billes magnétiques automatisée.'
  },
  {
    id: '2',
    sampleCode: 'BS-2026-TISS-0089',
    patientId: '2',
    patientName: 'Anne Bernard',
    sampleType: 'Tissue Biopsy',
    collectionDate: '2026-01-18',
    volumeMl: 1.0,
    concentration: 'Tissu cryopréservé OCT',
    freezerId: 'FRZ-196-01',
    freezerName: 'Cuve Azote Liquide N2 (-196°C)',
    rackNumber: 'CryoRack-01',
    boxNumber: 'Boîte-Tissus-04',
    wellPosition: 'A08',
    storageTemp: '-196°C',
    consentSigned: true,
    consentType: 'Research & Diagnostics',
    qualityScore: 'A',
    status: 'available',
    notes: 'Biopsie congelée en azote liquide flash (-196°C) en moins de 15 min.'
  },
  {
    id: '3',
    sampleCode: 'BS-2026-RNA-0033',
    patientId: '3',
    patientName: 'Pierre Martin',
    sampleType: 'RNA',
    collectionDate: '2026-02-05',
    volumeMl: 0.3,
    concentration: '95 ng/µL (RIN: 8.9)',
    freezerId: 'FRZ-80-01',
    freezerName: 'CryoConservateur Principal A (-80°C)',
    rackNumber: 'Rack-04',
    boxNumber: 'Boîte-ARN-02',
    wellPosition: 'E02',
    storageTemp: '-80°C',
    consentSigned: true,
    consentType: 'Clinical Trial Only',
    qualityScore: 'A',
    status: 'reserved',
    notes: 'Réservé pour séquençage transcriptome NGS.'
  }
];

// ============= ESSAIS CLINIQUES & RECHERCHE TRANSLATIONNELLE =============

export const mockClinicalTrials: ClinicalTrial[] = [
  {
    id: '1',
    code: 'CT-2026-CARDIO-PGX',
    title: 'Optimisation de l\'antiagrégation guidée par le génotypage CYP2C19 (Étude GENO-STENT)',
    phase: 'Phase III',
    principalInvestigator: 'Dr. Marie Dubois',
    targetEnrollment: 120,
    currentEnrollment: 48,
    startDate: '2025-06-01',
    endDate: '2027-06-30',
    status: 'recruiting',
    description: 'Évaluation clinique prospective de la réduction des événements ischémiques majeurs après angioplastie coronaire par sélection personnalisée de l\'antiagrégant.',
    inclusionCriteria: [
      'Âge ≥ 18 ans',
      'Syndrome coronarien aigu avec pose de stent',
      'Consentement éclairé signé'
    ],
    exclusionCriteria: [
      'Contre-indication absolue aux anticoagulants oraux',
      'Insuffisance hépatique sévère Child-Pugh C'
    ],
    participants: [
      {
        id: '1',
        patientId: '1',
        patientName: 'Jean Dupont',
        trialId: '1',
        enrolledDate: '2025-11-12',
        armGroup: 'Arm A (Biothérapie active)',
        status: 'active',
        lastVisitDate: '2026-02-10'
      }
    ]
  },
  {
    id: '2',
    code: 'CT-2026-ONCO-IMMUNO',
    title: 'Thérapie ciblée par anticorps conjugués chez les patientes avec mutation BRCA1/2',
    phase: 'Phase II',
    principalInvestigator: 'Dr. Thomas Leroy',
    targetEnrollment: 50,
    currentEnrollment: 18,
    startDate: '2025-09-15',
    status: 'active',
    description: 'Étude d\'efficacité et de tolérance d\'une nouvelle immunothérapie combinée.',
    inclusionCriteria: [
      'Mutation BRCA1 ou BRCA2 documentée',
      'Performance Status ECOG 0-1'
    ],
    exclusionCriteria: [
      'Antécédents d\'insuffisance cardiaque NYHA III-IV'
    ],
    participants: [
      {
        id: '2',
        patientId: '2',
        patientName: 'Anne Bernard',
        trialId: '2',
        enrolledDate: '2026-01-22',
        armGroup: 'Arm A (Biothérapie active)',
        status: 'active',
        lastVisitDate: '2026-02-15'
      }
    ]
  }
];

