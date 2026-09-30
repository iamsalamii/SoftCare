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
  updateMedicalRecord: (id: string, updates: Partial<MedicalRecord>) => Promise<void>;
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
  setOperatingRooms: (rooms: OperatingRoom[]) => void;
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

  const [patients, setPatientsState] = useState<Patient[]>([]);

  const setPatients = (val: Patient[] | ((prev: Patient[]) => Patient[])) => {
    setPatientsState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      try {
      } catch {}
      return next;
    });
  };

  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [medicationMovements, setMedicationMovements] = useState<MedicationMovement[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [users, setUsersState] = useState<User[]>([]);

  const setUsers = (val: User[] | ((prev: User[]) => User[])) => {
    setUsersState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      try {
      } catch {}
      return next;
    });
  };

  const [departments, setDepartments] = useState<Department[]>([]);

  const [invoices, setInvoicesState] = useState<Invoice[]>([]);

  const setInvoices = (val: Invoice[] | ((prev: Invoice[]) => Invoice[])) => {
    setInvoicesState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      try {
      } catch {}
      return next;
    });
  };

  const [quickInvoiceItems, setQuickInvoiceItems] = useState<QuickInvoiceItem[]>([]);

  const [beds, setBedsState] = useState<Bed[]>([]);

  const setBeds = (val: Bed[] | ((prev: Bed[]) => Bed[])) => {
    setBedsState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      try {
      } catch {}
      return next;
    });
  };

  const [admissions, setAdmissions] = useState<Admission[]>([]);

  const [labOrders, setLabOrders] = useState<LabOrder[]>([]);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [emergencyVisits, setEmergencyVisits] = useState<EmergencyVisit[]>([]);
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);
  const [workSchedules, setWorkSchedules] = useState<any[]>([]);

  const [notifications, setNotificationsState] = useState<Notification[]>([]);

  const setNotifications = (val: Notification[] | ((prev: Notification[]) => Notification[])) => {
    setNotificationsState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      try {
      } catch {}
      return next;
    });
  };
  const [organizationSettings, setOrganizationSettingsState] = useState<OrganizationSettings>([]);

  const setCarePlans = (val: CarePlan[] | ((prev: CarePlan[]) => CarePlan[])) => {
    setCarePlansState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      try {
      } catch {}
      return next;
    });
  };

  const [vitalsList, setVitalsListState] = useState<any[]>(() => {
    try {
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
      } catch {}
      return next;
    });
  };

  const [nursingNotes, setNursingNotesState] = useState<any[]>(() => {
    try {
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
        setPatientsState([]);
      }

      try {
        const apiUsers = await apiService.users.getAll();
        setUsersState(apiUsers);
      } catch {
        setUsersState([]);
      }

      try {
        const apiDepartments = await apiService.departments.getAll();
        setDepartments(apiDepartments);
      } catch {
        setDepartments([]);
      }

      try {
        const apiBeds = await apiService.beds.getAll();
        setBedsState(apiBeds);
      } catch {
        setBedsState([]);
      }

      try {
        const apiInvoices = await apiService.invoices.getAll();
        setInvoicesState(apiInvoices);
      } catch {
        setInvoicesState([]);
      }

      try {
        const apiMeds = await apiService.medications.getAll();
        setMedications(apiMeds);
      } catch {
        setMedications([]);
      }

      try {
        const apiMovements = await apiService.medications.getMovements();
        setMedicationMovements(apiMovements);
      } catch {
        setMedicationMovements([]);
      }

      try {
        const apiSales = await apiService.pharmacySales.getAll();
        setPharmacySalesState(apiSales);
      } catch {
        setPharmacySalesState([]);
      }

      try {
        const apiAppointments = await apiService.appointments.getAll();
        setAppointments(apiAppointments);
      } catch {
        setAppointments([]);
      }

      try {
        const records = await apiService.medicalRecords.getAll();
        setMedicalRecords(records);
      } catch {
        setMedicalRecords([]);
      }

      try {
        const apiAdmissions = await apiService.admissions.getAll();
        setAdmissions(apiAdmissions);
      } catch {
        setAdmissions([]);
      }

      setLabOrders([]);
      setLabTests([]);
      setEmergencyVisits([]);
      setNotificationsState([]);
      setGenomicProfiles([]);
      setPgxInteractions([]);
      setBioSamples([]);
      setBiobankFreezers([]);
      setClinicalTrials([]);
      setQuickInvoiceItems([]);
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
      success('Patient créé', 'Le dossier patient a été enregistré');
    } catch (err: any) {
      showError('Erreur', err.message || 'Impossible de créer le patient');
      throw err;
    }
  };

  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    try {
      const updatedPatient = await apiService.patients.update(id, updates);
      setPatients(prev => prev.map(p => p.id === id ? updatedPatient : p));
      success('Patient mis à jour');
    } catch (err: any) {
      showError('Erreur', err.message || 'Impossible de mettre à jour le patient');
      throw err;
    }
  };

  const deletePatient = async (id: string) => {
    try {
      await apiService.patients.delete(id);
      setPatients(prev => prev.filter(p => p.id !== id));
      success('Patient supprimé');
    } catch (err: any) {
      showError('Erreur', err.message || 'Impossible de supprimer le patient');
      throw err;
    }
  };

  // === USERS ===
  const addUser = async (user: Partial<User>) => {
    try {
      const newUser = await apiService.users.create(user);
      setUsers(prev => [...prev, newUser]);
      success('Utilisateur créé');
    } catch (err: any) {
      showError('Erreur', err.message || 'Impossible de créer l\'utilisateur');
      throw err;
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    try {
      const updatedUser = await apiService.users.update(id, updates);
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      success('Utilisateur mis à jour');
    } catch (err: any) {
      showError('Erreur', err.message || 'Impossible de mettre à jour l\'utilisateur');
      throw err;
    }
  };

  const deleteUser = async (id: string) => {
    if (id === '1' || id === 'admin-1' || id === 'USR-001') {
      showError('Action interdite', 'Le compte Super-Administrateur système ne peut pas être supprimé.');
      return;
    }
    try {
      await apiService.users.delete(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      success('Utilisateur supprimé');
    } catch (err: any) {
      showError('Erreur', err.message || 'Impossible de supprimer l\'utilisateur');
      throw err;
    }
  };

  // === APPOINTMENTS ===
  const addAppointment = async (appointment: Partial<Appointment>) => {
    try {
      const newAppt = await apiService.appointments.create(appointment);
      setAppointments(prev => [newAppt, ...prev]);
      success('Rendez-vous créé');
    } catch (err: any) {
      showError('Erreur', 'Impossible de créer le rendez-vous');
      throw err;
    }
  };

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    try {
      const updatedAppt = await apiService.appointments.update(id, updates);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...updatedAppt } : a));
      success('Rendez-vous mis à jour');
    } catch (err: any) {
      showError('Erreur', 'Impossible de mettre à jour le rendez-vous');
      throw err;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      await apiService.appointments.delete(id);
      setAppointments(prev => prev.filter(a => a.id !== id));
      success('Rendez-vous supprimé');
    } catch (err: any) {
      error('Erreur', 'Impossible de supprimer le rendez-vous');
      throw err;
    }
  };

  // === MEDICATIONS ===
  const addMedication = async (medication: Partial<Medication>) => {
    try {
      const created = await apiService.medications.create(medication);
      setMedications(prev => [created, ...prev]);
      success('Médicament ajouté');
    } catch (error: any) {
      showError(error);
    }
  };

  // === ADMISSIONS ===
  const addAdmission = async (admission: Partial<Admission>) => {
    try {
      const newAdmission = await apiService.admissions.create(admission);
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
    } catch (err: any) {
      error('Erreur', 'Impossible d\'ajouter l\'admission');
      throw err;
    }
  };

  const updateAdmission = async (id: string, updates: Partial<Admission>) => {
    try {
      const updated = await apiService.admissions.update(id, updates);
      setAdmissions(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
      success('Admission mise à jour');
    } catch (err: any) {
      showError('Erreur', 'Impossible de mettre à jour l\'admission');
      throw err;
    }
  };

  // === INVOICES ===
  const addInvoice = async (invoice: Partial<Invoice>, items: Partial<Invoice['items']>[number][]) => {
    try {
      const created = await apiService.invoices.create({ ...invoice, items: items as any });
      setInvoicesState(prev => [created, ...prev]);
      success('Facture créée');
    } catch (error: any) {
      showError(error);
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      await apiService.invoices.delete(id);
      setInvoicesState(prev => prev.filter(inv => inv.id !== id));
      success('Facture supprimée');
    } catch (err: any) {
      showError(err);
    }
  };

  // === QUICK INVOICE ITEMS ===
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
    try {
      const created = await apiService.beds.create(bed);
      setBedsState(prev => [created, ...prev]);
      success('Lit ajouté');
    } catch (error: any) {
      showError(error);
    }
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
    try {
      await apiService.beds.delete(id);
      setBedsState(prev => prev.filter(b => b.id !== id));
      success('Lit supprimé');
    } catch (err: any) {
      showError(err);
    }
  };

  // === NURSING / SOINS ===
  const addVitalRecord = async (record: any) => {
    try {
      if (!record.nurseName) record.nurseName = currentUser?.name || 'Infirmier(e)';
      const created = await apiService.vitals.create(record);
      setVitalsList(prev => [created, ...prev]);
      success('Constantes enregistrées');
    } catch (error: any) {
      showError(error);
    }
  };

  const addCarePlan = async (plan: any) => {
    try {
      const created = await apiService.carePlans.create(plan);
      setCarePlans(prev => [created, ...prev]);
      success('Plan de soins créé');
    } catch (error: any) {
      showError(error);
    }
  };

  const updateCarePlan = async (id: string, updates: any) => {
    try {
      const updated = await apiService.carePlans.update(id, updates);
      setCarePlans(prev => prev.map(p => p.id === id ? updated : p));
      success('Plan de soins mis à jour');
    } catch (error: any) {
      showError(error);
    }
  };

  const addNursingNote = async (note: any) => {
    try {
      if (!note.nurseName) note.nurseName = currentUser?.name || 'Infirmier(e)';
      const created = await apiService.nursingNotes.create(note);
      setNursingNotes(prev => [created, ...prev]);
      success('Transmission enregistrée');
    } catch (error: any) {
      showError(error);
    }
  };

  // === ORGANIZATION SETTINGS ===
  const updateOrganizationSettingsFn = async (updates: Partial<OrganizationSettings>) => {
    setOrganizationSettings(prev => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }));
    success('Paramètres mis à jour');
  };

  // === SURGERIES ===
  const addSurgery = async (surgery: Partial<Surgery>) => {
    try {
      const created = await apiService.surgery.create(surgery);
      setSurgeriesState(prev => [created, ...prev]);
      success('Intervention programmée');
    } catch (error: any) {
      showError(error);
    }
  };

  const updateSurgery = async (id: string, updates: Partial<Surgery>) => {
    try {
      const updated = await apiService.surgery.update(id, updates);
      setSurgeriesState(prev => prev.map(p => p.id === id ? updated : p));
      success('Statut intervention mis à jour');
    } catch (error: any) {
      showError(error);
    }
  };

  const deleteSurgery = async (id: string) => {
    try {
      await apiService.surgery.delete(id);
      setSurgeriesState(prev => prev.filter(s => s.id !== id));
      success('Chirurgie supprimée');
    } catch (err: any) {
      showError(err);
    }
  };

  // === OPERATING ROOMS ===
  

  

  const addBioSample = async (sample: Partial<BioSample>) => {
    try {
      const created = await apiService.biotech.createBioSample(sample);
      setBioSamples(prev => [created, ...prev]);
      success('Échantillon enregistré');
    } catch (error: any) {
      showError(error);
    }
  };

  const updateBioSample = async (id: string, sample: Partial<BioSample>) => {
    setBioSamples(prev => prev.map(s => s.id === id ? { ...s, ...sample } : s));
    success('Échantillon mis à jour');
  };

  const addClinicalTrial = async (trial: Partial<ClinicalTrial>) => {
    try {
      const created = await apiService.biotech.createTrial(trial);
      setClinicalTrials(prev => [created, ...prev]);
      success('Essai clinique enregistré');
    } catch (error: any) {
      showError(error);
    }
  };

  const value: AppContextType = {
    dataLoading, dataError,
    currentView, setCurrentView,
    sidebarCollapsed, setSidebarCollapsed,
    currentUser, setCurrentUser, signIn, signOut, authLoading,
    patients, setPatients, addPatient, updatePatient, deletePatient,
    medicalRecords, setMedicalRecords, addMedicalRecord, updateMedicalRecord,
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
