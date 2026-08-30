/*
# Add surgery/operating rooms tables, user password, and ensure org settings row

1. New Tables
- `operating_rooms` - Operating rooms for the surgery module (id, name, number, type, status, equipment[])
- `surgeries` - Scheduled surgeries (id, patient_id, surgeon_id, operating_room_id, scheduled_date/time, procedure, status, anesthesia_type, pre/post-op diagnosis, notes, start/end time)
2. Modified Tables
- `users` - add `password_hash` (text, nullable) to store a default password set at creation
3. Security
- RLS enabled on new tables with anon+authenticated CRUD (single-tenant app, no auth)
4. Data
- Insert a default organization_settings row if none exists so organization info shows on PDFs
- Seed a few operating rooms if the table is empty
5. Important Notes
- No destructive changes; all additive
- `password_hash` is stored as plain text for the demo default-password feature (no real auth is wired up in this app)
*/

-- Add password_hash column to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash text;

-- Operating Rooms
CREATE TABLE IF NOT EXISTS operating_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  number text NOT NULL,
  type text NOT NULL DEFAULT 'general',
  status text NOT NULL DEFAULT 'available',
  equipment text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE operating_rooms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_operating_rooms" ON operating_rooms;
CREATE POLICY "anon_select_operating_rooms" ON operating_rooms FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_operating_rooms" ON operating_rooms;
CREATE POLICY "anon_insert_operating_rooms" ON operating_rooms FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_operating_rooms" ON operating_rooms;
CREATE POLICY "anon_update_operating_rooms" ON operating_rooms FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_operating_rooms" ON operating_rooms;
CREATE POLICY "anon_delete_operating_rooms" ON operating_rooms FOR DELETE TO anon, authenticated USING (true);

-- Surgeries
CREATE TABLE IF NOT EXISTS surgeries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  admission_id uuid,
  scheduled_date date NOT NULL,
  scheduled_time text NOT NULL,
  duration integer DEFAULT 60,
  type text NOT NULL DEFAULT 'elective',
  procedure text NOT NULL,
  procedure_code text,
  surgeon_id uuid REFERENCES users(id) ON DELETE SET NULL,
  anesthesiologist_id uuid,
  assistant_surgeon_id uuid,
  scrub_nurse_id uuid,
  operating_room_id uuid REFERENCES operating_rooms(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'scheduled',
  anesthesia_type text DEFAULT 'general',
  pre_op_diagnosis text,
  post_op_diagnosis text,
  complications text,
  notes text,
  start_time text,
  end_time text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE surgeries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_surgeries" ON surgeries;
CREATE POLICY "anon_select_surgeries" ON surgeries FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_surgeries" ON surgeries;
CREATE POLICY "anon_insert_surgeries" ON surgeries FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_surgeries" ON surgeries;
CREATE POLICY "anon_update_surgeries" ON surgeries FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_surgeries" ON surgeries;
CREATE POLICY "anon_delete_surgeries" ON surgeries FOR DELETE TO anon, authenticated USING (true);

-- Ensure an organization_settings row exists
INSERT INTO organization_settings (name, type, address, city, country, phone, email, website, tax_id, registration_number, bank_name, bank_account, bank_iban, header_color, primary_color, currency, currency_symbol, tax_rate, tax_name, default_discount, invoice_prefix, receipt_prefix)
SELECT 'SoftCare', 'hospital', '123 Avenue de la Sante', 'Paris', 'France', '+33 1 23 45 67 89', 'contact@softcare.fr', 'www.softcare.fr', 'FR12345678901', 'HOSP-2024-001', 'Banque Nationale', '12345678901', 'FR76 1234 5678 9012 3456 7890 123', '#0e7490', '#0891b2', 'EUR', '€', 20, 'TVA', 0, 'FAC', 'REC'
WHERE NOT EXISTS (SELECT 1 FROM organization_settings);

-- Seed operating rooms if empty
INSERT INTO operating_rooms (name, number, type, status, equipment)
SELECT * FROM (VALUES
  ('Salle 1', 'OP1', 'general', 'available', ARRAY['Table opératoire','Lampe scialytique','Monitoring']),
  ('Salle 2', 'OP2', 'cardiac', 'available', ARRAY['Table opératoire','Lampe scialytique','Monitoring','Circulation extracorporelle']),
  ('Salle 3', 'OP3', 'neuro', 'available', ARRAY['Table opératoire','Lampe scialytique','Monitoring','Microscope'])
) AS t(name, number, type, status, equipment)
WHERE NOT EXISTS (SELECT 1 FROM operating_rooms);
