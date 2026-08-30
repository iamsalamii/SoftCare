import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Heart, Activity, Thermometer, Droplets, Users as UsersIcon, Download, FileSpreadsheet, Printer } from 'lucide-react';
import { printDocument, generateDocumentHeader, generateDocumentFooter, exportToExcel } from '../../utils/exportUtils';

const NursingModule: React.FC = () => {
  const { patients = [], admissions = [], users = [], organizationSettings } = useApp();
  const [selectedTab, setSelectedTab] = useState<'vitals' | 'plans' | 'notes'>('vitals');
  const [searchTerm, setSearchTerm] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Inconnu';
  };

  const getNurseName = (nurseId: string) => {
    const nurse = users.find(u => u.id === nurseId);
    return nurse?.name || 'Inconnu';
  };

  const activeAdmissions = admissions?.filter(a => a.status === 'admitted') || [];

  const generateVitalsHTML = () => {
    return `
      ${generateDocumentHeader(organizationSettings, 'report', `SOI-${Date.now().toString().slice(-8)}`)}
      <h2 style="margin: 20px 0; color: #333;">Module Soins Infirmiers</h2>
      <p style="color: #666; margin-bottom: 20px;">Patients hospitalises: ${activeAdmissions.length}</p>
      ${generateDocumentFooter(organizationSettings)}
    `;
  };

  const handleExportPDF = async () => {
    await printDocument(generateVitalsHTML(), organizationSettings, 'Soins-Infirmiers');
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    exportToExcel([], 'Soins-Infirmiers', ['Patient', 'Temperature', 'PA', 'FC', 'FR', 'SpO2', 'Date']);
    setShowExportMenu(false);
  };

  const handlePrint = async () => {
    await printDocument(generateVitalsHTML(), organizationSettings, 'Soins-Infirmiers');
    setShowExportMenu(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Module Infirmier</h1>
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
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-gradient-to-br from-cyan-400 to-teal-500 rounded-2xl p-5 text-white shadow-lg shadow-teal-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Patients hospitalises</p>
              <p className="text-3xl font-bold">{activeAdmissions.length}</p>
            </div>
            <UsersIcon className="w-10 h-10 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl p-5 text-white shadow-lg shadow-green-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Mesures aujourd'hui</p>
              <p className="text-3xl font-bold">0</p>
            </div>
            <Activity className="w-10 h-10 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-violet-400 to-purple-500 rounded-2xl p-5 text-white shadow-lg shadow-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Plans de soins actifs</p>
              <p className="text-3xl font-bold">0</p>
            </div>
            <Heart className="w-10 h-10 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-rose-400 to-red-500 rounded-2xl p-5 text-white shadow-lg shadow-rose-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Alertes</p>
              <p className="text-3xl font-bold">0</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-xl">!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {[
            { id: 'vitals', label: 'Signes vitaux', icon: Activity },
            { id: 'plans', label: 'Plans de soins', icon: Heart },
            { id: 'notes', label: 'Notes infirmieres', icon: Search }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 transition-colors ${
                selectedTab === tab.id
                  ? 'text-cyan-600 bg-cyan-50 border-b-2 border-cyan-500'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {selectedTab === 'vitals' && (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Signes vitaux</h3>
              <p className="text-gray-500 mb-4">Aucune mesure de signes vitaux enregistree</p>
              <button className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto shadow-lg shadow-teal-500/20">
                <Plus className="w-4 h-4" />
                Nouvelle saisie
              </button>
            </div>
          )}
          {selectedTab === 'plans' && (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Plans de soins</h3>
              <p className="text-gray-500 mb-4">Aucun plan de soins actif</p>
              <button className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto shadow-lg shadow-purple-500/20">
                <Plus className="w-4 h-4" />
                Creer un plan
              </button>
            </div>
          )}
          {selectedTab === 'notes' && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Notes infirmieres</h3>
              <p className="text-gray-500">Module de notes infirmieres en cours de developpement</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NursingModule;
