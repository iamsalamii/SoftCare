import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Calendar, Clock, User,Scissors, CheckCircle, AlertCircle, Activity, Download, FileSpreadsheet, Printer } from 'lucide-react';
import { Surgery } from '../../types';
import { printDocument, generateDocumentHeader, generateDocumentFooter, exportToExcel } from '../../utils/exportUtils';

const SurgeryModule: React.FC = () => {
  const { surgeries, operatingRooms, patients, users, addSurgery, updateSurgery, organizationSettings } = useApp();
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [showNewSurgery, setShowNewSurgery] = useState(false);
  const [selectedSurgery, setSelectedSurgery] = useState<Surgery | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Inconnu';
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.name || 'Non assigne';
  };

  const getORName = (roomId: string) => {
    const room = operatingRooms.find(r => r.id === roomId);
    return room?.name || 'Non assigne';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800',
      'pre-op': 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-purple-100 text-purple-800 animate-pulse',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      scheduled: 'Planifiee',
      'pre-op': 'Pre-op',
      'in-progress': 'En cours',
      completed: 'Terminee',
      cancelled: 'Annulee'
    };
    return texts[status] || status;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      elective: 'border-blue-400',
      urgent: 'border-orange-400',
      emergency: 'border-red-400'
    };
    return colors[type] || 'border-gray-300';
  };

  const filteredSurgeries = surgeries.filter(surgery => {
    const matchesStatus = filterStatus === 'all' || surgery.status === filterStatus;
    const matchesDate = surgery.scheduledDate === filterDate;
    return matchesStatus && matchesDate;
  });

  const stats = {
    today: surgeries.filter(s => s.scheduledDate === new Date().toISOString().split('T')[0]).length,
    scheduled: surgeries.filter(s => s.status === 'scheduled').length,
    inProgress: surgeries.filter(s => s.status === 'in-progress').length,
    completed: surgeries.filter(s => s.status === 'completed').length,
    availableRooms: operatingRooms.filter(r => r.status === 'available').length
  };

  const generateSurgeryHTML = () => {
    const rows = filteredSurgeries.map(s => `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;">${getPatientName(s.patientId)}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${s.procedure}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${getORName(s.operatingRoomId)}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${s.scheduledTime}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${getUserName(s.surgeonId)}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${getStatusText(s.status)}</td>
      </tr>
    `).join('');

    return `
      ${generateDocumentHeader(organizationSettings, 'report', `CHI-${Date.now().toString().slice(-8)}`)}
      <h2 style="margin: 20px 0; color: #333;">Programme Chirurgical - ${new Date(filterDate).toLocaleDateString('fr-FR')}</h2>
      <p style="color: #666; margin-bottom: 20px;">Total: ${filteredSurgeries.length} interventions</p>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: ${organizationSettings.primaryColor};">
            <th style="padding: 10px; color: white; text-align: left;">Patient</th>
            <th style="padding: 10px; color: white; text-align: left;">Intervention</th>
            <th style="padding: 10px; color: white; text-align: left;">Salle</th>
            <th style="padding: 10px; color: white; text-align: left;">Heure</th>
            <th style="padding: 10px; color: white; text-align: left;">Chirurgien</th>
            <th style="padding: 10px; color: white; text-align: left;">Statut</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      ${generateDocumentFooter(organizationSettings)}
    `;
  };

  const handleExportPDF = async () => {
    await printDocument(generateSurgeryHTML(), organizationSettings, 'Bloc-Operatoire');
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    const data = filteredSurgeries.map(s => ({
      patient: getPatientName(s.patientId),
      intervention: s.procedure,
      salle: getORName(s.operatingRoomId),
      heure: s.scheduledTime,
      chirurgien: getUserName(s.surgeonId),
      statut: getStatusText(s.status)
    }));
    exportToExcel(data, 'Bloc-Operatoire', ['Patient', 'Intervention', 'Salle', 'Heure', 'Chirurgien', 'Statut']);
    setShowExportMenu(false);
  };

  const handlePrint = async () => {
    await printDocument(generateSurgeryHTML(), organizationSettings, 'Bloc-Operatoire');
    setShowExportMenu(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Bloc Operatoire</h1>
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
            onClick={() => setShowNewSurgery(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nouvelle chirurgie
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Aujourd'hui</p>
          <p className="text-3xl font-bold text-gray-900">{stats.today}</p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-4">
          <p className="text-sm text-blue-600">Planifiées</p>
          <p className="text-3xl font-bold text-blue-700">{stats.scheduled}</p>
        </div>
        <div className="bg-purple-50 rounded-lg shadow-sm border border-purple-200 p-4">
          <p className="text-sm text-purple-600">En cours</p>
          <p className="text-3xl font-bold text-purple-700">{stats.inProgress}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-sm border border-green-200 p-4">
          <p className="text-sm text-green-600">Terminées</p>
          <p className="text-3xl font-bold text-green-700">{stats.completed}</p>
        </div>
        <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Salles disponibles</p>
          <p className="text-3xl font-bold text-gray-700">{stats.availableRooms}</p>
        </div>
      </div>

      {/* OR Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">État des salles opératoires</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {operatingRooms.map(room => (
            <div
              key={room.id}
              className={`p-4 rounded-lg border-2 ${
                room.status === 'available' ? 'border-green-400 bg-green-50' :
                room.status === 'in-use' ? 'border-red-400 bg-red-50' :
                'border-yellow-400 bg-yellow-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">{room.name}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  room.status === 'available' ? 'bg-green-200 text-green-800' :
                  room.status === 'in-use' ? 'bg-red-200 text-red-800' :
                  'bg-yellow-200 text-yellow-800'
                }`}>
                  {room.status === 'available' ? 'Disponible' :
                   room.status === 'in-use' ? 'Occupée' : 'Nettoyage'}
                </span>
              </div>
              <p className="text-sm text-gray-600 capitalize">{room.type}</p>
              {room.status === 'in-use' && surgeries.find(s => s.operatingRoomId === room.id && s.status === 'in-progress') && (
                <p className="text-xs text-red-600 mt-2">
                  {surgeries.find(s => s.operatingRoomId === room.id && s.status === 'in-progress')?.procedure}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Date</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Statut</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous</option>
            <option value="scheduled">Planifiées</option>
            <option value="pre-op">Pré-op</option>
            <option value="in-progress">En cours</option>
            <option value="completed">Terminées</option>
          </select>
        </div>
      </div>

      {/* Surgery List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredSurgeries.length === 0 ? (
          <div className="text-center py-12">
            <Scissors className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune chirurgie pour cette date</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredSurgeries.map((surgery) => {
              const patient = patients.find(p => p.id === surgery.patientId);
              return (
                <div
                  key={surgery.id}
                  className={`p-6 hover:bg-gray-50 cursor-pointer border-l-4 ${getTypeColor(surgery.type)}`}
                  onClick={() => setSelectedSurgery(surgery)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium text-gray-900">{surgery.procedure}</span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(surgery.status)}`}>
                          {getStatusText(surgery.status)}
                        </span>
                        {surgery.type === 'emergency' && (
                          <span className="px-2 py-1 text-xs bg-red-600 text-white rounded-full">URGENCE</span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm mb-2">
                        <span className="font-medium">{getPatientName(surgery.patientId)}</span>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{surgery.scheduledDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{surgery.scheduledTime} ({surgery.duration} min)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>Dr. {getUserName(surgery.surgeonId)}</span>
                        </div>
                        <span>{getORName(surgery.operatingRoomId)}</span>
                      </div>
                    </div>

                    {surgery.status === 'scheduled' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateSurgery(surgery.id, { status: 'in-progress', startTime: new Date().toISOString() });
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Démarrer
                      </button>
                    )}
                    {surgery.status === 'in-progress' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateSurgery(surgery.id, { status: 'completed', endTime: new Date().toISOString() });
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Terminer
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New Surgery Modal */}
      {showNewSurgery && <SurgeryForm onClose={() => setShowNewSurgery(false)} />}

      {/* Surgery Details */}
      {selectedSurgery && (
        <SurgeryDetails surgery={selectedSurgery} onClose={() => setSelectedSurgery(null)} />
      )}
    </div>
  );
};

// Formulaire nouvelle chirurgie
const SurgeryForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { patients, users, operatingRooms, addSurgery } = useApp();
  const surgeons = users.filter(u => u.role === 'surgeon' || u.role === 'doctor');
  const availableRooms = operatingRooms.filter(r => r.status === 'available');

  const [selectedPatient, setSelectedPatient] = useState('');
  const [formData, setFormData] = useState({
    scheduledDate: '',
    scheduledTime: '',
    duration: 60,
    type: 'elective' as Surgery['type'],
    procedure: '',
    surgeonId: '',
    operatingRoomId: '',
    anesthesiaType: 'general' as Surgery['anesthesiaType'],
    preOpDiagnosis: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const surgery: Surgery = {
      id: Date.now().toString(),
      patientId: selectedPatient,
      ...formData,
      status: 'scheduled'
    };

    addSurgery(surgery);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Nouvelle chirurgie</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <Plus className="w-6 h-6 rotate-45" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Patient */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Sélectionner</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
              <input
                type="time"
                value={formData.scheduledTime}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durée (min)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'elective', label: 'Programmée' },
                { value: 'urgent', label: 'Urgente' },
                { value: 'emergency', label: 'Imprévue' }
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: opt.value as Surgery['type'] }))}
                  className={`px-3 py-2 rounded-lg border ${
                    formData.type === opt.value ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Procédure</label>
            <input
              type="text"
              value={formData.procedure}
              onChange={(e) => setFormData(prev => ({ ...prev, procedure: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Ex: Appendicectomie"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chirurgien</label>
              <select
                value={formData.surgeonId}
                onChange={(e) => setFormData(prev => ({ ...prev, surgeonId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Sélectionner</option>
                {surgeons.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salle</label>
              <select
                value={formData.operatingRoomId}
                onChange={(e) => setFormData(prev => ({ ...prev, operatingRoomId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Sélectionner</option>
                {availableRooms.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Anesthésie</label>
            <select
              value={formData.anesthesiaType}
              onChange={(e) => setFormData(prev => ({ ...prev, anesthesiaType: e.target.value as Surgery['anesthesiaType'] }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="general">Générale</option>
              <option value="regional">Régionale</option>
              <option value="local">Locale</option>
              <option value="sedation">Sédation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diagnostic pré-op</label>
            <input
              type="text"
              value={formData.preOpDiagnosis}
              onChange={(e) => setFormData(prev => ({ ...prev, preOpDiagnosis: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
              Annuler
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Planifier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Détails chirurgie
const SurgeryDetails: React.FC<{ surgery: Surgery; onClose: () => void }> = ({ surgery, onClose }) => {
  const { patients, users, operatingRooms } = useApp();
  const patient = patients.find(p => p.id === surgery.patientId);
  const surgeon = users.find(u => u.id === surgery.surgeonId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{surgery.procedure}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <Plus className="w-6 h-6 rotate-45" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Patient</p>
              <p className="font-medium">{patient?.firstName} {patient?.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Chirurgien</p>
              <p className="font-medium">{surgeon?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">{surgery.scheduledDate} à {surgery.scheduledTime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Durée</p>
              <p className="font-medium">{surgery.duration} minutes</p>
            </div>
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

export default SurgeryModule;
