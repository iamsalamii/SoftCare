import React, { useState, useEffect } from 'react';
import {
  Activity, Shield, Heart, Dna, Brain, QrCode, ArrowRight,
  CheckCircle2, Users, BedDouble, Stethoscope, Clock, Award,
  Sparkles, Lock, Building2, ChevronRight, Phone, Mail, MapPin,
  FileText, Download, BookOpen, HeartPulse
} from 'lucide-react';
import BrochureModal from './BrochureModal';

interface LandingPageProps {
  onGoToLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToLogin }) => {
  const [showBrochureModal, setShowBrochureModal] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initStep, setInitStep] = useState('Connexion au réseau sécurisé hospitalier...');
  const [initProgress, setInitProgress] = useState(20);

  useEffect(() => {
    // Hospital style initial loading progression
    const timer1 = setTimeout(() => {
      setInitStep('Vérification des protocoles de sécurité sanitaire & HDS...');
      setInitProgress(60);
    }, 450);

    const timer2 = setTimeout(() => {
      setInitStep('Initialisation du Système d\'Information SoftCare...');
      setInitProgress(100);
    }, 850);

    const timer3 = setTimeout(() => {
      setIsInitializing(false);
    }, 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

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
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-cyan-500 selection:text-white animate-in fade-in duration-300">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/25">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                SoftCare
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-cyan-50 text-cyan-700 rounded-full border border-cyan-100">
                Hospital OS v2.4
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-cyan-600 transition-colors">Fonctionnalités</a>
            <a href="#biotech" className="hover:text-cyan-600 transition-colors">Biotech & PGx</a>
            <a href="#ai" className="hover:text-cyan-600 transition-colors">Intelligence Clinique</a>
            <button
              onClick={() => setShowBrochureModal(true)}
              className="text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-cyan-600" />
              <span>Consulter Brochure</span>
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onGoToLogin}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-600/25 transition-all hover:scale-[1.02] flex items-center gap-2"
            >
              <span>Espace Professionnel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 bg-gradient-to-b from-cyan-50/50 via-white to-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-cyan-200/30 via-teal-200/20 to-emerald-200/20 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-cyan-200/80 shadow-sm">
            <Sparkles className="w-4 h-4 text-cyan-600" />
            <span className="text-xs font-bold text-teal-900">
              Système d'Information Hospitalier (HIS) & Médecine de Précision
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 max-w-4xl mx-auto leading-tight">
            L'excellence des soins alliée aux{' '}
            <span className="bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
              biotechnologies avancées
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Une plateforme médicale complète unifiant dossier patient informatisé, pharmacie robotisée avec traçabilité par code-barres, pharmacogénomique (PGx) et aide au diagnostic clinique par IA.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onGoToLogin}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-2xl font-bold text-base shadow-xl shadow-teal-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
            >
              <span>Accéder au Système Hospitalier</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowBrochureModal(true)}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-cyan-50 text-teal-900 border border-teal-200 rounded-2xl font-bold text-base shadow-sm transition-all flex items-center justify-center gap-2.5"
            >
              <BookOpen className="w-5 h-5 text-cyan-600" />
              <span>Consulter la Brochure Médicale</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-teal-600">100%</p>
              <p className="text-xs text-gray-500 mt-1">Traçabilité GS1 / CIP</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-teal-600">-40%</p>
              <p className="text-xs text-gray-500 mt-1">Temps de Triage Urgences</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-teal-600">CPIC & DPWG</p>
              <p className="text-xs text-gray-500 mt-1">Normes PGx Intégrées</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-teal-600">99.9%</p>
              <p className="text-xs text-gray-500 mt-1">Disponibilité H24</p>
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
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Dossier Patient Informatisé (DPI)</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Consultations, antécédents, constantes hémodynamiques, ordonnances électroniques et historique des séjours centralisés.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Pharmacie, Traçabilité & POS</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Moteur d'encodage Code 128 / QR Code 2D vectoriel, gestion des lots, chaîne du froid (2-8°C / -80°C) et caisse délivrance.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Dna className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Biotechnologies & Pharmacogénomique</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Analyse des polymorphismes génétiques (*CYP2C19, CYP2D6, DPYD*), prévention des toxicités et LIMS biobanque cryogénique.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Aide au Diagnostic Clinique IA</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Calcul d'hypothèses diagnostiques différentielles probabilistes, protocoles CDS Hooks et recommandations d'examens.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <BedDouble className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Admissions & Gestion des Lits</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Planification des séjours, gestion des chambres, transferts inter-services et suivi du taux d'occupation hospitalier en direct.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Facturation & Piste d'Audit</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Émission de factures hospitalières normalisées, gestion des tiers payants et conformité RGPD / HDS avec chiffrement fort.
              </p>
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
    </div>
  );
};

export default LandingPage;
