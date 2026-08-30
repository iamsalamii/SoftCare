/*
# Seed Initial Data for SoftCare

This migration populates the database with sample data for demonstration.

## Data Inserted:
1. Organization settings (SoftCare hospital)
2. Sample users (doctors, nurses, admin, etc.)
3. Sample patients
4. Sample medications
5. Sample beds
6. Quick invoice items

All IDs are generated using gen_random_uuid() for uniqueness.
*/

-- Organization Settings
INSERT INTO organization_settings (id, name, type, address, city, country, phone, email, website, tax_id, registration_number, bank_name, bank_account, bank_iban)
SELECT gen_random_uuid(), 'SoftCare', 'hospital', '123 Avenue de la Sante', 'Paris', 'France', '+33 1 23 45 67 89', 'contact@softcare.fr', 'www.softcare.fr', 'FR12345678901', 'HOSP-2024-001', 'Banque Nationale', '12345678901', 'FR76 1234 5678 9012 3456 7890 123'
WHERE NOT EXISTS (SELECT 1 FROM organization_settings LIMIT 1);

-- Users (Staff)
INSERT INTO users (id, name, email, role, department, phone, status)
SELECT gen_random_uuid(), 'Dr. Martin Dupont', 'martin.dupont@softcare.fr', 'doctor', 'Cardiologie', '+33 6 12 34 56 78', 'active'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'martin.dupont@softcare.fr');

INSERT INTO users (id, name, email, role, department, phone, status)
SELECT gen_random_uuid(), 'Dr. Sophie Bernard', 'sophie.bernard@softcare.fr', 'doctor', 'Pediatrie', '+33 6 23 45 67 89', 'active'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'sophie.bernard@softcare.fr');

INSERT INTO users (id, name, email, role, department, phone, status)
SELECT gen_random_uuid(), 'Dr. Pierre Leroy', 'pierre.leroy@softcare.fr', 'surgeon', 'Chirurgie', '+33 6 34 56 78 90', 'active'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'pierre.leroy@softcare.fr');

INSERT INTO users (id, name, email, role, department, phone, status)
SELECT gen_random_uuid(), 'Marie Laurent', 'marie.laurent@softcare.fr', 'nurse', 'Urgences', '+33 6 45 67 89 01', 'active'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'marie.laurent@softcare.fr');

INSERT INTO users (id, name, email, role, department, phone, status)
SELECT gen_random_uuid(), 'Jean Moreau', 'jean.moreau@softcare.fr', 'pharmacist', 'Pharmacie', '+33 6 56 78 90 12', 'active'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'jean.moreau@softcare.fr');

INSERT INTO users (id, name, email, role, department, phone, status)
SELECT gen_random_uuid(), 'Claire Petit', 'claire.petit@softcare.fr', 'lab_tech', 'Laboratoire', '+33 6 67 89 01 23', 'active'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'claire.petit@softcare.fr');

INSERT INTO users (id, name, email, role, department, phone, status)
SELECT gen_random_uuid(), 'Lucas Roux', 'lucas.roux@softcare.fr', 'receptionist', 'Accueil', '+33 6 78 90 12 34', 'active'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'lucas.roux@softcare.fr');

INSERT INTO users (id, name, email, role, department, phone, status)
SELECT gen_random_uuid(), 'Admin System', 'admin@softcare.fr', 'admin', 'Administration', '+33 6 89 01 23 45', 'active'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@softcare.fr');

-- Patients
INSERT INTO patients (id, first_name, last_name, date_of_birth, gender, phone, email, address, city, blood_type, allergies, insurance_name, emergency_contact_name, emergency_contact_phone, status)
SELECT gen_random_uuid(), 'Jean', 'Martin', '1985-03-15', 'male', '+33 6 11 22 33 44', 'jean.martin@email.fr', '45 Rue de la Paix', 'Paris', 'A+', ARRAY['Penicilline'], 'Assurance Sante Plus', 'Marie Martin', '+33 6 22 33 44 55', 'active'
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE first_name = 'Jean' AND last_name = 'Martin');

INSERT INTO patients (id, first_name, last_name, date_of_birth, gender, phone, email, address, city, blood_type, allergies, insurance_name, emergency_contact_name, emergency_contact_phone, status)
SELECT gen_random_uuid(), 'Sophie', 'Durand', '1992-07-22', 'female', '+33 6 33 44 55 66', 'sophie.durand@email.fr', '12 Avenue Victor Hugo', 'Lyon', 'B-', NULL, 'Mutuelle Famille', 'Pierre Durand', '+33 6 44 55 66 77', 'active'
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE first_name = 'Sophie' AND last_name = 'Durand');

