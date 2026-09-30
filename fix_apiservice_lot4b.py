import re

with open('src/services/apiService.ts', 'r', encoding='utf-8') as f:
    content = f.read()

new_endpoints = """
  // === EMERGENCIES ===
  emergencies: {
    getAll: () => apiClient.get<any[]>('/emergency/visits'),
    getById: (id: string) => apiClient.get<any>(`/emergency/visits/${id}`),
    create: (visit: any) => apiClient.post<any>('/emergency/visits', visit),
    update: (id: string, visit: any) => apiClient.put<any>(`/emergency/visits/${id}`, visit),
    delete: (id: string) => apiClient.delete(`/emergency/visits/${id}`),
  },

  // === LAB ===
  lab: {
    getTests: () => apiClient.get<any[]>('/lab/tests'),
    createTest: (test: any) => apiClient.post<any>('/lab/tests', test),
    updateTest: (id: string, test: any) => apiClient.put<any>(`/lab/tests/${id}`, test),
    deleteTest: (id: string) => apiClient.delete(`/lab/tests/${id}`),
    
    getOrders: () => apiClient.get<any[]>('/lab/orders'),
    createOrder: (order: any) => apiClient.post<any>('/lab/orders', order),
    updateOrder: (id: string, order: any) => apiClient.put<any>(`/lab/orders/${id}`, order),
    deleteOrder: (id: string) => apiClient.delete(`/lab/orders/${id}`),
  },
"""

content = content.replace("export const apiService = {", "export const apiService = {\n" + new_endpoints)

with open('src/services/apiService.ts', 'w', encoding='utf-8') as f:
    f.write(content)
