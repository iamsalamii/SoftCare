import re

with open('src/context/AppContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Clean up Patients CRUD
content = re.sub(
    r'const addPatient = async \(patient: Partial<Patient>\) => \{.*?(?=const updatePatient = async)',
    r'''const addPatient = async (patient: Partial<Patient>) => {
    try {
      const newPatient = await apiService.patients.create(patient);
      setPatients(prev => [newPatient, ...prev]);
      success('Patient créé', 'Le dossier patient a été enregistré');
    } catch (err: any) {
      showError('Erreur', err.message || 'Impossible de créer le patient');
      throw err;
    }
  };

  ''',
    content, flags=re.DOTALL
)

content = re.sub(
    r'const updatePatient = async \(id: string, updates: Partial<Patient>\) => \{.*?(?=const deletePatient = async)',
    r'''const updatePatient = async (id: string, updates: Partial<Patient>) => {
    try {
      const updatedPatient = await apiService.patients.update(id, updates);
      setPatients(prev => prev.map(p => p.id === id ? updatedPatient : p));
      success('Patient mis à jour');
    } catch (err: any) {
      showError('Erreur', err.message || 'Impossible de mettre à jour le patient');
      throw err;
    }
  };

  ''',
    content, flags=re.DOTALL
)

content = re.sub(
    r'const deletePatient = async \(id: string\) => \{.*?(?=// === USERS ===)',
    r'''const deletePatient = async (id: string) => {
    try {
      await apiService.patients.delete(id);
      setPatients(prev => prev.filter(p => p.id !== id));
      success('Patient supprimé');
    } catch (err: any) {
      showError('Erreur', err.message || 'Impossible de supprimer le patient');
      throw err;
    }
  };

  ''',
    content, flags=re.DOTALL
)

# 2. Users CRUD
content = re.sub(
    r'// === USERS ===.*?const addUser = async.*?(?=// === APPOINTMENTS ===)',
    r'''// === USERS ===
  const addUser = async (user: Partial<User>) => {
    try {
      const newUser = await apiService.users.create(user);
      setUsers(prev => [...prev, newUser]);
      success('Utilisateur créé');
    } catch (err: any) {
      showError('Erreur', err.message || 'Impossible de créer l\'utilisateur');
      throw err;
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    try {
      const updatedUser = await apiService.users.update(id, updates);
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      success('Utilisateur mis à jour');
    } catch (err: any) {
      showError('Erreur', err.message || 'Impossible de mettre à jour l\'utilisateur');
      throw err;
    }
  };

  const deleteUser = async (id: string) => {
    if (id === '1' || id === 'admin-1' || id === 'USR-001') {
      showError('Action interdite', 'Le compte Super-Administrateur système ne peut pas être supprimé.');
      return;
    }
    try {
      await apiService.users.delete(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      success('Utilisateur supprimé');
    } catch (err: any) {
      showError('Erreur', err.message || 'Impossible de supprimer l\'utilisateur');
      throw err;
    }
  };

  ''',
    content, flags=re.DOTALL
)

# 3. Beds CRUD
content = re.sub(
    r'// === BEDS ===.*?const addBed = async.*?(?=// === VITALS & OBSERVATIONS ===)',
    r'''// === BEDS ===
  const addBed = async (bed: Partial<Bed>) => {
    try {
      const newBed = await apiService.beds.create(bed);
      setBeds(prev => [...prev, newBed]);
      success('Lit ajouté');
    } catch (err: any) {
      showError('Erreur', err.message || 'Impossible d\'ajouter le lit');
      throw err;
    }
  };

  const updateBed = async (id: string, updates: Partial<Bed>) => {
    try {
      const updatedBed = await apiService.beds.update(id, updates);
      setBeds(prev => prev.map(b => b.id === id ? { ...b, ...updatedBed } : b));
    } catch (err: any) {
      showError('Erreur', err.message || 'Impossible de mettre à jour le lit');
      throw err;
    }
  };

  const deleteBed = async (id: string) => {
    try {
      await apiService.beds.delete(id);
      setBeds(prev => prev.filter(b => b.id !== id));
      success('Lit supprimé');
    } catch (err: any) {
      showError('Erreur', err.message || 'Impossible de supprimer le lit');
      throw err;
    }
  };

  ''',
    content, flags=re.DOTALL
)

# 4. RefreshData
content = re.sub(
    r'const refreshData = async \(\) => \{.*?(?=\s+// Restore session from sessionStorage)',
    r'''const refreshData = async () => {
    setDataLoading(true);
    setDataError(null);
    try {
      try {
        const apiPatients = await apiService.patients.getAll();
        setPatientsState(apiPatients);
      } catch {
        setPatientsState([]);
      }

      try {
        const apiUsers = await apiService.users.getAll();
        setUsersState(apiUsers);
      } catch {
        setUsersState([]);
      }

      try {
        const apiDepartments = await apiService.departments.getAll();
        setDepartments(apiDepartments);
      } catch {
        setDepartments([]);
      }

      try {
        const apiBeds = await apiService.beds.getAll();
        setBedsState(apiBeds);
      } catch {
        setBedsState([]);
      }

      try {
        const apiInvoices = await apiService.invoices.getAll();
        setInvoicesState(apiInvoices);
      } catch {
        setInvoicesState([]);
      }

      try {
        const apiMeds = await apiService.medications.getAll();
        setMedications(apiMeds);
      } catch {
        setMedications([]);
      }

      try {
        const apiMovements = await apiService.medications.getMovements();
        setMedicationMovements(apiMovements);
      } catch {
        setMedicationMovements([]);
      }

      try {
        const apiSales = await apiService.pharmacySales.getAll();
        setPharmacySalesState(apiSales);
      } catch {
        setPharmacySalesState([]);
      }

      try {
        const apiAppointments = await apiService.appointments.getAll();
        setAppointments(apiAppointments);
      } catch {
        setAppointments([]);
      }

      try {
        const records = await apiService.medicalRecords.getAll();
        setMedicalRecords(records);
      } catch {
        setMedicalRecords([]);
      }

      try {
        const apiAdmissions = await apiService.admissions.getAll();
        setAdmissions(apiAdmissions);
      } catch {
        setAdmissions([]);
      }

      setLabOrders([]);
      setLabTests([]);
      setEmergencyVisits([]);
      setNotificationsState([]);
      setGenomicProfiles([]);
      setPgxInteractions([]);
      setBioSamples([]);
      setBiobankFreezers([]);
      setClinicalTrials([]);
      setQuickInvoiceItems([]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de chargement';
      setDataError(message);
      showError('Erreur de chargement', message);
    } finally {
      setDataLoading(false);
    }
  };''',
    content, flags=re.DOTALL
)

with open('src/context/AppContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Script completed.")
