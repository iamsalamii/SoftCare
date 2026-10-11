import React, { useState, useEffect } from 'react';
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

  // Hospital-style ECG Initialization Loader
  const [isInitializing, setIsInitializing] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [initStep, setInitStep] = useState("Initialisation du noyau clinique hospitalier...");
  const [initProgress, setInitProgress] = useState(8);

  // Interactive PGx Simulation state
  const [selectedGene, setSelectedGene] = useState<'CYP2C19' | 'DPYD' | 'CYP2D6' | 'SLCO1B1'>('CYP2C19');

  // Interactive AI Assistant Simulation state
  const [selectedScenario, setSelectedScenario] = useState<number>(0);

  const aiScenarios = [
    {
      symptoms: "Douleur thoracique rétro-sternale constrictive irradiant au bras gauche, dyspnée d'effort, sueurs.",
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

  useEffect(() => {
    let current = 12;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 8) + 6;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setInitProgress(100);
        setInitStep('Système hospitalier synchronisé • Bienvenue');
        setTimeout(() => setIsFadingOut(true), 240);
        setTimeout(() => setIsInitializing(false), 620);
      } else {
        setInitProgress(current);
        if (current > 72) {
          setInitStep("Calibration de l'espace de régulation des soins...");
        } else if (current > 38) {
          setInitStep('Synchronisation des flux DPI & pharmacie sécurisée...');
        } else {
          setInitStep('Initialisation du noyau clinique hospitalier...');
        }
      }
    }, 55);

    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  // Full-Screen Immersive Medical Loading Experience (Restored)
  if (isInitializing) {
    return (
      <div 
        role="status" 
        aria-live="polite"
        className={`fixed inset-0 z-50 bg-gradient-to-b from-slate-50 via-white to-teal-50/25 flex flex-col justify-between items-center py-8 sm:py-12 px-6 select-none transition-all duration-500 ease-out ${
          isFadingOut ? 'opacity-0 scale-[1.01] pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        {/* Full-Screen Ambient Radiance */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-teal-500/10 rounded-full blur-[160px] pointer-events-none animate-pulse-ring" />
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:32px_32px]" />

        {/* Top Header Row */}
        <div className="w-full max-w-5xl mx-auto flex items-center justify-between text-xs text-slate-400 font-medium relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span className="font-semibold text-slate-600">SoftCare</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span>Environnement Haute Précision</span>
            <span>•</span>
            <span className="text-teal-700 font-semibold">Connexion Active</span>
          </div>
        </div>

        {/* Centerpiece */}
        <div className="w-full max-w-2xl mx-auto text-center space-y-7 relative z-10 py-6">
          {/* Central Rotating Orbital Ring & Radiant Medical Emblem */}
          <div className="relative mx-auto w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-dashed border-teal-500/40 animate-spin-slow">
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-teal-500 rounded-full shadow-[0_0_14px_#0d9488] ring-4 ring-white" />
            </div>

            <div className="absolute inset-3 rounded-full bg-teal-500/15 animate-pulse-ring pointer-events-none" />

            <div className="relative w-18 h-18 sm:w-20 sm:h-20 bg-gradient-to-br from-teal-600 via-cyan-600 to-teal-700 rounded-3xl shadow-2xl shadow-teal-700/35 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-shimmer-sweep pointer-events-none" />
              <Activity className="w-9 h-9 sm:w-10 sm:h-10 text-white relative z-10" />
            </div>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 font-sans">
              SoftCare
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium uppercase tracking-widest">
              Système d'Information Hospitalier
            </p>
          </div>

          {/* Dynamic Heartbeat ECG Waveform Spanning the Center Screen */}
          <div className="relative h-14 w-full max-w-lg mx-auto overflow-hidden px-4 flex items-center justify-center">
            <div className="absolute left-0 right-0 h-px bg-slate-200/80" />
            <svg className="w-full h-10 stroke-teal-600 fill-none" viewBox="0 0 400 40">
              <path
                d="M 0 20 L 140 20 L 155 5 L 170 35 L 185 8 L 200 28 L 215 20 L 400 20"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-ecg-draw"
              />
            </svg>
          </div>

          {/* Big Percentage & Fluid Progress */}
          <div className="space-y-3 max-w-md mx-auto">
            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
              <span className="text-slate-600 flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                <span className="truncate">{initStep}</span>
              </span>
              <span className="text-teal-700 font-mono text-base font-bold flex-shrink-0">
                {initProgress}%
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden p-0.5 border border-slate-200/70 shadow-inner">
              <div
                className="bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 h-full rounded-full transition-all duration-200 ease-out shadow-[0_0_14px_rgba(20,184,166,0.6)]"
                style={{ width: `${initProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Clinical Telemetry Bar */}
        <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-slate-400 border-t border-slate-200/60 pt-4 relative z-10">
          <div className="flex items-center gap-3">
            <span className="text-slate-600 font-semibold">SÉCURITÉ SANTÉ ACTIVE</span>
            <span>•</span>
            <span className="text-teal-700 font-semibold">LATENCE &lt; 4MS</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-700 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>CONTINUITÉ DE SERVICE 100% OPÉRATIONNELLE</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-teal-600 selection:text-white animate-in fade-in duration-300 scroll-smooth">
      {/* =========================================================================
          1. NAVIGATION HEADER — Strict Single-Line Alignment
          ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo brand */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-teal-600 to-cyan-700 rounded-2xl flex items-center justify-center shadow-md shadow-teal-700/20 text-white flex-shrink-0">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 block leading-none">
                SoftCare
              </span>
              <span className="text-[10px] text-teal-700 font-bold tracking-widest uppercase mt-1 block">
                Système Hospitalier
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links — Strictly Single Line (whitespace-nowrap) */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-7 text-xs font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap">
            <a
              href="#modules"
              onClick={(e) => scrollToSection(e, 'modules')}
              className="hover:text-teal-700 transition-colors py-2 whitespace-nowrap"
            >
              Modules Hospitaliers
            </a>
            <a
              href="#biotech"
              onClick={(e) => scrollToSection(e, 'biotech')}
              className="hover:text-teal-700 transition-colors py-2 flex items-center gap-1.5 whitespace-nowrap"
            >
              <Dna className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>Biotechnologies & PGx</span>
            </a>
            <a
              href="#ai"
              onClick={(e) => scrollToSection(e, 'ai')}
              className="hover:text-teal-700 transition-colors py-2 flex items-center gap-1.5 whitespace-nowrap"
            >
              <Brain className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
              <span>IA Clinique (CDS)</span>
            </a>
            <a
              href="#workflow"
              onClick={(e) => scrollToSection(e, 'workflow')}
              className="hover:text-teal-700 transition-colors py-2 whitespace-nowrap"
            >
              Workflow de Soins
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => setShowBrochureModal(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-teal-800 hover:bg-slate-100 rounded-xl transition-all whitespace-nowrap cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-600" />
              <span>Brochure (PDF)</span>
            </button>

            <button
              onClick={() => setShowDemoModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-all whitespace-nowrap cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Demander Démo</span>
            </button>

            <button
              onClick={onGoToLogin}
              className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-teal-700/20 active:scale-[0.98] transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-100" />
              <span className="hidden md:inline">Espace Soignant</span>
              <span className="md:hidden">Connexion</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/80 hidden md:inline" />
            </button>

            {/* Mobile menu burger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition-colors flex-shrink-0 cursor-pointer"
              aria-label="Ouvrir le menu de navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-xl px-4 py-4 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-150">
            <a
              href="#modules"
              onClick={(e) => scrollToSection(e, 'modules')}
              className="block px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-100 hover:text-teal-700 transition-colors"
            >
              Modules Hospitaliers & DPI
            </a>
            <a
              href="#biotech"
              onClick={(e) => scrollToSection(e, 'biotech')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-100 hover:text-teal-700 transition-colors"
            >
              <Dna className="w-4 h-4 text-teal-600" />
              <span>Biotechnologies & PGx</span>
            </a>
            <a
              href="#ai"
              onClick={(e) => scrollToSection(e, 'ai')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-100 hover:text-teal-700 transition-colors"
            >
              <Brain className="w-4 h-4 text-cyan-600" />
              <span>Intelligence Clinique (CDS)</span>
            </a>
            <a
              href="#workflow"
              onClick={(e) => scrollToSection(e, 'workflow')}
              className="block px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-100 hover:text-teal-700 transition-colors"
            >
              Workflow de Soins Unifié
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
          2. HERO SECTION — Immersive Hospital Backdrop, High Editorial Contrast
          ========================================================================= */}
      <section className="relative overflow-hidden pt-12 sm:pt-16 pb-16 lg:pb-24 bg-slate-950 text-white border-b border-slate-800">
        {/* Real Medical Hero Photographic Background with Dark Gradient Blend */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-luminosity scale-105 pointer-events-none"
          style={{ backgroundImage: "url('/images/hospital_modern_hero.jpg')" }}
        />
        {/* Radiant Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/85 to-slate-950 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-tr from-teal-500/15 via-cyan-500/15 to-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8 relative z-10">
          
          {/* Concept Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-teal-400/30 text-teal-200 text-xs font-semibold shadow-lg shadow-teal-500/10 animate-hero-cascade hero-stagger-1">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>Plateforme Hospitalière Intégrée</span>
            <span className="text-teal-400/60">•</span>
            <span className="text-teal-100">Excellence Clinique</span>
          </div>

          {/* Master Headline */}
          <div className="space-y-3 max-w-4xl mx-auto px-1 animate-hero-cascade hero-stagger-2">
            <h1 className="text-2xl sm:text-4xl lg:text-6xl xl:text-7xl font-black tracking-tight text-white leading-tight">
              L'excellence clinique et opérationnelle.{' '}
              <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-teal-300 via-cyan-200 to-emerald-300 bg-clip-text text-transparent">
                Unifiée au chevet du patient.
              </span>
            </h1>
            <p className="text-sm sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal pt-2">
              SoftCare centralise le Dossier Patient Informatisé (DPI), la pharmacie robotisée GS1, la régulation des lits et l'intercepteur pharmacogénomique au sein d'une plateforme sécurisée, souveraine et ultra-rapide.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 animate-hero-cascade hero-stagger-3">
            <button
              onClick={onGoToLogin}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 active:scale-[0.98] text-white rounded-xl font-bold text-sm shadow-xl shadow-teal-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 text-teal-100" />
              <span>Accéder à l'espace soignant</span>
              <ArrowRight className="w-4 h-4 text-white/80" />
            </button>

            <button
              onClick={() => setShowDemoModal(true)}
              className="w-full sm:w-auto px-7 py-4 bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white border border-white/20 rounded-xl font-bold text-sm backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-teal-300" />
              <span>Planifier une démo établissement</span>
            </button>

            <button
              onClick={() => setShowBrochureModal(true)}
              className="w-full sm:w-auto px-6 py-4 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>Brochure médicale (PDF)</span>
            </button>
          </div>

          {/* Clinical Telemetry Bar */}
          <div className="py-2 flex items-center justify-center gap-3 sm:gap-6 text-[10px] sm:text-[11px] font-mono text-slate-300 flex-wrap px-2 animate-hero-cascade hero-stagger-4">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white">Serveur CHU : En Ligne</span>
            </div>
            <span className="text-slate-600">•</span>
            <div>
              <span>Douchette GS1 : </span>
              <span className="text-teal-300 font-bold">&lt; 5 ms</span>
            </div>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <div className="hidden sm:block">
              <span>Sécurité : </span>
              <span className="text-white font-semibold">Chiffrement AES-256</span>
            </div>
            <span className="text-slate-600 hidden md:inline">•</span>
            <div className="hidden md:block">
              <span>Continuité : </span>
              <span className="text-emerald-400 font-bold">100% 24h/24</span>
            </div>
          </div>

          {/* Centerpiece: Real Interactive Hospital Showcase */}
          <div className="pt-2 sm:pt-4 animate-hero-cascade hero-stagger-5">
            <InteractiveHospitalMap />
          </div>

          {/* Core Verifiable Hospital Metrics */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto animate-hero-cascade hero-stagger-6">
            <div className="p-4 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 text-left transition-all hover:border-slate-700">
              <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">100%</p>
              <p className="text-xs text-slate-300 font-bold mt-1">Traçabilité clinique</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Dossier patient, constantes et ordonnances unifiés</p>
            </div>
            <div className="p-4 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 text-left transition-all hover:border-slate-700">
              <p className="text-2xl sm:text-3xl font-extrabold text-teal-400 font-mono">&lt; 5 ms</p>
              <p className="text-xs text-slate-300 font-bold mt-1">Scan douchette GS1</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Identification boîte, lot et péremption immédiate</p>
            </div>
            <div className="p-4 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 text-left transition-all hover:border-slate-700">
              <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">18 000+</p>
              <p className="text-xs text-slate-300 font-bold mt-1">Séjours coordonnés</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Gestion fluide des lits, transferts et sorties</p>
            </div>
            <div className="p-4 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 text-left transition-all hover:border-slate-700">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">99.9%</p>
              <p className="text-xs text-slate-300 font-bold mt-1">Disponibilité garantie</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Architecture haute résilience pour services d'urgences</p>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          3. MODULES CLINIQUES — Visual Cards with Real Photography & Badges
          ========================================================================= */}
      <section id="modules" className="py-20 bg-slate-50 border-b border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 border border-teal-200 px-3.5 py-1 rounded-full">
              Écosystème Hospitalier Modulaire
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Des modules spécialisés pour chaque service hospitalier
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Une architecture unifiée qui supprime les silos d'information entre praticiens, pharmaciens, soignants et gestionnaires.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: DPI */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-300 overflow-hidden flex flex-col group">
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src="/images/medical_doctor_care.jpg"
                  alt="Dossier Patient Informatisé"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md text-teal-700 flex items-center justify-center font-bold shadow-md">
                  <Stethoscope className="w-5 h-5" />
                </div>
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    Dossier Patient Informatisé (DPI)
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                    Consultations, antécédents, constantes hémodynamiques, ordonnances électroniques et historique des séjours centralisés sans ressaisie.
                  </p>
                </div>
                <div className="pt-3 flex items-center gap-2 text-[11px] font-semibold text-teal-700">
                  <span>Prescription &amp; Constantes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Card 2: Pharmacie */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-300 overflow-hidden flex flex-col group">
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src="/images/hospital_smart_pharmacy.jpg"
                  alt="Pharmacie & Traçabilité GS1"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md text-teal-700 flex items-center justify-center font-bold shadow-md">
                  <QrCode className="w-5 h-5" />
                </div>
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    Pharmacie PUI, Traçabilité &amp; POS
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                    Scan douchette en moins de 5ms, gestion des lots, surveillance de la chaîne du froid et distribution sécurisée des médicaments.
                  </p>
                </div>
                <div className="pt-3 flex items-center gap-2 text-[11px] font-semibold text-teal-700">
                  <span>Scan GS1 DataMatrix &amp; Stock</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Card 3: Biotech & PGx */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-300 overflow-hidden flex flex-col group">
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src="/images/hospital_genetics_biotech.jpg"
                  alt="Biotechnologies & Pharmacogénomique"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md text-teal-700 flex items-center justify-center font-bold shadow-md">
                  <Dna className="w-5 h-5" />
                </div>
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    Biotechnologies &amp; Pharmacogénomique (PGx)
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                    Interception automatique des interactions gène-médicament (CYP2C19, DPYD) et gestion de biobanque cryogénique avec cartographie des cuves.
                  </p>
                </div>
                <div className="pt-3 flex items-center gap-2 text-[11px] font-semibold text-teal-700">
                  <span>Médecine de Précision</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Card 4: AI CDS */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-300 overflow-hidden flex flex-col group">
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src="/images/precision_medicine_banner.jpg"
                  alt="Aide au Diagnostic Clinique IA"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md text-cyan-700 flex items-center justify-center font-bold shadow-md">
                  <Brain className="w-5 h-5" />
                </div>
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    Aide au Diagnostic Clinique (CDS)
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                    Hypothèses différentielles probabilistes en temps réel, alertes de criticité et examens complémentaires recommandés.
                  </p>
                </div>
                <div className="pt-3 flex items-center gap-2 text-[11px] font-semibold text-cyan-700">
                  <span>Intelligence Clinique</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Card 5: Admissions & Lits */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-300 overflow-hidden flex flex-col group">
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src="/images/hospital_emergency_icu.jpg"
                  alt="Régulation des Lits & Admissions"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md text-teal-700 flex items-center justify-center font-bold shadow-md">
                  <BedDouble className="w-5 h-5" />
                </div>
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    Régulation des Lits &amp; Admissions
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                    Planification des séjours, gestion des chambres, transferts inter-services et suivi du taux d'occupation hospitalier en direct.
                  </p>
                </div>
                <div className="pt-3 flex items-center gap-2 text-[11px] font-semibold text-teal-700">
                  <span>Gestion des Flux &amp; SSPI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Card 6: Lab & Facturation */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-300 overflow-hidden flex flex-col group">
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src="/images/medical_lab_tubes.jpg"
                  alt="Plateau Technique & Analyses"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md text-teal-700 flex items-center justify-center font-bold shadow-md">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    Plateau Technique, Facturation &amp; Audit
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                    Prescription d'analyses, suivi biologique, facturation hospitalière intégrée et traçabilité inviolable des actes médicaux.
                  </p>
                </div>
                <div className="pt-3 flex items-center gap-2 text-[11px] font-semibold text-teal-700">
                  <span>Traçabilité &amp; Facturation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          4. PARCOURS DE SOIN — "De l'admission aux soins : zéro rupture d'information"
             WITH REAL PHOTOGRAPHIC ILLUSTRATIONS
          ========================================================================= */}
      <section id="workflow" className="py-20 bg-white border-b border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider bg-teal-50 border border-teal-200 px-3.5 py-1 rounded-full">
              Parcours de Soins Fluide
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              De l'admission aux soins : zéro rupture d'information
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Une chaîne de transmission numérique ininterrompue entre médecins, infirmiers, biologistes et pharmaciens.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            
            {/* Step 1 */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col group hover:border-teal-300 transition-all">
              <div className="relative h-32 w-full overflow-hidden bg-slate-200">
                <img
                  src="/images/hospital_emergency_icu.jpg"
                  alt="Admission & Triage"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-mono font-bold flex items-center justify-center shadow-md">
                  1
                </div>
              </div>
              <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Admission &amp; Triage</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    Identification patient, recueil des constantes hémodynamiques et affectation immédiate du lit d'accueil.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col group hover:border-teal-300 transition-all">
              <div className="relative h-32 w-full overflow-hidden bg-slate-200">
                <img
                  src="/images/medical_doctor_care.jpg"
                  alt="Dossier Médical"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-mono font-bold flex items-center justify-center shadow-md">
                  2
                </div>
              </div>
              <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Dossier Médical (DPI)</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    Observation clinique, antécédents, assistance diagnostique et prescription informatisée.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col group hover:border-teal-300 transition-all">
              <div className="relative h-32 w-full overflow-hidden bg-slate-200">
                <img
                  src="/images/hospital_genetics_biotech.jpg"
                  alt="Contrôle PGx"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-teal-700 text-white text-xs font-mono font-bold flex items-center justify-center shadow-md">
                  3
                </div>
              </div>
              <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Contrôle PGx Direct</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    Intercepteur pharmacogénomique bloquant en temps réel toute molécule incompatible avec le profil génétique.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col group hover:border-teal-300 transition-all">
              <div className="relative h-32 w-full overflow-hidden bg-slate-200">
                <img
                  src="/images/hospital_smart_pharmacy.jpg"
                  alt="Pharmacie & Scan GS1"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-mono font-bold flex items-center justify-center shadow-md">
                  4
                </div>
              </div>
              <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Pharmacie &amp; Scan GS1</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    Dispensation robotisée à la douchette en &lt; 5ms, vérification des lots et décompte de stock PUI.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col group hover:border-teal-300 transition-all">
              <div className="relative h-32 w-full overflow-hidden bg-slate-200">
                <img
                  src="/images/medical_stethoscope.jpg"
                  alt="Sortie & Clôture"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-mono font-bold flex items-center justify-center shadow-md">
                  5
                </div>
              </div>
              <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Sortie &amp; Facturation</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    Clôture du dossier médical, émission des reçus de sortie et libération instantanée du lit d'hospitalisation.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          5. BIOTECH & PHARMACOGÉNOMIQUE (PGx) — Interactive Simulator
          ========================================================================= */}
      <section id="biotech" className="py-20 bg-slate-50 border-b border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider bg-teal-50 border border-teal-200 px-3.5 py-1 rounded-full">
              Pôle Biotechnologies &amp; Médecine Personnalisée
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Intercepteur Pharmacogénomique en Temps Réel
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Sécurisez vos prescriptions en confrontant chaque molécule au profil métabolique du patient avant toute délivrance.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Simulation d'Interférence Gène-Médicament</h3>
                <p className="text-xs text-slate-500">Sélectionnez un gène pour visualiser l'interception automatique.</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {(['CYP2C19', 'DPYD', 'CYP2D6', 'SLCO1B1'] as const).map(gene => (
                  <button
                    key={gene}
                    onClick={() => setSelectedGene(gene)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedGene === gene
                        ? 'bg-teal-700 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {gene}
                  </button>
                ))}
              </div>
            </div>

            {/* Gene display panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Polymorphisme Génomique</span>
                <p className="text-xl font-black text-slate-900 font-mono">{selectedGene} *2/*2</p>
                <p className="text-xs text-slate-600">
                  {selectedGene === 'CYP2C19' && 'Métaboliseur lent homozygote. Perte complète d\'activité de bio-activation.'}
                  {selectedGene === 'DPYD' && 'Déficit enzymatique sévère en dihydropyrimidine déshydrogénase.'}
                  {selectedGene === 'CYP2D6' && 'Métaboliseur ultra-rapide. Risque élevé de surdosage en métabolites actifs.'}
                  {selectedGene === 'SLCO1B1' && 'Transporteur hépatique ralenti. Risque de myopathie aiguë.'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Médicament Prescrit</span>
                <p className="text-xl font-black text-amber-950 font-mono">
                  {selectedGene === 'CYP2C19' && 'Clopidogrel (Plavix) 75mg'}
                  {selectedGene === 'DPYD' && '5-Fluorouracile (5-FU) / Capécitabine'}
                  {selectedGene === 'CYP2D6' && 'Codéine / Tramadol'}
                  {selectedGene === 'SLCO1B1' && 'Simvastatine 40mg'}
                </p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 text-[11px] font-bold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Interaction Critique Détectée</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-teal-50/80 border border-teal-200 space-y-3">
                <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">Recommandation du Système</span>
                <p className="text-sm font-bold text-teal-950">
                  {selectedGene === 'CYP2C19' && 'Substituer par Prasugrel ou Ticagrelor (voie indépendante du CYP2C19).'}
                  {selectedGene === 'DPYD' && 'Contre-indication absolue. Réduction posologique de 75% ou alternative.'}
                  {selectedGene === 'CYP2D6' && 'Remplacer par analgésique non métabolisé par CYP2D6 (Morphine faible).'}
                  {selectedGene === 'SLCO1B1' && 'Remplacer par Rosuvastatine ou Pravastatine.'}
                </p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-100 text-teal-900 text-[11px] font-bold">
                  <Check className="w-3.5 h-3.5" />
                  <span>Interception Automatique</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          6. INTELLIGENCE CLINIQUE (CDS HOOKS) — Simulation & Hypothèses
          ========================================================================= */}
      <section id="ai" className="py-20 bg-white border-b border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider bg-cyan-50 border border-cyan-200 px-3.5 py-1 rounded-full">
              Intelligence Clinique &amp; CDS Hooks
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Aide au Diagnostic et Détection Précoce
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Assistance diagnostique probabiliste analysant les symptômes, signes vitaux et facteurs de risque en temps réel.
            </p>
          </div>

          <div className="bg-slate-50 rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Cas Cliniques Démonstratifs</span>
              <div className="flex gap-2">
                {aiScenarios.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedScenario(idx)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedScenario === idx
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Cas #{idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Données d'Observation</span>
                <div>
                  <p className="text-xs font-bold text-slate-500">Profil Patient</p>
                  <p className="text-sm font-semibold text-slate-900">{aiScenarios[selectedScenario].patient}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500">Symptomatologie</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{aiScenarios[selectedScenario].symptoms}</p>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-500">Examens Complémentaires Suggérés</p>
                  <p className="text-xs text-teal-800 font-medium mt-1">{aiScenarios[selectedScenario].recommendations}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Hypothèses Différentielles Calculées</span>
                <div className="space-y-3">
                  {aiScenarios[selectedScenario].hypothesis.map((h, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800">{h.title}</span>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            h.urgency === 'Critique' || h.urgency === 'Urgence Vitale'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {h.urgency}
                          </span>
                          <span className="font-mono text-teal-700">{h.prob}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-teal-600 to-cyan-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${h.prob}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          7. CTA SECTION — Planification de Démo
          ========================================================================= */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-teal-400/30 text-teal-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span>Déploiement Hospitalier Simplifié</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Prêt à moderniser votre infrastructure clinique ?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Planifiez une démonstration sur mesure avec nos experts cliniques ou accédez directement à l'espace soignant pour tester les fonctionnalités en conditions réelles.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <button
              onClick={() => setShowDemoModal(true)}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 active:scale-[0.98] text-white rounded-xl font-bold text-sm shadow-xl shadow-teal-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-white" />
              <span>Demander une démo dédiée</span>
            </button>

            <button
              onClick={onGoToLogin}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white border border-white/20 rounded-xl font-bold text-sm backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 text-teal-300" />
              <span>Accéder à l'espace soignant</span>
              <ArrowRight className="w-4 h-4 text-white/80" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. FOOTER INSTITUTIONNEL — Clean & Non-certifications
          ========================================================================= */}
      <footer className="bg-slate-950 text-slate-400 py-12 sm:py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Col 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-white">SoftCare</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Système d'Information Hospitalier unifié. Dossier patient, pharmacie PUI, biotechnologies et IA clinique centralisés.
              </p>
              <span className="inline-block text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-900 text-teal-300 border border-slate-800">
                Plateforme Clinique v2.4
              </span>
            </div>

            {/* Col 2 */}
            <div className="space-y-2 text-xs">
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">Modules Clés</p>
              <ul className="space-y-1.5 text-slate-400">
                <li><a href="#modules" onClick={(e) => scrollToSection(e, 'modules')} className="hover:text-white transition-colors">Dossier Patient Informatisé (DPI)</a></li>
                <li><a href="#modules" onClick={(e) => scrollToSection(e, 'modules')} className="hover:text-white transition-colors">Pharmacie &amp; Traçabilité GS1</a></li>
                <li><a href="#modules" onClick={(e) => scrollToSection(e, 'modules')} className="hover:text-white transition-colors">Régulation des Lits &amp; Admissions</a></li>
                <li><a href="#biotech" onClick={(e) => scrollToSection(e, 'biotech')} className="hover:text-white transition-colors">Biotechnologies &amp; Biobanque</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-2 text-xs">
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">Innovations Cliniques</p>
              <ul className="space-y-1.5 text-slate-400">
                <li><a href="#biotech" onClick={(e) => scrollToSection(e, 'biotech')} className="hover:text-white transition-colors">Intercepteur PGx en direct</a></li>
                <li><a href="#ai" onClick={(e) => scrollToSection(e, 'ai')} className="hover:text-white transition-colors">Aide au Diagnostic CDS Hooks</a></li>
                <li><a href="#workflow" onClick={(e) => scrollToSection(e, 'workflow')} className="hover:text-white transition-colors">Workflow Hospitalier Unifié</a></li>
                <li><span className="text-slate-500">Chiffrement Avancé AES-256</span></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div className="space-y-3 text-xs">
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">Accès Établissement</p>
              <div className="space-y-2">
                <button
                  onClick={onGoToLogin}
                  className="w-full py-2 px-3 bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white rounded-xl font-bold transition-all text-center block cursor-pointer"
                >
                  Connexion Espace Soignant
                </button>
                <button
                  onClick={() => setShowDemoModal(true)}
                  className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-colors text-center block cursor-pointer"
                >
                  Demande de Démonstration
                </button>
                <button
                  onClick={() => setShowBrochureModal(true)}
                  className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-medium transition-colors text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-teal-400" />
                  <span>Brochure Médicale (PDF)</span>
                </button>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 SoftCare Hospital System. Tous droits réservés.</p>
            <div className="flex items-center gap-6 text-[11px]">
              <span>Haute Disponibilité H24</span>
              <span>•</span>
              <span>Confidentialité Médicale Assurée</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
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
