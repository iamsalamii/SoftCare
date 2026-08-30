import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Save, Loader2 } from 'lucide-react';

interface AppointmentFormProps {
  appointmentId?: string | null;
  onClose: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ appointmentId, onClose }) => {
  const { appointments, addAppointment, updateAppointment, patients, users } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    doctor: '',
    date: '',
    time: '',
    type: 'consultation' as 'consultation' | 'follow-up' | 'emergency' | 'surgery' | 'checkup',
    status: 'scheduled' as 'scheduled' | 'in-progress' | 'completed' | 'cancelled',
    notes: '',
    reason: ''
  });

  const doctors = users.filter(user => user.role === 'doctor');

  useEffect(() => {
    if (appointmentId) {
      const appointment = appointments.find(a => a.id === appointmentId);
      if (appointment) {
        setFormData({
          patientId: appointment.patientId,
          doctor: appointment.doctor || '',
          date: appointment.date,
          time: appointment.time,
          type: appointment.type,
          status: appointment.status,
          notes: appointment.notes || '',
          reason: appointment.reason || ''
        });
      }
    }
  }, [appointmentId, appointments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      } else {
        await addAppointment(appointmentData);
      }

      onClose();
    } catch (err) {
      console.error('Error saving appointment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {appointmentId ? 'Modifier Rendez-vous' : 'Nouveau Rendez-vous'}
        </h1>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient *
              </label>
              <select
                required
                value={formData.patientId}
                onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner un patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medecin *
              </label>
              <select
                required
                value={formData.doctor}
                onChange={(e) => setFormData({...formData, doctor: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selectionner un medecin</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.department}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heure *
              </label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="consultation">Consultation</option>
                <option value="follow-up">Suivi</option>
                <option value="emergency">Urgence</option>
                <option value="surgery">Chirurgie</option>
                <option value="checkup">Bilan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="scheduled">Programme</option>
                <option value="in-progress">En cours</option>
                <option value="completed">Termine</option>
                <option value="cancelled">Annule</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motif
            </label>
            <input
              type="text"
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Motif de la consultation..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Notes additionnelles..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{loading ? 'Enregistrement...' : (appointmentId ? 'Modifier' : 'Creer')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;