/*
# SoftCare Initial Database Schema

This migration creates the core tables for the hospital management system.

## Tables Created:
1. `organization_settings` - Hospital/organization configuration
2. `patients` - Patient records
3. `users` - Staff users (doctors, nurses, admins, etc.)
4. `appointments` - Patient appointments
5. `medical_records` - Medical consultations and records
6. `medications` - Pharmacy medication inventory
7. `beds` - Hospital beds and room management
8. `admissions` - Patient admissions
9. `lab_orders` - Laboratory test orders
10. `invoices` - Billing invoices
11. `invoice_items` - Invoice line items

## Security:
- RLS enabled on all tables
- Single-tenant app (no auth) - policies allow anon + authenticated access
*/

-- Organization Settings
CREATE TABLE IF NOT EXISTS organization_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'SoftCare',
  type text NOT NULL DEFAULT 'hospital',
  address text,
  city text,
  country text DEFAULT 'France',
  phone text,
  email text,
  website text,
  tax_id text,
  registration_number text,
  bank_name text,
  bank_account text,
  bank_iban text,
  header_color text DEFAULT '#0e7490',
  primary_color text DEFAULT '#0891b2',
  currency text DEFAULT 'EUR',
  currency_symbol text DEFAULT '€',
  tax_rate numeric DEFAULT 20,
  tax_name text DEFAULT 'TVA',
  default_discount numeric DEFAULT 0,
  invoice_prefix text DEFAULT 'FAC',
  receipt_prefix text DEFAULT 'REC',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE organization_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_crud_organization" ON organization_settings;
CREATE POLICY "anon_crud_organization" ON organization_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_organization" ON organization_settings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_organization" ON organization_settings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- Users (Staff)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'doctor',
  department text,
  phone text,
  status text DEFAULT 'active',
  avatar text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_users" ON users;
CREATE POLICY "anon_select_users" ON users FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_users" ON users FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_users" ON users FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_users" ON users FOR DELETE TO anon, authenticated USING (true);

-- Patients
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date,
  gender text,
  phone text,
  email text,
  address text,
  city text,
  blood_type text,
  allergies text[],
  insurance_id text,
  insurance_name text,
  emergency_contact_name text,
  emergency_contact_phone text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_patients" ON patients;
CREATE POLICY "anon_select_patients" ON patients FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_patients" ON patients FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_patients" ON patients FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_patients" ON patients FOR DELETE TO anon, authenticated USING (true);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES users(id) ON DELETE SET NULL,
  date date NOT NULL,
  time text NOT NULL,
  type text NOT NULL,
  status text DEFAULT 'scheduled',
  notes text,
  reason text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_appointments" ON appointments;
CREATE POLICY "anon_select_appointments" ON appointments FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_appointments" ON appointments FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_appointments" ON appointments FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_appointments" ON appointments FOR DELETE TO anon, authenticated USING (true);

-- Medical Records
CREATE TABLE IF NOT EXISTS medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES users(id) ON DELETE SET NULL,
  visit_date date NOT NULL,
  diagnosis text,
  symptoms text[],
  notes text,
  treatment text,
  prescription text,
  follow_up_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_medical_records" ON medical_records;
CREATE POLICY "anon_select_medical_records" ON medical_records FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_medical_records" ON medical_records FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_medical_records" ON medical_records FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_medical_records" ON medical_records FOR DELETE TO anon, authenticated USING (true);

-- Medications
CREATE TABLE IF NOT EXISTS medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  generic_name text,
  category text,
  dosage_form text,
  strength text,
  unit_price numeric DEFAULT 0,
  stock integer DEFAULT 0,
  min_stock integer DEFAULT 10,
  max_stock integer DEFAULT 100,
  supplier text,
  expiry_date date,
  batch_number text,
  location text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE medications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_medications" ON medications;
CREATE POLICY "anon_select_medications" ON medications FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_medications" ON medications FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_medications" ON medications FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_medications" ON medications FOR DELETE TO anon, authenticated USING (true);

-- Beds
CREATE TABLE IF NOT EXISTS beds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bed_number text NOT NULL,
  room_number text NOT NULL,
  department text,
  status text DEFAULT 'available',
  patient_id uuid REFERENCES patients(id) ON DELETE SET NULL,
  admission_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE beds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_beds" ON beds;
CREATE POLICY "anon_select_beds" ON beds FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_beds" ON beds FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_beds" ON beds FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_beds" ON beds FOR DELETE TO anon, authenticated USING (true);

-- Admissions
CREATE TABLE IF NOT EXISTS admissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  bed_id uuid REFERENCES beds(id) ON DELETE SET NULL,
  admission_date date NOT NULL,
  discharge_date date,
  reason text,
  status text DEFAULT 'admitted',
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_admissions" ON admissions;
CREATE POLICY "anon_select_admissions" ON admissions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_admissions" ON admissions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_admissions" ON admissions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_admissions" ON admissions FOR DELETE TO anon, authenticated USING (true);

-- Lab Orders
CREATE TABLE IF NOT EXISTS lab_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES users(id) ON DELETE SET NULL,
  test_name text NOT NULL,
  test_type text,
  status text DEFAULT 'pending',
  priority text DEFAULT 'normal',
  notes text,
  result text,
  result_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lab_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_lab_orders" ON lab_orders;
CREATE POLICY "anon_select_lab_orders" ON lab_orders FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_lab_orders" ON lab_orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_lab_orders" ON lab_orders FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_lab_orders" ON lab_orders FOR DELETE TO anon, authenticated USING (true);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  patient_id uuid REFERENCES patients(id) ON DELETE SET NULL,
  date date NOT NULL,
  due_date date,
  subtotal numeric DEFAULT 0,
  tax_amount numeric DEFAULT 0,
  discount_percent numeric DEFAULT 0,
  discount_amount numeric DEFAULT 0,
  total numeric DEFAULT 0,
  status text DEFAULT 'draft',
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_invoices" ON invoices;
CREATE POLICY "anon_select_invoices" ON invoices FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_invoices" ON invoices FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_invoices" ON invoices FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_invoices" ON invoices FOR DELETE TO anon, authenticated USING (true);

-- Invoice Items
CREATE TABLE IF NOT EXISTS invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity integer DEFAULT 1,
  unit_price numeric DEFAULT 0,
  total numeric DEFAULT 0,
  category text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_invoice_items" ON invoice_items;
CREATE POLICY "anon_select_invoice_items" ON invoice_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_invoice_items" ON invoice_items FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_invoice_items" ON invoice_items FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_invoice_items" ON invoice_items FOR DELETE TO anon, authenticated USING (true);

-- Quick Invoice Items (predefined items for quick billing)
CREATE TABLE IF NOT EXISTS quick_invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  label text NOT NULL,
  price numeric DEFAULT 0,
  active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quick_invoice_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_quick_invoice_items" ON quick_invoice_items;
CREATE POLICY "anon_select_quick_invoice_items" ON quick_invoice_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_quick_invoice_items" ON quick_invoice_items FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_quick_invoice_items" ON quick_invoice_items FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_quick_invoice_items" ON quick_invoice_items FOR DELETE TO anon, authenticated USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient ON medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_medications_stock ON medications(stock);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_patient ON invoices(patient_id);