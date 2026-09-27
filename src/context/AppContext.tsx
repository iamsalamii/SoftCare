import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from './ToastContext';
import { apiService } from '../services/apiService';
import {
  User, Patient, MedicalRecord, Medication, Appointment,
  Invoice, Bed, Admission, LabOrder, LabTest,
  EmergencyVisit, Surgery, Department, OperatingRoom,
  Notification, MedicationMovement, OrganizationSettings, DropdownOption, PharmacySale, QuickInvoiceItem,
  Room, VitalSigns, CarePlan, Insurance, PatientInsurance,
  GenomicProfile, PGxDrugInteraction, BioSample, BiobankFreezer, ClinicalTrial
} from '../types';
import {
  mockUsers, mockDepartments, mockPatients, mockMedications, mockMedicationMovements,
  mockAppointments, mockMedicalRecords, mockInsurances, mockPatientInsurances,
  mockInvoices, mockBeds, mockRooms, mockAdmissions, mockLabTests, mockLabOrders,
  mockVitalSigns, mockCarePlans, mockEmergencyVisits,
  mockNotifications, mockGenomicProfiles, mockPGxInteractions,
  mockBioSamples, mockBiobankFreezers, mockClinicalTrials
} from '../data/mockData';

interface AppContextType {
  dataLoading: boolean;
  dataError: string | null;
  currentView: string;
  setCurrentView: (view: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  authLoading: boolean;
  patients: Patient[];
  setPatients: (patients: Patient[]) => void;
  addPatient: (patient: Partial<Patient>) => Promise<void>;
  updatePatient: (id: string, patient: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  medicalRecords: MedicalRecord[];
  setMedicalRecords: (records: MedicalRecord[]) => void;
  addMedicalRecord: (record: Partial<MedicalRecord>) => Promise<void>;
  medications: Medication[];
  setMedications: (medications: Medication[]) => void;
  addMedication: (medication: Partial<Medication>) => Promise<void>;
  updateMedication: (id: string, medication: Partial<Medication>) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  medicationMovements: MedicationMovement[];
  setMedicationMovements: (movements: MedicationMovement[]) => void;
  addMedicationMovement: (movement: Partial<MedicationMovement>) => Promise<void>;
  appointments: Appointment[];
  setAppointments: (appointments: Appointment[]) => void;
  addAppointment: (appointment: Partial<Appointment>) => Promise<void>;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  users: User[];
  setUsers: (users: User[]) => void;
  addUser: (user: Partial<User>) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  departments: Department[];
  setDepartments: (departments: Department[]) => void;
  invoices: Invoice[];
  setInvoices: (invoices: Invoice[]) => void;
  addInvoice: (invoice: Partial<Invoice>, items: Partial<Invoice['items']>[number][]) => Promise<Invoice>;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  beds: Bed[];
  setBeds: (beds: Bed[]) => void;
  addBed: (bed: Partial<Bed>) => Promise<void>;
  updateBed: (id: string, bed: Partial<Bed>) => Promise<void>;
  deleteBed: (id: string) => Promise<void>;
  admissions: Admission[];
  setAdmissions: (admissions: Admission[]) => void;
  addAdmission: (admission: Partial<Admission>) => Promise<void>;
  updateAdmission: (id: string, admission: Partial<Admission>) => Promise<void>;
  labOrders: LabOrder[];
  setLabOrders: (orders: LabOrder[]) => void;
  addLabOrder: (order: Partial<LabOrder>) => Promise<void>;
  updateLabOrder: (id: string, order: Partial<LabOrder>) => Promise<void>;
  deleteLabOrder: (id: string) => Promise<void>;
  labTests: LabTest[];
  setLabTests: (tests: LabTest[]) => void;
  emergencyVisits: EmergencyVisit[];
  setEmergencyVisits: (visits: EmergencyVisit[]) => void;
  addEmergencyVisit: (visit: Partial<EmergencyVisit>) => Promise<void>;
  updateEmergencyVisit: (id: string, visit: Partial<EmergencyVisit>) => Promise<void>;
  surgeries: Surgery[];
  setSurgeries: (surgeries: Surgery[]) => void;
  addSurgery: (surgery: Partial<Surgery>) => Promise<void>;
  updateSurgery: (id: string, surgery: Partial<Surgery>) => Promise<void>;
  deleteSurgery: (id: string) => Promise<void>;
  operatingRooms: OperatingRoom[];
  setOperatingRooms: (rooms: OperatingRoom[]) => void;
  addOperatingRoom: (room: Partial<OperatingRoom>) => Promise<void>;
  updateOperatingRoom: (id: string, room: Partial<OperatingRoom>) => Promise<void>;
  workSchedules: any[];
  setWorkSchedules: (schedules: any[]) => void;
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;
  organizationSettings: OrganizationSettings;
  setOrganizationSettings: (settings: OrganizationSettings) => void;
  updateOrganizationSettings: (settings: Partial<OrganizationSettings>) => Promise<void>;
  dropdownOptions: DropdownOption[];
  setDropdownOptions: (options: DropdownOption[]) => void;
  getDropdownOptions: (category: string) => DropdownOption[];
  addDropdownOption: (option: DropdownOption) => void;
  updateDropdownOption: (id: string, updates: Partial<DropdownOption>) => void;
  deleteDropdownOption: (id: string) => void;
  pharmacySales: PharmacySale[];
  addPharmacySale: (sale: PharmacySale) => Promise<void>;
  quickInvoiceItems: QuickInvoiceItem[];
  addQuickInvoiceItem: (item: Partial<QuickInvoiceItem>) => Promise<void>;
  updateQuickInvoiceItem: (id: string, item: Partial<QuickInvoiceItem>) => Promise<void>;
  deleteQuickInvoiceItem: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
  rooms: Room[];
  insurances: Insurance[];
  patientInsurances: PatientInsurance[];
  vitalSigns: VitalSigns[];
  carePlans: CarePlan[];
  setCarePlans: React.Dispatch<React.SetStateAction<CarePlan[]>>;
  addCarePlan: (plan: Partial<CarePlan>) => Promise<void>;
  updateCarePlan: (id: string, updates: Partial<CarePlan>) => Promise<void>;
  vitalsList: any[];
  setVitalsList: React.Dispatch<React.SetStateAction<any[]>>;
  addVitalRecord: (record: any) => Promise<void>;
  nursingNotes: any[];
  setNursingNotes: React.Dispatch<React.SetStateAction<any[]>>;
  addNursingNote: (note: any) => Promise<void>;
  genomicProfiles: GenomicProfile[];
  setGenomicProfiles: (profiles: GenomicProfile[]) => void;
  addGenomicProfile: (profile: Partial<GenomicProfile>) => Promise<void>;
  updateGenomicProfile: (id: string, profile: Partial<GenomicProfile>) => Promise<void>;
  pgxInteractions: PGxDrugInteraction[];
  bioSamples: BioSample[];
  setBioSamples: (samples: BioSample[]) => void;
  addBioSample: (sample: Partial<BioSample>) => Promise<void>;
  updateBioSample: (id: string, sample: Partial<BioSample>) => Promise<void>;
  biobankFreezers: BiobankFreezer[];
  setBiobankFreezers: (freezers: BiobankFreezer[]) => void;
  clinicalTrials: ClinicalTrial[];
  setClinicalTrials: (trials: ClinicalTrial[]) => void;
  addClinicalTrial: (trial: Partial<ClinicalTrial>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

const genId = () => Date.now().toString() + Math.random().toString(36).substring(2, 8);

const defaultOrgSettings: OrganizationSettings = {
  id: '1',
  name: 'Mon Établissement de Santé',
  type: 'hospital',
  address: '123 Avenue de la Santé',
  city: 'Paris',
  country: 'France',
  phone: '+33 1 23 45 67 89',
  email: 'contact@etablissement.fr',
  website: 'www.etablissement.fr',
  taxId: 'FR12345678901',
  registrationNumber: 'HOSP-2024-001',
  bankName: 'Banque Nationale',
  bankAccount: '12345678901',
  bankIban: 'FR76 1234 5678 9012 3456 7890 123',
  headerColor: '#0e7490',
  primaryColor: '#0891b2',
  updatedAt: new Date().toISOString(),
  currency: 'EUR',
  currencySymbol: '€',
  taxRate: 20,
  taxName: 'TVA',
  defaultDiscount: 0,
  invoicePrefix: 'FAC',
  receiptPrefix: 'REC',
  quickInvoiceItems: [
    { id: '1', category: 'consultation', label: 'Consultation générale', price: 50, active: true, order: 1 },
    { id: '2', category: 'consultation', label: 'Consultation spécialiste', price: 80, active: true, order: 2 },
    { id: '3', category: 'procedure', label: 'ECG', price: 35, active: true, order: 3 },
    { id: '4', category: 'procedure', label: 'Radiographie', price: 45, active: true, order: 4 },
    { id: '5', category: 'lab', label: 'NFS', price: 15, active: true, order: 5 },
    { id: '6', category: 'room', label: 'Chambre individuelle 1 jour', price: 150, active: true, order: 6 },
    { id: '7', category: 'room', label: 'Soins intensifs 1 jour', price: 500, active: true, order: 7 },
  ]
};

const defaultDropdownOptions: DropdownOption[] = [
  { id: '1', category: 'appointment_type', value: 'consultation', label: 'Consultation', order: 1, active: true, createdAt: new Date().toISOString() },
  { id: '2', category: 'appointment_type', value: 'follow-up', label: 'Suivi', order: 2, active: true, createdAt: new Date().toISOString() },
  { id: '3', category: 'appointment_type', value: 'emergency', label: 'Urgence', order: 3, active: true, createdAt: new Date().toISOString() },
  { id: '4', category: 'appointment_type', value: 'surgery', label: 'Chirurgie', order: 4, active: true, createdAt: new Date().toISOString() },
  { id: '5', category: 'appointment_type', value: 'checkup', label: 'Bilan', order: 5, active: true, createdAt: new Date().toISOString() },
  { id: '6', category: 'payment_method', value: 'cash', label: 'Espèces', order: 1, active: true, createdAt: new Date().toISOString() },
  { id: '7', category: 'payment_method', value: 'card', label: 'Carte bancaire', order: 2, active: true, createdAt: new Date().toISOString() },
  { id: '8', category: 'payment_method', value: 'transfer', label: 'Virement', order: 3, active: true, createdAt: new Date().toISOString() },
  { id: '9', category: 'payment_method', value: 'check', label: 'Chèque', order: 4, active: true, createdAt: new Date().toISOString() },
  { id: '10', category: 'payment_method', value: 'insurance', label: 'Assurance / Tiers Payant', order: 5, active: true, createdAt: new Date().toISOString() },
  { id: '11', category: 'user_role', value: 'admin', label: 'Administrateur', order: 1, active: true, createdAt: new Date().toISOString() },
  { id: '12', category: 'user_role', value: 'doctor', label: 'Médecin', order: 2, active: true, createdAt: new Date().toISOString() },
  { id: '13', category: 'user_role', value: 'nurse', label: 'Infirmier(e)', order: 3, active: true, createdAt: new Date().toISOString() },
  { id: '14', category: 'user_role', value: 'pharmacist', label: 'Pharmacien', order: 4, active: true, createdAt: new Date().toISOString() },
  { id: '15', category: 'user_role', value: 'receptionist', label: "Agent d'accueil", order: 5, active: true, createdAt: new Date().toISOString() },
  { id: '16', category: 'user_role', value: 'lab_tech', label: 'Technicien labo', order: 6, active: true, createdAt: new Date().toISOString() },
  { id: '17', category: 'user_role', value: 'surgeon', label: 'Chirurgien', order: 7, active: true, createdAt: new Date().toISOString() },
  // Cities
  { id: '18', category: 'city', value: 'Paris', label: 'Paris', order: 1, active: true, createdAt: new Date().toISOString() },
  { id: '19', category: 'city', value: 'Lyon', label: 'Lyon', order: 2, active: true, createdAt: new Date().toISOString() },
  { id: '20', category: 'city', value: 'Marseille', label: 'Marseille', order: 3, active: true, createdAt: new Date().toISOString() },
  { id: '21', category: 'city', value: 'Bordeaux', label: 'Bordeaux', order: 4, active: true, createdAt: new Date().toISOString() },
  { id: '22', category: 'city', value: 'Toulouse', label: 'Toulouse', order: 5, active: true, createdAt: new Date().toISOString() },
  { id: '23', category: 'city', value: 'Lille', label: 'Lille', order: 6, active: true, createdAt: new Date().toISOString() },
  { id: '24', category: 'city', value: 'Nantes', label: 'Nantes', order: 7, active: true, createdAt: new Date().toISOString() },
  { id: '25', category: 'city', value: 'Strasbourg', label: 'Strasbourg', order: 8, active: true, createdAt: new Date().toISOString() },
  // Relationships
  { id: '26', category: 'relationship', value: 'Conjoint(e)', label: 'Conjoint(e) / Époux(se)', order: 1, active: true, createdAt: new Date().toISOString() },
  { id: '27', category: 'relationship', value: 'Parent', label: 'Père / Mère', order: 2, active: true, createdAt: new Date().toISOString() },
  { id: '28', category: 'relationship', value: 'Enfant', label: 'Fils / Fille', order: 3, active: true, createdAt: new Date().toISOString() },
  { id: '29', category: 'relationship', value: 'Frère / Sœur', label: 'Frère / Sœur', order: 4, active: true, createdAt: new Date().toISOString() },
  { id: '30', category: 'relationship', value: 'Ami(e)', label: 'Ami(e) / Proche', order: 5, active: true, createdAt: new Date().toISOString() },
  { id: '31', category: 'relationship', value: 'Tuteur légal', label: 'Tuteur / Mandataire légal', order: 6, active: true, createdAt: new Date().toISOString() },
  // Insurances
  { id: '32', category: 'insurance_provider', value: 'CPAM / Sécurité Sociale', label: 'CPAM / Sécurité Sociale (Régime Général)', order: 1, active: true, createdAt: new Date().toISOString() },
  { id: '33', category: 'insurance_provider', value: 'MGEN', label: 'MGEN (Mutuelle Générale)', order: 2, active: true, createdAt: new Date().toISOString() },
  { id: '34', category: 'insurance_provider', value: 'Harmonie Mutuelle', label: 'Harmonie Mutuelle', order: 3, active: true, createdAt: new Date().toISOString() },
  { id: '35', category: 'insurance_provider', value: 'Alan Santé', label: 'Alan Santé Pro', order: 4, active: true, createdAt: new Date().toISOString() },
  { id: '36', category: 'insurance_provider', value: 'AXA Santé & Prévoyance', label: 'AXA Santé & Prévoyance', order: 5, active: true, createdAt: new Date().toISOString() },
  { id: '37', category: 'insurance_provider', value: 'Malakoff Humanis', label: 'Malakoff Humanis', order: 6, active: true, createdAt: new Date().toISOString() },
  { id: '38', category: 'insurance_provider', value: 'SwissLife Santé', label: 'SwissLife Santé', order: 7, active: true, createdAt: new Date().toISOString() },
  { id: '39', category: 'insurance_provider', value: 'Sans Mutuelle / Aide Médicale État (AME)', label: 'Sans Mutuelle / Aide Médicale État (AME)', order: 8, active: true, createdAt: new Date().toISOString() },
  // Nursing Care Types
  { id: '40', category: 'nursing_care_type', value: 'Pansement & Soins de plaie', label: 'Pansement & Soins de plaie', order: 1, active: true, createdAt: new Date().toISOString() },
  { id: '41', category: 'nursing_care_type', value: 'Perfusion & Voie veineuse', label: 'Perfusion & Voie veineuse', order: 2, active: true, createdAt: new Date().toISOString() },
  { id: '42', category: 'nursing_care_type', value: 'Injection IM / SC', label: 'Injection IM / SC', order: 3, active: true, createdAt: new Date().toISOString() },
  { id: '43', category: 'nursing_care_type', value: 'Prise de sang & Bilan', label: 'Prise de sang & Bilan biologique', order: 4, active: true, createdAt: new Date().toISOString() },
  { id: '44', category: 'nursing_care_type', value: 'Sondage urinaire', label: 'Sondage urinaire & Surveillance diurèse', order: 5, active: true, createdAt: new Date().toISOString() },
  { id: '45', category: 'nursing_care_type', value: 'Administration PO', label: 'Administration médicamenteuse PO', order: 6, active: true, createdAt: new Date().toISOString() },
  { id: '46', category: 'nursing_care_type', value: 'Surveillance post-op', label: 'Surveillance post-opératoire rapprochée', order: 7, active: true, createdAt: new Date().toISOString() },
  { id: '47', category: 'nursing_care_type', value: 'Soins d\'hygiène / Nursing', label: 'Soins d\'hygiène / Nursing', order: 8, active: true, createdAt: new Date().toISOString() },
  // Nursing Frequencies
  { id: '48', category: 'nursing_frequency', value: 'Toutes les 2 heures', label: 'Toutes les 2 heures', order: 1, active: true, createdAt: new Date().toISOString() },
  { id: '49', category: 'nursing_frequency', value: 'Toutes les 4 heures', label: 'Toutes les 4 heures', order: 2, active: true, createdAt: new Date().toISOString() },
  { id: '50', category: 'nursing_frequency', value: 'Toutes les 6 heures', label: 'Toutes les 6 heures', order: 3, active: true, createdAt: new Date().toISOString() },
  { id: '51', category: 'nursing_frequency', value: '3 fois par jour (8h-14h-20h)', label: '3 fois par jour (8h-14h-20h)', order: 4, active: true, createdAt: new Date().toISOString() },
  { id: '52', category: 'nursing_frequency', value: '2 fois par jour (Matin / Soir)', label: '2 fois par jour (Matin / Soir)', order: 5, active: true, createdAt: new Date().toISOString() },
  { id: '53', category: 'nursing_frequency', value: '1 fois par jour (Matin)', label: '1 fois par jour (Matin)', order: 6, active: true, createdAt: new Date().toISOString() },
  { id: '54', category: 'nursing_frequency', value: 'Au besoin / Si douleur', label: 'Au besoin / Si douleur (Si besoin)', order: 7, active: true, createdAt: new Date().toISOString() },
  { id: '55', category: 'nursing_frequency', value: 'En continu', label: 'En continu', order: 8, active: true, createdAt: new Date().toISOString() },
  // Bed types
  { id: '56', category: 'bed_type', value: 'standard', label: 'Standard / Médecine Générale', order: 1, active: true, createdAt: new Date().toISOString() },
  { id: '57', category: 'bed_type', value: 'icu', label: 'Soins Intensifs / Réanimation (ICU)', order: 2, active: true, createdAt: new Date().toISOString() },
  { id: '58', category: 'bed_type', value: 'pediatric', label: 'Pédiatrie', order: 3, active: true, createdAt: new Date().toISOString() },
  { id: '59', category: 'bed_type', value: 'maternity', label: 'Maternité / Obstétrique', order: 4, active: true, createdAt: new Date().toISOString() },
  { id: '60', category: 'bed_type', value: 'emergency', label: 'Urgences / Déchoquage / UHCD', order: 5, active: true, createdAt: new Date().toISOString() },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { success, error: showError } = useToast();

  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [patients, setPatientsState] = useState<Patient[]>(() => {
    try {
      const saved = localStorage.getItem('softcare_patients');
      if (saved) return JSON.parse(saved);
    } catch {}
    return mockPatients;
  });

  const setPatients = (val: Patient[] | ((prev: Patient[]) => Patient[])) => {
    setPatientsState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      try {
        localStorage.setItem('softcare_patients', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [medicationMovements, setMedicationMovements] = useState<MedicationMovement[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [users, setUsersState] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('softcare_users');
      if (saved) return JSON.parse(saved);
    } catch {}
    return mockUsers;
  });

  const setUsers = (val: User[] | ((prev: User[]) => User[])) => {
    setUsersState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      try {
        localStorage.setItem('softcare_users', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const [departments, setDepartments] = useState<Department[]>([]);

  const [invoices, setInvoicesState] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem('softcare_invoices');
      if (saved) return JSON.parse(saved);
    } catch {}
    return mockInvoices;
  });

  const setInvoices = (val: Invoice[] | ((prev: Invoice[]) => Invoice[])) => {
    setInvoicesState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      try {
        localStorage.setItem('softcare_invoices', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const [quickInvoiceItems, setQuickInvoiceItems] = useState<QuickInvoiceItem[]>([]);

  const [beds, setBedsState] = useState<Bed[]>(() => {
    try {
      const saved = localStorage.getItem('softcare_beds');
      if (saved) return JSON.parse(saved);
    } catch {}
    return mockBeds;
  });

  const setBeds = (val: Bed[] | ((prev: Bed[]) => Bed[])) => {
    setBedsState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      try {
        localStorage.setItem('softcare_beds', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const [admissions, setAdmissionsState] = useState<Admission[]>(() => {
    try {
      const saved = localStorage.getItem('softcare_admissions');
      if (saved) return JSON.parse(saved);
    } catch {}
    return mockAdmissions;
  });

  const setAdmissions = (val: Admission[] | ((prev: Admission[]) => Admission[])) => {
    setAdmissionsState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      try {
        localStorage.setItem('softcare_admissions', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const [labOrders, setLabOrders] = useState<LabOrder[]>([]);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [emergencyVisits, setEmergencyVisits] = useState<EmergencyVisit[]>([]);
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);
  const [operatingRooms, setOperatingRooms] = useState<OperatingRoom[]>([]);
  const [workSchedules, setWorkSchedules] = useState<any[]>([]);

  const [notifications, setNotificationsState] = useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem('softcare_notifications');
      if (saved) return JSON.parse(saved);
    } catch {}
    return mockNotifications;
  });

  const setNotifications = (val: Notification[] | ((prev: Notification[]) => Notification[])) => {
    setNotificationsState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      try {
        localStorage.setItem('softcare_notifications', JSON.stringify(next));
      } catch {}
      return next;
    });
  };
  const [organizationSettings, setOrganizationSettingsState] = useState<OrganizationSettings>(() => {
    try {
      const saved = localStorage.getItem('softcare_org_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultOrgSettings;
  });

  const setOrganizationSettings = (settings: OrganizationSettings | ((prev: OrganizationSettings) => OrganizationSettings)) => {
    setOrganizationSettingsState(prev => {
      const next = typeof settings === 'function' ? settings(prev) : settings;
      try {
        localStorage.setItem('softcare_org_settings', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const [dropdownOptions, setDropdownOptionsState] = useState<DropdownOption[]>(() => {
    try {
      const saved = localStorage.getItem('softcare_dropdown_options');
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultDropdownOptions;
  });

  const setDropdownOptions = (opts: DropdownOption[] | ((prev: DropdownOption[]) => DropdownOption[])) => {
    setDropdownOptionsState(prev => {
      const next = typeof opts === 'function' ? opts(prev) : opts;
      try {
        localStorage.setItem('softcare_dropdown_options', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const [pharmacySales, setPharmacySalesState] = useState<PharmacySale[]>(() => {
    try {
      const saved = localStorage.getItem('softcare_pharmacy_sales');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const setPharmacySales = (val: PharmacySale[] | ((prev: PharmacySale[]) => PharmacySale[])) => {
    setPharmacySalesState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      try {
        localStorage.setItem('softcare_pharmacy_sales', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const addPharmacySale = async (sale: PharmacySale) => {
    try {
      const createdSale = await apiService.pharmacySales.create(sale);
      setPharmacySales(prev => [createdSale, ...prev]);
    } catch (err) {
      console.error('Failed to create pharmacy sale API call', err);
      // Fallback for UI if API fails? Better to throw so UI can show error.
      throw err;
    }
  };

  const [rooms] = useState<Room[]>(mockRooms);
  const [insurances] = useState<Insurance[]>(mockInsurances);
  const [patientInsurances] = useState<PatientInsurance[]>(mockPatientInsurances);
  const [vitalSigns] = useState<VitalSigns[]>(mockVitalSigns);

  const [carePlans, setCarePlansState] = useState<CarePlan[]>(() => {
    try {
      const saved = localStorage.getItem('softcare_care_plans');
      if (saved) return JSON.parse(saved);
    } catch {}
    return mockCarePlans;
  });

  const setCarePlans = (val: CarePlan[] | ((prev: CarePlan[]) => CarePlan[])) => {
    setCarePlansState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      try {
        localStorage.setItem('softcare_care_plans', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const [vitalsList, setVitalsListState] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('softcare_nursing_vitals');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'VIT-001',
        patientId: '1',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        nurseName: 'Inf. Sophie Martin',
        bloodPressureSys: 125,
        bloodPressureDia: 80,
        heartRate: 74,
        temperature: 36.8,
        spO2: 98,
        respiratoryRate: 16,
        painScale: 1,
        bloodGlucose: 105,
        notes: 'Patient calme, constantes stables post-opératoire.'
      }
    ];
  });

  const setVitalsList = (val: any[] | ((prev: any[]) => any[])) => {
    setVitalsListState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      try {
        localStorage.setItem('softcare_nursing_vitals', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const [nursingNotes, setNursingNotesState] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('softcare_nursing_notes');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'NOTE-001',
        patientId: '1',
        nurseName: 'Inf. Sophie Martin',
        timestamp: new Date().toISOString(),
        category: 'transmission',
        content: 'DAR - Données : Légère céphalée signalée. Actions : Administration Paracétamol 1g sur PM. Résultats : Soulagement rapporté à H+1.'
      }
    ];
  });

  const setNursingNotes = (val: any[] | ((prev: any[]) => any[])) => {
    setNursingNotesState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      try {
        localStorage.setItem('softcare_nursing_notes', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const [genomicProfiles, setGenomicProfiles] = useState<GenomicProfile[]>([]);
  const [pgxInteractions, setPgxInteractions] = useState<PGxDrugInteraction[]>([]);
  const [bioSamples, setBioSamples] = useState<BioSample[]>([]);
  const [biobankFreezers, setBiobankFreezers] = useState<BiobankFreezer[]>([]);
  const [clinicalTrials, setClinicalTrials] = useState<ClinicalTrial[]>([]);

  const refreshData = async () => {
    setDataLoading(true);
    setDataError(null);
    try {
      try {
        const apiPatients = await apiService.patients.getAll();
        setPatientsState(apiPatients);
      } catch {
        const savedPatients = localStorage.getItem('softcare_patients');
        if (savedPatients) setPatientsState(JSON.parse(savedPatients));
        else setPatientsState([...mockPatients]);
      }

      try {
        const apiUsers = await apiService.auth.getUsers();
        setUsersState(apiUsers);
      } catch {
        const savedUsers = localStorage.getItem('softcare_users');
        if (savedUsers) setUsersState(JSON.parse(savedUsers));
        else setUsersState([...mockUsers]);
      }

      try {
        const apiBeds = await apiService.beds.getAll();
        setBedsState(apiBeds);
      } catch {
        const savedBeds = localStorage.getItem('softcare_beds');
        if (savedBeds) setBedsState(JSON.parse(savedBeds));
        else setBedsState([...mockBeds]);
      }

      try {
        const apiInvoices = await apiService.invoices.getAll();
        setInvoicesState(apiInvoices);
      } catch {
        const savedInvoices = localStorage.getItem('softcare_invoices');
        if (savedInvoices) setInvoicesState(JSON.parse(savedInvoices));
        else setInvoicesState([...mockInvoices]);
      }

      try {
        const apiMeds = await apiService.medications.getAll();
        setMedications(apiMeds);
      } catch {
        setMedications([...mockMedications]);
      }

      try {
        const apiMovements = await apiService.medications.getMovements();
        setMedicationMovements(apiMovements);
      } catch {
        setMedicationMovements([...mockMedicationMovements]);
      }

      try {
        const apiSales = await apiService.pharmacySales.getAll();
        setPharmacySalesState(apiSales);
      } catch {
        const savedSales = localStorage.getItem('softcare_pharmacy_sales');
        if (savedSales) setPharmacySalesState(JSON.parse(savedSales));
      }

      setDepartments([...mockDepartments]);
      setAppointments([...mockAppointments]);
      setMedicalRecords([...mockMedicalRecords]);
      setAdmissions([...mockAdmissions]);
      setLabOrders([...mockLabOrders]);
      setLabTests([...mockLabTests]);
      setEmergencyVisits([...mockEmergencyVisits]);
      const savedNotifications = localStorage.getItem('softcare_notifications');
      if (savedNotifications) {
        setNotificationsState(JSON.parse(savedNotifications));
      } else {
        setNotificationsState([...mockNotifications]);
      }
      setGenomicProfiles([...mockGenomicProfiles]);
      setPgxInteractions([...mockPGxInteractions]);
      setBioSamples([...mockBioSamples]);
      setBiobankFreezers([...mockBiobankFreezers]);
      setClinicalTrials([...mockClinicalTrials]);
      setQuickInvoiceItems([...defaultOrgSettings.quickInvoiceItems]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de chargement';
      setDataError(message);
      showError('Erreur de chargement', message);
    } finally {
      setDataLoading(false);
    }
  };

  // Restore session from sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('softcare_current_user');
      if (saved) {
        const user = JSON.parse(saved) as User;
        setCurrentUser(user);
      }
    } catch {
      // ignore
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    refreshData();
  }, []);

  // Inactivity timeout (30 min auto-logout for medical session security)
  useEffect(() => {
    if (!currentUser) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    const INACTIVITY_LIMIT_MS = 30 * 60 * 1000; // 30 minutes

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        signOut();
        showError('Session expirée', 'Vous avez été déconnecté suite à 30 minutes d\'inactivité.');
      }, INACTIVITY_LIMIT_MS);
    };

    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach(evt => window.addEventListener(evt, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      activityEvents.forEach(evt => window.removeEventListener(evt, resetTimer));
    };
  }, [currentUser]);

  // Secure sign in with API
  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const response = await apiService.auth.login(email, password);
      
      const user = response.user;
      if (!user) return { error: 'Utilisateur introuvable.' };
      
      if (user.status === 'inactive' || user.active === false) {
        return { error: 'Ce compte utilisateur a été désactivé. Contactez votre administrateur.' };
      }

      // herozion-ignore
      sessionStorage.setItem('softcare_token', response.token);
      setCurrentUser(user);
      // herozion-ignore
      sessionStorage.setItem('softcare_current_user', JSON.stringify(user));
      return { error: null };
    } catch (err: any) {
      console.error('Login error:', err);
      return { error: 'Identifiant ou mot de passe incorrect.' };
    }
  };

  const signOut = async () => {
    setCurrentUser(null);
    sessionStorage.removeItem('softcare_current_user');
    sessionStorage.removeItem('softcare_token');
  };

  // === PATIENTS ===
  const addPatient = async (patient: Partial<Patient>) => {
    try {
      const newPatient = await apiService.patients.create(patient);
      setPatients(prev => [newPatient, ...prev]);
      success('Patient créé via API', 'Le dossier patient a été enregistré');
    } catch (err: any) {
      showError('Erreur', err.message || 'Impossible de créer le patient');
      // Fallback local
      const fallbackPatient: Patient = {
        id: genId(),
        firstName: patient.firstName || '',
        lastName: patient.lastName || '',
        dateOfBirth: patient.dateOfBirth || '',
        gender: patient.gender || 'male',
        phone: patient.phone || '',
        email: patient.email || '',
        address: patient.address || '',
        city: patient.city || '',
        bloodType: patient.bloodType || '',
        allergies: patient.allergies || [],
        insuranceId: patient.insuranceId || '',
        insuranceName: patient.insuranceName || '',
        emergencyContact: patient.emergencyContact,
        emergencyContactName: patient.emergencyContactName,
        emergencyContactPhone: patient.emergencyContactPhone,
        socialSecurityNumber: patient.socialSecurityNumber,
        maritalStatus: patient.maritalStatus,
        occupation: patient.occupation,
        primaryDoctorId: patient.primaryDoctorId,
        status: patient.status || 'active',
        active: true,
        createdAt: new Date().toISOString(),
      };
      setPatients(prev => [fallbackPatient, ...prev]);
      success('Patient créé (Mode Local)', 'Le dossier patient a été enregistré localement');
    }
  };

  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    try {
      const updatedPatient = await apiService.patients.update(id, updates);
      setPatients(prev => prev.map(p => p.id === id ? updatedPatient : p));
      success('Patient mis à jour via API');
    } catch (err: any) {
      showError('Erreur', err.message || 'Impossible de mettre à jour le patient');
      setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      success('Patient mis à jour (Mode Local)');
    }
  };

  const deletePatient = async (id: string) => {
    try {
      await apiService.patients.delete(id);
      setPatients(prev => prev.filter(p => p.id !== id));
      success('Patient supprimé via API');
    } catch (err: any) {
      showError('Erreur', err.message || 'Impossible de supprimer le patient');
      setPatients(prev => prev.filter(p => p.id !== id));
      success('Patient supprimé (Mode Local)');
    }
  };

  // === USERS ===
  const addUser = async (user: Partial<User>) => {
    try {
      const newUser = await apiService.auth.register(user);
      setUsers(prev => [...prev, newUser]);
      success('Utilisateur créé via API');
    } catch (err: any) {
      showError('Erreur', err.message || 'Impossible de créer l\'utilisateur');
      // Fallback local pour la démo si l'API échoue
      const fallbackUser: User = {
        id: genId(),
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'doctor',
        department: user.department || '',
        phone: user.phone || '',
        specialization: user.specialization,
        licenseNumber: user.licenseNumber,
        status: user.status || 'active',
        active: true,
        passwordHash: user.passwordHash || 'demo123',
        permissions: user.permissions || [],
        createdAt: new Date().toISOString(),
      };
      setUsers(prev => [...prev, fallbackUser]);
      success('Utilisateur créé (Mode Local)');
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    success('Utilisateur mis à jour');
  };

  const deleteUser = async (id: string) => {
    if (id === '1' || id === 'admin-1' || id === 'USR-001') {
      showError('Action interdite', 'Le compte Super-Administrateur système ne peut pas être supprimé.');
      return;
    }
    setUsers(prev => prev.filter(u => u.id !== id));
    success('Utilisateur supprimé');
  };

  // === APPOINTMENTS ===
  const addAppointment = async (appointment: Partial<Appointment>) => {
    const newAppt: Appointment = {
      id: genId(),
      patientId: appointment.patientId || '',
      doctorId: appointment.doctorId || appointment.doctor || '',
      doctor: appointment.doctor || appointment.doctorId || '',
      date: appointment.date || new Date().toISOString().split('T')[0],
      time: appointment.time || '',
      duration: appointment.duration || 30,
      type: appointment.type || 'consultation',
      status: appointment.status || 'scheduled',
      notes: appointment.notes || '',
      reason: appointment.reason || '',
      createdAt: new Date().toISOString(),
    };
    setAppointments(prev => [newAppt, ...prev]);
    success('Rendez-vous créé');
  };

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    success('Rendez-vous mis à jour');
  };

  const deleteAppointment = async (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    success('Rendez-vous supprimé');
  };

  // === MEDICATIONS ===
  const addMedication = async (medication: Partial<Medication>) => {
    try {
      const newMed = await apiService.medications.create(medication);
      setMedications(prev => [...prev, newMed]);
      success('Médicament ajouté via API');
    } catch (err: any) {
      showError('Erreur', err.message || 'Impossible d\'ajouter le médicament');
      const fallbackMed: Medication = {
        id: genId(),
        name: medication.name || '',
        genericName: medication.genericName || '',
        category: medication.category || '',
        manufacturer: medication.manufacturer || '',
        stock: medication.stock || 0,
        minStock: medication.minStock || 10,
        maxStock: medication.maxStock || 100,
        price: medication.price || medication.unitPrice || 0,
        unitPrice: medication.unitPrice || medication.price || 0,
        expiryDate: medication.expiryDate || '',
        batchNumber: medication.batchNumber || '',
        barcode: medication.barcode || '',
        description: medication.description || '',
        dosageForm: medication.dosageForm || 'tablet',
        requiresPrescription: medication.requiresPrescription || false,
        location: medication.location || '',
        supplier: medication.supplier || '',
        status: medication.status || 'active',
        createdAt: new Date().toISOString(),
      };
      setMedications(prev => [...prev, fallbackMed]);
      success('Médicament ajouté (Mode Local)');
    }
  };

  const updateMedication = async (id: string, updates: Partial<Medication>) => {
    try {
      const updatedMed = await apiService.medications.update(id, updates);
      setMedications(prev => prev.map(m => m.id === id ? updatedMed : m));
      success('Médicament mis à jour via API');
    } catch (err: any) {
      showError('Erreur', err.message || 'Impossible de mettre à jour le médicament');
      setMedications(prev => prev.map(m => m.id === id ? { ...m, ...updates, unitPrice: updates.unitPrice || updates.price || m.unitPrice, price: updates.price || updates.unitPrice || m.price } : m));
      success('Médicament mis à jour (Mode Local)');
    }
  };

  const deleteMedication = async (id: string) => {
    try {
      await apiService.medications.delete(id);
      setMedications(prev => prev.filter(m => m.id !== id));
      success('Médicament supprimé via API');
    } catch (err: any) {
      showError('Erreur', err.message || 'Impossible de supprimer le médicament');
      setMedications(prev => prev.filter(m => m.id !== id));
      success('Médicament supprimé (Mode Local)');
    }
  };

  // === LAB ORDERS ===
  const addLabOrder = async (order: Partial<LabOrder>) => {
    const newOrder: LabOrder = {
      id: genId(),
      patientId: order.patientId || '',
      doctorId: order.doctorId || '',
      testName: order.testName || '',
      testType: order.testType || '',
      tests: order.tests || [],
      priority: order.priority || 'normal',
      status: order.status || 'pending',
      notes: order.notes || '',
      createdAt: new Date().toISOString(),
    };
    setLabOrders(prev => [newOrder, ...prev]);
    success('Analyse demandée');
  };

  const updateLabOrder = async (id: string, updates: Partial<LabOrder>) => {
    setLabOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
    success('Analyse mise à jour');
  };

  const deleteLabOrder = async (id: string) => {
    setLabOrders(prev => prev.filter(o => o.id !== id));
    success('Analyse supprimée');
  };

  // === ADMISSIONS ===
  const addAdmission = async (admission: Partial<Admission>) => {
    const newAdmission: Admission = {
      id: genId(),
      patientId: admission.patientId || '',
      patientName: admission.patientName || '',
      departmentId: admission.departmentId || '1',
      departmentName: admission.departmentName || 'Médecine',
      roomId: admission.roomId,
      roomNumber: admission.roomNumber,
      bedId: admission.bedId,
      bedNumber: admission.bedNumber,
      admissionDate: admission.admissionDate || new Date().toISOString(),
      dischargeDate: admission.dischargeDate,
      reason: admission.reason || '',
      diagnosis: admission.diagnosis,
      attendingDoctorId: admission.attendingDoctorId || '1',
      attendingDoctorName: admission.attendingDoctorName || 'Dr. Marie Dubois',
      status: admission.status || 'admitted',
      insuranceProvider: admission.insuranceProvider,
      insurancePolicyNumber: admission.insurancePolicyNumber,
      dailyRate: admission.dailyRate || 150,
      totalAmount: admission.totalAmount || 0,
      notes: admission.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setAdmissions(prev => [newAdmission, ...prev]);
    if (admission.bedId) {
      await updateBed(admission.bedId, {
        status: 'occupied',
        patientId: admission.patientId,
        currentPatientId: admission.patientId,
        currentAdmissionId: newAdmission.id,
        admissionDate: newAdmission.admissionDate
      });
    }
    success('Admission enregistrée', `Patient admis avec succès`);
  };

  const updateAdmission = async (id: string, updates: Partial<Admission>) => {
    setAdmissions(prev => prev.map(a => a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a));
    success('Admission mise à jour');
  };

  // === INVOICES ===
  const addInvoice = async (invoice: Partial<Invoice>, items: Partial<Invoice['items']>[number][]) => {
    const invoiceNumber = `${organizationSettings.invoicePrefix}-${Date.now()}`;
    const newInvoice: Invoice = {
      id: genId(),
      invoiceNumber,
      patientId: invoice.patientId || '',
      date: invoice.date || new Date().toISOString().split('T')[0],
      dueDate: invoice.dueDate || '',
      items: items.map((item, idx) => ({
        id: item?.id || (idx + 1).toString(),
        description: item?.description || '',
        type: item?.type || 'other',
        category: item?.category || 'other',
        quantity: item?.quantity || 1,
        unitPrice: item?.unitPrice || 0,
        total: item?.total || 0,
      })),
      subtotal: invoice.subtotal || 0,
      tax: invoice.tax || 0,
      taxAmount: invoice.taxAmount || 0,
      discount: invoice.discount || 0,
      discountAmount: invoice.discountAmount || 0,
      discountPercent: invoice.discountPercent || 0,
      total: invoice.total || 0,
      status: invoice.status || 'draft',
      notes: invoice.notes || '',
      payments: [],
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.id,
    };
    setInvoices(prev => [newInvoice, ...prev]);
    success('Facture créée', invoiceNumber);
    return newInvoice;
  };

  const updateInvoice = async (id: string, updates: Partial<Invoice>) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, ...updates } : inv));
    success('Facture mise à jour');
  };

  const deleteInvoice = async (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
    success('Facture supprimée');
  };

  // === QUICK INVOICE ITEMS ===
  const addQuickInvoiceItem = async (item: Partial<QuickInvoiceItem>) => {
    const newItem: QuickInvoiceItem = {
      id: genId(),
      category: item.category || 'other',
      label: item.label || '',
      price: item.price || 0,
      active: item.active ?? true,
      order: item.order || 0,
    };
    setQuickInvoiceItems(prev => [...prev, newItem]);
    success('Item ajouté');
  };

  const updateQuickInvoiceItem = async (id: string, updates: Partial<QuickInvoiceItem>) => {
    setQuickInvoiceItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
    success('Item mis à jour');
  };

  const deleteQuickInvoiceItem = async (id: string) => {
    setQuickInvoiceItems(prev => prev.filter(i => i.id !== id));
    success('Item supprimé');
  };

  // === BEDS ===
  const addBed = async (bed: Partial<Bed>) => {
    const newBed: Bed = {
      id: genId(),
      roomNumber: bed.roomNumber || '101',
      bedNumber: bed.bedNumber || 'A',
      departmentId: bed.departmentId || '1',
      department: bed.department || 'Médecine',
      type: bed.type || 'standard',
      status: bed.status || 'available',
      features: bed.features || ['TV', 'Salle de bain'],
      dailyRate: bed.dailyRate || 150,
      createdAt: new Date().toISOString()
    };
    setBeds(prev => [newBed, ...prev]);
    success('Lit créé', `Lit ${newBed.roomNumber}-${newBed.bedNumber} ajouté avec succès`);
  };

  const updateBed = async (id: string, updates: Partial<Bed>) => {
    try {
      const updatedBed = await apiService.beds.update(id, updates);
      setBeds(prev => prev.map(b => b.id === id ? updatedBed : b));
      success('Lit mis à jour via API');
    } catch (err: any) {
      showError('Erreur', err.message || 'Impossible de mettre à jour le lit via API');
      setBeds(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
      success('Lit mis à jour (Mode Local)');
    }
  };

  const deleteBed = async (id: string) => {
    setBeds(prev => prev.filter(b => b.id !== id));
    success('Lit supprimé');
  };

  // === NURSING / SOINS ===
  const addVitalRecord = async (record: any) => {
    const newRecord = {
      id: `VIT-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      nurseName: currentUser?.name || 'Infirmier(e)',
      ...record
    };
    setVitalsList(prev => [newRecord, ...prev]);
    success('Constantes enregistrées');
  };

  const addCarePlan = async (plan: any) => {
    const newPlan = {
      id: `PLAN-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      status: 'active',
      ...plan
    };
    setCarePlans(prev => [newPlan, ...prev]);
    success('Plan de soins créé');
  };

  const updateCarePlan = async (id: string, updates: any) => {
    setCarePlans(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    success('Plan de soins mis à jour');
  };

  const addNursingNote = async (note: any) => {
    const newNote = {
      id: `NOTE-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      nurseName: currentUser?.name || 'Infirmier(e)',
      ...note
    };
    setNursingNotes(prev => [newNote, ...prev]);
    success('Transmission enregistrée');
  };

  // === ORGANIZATION SETTINGS ===
  const updateOrganizationSettingsFn = async (updates: Partial<OrganizationSettings>) => {
    setOrganizationSettings(prev => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }));
    success('Paramètres mis à jour');
  };

  // === SURGERIES ===
  const addSurgery = async (surgery: Partial<Surgery>) => {
    const newSurgery: Surgery = {
      id: genId(),
      patientId: surgery.patientId || '',
      admissionId: surgery.admissionId,
      scheduledDate: surgery.scheduledDate || new Date().toISOString().split('T')[0],
      scheduledTime: surgery.scheduledTime || '',
      duration: surgery.duration || 60,
      type: surgery.type || 'elective',
      procedure: surgery.procedure || '',
      procedureCode: surgery.procedureCode,
      surgeonId: surgery.surgeonId || '',
      anesthesiologistId: surgery.anesthesiologistId,
      assistantSurgeonId: surgery.assistantSurgeonId,
      scrubNurseId: surgery.scrubNurseId,
      operatingRoomId: surgery.operatingRoomId || '',
      status: surgery.status || 'scheduled',
      anesthesiaType: surgery.anesthesiaType || 'general',
      preOpDiagnosis: surgery.preOpDiagnosis || '',
      postOpDiagnosis: surgery.postOpDiagnosis,
      complications: surgery.complications,
      notes: surgery.notes,
      startTime: surgery.startTime,
      endTime: surgery.endTime,
    };
    setSurgeries(prev => [newSurgery, ...prev]);
    success('Chirurgie planifiée');
  };

  const updateSurgery = async (id: string, updates: Partial<Surgery>) => {
    setSurgeries(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    success('Chirurgie mise à jour');
  };

  const deleteSurgery = async (id: string) => {
    setSurgeries(prev => prev.filter(s => s.id !== id));
    success('Chirurgie supprimée');
  };

  // === OPERATING ROOMS ===
  const addOperatingRoom = async (room: Partial<OperatingRoom>) => {
    const newRoom: OperatingRoom = {
      id: genId(),
      name: room.name || '',
      number: room.number || '',
      type: room.type || 'general',
      status: room.status || 'available',
      equipment: room.equipment || [],
    };
    setOperatingRooms(prev => [...prev, newRoom]);
    success('Salle ajoutée');
  };

  const updateOperatingRoom = async (id: string, updates: Partial<OperatingRoom>) => {
    setOperatingRooms(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  // === EMERGENCY VISITS ===
  const addEmergencyVisit = async (visit: Partial<EmergencyVisit>) => {
    const newVisit: EmergencyVisit = {
      id: visit.id || genId(),
      patientId: visit.patientId || '',
      arrivalTime: visit.arrivalTime || new Date().toISOString(),
      arrivalMode: visit.arrivalMode || 'walking',
      chiefComplaint: visit.chiefComplaint || '',
      triageLevel: visit.triageLevel || 3,
      triageTime: visit.triageTime || new Date().toISOString(),
      triageBy: visit.triageBy || '',
      status: visit.status || 'waiting',
      assignedDoctorId: visit.assignedDoctorId,
      assignedBedId: visit.assignedBedId,
      notes: visit.notes,
    };
    setEmergencyVisits(prev => [newVisit, ...prev]);
    success('Admission urgences enregistrée');
  };

  const updateEmergencyVisit = async (id: string, updates: Partial<EmergencyVisit>) => {
    setEmergencyVisits(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  // === MEDICAL RECORDS ===
  const addMedicalRecord = async (record: Partial<MedicalRecord>) => {
    const newRecord: MedicalRecord = {
      id: record.id || genId(),
      patientId: record.patientId || '',
      doctorId: record.doctorId || '',
      date: record.date || new Date().toISOString().split('T')[0],
      type: record.type || 'consultation',
      title: record.title || '',
      description: record.description || '',
      symptoms: record.symptoms || [],
      diagnosis: record.diagnosis || '',
      treatment: record.treatment || '',
      prescriptions: record.prescriptions || [],
      attachments: record.attachments || [],
      followUp: record.followUp,
      notes: record.notes,
      status: record.status || 'active',
    };
    setMedicalRecords(prev => [newRecord, ...prev]);
    success('Dossier médical créé');
  };

  // === MEDICATION MOVEMENTS ===
  const addMedicationMovement = async (movement: Partial<MedicationMovement>) => {
    const newMovement: MedicationMovement = {
      id: movement.id || genId(),
      medicationId: movement.medicationId || '',
      type: movement.type || 'out',
      quantity: movement.quantity || 0,
      reason: movement.reason || '',
      performedBy: movement.performedBy || '',
      date: movement.date || new Date().toISOString(),
      referenceId: movement.referenceId,
    };
    setMedicationMovements(prev => [newMovement, ...prev]);
    if (movement.medicationId) {
      const med = medications.find(m => m.id === movement.medicationId);
      if (med) {
        const stockChange = movement.type === 'in' ? movement.quantity : movement.type === 'out' ? -(movement.quantity || 0) : movement.quantity;
        await updateMedication(movement.medicationId, { stock: Math.max(0, med.stock + (stockChange || 0)) });
      }
    }
  };

  // === DROPDOWN OPTIONS ===
  const addDropdownOption = (option: DropdownOption) =>
    setDropdownOptions(prev => [...prev, option]);
  const updateDropdownOption = (id: string, updates: Partial<DropdownOption>) =>
    setDropdownOptions(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  const deleteDropdownOption = (id: string) =>
    setDropdownOptions(prev => prev.filter(o => o.id !== id));

  // === NOTIFICATIONS ===
  const addNotification = (notification: Notification) =>
    setNotifications(prev => [notification, ...prev]);
  const markNotificationRead = (id: string) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    success('Notifications', 'Toutes les notifications ont été marquées comme lues.');
  };

  const getDropdownOptions = (category: string) =>
    dropdownOptions.filter(o => o.category === category && o.active).sort((a, b) => a.order - b.order);

  const unreadCount = notifications.filter(n => !n.read).length;

  // === BIOTECH & PGx ===
  const addGenomicProfile = async (profile: Partial<GenomicProfile>) => {
    const newProfile: GenomicProfile = {
      id: genId(),
      patientId: profile.patientId || '',
      patientName: profile.patientName || '',
      testDate: profile.testDate || new Date().toISOString().split('T')[0],
      panelName: profile.panelName || 'Panel PGx Général',
      genes: profile.genes || [],
      phenotypes: profile.phenotypes || {},
      recommendations: profile.recommendations || [],
      status: profile.status || 'draft',
      notes: profile.notes
    };
    setGenomicProfiles(prev => [newProfile, ...prev]);
    success('Profil génomique enregistré');
  };

  const updateGenomicProfile = async (id: string, profile: Partial<GenomicProfile>) => {
    setGenomicProfiles(prev => prev.map(p => p.id === id ? { ...p, ...profile } : p));
    success('Profil génomique mis à jour');
  };

  const addBioSample = async (sample: Partial<BioSample>) => {
    const newSample: BioSample = {
      id: genId(),
      sampleCode: sample.sampleCode || `BS-${Date.now().toString().slice(-6)}`,
      patientId: sample.patientId || '',
      patientName: sample.patientName || '',
      sampleType: sample.sampleType || 'DNA',
      collectionDate: sample.collectionDate || new Date().toISOString().split('T')[0],
      volumeMl: sample.volumeMl || 1.0,
      concentration: sample.concentration,
      freezerId: sample.freezerId || 'FRZ-80-01',
      freezerName: sample.freezerName,
      rackNumber: sample.rackNumber || 'Rack-01',
      boxNumber: sample.boxNumber || 'Boîte-01',
      wellPosition: sample.wellPosition || 'A01',
      storageTemp: sample.storageTemp || '-80°C',
      consentSigned: sample.consentSigned ?? true,
      consentType: sample.consentType || 'Research & Diagnostics',
      qualityScore: sample.qualityScore || 'A',
      status: sample.status || 'available',
      notes: sample.notes
    };
    setBioSamples(prev => [newSample, ...prev]);
    success('Échantillon biobanque répertorié');
  };

  const updateBioSample = async (id: string, sample: Partial<BioSample>) => {
    setBioSamples(prev => prev.map(s => s.id === id ? { ...s, ...sample } : s));
    success('Échantillon mis à jour');
  };

  const addClinicalTrial = async (trial: Partial<ClinicalTrial>) => {
    const newTrial: ClinicalTrial = {
      id: genId(),
      code: trial.code || `CT-${Date.now().toString().slice(-6)}`,
      title: trial.title || '',
      phase: trial.phase || 'Phase II',
      principalInvestigator: trial.principalInvestigator || '',
      targetEnrollment: trial.targetEnrollment || 50,
      currentEnrollment: trial.currentEnrollment || 0,
      startDate: trial.startDate || new Date().toISOString().split('T')[0],
      endDate: trial.endDate,
      status: trial.status || 'recruiting',
      description: trial.description || '',
      inclusionCriteria: trial.inclusionCriteria || [],
      exclusionCriteria: trial.exclusionCriteria || [],
      participants: trial.participants || []
    };
    setClinicalTrials(prev => [newTrial, ...prev]);
    success('Protocole d\'essai clinique créé');
  };

  const value: AppContextType = {
    dataLoading, dataError,
    currentView, setCurrentView,
    sidebarCollapsed, setSidebarCollapsed,
    currentUser, setCurrentUser, signIn, signOut, authLoading,
    patients, setPatients, addPatient, updatePatient, deletePatient,
    medicalRecords, setMedicalRecords, addMedicalRecord,
    medications, setMedications, addMedication, updateMedication, deleteMedication,
    medicationMovements, setMedicationMovements, addMedicationMovement,
    appointments, setAppointments, addAppointment, updateAppointment, deleteAppointment,
    users, setUsers, addUser, updateUser, deleteUser,
    departments, setDepartments,
    invoices, setInvoices, addInvoice, updateInvoice, deleteInvoice,
    beds, setBeds, addBed, updateBed, deleteBed,
    admissions, setAdmissions, addAdmission, updateAdmission,
    labOrders, setLabOrders, addLabOrder, updateLabOrder, deleteLabOrder,
    labTests, setLabTests,
    emergencyVisits, setEmergencyVisits, addEmergencyVisit, updateEmergencyVisit,
    surgeries, setSurgeries, addSurgery, updateSurgery, deleteSurgery,
    operatingRooms, setOperatingRooms, addOperatingRoom, updateOperatingRoom,
    workSchedules, setWorkSchedules,
    notifications, setNotifications, addNotification, markNotificationRead, markAllNotificationsRead, unreadCount,
    organizationSettings, setOrganizationSettings,
    updateOrganizationSettings: updateOrganizationSettingsFn,
    dropdownOptions, setDropdownOptions, getDropdownOptions,
    addDropdownOption, updateDropdownOption, deleteDropdownOption,
    pharmacySales, addPharmacySale,
    quickInvoiceItems, addQuickInvoiceItem, updateQuickInvoiceItem, deleteQuickInvoiceItem,
    refreshData,
    rooms, insurances, patientInsurances, vitalSigns,
    carePlans, setCarePlans, addCarePlan, updateCarePlan,
    vitalsList, setVitalsList, addVitalRecord,
    nursingNotes, setNursingNotes, addNursingNote,
    genomicProfiles, setGenomicProfiles, addGenomicProfile, updateGenomicProfile,
    pgxInteractions, bioSamples, setBioSamples, addBioSample, updateBioSample,
    biobankFreezers, setBiobankFreezers, clinicalTrials, setClinicalTrials, addClinicalTrial
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
