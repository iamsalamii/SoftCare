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
import HeroVideoDemo from './HeroVideoDemo';

interface LandingPageProps {
  onGoToLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToLogin }) => {
  const [showBrochureModal, setShowBrochureModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initStep, setInitStep] = useState('Connexion au réseau sécurisé hospitalier...');
  const [initProgress, setInitProgress] = useState(20);

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
    // Hospital style initial loading progression
    const timer1 = setTimeout(() => {
      setInitStep('Vérification des protocoles de sécurité sanitaire & HDS...');
      setInitProgress(60);
    }, 400);

    const timer2 = setTimeout(() => {
      setInitStep('Initialisation du Système d\'Information SoftCare...');
      setInitProgress(100);
    }, 800);

    const timer3 = setTimeout(() => {
      setIsInitializing(false);
    }, 1100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Hospital Loading Screen
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-teal-950 to-cyan-950 flex flex-col items-center justify-center p-6 text-white select-none animate-in fade-in duration-200">
        <div className="max-w-md w-full text-center space-y-6">
          {/* Pulsing Medical Icon */}
          <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-3xl blur-xl animate-pulse" />
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-3xl border border-white/20 shadow-2xl flex items-center justify-center relative z-10 animate-bounce duration-1000">
              <Activity className="w-10 h-10 text-white animate-pulse" />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-white">SoftCare Hospital System</h2>
            <p className="text-xs text-cyan-200/80 font-mono tracking-wider uppercase">Système d'Information Hospitalier (HIS)</p>
          </div>

          {/* Animated ECG Pulse Line */}
          <div className="relative h-12 w-full bg-slate-900/60 border border-teal-500/30 rounded-2xl overflow-hidden p-2 flex items-center justify-center shadow-inner">
            <div className="absolute left-0 right-0 h-0.5 bg-cyan-400/30" />
            <svg className="w-full h-8 stroke-cyan-400 fill-none" viewBox="0 0 300 40">
              <path
                d="M 0 20 L 70 20 L 80 5 L 90 35 L 100 10 L 110 25 L 120 20 L 300 20"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse"
              />
            </svg>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-white/10">
              <div
                className="bg-gradient-to-r from-cyan-400 to-teal-400 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${initProgress}%` }}
              />
            </div>
            <p className="text-xs text-cyan-200/90 font-medium flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{initStep}</span>
            </p>
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
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-cyan-50 text-cyan-700 rounded-full border border-cyan-100">
                Hospital OS v2.4
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
              className="text-cyan-700 hover:text-cyan-900 font-bold flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-cyan-600" />
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
              className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-cyan-700 hover:bg-cyan-50 transition-colors text-left"
            >
              <Sparkles className="w-4 h-4 text-cyan-600" />
              <span>Demander une Démo Personnalisée</span>
            </button>
          </div>
        )}
      </header>

      {/* Hero Section with Immersive High-Tech Hospital Backdrop */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32 bg-slate-950 text-white">
        {/* Real Medical Hero Photographic Background with Dark Cyan Gradient Blend */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 mix-blend-luminosity scale-105 pointer-events-none"
          style={{ backgroundImage: "url('/images/hospital_modern_hero.jpg')" }}
        />
        {/* Radiant Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-teal-950/80 to-slate-950 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-tr from-cyan-500/20 via-teal-500/15 to-emerald-500/10 blur-3xl -z-0 rounded-full pointer-events-none animate-pulse" />

        {/* Ambient Medical Grid Pattern */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:32px_32px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-cyan-400/40 shadow-lg shadow-cyan-500/10">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-200 uppercase tracking-wider">
              Système d'Information Hospitalier (HIS) & Médecine de Précision
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight drop-shadow-sm">
            L'excellence des soins alliée aux{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              biotechnologies avancées
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Une plateforme médicale complète unifiant dossier patient informatisé, pharmacie robotisée avec traçabilité par code-barres, pharmacogénomique (PGx) et aide au diagnostic clinique par IA.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setShowDemoModal(true)}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-2xl font-bold text-base shadow-xl shadow-teal-500/30 transition-all hover:scale-[1.03] flex items-center justify-center gap-3"
            >
              <Sparkles className="w-5 h-5" />
              <span>Demander une Démo</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onGoToLogin}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md rounded-2xl font-bold text-base shadow-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2.5"
            >
              <Stethoscope className="w-5 h-5 text-cyan-300" />
              <span>Accéder à l'Espace Pro</span>
            </button>

            <button
              onClick={() => setShowBrochureModal(true)}
              className="w-full sm:w-auto px-6 py-4 bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-2xl font-semibold text-sm shadow-2xs transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-teal-400" />
              <span>Brochure PDF</span>
            </button>
          </div>

          {/* Video Demo Player in Hero */}
          <div className="pt-8 pb-4">
            <HeroVideoDemo
              onRequestDemo={() => setShowDemoModal(true)}
              onGoToLogin={onGoToLogin}
            />
          </div>

          {/* Quick Metrics */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 shadow-sm hover:border-cyan-500/50 transition-all">
              <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400">100%</p>
              <p className="text-xs text-slate-400 mt-1">Traçabilité GS1 / CIP</p>
            </div>
            <div className="p-4 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 shadow-sm hover:border-teal-500/50 transition-all">
              <p className="text-2xl sm:text-3xl font-extrabold text-teal-400">-40%</p>
              <p className="text-xs text-slate-400 mt-1">Temps de Triage Urgences</p>
            </div>
            <div className="p-4 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 shadow-sm hover:border-cyan-500/50 transition-all">
              <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400">CPIC & DPWG</p>
              <p className="text-xs text-slate-400 mt-1">Normes PGx Intégrées</p>
            </div>
            <div className="p-4 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 shadow-sm hover:border-emerald-500/50 transition-all">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">99.9%</p>
              <p className="text-xs text-slate-400 mt-1">Disponibilité H24</p>
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
      <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center text-white">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">SoftCare Hospital System</span>
          </div>

          <p className="text-xs text-slate-400 text-center sm:text-left">
            Plateforme médicale conforme aux standards de sécurité sanitaire et de traçabilité biomédicale.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDemoModal(true)}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Demander une Démo</span>
            </button>
            <button
              onClick={() => setShowBrochureModal(true)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Brochure Médicale</span>
            </button>
            <button
              onClick={onGoToLogin}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl text-xs font-bold transition-all"
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
