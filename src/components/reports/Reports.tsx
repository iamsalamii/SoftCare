import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, TrendingUp, Users, Calendar, Pill, FileText, Download, FileSpreadsheet, Printer, Eye } from 'lucide-react';
import { printDocument, generateDocumentHeader, generateDocumentFooter, exportToExcel } from '../../utils/exportUtils';

const Reports: React.FC = () => {
  const { patients, appointments, medications, medicalRecords, users, organizationSettings } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const getDateRange = () => {
    const now = new Date();
    const start = new Date();

    switch (selectedPeriod) {
      case 'week':
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(now.getFullYear() - 1);
        break;
    }

    return { start, end: now };
  };

  const { start, end } = getDateRange();

  // Statistics calculations
  const totalPatients = patients.length;
  const totalAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return aptDate >= start && aptDate <= end;
  }).length;

  const completedAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return aptDate >= start && aptDate <= end && apt.status === 'completed';
  }).length;

  const lowStockMedications = medications.filter(med => med.stock <= med.minStock).length;

  const appointmentsByStatus = {
    scheduled: appointments.filter(apt => apt.status === 'scheduled').length,
    completed: appointments.filter(apt => apt.status === 'completed').length,
    cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
    'in-progress': appointments.filter(apt => apt.status === 'in-progress').length,
  };

  const usersByRole = {
    doctor: users.filter(u => u.role === 'doctor').length,
    nurse: users.filter(u => u.role === 'nurse').length,
    pharmacist: users.filter(u => u.role === 'pharmacist').length,
    admin: users.filter(u => u.role === 'admin').length,
  };

  const medicationsByCategory = medications.reduce((acc, med) => {
    acc[med.category] = (acc[med.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const periodLabel = {
    week: 'Cette semaine',
    month: 'Ce mois',
    quarter: 'Ce trimestre',
    year: 'Cette annee'
  }[selectedPeriod];

  const generateReportHTML = () => {
    return `
      ${generateDocumentHeader(organizationSettings, 'report', `RPT-${Date.now().toString().slice(-8)}`)}
      <h2 style="margin: 20px 0; color: #333;">Rapport Statistique - ${periodLabel}</h2>
      <p style="color: #666; margin-bottom: 20px;">Genere le ${new Date().toLocaleString('fr-FR')}</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr>
            <th colspan="2" style="background-color: ${organizationSettings.primaryColor}; color: white; padding: 10px; text-align: left;">Statistiques Generales</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style="padding: 10px; border: 1px solid #ddd;">Patients totaux</td><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${totalPatients}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #ddd;">Rendez-vous</td><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${totalAppointments}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #ddd;">RDV termines</td><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${completedAppointments}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #ddd;">Medicaments stock faible</td><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${lowStockMedications}</td></tr>
        </tbody>
      </table>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr>
            <th colspan="2" style="background-color: ${organizationSettings.primaryColor}; color: white; padding: 10px; text-align: left;">Rendez-vous par statut</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style="padding: 10px; border: 1px solid #ddd;">Programmes</td><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${appointmentsByStatus.scheduled}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #ddd;">Termines</td><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${appointmentsByStatus.completed}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #ddd;">Annules</td><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${appointmentsByStatus.cancelled}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #ddd;">En cours</td><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${appointmentsByStatus['in-progress']}</td></tr>
        </tbody>
      </table>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr>
            <th colspan="2" style="background-color: ${organizationSettings.primaryColor}; color: white; padding: 10px; text-align: left;">Personnel par role</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style="padding: 10px; border: 1px solid #ddd;">Medecins</td><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${usersByRole.doctor}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #ddd;">Infirmiers</td><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${usersByRole.nurse}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #ddd;">Pharmaciens</td><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${usersByRole.pharmacist}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #ddd;">Administrateurs</td><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${usersByRole.admin}</td></tr>
        </tbody>
      </table>

      ${generateDocumentFooter(organizationSettings)}
    `;
  };

  const handleExportPDF = async () => {
    await printDocument(generateReportHTML(), organizationSettings, 'Rapport-Statistiques');
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    const data = [
      { categorie: 'Patients totaux', valeur: totalPatients },
      { categorie: 'Rendez-vous', valeur: totalAppointments },
      { categorie: 'RDV termines', valeur: completedAppointments },
      { categorie: 'Stock faible', valeur: lowStockMedications },
      { categorie: 'RDV programmes', valeur: appointmentsByStatus.scheduled },
      { categorie: 'RDV annules', valeur: appointmentsByStatus.cancelled },
      { categorie: 'Medecins', valeur: usersByRole.doctor },
      { categorie: 'Infirmiers', valeur: usersByRole.nurse },
      { categorie: 'Pharmaciens', valeur: usersByRole.pharmacist },
      { categorie: 'Administrateurs', valeur: usersByRole.admin },
    ];
    exportToExcel(data, 'Rapport-Statistiques', ['Categorie', 'Valeur']);
    setShowExportMenu(false);
  };

  const handlePrint = async () => {
    await printDocument(generateReportHTML(), organizationSettings, 'Rapport-Statistiques');
    setShowExportMenu(false);
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '+' : ''}{trend}% vs periode precedente
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Rapports et Statistiques</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette annee</option>
          </select>

          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Exporter</span>
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Patients totaux"
          value={totalPatients}
          icon={Users}
          color="bg-blue-500"
          trend={12}
        />
        <StatCard
          title="RDV cette période"
          value={totalAppointments}
          icon={Calendar}
          color="bg-green-500"
          trend={8}
        />
        <StatCard
          title="RDV terminés"
          value={completedAppointments}
          icon={TrendingUp}
          color="bg-purple-500"
          trend={15}
        />
        <StatCard
          title="Stock faible"
          value={lowStockMedications}
          icon={Pill}
          color="bg-red-500"
          trend={-5}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments by Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendez-vous par statut</h3>
          <div className="space-y-4">
            {Object.entries(appointmentsByStatus).map(([status, count]) => {
              const percentage = totalAppointments > 0 ? (count / totalAppointments) * 100 : 0;
              const statusColors = {
                scheduled: 'bg-blue-500',
                completed: 'bg-green-500',
                cancelled: 'bg-red-500',
                'in-progress': 'bg-yellow-500'
              };
              const statusLabels = {
                scheduled: 'Programmés',
                completed: 'Terminés',
                cancelled: 'Annulés',
                'in-progress': 'En cours'
              };
              
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${statusColors[status as keyof typeof statusColors]}`}></div>
                    <span className="text-sm font-medium text-gray-700">
                      {statusLabels[status as keyof typeof statusLabels]}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${statusColors[status as keyof typeof statusColors]}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Users by Role */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personnel par rôle</h3>
          <div className="space-y-4">
            {Object.entries(usersByRole).map(([role, count]) => {
              const totalUsers = Object.values(usersByRole).reduce((a, b) => a + b, 0);
              const percentage = totalUsers > 0 ? (count / totalUsers) * 100 : 0;
              const roleColors = {
                doctor: 'bg-blue-500',
                nurse: 'bg-green-500',
                pharmacist: 'bg-purple-500',
                admin: 'bg-red-500'
              };
              const roleLabels = {
                doctor: 'Médecins',
                nurse: 'Infirmières',
                pharmacist: 'Pharmaciens',
                admin: 'Administrateurs'
              };
              
              return (
                <div key={role} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${roleColors[role as keyof typeof roleColors]}`}></div>
                    <span className="text-sm font-medium text-gray-700">
                      {roleLabels[role as keyof typeof roleLabels]}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${roleColors[role as keyof typeof roleColors]}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Medications by Category */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Médicaments par catégorie</h3>
          <div className="space-y-3">
            {Object.entries(medicationsByCategory).map(([category, count]) => {
              const totalMeds = Object.values(medicationsByCategory).reduce((a, b) => a + b, 0);
              const percentage = totalMeds > 0 ? (count / totalMeds) * 100 : 0;
              
              return (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{category}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-6">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé d'activité</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Dossiers médicaux</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{medicalRecords.length}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Pill className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium text-gray-700">Médicaments en stock</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {medications.reduce((total, med) => total + med.stock, 0)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-gray-700">Taux de complétion RDV</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;