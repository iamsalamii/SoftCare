import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, FileText, User, Calendar, Eye, CreditCard as Edit, Printer, Download, FileSpreadsheet } from 'lucide-react';
import MedicalRecordForm from './MedicalRecordForm';
import { MedicalRecord } from '../../types';
import { printDocument, generateDocumentHeader, generateDocumentFooter, exportToExcel } from '../../utils/exportUtils';

const MedicalRecordsList: React.FC = () => {
  const { medicalRecords, patients, users, organizationSettings } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editRecordId, setEditRecordId] = useState<string | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Patient inconnu';
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = users.find(u => u.id === doctorId);
    return doctor ? doctor.name : 'Medecin inconnu';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      consultation: 'bg-blue-100 text-blue-800',
      diagnosis: 'bg-green-100 text-green-800',
      treatment: 'bg-purple-100 text-purple-800',
      surgery: 'bg-red-100 text-red-800',
      emergency: 'bg-orange-100 text-orange-800',
      'follow-up': 'bg-teal-100 text-teal-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getTypeText = (type: string) => {
    const texts: Record<string, string> = {
      consultation: 'Consultation',
      diagnosis: 'Diagnostic',
      treatment: 'Traitement',
      surgery: 'Chirurgie',
      emergency: 'Urgence',
      'follow-up': 'Suivi'
    };
    return texts[type] || type;
  };

  const filteredRecords = medicalRecords.filter(record => {
    const patientName = getPatientName(record.patientId).toLowerCase();
    const matchesSearch = patientName.includes(searchTerm.toLowerCase()) ||
                          record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || record.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleNewRecord = () => {
    setSelectedPatientId(null);
    setEditRecordId(null);
    setShowForm(true);
  };

  const handleEditRecord = (record: MedicalRecord) => {
    setSelectedPatientId(record.patientId);
    setEditRecordId(record.id);
    setShowForm(true);
  };

  const handleViewRecord = (record: MedicalRecord) => {
    setSelectedRecord(record);
  };

  const generateRecordsHTML = () => {
    const rows = filteredRecords
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map(rec => `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">${new Date(rec.date).toLocaleDateString('fr-FR')}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${getPatientName(rec.patientId)}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${rec.title}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${getTypeText(rec.type)}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">Dr. ${getDoctorName(rec.doctorId)}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${rec.diagnosis}</td>
        </tr>
      `).join('');

    return `
      ${generateDocumentHeader(organizationSettings, 'report', `DMR-${Date.now().toString().slice(-8)}`)}
      <h2 style="margin: 20px 0; color: #333;">Dossiers Medicaux</h2>
      <p style="color: #666; margin-bottom: 20px;">Total: ${filteredRecords.length} dossiers</p>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: ${organizationSettings.primaryColor};">
            <th style="padding: 10px; color: white; text-align: left;">Date</th>
            <th style="padding: 10px; color: white; text-align: left;">Patient</th>
            <th style="padding: 10px; color: white; text-align: left;">Titre</th>
            <th style="padding: 10px; color: white; text-align: left;">Type</th>
            <th style="padding: 10px; color: white; text-align: left;">Medecin</th>
            <th style="padding: 10px; color: white; text-align: left;">Diagnostic</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      ${generateDocumentFooter(organizationSettings)}
    `;
  };

  const handleExportPDF = async () => {
    await printDocument(generateRecordsHTML(), organizationSettings, 'Dossiers-Medicaux');
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    const data = filteredRecords.map(rec => ({
      date: new Date(rec.date).toLocaleDateString('fr-FR'),
      patient: getPatientName(rec.patientId),
      titre: rec.title,
      type: getTypeText(rec.type),
      medecin: getDoctorName(rec.doctorId),
      diagnostic: rec.diagnosis
    }));
    exportToExcel(data, 'Dossiers-Medicaux', ['Date', 'Patient', 'Titre', 'Type', 'Medecin', 'Diagnostic']);
    setShowExportMenu(false);
  };

  const handlePrint = async () => {
    await printDocument(generateRecordsHTML(), organizationSettings, 'Dossiers-Medicaux');
    setShowExportMenu(false);
  };

  const generateMedicalRecordHTML = (record: MedicalRecord) => {
    return `
      ${generateDocumentHeader(organizationSettings, 'prescription', `ORD-${record.id.slice(-8)}`)}
      <h2 style="margin: 20px 0; color: #333;">${record.title}</h2>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 20px;">
        <div>
          <p style="color: #666; font-size: 12px;">Date</p>
          <p style="font-weight: bold;">${new Date(record.date).toLocaleDateString('fr-FR')}</p>
        </div>
        <div>
          <p style="color: #666; font-size: 12px;">Patient</p>
          <p style="font-weight: bold;">${getPatientName(record.patientId)}</p>
        </div>
        <div>
          <p style="color: #666; font-size: 12px;">Medecin</p>
          <p style="font-weight: bold;">Dr. ${getDoctorName(record.doctorId)}</p>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="font-weight: bold; margin-bottom: 10px;">Description</h4>
        <p style="color: #333;">${record.description}</p>
      </div>

      ${record.symptoms.length > 0 ? `
        <div style="margin-bottom: 20px;">
          <h4 style="font-weight: bold; margin-bottom: 10px;">Symptomes</h4>
          <p>${record.symptoms.join(', ')}</p>
        </div>
      ` : ''}

      ${record.diagnosis ? `
        <div style="margin-bottom: 20px; background-color: #eff6ff; padding: 15px; border-radius: 8px;">
          <h4 style="font-weight: bold; margin-bottom: 10px;">Diagnostic</h4>
          <p style="color: #1e40af;">${record.diagnosis}</p>
        </div>
      ` : ''}

      ${record.treatment ? `
        <div style="margin-bottom: 20px;">
          <h4 style="font-weight: bold; margin-bottom: 10px;">Traitement</h4>
          <p>${record.treatment}</p>
        </div>
      ` : ''}

      ${record.prescriptions.length > 0 ? `
        <div style="margin-bottom: 20px;">
          <h4 style="font-weight: bold; margin-bottom: 10px;">Prescriptions</h4>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: ${organizationSettings.primaryColor};">
                <th style="padding: 10px; color: white; text-align: left;">Medicament</th>
                <th style="padding: 10px; color: white; text-align: left;">Dosage</th>
                <th style="padding: 10px; color: white; text-align: left;">Frequence</th>
                <th style="padding: 10px; color: white; text-align: left;">Duree</th>
              </tr>
            </thead>
            <tbody>
              ${record.prescriptions.map(p => `
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd;">${p.medicationName}</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${p.dosage}</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${p.frequency}</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${p.duration}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}

      ${record.followUp ? `
        <div style="margin-bottom: 20px; background-color: #fef3c7; padding: 15px; border-radius: 8px;">
          <h4 style="font-weight: bold; margin-bottom: 10px;">Suivi recommande</h4>
          <p>${record.followUp}</p>
        </div>
      ` : ''}

      ${generateDocumentFooter(organizationSettings)}
    `;
  };

  const printRecord = async (record: MedicalRecord) => {
    await printDocument(generateMedicalRecordHTML(record), organizationSettings, `Dossier-${record.id}`);
  };

  if (showForm) {
    return (
      <MedicalRecordForm
        patientId={selectedPatientId || patients[0]?.id || ''}
        recordId={editRecordId || undefined}
        onClose={() => {
          setShowForm(false);
          setEditRecordId(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dossiers Medicaux</h1>
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
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden sc-dropdown-menu">
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
            onClick={handleNewRecord}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Dossier</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par patient, titre ou diagnostic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les types</option>
              <option value="consultation">Consultations</option>
              <option value="diagnosis">Diagnostics</option>
              <option value="treatment">Traitements</option>
              <option value="surgery">Chirurgies</option>
              <option value="emergency">Urgences</option>
              <option value="follow-up">Suivis</option>
            </select>
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {medicalRecords.length === 0
                ? 'Aucun dossier médical enregistré'
                : 'Aucun dossier trouvé pour cette recherche'}
            </p>
            {medicalRecords.length === 0 && (
              <button
                onClick={handleNewRecord}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                Créer le premier dossier
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredRecords
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((record) => (
                <div
                  key={record.id}
                  className="p-6 hover:bg-gray-50/80 transition-colors duration-150 cursor-pointer animate-row-enter"
                  onClick={() => handleViewRecord(record)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{record.title}</h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(record.type)}`}>
                          {getTypeText(record.type)}
                        </span>
                        {record.status === 'draft' && (
                          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                            Brouillon
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{getPatientName(record.patientId)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(record.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <span className="text-gray-500">Dr. {getDoctorName(record.doctorId)}</span>
                      </div>

                      <p className="text-gray-700 text-sm line-clamp-2">{record.description}</p>

                      {record.symptoms.length > 0 && (
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-1">
                            {record.symptoms.slice(0, 4).map((symptom, index) => (
                              <span
                                key={index}
                                className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded"
                              >
                                {symptom}
                              </span>
                            ))}
                            {record.symptoms.length > 4 && (
                              <span className="text-xs text-gray-500">
                                +{record.symptoms.length - 4} autres
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {record.prescriptions.length > 0 && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">{record.prescriptions.length} prescription(s)</span>
                          {' - '}
                          {record.prescriptions.map(p => p.medicationName).join(', ')}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewRecord(record);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Voir"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditRecord(record);
                        }}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        title="Modifier"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          printRecord(record);
                        }}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                        title="Imprimer"
                      >
                        <Printer className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Modal de détails */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{selectedRecord.title}</h2>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Date</span>
                  <p className="font-medium">{new Date(selectedRecord.date).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <span className="text-gray-500">Patient</span>
                  <p className="font-medium">{getPatientName(selectedRecord.patientId)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Médecin</span>
                  <p className="font-medium">Dr. {getDoctorName(selectedRecord.doctorId)}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700">{selectedRecord.description}</p>
              </div>

              {selectedRecord.symptoms.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Symptômes</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecord.symptoms.map((symptom, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedRecord.diagnosis && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Diagnostic</h4>
                  <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{selectedRecord.diagnosis}</p>
                </div>
              )}

              {selectedRecord.treatment && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Traitement</h4>
                  <p className="text-gray-700">{selectedRecord.treatment}</p>
                </div>
              )}

              {selectedRecord.prescriptions.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Prescriptions</h4>
                  <div className="space-y-2">
                    {selectedRecord.prescriptions.map((presc) => (
                      <div
                        key={presc.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{presc.medicationName}</span>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            presc.status === 'dispensed' ? 'bg-green-100 text-green-800' :
                            presc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {presc.status === 'dispensed' ? 'Délivré' :
                             presc.status === 'pending' ? 'En attente' : 'Terminé'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Dosage: {presc.dosage}</p>
                          <p>Fréquence: {presc.frequency}</p>
                          <p>Durée: {presc.duration}</p>
                          {presc.instructions && <p className="italic">{presc.instructions}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedRecord.followUp && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Suivi</h4>
                  <p className="text-gray-700 bg-amber-50 p-3 rounded-lg">{selectedRecord.followUp}</p>
                </div>
              )}

              {selectedRecord.notes && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                  <p className="text-gray-600 italic">{selectedRecord.notes}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Fermer
                </button>
                <button
                  onClick={() => selectedRecord && printRecord(selectedRecord)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Imprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordsList;
