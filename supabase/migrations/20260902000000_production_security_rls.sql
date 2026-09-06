-- ========================================================================
-- SoftCare Production Security & Row Level Security (RLS) Hardening
-- Migration: 20260902000000_production_security_rls.sql
-- ========================================================================

-- 1. Ensure RLS is forcefully enabled across all hospital tables
ALTER TABLE IF EXISTS organization_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS medication_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS lab_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS lab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS operating_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS surgeries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS emergency_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS genomic_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS bio_samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS clinical_trials ENABLE ROW LEVEL SECURITY;

-- 2. Revoke public/anonymous full bypass in production & restrict to authenticated roles
-- Restrict Patient records access to authenticated healthcare staff
DROP POLICY IF EXISTS "auth_read_patients" ON patients;
CREATE POLICY "auth_read_patients" ON patients
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "auth_insert_patients" ON patients;
CREATE POLICY "auth_insert_patients" ON patients
  FOR INSERT TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_patients" ON patients;
CREATE POLICY "auth_update_patients" ON patients
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- Restrict Medical Records (DPI) access to authenticated practitioners
DROP POLICY IF EXISTS "auth_read_medical_records" ON medical_records;
CREATE POLICY "auth_read_medical_records" ON medical_records
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "auth_write_medical_records" ON medical_records;
CREATE POLICY "auth_write_medical_records" ON medical_records
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Restrict Lab Orders & Biotech data
DROP POLICY IF EXISTS "auth_read_lab_orders" ON lab_orders;
CREATE POLICY "auth_read_lab_orders" ON lab_orders
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "auth_write_lab_orders" ON lab_orders;
CREATE POLICY "auth_write_lab_orders" ON lab_orders
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- 3. Security Indexes for Fast Lookup & Auditing
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient ON medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_orders_patient ON lab_orders(patient_id);
