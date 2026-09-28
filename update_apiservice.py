import re

with open('src/services/apiService.ts', 'r', encoding='utf-8') as f:
    content = f.read()

nursing_api = """
  // === NURSING (Soins) ===
  vitals: {
    getAll: () => apiClient.get<any[]>('/nursing/vitals'),
    getByPatient: (patientId: string) => apiClient.get<any[]>(`/nursing/vitals/patient/${patientId}`),
    create: (vital: any) => apiClient.post<any>('/nursing/vitals', vital),
    update: (id: string, vital: any) => apiClient.put<any>(`/nursing/vitals/${id}`, vital),
    delete: (id: string) => apiClient.delete(`/nursing/vitals/${id}`),
  },
  carePlans: {
    getAll: () => apiClient.get<any[]>('/nursing/care-plans'),
    getByPatient: (patientId: string) => apiClient.get<any[]>(`/nursing/care-plans/patient/${patientId}`),
    create: (carePlan: any) => apiClient.post<any>('/nursing/care-plans', carePlan),
    update: (id: string, carePlan: any) => apiClient.put<any>(`/nursing/care-plans/${id}`, carePlan),
    delete: (id: string) => apiClient.delete(`/nursing/care-plans/${id}`),
  },
  nursingNotes: {
    getAll: () => apiClient.get<any[]>('/nursing/notes'),
    getByPatient: (patientId: string) => apiClient.get<any[]>(`/nursing/notes/patient/${patientId}`),
    create: (note: any) => apiClient.post<any>('/nursing/notes', note),
    update: (id: string, note: any) => apiClient.put<any>(`/nursing/notes/${id}`, note),
    delete: (id: string) => apiClient.delete(`/nursing/notes/${id}`),
  },
"""

content = content.replace("export const apiService = {", "export const apiService = {\n" + nursing_api)

with open('src/services/apiService.ts', 'w', encoding='utf-8') as f:
    f.write(content)
