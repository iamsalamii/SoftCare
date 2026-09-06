import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { X, Calendar, Clock, User, Stethoscope, FileText, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import CustomSelect from '../common/CustomSelect';
import FormField from '../common/FormField';

interface AppointmentFormProps {
  appointmentId?: string | null;
  onClose: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ appointmentId, onClose }) => {
  const { appointments, addAppointment, updateAppointment, patients, users } = useApp();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    patientId: patients[0]?.id || '',
    doctor: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    type: 'consultation' as 'consultation' | 'follow-up' | 'emergency' | 'surgery' | 'checkup',
    status: 'scheduled' as 'scheduled' | 'in-progress' | 'completed' | 'cancelled',
    notes: '',
    reason: ''
  });

  const doctors = users.filter(user => user.role === 'doctor' || user.role === 'surgeon' || user.role === 'admin');

  const patientOptions = patients.map(p => ({
    value: p.id,
    label: `${p.firstName} ${p.lastName}`,
    badge: p.phone || undefined
  }));

  const doctorOptions = doctors.map(d => ({
    value: d.id,
    label: d.name,
    badge: d.specialization || (d.role === 'surgeon' ? 'Chirurgien' : 'Praticien')
  }));

  useEffect(() => {
    if (appointmentId) {
      const appointment = appointments.find(a => a.id === appointmentId);
      if (appointment) {
        setFormData({
          patientId: appointment.patientId || '',
          doctor: appointment.doctor || '',
          date: appointment.date || new Date().toISOString().split('T')[0],
          time: appointment.time || '09:00',
          type: appointment.type || 'consultation',
          status: appointment.status || 'scheduled',
          notes: appointment.notes || '',
          reason: appointment.reason || ''
        });
      }
    } else {
      if (doctors.length > 0 && !formData.doctor) {
        setFormData(prev => ({
          ...prev,
          doctor: doctors[0].id,
          patientId: patients[0]?.id || ''
        }));
      }
    }
  }, [appointmentId, appointments, doctors, patients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientId) {
      toast.error('Patient requis', 'Veuillez sélectionner un dossier patient.');
      return;
    }
    if (!formData.doctor) {
      toast.error('Médecin requis', 'Veuillez désigner le praticien référent.');
      return;
    }
    if (!formData.date || !formData.time) {
      toast.error('Créneau incomplet', 'Veuillez préciser la date et l\'horaire du rendez-vous.');
      return;
    }

    setLoading(true);
    try {
      const appointmentData = {
        patientId: formData.patientId,
        doctor: formData.doctor,
        date: formData.date,
        time: formData.time,
        type: formData.type,
        status: formData.status,
        notes: formData.notes,
        reason: formData.reason
      };

      if (appointmentId) {
        await updateAppointment(appointmentId, appointmentData);
        toast.success('Rendez-vous mis à jour', `Le rendez-vous a été actualisé avec succès.`);
      } else {
        await addAppointment(appointmentData);
        toast.success('Rendez-vous planifié', `Le rendez-vous du ${formData.date} à ${formData.time} est enregistré.`);
      }

      onClose();
    } catch (err) {
      console.error('Error saving appointment:', err);
      toast.error('Erreur', 'Une erreur est survenue lors de l\'enregistrement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-teal-600/20">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {appointmentId ? 'Modifier la Consultation' : 'Planifier un Rendez-vous'}
            </h1>
            <p className="text-xs text-gray-500">
              {appointmentId ? 'Mise à jour des détails du créneau médical' : 'Enregistrement dans l\'agenda partagé des praticiens'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-colors"
          title="Fermer"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Dossier Patient" required={true}>
              <CustomSelect
                options={patientOptions}
                value={formData.patientId}
                onChange={(val) => setFormData({ ...formData, patientId: val })}
                searchable={true}
                placeholder="Sélectionner le patient..."
              />
            </FormField>

            <FormField label="Praticien / Médecin" required={true}>
              <CustomSelect
                options={doctorOptions}
                value={formData.doctor}
                onChange={(val) => setFormData({ ...formData, doctor: val })}
                searchable={true}
                placeholder="Sélectionner le médecin..."
              />
            </FormField>

            <FormField label="Date de Consultation" required={true}>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </FormField>

            <FormField label="Horaire du Rendez-vous" required={true}>
              <div className="relative">
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </FormField>

            <FormField label="Type d'Acte / Motif" required={true}>
              <CustomSelect
                options={[
                  { value: 'consultation', label: 'Consultation Standard' },
                  { value: 'follow-up', label: 'Suivi Post-Opératoire / Contrôle' },
                  { value: 'emergency', label: 'Urgence Médicale' },
                  { value: 'surgery', label: 'Acte Chirurgical / Bloc' },
                  { value: 'checkup', label: 'Bilan de Santé / Checkup' }
                ]}
                value={formData.type}
                onChange={(val) => setFormData({ ...formData, type: val as any })}
              />
            </FormField>

            <FormField label="Statut du Créneau" required={true}>
              <CustomSelect
                options={[
                  { value: 'scheduled', label: 'Programmé (Confirmé)' },
                  { value: 'in-progress', label: 'En cours de consultation' },
                  { value: 'completed', label: 'Terminé / Effectué' },
                  { value: 'cancelled', label: 'Annulé' }
                ]}
                value={formData.status}
                onChange={(val) => setFormData({ ...formData, status: val as any })}
              />
            </FormField>
          </div>

          <FormField label="Motif Clinique Principal" value={formData.reason} showWordCount={true}>
            <input
              type="text"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              placeholder="Ex: Palpitations, contrôle tensionnel, renouvellement ordonnance..."
            />
          </FormField>

          <FormField label="Notes & Renseignements Complémentaires" value={formData.notes} showWordCount={true}>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              placeholder="Antécédents récents, consignes particulières pour le patient..."
            />
          </FormField>

          <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 via-teal-600 to-teal-700 hover:from-cyan-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/25 transition-all hover:scale-[1.01] flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{appointmentId ? 'Enregistrer les Modifications' : 'Confirmer le Rendez-vous'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;