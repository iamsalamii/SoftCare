import React, { useState } from 'react';
import {
  Activity, Shield, Heart, Dna, Brain, QrCode, ArrowRight,
  CheckCircle2, Users, BedDouble, Stethoscope, Clock, Award,
  Sparkles, Lock, Building2, ChevronRight, Phone, Mail, MapPin,
  FileText, Download, BookOpen, HeartPulse, AlertTriangle, Check,
  Thermometer, Search, RefreshCw, Send, Layers, Play, Menu, X, Snowflake,
  ShieldCheck, Cpu, Zap, BarChart3, Database, ShieldAlert, CheckCircle,
  ArrowUpRight
} from 'lucide-react';
import BrochureModal from './BrochureModal';
import DemoRequestModal from './DemoRequestModal';
import { InteractiveHospitalMap } from './InteractiveHospitalMap';

interface LandingPageProps {
  onGoToLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToLogin }) => {
  const [showBrochureModal, setShowBrochureModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Interactive PGx Simulation state
  const [selectedGene, setSelectedGene] = useState<'CYP2C19' | 'DPYD' | 'CYP2D6' | 'SLCO1B1'>('CYP2C19');

  // Interactive AI Assistant Simulation state
  const [selectedScenario, setSelectedScenario] = useState<number>(0);

  const aiScenarios = [
    {
      symptoms: 'Douleur thoracique rétro-sternale constrictive irradiant au bras gauche, dyspnée d\'effort, sueurs.',
      patient: 'Homme 62 ans, diabétique type 2, hypertendu',
      hypothesis: [
        { title: 'Syndrome Coronarien Aigu (SCA)', prob: 92, urgency: 'Critique' },
        { title: 'Dissection Aortique', prob: 28, urgency: 'Haute' },
        { title: 'Embolie Pulmonaire', prob: 24, urgency: 'Haute' }
      ],
      recommendations: 'ECG 18 dérivations < 10 min, dosage Troponine ultrasensible hs-cTnI, mise sous O2 si SpO2 < 90%.'
    },
    {
      symptoms: 'Dyspnée fébrile progressive, toux purulente, râles crépitants base droite, désaturation à 91%.',
      patient: 'Femme 74 ans, insuffisante respiratoire BPCO',
      hypothesis: [
        { title: 'Pneumopathie Franche Lobaire Aiguë', prob: 88, urgency: 'Haute' },
        { title: 'Exacerbation aiguë de BPCO', prob: 76, urgency: 'Modérée' },
        { title: 'Insuffisance Cardiaque Décompensée', prob: 32, urgency: 'Modérée' }
      ],
      recommendations: 'Radiographie thoracique face/profil, hémocultures x2, gazométrie artérielle, antibiothérapie probabiliste.'
    },
    {
      symptoms: 'Céphalée brutale en coup de tonnerre, raideur nucale, photophobie, vomissements en jet.',
      patient: 'Femme 45 ans, sans antécédent particulier',
      hypothesis: [
        { title: 'Hémorragie Sous-Arachnoïdienne (HSA)', prob: 94, urgency: 'Urgence Vitale' },
        { title: 'Méningite Aiguë Bactérienne', prob: 45, urgency: 'Urgence Vitale' },
        { title: 'Thrombose Veineuse Cérébrale', prob: 30, urgency: 'Haute' }
      ],
      recommendations: 'Scanner cérébral sans injection en urgence immédiate, avis neurochirurgical, ponction lombaire si TDM normal.'
    }
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-teal-600 selection:text-white animate-in fade-in duration-300 overflow-x-hidden">
      
      {/* =========================================================================
          1. NAVIGATION BAR — Frosted Glass Floating Header with Clinical Rigor
          ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo & Clinical Brand */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-teal-600 to-cyan-700 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md shadow-teal-700/20 text-white flex-shrink-0">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-900">
                  SoftCare
                </span>
                <span className="hidden sm:inline-flex text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  Hospital OS
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide hidden md:block">
                Système d'Information Hospitalier
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-slate-600 uppercase tracking-wider">
            <a
              href="#modules"
              onClick={(e) => scrollToSection(e, 'modules')}
              className="hover:text-teal-700 transition-colors py-2"
            >
              Modules & DPI
            </a>
            <a
              href="#biotech"
              onClick={(e) => scrollToSection(e, 'biotech')}
              className="hover:text-teal-700 transition-colors py-2 flex items-center gap-1.5"
            >
              <Dna className="w-3.5 h-3.5 text-teal-600" />
              <span>Biotech & PGx</span>
            </a>
            <a
              href="#ai"
              onClick={(e) => scrollToSection(e, 'ai')}
              className="hover:text-teal-700 transition-colors py-2 flex items-center gap-1.5"
            >
              <Brain className="w-3.5 h-3.5 text-cyan-600" />
              <span>IA Clinique</span>
            </a>
            <a
              href="#workflow"
              onClick={(e) => scrollToSection(e, 'workflow')}
              className="hover:text-teal-700 transition-colors py-2"
            >
              Workflow
            </a>
            <a
              href="#securite"
              onClick={(e) => scrollToSection(e, 'securite')}
              className="hover:text-teal-700 transition-colors py-2 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sécurité HDS</span>
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => setShowBrochureModal(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-teal-800 hover:bg-slate-100 rounded-xl transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-600" />
              <span>Brochure</span>
            </button>

            <button
              onClick={() => setShowDemoModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 rounded-xl transition-all"
            >
              <span>Demander Démo</span>
            </button>

            <button
              onClick={onGoToLogin}
              className="px-2.5 sm:px-4 py-1.5 sm:py-2.5 bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-teal-700/20 active:scale-[0.98] transition-all flex items-center gap-1.5 sm:gap-2 flex-shrink-0"
            >
              <Stethoscope className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-100" />
              <span className="hidden md:inline">Espace Clinique</span>
              <span className="hidden sm:inline md:hidden">Connexion</span>
              <span className="sm:hidden">Accès</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/80 hidden md:inline" />
            </button>

            {/* Mobile menu burger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition-colors flex-shrink-0"
              aria-label="Ouvrir le menu de navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-xl px-4 py-4 space-y-1.5 shadow-xl animate-in slide-in-from-top-2 duration-150">
            <a
              href="#modules"
              onClick={(e) => scrollToSection(e, 'modules')}
              className="block px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-100 hover:text-teal-700 transition-colors"
            >
              Modules Hospitaliers & DPI
            </a>
            <a
              href="#biotech"
              onClick={(e) => scrollToSection(e, 'biotech')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-100 hover:text-teal-700 transition-colors"
            >
              <Dna className="w-4 h-4 text-teal-600" />
              <span>Biotechnologies & PGx</span>
            </a>
            <a
              href="#ai"
              onClick={(e) => scrollToSection(e, 'ai')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-100 hover:text-teal-700 transition-colors"
            >
              <Brain className="w-4 h-4 text-cyan-600" />
              <span>Intelligence Clinique (CDS)</span>
            </a>
            <a
              href="#workflow"
              onClick={(e) => scrollToSection(e, 'workflow')}
              className="block px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-100 hover:text-teal-700 transition-colors"
            >
              Workflow Hospitalier Unifié
            </a>
            <a
              href="#securite"
              onClick={(e) => scrollToSection(e, 'securite')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-100 hover:text-teal-700 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Sécurité HDS & Conformité</span>
            </a>
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => {
                  setShowBrochureModal(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 text-center"
              >
                Brochure PDF
              </button>
              <button
                onClick={() => {
                  setShowDemoModal(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 text-center"
              >
                Demander Démo
              </button>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================================
          2. HERO SECTION — High Editorial Contrast, Product Reality & Live Telemetry
          ========================================================================= */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-14 lg:pb-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200/80">
        
        {/* Subtle hospital clean background pattern */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 sm:w-[850px] max-w-full h-[380px] bg-teal-500/5 blur-[120px] rounded-full pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 sm:space-y-7 relative z-10">
          
          {/* Institutional Concept Pill */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/90 text-slate-700 text-[10px] sm:text-xs font-semibold shadow-2xs max-w-full animate-hero-cascade hero-stagger-1">
            <span className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0" />
            <span className="truncate">SIH <span className="hidden sm:inline">Nouvelle Génération</span></span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 hidden sm:inline">Plateforme unifiée</span>
          </div>

          {/* Master Editorial Headline */}
          <div className="space-y-3 max-w-4xl mx-auto px-1 animate-hero-cascade hero-stagger-2">
            <h1 className="text-xl sm:text-3xl lg:text-5xl xl:text-6xl font-black tracking-tight text-slate-900 leading-snug sm:leading-[1.14]">
              <span className="block sm:inline">L'excellence clinique</span>{' '}
              <span className="block sm:inline">et opérationnelle.</span>{' '}
              <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-teal-700 via-cyan-700 to-teal-800 bg-clip-text text-transparent">
                Unifiée au chevet du patient.
              </span>
            </h1>
            <p className="text-sm sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
              SoftCare centralise le Dossier Patient Informatisé (DPI), la pharmacie robotisée GS1, la régulation des lits et l'intercepteur pharmacogénomique au sein d'une plateforme sécurisée, souveraine et ultra-rapide.
            </p>
          </div>

          {/* Master CTA Hierarchy */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 animate-hero-cascade hero-stagger-3">
            <button
              onClick={onGoToLogin}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 active:scale-[0.98] text-white rounded-xl font-bold text-sm shadow-lg shadow-teal-700/20 transition-all flex items-center justify-center gap-2"
            >
              <Stethoscope className="w-4 h-4 text-teal-100" />
              <span>Accéder à l'espace soignant</span>
              <ArrowRight className="w-4 h-4 text-white/80" />
            </button>

            <button
              onClick={() => setShowDemoModal(true)}
              className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-800 border border-slate-300 rounded-xl font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4 text-teal-600" />
              <span>Planifier une démo établissement</span>
            </button>

            <button
              onClick={() => setShowBrochureModal(true)}
              className="w-full sm:w-auto px-5 py-3.5 text-slate-600 hover:text-slate-900 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>Brochure médicale (PDF)</span>
            </button>
          </div>

          {/* Live Institutional Telemetry Bar */}
          <div className="py-2 flex items-center justify-center gap-2 sm:gap-6 text-[10px] sm:text-[11px] font-mono text-slate-600 flex-wrap px-2 animate-hero-cascade hero-stagger-4">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="font-semibold text-slate-800">Serveur CHU : En Ligne</span>
            </div>
            <span className="text-slate-300">•</span>
            <div>
              <span>Douchette GS1 : </span>
              <span className="text-teal-800 font-bold">&lt; 5 ms</span>
            </div>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <div className="hidden sm:block">
              <span>Sécurité : </span>
              <span className="text-slate-800 font-semibold">Chiffrement AES-256 HDS</span>
            </div>
            <span className="text-slate-300 hidden md:inline">•</span>
            <div className="hidden md:block">
              <span>Continuité : </span>
              <span className="text-emerald-700 font-bold">100% 24h/24</span>
            </div>
          </div>

          {/* Centerpiece: Real Interactive SoftCare Hospital OS Showcase */}
          <div className="pt-2 sm:pt-4 animate-hero-cascade hero-stagger-5">
            <InteractiveHospitalMap />
          </div>

          {/* Core Verifiable Hospital Metrics */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto animate-hero-cascade hero-stagger-6">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-left transition-all hover:border-slate-300 hover:shadow-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">100%</p>
              <p className="text-xs text-slate-700 font-bold mt-1">Traçabilité clinique</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Dossier patient, constantes et ordonnances unifiés</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-left transition-all hover:border-slate-300 hover:shadow-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-teal-700 font-mono">&lt; 5 ms</p>
              <p className="text-xs text-slate-700 font-bold mt-1">Scan douchette GS1</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Identification boîte, lot et péremption immédiate</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-left transition-all hover:border-slate-300 hover:shadow-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">18 000+</p>
              <p className="text-xs text-slate-700 font-bold mt-1">Séjours coordonnés</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Gestion fluide des lits, transferts et sorties</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-left transition-all hover:border-slate-300 hover:shadow-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">99.9%</p>
              <p className="text-xs text-slate-700 font-bold mt-1">Disponibilité garantie</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Architecture haute résilience pour services d'urgences</p>
            </div>
          </div>


        </div>
      </section>

      {/* =========================================================================
          3. COMPLIANCE & ACCREDITATIONS BAND — Medical Trust Framework
          ========================================================================= */}
      <section className="py-6 bg-slate-100/80 border-b border-slate-200 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Conforme HDS (Santé France)</span>
            </span>
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal-600" />
              <span>RGPD Santé & Chiffrement Fort</span>
            </span>
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-600" />
              <span>Interopérabilité HL7 / FHIR R4</span>
            </span>
            <span className="flex items-center gap-2">
              <Dna className="w-4 h-4 text-teal-600" />
              <span>Directives CPIC & PharmGKB</span>
            </span>
            <span className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-teal-600" />
              <span>Traçabilité GS1 Datamatrix 2D</span>
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. BENTO GRID : LES 6 PILIERS FONCTIONNELS DE SOFTCARE
          ========================================================================= */}
      <section id="modules" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200">
              Architecture Modulaire Complète
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Une couverture hospitalière globale et sans rupture
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Chaque service dispose d'outils calibrés pour son métier, parfaitement connectés aux flux vitaux de l'hôpital.
            </p>
          </div>

          {/* Asymmetric Bento Grid Composition */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
            
            {/* Bento Card 1: DPI & Triage (Span 7) */}
            <div className="lg:col-span-7 bg-slate-50/70 rounded-3xl border border-slate-200/90 p-6 sm:p-8 flex flex-col justify-between transition-all hover:bg-white hover:border-slate-300 hover:shadow-lg group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100/80 text-teal-700 flex items-center justify-center font-bold">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-slate-200/70 text-slate-700">
                    Cœur Clinique
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                  Dossier Patient Informatisé (DPI) & Triage Urgences
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Centralisation des antécédents, constantes hémodynamiques (PA, FC, SpO2, Température), calcul automatisé du score de gravité clinique et prescription électronique sécurisée sans ressaisie.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200/80 grid grid-cols-3 gap-3 text-center font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-sans block">Consultations</span>
                  <span className="font-bold text-slate-800">100% Numériques</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-sans block">Transmission</span>
                  <span className="font-bold text-teal-700">Instantanée</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-sans block">Historique</span>
                  <span className="font-bold text-slate-800">Inviolable</span>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Pharmacie GS1 (Span 5) */}
            <div className="lg:col-span-5 bg-slate-50/70 rounded-3xl border border-slate-200/90 p-6 sm:p-8 flex flex-col justify-between transition-all hover:bg-white hover:border-slate-300 hover:shadow-lg group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-700 flex items-center justify-center font-bold">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    &lt; 5 ms
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                  Pharmacie PUI & Traçabilité GS1
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Scan douchette Code 128 / Datamatrix 2D instantané, vérification des numéros de lot, alertes péremption et contrôle de la chaîne du froid (2-8°C / -80°C).
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Zéro dispensation non vérifiée
                </span>
                <span className="font-mono text-slate-700">Stock temps réel</span>
              </div>
            </div>

            {/* Bento Card 3: Régulation des lits (Span 4) */}
            <div className="lg:col-span-4 bg-slate-50/70 rounded-3xl border border-slate-200/90 p-6 sm:p-8 flex flex-col justify-between transition-all hover:bg-white hover:border-slate-300 hover:shadow-lg group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100/80 text-teal-700 flex items-center justify-center font-bold">
                    <BedDouble className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-slate-200/70 text-slate-700">
                    Flux Séjours
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                  Régulation des Lits & Admissions
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tableau de bord dynamique d'occupation des chambres, coordination des transferts et libération rapide des lits avec statut de désinfection.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/80 text-[11px] text-slate-500 font-mono flex justify-between">
                <span>Occupation globale</span>
                <span className="font-bold text-teal-800">94% optimisée</span>
              </div>
            </div>

            {/* Bento Card 4: Biotech & Cryogénie (Span 4) */}
            <div className="lg:col-span-4 bg-slate-50/70 rounded-3xl border border-slate-200/90 p-6 sm:p-8 flex flex-col justify-between transition-all hover:bg-white hover:border-slate-300 hover:shadow-lg group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-100/80 text-cyan-700 flex items-center justify-center font-bold">
                    <Dna className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200">
                    LIMS & -80°C
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-800 transition-colors">
                  Laboratoire & Biobanque Cryogénique
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cartographie 2D des cryotubes en azote liquide, gestion des consentements de recherche et intégration des panels de biologie moléculaire.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/80 text-[11px] text-slate-500 font-mono flex justify-between">
                <span>Normes</span>
                <span className="font-bold text-slate-700">ISO 15189 / 20387</span>
              </div>
            </div>

            {/* Bento Card 5: Facturation & HDS (Span 4) */}
            <div className="lg:col-span-4 bg-slate-50/70 rounded-3xl border border-slate-200/90 p-6 sm:p-8 flex flex-col justify-between transition-all hover:bg-white hover:border-slate-300 hover:shadow-lg group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Audit HDS
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  Facturation Hospitalière & Sécurité
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Télétransmission sécurisée, gestion des tiers payants et journal d'audit médico-légal infalsifiable conformément aux exigences réglementaires.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/80 text-[11px] text-slate-500 font-mono flex justify-between">
                <span>Audit trail</span>
                <span className="font-bold text-emerald-700">100% Immuable</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          5. SECTION DÉDIÉE : BIOTECHNOLOGIES & PHARMACOGÉNOMIQUE (PGX)
          ========================================================================= */}
      <section id="biotech" className="py-20 bg-slate-50 border-y border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-100/70 px-3.5 py-1.5 rounded-full border border-teal-200 inline-flex items-center gap-1.5">
              <Dna className="w-3.5 h-3.5" />
              <span>Médecine Personnalisée & Génomique Clinique</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Pôle Biotechnologies & Intercepteur Pharmacogénomique (PGx)
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              1 prescription sur 12 présente un risque de toxicité ou d'inefficacité liée au génotype du patient. SoftCare intègre les règles de décision internationales <strong>CPIC</strong> et <strong>DPWG</strong> directement dans le flux de prescription.
            </p>
          </div>

          {/* Interactive PGx Interceptor Console */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Gene Selection Column (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Sélectionner un polymorphisme génétique à tester :
              </h3>

              <button
                onClick={() => setSelectedGene('CYP2C19')}
                className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
                  selectedGene === 'CYP2C19'
                    ? 'bg-slate-900 text-white border-transparent shadow-lg shadow-slate-900/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm">CYP2C19</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedGene === 'CYP2C19' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-800'
                    }`}>
                      Métaboliseur Lent (*2/*2)
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${selectedGene === 'CYP2C19' ? 'text-slate-300' : 'text-slate-500'}`}>
                    Cardiologie • Clopidogrel (Plavix) & IPP
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 opacity-70" />
              </button>

              <button
                onClick={() => setSelectedGene('DPYD')}
                className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
                  selectedGene === 'DPYD'
                    ? 'bg-slate-900 text-white border-transparent shadow-lg shadow-slate-900/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm">DPYD</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedGene === 'DPYD' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-800'
                    }`}>
                      Déficit Majeur (*2A)
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${selectedGene === 'DPYD' ? 'text-slate-300' : 'text-slate-500'}`}>
                    Oncologie • 5-Fluorouracile (5-FU) & Capécitabine
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 opacity-70" />
              </button>

              <button
                onClick={() => setSelectedGene('CYP2D6')}
                className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
                  selectedGene === 'CYP2D6'
                    ? 'bg-slate-900 text-white border-transparent shadow-lg shadow-slate-900/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm">CYP2D6</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedGene === 'CYP2D6' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                    }`}>
                      Métaboliseur Ultra-Rapide
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${selectedGene === 'CYP2D6' ? 'text-slate-300' : 'text-slate-500'}`}>
                    Antalgie / Psychiatrie • Codéine, Tramadol & Antidépresseurs
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 opacity-70" />
              </button>

              <button
                onClick={() => setSelectedGene('SLCO1B1')}
                className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
                  selectedGene === 'SLCO1B1'
                    ? 'bg-slate-900 text-white border-transparent shadow-lg shadow-slate-900/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm">SLCO1B1</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedGene === 'SLCO1B1' ? 'bg-white/20 text-white' : 'bg-cyan-100 text-cyan-800'
                    }`}>
                      Transporteur Hépatique (*5)
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${selectedGene === 'SLCO1B1' ? 'text-slate-300' : 'text-slate-500'}`}>
                    Lipidologie • Simvastatine & Risque Rhabdomyolyse
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 opacity-70" />
              </button>
            </div>

            {/* Decision Engine Display (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-slate-900">Intercepteur PGx en Temps Réel</h4>
                    <p className="text-xs text-slate-600">Règle de décision clinique : Consortium CPIC Niveau 1A</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Moteur Actif</span>
                </span>
              </div>

              {selectedGene === 'CYP2C19' && (
                <div className="space-y-4 animate-page-enter">
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>Alerte Bloquante : Inefficacité Thérapeutique du Clopidogrel</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Le patient est porteur du génotype <strong>CYP2C19 *2/*2</strong> (absence d'enzyme fonctionnelle). La bioactivation du Clopidogrel est compromise, entraînant un sur-risque majeur de thrombose de stent coronarien.
                    </p>
                  </div>

                  <div className="p-4 bg-teal-50/90 rounded-2xl border border-teal-200 space-y-2">
                    <span className="text-xs font-bold text-teal-900 uppercase tracking-wider block">
                      Conduite Clinique Recommandée :
                    </span>
                    <p className="text-xs text-slate-800 leading-relaxed">
                      <ArrowRight className="w-4 h-4 inline mr-1 text-teal-700" /> <strong>Remplacer immédiatement</strong> par le <strong>Prasugrel (10 mg/j)</strong> ou le <strong>Ticagrélor (90 mg x2/j)</strong>, dont l'efficacité antiagrégante ne dépend pas du CYP2C19.
                    </p>
                  </div>
                </div>
              )}

              {selectedGene === 'DPYD' && (
                <div className="space-y-4 animate-page-enter">
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>Alerte Majeure : Risque de Toxicité Létale aux Fluoropyrimidines</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Déficit en Dihydropyrimidine Déshydrogénase (DPD) génotype <strong>DPYD *2A</strong>. Risque d'aplasie médullaire sévère et de mucite de grade 4 dès la première cure de chimiothérapie.
                    </p>
                  </div>

                  <div className="p-4 bg-teal-50/90 rounded-2xl border border-teal-200 space-y-2">
                    <span className="text-xs font-bold text-teal-900 uppercase tracking-wider block">
                      Conduite Clinique Recommandée :
                    </span>
                    <p className="text-xs text-slate-800 leading-relaxed">
                      <ArrowRight className="w-4 h-4 inline mr-1 text-teal-700" /> <strong>Contre-indication absolue</strong> du 5-FU et de la Capécitabine. Réévaluation obligatoire en Réunion de Concertation Pluridisciplinaire (RCP) Oncologique.
                    </p>
                  </div>
                </div>
              )}

              {selectedGene === 'CYP2D6' && (
                <div className="space-y-4 animate-page-enter">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>Alerte : Métabolisation Ultra-Rapide de la Codéine</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Multiplication génique du CYP2D6 provoquant une conversion massive et ultra-rapide de la codéine en morphine active. Risque élevé de surdosage et dépression respiratoire.
                    </p>
                  </div>

                  <div className="p-4 bg-teal-50/90 rounded-2xl border border-teal-200 space-y-2">
                    <span className="text-xs font-bold text-teal-900 uppercase tracking-wider block">
                      Conduite Clinique Recommandée :
                    </span>
                    <p className="text-xs text-slate-800 leading-relaxed">
                      <ArrowRight className="w-4 h-4 inline mr-1 text-teal-700" /> <strong>Proscrire les prodrogues opioïdes</strong> (Codéine, Tramadol). Privilégier des antalgiques dont la clairance ne dépend pas du CYP2D6 (Morphine titrée ou Paracétamol).
                    </p>
                  </div>
                </div>
              )}

              {selectedGene === 'SLCO1B1' && (
                <div className="space-y-4 animate-page-enter">
                  <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-cyan-800 font-bold text-sm">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>Alerte Myopathie : Transporteur Hépatique SLCO1B1 Altéré</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Baisse de la clairance hépatique de la Simvastatine avec accumulation plasmatique et risque de rhabdomyolyse multiplié par 5.
                    </p>
                  </div>

                  <div className="p-4 bg-teal-50/90 rounded-2xl border border-teal-200 space-y-2">
                    <span className="text-xs font-bold text-teal-900 uppercase tracking-wider block">
                      Conduite Clinique Recommandée :
                    </span>
                    <p className="text-xs text-slate-800 leading-relaxed">
                      👉 <strong>Privilégier la Rosuvastatine</strong> à dose modérée ou l'Atorvastatine avec surveillance périodique des enzymes musculaires (CPK).
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Directives CPIC & PharmGKB 2026 intégrées
                </span>
                <button
                  onClick={onGoToLogin}
                  className="text-teal-800 hover:text-teal-950 font-bold flex items-center gap-1"
                >
                  Tester dans le module DPI complet <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          6. SECTION DÉDIÉE : INTELLIGENCE ARTIFICIELLE CLINIQUE (CDS HOOKS)
          ========================================================================= */}
      <section id="ai" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider bg-cyan-50 px-3.5 py-1.5 rounded-full border border-cyan-200 inline-flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" />
              <span>Aide à la Décision Médicale (CDS Hooks)</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Intelligence Clinique & Diagnostic Différentiel
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Un co-pilote probabiliste qui assiste le médecin au moment du triage sans jamais se substituer à son jugement. Analyse croisée des constantes, antécédents et symptômes en direct.
            </p>
          </div>

          {/* Interactive AI Diagnostic Simulator */}
          <div className="bg-slate-50/70 rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8">
            
            {/* Scenario Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                Sélectionner un cas clinique d'urgence :
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setSelectedScenario(0)}
                  className={`p-3.5 rounded-2xl text-left border transition-all text-xs ${
                    selectedScenario === 0
                      ? 'bg-slate-900 text-white border-transparent font-bold shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="block font-bold">Cas 1 : Urgence Coronarienne</span>
                  <span className={`text-[11px] font-normal ${selectedScenario === 0 ? 'text-slate-300' : 'text-slate-500'}`}>
                    Douleur thoracique constrictive
                  </span>
                </button>

                <button
                  onClick={() => setSelectedScenario(1)}
                  className={`p-3.5 rounded-2xl text-left border transition-all text-xs ${
                    selectedScenario === 1
                      ? 'bg-slate-900 text-white border-transparent font-bold shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="block font-bold">Cas 2 : Pneumologie & Sepsis</span>
                  <span className={`text-[11px] font-normal ${selectedScenario === 1 ? 'text-slate-300' : 'text-slate-500'}`}>
                    Fièvre et détresse respiratoire
                  </span>
                </button>

                <button
                  onClick={() => setSelectedScenario(2)}
                  className={`p-3.5 rounded-2xl text-left border transition-all text-xs ${
                    selectedScenario === 2
                      ? 'bg-slate-900 text-white border-transparent font-bold shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="block font-bold">Cas 3 : Neurologie Aiguë</span>
                  <span className={`text-[11px] font-normal ${selectedScenario === 2 ? 'text-slate-300' : 'text-slate-500'}`}>
                    Céphalée en coup de tonnerre
                  </span>
                </button>
              </div>
            </div>

            {/* Simulation Results Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-slate-200">
              
              {/* Left Column: Clinical Presentation */}
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1.5 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-600 uppercase">Profil Patient :</span>
                  <p className="text-xs font-semibold text-slate-900">{aiScenarios[selectedScenario].patient}</p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1.5 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-600 uppercase">Anamnèse & Symptomatologie :</span>
                  <p className="text-xs text-slate-800 leading-relaxed italic">
                    "{aiScenarios[selectedScenario].symptoms}"
                  </p>
                </div>

                <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 space-y-1.5">
                  <span className="text-[11px] font-bold text-teal-900 uppercase">Examens Prioritaires Recommandés :</span>
                  <p className="text-xs text-teal-950 font-medium">
                    {aiScenarios[selectedScenario].recommendations}
                  </p>
                </div>
              </div>

              {/* Right Column: Calculated Hypotheses */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Hypothèses Diagnostiques Différentielles Calculées :
                </h4>

                <div className="space-y-3">
                  {aiScenarios[selectedScenario].hypothesis.map((h, i) => (
                    <div key={i} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-900">{h.title}</span>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            h.urgency === 'Urgence Vitale' || h.urgency === 'Critique'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {h.urgency}
                          </span>
                          <span className="font-mono font-bold text-teal-700">{h.prob}%</span>
                        </div>
                      </div>

                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-teal-600 to-cyan-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${h.prob}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={onGoToLogin}
                    className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-700 text-white rounded-xl text-xs font-bold shadow-md hover:from-teal-700 hover:to-cyan-800 transition-all flex items-center gap-2"
                  >
                    <span>Lancer l'assistant sur un cas réel</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          7. WORKFLOW HOSPITALIER INTÉGRÉ — Le parcours de soin unifié
          ========================================================================= */}
      <section id="workflow" className="py-20 bg-slate-50 border-t border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider bg-slate-200 px-3.5 py-1 rounded-full">
              Parcours de Soins Fluide
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              De l'admission aux soins : zéro rupture d'information
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Une chaîne de transmission numérique ininterrompue entre médecins, infirmiers, biologistes et pharmaciens.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5 relative">
              <span className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-mono font-bold flex items-center justify-center">
                1
              </span>
              <h4 className="font-bold text-sm text-slate-900">Admission & Triage</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Scan carte vitale / identité, constantes hémodynamiques et affectation immédiate du lit d'accueil.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5 relative">
              <span className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-mono font-bold flex items-center justify-center">
                2
              </span>
              <h4 className="font-bold text-sm text-slate-900">Dossier Médical (DPI)</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Observation clinique, antécédents, assistance diagnostique IA et prescription informatisée.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5 relative">
              <span className="w-7 h-7 rounded-full bg-teal-700 text-white text-xs font-mono font-bold flex items-center justify-center">
                3
              </span>
              <h4 className="font-bold text-sm text-slate-900">Contrôle PGx Direct</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Intercepteur pharmacogénomique bloquant toute molécule incompatible avec le profil génétique.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5 relative">
              <span className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-mono font-bold flex items-center justify-center">
                4
              </span>
              <h4 className="font-bold text-sm text-slate-900">Pharmacie & Scan GS1</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Dispensation robotisée à la douchette en &lt; 5ms, vérification des lots et décompte de stock PUI.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5 relative">
              <span className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-mono font-bold flex items-center justify-center">
                5
              </span>
              <h4 className="font-bold text-sm text-slate-900">Sortie & Facturation</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Télétransmission SESAM-Vitale / Tiers payant, archivage médico-légal HDS et libération du lit.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          8. SÉCURITÉ, SOUVERAINETÉ & CONFIANCE HDS
          ========================================================================= */}
      <section id="securite" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-8 sm:p-14 text-white space-y-8 relative overflow-hidden">
            <div className="max-w-3xl space-y-3 relative z-10">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-500/30 inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Certification & Souveraineté Hospitalière</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Données de santé hébergées en environnement HDS certifié
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                SoftCare répond aux exigences les plus strictes de l'Agence du Numérique en Santé (ANS) et du RGPD. Chiffrement de bout en bout AES-256 des dossiers patients et intégrité totale garantie.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 relative z-10 text-xs">
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-1">
                <p className="font-bold text-white">Chiffrement AES-256</p>
                <p className="text-slate-400 text-[11px]">En transit (TLS 1.3) et au repos sur disques sécurisés.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-1">
                <p className="font-bold text-white">Traçabilité Médico-Légale</p>
                <p className="text-slate-400 text-[11px]">Piste d'audit horodatée pour chaque accès et prescription.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-1">
                <p className="font-bold text-white">Continuité Opérationnelle</p>
                <p className="text-slate-400 text-[11px]">Redondance active multi-sites et reprise d'activité garantie.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          9. TÉMOIGNAGES & RÔLES HOSPITALIERS
          ========================================================================= */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Validé par les praticiens et cadres hospitaliers
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Conçu avec les équipes de terrain pour éliminer les lourdeurs administratives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                "L'intercepteur pharmacogénomique sur le CYP2C19 sécurise immédiatement nos décisions d'angioplastie d'urgence. Le gain de sérénité pour l'équipe médicale est inestimable."
              </p>
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                  PL
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Pr. Laurent Meyer</p>
                  <p className="text-[10px] text-slate-500">Chef de Service Cardiologie • CHU</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                "La détection instantanée des codes-barres GS1 et la gestion intégrée des lots éliminent tout risque d'erreur lors de la délivrance hospitalière."
              </p>
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                  CB
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Dr. Claire Bernard</p>
                  <p className="text-[10px] text-slate-500">Pharmacienne Hospitalière en Chef (PUI)</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                "La vision temps réel de l'occupation des lits a transformé notre gestion des urgences. Moins d'attente pour les patients et une régulation sans friction."
              </p>
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-xs">
                  MK
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Dr. Marc Kerviel</p>
                  <p className="text-[10px] text-slate-500">Coordonnateur des Soins & Admissions</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          10. FINAL CONVERSION BANNER (APPEL À L'ACTION INSTITUTIONNEL)
          ========================================================================= */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Prêt à doter votre établissement de la plateforme SoftCare ?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Connectez-vous immédiatement à votre espace de soins ou prenez contact avec nos ingénieurs médicaux pour une démonstration personnalisée en CHU ou clinique.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={onGoToLogin}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 active:scale-[0.98] text-white rounded-xl font-bold text-sm shadow-lg shadow-teal-700/20 transition-all flex items-center justify-center gap-2"
            >
              <Stethoscope className="w-4 h-4 text-teal-100" />
              <span>Accéder à l'espace soignant</span>
              <ArrowRight className="w-4 h-4 text-white/80" />
            </button>

            <button
              onClick={() => setShowDemoModal(true)}
              className="w-full sm:w-auto px-7 py-3.5 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-800 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4 text-slate-600" />
              <span>Demander une démo dédiée</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          11. FOOTER INSTITUTIONNEL — Harmonisé, Rigoureux et Accessible
          ========================================================================= */}
      <footer className="bg-slate-900 text-slate-300 py-12 sm:py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Col 1: Brand & Description */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-white">SoftCare</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Système d'Information Hospitalier (SIH) nouvelle génération. Dossier patient, pharmacie PUI, biotechnologies et IA clinique unifiés.
              </p>
              <span className="inline-block text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-teal-300 border border-slate-700">
                Hospital OS v2.4 • HDS Certifié
              </span>
            </div>

            {/* Col 2: Modules Cliniques */}
            <div className="space-y-2 text-xs">
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">Modules Clés</p>
              <ul className="space-y-1.5 text-slate-400">
                <li><a href="#modules" onClick={(e) => scrollToSection(e, 'modules')} className="hover:text-white transition-colors">Dossier Patient Informatisé (DPI)</a></li>
                <li><a href="#modules" onClick={(e) => scrollToSection(e, 'modules')} className="hover:text-white transition-colors">Pharmacie & Traçabilité GS1</a></li>
                <li><a href="#modules" onClick={(e) => scrollToSection(e, 'modules')} className="hover:text-white transition-colors">Régulation des Lits & Admissions</a></li>
                <li><a href="#biotech" onClick={(e) => scrollToSection(e, 'biotech')} className="hover:text-white transition-colors">Biotechnologies & Biobanque -80°C</a></li>
              </ul>
            </div>

            {/* Col 3: Spécialités Médicales */}
            <div className="space-y-2 text-xs">
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">Innovations de Soin</p>
              <ul className="space-y-1.5 text-slate-400">
                <li><a href="#biotech" onClick={(e) => scrollToSection(e, 'biotech')} className="hover:text-white transition-colors">Intercepteur PGx (CPIC / DPWG)</a></li>
                <li><a href="#ai" onClick={(e) => scrollToSection(e, 'ai')} className="hover:text-white transition-colors">Aide au Diagnostic CDS Hooks</a></li>
                <li><a href="#workflow" onClick={(e) => scrollToSection(e, 'workflow')} className="hover:text-white transition-colors">Workflow Hospitalier H24</a></li>
                <li><a href="#securite" onClick={(e) => scrollToSection(e, 'securite')} className="hover:text-white transition-colors">Chiffrement HDS AES-256</a></li>
              </ul>
            </div>

            {/* Col 4: Accès & Contact */}
            <div className="space-y-3 text-xs">
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">Accès Établissement</p>
              <div className="space-y-2">
                <button
                  onClick={onGoToLogin}
                  className="w-full py-2 px-3 bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white rounded-xl font-bold transition-all text-center block"
                >
                  Connexion Espace Pro
                </button>
                <button
                  onClick={() => setShowDemoModal(true)}
                  className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-colors text-center block"
                >
                  Demande de Démonstration
                </button>
                <button
                  onClick={() => setShowBrochureModal(true)}
                  className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-medium transition-colors text-center flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-teal-400" />
                  <span>Brochure Médicale PDF</span>
                </button>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 SoftCare Hospital System. Tous droits réservés.</p>
            <div className="flex items-center gap-6 text-[11px]">
              <span className="hover:text-slate-400 transition-colors">Conformité ANS / HDS</span>
              <span className="hover:text-slate-400 transition-colors">Mentions Légales RGPD</span>
              <span className="hover:text-slate-400 transition-colors">Secret Médical Préservé</span>
            </div>
          </div>

        </div>
      </footer>

      {/* =========================================================================
          MODALS — Brochure & Demo Request Modals (Full Hospital Workflows)
          ========================================================================= */}
      <BrochureModal
        isOpen={showBrochureModal}
        onClose={() => setShowBrochureModal(false)}
      />

      <DemoRequestModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
      />

    </div>
  );
};

export default LandingPage;
