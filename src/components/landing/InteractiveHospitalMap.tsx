import React, { useState } from 'react';
import {
  Users, Calendar, BedDouble, Pill, FileText, Activity,
  CheckCircle2, Clock, Search, ChevronRight, Stethoscope,
  Heart, ShieldCheck, ArrowUpRight, AlertCircle, Sparkles,
  Thermometer, HeartPulse, UserCheck, Check
} from 'lucide-react';

export const InteractiveHospitalMap: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'beds'>('overview');
  const [patientSearch, setPatientSearch] = useState('');

  const samplePatients = [
    {
      id: 'P-10482',
      name: 'Claire Dubois',
      age: 42,
      gender: 'F',
      service: 'Cardiologie',
      room: 'Ch. 204',
      doctor: 'Dr. Martin',
      status: 'Stable',
      statusColor: 'emerald',
      bp: '120/80',
      hr: '72 bpm',
      spo2: '98%',
      diagnosis: 'Syndrome coronarien aigu sous surveillance',
      admission: 'Aujourd\'hui 08:30'
    },
    {
      id: 'P-10479',
      name: 'Jean-Marc Vasseur',
      age: 68,
      gender: 'H',
      service: 'Post-opératoire',
      room: 'Ch. 108',
      doctor: 'Dr. Laurent',
      status: 'Surveillance active',
      statusColor: 'blue',
      bp: '135/85',
      hr: '84 bpm',
      spo2: '96%',
      diagnosis: 'Pontage coronarien J+2',
      admission: 'Hier 14:15'
    },
    {
      id: 'P-10464',
      name: 'Amina Benali',
      age: 29,
      gender: 'F',
      service: 'Maternité',
      room: 'Ch. 312',
      doctor: 'Dr. Kaddour',
      status: 'Séjour normal',
      statusColor: 'teal',
      bp: '115/75',
      hr: '78 bpm',
      spo2: '99%',
      diagnosis: 'Post-partum immédiat',
      admission: 'Hier 22:40'
    },
    {
      id: 'P-10455',
      name: 'Robert Dupont',
      age: 74,
      gender: 'H',
      service: 'Soins Intensifs',
      room: 'Box 02',
      doctor: 'Dr. Alami',
      status: 'Attention requise',
      statusColor: 'amber',
      bp: '105/65',
      hr: '92 bpm',
      spo2: '94%',
      diagnosis: 'Insuffisance respiratoire aiguë',
      admission: 'Ce matin 04:10'
    }
  ];

  const filteredPatients = samplePatients.filter(p =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.service.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.room.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const sampleBeds = [
    { service: 'Soins Intensifs & Réanimation', total: 16, occupied: 14, available: 2, cleaning: 0, alert: 'Capacité 88%' },
    { service: 'Cardiologie Interventionnelle', total: 45, occupied: 42, available: 3, cleaning: 0, alert: 'Tension modérée' },
    { service: 'Médecine Interne & Gériatrie', total: 32, occupied: 28, available: 3, cleaning: 1, alert: 'Fluidité normale' },
    { service: 'Chirurgie Ambulatoire & Bloc', total: 28, occupied: 20, available: 6, cleaning: 2, alert: 'Disponible' },
    { service: 'Maternité & Néonatalogie', total: 20, occupied: 17, available: 3, cleaning: 0, alert: 'Disponible' }
  ];

  return (
    <div className="relative w-full max-w-full overflow-hidden mx-auto py-2 sm:py-4 px-0 sm:px-4">
      {/* Subtle Ambient Background Glow (Soft, warm, hospital clean) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-teal-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Main Workspace Frame (SoftCare Hospital OS) */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xl shadow-slate-200/60 overflow-hidden text-left transition-all duration-300 w-full max-w-full">
        
        {/* App Window Header Bar */}
        <div className="bg-slate-50/90 border-b border-slate-200/80 px-3 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-4 select-none">
          {/* Window dots */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-slate-300" />
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-slate-300" />
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-slate-300" />
            <span className="hidden sm:inline-block ml-3 text-xs font-semibold text-slate-600 font-sans">
              SoftCare Hospital OS • Centre Hospitalier Universitaire
            </span>
          </div>

          {/* Search bar mockup */}
          <div className="hidden md:flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 w-72 text-xs text-slate-400 shadow-2xs">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher patient, lit, dossier..."
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-slate-700 w-full placeholder:text-slate-400"
            />
          </div>

          {/* User profile mockup */}
          <div className="flex items-center gap-2">
            <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] sm:text-xs font-bold shadow-2xs flex-shrink-0">
              SA
            </div>
            <div className="hidden sm:block text-right leading-tight">
              <p className="text-xs font-bold text-slate-800">Dr. Sarah Alami</p>
              <p className="text-[10px] text-slate-500 font-medium">Médecine Interne</p>
            </div>
          </div>
        </div>

        {/* Workspace Sub-header with Navigation & Live Status */}
        <div className="px-3 sm:px-8 pt-3 sm:pt-4 pb-2.5 sm:pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 max-w-full scrollbar-none">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-2 sm:px-3.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all duration-150 flex-shrink-0 ${
                activeTab === 'overview'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="sm:hidden">Vue globale</span>
              <span className="hidden sm:inline">Vue d'ensemble</span>
            </button>
            <button
              onClick={() => setActiveTab('patients')}
              className={`px-2 sm:px-3.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all duration-150 flex-shrink-0 ${
                activeTab === 'patients'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="sm:hidden">Dossiers (DPI)</span>
              <span className="hidden sm:inline">Patients & Séjours (DPI)</span>
            </button>
            <button
              onClick={() => setActiveTab('beds')}
              className={`px-2 sm:px-3.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all duration-150 flex-shrink-0 ${
                activeTab === 'beds'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="sm:hidden">Lits</span>
              <span className="hidden sm:inline">Régulation des Lits</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-medium text-slate-500 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>142 patients</span>
            <span className="text-slate-300">•</span>
            <span className="text-teal-700 font-semibold truncate">Services synchronisés</span>
          </div>
        </div>

        {/* Dashboard Content Area */}
        <div className="p-3 sm:p-8 space-y-4 sm:space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5 sm:space-y-6 animate-page-enter">
              {/* Top 4 Key Indicator Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 sm:p-4 transition-all hover:bg-white hover:shadow-xs min-w-0">
                  <div className="flex items-center justify-between text-slate-500 mb-1.5 sm:mb-2 gap-1">
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-600 truncate">Hospitalisés</span>
                    <Users className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-teal-600 flex-shrink-0" />
                  </div>
                  <p className="text-xl sm:text-3xl font-bold text-slate-900">142</p>
                  <p className="text-[10px] sm:text-[11px] text-teal-700 font-medium mt-0.5 sm:mt-1 truncate">Occupation : 94%</p>
                </div>

                <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 sm:p-4 transition-all hover:bg-white hover:shadow-xs min-w-0">
                  <div className="flex items-center justify-between text-slate-500 mb-1.5 sm:mb-2 gap-1">
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-600 truncate">Consultations</span>
                    <Calendar className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-blue-600 flex-shrink-0" />
                  </div>
                  <p className="text-xl sm:text-3xl font-bold text-slate-900">38</p>
                  <p className="text-[10px] sm:text-[11px] text-emerald-600 font-medium mt-0.5 sm:mt-1 truncate">0 retard</p>
                </div>

                <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 sm:p-4 transition-all hover:bg-white hover:shadow-xs min-w-0">
                  <div className="flex items-center justify-between text-slate-500 mb-1.5 sm:mb-2 gap-1">
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-600 truncate">Lits libres</span>
                    <BedDouble className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-emerald-600 flex-shrink-0" />
                  </div>
                  <p className="text-xl sm:text-3xl font-bold text-slate-900">18</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5 sm:mt-1 truncate">Prêts admission</p>
                </div>

                <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 sm:p-4 transition-all hover:bg-white hover:shadow-xs min-w-0">
                  <div className="flex items-center justify-between text-slate-500 mb-1.5 sm:mb-2 gap-1">
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-600 truncate">Pharmacie</span>
                    <Pill className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-amber-600 flex-shrink-0" />
                  </div>
                  <p className="text-xl sm:text-3xl font-bold text-slate-900">100%</p>
                  <p className="text-[10px] sm:text-[11px] text-emerald-600 font-medium mt-0.5 sm:mt-1 truncate">Sécurisées</p>
                </div>
              </div>

              {/* Main Workspace Split Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-w-0">
                
                {/* Left Panel: Recent Patients & Admissions (7 cols) */}
                <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-5 shadow-2xs min-w-0">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Activity className="w-4 h-4 text-teal-600 flex-shrink-0" />
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">Admissions & Transmissions cliniques</h3>
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium flex-shrink-0">Temps réel</span>
                  </div>

                  <div className="space-y-3 min-w-0">
                    <div className="p-2.5 sm:p-3 rounded-lg bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-2 sm:gap-3 hover:bg-slate-50 transition-colors min-w-0">
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          CD
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 truncate">Claire Dubois <span className="text-slate-400 font-normal text-[10px] sm:text-xs">• 42 ans</span></p>
                          <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">Cardiologie • Ch. 204 • Dr. Martin</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex-shrink-0">
                        Constantes stables
                      </span>
                    </div>

                    <div className="p-2.5 sm:p-3 rounded-lg bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-2 sm:gap-3 hover:bg-slate-50 transition-colors min-w-0">
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          MV
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 truncate">Jean-Marc Vasseur <span className="text-slate-400 font-normal text-[10px] sm:text-xs">• 68 ans</span></p>
                          <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">Post-opératoire • Ch. 108 • Dr. Laurent</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 flex-shrink-0">
                        Surveillance active
                      </span>
                    </div>

                    <div className="p-2.5 sm:p-3 rounded-lg bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-2 sm:gap-3 hover:bg-slate-50 transition-colors min-w-0">
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          AB
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 truncate">Amina Benali <span className="text-slate-400 font-normal text-[10px] sm:text-xs">• 29 ans</span></p>
                          <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">Maternité • Ch. 312 • Dr. Kaddour</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 flex-shrink-0">
                        Admission validée
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Hospital Units Bed Occupancy (5 cols) */}
                <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-5 shadow-2xs flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <BedDouble className="w-4 h-4 text-teal-600 flex-shrink-0" />
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">Capacité des services hospitaliers</h3>
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-semibold text-teal-700 flex-shrink-0">142/150 lits</span>
                    </div>

                    <div className="space-y-3.5">
                      <div>
                        <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                          <span>Urgences & Soins critiques</span>
                          <span className="text-slate-500 font-mono">14/16 (88%)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-teal-600 h-full rounded-full" style={{ width: '88%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                          <span>Cardiologie & Médecine interne</span>
                          <span className="text-slate-500 font-mono">42/45 (93%)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: '93%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                          <span>Chirurgie ambulatoire</span>
                          <span className="text-slate-500 font-mono">22/28 (79%)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-emerald-600 h-full rounded-full" style={{ width: '79%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                          <span>Maternité & Pédiatrie</span>
                          <span className="text-slate-500 font-mono">18/20 (90%)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-teal-500 h-full rounded-full" style={{ width: '90%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Régulation automatique des transferts
                    </span>
                    <button
                      onClick={() => setActiveTab('beds')}
                      className="font-semibold text-teal-700 hover:text-teal-800 transition-colors"
                    >
                      Détails lits →
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: PATIENTS & SÉJOURS (DPI) */}
          {activeTab === 'patients' && (
            <div className="space-y-4 animate-page-enter">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-600" />
                    Dossiers Patients Informatisés Actifs (DPI)
                  </h3>
                  <p className="text-xs text-slate-500">Surveillance télémétrique et transmissions de service</p>
                </div>
                <span className="text-xs font-mono font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-lg">
                  {filteredPatients.length} dossiers affichés
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-teal-300 hover:shadow-xs transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs border border-slate-200">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 flex items-center gap-2">
                            {patient.name}
                            <span className="text-[10px] text-slate-400 font-normal">({patient.age} ans • {patient.gender})</span>
                          </p>
                          <p className="text-[11px] text-teal-700 font-medium">{patient.service} • {patient.room}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        patient.statusColor === 'emerald'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : patient.statusColor === 'blue'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : patient.statusColor === 'teal'
                          ? 'bg-teal-50 text-teal-700 border-teal-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {patient.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-1 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                      "{patient.diagnosis}"
                    </p>

                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 text-center font-mono text-[11px]">
                      <div className="p-1 rounded bg-slate-50">
                        <span className="text-[9px] text-slate-400 block font-sans">PA</span>
                        <span className="font-bold text-slate-700">{patient.bp}</span>
                      </div>
                      <div className="p-1 rounded bg-slate-50">
                        <span className="text-[9px] text-slate-400 block font-sans">Pouls</span>
                        <span className="font-bold text-slate-700">{patient.hr}</span>
                      </div>
                      <div className="p-1 rounded bg-slate-50">
                        <span className="text-[9px] text-slate-400 block font-sans">SpO2</span>
                        <span className="font-bold text-teal-700">{patient.spo2}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BEDS REGULATION */}
          {activeTab === 'beds' && (
            <div className="space-y-5 animate-page-enter">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BedDouble className="w-4 h-4 text-teal-600" />
                    Régulation & Disponibilité Immédiate des Lits
                  </h3>
                  <p className="text-xs text-slate-500">Cartographie temps réel des unités de soins et blocs</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> 18 Lits disponibles
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-600" /> 142 Lits occupés
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {sampleBeds.map((bed, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900">{bed.service}</h4>
                        <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                          {bed.alert}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                        <span>Total : {bed.total}</span>
                        <span>•</span>
                        <span className="text-slate-800 font-semibold">Occupés : {bed.occupied}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold">Disponibles : {bed.available}</span>
                        {bed.cleaning > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-amber-600">Nettoyage : {bed.cleaning}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-32 sm:w-44 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-teal-500 to-cyan-600 h-full rounded-full"
                          style={{ width: `${Math.round((bed.occupied / bed.total) * 100)}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-700 min-w-[38px] text-right">
                        {Math.round((bed.occupied / bed.total) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Bar: System Health & Institutional Trust */}
        <div className="bg-slate-50 border-t border-slate-200/80 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500 select-none min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0" />
            <span className="font-medium text-slate-700 text-[11px] sm:text-xs truncate">SoftCare v2.4 • SIH Hospitalier Unifié</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] sm:text-[11px] text-slate-500 flex-shrink-0">
            <span>Latence : &lt; 40ms</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 font-medium">Continuité 100%</span>
          </div>
        </div>

      </div>

      {/* Satellite Floating Badges — Subtly positioned on large viewports without overlapping controls */}
      <div className="hidden 2xl:block absolute -bottom-4 -left-8 z-20 w-60 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/70 p-3.5 text-left animate-float-gentle transition-transform hover:scale-[1.02]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
            Dossier Patient Actif
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
            CD
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">Claire Dubois, 42 ans</p>
            <p className="text-[10px] text-slate-500">Chambre 204 • Cardiologie</p>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-100 flex justify-between text-[10px] font-mono text-slate-600">
          <span>PA: 120/80</span>
          <span>SpO2: 98%</span>
          <span className="text-emerald-600 font-bold">Stable</span>
        </div>
      </div>

      <div className="hidden 2xl:block absolute -bottom-4 -right-8 z-20 w-60 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/70 p-3.5 text-left animate-float-delayed transition-transform hover:scale-[1.02]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
            Pharmacie Hospitalière
          </span>
          <Pill className="w-3.5 h-3.5 text-amber-600" />
        </div>
        <p className="text-xs font-bold text-slate-900">Prescription #4892 validée</p>
        <p className="text-[10px] text-slate-500 mt-0.5">Amoxicilline 1g • Contrôle posologique OK</p>
        <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-emerald-700 font-semibold">
          <span>Dispensation prête</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        </div>
      </div>
    </div>
  );
};

export default InteractiveHospitalMap;