INSERT INTO patients (id, first_name, last_name, date_of_birth, gender, phone, email, address, city, blood_type, allergies, insurance_name, emergency_contact_name, emergency_contact_phone, status)
SELECT gen_random_uuid(), 'Pierre', 'Lefebvre', '1978-11-08', 'male', '+33 6 55 66 77 88', 'pierre.lefebvre@email.fr', '78 Boulevard Haussmann', 'Marseille', 'O+', ARRAY['Aspirine', 'Latex'], 'Assurance General', 'Claire Lefebvre', '+33 6 66 77 88 99', 'active'
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE first_name = 'Pierre' AND last_name = 'Lefebvre');

INSERT INTO patients (id, first_name, last_name, date_of_birth, gender, phone, email, address, city, blood_type, allergies, insurance_name, emergency_contact_name, emergency_contact_phone, status)
SELECT gen_random_uuid(), 'Marie', 'Dubois', '1995-01-30', 'female', '+33 6 77 88 99 00', 'marie.dubois@email.fr', '34 Rue Saint-Michel', 'Paris', 'AB+', NULL, 'Securite Sante', 'Jean Dubois', '+33 6 88 99 00 11', 'active'
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE first_name = 'Marie' AND last_name = 'Dubois');

INSERT INTO patients (id, first_name, last_name, date_of_birth, gender, phone, email, address, city, blood_type, allergies, insurance_name, emergency_contact_name, emergency_contact_phone, status)
SELECT gen_random_uuid(), 'Luc', 'Moreau', '2018-05-12', 'male', NULL, NULL, '56 Rue des Enfants', 'Paris', 'A-', ARRAY['Lait'], 'Assurance Famille', 'Sophie Moreau', '+33 6 99 00 11 22', 'active'
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE first_name = 'Luc' AND last_name = 'Moreau');

-- Medications
INSERT INTO medications (id, name, generic_name, category, dosage_form, strength, unit_price, stock, min_stock, max_stock, supplier, location, status)
SELECT gen_random_uuid(), 'Paracetamol 500mg', 'Acetaminophen', 'Analgesic', 'Tablet', '500mg', 2.50, 500, 100, 1000, 'PharmaDist', 'A1-01', 'active'
WHERE NOT EXISTS (SELECT 1 FROM medications WHERE name = 'Paracetamol 500mg');

INSERT INTO medications (id, name, generic_name, category, dosage_form, strength, unit_price, stock, min_stock, max_stock, supplier, location, status)
SELECT gen_random_uuid(), 'Amoxicilline 250mg', 'Amoxicillin', 'Antibiotic', 'Capsule', '250mg', 8.90, 200, 50, 500, 'MediSupply', 'A2-03', 'active'
WHERE NOT EXISTS (SELECT 1 FROM medications WHERE name = 'Amoxicilline 250mg');

INSERT INTO medications (id, name, generic_name, category, dosage_form, strength, unit_price, stock, min_stock, max_stock, supplier, location, status)
SELECT gen_random_uuid(), 'Ibuprofene 400mg', 'Ibuprofen', 'Anti-inflammatory', 'Tablet', '400mg', 3.20, 350, 100, 800, 'PharmaDist', 'A1-05', 'active'
WHERE NOT EXISTS (SELECT 1 FROM medications WHERE name = 'Ibuprofene 400mg');

INSERT INTO medications (id, name, generic_name, category, dosage_form, strength, unit_price, stock, min_stock, max_stock, supplier, location, status)
SELECT gen_random_uuid(), 'Omeprazole 20mg', 'Omeprazole', 'Gastric', 'Capsule', '20mg', 5.50, 150, 30, 300, 'MediSupply', 'B1-02', 'active'
WHERE NOT EXISTS (SELECT 1 FROM medications WHERE name = 'Omeprazole 20mg');

INSERT INTO medications (id, name, generic_name, category, dosage_form, strength, unit_price, stock, min_stock, max_stock, supplier, location, status)
SELECT gen_random_uuid(), 'Metformine 500mg', 'Metformin', 'Antidiabetic', 'Tablet', '500mg', 4.75, 180, 40, 400, 'PharmaDist', 'B2-04', 'active'
WHERE NOT EXISTS (SELECT 1 FROM medications WHERE name = 'Metformine 500mg');

INSERT INTO medications (id, name, generic_name, category, dosage_form, strength, unit_price, stock, min_stock, max_stock, supplier, location, status)
SELECT gen_random_uuid(), 'Salbutamol Spray', 'Albuterol', 'Bronchodilator', 'Spray', '100mcg/dose', 12.00, 45, 20, 100, 'MediSupply', 'C1-01', 'active'
WHERE NOT EXISTS (SELECT 1 FROM medications WHERE name = 'Salbutamol Spray');

-- Beds
INSERT INTO beds (id, bed_number, room_number, department, status)
SELECT gen_random_uuid(), '101', '101', 'Medecine Interne', 'available'
WHERE NOT EXISTS (SELECT 1 FROM beds WHERE bed_number = '101' AND room_number = '101');

