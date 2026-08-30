import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Save, Plus, Trash2, Upload } from 'lucide-react';
import { MedicalRecord, Prescription } from '../../types';

interface MedicalRecordFormProps {
  patientId: string;
  recordId?: string;
  onClose: () => void;
}

const MedicalRecordForm: React.FC<MedicalRecordFormProps> = ({ patientId, recordId, onClose }) => {
  const { patients, users, medications, addMedicalRecord } = useApp();
  const [loading, setLoading] = useState(false);

  const patient = patients.find(p => p.id === patientId);

  const [formData, setFormData] = useState<Partial<MedicalRecord>>({
    patientId,
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
    medicationId: '',
    medicationName: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    status: 'pending'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const record: MedicalRecord = {
      id: Date.now().toString(),
      patientId: formData.patientId!,
      doctorId: '1',
      date: formData.date!,
      type: formData.type as any,
      title: formData.title!,
      description: formData.description!,
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
      symptoms: prev.symptoms?.filter((_, i) => i !== index)
    }));
  };

  const handleMedicationSelect = (medId: string) => {
    const med = medications.find(m => m.id === medId);
    if (med) {
      setNewPrescription(prev => ({
        ...prev,
        medicationId: medId,
        medicationName: med.name,
        dosage: med.description.split(' ')[0] || ''
      }));
    }
  };

  const addPrescription = () => {
    if (newPrescription.medicationId && newPrescription.dosage) {
      const prescription: Prescription = {
        id: Date.now().toString(),
        medicationId: newPrescription.medicationId,
        medicationName: newPrescription.medicationName!,
        dosage: newPrescription.dosage!,
        frequency: newPrescription.frequency || '',
        duration: newPrescription.duration || '',
        instructions: newPrescription.instructions || '',
        status: 'pending'
      };
      setFormData(prev => ({
        ...prev,
        prescriptions: [...(prev.prescriptions || []), prescription]
      }));
      setNewPrescription({
        medicationId: '',
        medicationName: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        status: 'pending'
      });
    }
  };

  const removePrescription = (id: string) => {
    setFormData(prev => ({
      ...prev,
      prescriptions: prev.prescriptions?.filter(p => p.id !== id)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Nouveau Dossier Médical</h2>
            {patient && (
              <p className="text-sm text-gray-500">
                Patient: {patient.firstName} {patient.lastName}
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="consultation">Consultation</option>
                <option value="diagnosis">Diagnostic</option>
                <option value="treatment">Traitement</option>
                <option value="surgery">Chirurgie</option>
                <option value="emergency">Urgence</option>
                <option value="follow-up">Suivi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Consultation cardiologie"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Décrivez le motif de consultation, l'examen clinique..."
              required
            />
          </div>

          {/* Symptômes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Symptômes</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSymptom}
                onChange={(e) => setNewSymptom(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSymptom())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ajouter un symptôme"
              />
              <button
                type="button"
                onClick={addSymptom}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.symptoms?.map((symptom, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                >
                  {symptom}
                  <button type="button" onClick={() => removeSymptom(index)}>
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Diagnostic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diagnostic</label>
            <textarea
              value={formData.diagnosis}
              onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Diagnostic établi"
            />
          </div>

          {/* Traitement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Traitement</label>
            <textarea
              value={formData.treatment}
              onChange={(e) => setFormData(prev => ({ ...prev, treatment: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Plan de traitement recommandé"
            />
          </div>

          {/* Prescriptions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prescriptions</label>
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Médicament</label>
                  <select
                    value={newPrescription.medicationId}
                    onChange={(e) => handleMedicationSelect(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner</option>
                    {medications.map(med => (
                      <option key={med.id} value={med.id}>{med.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Dosage</label>
                  <input
                    type="text"
                    value={newPrescription.dosage}
                    onChange={(e) => setNewPrescription(prev => ({ ...prev, dosage: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="500mg"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Fréquence</label>
                  <select
                    value={newPrescription.frequency}
                    onChange={(e) => setNewPrescription(prev => ({ ...prev, frequency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner</option>
                    <option value="1x/jour">1 fois par jour</option>
                    <option value="2x/jour">2 fois par jour</option>
                    <option value="3x/jour">3 fois par jour</option>
                    <option value="4x/jour">4 fois par jour</option>
                    <option value="si besoin">Si besoin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Durée</label>
                  <input
                    type="text"
                    value={newPrescription.duration}
                    onChange={(e) => setNewPrescription(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="7 jours"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Instructions</label>
                  <input
                    type="text"
                    value={newPrescription.instructions}
                    onChange={(e) => setNewPrescription(prev => ({ ...prev, instructions: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="À prendre au repas"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addPrescription}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </button>
                </div>
              </div>

              {formData.prescriptions && formData.prescriptions.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.prescriptions.map((presc) => (
                    <div
                      key={presc.id}
                      className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
                    >
                      <div>
                        <span className="font-medium text-gray-900">{presc.medicationName}</span>
                        <span className="text-sm text-gray-600 ml-2">
                          {presc.dosage} - {presc.frequency} - {presc.duration}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePrescription(presc.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Suivi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Suivi</label>
            <input
              type="text"
              value={formData.followUp}
              onChange={(e) => setFormData(prev => ({ ...prev, followUp: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Contrôle dans 15 jours"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes additionnelles</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Notes privées (non visibles par le patient)"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicalRecordForm;
