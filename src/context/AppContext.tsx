import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from './ToastContext';
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
  mockVitalSigns, mockCarePlans, mockEmergencyVisits, mockOperatingRooms, mockSurgeries,
  mockWorkSchedules, mockNotifications, mockGenomicProfiles, mockPGxInteractions,
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
  addInvoice: (invoice: Partial<Invoice>, items: Partial<Invoice['items']>[number][]) => Promise<void>;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  beds: Bed[];
  setBeds: (beds: Bed[]) => void;
  updateBed: (id: string, bed: Partial<Bed>) => Promise<void>;
  admissions: Admission[];
  setAdmissions: (admissions: Admission[]) => void;
  addAdmission: (admission: Partial<Admission>) => Promise<void>;
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
  addPharmacySale: (sale: PharmacySale) => void;
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
  name: 'SoftCare',
  type: 'hospital',
  address: '123 Avenue de la Santé',
  city: 'Paris',
  country: 'France',
  phone: '+33 1 23 45 67 89',
  email: 'contact@softcare.fr',
  website: 'www.softcare.fr',
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
  { id: '10', category: 'payment_method', value: 'insurance', label: 'Assurance', order: 5, active: true, createdAt: new Date().toISOString() },
  { id: '11', category: 'user_role', value: 'admin', label: 'Administrateur', order: 1, active: true, createdAt: new Date().toISOString() },
  { id: '12', category: 'user_role', value: 'doctor', label: 'Médecin', order: 2, active: true, createdAt: new Date().toISOString() },
  { id: '13', category: 'user_role', value: 'nurse', label: 'Infirmier(e)', order: 3, active: true, createdAt: new Date().toISOString() },
  { id: '14', category: 'user_role', value: 'pharmacist', label: 'Pharmacien', order: 4, active: true, createdAt: new Date().toISOString() },
  { id: '15', category: 'user_role', value: 'receptionist', label: "Agent d'accueil", order: 5, active: true, createdAt: new Date().toISOString() },
  { id: '16', category: 'user_role', value: 'lab_tech', label: 'Technicien labo', order: 6, active: true, createdAt: new Date().toISOString() },
  { id: '17', category: 'user_role', value: 'surgeon', label: 'Chirurgien', order: 7, active: true, createdAt: new Date().toISOString() },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { success, error: showError } = useToast();

  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [medicationMovements, setMedicationMovements] = useState<MedicationMovement[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [quickInvoiceItems, setQuickInvoiceItems] = useState<QuickInvoiceItem[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [labOrders, setLabOrders] = useState<LabOrder[]>([]);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [emergencyVisits, setEmergencyVisits] = useState<EmergencyVisit[]>([]);
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);
  const [operatingRooms, setOperatingRooms] = useState<OperatingRoom[]>([]);
  const [workSchedules, setWorkSchedules] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [organizationSettings, setOrganizationSettings] = useState<OrganizationSettings>(defaultOrgSettings);
  const [dropdownOptions, setDropdownOptions] = useState<DropdownOption[]>(defaultDropdownOptions);
  const [pharmacySales, setPharmacySales] = useState<PharmacySale[]>([]);
  const [rooms] = useState<Room[]>(mockRooms);
  const [insurances] = useState<Insurance[]>(mockInsurances);
  const [patientInsurances] = useState<PatientInsurance[]>(mockPatientInsurances);
  const [vitalSigns] = useState<VitalSigns[]>(mockVitalSigns);
  const [carePlans] = useState<CarePlan[]>(mockCarePlans);
  const [genomicProfiles, setGenomicProfiles] = useState<GenomicProfile[]>([]);
  const [pgxInteractions, setPgxInteractions] = useState<PGxDrugInteraction[]>([]);
  const [bioSamples, setBioSamples] = useState<BioSample[]>([]);
  const [biobankFreezers, setBiobankFreezers] = useState<BiobankFreezer[]>([]);
  const [clinicalTrials, setClinicalTrials] = useState<ClinicalTrial[]>([]);

  const refreshData = async () => {
    setDataLoading(true);
    setDataError(null);
    try {
      setPatients([...mockPatients]);
      setUsers([...mockUsers]);
      setDepartments([...mockDepartments]);
      setAppointments([...mockAppointments]);
      setMedications([...mockMedications]);
      setMedicationMovements([...mockMedicationMovements]);
      setMedicalRecords([...mockMedicalRecords]);
      setBeds([...mockBeds]);
      setAdmissions([...mockAdmissions]);
      setLabOrders([...mockLabOrders]);
      setLabTests([...mockLabTests]);
      setInvoices([...mockInvoices]);
      setEmergencyVisits([...mockEmergencyVisits]);
      setSurgeries([...mockSurgeries]);
      setOperatingRooms([...mockOperatingRooms]);
      setWorkSchedules([...mockWorkSchedules]);
      setNotifications([...mockNotifications]);
      setGenomicProfiles([...mockGenomicProfiles]);
      setPgxInteractions([...mockPGxInteractions]);
      setBioSamples([...mockBioSamples]);
      setBiobankFreezers([...mockBiobankFreezers]);
      setClinicalTrials([...mockClinicalTrials]);
      setQuickInvoiceItems([...defaultOrgSettings.quickInvoiceItems]);
      setOrganizationSettings({ ...defaultOrgSettings });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de chargement';
      setDataError(message);
      showError('Erreur de chargement', message);
    } finally {
      setDataLoading(false);
    }
  };

  // Restore session from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('softcare_current_user');
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

  // Mock sign in
  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { error: 'Email non trouvé' };
    if (password !== 'demo123') return { error: 'Mot de passe incorrect' };
    setCurrentUser(user);
    localStorage.setItem('softcare_current_user', JSON.stringify(user));
    return { error: null };
  };

  const signOut = async () => {
    setCurrentUser(null);
    localStorage.removeItem('softcare_current_user');
  };

  // === PATIENTS ===
  const addPatient = async (patient: Partial<Patient>) => {
    const newPatient: Patient = {
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
    setPatients(prev => [newPatient, ...prev]);
    success('Patient créé', 'Le dossier patient a été enregistré');
  };

  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    success('Patient mis à jour');
  };

  const deletePatient = async (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    success('Patient supprimé');
  };

  // === USERS ===
  const addUser = async (user: Partial<User>) => {
    const newUser: User = {
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
      permissions: user.permissions || [],
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    success('Utilisateur créé');
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    success('Utilisateur mis à jour');
  };

  const deleteUser = async (id: string) => {
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
    const newMed: Medication = {
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
    setMedications(prev => [...prev, newMed]);
    success('Médicament ajouté');
  };

  const updateMedication = async (id: string, updates: Partial<Medication>) => {
    setMedications(prev => prev.map(m => m.id === id ? { ...m, ...updates, unitPrice: updates.unitPrice || updates.price || m.unitPrice, price: updates.price || updates.unitPrice || m.price } : m));
    success('Médicament mis à jour');
  };

  const deleteMedication = async (id: string) => {
    setMedications(prev => prev.filter(m => m.id !== id));
    success('Médicament supprimé');
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

  // === BEDS ===
  const updateBed = async (id: string, updates: Partial<Bed>) => {
    setBeds(prev => prev.map(b => b.id === id ? { ...b, ...updates, currentPatientId: updates.patientId || updates.currentPatientId || b.currentPatientId } : b));
  };

  // === ADMISSIONS ===
  const addAdmission = async (admission: Partial<Admission>) => {
    const newAdmission: Admission = {
      id: genId(),
      patientId: admission.patientId || '',
      bedId: admission.bedId || '',
      doctorId: admission.doctorId || '',
      type: admission.type || 'planned',
      reason: admission.reason || '',
      admissionDate: admission.admissionDate || new Date().toISOString().split('T')[0],
      expectedDischargeDate: admission.expectedDischargeDate,
      status: admission.status || 'admitted',
      departmentId: admission.departmentId || '',
      notes: admission.notes,
    };
    setAdmissions(prev => [...prev, newAdmission]);
    if (admission.bedId) {
      await updateBed(admission.bedId, { status: 'occupied', patientId: admission.patientId, currentPatientId: admission.patientId, currentAdmissionId: newAdmission.id, admissionDate: admission.admissionDate });
    }
    success('Patient admis');
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
        id: item.id || (idx + 1).toString(),
        description: item.description || '',
        type: item.type,
        category: item.category,
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice || 0,
        total: item.total || 0,
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

  // === PHARMACY SALES ===
  const addPharmacySale = (sale: PharmacySale) => {
    setPharmacySales(prev => [sale, ...prev]);
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
    beds, setBeds, updateBed,
    admissions, setAdmissions, addAdmission,
    labOrders, setLabOrders, addLabOrder, updateLabOrder, deleteLabOrder,
    labTests, setLabTests,
    emergencyVisits, setEmergencyVisits, addEmergencyVisit, updateEmergencyVisit,
    surgeries, setSurgeries, addSurgery, updateSurgery, deleteSurgery,
    operatingRooms, setOperatingRooms, addOperatingRoom, updateOperatingRoom,
    workSchedules, setWorkSchedules,
    notifications, setNotifications, addNotification, markNotificationRead, unreadCount,
    organizationSettings, setOrganizationSettings,
    updateOrganizationSettings: updateOrganizationSettingsFn,
    dropdownOptions, setDropdownOptions, getDropdownOptions,
    addDropdownOption, updateDropdownOption, deleteDropdownOption,
    pharmacySales, addPharmacySale,
    quickInvoiceItems, addQuickInvoiceItem, updateQuickInvoiceItem, deleteQuickInvoiceItem,
    refreshData,
    rooms, insurances, patientInsurances, vitalSigns, carePlans,
    genomicProfiles, setGenomicProfiles, addGenomicProfile, updateGenomicProfile,
    pgxInteractions, bioSamples, setBioSamples, addBioSample, updateBioSample,
    biobankFreezers, setBiobankFreezers, clinicalTrials, setClinicalTrials, addClinicalTrial
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
