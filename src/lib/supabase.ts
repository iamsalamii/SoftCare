import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for database tables
export interface DbOrganizationSettings {
  id: string;
  name: string;
  type: string;
  address: string | null;
  city: string | null;
  country: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  tax_id: string | null;
  registration_number: string | null;
  bank_name: string | null;
  bank_account: string | null;
  bank_iban: string | null;
  header_color: string;
  primary_color: string;
  currency: string;
  currency_symbol: string;
  tax_rate: number;
  tax_name: string;
  default_discount: number;
  invoice_prefix: string;
  receipt_prefix: string;
  created_at: string;
  updated_at: string;
}

export interface DbUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string | null;
  phone: string | null;
  status: string;
  avatar: string | null;
  password_hash: string | null;
  auth_user_id: string | null;
  created_at: string;
}

export interface DbOperatingRoom {
  id: string;
  name: string;
  number: string;
  type: string;
  status: string;
  equipment: string[] | null;
  created_at: string;
}

export interface DbSurgery {
  id: string;
  patient_id: string | null;
  admission_id: string | null;
  scheduled_date: string;
  scheduled_time: string;
  duration: number;
  type: string;
  procedure: string;
  procedure_code: string | null;
  surgeon_id: string | null;
  anesthesiologist_id: string | null;
  assistant_surgeon_id: string | null;
  scrub_nurse_id: string | null;
  operating_room_id: string | null;
  status: string;
  anesthesia_type: string | null;
  pre_op_diagnosis: string | null;
  post_op_diagnosis: string | null;
  complications: string | null;
  notes: string | null;
  start_time: string | null;
  end_time: string | null;
  created_at: string;
}

export interface DbPatient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  gender: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  blood_type: string | null;
  allergies: string[] | null;
  insurance_id: string | null;
  insurance_name: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  status: string;
  created_at: string;
}

export interface DbAppointment {
  id: string;
  patient_id: string | null;
  doctor_id: string | null;
  date: string;
  time: string;
  type: string;
  status: string;
  notes: string | null;
  reason: string | null;
  created_at: string;
}

export interface DbMedicalRecord {
  id: string;
  patient_id: string | null;
  doctor_id: string | null;
  visit_date: string;
  diagnosis: string | null;
  symptoms: string[] | null;
  notes: string | null;
  treatment: string | null;
  prescription: string | null;
  follow_up_date: string | null;
  created_at: string;
}

export interface DbMedication {
  id: string;
  name: string;
  generic_name: string | null;
  category: string | null;
  dosage_form: string | null;
  strength: string | null;
  unit_price: number;
  stock: number;
  min_stock: number;
  max_stock: number;
  supplier: string | null;
  expiry_date: string | null;
  batch_number: string | null;
  location: string | null;
  status: string;
  created_at: string;
}

export interface DbBed {
  id: string;
  bed_number: string;
  room_number: string;
  department: string | null;
  status: string;
  patient_id: string | null;
  admission_date: string | null;
  created_at: string;
}

export interface DbAdmission {
  id: string;
  patient_id: string | null;
  bed_id: string | null;
  admission_date: string;
  discharge_date: string | null;
  reason: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

export interface DbLabOrder {
  id: string;
  patient_id: string | null;
  doctor_id: string | null;
  test_name: string;
  test_type: string | null;
  status: string;
  priority: string;
  notes: string | null;
  result: string | null;
  result_date: string | null;
  created_at: string;
}

export interface DbInvoice {
  id: string;
  invoice_number: string;
  patient_id: string | null;
  date: string;
  due_date: string | null;
  subtotal: number;
  tax_amount: number;
  discount_percent: number;
  discount_amount: number;
  total: number;
  status: string;
  notes: string | null;
  created_at: string;
}

export interface DbInvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  category: string | null;
  created_at: string;
}

export interface DbQuickInvoiceItem {
  id: string;
  category: string;
  label: string;
  price: number;
  active: boolean;
  sort_order: number;
  created_at: string;
}

export interface DbLabTest {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string | null;
  sample_type: string | null;
  turnaround_time: number;
  price: number;
  preparation_instructions: string | null;
  reference_ranges: any[] | null;
  active: boolean;
  created_at: string;
}