INSERT INTO beds (id, bed_number, room_number, department, status)
SELECT gen_random_uuid(), '102', '102', 'Medecine Interne', 'available'
WHERE NOT EXISTS (SELECT 1 FROM beds WHERE bed_number = '102' AND room_number = '102');

INSERT INTO beds (id, bed_number, room_number, department, status)
SELECT gen_random_uuid(), '201', '201', 'Chirurgie', 'available'
WHERE NOT EXISTS (SELECT 1 FROM beds WHERE bed_number = '201' AND room_number = '201');

INSERT INTO beds (id, bed_number, room_number, department, status)
SELECT gen_random_uuid(), '202', '202', 'Chirurgie', 'available'
WHERE NOT EXISTS (SELECT 1 FROM beds WHERE bed_number = '202' AND room_number = '202');

INSERT INTO beds (id, bed_number, room_number, department, status)
SELECT gen_random_uuid(), '301', '301', 'Cardiologie', 'available'
WHERE NOT EXISTS (SELECT 1 FROM beds WHERE bed_number = '301' AND room_number = '301');

INSERT INTO beds (id, bed_number, room_number, department, status)
SELECT gen_random_uuid(), '302', '302', 'Cardiologie', 'available'
WHERE NOT EXISTS (SELECT 1 FROM beds WHERE bed_number = '302' AND room_number = '302');

INSERT INTO beds (id, bed_number, room_number, department, status)
SELECT gen_random_uuid(), '401', '401', 'Pediatrie', 'available'
WHERE NOT EXISTS (SELECT 1 FROM beds WHERE bed_number = '401' AND room_number = '401');

INSERT INTO beds (id, bed_number, room_number, department, status)
SELECT gen_random_uuid(), 'USI-01', 'USI-1', 'USI', 'available'
WHERE NOT EXISTS (SELECT 1 FROM beds WHERE bed_number = 'USI-01' AND room_number = 'USI-1');

-- Quick Invoice Items
INSERT INTO quick_invoice_items (id, category, label, price, active, sort_order)
SELECT gen_random_uuid(), 'consultation', 'Consultation generale', 50, true, 1
WHERE NOT EXISTS (SELECT 1 FROM quick_invoice_items WHERE label = 'Consultation generale');

INSERT INTO quick_invoice_items (id, category, label, price, active, sort_order)
SELECT gen_random_uuid(), 'consultation', 'Consultation specialiste', 70, true, 2
WHERE NOT EXISTS (SELECT 1 FROM quick_invoice_items WHERE label = 'Consultation specialiste');

INSERT INTO quick_invoice_items (id, category, label, price, active, sort_order)
SELECT gen_random_uuid(), 'consultation', 'Consultation urgente', 90, true, 3
WHERE NOT EXISTS (SELECT 1 FROM quick_invoice_items WHERE label = 'Consultation urgente');

INSERT INTO quick_invoice_items (id, category, label, price, active, sort_order)
SELECT gen_random_uuid(), 'procedure', 'ECG', 35, true, 1
WHERE NOT EXISTS (SELECT 1 FROM quick_invoice_items WHERE label = 'ECG');

INSERT INTO quick_invoice_items (id, category, label, price, active, sort_order)
SELECT gen_random_uuid(), 'procedure', 'Echographie', 80, true, 2
WHERE NOT EXISTS (SELECT 1 FROM quick_invoice_items WHERE label = 'Echographie');

INSERT INTO quick_invoice_items (id, category, label, price, active, sort_order)
SELECT gen_random_uuid(), 'procedure', 'Radiographie', 45, true, 3
WHERE NOT EXISTS (SELECT 1 FROM quick_invoice_items WHERE label = 'Radiographie');

INSERT INTO quick_invoice_items (id, category, label, price, active, sort_order)
SELECT gen_random_uuid(), 'lab', 'NFS', 15, true, 1
WHERE NOT EXISTS (SELECT 1 FROM quick_invoice_items WHERE label = 'NFS');

INSERT INTO quick_invoice_items (id, category, label, price, active, sort_order)
SELECT gen_random_uuid(), 'lab', 'Glycemie', 5, true, 2
WHERE NOT EXISTS (SELECT 1 FROM quick_invoice_items WHERE label = 'Glycemie');

INSERT INTO quick_invoice_items (id, category, label, price, active, sort_order)
SELECT gen_random_uuid(), 'room', 'Chambre standard (nuit)', 150, true, 1
WHERE NOT EXISTS (SELECT 1 FROM quick_invoice_items WHERE label = 'Chambre standard (nuit)');

INSERT INTO quick_invoice_items (id, category, label, price, active, sort_order)
SELECT gen_random_uuid(), 'room', 'Chambre individuelle (nuit)', 250, true, 2
WHERE NOT EXISTS (SELECT 1 FROM quick_invoice_items WHERE label = 'Chambre individuelle (nuit)');