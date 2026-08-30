/*
# Create lab_tests table

1. New Table
- `lab_tests` - Catalog of lab tests available for ordering (id, name, code, category, description, sample_type, turnaround_time, price, preparation_instructions, reference_ranges jsonb, active)
2. Security
- RLS enabled, anon+authenticated CRUD (single-tenant app)
3. Data
- Seeds 5 lab tests matching the mock data (NFS, Glycémie, Créatininémie, ECBU, Troponine)
*/

CREATE TABLE IF NOT EXISTS lab_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL,
  category text NOT NULL DEFAULT 'blood',
  description text,
  sample_type text,
  turnaround_time integer DEFAULT 1,
  price numeric DEFAULT 0,
  preparation_instructions text,
  reference_ranges jsonb DEFAULT '[]',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lab_tests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_lab_tests" ON lab_tests;
CREATE POLICY "anon_select_lab_tests" ON lab_tests FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_lab_tests" ON lab_tests;
CREATE POLICY "anon_insert_lab_tests" ON lab_tests FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_lab_tests" ON lab_tests;
CREATE POLICY "anon_update_lab_tests" ON lab_tests FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_lab_tests" ON lab_tests;
CREATE POLICY "anon_delete_lab_tests" ON lab_tests FOR DELETE TO anon, authenticated USING (true);

-- Seed lab tests
INSERT INTO lab_tests (name, code, category, description, sample_type, turnaround_time, price, preparation_instructions, reference_ranges, active)
SELECT * FROM (VALUES
  ('Numération Formule Sanguine', 'NFS', 'blood', 'Analyse complète des cellules sanguines', 'Sang veineux', 2, 15, NULL, '[{"min":4.0,"max":10.0,"unit":"G/L","interpretation":"Leucocytes normaux"},{"min":120,"max":160,"unit":"G/L","interpretation":"Hémoglobine normale (homme)"},{"min":130,"max":170,"unit":"G/L","interpretation":"Hémoglobine normale (femme)","gender":"female"}]'::jsonb, true),
  ('Glycémie à jeun', 'GLY', 'blood', 'Taux de glucose sanguin', 'Sang veineux', 1, 5, 'À jeun depuis 12h', '[{"min":0.70,"max":1.10,"unit":"g/L","interpretation":"Normale"}]'::jsonb, true),
  ('Créatininémie', 'CREA', 'blood', 'Fonction rénale', 'Sang veineux', 1, 8, NULL, '[{"min":60,"max":110,"unit":"µmol/L","interpretation":"Normale (homme)","gender":"male"},{"min":45,"max":90,"unit":"µmol/L","interpretation":"Normale (femme)","gender":"female"}]'::jsonb, true),
  ('ECBU', 'ECBU', 'urine', 'Examen cytobactériologique des urines', 'Urine', 24, 20, NULL, '[]'::jsonb, true),
  ('Troponine', 'TROP', 'blood', 'Marqueur cardiaque', 'Sang veineux', 1, 25, NULL, '[{"min":0,"max":0.04,"unit":"µg/L","interpretation":"Négatif"}]'::jsonb, true)
) AS t(name, code, category, description, sample_type, turnaround_time, price, preparation_instructions, reference_ranges, active)
WHERE NOT EXISTS (SELECT 1 FROM lab_tests);
