import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, AlertTriangle, Clock, User, Truck, ArrowRight, Download, FileSpreadsheet, Printer } from 'lucide-react';
import { EmergencyVisit } from '../../types';
import { printDocument, generateDocumentHeader, generateDocumentFooter, exportToExcel } from '../../utils/exportUtils';

const EmergencyModule: React.FC = () => {
  const { emergencyVisits, patients, users, beds, addEmergencyVisit, updateEmergencyVisit, organizationSettings } = useApp();
  const [filterTriage, setFilterTriage] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNewVisit, setShowNewVisit] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<EmergencyVisit | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Inconnu';
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = users.find(u => u.id === doctorId);
    return doctor?.name || 'Non assigne';
  };

  const getTriageColor = (level: number) => {
    const colors = [
      'bg-red-500 text-white',
      'bg-orange-500 text-white',
      'bg-yellow-500 text-white',
      'bg-green-500 text-white',
      'bg-blue-500 text-white'
    ];
    return colors[level - 1] || 'bg-gray-500';
  };

  const getTriageLabel = (level: number) => {
    const labels = ['Critique', 'Emergent', 'Urgent', 'Moins urgent', 'Non urgent'];
    return labels[level - 1] || 'N/A';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      waiting: 'bg-yellow-100 text-yellow-800',
      'in-treatment': 'bg-blue-100 text-blue-800',
      admitted: 'bg-purple-100 text-purple-800',
      discharged: 'bg-green-100 text-green-800',
      transferred: 'bg-gray-100 text-gray-800',
      'left-ama': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      waiting: 'En attente',
      'in-treatment': 'En traitement',
      admitted: 'Hospitalise',
      discharged: 'Sorti',
      transferred: 'Transfere',
      'left-ama': 'Parti'
    };
    return texts[status] || status;
  };

  const filteredVisits = emergencyVisits.filter(visit => {
    const matchesTriage = filterTriage === 'all' || visit.triageLevel.toString() === filterTriage;
    const matchesStatus = filterStatus === 'all' || visit.status === filterStatus;
    return matchesTriage && matchesStatus;
  });

  const stats = {
    total: emergencyVisits.length,
    waiting: emergencyVisits.filter(v => v.status === 'waiting').length,
    critical: emergencyVisits.filter(v => v.triageLevel <= 2).length,
    avgWaitTime: '45 min'
  };

  const generateEmergencyHTML = () => {
    const rows = filteredVisits.map(v => `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;">${getPatientName(v.patientId)}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${getTriageLabel(v.triageLevel)} (${v.triageLevel})</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${new Date(v.arrivalTime).toLocaleString('fr-FR')}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${v.chiefComplaint}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${getStatusText(v.status)}</td>
      </tr>
    `).join('');

    return `
      ${generateDocumentHeader(organizationSettings, 'report', `URG-${Date.now().toString().slice(-8)}`)}
      <h2 style="margin: 20px 0; color: #333;">Passages aux Urgences</h2>
      <p style="color: #666; margin-bottom: 20px;">Total: ${stats.total} | En attente: ${stats.waiting} | Critiques: ${stats.critical}</p>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: ${organizationSettings.primaryColor};">
            <th style="padding: 10px; color: white; text-align: left;">Patient</th>
            <th style="padding: 10px; color: white; text-align: left;">Triage</th>
            <th style="padding: 10px; color: white; text-align: left;">Arrivee</th>
            <th style="padding: 10px; color: white; text-align: left;">Motif</th>
            <th style="padding: 10px; color: white; text-align: left;">Statut</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      ${generateDocumentFooter(organizationSettings)}
    `;
  };

  const handleExportPDF = async () => {
    await printDocument(generateEmergencyHTML(), organizationSettings, 'Urgences');
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    const data = filteredVisits.map(v => ({
      patient: getPatientName(v.patientId),
      triage: `${getTriageLabel(v.triageLevel)} (${v.triageLevel})`,
      arrivee: new Date(v.arrivalTime).toLocaleString('fr-FR'),
      motif: v.chiefComplaint,
      statut: getStatusText(v.status)
    }));
    exportToExcel(data, 'Urgences', ['Patient', 'Triage', 'Arrivee', 'Motif', 'Statut']);
    setShowExportMenu(false);
  };

  const handlePrint = async () => {
    await printDocument(generateEmergencyHTML(), organizationSettings, 'Urgences');
    setShowExportMenu(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Service des Urgences</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2"
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
            onClick={() => setShowNewVisit(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nouvelle admission
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">En cours aujourd'hui</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-200 p-4">
          <p className="text-sm text-yellow-600">En attente</p>
          <p className="text-3xl font-bold text-yellow-700">{stats.waiting}</p>
        </div>
        <div className="bg-red-50 rounded-lg shadow-sm border border-red-200 p-4">
          <p className="text-sm text-red-600">Cas critiques</p>
          <p className="text-3xl font-bold text-red-700">{stats.critical}</p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-4">
          <p className="text-sm text-blue-600">Temps moyen attente</p>
          <p className="text-3xl font-bold text-blue-700">{stats.avgWaitTime}</p>
        </div>
      </div>

      {/* Triage Board */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Échelle de triage (Manchot)</h2>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map(level => {
            const count = emergencyVisits.filter(v => v.triageLevel === level && v.status === 'waiting').length;
            return (
              <div
                key={level}
                className={`${getTriageColor(level)} rounded-lg p-4 text-center cursor-pointer hover:opacity-80 transition-opacity`}
                onClick={() => setFilterTriage(filterTriage === level.toString() ? 'all' : level.toString())}
              >
                <p className="text-4xl font-bold">{level}</p>
                <p className="text-sm">{getTriageLabel(level)}</p>
                <p className="mt-2 text-lg">{count} patient(s)</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tous les statuts</option>
          <option value="waiting">En attente</option>
          <option value="in-treatment">En traitement</option>
          <option value="admitted">Hospitalisé</option>
          <option value="discharged">Sorti</option>
        </select>
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredVisits.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune visite aux urgences</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredVisits
              .sort((a, b) => a.triageLevel - b.triageLevel)
              .map((visit) => {
                const patient = patients.find(p => p.id === visit.patientId);
                return (
                  <div
                    key={visit.id}
                    className={`p-6 hover:bg-gray-50 cursor-pointer border-l-4 ${
                      visit.triageLevel === 1 ? 'border-red-500' :
                      visit.triageLevel === 2 ? 'border-orange-500' :
                      visit.triageLevel === 3 ? 'border-yellow-500' :
                      visit.triageLevel === 4 ? 'border-green-500' : 'border-blue-500'
                    }`}
                    onClick={() => setSelectedVisit(visit)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${getTriageColor(visit.triageLevel)}`}>
                            {visit.triageLevel}
                          </span>
                          <span className="font-medium text-gray-900">{getPatientName(visit.patientId)}</span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(visit.status)}`}>
                            {getStatusText(visit.status)}
                          </span>
                        </div>

                        <p className="text-gray-700 mb-2">{visit.chiefComplaint}</p>

                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(visit.arrivalTime).toLocaleString('fr-FR')}</span>
                          </div>
                          {visit.assignedDoctorId && (
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>Dr. {getDoctorName(visit.assignedDoctorId)}</span>
                            </div>
                          )}
                          {visit.arrivalMode !== 'walking' && (
                            <div className="flex items-center gap-1">
                              <Truck className="w-4 h-4" />
                              <span>{visit.arrivalMode}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center gap-1"
                        >
                          <ArrowRight className="w-4 h-4" />
                          Prendre en charge
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* New Visit Modal */}
      {showNewVisit && <NewEmergencyVisit onClose={() => setShowNewVisit(false)} />}

      {/* Visit Details Modal */}
      {selectedVisit && (
        <EmergencyVisitDetails
          visit={selectedVisit}
          onClose={() => setSelectedVisit(null)}
        />
      )}
    </div>
  );
};

// Nouvelle visite
const NewEmergencyVisit: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { patients, users, addEmergencyVisit } = useApp();
  const [isNewPatient, setIsNewPatient] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [formData, setFormData] = useState({
    arrivalMode: 'walking',
    chiefComplaint: '',
    triageLevel: 3
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const visit: EmergencyVisit = {
      id: Date.now().toString(),
      patientId: selectedPatient || Date.now().toString(),
      arrivalTime: new Date().toISOString(),
      arrivalMode: formData.arrivalMode as any,
      chiefComplaint: formData.chiefComplaint,
      triageLevel: formData.triageLevel as 1 | 2 | 3 | 4 | 5,
      triageTime: new Date().toISOString(),
      triageBy: '2',
      status: 'waiting'
    };

    addEmergencyVisit(visit);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Nouvelle admission urgences</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <Plus className="w-6 h-6 rotate-45" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
            {isNewPatient ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">Nouveau patient non enregistré</p>
                <button
                  type="button"
                  onClick={() => setIsNewPatient(false)}
                  className="text-sm text-blue-600 hover:underline mt-1"
                >
                  Rechercher un patient existant
                </button>
              </div>
            ) : (
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner un patient</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mode d'arrivée</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'walking', label: 'Marche' },
                { value: 'ambulance', label: 'Ambulance' },
                { value: 'helicopter', label: 'Hélicoptère' },
                { value: 'other', label: 'Autre' }
              ].map(mode => (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, arrivalMode: mode.value }))}
                  className={`px-3 py-2 rounded-lg border ${
                    formData.arrivalMode === mode.value
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-gray-300'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Motif de recours</label>
            <textarea
              value={formData.chiefComplaint}
              onChange={(e) => setFormData(prev => ({ ...prev, chiefComplaint: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Décrivez le motif de la visite..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Niveau de triage</label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map(level => {
                const colors = ['bg-red-500 text-white', 'bg-orange-500 text-white', 'bg-yellow-500 text-white', 'bg-green-500 text-white', 'bg-blue-500 text-white'];
                const labels = ['Critique', 'Émergent', 'Urgent', 'Moins urgent', 'Non urgent'];
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, triageLevel: level as any }))}
                    className={`p-3 rounded-lg text-center ${
                      formData.triageLevel === level ? colors[level - 1] + ' ring-2 ring-offset-2 ring-blue-500' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <p className="text-xl font-bold">{level}</p>
                    <p className="text-xs">{labels[level - 1]}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
              Annuler
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Admettre aux urgences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Détails visite
const EmergencyVisitDetails: React.FC<{ visit: EmergencyVisit; onClose: () => void }> = ({ visit, onClose }) => {
  const { patients, users } = useApp();
  const patient = patients.find(p => p.id === visit.patientId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Détails du passage</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <Plus className="w-6 h-6 rotate-45" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Patient</p>
            <p className="font-medium">{patient?.firstName} {patient?.lastName}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Arrivée</p>
              <p className="font-medium">{new Date(visit.arrivalTime).toLocaleString('fr-FR')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Mode</p>
              <p className="font-medium capitalize">{visit.arrivalMode}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Motif</p>
            <p className="font-medium">{visit.chiefComplaint}</p>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyModule;
