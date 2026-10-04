import apiClient from './apiClient';
import {
  Patient, Medication, MedicalRecord, Appointment, Invoice, Bed,
  GenomicProfile, BioSample, BiobankFreezer, ClinicalTrial, User, OrganizationSettings
} from '../types';

export const apiService = {

  // === SURGERY ===
  surgery: {
    getAll: () => apiClient.get<any[]>('/surgery'),
    getById: (id: string) => apiClient.get<any>(`/surgery/${id}`),
    create: (surgery: any) => apiClient.post<any>('/surgery', surgery),
    update: (id: string, surgery: any) => apiClient.put<any>(`/surgery/${id}`, surgery),
    delete: (id: string) => apiClient.delete(`/surgery/${id}`),
  },


  // === EMERGENCIES ===
  emergencies: {
    getAll: () => apiClient.get<any[]>('/emergency'),
    getById: (id: string) => apiClient.get<any>(`/emergency/${id}`),
    create: (visit: any) => apiClient.post<any>('/emergency', visit),
    update: (id: string, visit: any) => apiClient.put<any>(`/emergency/${id}`, visit),
    delete: (id: string) => apiClient.delete(`/emergency/${id}`),
  },

  // === LAB ===
  lab: {
    getTests: () => apiClient.get<any[]>('/lab/tests'),
    createTest: (test: any) => apiClient.post<any>('/lab/tests', test),
    updateTest: (id: string, test: any) => apiClient.put<any>(`/lab/tests/${id}`, test),
    deleteTest: (id: string) => apiClient.delete(`/lab/tests/${id}`),
    
    getOrders: () => apiClient.get<any[]>('/lab/orders'),
    createOrder: (order: any) => apiClient.post<any>('/lab/orders', order),
    updateOrder: (id: string, order: any) => apiClient.put<any>(`/lab/orders/${id}`, order),
    deleteOrder: (id: string) => apiClient.delete(`/lab/orders/${id}`),
  },


  // === NURSING (Soins) ===
  vitals: {
    getAll: () => apiClient.get<any[]>('/nursing/vitals'),
    getByPatient: (patientId: string) => apiClient.get<any[]>(`/nursing/vitals/patient/${patientId}`),
    create: (vital: any) => apiClient.post<any>('/nursing/vitals', vital),
    update: (id: string, vital: any) => apiClient.put<any>(`/nursing/vitals/${id}`, vital),
    delete: (id: string) => apiClient.delete(`/nursing/vitals/${id}`),
  },
  carePlans: {
    getAll: () => apiClient.get<any[]>('/nursing/care-plans'),
    getByPatient: (patientId: string) => apiClient.get<any[]>(`/nursing/care-plans/patient/${patientId}`),
    create: (carePlan: any) => apiClient.post<any>('/nursing/care-plans', carePlan),
    update: (id: string, carePlan: any) => apiClient.put<any>(`/nursing/care-plans/${id}`, carePlan),
    delete: (id: string) => apiClient.delete(`/nursing/care-plans/${id}`),
  },
  nursingNotes: {
    getAll: () => apiClient.get<any[]>('/nursing/notes'),
    getByPatient: (patientId: string) => apiClient.get<any[]>(`/nursing/notes/patient/${patientId}`),
    create: (note: any) => apiClient.post<any>('/nursing/notes', note),
    update: (id: string, note: any) => apiClient.put<any>(`/nursing/notes/${id}`, note),
    delete: (id: string) => apiClient.delete(`/nursing/notes/${id}`),
  },

  // === HEALTH & SYSTEM ===
  health: {
    check: () => apiClient.checkHealth(),
  },

  // === AUTH & USERS ===
  auth: {
    login: (email: string, password: string) =>
      apiClient.post<{ token: string; user: User }>('/auth/login', { email, password }),
    register: (userData: Partial<User> & { password?: string }) =>
      apiClient.post<User>('/auth/register', userData),
  },

  // === USERS ===
  users: {
    getAll: () => apiClient.get<User[]>('/users'),
    getById: (id: string) => apiClient.get<User>(`/users/${id}`),
    create: (user: Partial<User>) => apiClient.post<User>('/users', user),
    update: (id: string, user: Partial<User>) => apiClient.put<User>(`/users/${id}`, user),
    delete: (id: string) => apiClient.delete(`/users/${id}`),
  },

  // === PATIENTS ===
  patients: {
    getAll: (search?: string) => apiClient.get<Patient[]>('/patients', search ? { search } : undefined),
    getById: (id: string) => apiClient.get<Patient>(`/patients/${id}`),
    create: (patient: Partial<Patient>) => apiClient.post<Patient>('/patients', patient),
    update: (id: string, patient: Partial<Patient>) => apiClient.put<Patient>(`/patients/${id}`, patient),
    delete: (id: string) => apiClient.delete(`/patients/${id}`),
  },

  // === PHARMACY & MEDICATIONS ===
  medications: {
    getAll: (search?: string, isBiotech?: boolean) =>
      apiClient.get<Medication[]>('/medications', {
        ...(search ? { search } : {}),
        ...(isBiotech !== undefined ? { isBiotech: String(isBiotech) } : {}),
      }),
    getById: (id: string) => apiClient.get<Medication>(`/medications/${id}`),
    scanBarcode: (barcode: string) => apiClient.get<Medication>(`/medications/scan/${encodeURIComponent(barcode)}`),
    create: (med: Partial<Medication>) => apiClient.post<Medication>('/medications', med),
    update: (id: string, med: Partial<Medication>) => apiClient.put<Medication>(`/medications/${id}`, med),
    delete: (id: string) => apiClient.delete(`/medications/${id}`),
    getMovements: () => apiClient.get<any[]>('/medications/movements'),
    addMovement: (movement: any) => apiClient.post<any>('/medications/movements', movement),
  },

  // === PHARMACY SALES ===
  pharmacySales: {
    getAll: () => apiClient.get<any[]>('/pharmacysales'),
    getById: (id: string) => apiClient.get<any>(`/pharmacysales/${id}`),
    create: (sale: any) => apiClient.post<any>('/pharmacysales', sale),
  },

  // === BIOTECHNOLOGY & PGx ===
  biotech: {
    getGenomicProfiles: () => apiClient.get<GenomicProfile[]>('/biotech/genomics'),
    getPatientGenomics: (patientId: string) => apiClient.get<GenomicProfile>(`/biotech/genomics/patient/${patientId}`),
    createGenomicProfile: (profile: Partial<GenomicProfile>) => apiClient.post<GenomicProfile>('/biotech/genomics', profile),

    getFreezers: () => apiClient.get<BiobankFreezer[]>('/biotech/biobank/freezers'),
    getBioSamples: (freezerId?: string) => apiClient.get<BioSample[]>('/biotech/biobank/samples', freezerId ? { freezerId } : undefined),
    scanBioSample: (code: string) => apiClient.get<BioSample>(`/biotech/biobank/samples/scan/${encodeURIComponent(code)}`),
    createBioSample: (sample: Partial<BioSample>) => apiClient.post<BioSample>('/biotech/biobank/samples', sample),

    getTrials: () => apiClient.get<ClinicalTrial[]>('/biotech/trials'),
    createTrial: (trial: Partial<ClinicalTrial>) => apiClient.post<ClinicalTrial>('/biotech/trials', trial),
  },

  // === MEDICAL RECORDS ===
  medicalRecords: {
    getAll: (patientId?: string) => apiClient.get<MedicalRecord[]>('/medicalrecords', patientId ? { patientId } : undefined),
    getById: (id: string) => apiClient.get<MedicalRecord>(`/medicalrecords/${id}`),
    create: (record: Partial<MedicalRecord>) => apiClient.post<MedicalRecord>('/medicalrecords', record),
    update: (id: string, record: Partial<MedicalRecord>) => apiClient.put<MedicalRecord>(`/medicalrecords/${id}`, record),
  },

  // === APPOINTMENTS ===
  appointments: {
    getAll: (patientId?: string) => apiClient.get<Appointment[]>('/appointments', patientId ? { patientId } : undefined),
    create: (appt: Partial<Appointment>) => apiClient.post<Appointment>('/appointments', appt),
    update: (id: string, appt: Partial<Appointment>) => apiClient.put<Appointment>(`/appointments/${id}`, appt),
    delete: (id: string) => apiClient.delete(`/appointments/${id}`),
  },

  // === INVOICES ===
  invoices: {
    getAll: () => apiClient.get<Invoice[]>('/invoices'),
    create: (invoice: Partial<Invoice>) => apiClient.post<Invoice>('/invoices', invoice),
    delete: (id: string) => apiClient.delete(`/invoices/${id}`),
  },

  // === BEDS & ADMISSIONS ===
  beds: {
    getAll: () => apiClient.get<Bed[]>('/beds'),
    create: (bed: Partial<Bed>) => apiClient.post<Bed>('/beds', bed),
    update: (id: string, bed: Partial<Bed>) => apiClient.put<Bed>(`/beds/${id}`, bed),
    delete: (id: string) => apiClient.delete(`/beds/${id}`),
  },
  admissions: {
    getAll: (patientId?: string) => apiClient.get<Admission[]>('/admissions', patientId ? { patientId } : undefined),
    create: (admission: Partial<Admission>) => apiClient.post<Admission>('/admissions', admission),
    update: (id: string, admission: Partial<Admission>) => apiClient.put<Admission>(`/admissions/${id}`, admission),
    delete: (id: string) => apiClient.delete(`/admissions/${id}`),
  },

  // === SETTINGS ===
  settings: {
    getOrganization: () => apiClient.get<OrganizationSettings>('/settings/organization'),
    updateOrganization: (settings: Partial<OrganizationSettings>) => apiClient.put<OrganizationSettings>('/settings/organization', settings),
  },

  // === DEPARTMENTS ===
  departments: {
    getAll: () => apiClient.get<any[]>('/departments'),
    getById: (id: string) => apiClient.get<any>(`/departments/${id}`),
    create: (dept: any) => apiClient.post<any>('/departments', dept),
    update: (id: string, dept: any) => apiClient.put<any>(`/departments/${id}`, dept),
    delete: (id: string) => apiClient.delete(`/departments/${id}`),
  }
};

export default apiService;
