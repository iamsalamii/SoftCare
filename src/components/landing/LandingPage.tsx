import React, { useState, useEffect } from 'react';
import {
  Activity, Shield, Heart, Dna, Brain, QrCode, ArrowRight,
  CheckCircle2, Users, BedDouble, Stethoscope, Clock, Award,
  Sparkles, Lock, Building2, ChevronRight, Phone, Mail, MapPin,
  FileText, Download, BookOpen, HeartPulse, AlertTriangle, Check,
  Thermometer, Search, RefreshCw, Send, Layers, Play, Menu, X, Snowflake
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

  useEffect(() => {
    // Dynamic fluid progression with wow-factor micro-stages
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
    }, 65);

    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Full-Screen Immersive Medical Loading Experience
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

        {/* Top Header Row of Full Page */}
        <div className="w-full max-w-5xl mx-auto flex items-center justify-between text-xs text-slate-400 font-medium relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span className="font-semibold text-slate-600">SoftCare Hospital System</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span>Environnement Haute Précision</span>
            <span>•</span>
            <span className="text-teal-700 font-semibold">Connexion Active</span>
          </div>
        </div>

        {/* Centerpiece (Breathes freely on full screen without container) */}
        <div className="w-full max-w-2xl mx-auto text-center space-y-7 relative z-10 py-6">
          
          {/* Central Rotating Orbital Ring & Radiant Medical Emblem */}
          <div className="relative mx-auto w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
            {/* Outer Orbital Dashed Ring with slow continuous rotation */}
            <div className="absolute inset-0 rounded-full border border-dashed border-teal-500/40 animate-spin-slow">
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-teal-500 rounded-full shadow-[0_0_14px_#0d9488] ring-4 ring-white" />
            </div>

            {/* Inner Concentric Breathing Pulse Aura */}
            <div className="absolute inset-3 rounded-full bg-teal-500/15 animate-pulse-ring pointer-events-none" />

            {/* Center Crystal Tile with Shimmer Sweep */}
            <div className="relative w-18 h-18 sm:w-20 sm:h-20 bg-gradient-to-br from-teal-600 via-cyan-600 to-teal-700 rounded-3xl shadow-2xl shadow-teal-700/35 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-shimmer-sweep pointer-events-none" />
              <Activity className="w-9 h-9 sm:w-10 sm:h-10 text-white relative z-10" />
            </div>
          </div>

          {/* SoftCare Title & Subtitle (Clean, no PRO badge) */}
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

            {/* Glowing Slender Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden p-0.5 border border-slate-200/70 shadow-inner">
              <div
                className="bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 h-full rounded-full transition-all duration-200 ease-out shadow-[0_0_14px_rgba(20,184,166,0.6)]"
                style={{ width: `${initProgress}%` }}
              />
            </div>
          </div>

        </div>

        {/* Bottom Institutional Telemetry Bar */}
        <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-slate-400 border-t border-slate-200/60 pt-4 relative z-10">
          <div className="flex items-center gap-3">
            <span className="text-slate-600 font-semibold">SÉCURITÉ SANTÉ ACTIVE</span>
            <span>•</span>
            <span className="text-teal-700 font-semibold">LATENCE &lt; 4MS</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-700 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>CONTINUITÉ DE SERVICE 100% GARANTIE</span>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-cyan-500 selection:text-white animate-in fade-in duration-300 scroll-smooth">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/25 flex-shrink-0">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                SoftCare
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <a
              href="#features"
              onClick={(e) => scrollToSection(e, 'features')}
              className="hover:text-cyan-600 transition-colors"
            >
              Fonctionnalités
            </a>
            <a
              href="#biotech"
              onClick={(e) => scrollToSection(e, 'biotech')}
              className="hover:text-cyan-600 transition-colors flex items-center gap-1.5"
            >
              <Dna className="w-4 h-4 text-cyan-600" />
              <span>Biotech & PGx</span>
            </a>
            <a
              href="#ai"
              onClick={(e) => scrollToSection(e, 'ai')}
              className="hover:text-cyan-600 transition-colors flex items-center gap-1.5"
            >
              <Brain className="w-4 h-4 text-teal-600" />
              <span>Intelligence Clinique</span>
            </a>
            <button
              onClick={() => setShowBrochureModal(true)}
              className="text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-cyan-600" />
              <span>Brochure Médicale</span>
            </button>
            <button
              onClick={() => setShowDemoModal(true)}
              className="text-cyan-700 hover:text-cyan-900 font-bold transition-colors"
            >
              <span>Demander une Démo</span>
            </button>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onGoToLogin}
              className="px-3.5 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-teal-600/25 transition-all hover:scale-[1.02] flex items-center gap-1.5 sm:gap-2"
            >
              <span className="hidden xs:inline">Espace Pro</span>
              <span className="xs:hidden">Connexion</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 md:hidden transition-colors"
              aria-label="Menu principal"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/98 backdrop-blur-lg px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-4 duration-200 shadow-xl">
            <a
              href="#features"
              onClick={(e) => {
                scrollToSection(e, 'features');
                setIsMobileMenuOpen(false);
              }}
              className="block px-4 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-cyan-50 hover:text-cyan-700 transition-colors"
            >
              Fonctionnalités
            </a>
            <a
              href="#biotech"
              onClick={(e) => {
                scrollToSection(e, 'biotech');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-cyan-50 hover:text-cyan-700 transition-colors"
            >
              <Dna className="w-4 h-4 text-cyan-600" />
              <span>Biotech & Pharmacogénomique (PGx)</span>
            </a>
            <a
              href="#ai"
              onClick={(e) => {
                scrollToSection(e, 'ai');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
            >
              <Brain className="w-4 h-4 text-teal-600" />
              <span>Intelligence Artificielle Clinique</span>
            </a>
            <button
              onClick={() => {
                setShowBrochureModal(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-teal-700 hover:bg-teal-50 transition-colors text-left"
            >
              <BookOpen className="w-4 h-4 text-cyan-600" />
              <span>Brochure Médicale Complète</span>
            </button>
            <button
              onClick={() => {
                setShowDemoModal(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full px-4 py-3 rounded-xl text-sm font-bold text-cyan-700 hover:bg-cyan-50 transition-colors text-left"
            >
              <span>Demander une Démo Personnalisée</span>
            </button>
          </div>
        )}
      </header>

      {/* Hero Section — Premium Clinical & Institutional Experience */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-18 lg:pb-28 bg-gradient-to-b from-slate-50 via-white to-slate-50/80 text-slate-900 border-b border-slate-200/80">
        {/* Subtle, soft clinical background accents */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-teal-500/5 blur-[120px] rounded-full pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8 relative z-10">
          {/* Master Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.12]">
            Toute la puissance de votre hôpital.{' '}
            <span className="block mt-1 sm:mt-2 text-teal-700">
              Un seul espace.
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            SoftCare centralise les opérations hospitalières, les équipes soignantes et les données essentielles pour offrir une vision claire, fluide et coordonnée de votre établissement.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => setShowDemoModal(true)}
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 active:scale-[0.98] text-white rounded-xl font-bold text-sm shadow-md shadow-teal-700/20 motion-fast hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <span>Découvrir SoftCare</span>
              <ArrowRight className="w-4 h-4 text-teal-100" />
            </button>

            <button
              onClick={onGoToLogin}
              className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-800 border border-slate-200/90 rounded-xl font-bold text-sm shadow-2xs motion-fast hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Stethoscope className="w-4 h-4 text-teal-600" />
              <span>Accéder à l'espace</span>
            </button>

            <button
              onClick={() => setShowBrochureModal(true)}
              className="w-full sm:w-auto px-5 py-3.5 text-slate-600 hover:text-slate-900 font-semibold text-xs sm:text-sm motion-fast flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span>Brochure médicale PDF</span>
            </button>
          </div>

          {/* Visual Showcase: SoftCare Hospital Product UI Composition */}
          <div className="pt-6 sm:pt-8 pb-2">
            <InteractiveHospitalMap />
          </div>

          {/* Core Institutional Metrics */}
          <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs text-left transition-all hover:border-slate-300">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">100%</p>
              <p className="text-xs text-slate-700 font-semibold mt-1">Traçabilité clinique</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Dossier patient et pharmacie unifiés</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs text-left transition-all hover:border-slate-300">
              <p className="text-2xl sm:text-3xl font-extrabold text-teal-700">-35%</p>
              <p className="text-xs text-slate-700 font-semibold mt-1">Délais de transmission</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Coordination directe inter-services</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs text-left transition-all hover:border-slate-300">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">18k+</p>
              <p className="text-xs text-slate-700 font-semibold mt-1">Séjours coordonnés</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Gestion continue des lits et soins</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs text-left transition-all hover:border-slate-300">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">99.9%</p>
              <p className="text-xs text-slate-700 font-semibold mt-1">Disponibilité garantie</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Continuité opérationnelle 24h/24</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-slate-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
              Architecture Modulaire
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Des modules spécialisés pour chaque service
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Conçu pour fluidifier les transmissions et éliminer les ruptures d'informations entre praticiens, pharmaciens et équipes soignantes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: DPI */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-cyan-200 transition-all duration-300 overflow-hidden flex flex-col group">
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                <img
                  src="/images/medical_stethoscope.jpg"
                  alt="Dossier Patient Informatisé"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md text-cyan-600 flex items-center justify-center font-bold shadow-md">
                  <Stethoscope className="w-5 h-5" />
                </div>
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-cyan-700 transition-colors">
                    Dossier Patient Informatisé (DPI)
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed mt-1.5">
                    Consultations, antécédents, constantes hémodynamiques, ordonnances électroniques et historique des séjours centralisés.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Pharmacie */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-teal-200 transition-all duration-300 overflow-hidden flex flex-col group">
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                <img
                  src="/images/medical_pharmacy_pills.jpg"
                  alt="Pharmacie Hospitalière et Médicaments"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md text-teal-600 flex items-center justify-center font-bold shadow-md">
                  <QrCode className="w-5 h-5" />
                </div>
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-teal-700 transition-colors">
                    Pharmacie, Traçabilité & POS
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed mt-1.5">
                    Moteur d'encodage Code 128 / QR Code 2D vectoriel, gestion des lots, chaîne du froid (2-8°C / -80°C) et caisse délivrance.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Biotech */}
            <a
              href="#biotech"
              onClick={(e) => scrollToSection(e, 'biotech')}
              className="bg-white rounded-3xl border border-cyan-100 shadow-sm hover:shadow-xl hover:border-cyan-300 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
            >
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                <img
                  src="/images/precision_medicine_banner.jpg"
                  alt="Biotechnologies et Médecine de Précision"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md text-emerald-600 flex items-center justify-center font-bold shadow-md">
                  <Dna className="w-5 h-5" />
                </div>
                <span className="absolute top-3 right-3 text-[10px] bg-cyan-600 text-white font-bold px-2.5 py-1 rounded-full shadow-md">
                  Médecine Personnalisée
                </span>
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-cyan-700 transition-colors">
                      Biotechnologies & PGx
                    </h3>
                    <span className="text-xs text-cyan-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Explorer <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mt-1.5">
                    Analyse des polymorphismes génétiques (*CYP2C19, CYP2D6, DPYD*), prévention des toxicités et LIMS biobanque cryogénique.
                  </p>
                </div>
              </div>
            </a>

            {/* Card 4: AI Clinical */}
            <a
              href="#ai"
              onClick={(e) => scrollToSection(e, 'ai')}
              className="bg-white rounded-3xl border border-teal-100 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
            >
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                <img
                  src="/images/medical_doctor_care.jpg"
                  alt="Aide au Diagnostic Clinique IA"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md text-teal-600 flex items-center justify-center font-bold shadow-md">
                  <Brain className="w-5 h-5" />
                </div>
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-700 transition-colors">
                      Aide au Diagnostic Clinique IA
                    </h3>
                    <span className="text-xs text-teal-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Tester <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mt-1.5">
                    Calcul d'hypothèses diagnostiques différentielles probabilistes, protocoles CDS Hooks et recommandations d'examens.
                  </p>
                </div>
              </div>
            </a>

            {/* Card 5: Beds & Admissions */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-teal-200 transition-all duration-300 overflow-hidden flex flex-col group">
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                <img
                  src="/images/hospital_emergency_icu.jpg"
                  alt="Admissions et Gestion des Lits"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md text-teal-600 flex items-center justify-center font-bold shadow-md">
                  <BedDouble className="w-5 h-5" />
                </div>
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-teal-700 transition-colors">
                    Admissions & Gestion des Lits
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed mt-1.5">
                    Planification des séjours, gestion des chambres, transferts inter-services et suivi du taux d'occupation hospitalier en direct.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 6: Lab & Billing */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 overflow-hidden flex flex-col group">
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                <img
                  src="/images/medical_lab_tubes.jpg"
                  alt="Laboratoire et Facturation Hospitalière"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md text-emerald-600 flex items-center justify-center font-bold shadow-md">
                  <Shield className="w-5 h-5" />
                </div>
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                    Laboratoire, Facturation & Audit
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed mt-1.5">
                    Émission de factures hospitalières normalisées, gestion des tiers payants et conformité RGPD / HDS avec chiffrement fort.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION CLINICAL ATMOSPHERE & VISUAL SHOWCASE WITH REAL MEDICAL IMAGERY */}
      <section className="py-24 bg-gradient-to-b from-slate-950 via-teal-950 to-slate-950 text-white relative overflow-hidden">
        {/* Subtle animated medical grid and ECG background line */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -right-32 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-14">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest bg-cyan-900/60 px-4 py-1.5 rounded-full border border-cyan-500/30 inline-flex items-center gap-2 shadow-inner">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Immersion Hospitalière Connectée</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Une infrastructure taillée pour les <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">environnements critiques</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Du chevet du patient aux séquenceurs ADN du laboratoire, SoftCare synchronise l'ensemble des flux vitaux en temps réel avec une traçabilité sans faille.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Visual Card 1: Urgences & Réanimation */}
            <div className="group relative bg-slate-900/90 border border-slate-800 hover:border-cyan-400/80 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/20 flex flex-col justify-between">
              {/* Image Preview Header */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                <img
                  src="/images/hospital_emergency_icu.jpg"
                  alt="Urgences et Soins Intensifs"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                <span className="absolute top-3 left-3 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-950/80 text-cyan-300 border border-cyan-400/30 backdrop-blur-md">
                  Urgences / SAU
                </span>
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-xl bg-cyan-500/80 backdrop-blur-md text-white flex items-center justify-center shadow-md">
                  <HeartPulse className="w-4 h-4 animate-pulse" />
                </div>
              </div>

              <div className="p-6 space-y-2">
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">Triage & Télémétrie H24</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Acquisition des constantes physiologiques, calcul automatisé des scores de gravité clinique et alertes précoces en cas de désaturation.
                </p>
              </div>

              <div className="p-6 pt-0 mt-auto">
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-cyan-300 font-semibold">
                  <span>Latence triage</span>
                  <span className="font-mono bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-500/30">&lt; 15 sec</span>
                </div>
              </div>
            </div>

            {/* Visual Card 2: Pharmacie Robotisée */}
            <div className="group relative bg-slate-900/90 border border-slate-800 hover:border-teal-400/80 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-teal-500/20 flex flex-col justify-between">
              {/* Image Preview Header */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                <img
                  src="/images/hospital_smart_pharmacy.jpg"
                  alt="Pharmacie Robotisée et Traçabilité"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                <span className="absolute top-3 left-3 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-950/80 text-teal-300 border border-teal-400/30 backdrop-blur-md">
                  PUI Hospitalière
                </span>
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-xl bg-teal-500/80 backdrop-blur-md text-white flex items-center justify-center shadow-md">
                  <QrCode className="w-4 h-4" />
                </div>
              </div>

              <div className="p-6 space-y-2">
                <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">Dispensation & Robotique</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Scan douchette Code 128 / Datamatrix 2D instantané, gestion rigoureuse de la chaîne du froid (2-8°C) et inventaires perpétuels.
                </p>
              </div>

              <div className="p-6 pt-0 mt-auto">
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-teal-300 font-semibold">
                  <span>Scan douchette</span>
                  <span className="font-mono bg-teal-950/80 px-2 py-0.5 rounded-md border border-teal-500/30">&lt; 5 ms</span>
                </div>
              </div>
            </div>

            {/* Visual Card 3: Biobanque & NGS */}
            <div className="group relative bg-slate-900/90 border border-slate-800 hover:border-emerald-400/80 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20 flex flex-col justify-between">
              {/* Image Preview Header */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                <img
                  src="/images/hospital_genetics_biotech.jpg"
                  alt="Biobanque et Génomique"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                <span className="absolute top-3 left-3 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-950/80 text-emerald-300 border border-emerald-400/30 backdrop-blur-md">
                  Biobanque -80°C
                </span>
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-xl bg-emerald-500/80 backdrop-blur-md text-white flex items-center justify-center shadow-md">
                  <Snowflake className="w-4 h-4" />
                </div>
              </div>

              <div className="p-6 space-y-2">
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">Cryoconservation & NGS</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Cartographie 2D des cryotubes en azote liquide, gestion des consentements éclairés et panels de pharmacogénomique de haute précision.
                </p>
              </div>

              <div className="p-6 pt-0 mt-auto">
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-emerald-300 font-semibold">
                  <span>Directives</span>
                  <span className="font-mono bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/30">CPIC / DPWG</span>
                </div>
              </div>
            </div>

            {/* Visual Card 4: Intelligence Clinique */}
            <div className="group relative bg-slate-900/90 border border-slate-800 hover:border-cyan-400/80 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/20 flex flex-col justify-between">
              {/* Image Preview Header */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                <img
                  src="/images/hospital_modern_hero.jpg"
                  alt="Assistant Clinique IA"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                <span className="absolute top-3 left-3 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-950/80 text-cyan-300 border border-cyan-400/30 backdrop-blur-md">
                  CDS Hooks
                </span>
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-xl bg-cyan-500/80 backdrop-blur-md text-white flex items-center justify-center shadow-md">
                  <Brain className="w-4 h-4" />
                </div>
              </div>

              <div className="p-6 space-y-2">
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">Assistant Clinique IA</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Moteur de diagnostic différentiel probabiliste, contrôle des interactions médicamenteuses et protocoles thérapeutiques validés.
                </p>
              </div>

              <div className="p-6 pt-0 mt-auto">
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-cyan-300 font-semibold">
                  <span>Interactions</span>
                  <span className="font-mono bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-500/30">100% Temps Réel</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1 DÉDIÉE : BIOTECHNOLOGIES & PHARMACOGÉNOMIQUE (PGX) */}
      <section id="biotech" className="py-24 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider bg-cyan-50 px-3.5 py-1.5 rounded-full border border-cyan-200 flex items-center gap-1.5 w-fit mx-auto">
              <Dna className="w-4 h-4" />
              <span>Médecine Personnalisée & Génomique Clinique</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900">
              Pôle Biotechnologies & Pharmacogénomique (PGx)
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Sécurisez vos prescriptions grâce à l'intercepteur pharmacogénomique automatique conforme aux consortiums internationaux <strong>CPIC</strong> et <strong>DPWG</strong>.
            </p>
          </div>

          {/* Biotech Visual Lab Banner */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-cyan-100 max-h-72 w-full group">
            <img
              src="/images/hospital_genetics_biotech.jpg"
              alt="Plateforme de Génétique Moléculaire et Biobanque"
              className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-cyan-950/70 to-transparent flex flex-col justify-center p-8 sm:p-12 text-white">
              <span className="text-[10px] uppercase font-mono font-bold px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 rounded-full w-fit mb-2 backdrop-blur-md">
                Laboratoire de Séquençage & Biobanque Cryogénique
              </span>
              <h3 className="text-xl sm:text-2xl font-black max-w-lg leading-snug">
                Intégration native des panels pharmacogénomiques au lit du patient
              </h3>
              <p className="text-xs text-cyan-100/80 max-w-md mt-2 hidden sm:block">
                Contrôle instantané des incompatibilités moléculaires dès la prescription médicale ou lors de la dispensation en pharmacie.
              </p>
            </div>
          </div>

          {/* Interactive PGx Interceptor Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Gene Selection Column */}
            <div className="lg:col-span-5 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">
                Sélectionner un polymorphisme génétique :
              </h3>

              <button
                onClick={() => setSelectedGene('CYP2C19')}
                className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
                  selectedGene === 'CYP2C19'
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white border-transparent shadow-lg shadow-cyan-600/20'
                    : 'bg-slate-50 border-gray-200 hover:bg-slate-100 text-gray-900'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm">CYP2C19</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedGene === 'CYP2C19' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-800'}`}>
                      Métaboliseur Lent (*2/*2)
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${selectedGene === 'CYP2C19' ? 'text-cyan-100' : 'text-gray-500'}`}>
                    Cardiologie • Clopidogrel (Plavix) & IPP
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 opacity-70" />
              </button>

              <button
                onClick={() => setSelectedGene('DPYD')}
                className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
                  selectedGene === 'DPYD'
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white border-transparent shadow-lg shadow-cyan-600/20'
                    : 'bg-slate-50 border-gray-200 hover:bg-slate-100 text-gray-900'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm">DPYD</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedGene === 'DPYD' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-800'}`}>
                      Déficit Majeur (*2A)
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${selectedGene === 'DPYD' ? 'text-cyan-100' : 'text-gray-500'}`}>
                    Oncologie • 5-Fluorouracile (5-FU) & Capécitabine
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 opacity-70" />
              </button>

              <button
                onClick={() => setSelectedGene('CYP2D6')}
                className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
                  selectedGene === 'CYP2D6'
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white border-transparent shadow-lg shadow-cyan-600/20'
                    : 'bg-slate-50 border-gray-200 hover:bg-slate-100 text-gray-900'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm">CYP2D6</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedGene === 'CYP2D6' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'}`}>
                      Métaboliseur Ultra-Rapide
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${selectedGene === 'CYP2D6' ? 'text-cyan-100' : 'text-gray-500'}`}>
                    Antalgie / Psychiatrie • Codéine, Tramadol & Antidépresseurs
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 opacity-70" />
              </button>

              <button
                onClick={() => setSelectedGene('SLCO1B1')}
                className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
                  selectedGene === 'SLCO1B1'
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white border-transparent shadow-lg shadow-cyan-600/20'
                    : 'bg-slate-50 border-gray-200 hover:bg-slate-100 text-gray-900'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm">SLCO1B1</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedGene === 'SLCO1B1' ? 'bg-white/20 text-white' : 'bg-cyan-100 text-cyan-800'}`}>
                      Transporteur Hépatique (*5)
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${selectedGene === 'SLCO1B1' ? 'text-cyan-100' : 'text-gray-500'}`}>
                    Lipidologie • Simvastatine & Risque Rhabdomyolyse
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 opacity-70" />
              </button>
            </div>

            {/* Live Interceptor Decision Engine Display (Clean Medical Harmonized Aesthetic) */}
            <div className="lg:col-span-7 bg-white text-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-cyan-100 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-gray-900">Intercepteur PGx en Temps Réel</h4>
                    <p className="text-xs text-gray-500">Règle de décision clinique : Consortium CPIC Niveau 1A</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Moteur Actif</span>
                </span>
              </div>

              {selectedGene === 'CYP2C19' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>Alerte Bloquante : Inefficacité Thérapeutique du Clopidogrel</span>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      Le patient est porteur du génotype <strong>CYP2C19 *2/*2</strong> (absence d'enzyme fonctionnelle). La bioactivation du Clopidogrel est compromise, entraînant un sur-risque majeur de thrombose de stent coronarien.
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-teal-50/80 to-cyan-50/80 rounded-2xl border border-teal-200 space-y-2">
                    <span className="text-xs font-bold text-teal-900 uppercase tracking-wider block">
                      Conduite Clinique Recommandée :
                    </span>
                    <p className="text-xs text-gray-800 leading-relaxed">
                      👉 <strong>Remplacer immédiatement</strong> par le <strong>Prasugrel (10 mg/j)</strong> ou le <strong>Ticagrélor (90 mg x2/j)</strong>, dont l'efficacité antiagrégante ne dépend pas du CYP2C19.
                    </p>
                  </div>
                </div>
              )}

              {selectedGene === 'DPYD' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>Alerte Majeure : Risque de Toxicité Létale aux Fluoropyrimidines</span>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      Déficit en Dihydropyrimidine Déshydrogénase (DPD) génotype <strong>DPYD *2A</strong>. Risque d'aplasie médullaire sévère et de mucite de grade 4 dès la première cure.
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-teal-50/80 to-cyan-50/80 rounded-2xl border border-teal-200 space-y-2">
                    <span className="text-xs font-bold text-teal-900 uppercase tracking-wider block">
                      Conduite Clinique Recommandée :
                    </span>
                    <p className="text-xs text-gray-800 leading-relaxed">
                      👉 <strong>Contre-indication absolue</strong> du 5-FU et de la Capécitabine. Réévaluation en Réunion de Concertation Pluridisciplinaire (RCP) Oncologique.
                    </p>
                  </div>
                </div>
              )}

              {selectedGene === 'CYP2D6' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>Alerte : Métabolisation Ultra-Rapide de la Codéine</span>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      Multiplication génique du CYP2D6 provoquant une transformation massive et ultra-rapide de la codéine en morphine. Risque de surdosage et dépression respiratoire.
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-teal-50/80 to-cyan-50/80 rounded-2xl border border-teal-200 space-y-2">
                    <span className="text-xs font-bold text-teal-900 uppercase tracking-wider block">
                      Conduite Clinique Recommandée :
                    </span>
                    <p className="text-xs text-gray-800 leading-relaxed">
                      👉 <strong>Proscrire les prodrogues opioïdes</strong> (Codéine, Tramadol). Privilégier des antalgiques non métabolisés par le CYP2D6 (Morphine titrée ou Paracétamol/AINS).
                    </p>
                  </div>
                </div>
              )}

              {selectedGene === 'SLCO1B1' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-cyan-800 font-bold text-sm">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>Alerte Myopathie : Transporteur Hépatique SLCO1B1 Altéré</span>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      Baisse de la clairance hépatique de la Simvastatine avec accumulation plasmatique et risque de rhabdomyolyse x5.
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-teal-50/80 to-cyan-50/80 rounded-2xl border border-teal-200 space-y-2">
                    <span className="text-xs font-bold text-teal-900 uppercase tracking-wider block">
                      Conduite Clinique Recommandée :
                    </span>
                    <p className="text-xs text-gray-800 leading-relaxed">
                      👉 <strong>Privilégier la Rosuvastatine</strong> à dose modérée ou l'Atorvastatine avec surveillance régulière des enzymes musculaires (CPK).
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Directives CPIC & PharmGKB 2026
                </span>
                <button
                  onClick={onGoToLogin}
                  className="text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1"
                >
                  Ouvrir le Module Biotech Complet <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 DÉDIÉE : INTELLIGENCE CLINIQUE & AIDE AU DIAGNOSTIC */}
      <section id="ai" className="py-24 bg-gradient-to-b from-slate-50 to-cyan-50/40 border-t border-gray-200/80 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-200 flex items-center gap-1.5 w-fit mx-auto">
              <Brain className="w-4 h-4" />
              <span>Aide à la Décision Médicale (CDS Hooks)</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900">
              Intelligence Artificielle & Diagnostic Différentiel
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Un co-pilote clinique probabiliste qui assiste le praticien en analysant les symptômes, antécédents et constantes en temps réel.
            </p>
          </div>

          {/* AI Clinical Assistant Visual Banner */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-teal-100 max-h-72 w-full group">
            <img
              src="/images/medical_doctor_care.jpg"
              alt="Assistant Médical IA et Diagnostic Clinique"
              className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-teal-950/70 to-transparent flex flex-col justify-center p-8 sm:p-12 text-white">
              <span className="text-[10px] uppercase font-mono font-bold px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-400/30 rounded-full w-fit mb-2 backdrop-blur-md">
                Intelligence Clinique CDS Hooks
              </span>
              <h3 className="text-xl sm:text-2xl font-black max-w-lg leading-snug">
                Co-pilote diagnostique temps réel au chevet du patient
              </h3>
              <p className="text-xs text-teal-100/80 max-w-md mt-2 hidden sm:block">
                Analyse croisée des constantes télémétriques, des antécédents et des biomarqueurs pour guider la décision médicale sans latence.
              </p>
            </div>
          </div>

          {/* Interactive AI Diagnostic Simulator */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xl space-y-8">
            {/* Scenario Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Choisir un cas clinique simulé :
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setSelectedScenario(0)}
                  className={`p-3.5 rounded-2xl text-left border transition-all text-xs ${
                    selectedScenario === 0
                      ? 'bg-cyan-50 border-cyan-500 text-cyan-900 font-bold shadow-xs'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="block font-bold">Cas 1 : Urgence Cardiologique</span>
                  <span className="text-[11px] opacity-75 font-normal">Douleur thoracique aiguë</span>
                </button>

                <button
                  onClick={() => setSelectedScenario(1)}
                  className={`p-3.5 rounded-2xl text-left border transition-all text-xs ${
                    selectedScenario === 1
                      ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold shadow-xs'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="block font-bold">Cas 2 : Pneumologie & Sepsis</span>
                  <span className="text-[11px] opacity-75 font-normal">Fièvre et détresse respiratoire</span>
                </button>

                <button
                  onClick={() => setSelectedScenario(2)}
                  className={`p-3.5 rounded-2xl text-left border transition-all text-xs ${
                    selectedScenario === 2
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-xs'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="block font-bold">Cas 3 : Neurologie Aiguë</span>
                  <span className="text-[11px] opacity-75 font-normal">Céphalée en coup de tonnerre</span>
                </button>
              </div>
            </div>

            {/* Simulation Results Display */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
              {/* Clinical Input Presentation */}
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-gray-200 space-y-2">
                  <span className="text-[11px] font-bold text-gray-500 uppercase">Profil Patient :</span>
                  <p className="text-xs font-semibold text-gray-900">{aiScenarios[selectedScenario].patient}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-gray-200 space-y-2">
                  <span className="text-[11px] font-bold text-gray-500 uppercase">Anamnèse & Signes Cliniques :</span>
                  <p className="text-xs text-gray-800 leading-relaxed italic">
                    "{aiScenarios[selectedScenario].symptoms}"
                  </p>
                </div>

                <div className="p-4 bg-cyan-50/80 rounded-2xl border border-cyan-200 space-y-2">
                  <span className="text-[11px] font-bold text-cyan-900 uppercase">Examens Prioritaires Recommandés :</span>
                  <p className="text-xs text-cyan-950 font-medium">
                    {aiScenarios[selectedScenario].recommendations}
                  </p>
                </div>
              </div>

              {/* Differential Hypotheses Probabilities */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Hypothèses Diagnostiques Différentielles Calculées :
                </h4>

                <div className="space-y-3">
                  {aiScenarios[selectedScenario].hypothesis.map((h, i) => (
                    <div key={i} className="p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-gray-900">{h.title}</span>
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

                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-cyan-600 to-teal-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${h.prob}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={onGoToLogin}
                    className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl text-xs font-bold shadow-md hover:from-cyan-700 hover:to-teal-700 transition-all flex items-center gap-2"
                  >
                    <span>Tester avec l'Assistant IA en direct</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-10 sm:py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 flex-shrink-0 whitespace-nowrap">
            <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-md">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2.5 whitespace-nowrap">
              <span className="text-xl font-bold whitespace-nowrap">SoftCare Hospital System</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 bg-slate-800 text-teal-300 rounded-full border border-slate-700 whitespace-nowrap flex-shrink-0">
                Hospital OS v2.4
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center lg:text-left max-w-md leading-relaxed">
            Plateforme médicale conforme aux standards de sécurité sanitaire et de traçabilité biomédicale.
          </p>

          <div className="flex items-center gap-3 flex-shrink-0 whitespace-nowrap">
            <button
              onClick={() => setShowDemoModal(true)}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow-md whitespace-nowrap flex-shrink-0"
            >
              <span>Demander une Démo</span>
            </button>
            <button
              onClick={() => setShowBrochureModal(true)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap flex-shrink-0"
            >
              <FileText className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>Brochure Médicale</span>
            </button>
            <button
              onClick={onGoToLogin}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0"
            >
              Se Connecter
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Multi-page Brochure Modal */}
      <BrochureModal
        isOpen={showBrochureModal}
        onClose={() => setShowBrochureModal(false)}
      />

      {/* Interactive Demo Request Modal */}
      <DemoRequestModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
      />
    </div>
  );
};

export default LandingPage;
