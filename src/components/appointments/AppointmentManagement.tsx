import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Calendar, Clock, User, CreditCard as Edit, Trash2, Download, FileSpreadsheet, Printer } from 'lucide-react';
import AppointmentForm from './AppointmentForm';
import { printDocument, generateDocumentHeader, generateDocumentFooter, exportToExcel } from '../../utils/exportUtils';
import ConfirmDialog from '../common/ConfirmDialog';

const AppointmentManagement: React.FC = () => {
  const { appointments, patients, users, organizationSettings, deleteAppointment } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filteredAppointments = appointments.filter(apt => apt.date === filterDate);

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Patient inconnu';
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = users.find(u => u.id === doctorId);
    return doctor ? doctor.name : 'Medecin inconnu';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Programme';
      case 'in-progress': return 'En cours';
      case 'completed': return 'Termine';
      case 'cancelled': return 'Annule';
      default: return status;
    }
  };

  const handleNewAppointment = () => {
    setSelectedAppointment(null);
    setShowForm(true);
  };

  const handleEditAppointment = (appointmentId: string) => {
    setSelectedAppointment(appointmentId);
    setShowForm(true);
  };

  const handleDeleteConfirm = async (appointmentId: string) => {
    setDeleting(true);
    try {
      await deleteAppointment(appointmentId);
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting appointment:', err);
    } finally {
      setDeleting(false);
    }
  };

  const generateAppointmentsHTML = () => {
    const rows = filteredAppointments
      .sort((a, b) => a.time.localeCompare(b.time))
      .map(apt => `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">${apt.time}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${getPatientName(apt.patientId)}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">Dr. ${getDoctorName(apt.doctor || '')}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${apt.type}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${getStatusText(apt.status)}</td>
        </tr>
      `).join('');

    return `
      ${generateDocumentHeader(organizationSettings, 'report', `RDV-${Date.now().toString().slice(-8)}`)}
      <h2 style="margin: 20px 0; color: #333;">Rendez-vous du ${new Date(filterDate).toLocaleDateString('fr-FR')}</h2>
      <p style="color: #666; margin-bottom: 20px;">Total: ${filteredAppointments.length} rendez-vous</p>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: ${organizationSettings.primaryColor};">
            <th style="padding: 10px; color: white; text-align: left;">Heure</th>
            <th style="padding: 10px; color: white; text-align: left;">Patient</th>
            <th style="padding: 10px; color: white; text-align: left;">Medecin</th>
            <th style="padding: 10px; color: white; text-align: left;">Type</th>
            <th style="padding: 10px; color: white; text-align: left;">Statut</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      ${generateDocumentFooter(organizationSettings)}
    `;
  };

  const handleExportPDF = async () => {
    await printDocument(generateAppointmentsHTML(), organizationSettings, 'Rendez-vous');
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    const data = filteredAppointments.map(apt => ({
      heure: apt.time,
      patient: getPatientName(apt.patientId),
      medecin: getDoctorName(apt.doctor || ''),
      type: apt.type,
      statut: getStatusText(apt.status)
    }));
    exportToExcel(data, 'Rendez-vous', ['Heure', 'Patient', 'Medecin', 'Type', 'Statut']);
    setShowExportMenu(false);
  };

  const handlePrint = async () => {
    await printDocument(generateAppointmentsHTML(), organizationSettings, 'Rendez-vous');
    setShowExportMenu(false);
  };

  if (showForm) {
    return (
      <AppointmentForm
        appointmentId={selectedAppointment}
        onClose={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Rendez-vous</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exporter
            </button>

            {showExportMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                  <button
                    onClick={handleExportPDF}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Download className="w-4 h-4 text-red-500" />
                    <span>Exporter PDF</span>
                  </button>
                  <button
                    onClick={handleExportExcel}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-green-500" />
                    <span>Exporter Excel</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Printer className="w-4 h-4 text-blue-500" />
                    <span>Imprimer</span>
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleNewAppointment}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau RDV</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-sm text-gray-600">
              {filteredAppointments.length} rendez-vous pour cette date
            </span>
          </div>
        </div>

        <div className="p-6">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun rendez-vous pour cette date</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {appointment.time}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">
                            {getPatientName(appointment.patientId)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          avec {getDoctorName(appointment.doctor || '')}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                          {getStatusText(appointment.status)}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditAppointment(appointment.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(appointment.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {appointment.type}
                        </span>
                      </div>
                      {appointment.notes && (
                        <p className="text-sm text-gray-600 italic">
                          {appointment.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!showDeleteConfirm}
        title="Supprimer le rendez-vous"
        message="Etes-vous sur de vouloir supprimer ce rendez-vous? Cette action est irreversible."
        confirmLabel={deleting ? 'Suppression...' : 'Supprimer'}
        onConfirm={() => showDeleteConfirm && handleDeleteConfirm(showDeleteConfirm)}
        onCancel={() => setShowDeleteConfirm(null)}
        variant="danger"
        loading={deleting}
      />
    </div>
  );
};

export default AppointmentManagement;
