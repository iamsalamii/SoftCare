import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, CreditCard as Edit, Eye, Trash2, Download, FileSpreadsheet, Printer, Loader2 } from 'lucide-react';
import PatientForm from './PatientForm';
import PatientDetails from './PatientDetails';
import { printDocument, generateDocumentHeader, generateDocumentFooter, exportToExcel } from '../../utils/exportUtils';
import ConfirmDialog from '../common/ConfirmDialog';

const PatientManagement: React.FC = () => {
  const { patients, organizationSettings, deletePatient } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'form' | 'details'>('list');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const handleNewPatient = () => {
    setSelectedPatient(null);
    setViewMode('form');
  };

  const handleEditPatient = (patientId: string) => {
    setSelectedPatient(patientId);
    setViewMode('form');
  };

  const handleViewPatient = (patientId: string) => {
    setSelectedPatient(patientId);
    setViewMode('details');
  };

  const generatePatientsHTML = () => {
    const rows = filteredPatients.map(p => `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;">${p.firstName} ${p.lastName}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${new Date(p.dateOfBirth).toLocaleDateString('fr-FR')}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${p.gender === 'male' ? 'M' : 'F'}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${p.phone}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${p.bloodType}</td>
      </tr>
    `).join('');

    return `
      ${generateDocumentHeader(organizationSettings, 'report', `PAT-${Date.now().toString().slice(-8)}`)}
      <h2 style="margin: 20px 0; color: #333;">Liste des Patients</h2>
      <p style="color: #666; margin-bottom: 20px;">Total: ${filteredPatients.length} patients</p>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: ${organizationSettings.primaryColor};">
            <th style="padding: 10px; color: white; text-align: left;">Nom</th>
            <th style="padding: 10px; color: white; text-align: left;">Date naissance</th>
            <th style="padding: 10px; color: white; text-align: left;">Sexe</th>
            <th style="padding: 10px; color: white; text-align: left;">Telephone</th>
            <th style="padding: 10px; color: white; text-align: left;">Groupe sanguin</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      ${generateDocumentFooter(organizationSettings)}
    `;
  };

  const handleExportPDF = async () => {
    await printDocument(generatePatientsHTML(), organizationSettings, 'Liste-Patients');
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    const data = filteredPatients.map(p => ({
      nom: `${p.firstName} ${p.lastName}`,
      date_naissance: new Date(p.dateOfBirth).toLocaleDateString('fr-FR'),
      sexe: p.gender === 'male' ? 'Masculin' : 'Feminin',
      telephone: p.phone,
      groupe_sanguin: p.bloodType
    }));
    exportToExcel(data, 'Liste-Patients', ['Nom', 'Date naissance', 'Sexe', 'Telephone', 'Groupe sanguin']);
    setShowExportMenu(false);
  };

  const handlePrint = async () => {
    await printDocument(generatePatientsHTML(), organizationSettings, 'Liste-Patients');
    setShowExportMenu(false);
  };

  const handleDeleteConfirm = async (patientId: string) => {
    setDeleting(true);
    try {
      await deletePatient(patientId);
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting patient:', err);
    } finally {
      setDeleting(false);
    }
  };

  if (viewMode === 'form') {
    return (
      <PatientForm
        patientId={selectedPatient}
        onClose={() => setViewMode('list')}
      />
    );
  }

  if (viewMode === 'details' && selectedPatient) {
    return (
      <PatientDetails
        patientId={selectedPatient}
        onClose={() => setViewMode('list')}
        onEdit={() => setViewMode('form')}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Patients</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Exporter</span>
            </button>

            {showExportMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden sc-dropdown-menu">
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
            onClick={handleNewPatient}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all duration-150 flex items-center space-x-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Patient</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 animate-card-enter">
        <div className="p-6 border-b border-gray-200">
          <div className="relative max-w-3xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un patient (nom, téléphone, n° sécu)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 w-full bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 text-sm shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de naissance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Groupe sanguin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50/80 transition-colors duration-150 animate-row-enter">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {patient.firstName} {patient.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{patient.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(patient.dateOfBirth).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      {patient.bloodType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewPatient(patient.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditPatient(patient.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(patient.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!showDeleteConfirm}
        title="Supprimer le patient"
        message="Etes-vous sur de vouloir supprimer ce patient? Cette action est irreversible."
        confirmLabel={deleting ? 'Suppression...' : 'Supprimer'}
        onConfirm={() => showDeleteConfirm && handleDeleteConfirm(showDeleteConfirm)}
        onCancel={() => setShowDeleteConfirm(null)}
        variant="danger"
        loading={deleting}
      />
    </div>
  );
};

export default PatientManagement;