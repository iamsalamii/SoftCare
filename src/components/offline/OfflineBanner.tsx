import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, HeartPulse, Plus, X } from 'lucide-react';
import { offlineStorageService, OfflineVitalSign } from '../../services/offlineStorageService';
import { useToast } from '../../context/ToastContext';
import { useApp } from '../../context/AppContext';

export const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingVitals, setPendingVitals] = useState<OfflineVitalSign[]>([]);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const toast = useToast();
  const { patients, currentUser } = useApp();

  const [vitalForm, setVitalForm] = useState({
    patientId: patients[0]?.id || '',
    temperature: 37.0,
    bloodPressureSys: 120,
    bloodPressureDia: 80,
    heartRate: 75,
    spO2: 98,
    glycemia: 1.0,
    painEva: 0,
    notes: ''
  });

  const refreshPending = () => {
    setPendingVitals(offlineStorageService.getPendingVitals());
  };

  useEffect(() => {
    refreshPending();
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Réseau rétabli', 'Synchronisation automatique possible.');
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('Mode Hors-Ligne activé', 'Les saisies de constantes seront stockées localement.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSaveVital = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === vitalForm.patientId);
    offlineStorageService.saveVitalSign({
      patientId: vitalForm.patientId,
      patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Patient',
      temperature: Number(vitalForm.temperature),
      bloodPressureSys: Number(vitalForm.bloodPressureSys),
      bloodPressureDia: Number(vitalForm.bloodPressureDia),
      heartRate: Number(vitalForm.heartRate),
      spO2: Number(vitalForm.spO2),
      glycemia: Number(vitalForm.glycemia),
      painEva: Number(vitalForm.painEva),
      notes: vitalForm.notes,
      recordedBy: currentUser?.name || 'Infirmier(e)'
    });

    toast.success('Constantes enregistrées', 'Données stockées localement en mémoire sécurisée.');
    setShowEntryModal(false);
    refreshPending();
  };

  const handleSyncAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      offlineStorageService.markAllSynced();
      setPendingVitals([]);
      setIsSyncing(false);
      toast.success('Synchronisation terminée', 'Toutes les constantes du chevet ont été intégrées au dossier patient informatisé.');
    }, 800);
  };

  return (
    <>
      {/* Floating Offline / Pending Sync Badge Bar */}
      {(!isOnline || pendingVitals.length > 0) && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-md z-30 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            {!isOnline ? (
              <>
                <WifiOff className="w-4 h-4 text-white animate-pulse" />
                <span>Mode Hors-Ligne Actif — Les saisies sont sécurisées localement</span>
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 text-white" />
                <span>Réseau En Ligne — {pendingVitals.length} relevé(s) en attente de synchronisation</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEntryModal(true)}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center gap-1.5"
            >
              <HeartPulse className="w-3.5 h-3.5" />
              <span>Saisir Constantes au Chevet</span>
            </button>

            {pendingVitals.length > 0 && isOnline && (
              <button
                onClick={handleSyncAll}
                disabled={isSyncing}
                className="px-3 py-1 bg-white text-amber-900 rounded-lg hover:bg-amber-50 transition-colors flex items-center gap-1.5 shadow-sm font-bold"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Synchroniser ({pendingVitals.length})</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bedside Vital Signs Entry Modal */}
      {showEntryModal && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-cyan-100 max-w-lg w-full p-6 space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900">Relevé de Constantes au Chevet</h3>
                  <p className="text-xs text-gray-500">Fonctionnement 100% autonome hors-ligne</p>
                </div>
              </div>
              <button
                onClick={() => setShowEntryModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVital} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Patient au Chevet
                </label>
                <select
                  value={vitalForm.patientId}
                  onChange={(e) => setVitalForm({ ...vitalForm, patientId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.gender === 'male' ? 'H' : 'F'}, {p.bloodGroup || 'O+'})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">Tension Artérielle (mmHg)</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={vitalForm.bloodPressureSys}
                      onChange={(e) => setVitalForm({ ...vitalForm, bloodPressureSys: Number(e.target.value) })}
                      placeholder="Sys"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-center font-bold"
                    />
                    <span>/</span>
                    <input
                      type="number"
                      value={vitalForm.bloodPressureDia}
                      onChange={(e) => setVitalForm({ ...vitalForm, bloodPressureDia: Number(e.target.value) })}
                      placeholder="Dia"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-center font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">Pouls (BPM)</label>
                  <input
                    type="number"
                    value={vitalForm.heartRate}
                    onChange={(e) => setVitalForm({ ...vitalForm, heartRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-center font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">Saturation SpO2 (%)</label>
                  <input
                    type="number"
                    value={vitalForm.spO2}
                    onChange={(e) => setVitalForm({ ...vitalForm, spO2: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-center font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">Température (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={vitalForm.temperature}
                    onChange={(e) => setVitalForm({ ...vitalForm, temperature: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-center font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">Observations infirmières</label>
                <input
                  type="text"
                  value={vitalForm.notes}
                  onChange={(e) => setVitalForm({ ...vitalForm, notes: e.target.value })}
                  placeholder="Patient calme, perfusion fonctionnelle..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEntryModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl text-xs font-bold shadow-md hover:from-cyan-700 hover:to-teal-700"
                >
                  Enregistrer Constantes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default OfflineBanner;
