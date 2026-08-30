export interface OfflineVitalSign {
  id: string;
  patientId: string;
  patientName: string;
  temperature: number;
  bloodPressureSys: number;
  bloodPressureDia: number;
  heartRate: number;
  spO2: number;
  glycemia?: number;
  painEva?: number;
  notes?: string;
  recordedAt: string;
  recordedBy: string;
  synced: boolean;
}

const OFFLINE_VITALS_KEY = 'softcare_offline_vitals';

export const offlineStorageService = {
  getPendingVitals(): OfflineVitalSign[] {
    try {
      const data = localStorage.getItem(OFFLINE_VITALS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveVitalSign(vital: Omit<OfflineVitalSign, 'id' | 'recordedAt' | 'synced'>): OfflineVitalSign {
    const vitals = this.getPendingVitals();
    const newVital: OfflineVitalSign = {
      ...vital,
      id: `VITAL-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      recordedAt: new Date().toISOString(),
      synced: false
    };
    vitals.push(newVital);
    localStorage.setItem(OFFLINE_VITALS_KEY, JSON.stringify(vitals));
    return newVital;
  },

  markAllSynced(): void {
    localStorage.removeItem(OFFLINE_VITALS_KEY);
  },

  removeVital(id: string): void {
    const vitals = this.getPendingVitals().filter(v => v.id !== id);
    localStorage.setItem(OFFLINE_VITALS_KEY, JSON.stringify(vitals));
  }
};
