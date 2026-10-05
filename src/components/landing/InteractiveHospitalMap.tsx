import React, { useState } from 'react';
import {
  Users, Calendar, BedDouble, Pill, FileText, Activity,
  CheckCircle2, Clock, Search, ChevronRight, Stethoscope,
  Heart, ShieldCheck, ArrowUpRight
} from 'lucide-react';

export const InteractiveHospitalMap: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'beds'>('overview');

  return (
    <div className="relative w-full max-w-6xl mx-auto py-4 px-2 sm:px-4">
      {/* Subtle Ambient Background Glow (Soft, warm, hospital clean) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-teal-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Main Workspace Frame (SoftCare Hospital OS) */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xl shadow-slate-200/60 overflow-hidden text-left transition-all duration-300">
        
        {/* App Window Header Bar */}
        <div className="bg-slate-50/90 border-b border-slate-200/80 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 select-none">
          {/* Window dots */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-300" />
            <span className="w-3 h-3 rounded-full bg-slate-300" />
            <span className="w-3 h-3 rounded-full bg-slate-300" />
            <span className="hidden sm:inline-block ml-3 text-xs font-semibold text-slate-500 font-sans">
              SoftCare Hospital OS • Centre Hospitalier Universitaire
            </span>
          </div>

          {/* Search bar mockup */}
          <div className="hidden md:flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 w-72 text-xs text-slate-400 shadow-2xs">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Rechercher patient, lit, ordonnance...</span>
          </div>

          {/* User profile mockup */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
              SA
            </div>
            <div className="hidden sm:block text-right leading-tight">
              <p className="text-xs font-bold text-slate-800">Dr. Sarah Alami</p>
              <p className="text-[10px] text-slate-400 font-medium">Médecine Interne</p>
            </div>
          </div>
        </div>

        {/* Workspace Sub-header with Navigation & Live Status */}
        <div className="px-5 sm:px-8 pt-5 pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveTab('patients')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'patients'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Patients & Séjours
            </button>
            <button
              onClick={() => setActiveTab('beds')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'beds'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Régulation des lits
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>142 patients pris en charge</span>
            <span className="text-slate-300">•</span>
            <span className="text-teal-700 font-semibold">Tous services synchronisés</span>
          </div>
        </div>

        {/* Dashboard Content Area */}
        <div className="p-5 sm:p-8 space-y-6">
          
          {/* Top 4 Key Indicator Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 transition-all hover:bg-white hover:shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold text-slate-600">Patients hospitalisés</span>
                <Users className="w-4 h-4 text-teal-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">142</p>
              <p className="text-[11px] text-teal-700 font-medium mt-1">Taux d'occupation : 94%</p>
            </div>

            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 transition-all hover:bg-white hover:shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold text-slate-600">Consultations du jour</span>
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">38</p>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">À l'heure • 0 retard majeur</p>
            </div>

            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 transition-all hover:bg-white hover:shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold text-slate-600">Lits disponibles</span>
                <BedDouble className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">18</p>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Prêts pour admission</p>
            </div>

            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 transition-all hover:bg-white hover:shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold text-slate-600">Pharmacie centrale</span>
                <Pill className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">100%</p>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">Ordonnances sécurisées</p>
            </div>
          </div>

          {/* Main Workspace Split Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left Panel: Recent Patients & Admissions (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-600" />
                  <h3 className="text-sm font-bold text-slate-900">Admissions récentes & Transmissions cliniques</h3>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Temps réel</span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      CD
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Claire Dubois <span className="text-slate-400 font-normal">• 42 ans</span></p>
                      <p className="text-[11px] text-slate-500">Cardiologie • Chambre 204 • Dr. Martin</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Constantes stables
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                      MV
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Jean-Marc Vasseur <span className="text-slate-400 font-normal">• 68 ans</span></p>
                      <p className="text-[11px] text-slate-500">Post-opératoire • Chambre 108 • Dr. Laurent</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    Surveillance active
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                      AB
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Amina Benali <span className="text-slate-400 font-normal">• 29 ans</span></p>
                      <p className="text-[11px] text-slate-500">Maternité • Chambre 312 • Dr. Kaddour</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    Admission validée
                  </span>
                </div>
              </div>
            </div>

            {/* Right Panel: Hospital Units Bed Occupancy (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <BedDouble className="w-4 h-4 text-teal-600" />
                    <h3 className="text-sm font-bold text-slate-900">Capacité des services hospitaliers</h3>
                  </div>
                  <span className="text-[11px] font-semibold text-teal-700">142/150 lits</span>
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
                <span className="font-semibold text-teal-700">Détails lits →</span>
              </div>
            </div>

          </div>

        </div>

        {/* Footer Bar: System Health & Institutional Trust */}
        <div className="bg-slate-50 border-t border-slate-200/80 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 select-none">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span className="font-medium text-slate-700">SoftCare v2.4 • Dossier Patient & Gestion Hospitalière Unifiée</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Temps de réponse système : &lt; 80ms</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 font-medium">Continuité de service 100%</span>
          </div>
        </div>

      </div>

      {/* Satellite Floating Cards (Desktop Placement with Subtle Gentle Elevation) */}
      
      {/* Floating Card 1: Patient Quick Dossier (Top-Left Accent) */}
      <div className="hidden xl:block absolute -top-4 -left-6 z-20 w-64 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/70 p-3.5 text-left animate-float-gentle transition-transform hover:scale-[1.02]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
            Dossier Patient Actif
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
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

      {/* Floating Card 2: Upcoming Consultation (Top-Right Accent) */}
      <div className="hidden xl:block absolute -top-4 -right-6 z-20 w-64 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/70 p-3.5 text-left animate-float-delayed transition-transform hover:scale-[1.02]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
            Agenda Consultations
          </span>
          <Clock className="w-3.5 h-3.5 text-blue-600" />
        </div>
        <p className="text-xs font-bold text-slate-900">14h30 • Dr. Martin</p>
        <p className="text-[10px] text-slate-500 mt-0.5">Consultation post-opératoire • Box 04</p>
        <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
          <span className="text-slate-500">Patient en salle d'attente</span>
          <span className="text-blue-700 font-bold">Prêt</span>
        </div>
      </div>

      {/* Floating Card 3: Pharmacy Validation (Bottom-Left Accent) */}
      <div className="hidden xl:block absolute -bottom-4 -left-6 z-20 w-64 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/70 p-3.5 text-left animate-float-delayed transition-transform hover:scale-[1.02]">
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

      {/* Floating Card 4: Bed Regulation (Bottom-Right Accent) */}
      <div className="hidden xl:block absolute -bottom-4 -right-6 z-20 w-64 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/70 p-3.5 text-left animate-float-gentle transition-transform hover:scale-[1.02]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            Régulation des Lits
          </span>
          <BedDouble className="w-3.5 h-3.5 text-emerald-600" />
        </div>
        <p className="text-xs font-bold text-slate-900">Chambre 304 disponible</p>
        <p className="text-[10px] text-slate-500 mt-0.5">Secteur Médecine Interne Est</p>
        <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-teal-700 font-semibold">
          <span>Prête pour admission immédiate</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-teal-600" />
        </div>
      </div>

    </div>
  );
};

export default InteractiveHospitalMap;
