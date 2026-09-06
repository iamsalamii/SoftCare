import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Save, Plus, Trash2, Stethoscope, User, Calendar, Pill, AlertTriangle, FileText } from 'lucide-react';
import { MedicalRecord, Prescription } from '../../types';
import CustomSelect from '../common/CustomSelect';
import FormField from '../common/FormField';

interface MedicalRecordFormProps {
  patientId?: string | null;
  recordId?: string;
  onClose: () => void;
}

export const MedicalRecordForm: React.FC<MedicalRecordFormProps> = ({ patientId, recordId, onClose }) => {
  const { patients, users, medications, addMedicalRecord, currentUser } = useApp();
  const [loading, setLoading] = useState(false);

  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    patientId || patients[0]?.id || ''
  );

  const patientOptions = patients.map(p => ({
    value: p.id,
    label: `${p.firstName} ${p.lastName} (${p.gender === 'male' ? 'H' : 'F'}, ${p.bloodType || 'O+'})`,
    badge: p.socialSecurityNumber ? `SSN: ${p.socialSecurityNumber.slice(0, 10)}...` : undefined
  }));

  const doctorOptions = users
    .filter(u => u.role === 'doctor' || u.role === 'surgeon' || u.role === 'admin')
    .map(u => ({
      value: u.id,
      label: u.name,
      badge: u.specialization || u.role
    }));

  const typeOptions = [
    { value: 'consultation', label: 'Consultation Standard' },
    { value: 'diagnosis', label: 'Bilan Diagnostique' },
    { value: 'emergency', label: 'Visite d\'Urgence' },
    { value: 'follow-up', label: 'Consultation de Suivi' },
    { value: 'treatment', label: 'Protocole de Traitement' },
    { value: 'surgery', label: 'Compte-rendu Chirurgical' }
  ];

  const medicationOptions = medications.map(m => ({
    value: m.id,
    label: `${m.name} (${m.dosageForm || 'cp'})`,
    badge: `Stock: ${m.stock}`
  }));

  const [formData, setFormData] = useState<Partial<MedicalRecord>>({
    patientId: selectedPatientId,
    doctorId: currentUser?.id || users.find(u => u.role === 'doctor')?.id || '1',
    date: new Date().toISOString().split('T')[0],
    type: 'consultation',
    title: '',
    description: '',
    symptoms: [],
    diagnosis: '',
    treatment: '',
    prescriptions: [],
    attachments: [],
    followUp: '',
    notes: '',
    status: 'active'
  });

  const [newSymptom, setNewSymptom] = useState('');
  const [newPrescription, setNewPrescription] = useState<Partial<Prescription>>({
    medicationId: medications[0]?.id || '',
    medicationName: medications[0]?.name || '',
    dosage: '1 comprimé',
    frequency: '3 fois par jour',
    duration: '7 jours',
    instructions: 'À prendre au milieu des repas',
    status: 'pending'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) return;

    setLoading(true);

    const record: MedicalRecord = {
      id: `REC-${Date.now()}`,
      patientId: selectedPatientId,
      doctorId: formData.doctorId || '1',
      date: formData.date || new Date().toISOString().split('T')[0],
      type: (formData.type as any) || 'consultation',
      title: formData.title || 'Consultation générale',
      description: formData.description || '',
      symptoms: formData.symptoms || [],
      diagnosis: formData.diagnosis || '',
      treatment: formData.treatment || '',
      prescriptions: formData.prescriptions || [],
      attachments: formData.attachments || [],
      followUp: formData.followUp,
      notes: formData.notes,
      status: 'active'
    };

    addMedicalRecord(record);
    setLoading(false);
    onClose();
  };

  const addSymptom = () => {
    if (newSymptom.trim()) {
      setFormData(prev => ({
        ...prev,
        symptoms: [...(prev.symptoms || []), newSymptom.trim()]
      }));
      setNewSymptom('');
    }
  };

  const removeSymptom = (index: number) => {
    setFormData(prev => ({
      ...prev,
      symptoms: (prev.symptoms || []).filter((_, i) => i !== index)
    }));
  };

  const addPrescriptionItem = () => {
    const med = medications.find(m => m.id === newPrescription.medicationId);
    if (!med) return;

    const prescriptionItem: Prescription = {
      id: `PRESC-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      medicationId: med.id,
      medicationName: med.name,
      dosage: newPrescription.dosage || '1 dose',
      frequency: newPrescription.frequency || 'Matin et soir',
      duration: newPrescription.duration || '5 jours',
      instructions: newPrescription.instructions || '',
      status: 'active'
    };

    setFormData(prev => ({
      ...prev,
      prescriptions: [...(prev.prescriptions || []), prescriptionItem]
    }));
  };

  const removePrescription = (id: string) => {
    setFormData(prev => ({
      ...prev,
      prescriptions: (prev.prescriptions || []).filter(p => p.id !== id)
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nouvelle Consultation / Entrée Médicale</h1>
            <p className="text-xs text-gray-500">
              Dossier Médical Informatisé (DPI) & Ordonnance Électronique
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Patient & Praticien */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
            <User className="w-4 h-4 text-cyan-600" />
            <span>1. Sélection du Patient & Médecin Référent</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField label="Dossier Patient Concerne" required={true}>
              <CustomSelect
                options={patientOptions}
                value={selectedPatientId}
                onChange={(val) => {
                  setSelectedPatientId(val);
                  setFormData(prev => ({ ...prev, patientId: val }));
                }}
                searchable={true}
                placeholder="Rechercher un patient..."
              />
            </FormField>

            <FormField label="Médecin Praticien" required={true}>
              <CustomSelect
                options={doctorOptions.length > 0 ? doctorOptions : [{ value: '1', label: 'Dr. Marie Dubois' }]}
                value={formData.doctorId || '1'}
                onChange={(val) => setFormData(prev => ({ ...prev, doctorId: val }))}
                searchable={true}
              />
            </FormField>

            <FormField label="Date de la Consultation" required={true}>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </FormField>
          </div>
        </div>

        {/* Section 2: Motif, Symptômes & Diagnostic */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
            <Stethoscope className="w-4 h-4 text-teal-600" />
            <span>2. Examen Clinique, Symptômes & Diagnostic</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Type d'Entrée Médicale" required={true}>
              <CustomSelect
                options={typeOptions}
                value={formData.type || 'consultation'}
                onChange={(val) => setFormData(prev => ({ ...prev, type: val as any }))}
              />
            </FormField>

            <FormField
              label="Titre / Motif de Consultation"
              required={true}
              value={formData.title}
              showWordCount={true}
            >
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Consultation cardiologique de contrôle"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </FormField>

            <div className="sm:col-span-2">
              <FormField
                label="Observation & Anamnèse Clinique"
                required={true}
                value={formData.description}
                showWordCount={true}
              >
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description détaillée des symptômes, antécédents récents..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </FormField>
            </div>

            <FormField
              label="Conclusion Diagnostique"
              required={true}
              value={formData.diagnosis}
              showWordCount={true}
            >
              <input
                type="text"
                required
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                placeholder="Ex: Insuffisance coronaire stable sous bêta-bloquants"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </FormField>

            <FormField label="Plan de Traitement / Soins">
              <input
                type="text"
                value={formData.treatment}
                onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                placeholder="Ex: Réadaptation cardiaque + surveillance tensionnelle"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs"
              />
            </FormField>
          </div>

          {/* Symptom chips */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              Signes Fonctionnels / Symptômes
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSymptom}
                onChange={(e) => setNewSymptom(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSymptom(); } }}
                placeholder="Ajouter un symptôme (ex: Palpitations, Dyspnée d'effort)..."
                className="flex-1 px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs"
              />
              <button
                type="button"
                onClick={addSymptom}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl text-xs font-bold flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter</span>
              </button>
            </div>

            {formData.symptoms && formData.symptoms.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {formData.symptoms.map((s, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-50 text-cyan-800 border border-cyan-200 rounded-full text-xs font-semibold"
                  >
                    <span>{s}</span>
                    <button
                      type="button"
                      onClick={() => removeSymptom(idx)}
                      className="text-cyan-600 hover:text-cyan-900"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Prescription Électronique */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
            <Pill className="w-4 h-4 text-emerald-600" />
            <span>3. Prescription Médicamenteuse Électronique</span>
          </h2>

          <div className="p-4 bg-slate-50 rounded-2xl border border-gray-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">Médicament</label>
                <CustomSelect
                  options={medicationOptions.length > 0 ? medicationOptions : [{ value: '1', label: 'Plavix 75mg' }]}
                  value={newPrescription.medicationId || ''}
                  onChange={(val) => setNewPrescription({ ...newPrescription, medicationId: val })}
                  searchable={true}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">Posologie</label>
                <input
                  type="text"
                  value={newPrescription.dosage}
                  onChange={(e) => setNewPrescription({ ...newPrescription, dosage: e.target.value })}
                  placeholder="1 comprimé"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">Fréquence</label>
                <input
                  type="text"
                  value={newPrescription.frequency}
                  onChange={(e) => setNewPrescription({ ...newPrescription, frequency: e.target.value })}
                  placeholder="3 fois / jour"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">Durée</label>
                <input
                  type="text"
                  value={newPrescription.duration}
                  onChange={(e) => setNewPrescription({ ...newPrescription, duration: e.target.value })}
                  placeholder="7 jours"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={addPrescriptionItem}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter à l'ordonnance</span>
              </button>
            </div>
          </div>

          {formData.prescriptions && formData.prescriptions.length > 0 && (
            <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
              {formData.prescriptions.map((p) => (
                <div key={p.id} className="p-3.5 bg-white flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-gray-900 block">{p.medicationName}</span>
                    <span className="text-gray-500 text-[11px]">{p.dosage} • {p.frequency} • {p.duration}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removePrescription(p.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl text-xs font-bold hover:bg-gray-200 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-2xl text-xs font-bold shadow-lg shadow-teal-600/25 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Enregistrement...' : 'Enregistrer la Consultation'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicalRecordForm;
