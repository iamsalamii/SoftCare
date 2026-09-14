-- =====================================================================================
-- SoftCare ERP - Script d'activation de la Row Level Security (RLS) PostgreSQL
-- Ce script est une défense en profondeur. 
-- L'API backend C# gère déjà les autorisations, mais RLS bloque tout accès direct DB
-- =====================================================================================

-- 1. Activer RLS sur les tables sensibles
ALTER TABLE "Patients" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Admissions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MedicalRecords" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Invoices" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GenomicProfiles" ENABLE ROW LEVEL SECURITY;

-- 2. Créer une politique (Exemple pour isoler par département)
CREATE POLICY "Patients_Isolation_Policy" ON "Patients"
    AS PERMISSIVE
    FOR ALL
    TO public
    USING (
        current_setting('softcare.current_department', true) = "DepartmentId"
        OR current_setting('softcare.current_role', true) = 'admin'
    );
