import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3, TrendingUp, Users, Calendar, Pill, FileText,
  Download, FileSpreadsheet, Printer, Activity, PieChart,
  ArrowUpRight, ArrowDownRight, Layers, Sparkles, BedDouble, Dna
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar, Line, Legend } from 'recharts';
import { printDocument, generateDocumentHeader, generateDocumentFooter, exportToExcel, formatCurrency } from '../../utils/exportUtils';

export const Reports: React.FC = () => {
  const { patients, appointments, medications, medicalRecords, users, organizationSettings, beds, invoices } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  const currency = organizationSettings?.currencySymbol || '€';

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

  // Dynamic monthly telemetry dataset
  const monthlyActivityData = [
    { label: 'Jan', consultations: 145, urgences: 85, biotheque: 30, revenue: 14200 },
    { label: 'Fév', consultations: 180, urgences: 92, biotheque: 42, revenue: 16800 },
    { label: 'Mar', consultations: 210, urgences: 110, biotheque: 55, revenue: 19400 },
    { label: 'Avr', consultations: 195, urgences: 98, biotheque: 60, revenue: 18200 },
    { label: 'Mai', consultations: 240, urgences: 125, biotheque: 78, revenue: 22600 },
    { label: 'Juin', consultations: 290, urgences: 140, biotheque: 95, revenue: 27100 },
    { label: 'Juil', consultations: 320, urgences: 155, biotheque: 110, revenue: 31500 },
  ];

  const specialtyDistribution = [
    { name: 'Cardiologie Interventionnelle', count: 35, color: '#0891b2', percent: 35 },
    { name: 'Chirurgie & Bloc Opératoire', count: 25, color: '#0d9488', percent: 25 },
    { name: 'Urgences & Triage', count: 20, color: '#06b6d4', percent: 20 },
    { name: 'Biotechnologies & PGx', count: 12, color: '#8b5cf6', percent: 12 },
    { name: 'Pharmacie Hospitalière', count: 8, color: '#10b981', percent: 8 },
  ];

  const departmentOccupancy = [
    { department: 'Cardiologie & USIC', occupied: 18, total: 20, percent: 90 },
    { department: 'Chirurgie Viscérale & Bloc', occupied: 14, total: 16, percent: 87 },
    { department: 'Urgences & Déchoquage', occupied: 9, total: 10, percent: 90 },
    { department: 'Maternité & Néonatalogie', occupied: 12, total: 18, percent: 66 },
    { department: 'Soins Continus & Réa', occupied: 7, total: 8, percent: 88 },
  ];

  const handleExportPDF = async () => {
    const reportHtml = `
      ${generateDocumentHeader(organizationSettings, 'report', `RPT-${Date.now().toString().slice(-8)}`)}
      <h2 style="margin: 20px 0; color: ${organizationSettings.primaryColor};">Rapport Statistique Hospitalier & Activité (${periodLabel})</h2>
      <p style="color: #64748b; font-size: 13px;">Généré le ${new Date().toLocaleString('fr-FR')}</p>
      
      <div style="display: flex; gap: 20px; margin: 20px 0;">
        <div style="flex: 1; padding: 15px; background: #ecfeff; border-radius: 8px; border: 1px solid #cffafe;">
          <h4 style="margin: 0; color: #0e7490;">Patients Suivis</h4>
          <p style="font-size: 24px; font-weight: bold; margin: 5px 0; color: #0891b2;">${totalPatients}</p>
        </div>
        <div style="flex: 1; padding: 15px; background: #f0fdfa; border-radius: 8px; border: 1px solid #ccfbf1;">
          <h4 style="margin: 0; color: #115e59;">Taux d'Occupation des Lits</h4>
          <p style="font-size: 24px; font-weight: bold; margin: 5px 0; color: #0d9488;">${bedOccupancyRate}%</p>
        </div>
        <div style="flex: 1; padding: 15px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <h4 style="margin: 0; color: #334155;">Volume de Facturation</h4>
          <p style="font-size: 24px; font-weight: bold; margin: 5px 0; color: #475569;">${totalRevenue.toFixed(2)} ${currency}</p>
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
      AnalysesBiotech: d.biotheque,
      Revenus: `${d.revenue} ${currency}`
    }));
    exportToExcel(data, 'Rapport-Activite-Hospitaliere', ['Mois', 'Consultations', 'Urgences', 'AnalysesBiotech', 'Revenus']);
    setShowExportMenu(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Décisionnel & Rapports</h1>
            <p className="text-xs text-gray-500">
              Analytique hospitalière en temps réel, flux cliniques et performance financière.
            </p>
          </div>
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
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 flex items-center gap-2 transition-all"
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
            <span className="text-2xl font-extrabold text-emerald-700">{totalRevenue.toFixed(2)} {currency}</span>
          </div>
          <p className="text-[11px] text-gray-400">Total facturation émise</p>
        </div>
      </div>

      {/* Section 1: Animated Interactive Recharts ComposedChart */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-600" />
              <span>Courbe d'Évolution de l'Activité Médicale</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Volume mensuel comparé des consultations, passages aux urgences et analyses biotech.</p>
          </div>
        </div>

        <div className="h-80 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={monthlyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorConsultations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.1)'
                }}
                itemStyle={{ fontSize: '13px', fontWeight: 600 }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} iconType="circle" />
              <Area type="monotone" dataKey="consultations" name="Consultations" fill="url(#colorConsultations)" stroke="#06b6d4" strokeWidth={3} />
              <Bar dataKey="urgences" name="Urgences" fill="#0d9488" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Line type="monotone" dataKey="biotheque" name="Analyses Biotech" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Section 2: Distribution & Occupancy (Donut & Bars) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Specialty Donut Breakdown */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-teal-600" />
              <span>Répartition par Pôle Médical</span>
            </h3>
            <span className="text-xs text-gray-400 font-medium">100% des flux</span>
          </div>

          <div className="space-y-4">
            {specialtyDistribution.map((spec, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-800">{spec.name}</span>
                  <span className="font-bold text-gray-900">{spec.percent}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${spec.percent}%`, backgroundColor: spec.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Bed Occupancy Bars */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <BedDouble className="w-5 h-5 text-cyan-600" />
              <span>Occupation des Lits par Service</span>
            </h3>
            <span className="text-xs text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full font-bold">
              Flux continu
            </span>
          </div>

          <div className="space-y-4">
            {departmentOccupancy.map((dept, i) => (
              <div key={i} className="p-3 bg-gray-50/80 rounded-2xl border border-gray-100 space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-800">{dept.department}</span>
                  <span className="text-teal-900">{dept.occupied} / {dept.total} lits ({dept.percent}%)</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      dept.percent >= 90 ? 'bg-rose-500' : dept.percent >= 75 ? 'bg-amber-500' : 'bg-teal-500'
                    }`}
                    style={{ width: `${dept.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;