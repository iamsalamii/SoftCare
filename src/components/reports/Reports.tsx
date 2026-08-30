import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3, TrendingUp, Users, Calendar, Pill, FileText,
  Download, FileSpreadsheet, Printer, Activity, PieChart,
  ArrowUpRight, ArrowDownRight, Layers, Sparkles, BedDouble
} from 'lucide-react';
import { printDocument, generateDocumentHeader, generateDocumentFooter, exportToExcel, formatCurrency } from '../../utils/exportUtils';

export const Reports: React.FC = () => {
  const { patients, appointments, medications, medicalRecords, users, organizationSettings, beds, invoices } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Period label
  const periodLabel = {
    week: 'Cette semaine',
    month: 'Ce mois-ci',
    quarter: 'Ce trimestre',
    year: 'Cette année'
  }[selectedPeriod];

  // Global KPIs
  const totalPatients = patients.length;
  const totalAppointments = appointments.length;
  const occupiedBeds = beds.filter(b => b.status === 'occupied').length;
  const totalBeds = beds.length || 1;
  const bedOccupancyRate = Math.round((occupiedBeds / totalBeds) * 100);
  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.total, 0);

  // Mock Trend Series for Curves (7 points or 12 months)
  const monthlyActivityData = [
    { label: 'Jan', consultations: 145, urgences: 85, biotheque: 30 },
    { label: 'Fév', consultations: 180, urgences: 92, biotheque: 42 },
    { label: 'Mar', consultations: 210, urgences: 110, biotheque: 55 },
    { label: 'Avr', consultations: 195, urgences: 98, biotheque: 60 },
    { label: 'Mai', consultations: 240, urgences: 125, biotheque: 78 },
    { label: 'Juin', consultations: 290, urgences: 140, biotheque: 95 },
    { label: 'Juil', consultations: 320, urgences: 155, biotheque: 110 },
  ];

  // Specialty Breakdown (for Donut Chart)
  const specialtyDistribution = [
    { name: 'Cardiologie', count: 35, color: '#06b6d4' },
    { name: 'Chirurgie & Bloc', count: 25, color: '#0d9488' },
    { name: 'Urgences & Triage', count: 20, color: '#14b8a6' },
    { name: 'Biotech & PGx', count: 12, color: '#2dd4bf' },
    { name: 'Pharmacie Hospitalière', count: 8, color: '#5eead4' },
  ];

  // Department Bed Occupancy (for Horizontal Bar Chart)
  const departmentOccupancy = [
    { department: 'Cardiologie', occupied: 18, total: 20, percent: 90 },
    { department: 'Chirurgie Viscérale', occupied: 14, total: 16, percent: 87 },
    { department: 'Urgences & Réanimation', occupied: 9, total: 10, percent: 90 },
    { department: 'Maternité & Pédiatrie', occupied: 12, total: 18, percent: 66 },
    { department: 'Soins Continus', occupied: 6, total: 8, percent: 75 },
  ];

  // Pharmacy Categories (for Vertical Bar Chart)
  const pharmacyCategories = [
    { cat: 'Antalgiques', stock: 450, max: 500 },
    { cat: 'Antibiotiques', stock: 280, max: 500 },
    { cat: 'Biothérapies', stock: 120, max: 200 },
    { cat: 'Cardiologie', stock: 340, max: 500 },
    { cat: 'Anesthésie', stock: 190, max: 300 },
  ];

  const handleExportPDF = async () => {
    const reportHtml = `
      ${generateDocumentHeader(organizationSettings, 'report', `RPT-${Date.now().toString().slice(-8)}`)}
      <h2 style="margin: 20px 0; color: #0891b2;">Rapport Statistique Hospitalier & Activité (${periodLabel})</h2>
      <p style="color: #64748b; font-size: 13px;">Généré le ${new Date().toLocaleString('fr-FR')}</p>
      
      <div style="display: flex; gap: 20px; margin: 20px 0;">
        <div style="flex: 1; padding: 15px; background: #ecfeff; border-radius: 8px; border: 1px solid #cffafe;">
          <h4 style="margin: 0; color: #0e7490;">Patients Pris en Charge</h4>
          <p style="font-size: 24px; font-weight: bold; margin: 5px 0; color: #0891b2;">${totalPatients}</p>
        </div>
        <div style="flex: 1; padding: 15px; background: #f0fdfa; border-radius: 8px; border: 1px solid #ccfbf1;">
          <h4 style="margin: 0; color: #115e59;">Taux d'Occupation des Lits</h4>
          <p style="font-size: 24px; font-weight: bold; margin: 5px 0; color: #0d9488;">${bedOccupancyRate}%</p>
        </div>
        <div style="flex: 1; padding: 15px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <h4 style="margin: 0; color: #334155;">Volume de Prescriptions</h4>
          <p style="font-size: 24px; font-weight: bold; margin: 5px 0; color: #475569;">${medicalRecords.length}</p>
        </div>
      </div>
      ${generateDocumentFooter(organizationSettings)}
    `;
    await printDocument(reportHtml, organizationSettings, 'Rapport-Statistiques-SoftCare');
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    const data = monthlyActivityData.map(d => ({
      Mois: d.label,
      Consultations: d.consultations,
      Urgences: d.urgences,
      AnalysesBiotech: d.biotheque
    }));
    exportToExcel(data, 'Statistiques-Activite-Hospitaliere', ['Mois', 'Consultations', 'Urgences', 'Analyses Biotech']);
    setShowExportMenu(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Rapports & Statistiques Cliniques</h1>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 rounded-full">
              Analytics H24
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Indicateurs de performance médicale, occupation des lits, flux d'urgences et délivrance pharmaceutique.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Period selector */}
          <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200/60 text-xs font-semibold">
            {(['week', 'month', 'quarter', 'year'] as const).map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  selectedPeriod === period
                    ? 'bg-white text-teal-800 shadow-sm font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {{ week: 'Semaine', month: 'Mois', quarter: 'Trimestre', year: 'Année' }[period]}
              </button>
            ))}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Download className="w-4 h-4" />
              <span>Exporter</span>
            </button>

            {showExportMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden text-xs">
                  <button
                    onClick={handleExportPDF}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-800 transition-colors text-left"
                  >
                    <Printer className="w-4 h-4 text-cyan-600" />
                    <span>Imprimer / PDF</span>
                  </button>
                  <button
                    onClick={handleExportExcel}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-800 transition-colors text-left"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Tableur Excel</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Patients Suivis</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900">{totalPatients}</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12%
            </span>
          </div>
          <p className="text-[11px] text-gray-400">Total dossiers enregistrés</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Occupation Lits</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <BedDouble className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-teal-700">{bedOccupancyRate}%</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> Optimal
            </span>
          </div>
          <p className="text-[11px] text-gray-400">{occupiedBeds} lits occupés sur {totalBeds}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Rendez-Vous & Actes</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900">{totalAppointments}</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +8%
            </span>
          </div>
          <p className="text-[11px] text-gray-400">Consultations planifiées</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Revenus Facturés</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700">{formatCurrency(totalRevenue, organizationSettings)}</span>
          </div>
          <p className="text-[11px] text-gray-400">Total facturation émise</p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: COURBES D'ACTIVITÉ & ÉVOLUTION TEMPORELLE (AREA/LINE CHART) */}
      {/* ========================================================================= */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-600" />
              <span>Courbe d'Évolution de l'Activité Médicale</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Volume mensuel comparé des consultations, passages aux urgences et analyses biotech.</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-gray-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-cyan-500" />
              <span>Consultations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-teal-500" />
              <span>Urgences</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Biotech / PGx</span>
            </div>
          </div>
        </div>

        {/* Interactive SVG Smooth Area/Line Chart */}
        <div className="relative h-64 sm:h-72 w-full pt-4">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 700 240" preserveAspectRatio="none">
            <defs>
              <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0d9488" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid horizontal lines */}
            {[40, 90, 140, 190].map((y, i) => (
              <line key={i} x1="0" y1={y} x2="700" y2={y} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
            ))}

            {/* Area path for Consultations */}
            <path
              d="M 0 160 C 100 130, 200 80, 300 100 C 400 60, 500 40, 700 10 L 700 220 L 0 220 Z"
              fill="url(#cyanGradient)"
            />

            {/* Line path for Consultations */}
            <path
              d="M 0 160 C 100 130, 200 80, 300 100 C 400 60, 500 40, 700 10"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Line path for Urgences */}
            <path
              d="M 0 190 C 100 170, 200 150, 300 160 C 400 130, 500 110, 700 80"
              fill="none"
              stroke="#0d9488"
              strokeWidth="3"
              strokeDasharray="6 3"
              strokeLinecap="round"
            />

            {/* Line path for Biotech */}
            <path
              d="M 0 215 C 100 205, 200 190, 300 185 C 400 165, 500 140, 700 110"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Data Points */}
            {[
              { x: 0, y: 160 },
              { x: 116, y: 130 },
              { x: 233, y: 80 },
              { x: 350, y: 100 },
              { x: 466, y: 60 },
              { x: 583, y: 40 },
              { x: 700, y: 10 },
            ].map((pt, i) => (
              <circle key={i} cx={pt.x} cy={pt.y} r="5" fill="white" stroke="#06b6d4" strokeWidth="3" className="hover:scale-150 transition-transform cursor-pointer" />
            ))}
          </svg>

          {/* X Axis Labels */}
          <div className="flex justify-between text-xs text-gray-400 font-semibold pt-2">
            {monthlyActivityData.map((d, i) => (
              <span key={i}>{d.label}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: DIAGRAMME CIRCULAIRE (DONUT) & BARRES HORIZONTALES */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Chart: Specialty Distribution */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-teal-600" />
                <span>Répartition par Pôle Médical</span>
              </h3>
              <p className="text-xs text-gray-500">Part de l'activité clinique par département</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
              Donut Chart
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
            {/* SVG Donut */}
            <div className="relative w-44 h-44 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="14" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#06b6d4" strokeWidth="14" strokeDasharray="83 156" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#0d9488" strokeWidth="14" strokeDasharray="59 180" strokeDashoffset="-83" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#14b8a6" strokeWidth="14" strokeDasharray="47 192" strokeDashoffset="-142" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#2dd4bf" strokeWidth="14" strokeDasharray="28 211" strokeDashoffset="-189" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#5eead4" strokeWidth="14" strokeDasharray="19 220" strokeDashoffset="-217" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-gray-900">100%</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Activité</span>
              </div>
            </div>

            {/* Legend Breakdown */}
            <div className="space-y-2.5 w-full">
              {specialtyDistribution.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-md" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-gray-700">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-900">{item.count}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Horizontal Bar Chart: Bed Occupancy */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-600" />
                <span>Taux d'Occupation par Service</span>
              </h3>
              <p className="text-xs text-gray-500">Charge hospitalière et disponibilité immédiate</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full">
              Bandes 100%
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {departmentOccupancy.map((dept, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-800">{dept.department}</span>
                  <span className="text-teal-700">{dept.occupied} / {dept.total} lits ({dept.percent}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      dept.percent >= 90
                        ? 'bg-gradient-to-r from-teal-500 to-rose-500'
                        : 'bg-gradient-to-r from-cyan-500 to-teal-600'
                    }`}
                    style={{ width: `${dept.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: DIAGRAMME EN BARRES VERTICALES (PHARMACIE & STOCK) */}
      {/* ========================================================================= */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <Pill className="w-5 h-5 text-teal-600" />
              <span>Niveaux de Stocks par Catégorie Thérapeutique</span>
            </h3>
            <p className="text-xs text-gray-500">Suivi des volumes et seuils de réapprovisionnement automatique</p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
            Histogramme
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-4 text-center">
          {pharmacyCategories.map((item, idx) => {
            const heightPercent = Math.round((item.stock / item.max) * 100);
            return (
              <div key={idx} className="flex flex-col items-center justify-end h-48 space-y-2">
                <span className="text-xs font-bold text-teal-900">{item.stock}</span>
                <div className="w-12 sm:w-16 bg-gray-100 rounded-2xl h-36 flex items-end p-1 overflow-hidden">
                  <div
                    className="w-full bg-gradient-to-t from-teal-600 to-cyan-400 rounded-xl transition-all duration-700 shadow-sm"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-gray-600 truncate w-full">{item.cat}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Reports;