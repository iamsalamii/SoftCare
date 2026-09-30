import re

# 1. Update apiService.ts
with open('src/services/apiService.ts', 'r', encoding='utf-8') as f:
    api_content = f.read()

surgery_endpoints = """
  // === SURGERY ===
  surgery: {
    getAll: () => apiClient.get<any[]>('/surgery'),
    getById: (id: string) => apiClient.get<any>(`/surgery/${id}`),
    create: (surgery: any) => apiClient.post<any>('/surgery', surgery),
    update: (id: string, surgery: any) => apiClient.put<any>(`/surgery/${id}`, surgery),
    delete: (id: string) => apiClient.delete(`/surgery/${id}`),
  },
"""
api_content = api_content.replace("export const apiService = {", "export const apiService = {\n" + surgery_endpoints)

with open('src/services/apiService.ts', 'w', encoding='utf-8') as f:
    f.write(api_content)

# 2. Update AppContext.tsx
with open('src/context/AppContext.tsx', 'r', encoding='utf-8') as f:
    app_content = f.read()

# Replace addSurgery
old_addSurgery = r'const addSurgery = async \(surgery: Partial<Surgery>\) => \{.*?\s+success\([^\)]+\);\s*\};'
new_addSurgery = """const addSurgery = async (surgery: Partial<Surgery>) => {
    try {
      const created = await apiService.surgery.create(surgery);
      setSurgeriesState(prev => [created, ...prev]);
      success('Intervention programmée');
    } catch (error: any) {
      showError(error);
    }
  };"""
app_content = re.sub(old_addSurgery, new_addSurgery, app_content, flags=re.DOTALL)

# Replace updateSurgery
old_updateSurgery = r'const updateSurgery = async \(id: string, updates: Partial<Surgery>\) => \{.*?\s+success\([^\)]+\);\s*\};'
new_updateSurgery = """const updateSurgery = async (id: string, updates: Partial<Surgery>) => {
    try {
      const updated = await apiService.surgery.update(id, updates);
      setSurgeriesState(prev => prev.map(p => p.id === id ? updated : p));
      success('Statut intervention mis à jour');
    } catch (error: any) {
      showError(error);
    }
  };"""
app_content = re.sub(old_updateSurgery, new_updateSurgery, app_content, flags=re.DOTALL)

# Add to refreshData
refresh_additions = """
      try {
        const apiSurgeries = await apiService.surgery.getAll();
        setSurgeriesState(apiSurgeries);
      } catch {
        setSurgeriesState([]);
      }
"""
pattern = r'(\s*\} catch \(error: any\) \{\s*setDataError)'
app_content = re.sub(pattern, refresh_additions + r'\1', app_content, count=1)

with open('src/context/AppContext.tsx', 'w', encoding='utf-8') as f:
    f.write(app_content)
