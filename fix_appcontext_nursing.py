import re

with open('src/context/AppContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Instead of exact replace, we can use regex to replace the function bodies

content = re.sub(
    r'const addVitalRecord = async \(record: any\) => \{.*?\s+success\([^\)]+\);\s*\};',
    r'''const addVitalRecord = async (record: any) => {
    try {
      if (!record.nurseName) record.nurseName = currentUser?.name || 'Infirmier(e)';
      const created = await apiService.vitals.create(record);
      setVitalsList(prev => [created, ...prev]);
      success('Constantes enregistrées');
    } catch (error: any) {
      showError(error);
    }
  };''',
    content,
    flags=re.DOTALL
)

content = re.sub(
    r'const addCarePlan = async \(plan: any\) => \{.*?\s+success\([^\)]+\);\s*\};',
    r'''const addCarePlan = async (plan: any) => {
    try {
      const created = await apiService.carePlans.create(plan);
      setCarePlans(prev => [created, ...prev]);
      success('Plan de soins créé');
    } catch (error: any) {
      showError(error);
    }
  };''',
    content,
    flags=re.DOTALL
)

content = re.sub(
    r'const updateCarePlan = async \(id: string, updates: any\) => \{.*?\s+success\([^\)]+\);\s*\};',
    r'''const updateCarePlan = async (id: string, updates: any) => {
    try {
      const updated = await apiService.carePlans.update(id, updates);
      setCarePlans(prev => prev.map(p => p.id === id ? updated : p));
      success('Plan de soins mis à jour');
    } catch (error: any) {
      showError(error);
    }
  };''',
    content,
    flags=re.DOTALL
)

content = re.sub(
    r'const addNursingNote = async \(note: any\) => \{.*?\s+success\([^\)]+\);\s*\};',
    r'''const addNursingNote = async (note: any) => {
    try {
      if (!note.nurseName) note.nurseName = currentUser?.name || 'Infirmier(e)';
      const created = await apiService.nursingNotes.create(note);
      setNursingNotes(prev => [created, ...prev]);
      success('Transmission enregistrée');
    } catch (error: any) {
      showError(error);
    }
  };''',
    content,
    flags=re.DOTALL
)

with open('src/context/AppContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
