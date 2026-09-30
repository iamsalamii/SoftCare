import re

with open('src/context/AppContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace addEmergencyVisit
old_addEmergencyVisit = r'const addEmergencyVisit = async \(visit: Partial<EmergencyVisit>\) => \{.*?\s+success\([^\)]+\);\s*\};'
new_addEmergencyVisit = """const addEmergencyVisit = async (visit: Partial<EmergencyVisit>) => {
    try {
      const created = await apiService.emergencies.create(visit);
      setEmergencyVisits(prev => [created, ...prev]);
      success('Admission urgences enregistrée');
    } catch (error: any) {
      showError(error);
    }
  };"""
content = re.sub(old_addEmergencyVisit, new_addEmergencyVisit, content, flags=re.DOTALL)

# Replace updateEmergencyVisit
old_updateEmergencyVisit = r'const updateEmergencyVisit = async \(id: string, updates: Partial<EmergencyVisit>\) => \{.*?\s+success\([^\)]+\);\s*\};'
new_updateEmergencyVisit = """const updateEmergencyVisit = async (id: string, updates: Partial<EmergencyVisit>) => {
    try {
      const updated = await apiService.emergencies.update(id, updates);
      setEmergencyVisits(prev => prev.map(p => p.id === id ? updated : p));
      success('Dossier urgences mis à jour');
    } catch (error: any) {
      showError(error);
    }
  };"""
content = re.sub(old_updateEmergencyVisit, new_updateEmergencyVisit, content, flags=re.DOTALL)

# Replace addLabOrder
old_addLabOrder = r'const addLabOrder = async \(order: Partial<LabOrder>\) => \{.*?\s+success\([^\)]+\);\s*\};'
new_addLabOrder = """const addLabOrder = async (order: Partial<LabOrder>) => {
    try {
      const created = await apiService.lab.createOrder(order);
      setLabOrdersState(prev => [created, ...prev]);
      success('Prescription laboratoire créée');
    } catch (error: any) {
      showError(error);
    }
  };"""
content = re.sub(old_addLabOrder, new_addLabOrder, content, flags=re.DOTALL)

# Replace updateLabOrder (if it exists)
old_updateLabOrder = r'const updateLabOrder = async \(id: string, updates: Partial<LabOrder>\) => \{.*?\s+success\([^\)]+\);\s*\};'
new_updateLabOrder = """const updateLabOrder = async (id: string, updates: Partial<LabOrder>) => {
    try {
      const updated = await apiService.lab.updateOrder(id, updates);
      setLabOrdersState(prev => prev.map(p => p.id === id ? updated : p));
      success('Statut mis à jour');
    } catch (error: any) {
      showError(error);
    }
  };"""
content = re.sub(old_updateLabOrder, new_updateLabOrder, content, flags=re.DOTALL)


# Also add to refreshData
refresh_additions = """
      try {
        const apiEmergencies = await apiService.emergencies.getAll();
        setEmergencyVisits(apiEmergencies);
      } catch {
        setEmergencyVisits([]);
      }

      try {
        const apiLabTests = await apiService.lab.getTests();
        setLabTestsState(apiLabTests);
      } catch {
        setLabTestsState([]);
      }

      try {
        const apiLabOrders = await apiService.lab.getOrders();
        setLabOrdersState(apiLabOrders);
      } catch {
        setLabOrdersState([]);
      }
"""
pattern = r'(\s*\} catch \(error: any\) \{\s*setDataError)'
content = re.sub(pattern, refresh_additions + r'\1', content, count=1)

with open('src/context/AppContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
