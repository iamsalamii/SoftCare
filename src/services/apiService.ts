import apiClient from './apiClient';
import {
  Patient, Medication, MedicalRecord, Appointment, Invoice, Bed,
  GenomicProfile, BioSample, BiobankFreezer, ClinicalTrial, User, OrganizationSettings
} from '../types';

export const apiService = {
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
    getUsers: () => apiClient.get<User[]>('/auth/users'),
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
  },

  // === BEDS & ADMISSIONS ===
  beds: {
    getAll: () => apiClient.get<Bed[]>('/beds'),
    update: (id: string, bed: Partial<Bed>) => apiClient.put<Bed>(`/beds/${id}`, bed),
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
  }
};

export default apiService;
