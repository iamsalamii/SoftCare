import React, { useState, useEffect, useRef } from 'react';
import {
  Activity, Shield, Heart, Dna, Brain, QrCode, ArrowRight,
  CheckCircle2, Users, BedDouble, Stethoscope, Clock, Award,
  Sparkles, Lock, Building2, ChevronRight, Phone, Mail, MapPin,
  FileText, Download, BookOpen, HeartPulse, AlertTriangle, Check,
  Thermometer, Search, RefreshCw, Send, Layers, Play, Menu, X,
  ShieldCheck, Cpu, Zap, BarChart3, Database, ShieldAlert, CheckCircle,
  ArrowUpRight, AlertCircle, Loader2
} from 'lucide-react';
import DemoRequestModal from './DemoRequestModal';
import BrochureModal from './BrochureModal';
import { EcgScreenLoader } from './EcgScreenLoader';
import { HeaderNav } from './HeaderNav';
import { DnaHelixCanvas } from './DnaHelixCanvas';
import { apiService } from '../../services/apiService';

interface LandingPageProps {
  onGoToLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToLogin }) => {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showBrochureModal, setShowBrochureModal] = useState(false);
  const [isInitializing, setIsInitializing] = useState(() => {
    if (typeof window !== 'undefined') {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const alreadySeen = sessionStorage.getItem('softcare_loader_seen');
      return !prefersReduced && !alreadySeen;
    }
    return true;
  });

  // Hero Preview 3D dynamic tilt on scroll
  const [tiltRotation, setTiltRotation] = useState(12);
  const [tiltScale, setTiltScale] = useState(0.96);

  // Stats counting animation state
  const [countedStats, setCountedStats] = useState({ modules: 0, services: 0, dossiers: 0 });

  // Parcours de soins (5 étapes)
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Le produit en action (Onglets)
  const [activeProductTab, setActiveProductTab] = useState<'dashboard' | 'patient' | 'pharmacie' | 'bloc'>('dashboard');

  // Intelligence clinique - Simulateur PGx
  const [selectedGene, setSelectedGene] = useState<'CYP2C19' | 'DPYD' | 'CYP2D6' | 'SLCO1B1'>('CYP2C19');

  // Formulaire d'engagement en bas de page
  const [formValues, setFormValues] = useState({
    name: '',
    institution: '',
    email: '',
    message: '',
    honeypot: ''
  });
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Scroll listener for hero 3D leveling
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const rotation = Math.max(0, 12 - scrollY * 0.03);
      const scale = Math.min(1, 0.96 + scrollY * 0.0001);
      setTiltRotation(rotation);
      setTiltScale(scale);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Modules cliniques spécialisés - Défilement horizontal piloté par le scroll vertical
  const modulesContainerRef = useRef<HTMLDivElement>(null);
  const modulesTrackRef = useRef<HTMLDivElement>(null);
  const [modulesScrollProgress, setModulesScrollProgress] = useState(0);
  const [modulesMaxTranslate, setModulesMaxTranslate] = useState(0);

  // Calcul dynamique de la course de translation horizontale
  useEffect(() => {
    const updateDimensions = () => {
      if (modulesTrackRef.current) {
        const trackWidth = modulesTrackRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        const maxScroll = Math.max(0, trackWidth - viewportWidth + 96);
        setModulesMaxTranslate(maxScroll);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    const timer = setTimeout(updateDimensions, 400);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timer);
    };
  }, []);

  // Synchronisation fluide au scroll vertical
  useEffect(() => {
    let ticking = false;

    const handleModulesScroll = () => {
      if (!modulesContainerRef.current) return;
      const rect = modulesContainerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;

      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
      setModulesScrollProgress(progress);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(handleModulesScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleModulesScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToModuleIndex = (index: number) => {
    if (!modulesContainerRef.current) return;
    const rect = modulesContainerRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const totalScrollable = modulesContainerRef.current.offsetHeight - window.innerHeight;
    const targetProgress = Math.max(0, Math.min(1, index / (specializedModules.length - 1)));
    const targetScroll = scrollTop + rect.top + (targetProgress * totalScrollable);
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  // Trigger counters after loader completes
  useEffect(() => {
    if (!isInitializing) {
      let mod = 0;
      let serv = 0;
      let dos = 0;
      const timer = setInterval(() => {
        if (mod < 12) mod++;
        if (serv < 5) serv++;
        if (dos < 1) dos++;
        setCountedStats({ modules: mod, services: serv, dossiers: dos });
        if (mod >= 12 && serv >= 5 && dos >= 1) clearInterval(timer);
      }, 55);
      return () => clearInterval(timer);
    }
  }, [isInitializing]);

  // Steps data for the 5 clinical stages
  const clinicalSteps = [
    {
      id: '01',
      tag: "FLUX EN DIRECT • URGENCES",
      metric: "Délai moyen d'admission : 1m 40s",
      badge: "Module Admission",
      subhead: "Station d'accueil & Régulation",
      timestamp: "14:32:08 • Salle d'attente U1",
      title: "Admission & Régulation",
      desc: "L'agent d'accueil crée la fiche administrative pendant que l'infirmier organisateur de l'orientation saisit l'échelle de tri (CIMU). Les constantes vitales s'injectent sans ressaisie dans le dossier de garde.",
      patientTag: "Marc DUPUIS (54 ans)",
      statusPill: "Tri CIMU 2 (Urgence relative)",
      quickStatus: "IPP #94820194",
      card1Title: "Identité pivot",
      card1Val: "RNV certifié",
      card1Sub: "INS validé en 12ms",
      card2Title: "Statut lit",
      card2Val: "Box 04 assigné",
      card2Sub: "Brancardage déclenché",
      card3Title: "Constantes d'urgence",
      card3Val: "SpO2 98% • FC 74",
      card3Sub: "Moniteur Philips relié",
      footerMeta: "14h32 (RNIV 0 error) • Entrée directe",
      bgImage: "/images/hospital_emergency_icu.jpg"
    },
    {
      id: '02',
      tag: "PLATEAU MÉDICAL • CONSULTATION",
      metric: "Temps d'ouverture DPI : 180ms",
      badge: "Prescription Sécurisée",
      subhead: "Consultation & Prescription Assistée",
      timestamp: "14:41:15 • Bureau Consultation 12",
      title: "Consultation & Prescription",
      desc: "Antécédents complets chargés instantanément. L'aide à la prescription analyse les contre-indications en temps réel, bloque les molécules à risque allergique et ajuste les posologies selon la clairance rénale calculée.",
      patientTag: "Marc DUPUIS (54 ans)",
      statusPill: "Allergie : Pénicilline G",
      quickStatus: "Clairance 68 mL/min",
      card1Title: "Antécédents chargés",
      card1Val: "HTA traitée • 0 doublon",
      card1Sub: "Dossier antérieur CHU",
      card2Title: "Analyse interactions",
      card2Val: "0 alerte critique",
      card2Sub: "Base Claude Bernard",
      card3Title: "Prescription validée",
      card3Val: "Ordonnance signée",
      card3Sub: "Signature CPS / e-CPS",
      footerMeta: "Dr. H. Vaneck • Validation électronique conforme HAS",
      bgImage: "/images/medical_doctor_care.jpg"
    },
    {
      id: '03',
      tag: "PLATEAU TECHNIQUE • BIOLOGIE",
      metric: "Transmission SIL : < 25ms",
      badge: "SIL Interopérable",
      subhead: "Biologie & Automates SIL",
      timestamp: "15:05:40 • Laboratoire Central",
      title: "Biologie & Automates SIL",
      desc: "Télétransmission temps réel des tubes avec code-barres GS1. Intégration automatisée des bilans sanguins, détection proactive des anomalies de gazométrie & NFS et notification prioritaire immédiate au médecin prescripteur.",
      patientTag: "Bilan URG-B29",
      statusPill: "Automate Sysmex XN",
      quickStatus: "Tubes scannés : 3/3",
      card1Title: "Code-barres GS1",
      card1Val: "Traçabilité 100%",
      card1Sub: "Prélèvement 14h55",
      card2Title: "Gazométrie & NFS",
      card2Val: "Constantes normales",
      card2Sub: "Hb : 14.2 g/dL • K+ : 4.1",
      card3Title: "Validation biologiste",
      card3Val: "Signé 15h05",
      card3Sub: "Dr. V. Lamartine (Bio)",
      footerMeta: "Horodatage SIL certifié • Liaison HPRIM & HL7 FHIR",
      bgImage: "/images/medical_lab_tubes.jpg"
    },
    {
      id: '04',
      tag: "LOGISTIQUE CLINIQUE • PHARMACIE",
      metric: "Dispensation nominative : 100%",
      badge: "PUI & Sérialisation",
      subhead: "Pharmacie à Usage Intérieur (PUI)",
      timestamp: "15:18:22 • Robot PUI Central",
      title: "Pharmacie & Dispensation PUI",
      desc: "Dispensation nominative totalement automatisée au fil de l'eau. Robot de stockage robotisé Swisslog, traçabilité sérialisée DataMatrix des dérivés sanguins et délivrance sécurisée en armoire connectée de service.",
      patientTag: "Chariot de Soins : Box 04",
      statusPill: "Armoire connectée A4",
      quickStatus: "Délivrance nominative",
      card1Title: "Robot de dispensation",
      card1Val: "Préparation achevée",
      card1Sub: "Doses unitaires sous blister",
      card2Title: "Traçabilité sérialisée",
      card2Val: "DataMatrix scanné",
      card2Sub: "Dérivés sanguins contrôlés",
      card3Title: "Délivrance sécurisée",
      card3Val: "Prêt pour injection",
      card3Sub: "Contre-visite pharmacien",
      footerMeta: "Pharmacie Centrale • Conforme décret circuit du médicament",
      bgImage: "/images/hospital_smart_pharmacy.jpg"
    },
    {
      id: '05',
      tag: "PLATEAU CHIRURGICAL & SORTIE",
      metric: "Transmissions DMP & MES : Directes",
      badge: "Coordination HAS",
      subhead: "Bloc Opératoire & Sortie / Coordination",
      timestamp: "16:45:10 • Sortie / Liaison",
      title: "Bloc & Coordination de Sortie",
      desc: "Check-list chirurgicale HAS validée en salle d'intervention, compte-rendu opératoire dicté vocalement sans délai, et volet de synthèse médicale envoyé instantanément sur Mon Espace Santé et DMP pour le médecin traitant.",
      patientTag: "Marc DUPUIS (54 ans)",
      statusPill: "Sortie autorisée",
      quickStatus: "DMP / MSSanté émis",
      card1Title: "Check-list HAS",
      card1Val: "3 temps validés",
      card1Sub: "Équipe chirurgicale complète",
      card2Title: "CR opératoire",
      card2Val: "Dictée numérique",
      card2Sub: "Intégration DPI immédiate",
      card3Title: "Mon Espace Santé",
      card3Val: "Volet transmis",
      card3Sub: "Médecin traitant informé",
      footerMeta: "Zéro rupture territoriale • Synthèse d'hospitalisation clôturée",
      bgImage: "/images/hospital_modern_hero.jpg"
    }
  ];

  const specializedModules = [
    {
      num: 'MODULE 01',
      title: 'Gestion des Patients',
      desc: "Centralisation stricte de l'historique complet, des allergies répertoriées et des consentements. L'accès en un clic évite les examens redondants et sécurise les prises en charge en urgence.",
      metricLabel: "Temps d'accès dossier",
      metricValue: '< 300 ms',
      bgImage: '/images/medical_doctor_care.jpg',
      badge: null,
      width: 'w-[360px] sm:w-[440px]'
    },
    {
      num: 'MODULE 02',
      title: 'Pharmacie à Usage Intérieur',
      desc: "Validation pharmaceutique intégrée au lit du malade. Gestion des stocks en dotation de service et traçabilité sérialisée des médicaments dérivés du sang.",
      metricLabel: 'Dispensation sécurisée',
      metricValue: '100% nominative',
      bgImage: '/images/hospital_smart_pharmacy.jpg',
      badge: null,
      width: 'w-[340px] sm:w-[400px]'
    },
    {
      num: 'MODULE 03',
      title: 'Bloc Opératoire & Anesthésie',
      desc: "Planification intelligente des vacations, suivi en temps réel des ouvertures de salles et check-list chirurgicale dématérialisée conforme aux recommandations.",
      metricLabel: 'Optimisation des vacations',
      metricValue: "+18% d'occupation",
      bgImage: '/images/hospital_modern_hero.jpg',
      badge: 'Régulation live',
      width: 'w-[380px] sm:w-[480px]'
    },
    {
      num: 'MODULE 04',
      title: 'Biologie Médicale',
      desc: "Liaison bidirectionnelle SIL, validation biologique par lots et distribution instantanée des résultats critiques aux services demandeurs.",
      metricLabel: 'Alerte panique critique',
      metricValue: 'Instantanée',
      bgImage: '/images/medical_lab_tubes.jpg',
      badge: null,
      width: 'w-[340px] sm:w-[400px]'
    },
    {
      num: 'MODULE 05',
      title: 'Facturation & Recouvrement',
      desc: "Codage des actes CIM-10 / CCAM en continu, télétransmission directe aux organismes payeurs et réduction mesurable des rejets de facturation.",
      metricLabel: 'Délai de liquidation',
      metricValue: 'Réduit de 14 jours',
      bgImage: '/images/precision_medicine_banner.jpg',
      badge: null,
      width: 'w-[360px] sm:w-[440px]'
    }
  ];

  const currentStep = clinicalSteps[activeStepIndex];

  // Submit bottom form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formValues.honeypot) return; // Anti-spam silently discard
    setIsSubmittingForm(true);
    setFormError(null);

    try {
      try {
        if (apiService?.demoRequest?.submit) {
          await apiService.demoRequest.submit({
            fullName: formValues.name,
            email: formValues.email,
            phone: '',
            facility: formValues.institution,
            preferredDate: 'Au plus tôt',
            modules: ['Plateforme Complète SIH'],
            notes: formValues.message,
            honeypot: formValues.honeypot
          });
        }
      } catch (backendErr) {
        console.warn('Backend endpoint unreached, storing lead locally:', backendErr);
      }

      // Mirror in localStorage
      try {
        const existing = JSON.parse(localStorage.getItem('softcare_demo_requests') || '[]');
        existing.unshift({
          ref: `DEMO-${Date.now().toString().slice(-6)}`,
          date: new Date().toISOString(),
          fullName: formValues.name,
          email: formValues.email,
          facility: formValues.institution,
          notes: formValues.message,
        });
        localStorage.setItem('softcare_demo_requests', JSON.stringify(existing));
      } catch {}

      setFormSubmitted(true);
    } catch (err: any) {
      setFormError(err?.message || "Une erreur est survenue lors de l'enregistrement de votre demande.");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-night text-[#d0e7e2] font-sans selection:bg-neon selection:text-night overflow-x-clip relative">
      {/* 1. Écran de chargement ECG avec rideau supérieur/inférieur et onde vert néon */}
      <EcgScreenLoader
        onComplete={() => setIsInitializing(false)}
        onStartReveal={() => setIsInitializing(false)}
      />

      {/* Contenu principal de la page masqué sans flash pendant le chargement initial */}
      <div className={`transition-opacity duration-700 ease-out ${isInitializing ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {/* 2. Header institutionnel avec trait néon vert en haut d'écran */}
        <HeaderNav
          onGoToLogin={onGoToLogin}
          onOpenDemo={() => setShowDemoModal(true)}
        />

      {/* =========================================================================
          3. HERO SECTION — Nocturnal Surgical Precision
          ========================================================================= */}
      <section className="relative min-h-screen flex flex-col justify-between pt-32 pb-16 overflow-hidden bg-night">
        {/* Photographie hospitalière de bloc opératoire avec filtre sombre émeraude chirurgical */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/images/hospital_modern_hero.jpg"
            alt="Bloc opératoire moderne haute technologie"
            className="w-full h-full object-cover filter brightness-50 contrast-125 duotone-emerald opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/90 to-night" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon/15 via-transparent to-transparent" />
          {/* Halo d'ambiance néon vert */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-neon/15 rounded-full blur-[140px] pointer-events-none animate-glow-pulse" />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 w-full my-auto">
          <div className="max-w-3xl">
            {/* Badge institutionnel */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon/30 bg-deep/80 text-neon text-xs font-mono mb-6 backdrop-blur-md shadow-neon-sm">
              <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
              <span>SYSTÈME D'INFORMATION HOSPITALIER DE PRÉCISION • CONFORME HDS & RGPD</span>
            </div>

            {/* Titre fort éditorial */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-[1.08] mb-6">
              Chaque patient.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon via-mint to-emerald">
                Un seul dossier.
              </span><br />
              Aucune rupture.
            </h1>

            {/* Description clinique claire */}
            <p className="font-sans text-lg sm:text-xl text-[#bacbbc] font-normal leading-relaxed mb-10 max-w-2xl">
              Le système d'information clinique et logistique conçu avec les équipes médicales pour fluidifier l'admission, sécuriser la dispensation et synchroniser l'ensemble des plateaux techniques.
            </p>

            {/* CTA Doubles */}
            <div className="flex flex-wrap items-center gap-4 mb-16">
              <button
                onClick={() => setShowDemoModal(true)}
                type="button"
                className="px-7 py-3.5 rounded bg-gradient-to-r from-emerald via-neon to-mint text-darkforest font-bold text-base transition-all duration-300 shadow-neon-glow hover:brightness-110 hover:scale-[1.02] active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>Demander une démo</span>
                <ArrowRight className="w-4 h-4 text-darkforest" />
              </button>
              <a
                href="#parcours"
                className="px-7 py-3.5 rounded border border-neon/40 hover:border-neon text-[#d0e7e2] hover:text-white font-medium text-base transition-all duration-200 bg-deep/60 backdrop-blur-md hover:bg-neon/10 hover:shadow-neon-sm"
              >
                Voir le parcours de soins
              </a>
            </div>

            {/* 3 Métriques clés avec compteurs incrémentaux */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#09382f] max-w-xl">
              <div>
                <div className="font-serif text-3xl sm:text-4xl text-white font-medium">
                  {countedStats.modules}
                </div>
                <div className="text-xs sm:text-sm text-[#859587] font-sans mt-1">
                  modules intégrés
                </div>
              </div>
              <div>
                <div className="font-serif text-3xl sm:text-4xl text-white font-medium">
                  {countedStats.services}
                </div>
                <div className="text-xs sm:text-sm text-[#859587] font-sans mt-1">
                  services reliés
                </div>
              </div>
              <div>
                <div className="font-serif text-3xl sm:text-4xl text-neon font-medium drop-shadow-[0_0_12px_rgba(0,220,130,0.5)]">
                  {countedStats.dossiers}
                </div>
                <div className="text-xs sm:text-sm text-[#859587] font-sans mt-1">
                  dossier patient unique
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Aperçu d'application en perspective 3D qui se redresse au défilement */}
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 w-full mt-12">
          <div
            className="transition-transform duration-700 ease-out origin-top border border-neon/30 rounded-lg overflow-hidden bg-[#031c17]/95 shadow-neon-glow relative"
            style={{
              transform: `perspective(1000px) rotateX(${tiltRotation}deg) scale(${tiltScale})`,
            }}
          >
            {/* Faisceau laser scanner vert */}
            <div className="laser-line" />

            {/* Barre de titre clinique */}
            <div className="bg-[#02120f] px-5 py-3 border-b border-[#0a382e] flex items-center justify-between text-xs text-[#859587]">
              <div className="flex items-center gap-3">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-neon shadow-neon-sm" />
                <span className="font-mono text-[#d0e7e2] ml-2">
                  SoftCare SIH v4.8 • CHU Régional • Bloc Central
                </span>
              </div>
              <div className="flex items-center gap-4 font-mono text-xs">
                <span className="text-[#859587]">Dossier #884-209</span>
                <span className="text-neon flex items-center gap-1.5 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
                  En ligne (Flux continu)
                </span>
              </div>
            </div>

            {/* Interface de l'application médicale simulée */}
            <div className="p-6 grid grid-cols-12 gap-6 bg-gradient-to-b from-[#031714] to-[#010e0b]">
              <div className="col-span-12 md:col-span-3 border-r border-[#09382f]/80 pr-6 space-y-4">
                <div className="text-[11px] uppercase tracking-wider text-neon font-mono">
                  Identité Patient
                </div>
                <div className="font-serif text-xl text-white">
                  Marc DUPUIS, 54 ans
                </div>
                <div className="text-xs text-[#bacbbc] space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span>IPP :</span>
                    <span className="text-white">94820194</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chambre :</span>
                    <span className="text-white">312 - Soins Intensifs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Médecin référent :</span>
                    <span className="text-white">Dr. H. Vaneck</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-[#09382f]">
                  <span className="text-xs text-[#859587] block mb-2 font-mono">
                    Paramètres vitaux récents
                  </span>
                  <div className="flex items-center justify-between text-xs bg-[#041f1a] p-2.5 rounded border border-[#0a382e]">
                    <span className="text-[#bacbbc]">Pouls : <strong className="text-white font-mono">72 bpm</strong></span>
                    <span className="text-neon font-mono font-bold drop-shadow-[0_0_8px_rgba(0,220,130,0.6)] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-neon" /> SpO2 : 98%
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-9 space-y-4">
                <div className="flex items-center justify-between border-b border-[#09382f] pb-3">
                  <div className="text-sm font-medium text-white flex items-center gap-2">
                    <span>Prescriptions actives & Traçabilité chirurgicale</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neon/15 text-neon border border-neon/30">
                      Vérifié SIL/DIM
                    </span>
                  </div>
                  <div className="text-xs text-neon font-mono">
                    Dernière validation : il y a 8 min (Dr. Vaneck)
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-[#041f1a]/90 border border-neon/20 hover:border-neon/50 transition-colors shadow-sm">
                    <div className="text-xs text-[#859587] mb-1 font-mono uppercase">
                      Pharmacovigilance
                    </div>
                    <div className="text-sm font-semibold text-white">
                      Céfazoline 2g IV
                    </div>
                    <div className="text-xs text-neon mt-2 flex items-center gap-1.5 font-mono">
                      <Check className="w-3.5 h-3.5 text-neon" />
                      Délivré par Pharmacie Centrale
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-[#041f1a]/90 border border-neon/20 hover:border-neon/50 transition-colors shadow-sm">
                    <div className="text-xs text-[#859587] mb-1 font-mono uppercase">
                      Bilan biologique
                    </div>
                    <div className="text-sm font-semibold text-white">
                      NFS & Ionogramme complet
                    </div>
                    <div className="text-xs text-[#bacbbc] mt-2 font-mono">
                      Validé biologiste : 14h12
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-[#041f1a]/90 border border-neon/20 hover:border-neon/50 transition-colors shadow-sm">
                    <div className="text-xs text-[#859587] mb-1 font-mono uppercase">
                      Plateau technique
                    </div>
                    <div className="text-sm font-semibold text-white">
                      Bloc 3 réservé
                    </div>
                    <div className="text-xs text-mint mt-2 font-mono">
                      Créneau validé 16h30
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ligne ECG de séparation en bas du hero */}
        <div className="relative z-10 w-full mt-10">
          <svg className="w-full h-8" fill="none" viewBox="0 0 1200 40">
            <path
              d="M0 20 H500 L515 8 L530 32 L545 12 L560 26 L570 20 H1200"
              stroke="#00dc82"
              strokeOpacity="0.8"
              strokeWidth="1.8"
              style={{ filter: 'drop-shadow(0 0 4px #00dc82)' }}
            />
          </svg>
        </div>
      </section>

      {/* =========================================================================
          4. BANDEAU DÉFILANT MÉTIERS (Marquee)
          ========================================================================= */}
      <section className="py-12 border-y border-[#09382f] bg-[#010e0b] overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#010e0b] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#010e0b] to-transparent z-10 pointer-events-none" />
        <div className="animate-marquee whitespace-nowrap flex items-center text-3xl sm:text-5xl lg:text-6xl font-serif text-[#16443c] tracking-tight select-none">
          {['Patients', 'Consultations', 'Pharmacie', 'Bloc opératoire', 'Biologie', 'Imagerie', 'Facturation FIDES', 'Admissions', 'Téléconsultation'].map((module, i) => (
            <React.Fragment key={i}>
              <span className="mx-8 hover:text-neon hover:scale-105 transition-all duration-200 cursor-default">
                {module}
              </span>
              <span className="text-neon/40">•</span>
            </React.Fragment>
          ))}
          {/* Double repetition for seamless loop */}
          {['Patients', 'Consultations', 'Pharmacie', 'Bloc opératoire', 'Biologie', 'Imagerie', 'Facturation FIDES', 'Admissions', 'Téléconsultation'].map((module, i) => (
            <React.Fragment key={`rep-${i}`}>
              <span className="mx-8 hover:text-neon hover:scale-105 transition-all duration-200 cursor-default">
                {module}
              </span>
              <span className="text-neon/40">•</span>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* =========================================================================
          5. PARCOURS CLINIQUE INTERACTIF (5 Étapes synchronisées)
          ========================================================================= */}
      <section className="relative py-28 bg-night border-b border-[#09382f]" id="parcours">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="mb-14">
            <span className="font-mono text-xs text-neon tracking-widest uppercase block mb-2">
              Continuité Clinique Absolue
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-white font-normal leading-tight">
              De l'admission aux soins : zéro rupture d'information
            </h2>
            <p className="font-sans text-[#bacbbc] text-base sm:text-lg mt-4 max-w-2xl">
              Chaque intervention médicale alimente instantanément la suite du parcours, sans double saisie ni latence administrative.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Colonne Gauche : 5 étapes avec fil vertical */}
            <div className="lg:col-span-5 relative space-y-4 pl-6 border-l-2 border-[#09382f]">
              {clinicalSteps.map((step, idx) => {
                const isActive = activeStepIndex === idx;
                return (
                  <div
                    key={step.id}
                    onClick={() => setActiveStepIndex(idx)}
                    className={`cursor-pointer group p-4 rounded-xl border transition-all duration-200 ${
                      isActive
                        ? 'border-neon/30 bg-[#041f1a]/80 shadow-neon-sm'
                        : 'border-transparent hover:border-neon/20 hover:bg-[#041f1a]/40 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-mono text-xs tracking-widest uppercase font-semibold ${isActive ? 'text-neon' : 'text-[#859587]'}`}>
                        Étape {step.id}
                      </span>
                      {isActive && (
                        <span className="font-mono text-[10px] text-neon bg-neon/15 px-2 py-0.5 rounded border border-neon/30">
                          Actif
                        </span>
                      )}
                    </div>
                    <h3 className={`font-serif text-2xl transition-colors ${isActive ? 'text-white' : 'text-[#bacbbc] group-hover:text-neon'}`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-[#bacbbc] font-sans mt-1.5 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Colonne Droite : Grand panneau d'interface dynamique synchronisé */}
            <div className="lg:col-span-7 sticky top-28">
              <div className="rounded-xl border border-neon/30 bg-[#031c17]/95 overflow-hidden shadow-emerald-card relative min-h-[560px] flex flex-col justify-between">
                {/* Photo de fond hospitalière locale traitée en duotone */}
                <img
                  src={currentStep.bgImage}
                  alt={currentStep.title}
                  className="absolute inset-0 w-full h-full object-cover duotone-emerald opacity-20 filter contrast-125 transition-opacity duration-500 ease-in-out pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#021411] via-[#021411]/90 to-transparent pointer-events-none" />
                <div className="laser-line" />

                {/* Barre d'état clinique */}
                <div className="relative z-10 px-6 py-3.5 border-b border-[#0a382e] bg-[#02120f]/90 backdrop-blur-md flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-neon shadow-neon-sm animate-pulse" />
                    <span className="font-mono text-xs text-neon tracking-wide uppercase font-semibold">
                      {currentStep.tag}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs text-[#859587]">
                    <span className="hidden sm:inline">{currentStep.metric}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neon/10 text-neon border border-neon/25">
                      {currentStep.badge}
                    </span>
                  </div>
                </div>

                {/* Corps de l'écran clinique */}
                <div className="relative z-10 p-6 sm:p-8 flex-1 flex flex-col justify-between transition-all duration-300">
                  <div>
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-xs font-mono text-mint tracking-wider uppercase">
                        {currentStep.subhead}
                      </span>
                      <span className="text-[11px] font-mono text-[#859587]">
                        {currentStep.timestamp}
                      </span>
                    </div>
                    <h4 className="font-serif text-3xl sm:text-4xl text-white mb-3 tracking-tight">
                      {currentStep.title}
                    </h4>
                    <p className="text-[#d0e7e2] text-sm sm:text-base leading-relaxed max-w-xl font-sans">
                      {currentStep.desc}
                    </p>
                  </div>

                  {/* Mockup de carte de données */}
                  <div className="my-6 p-4.5 rounded-lg bg-[#021411]/90 border border-neon/25 shadow-inner">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#09382f]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-white font-medium">
                          {currentStep.patientTag}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#041f1a] text-[#bacbbc] border border-[#0a382e]">
                          {currentStep.statusPill}
                        </span>
                      </div>
                      <span className="font-mono text-xs text-neon font-semibold">
                        {currentStep.quickStatus}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                      <div className="p-3 rounded bg-[#041f1a]/80 border border-[#09382f]">
                        <span className="text-[#859587] block text-[10px] uppercase tracking-wide">
                          {currentStep.card1Title}
                        </span>
                        <span className="text-white font-semibold text-sm mt-0.5 block">
                          {currentStep.card1Val}
                        </span>
                        <span className="text-[10px] text-[#bacbbc] mt-1 block">
                          {currentStep.card1Sub}
                        </span>
                      </div>
                      <div className="p-3 rounded bg-[#041f1a]/80 border border-[#09382f]">
                        <span className="text-[#859587] block text-[10px] uppercase tracking-wide">
                          {currentStep.card2Title}
                        </span>
                        <span className="text-neon font-semibold text-sm mt-0.5 block">
                          {currentStep.card2Val}
                        </span>
                        <span className="text-[10px] text-[#bacbbc] mt-1 block">
                          {currentStep.card2Sub}
                        </span>
                      </div>
                      <div className="p-3 rounded bg-[#041f1a]/80 border border-[#09382f]">
                        <span className="text-[#859587] block text-[10px] uppercase tracking-wide">
                          {currentStep.card3Title}
                        </span>
                        <span className="text-mint font-semibold text-sm mt-0.5 block">
                          {currentStep.card3Val}
                        </span>
                        <span className="text-[10px] text-[#bacbbc] mt-1 block">
                          {currentStep.card3Sub}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pied de scène */}
                  <div className="pt-3 border-t border-[#0a382e] flex flex-wrap items-center justify-between text-xs font-mono text-[#859587]">
                    <div className="flex items-center gap-2">
                      <span className="text-[#d0e7e2]">Horodatage pivot :</span>
                      <span className="text-white">{currentStep.footerMeta}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 sm:mt-0">
                      <span className="text-[#859587]">Étape</span>
                      <span className="text-neon font-bold">{activeStepIndex + 1}/5</span>
                      <span className="text-[#859587]">• Synchro continue</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. GRILLE DES MODULES CLINIQUES SPÉCIALISÉS (Défilement piloté au scroll)
          ========================================================================= */}
      <section
        className="relative min-h-[260vh] bg-[#010e0b] border-b border-[#09382f]"
        id="modules"
        ref={modulesContainerRef}
      >
        <div className="sticky top-0 h-screen w-full flex flex-col justify-between pt-24 sm:pt-28 pb-8 sm:pb-12 overflow-hidden">
          {/* Voiles de dégradé latéral pour un fondu cinématographique */}
          <div className="absolute inset-y-0 left-0 w-24 sm:w-36 bg-gradient-to-r from-[#010e0b] via-[#010e0b]/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 sm:w-36 bg-gradient-to-l from-[#010e0b] via-[#010e0b]/80 to-transparent z-20 pointer-events-none" />

          {/* En-tête de section & Indicateurs de progression */}
          <div className="max-w-[1280px] w-full mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs text-neon tracking-widest uppercase">
                    Architecture Clinique
                  </span>
                  <span className="text-[#09382f]">•</span>
                  <span className="font-mono text-xs text-[#859587]">
                    Défilement synchronisé au scroll
                  </span>
                </div>
                <h2 className="font-serif text-3xl sm:text-5xl text-white font-normal leading-tight">
                  Modules cliniques spécialisés
                </h2>
                <p className="font-sans text-[#bacbbc] text-sm sm:text-base mt-2 max-w-xl">
                  Une architecture modulaire unifiée, adaptée aux exigences de chaque métier de l'hôpital.
                </p>
              </div>

              {/* Compteur interactif & Boutons de navigation pas-à-pas */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-mono text-xs text-neon font-semibold flex items-center gap-2 justify-end">
                    <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
                    <span>Module 0{Math.min(5, Math.floor(modulesScrollProgress * 4.99) + 1)} / 05</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#859587] block mt-0.5">
                    Scrollez pour faire défiler
                  </span>
                </div>

                <div className="flex items-center gap-1.5 border border-[#09382f] rounded-lg p-1 bg-[#021411]">
                  <button
                    onClick={() => scrollToModuleIndex(Math.max(0, Math.floor(modulesScrollProgress * 4.99) - 1))}
                    disabled={modulesScrollProgress <= 0.05}
                    className="w-8 h-8 rounded flex items-center justify-center text-[#bacbbc] hover:text-neon hover:bg-neon/10 disabled:opacity-30 disabled:hover:text-[#bacbbc] disabled:hover:bg-transparent transition-colors font-mono text-xs"
                    title="Module précédent"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => scrollToModuleIndex(Math.min(4, Math.floor(modulesScrollProgress * 4.99) + 1))}
                    disabled={modulesScrollProgress >= 0.95}
                    className="w-8 h-8 rounded flex items-center justify-center text-[#bacbbc] hover:text-neon hover:bg-neon/10 disabled:opacity-30 disabled:hover:text-[#bacbbc] disabled:hover:bg-transparent transition-colors font-mono text-xs"
                    title="Module suivant"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

            {/* Barre de progression émeraude chirurgicale */}
            <div className="w-full h-1 bg-[#041f1a] rounded-full overflow-hidden mt-6 border border-[#09382f]/60">
              <div
                className="h-full bg-gradient-to-r from-neon via-mint to-neon transition-all duration-75 shadow-neon-sm"
                style={{ width: `${Math.round(modulesScrollProgress * 100)}%` }}
              />
            </div>
          </div>

          {/* Rail horizontal piloté directement par le scroll de la page */}
          <div className="w-full relative z-10 my-auto py-4 pl-6 sm:pl-12 lg:pl-20">
            <div
              ref={modulesTrackRef}
              style={{
                transform: `translate3d(-${modulesScrollProgress * modulesMaxTranslate}px, 0, 0)`,
                willChange: 'transform'
              }}
              className="flex gap-8 items-stretch select-none transition-transform duration-75 ease-out"
            >
              {specializedModules.map((mod, i) => {
                const isCurrent = Math.floor(modulesScrollProgress * 4.99) === i;
                return (
                  <div
                    key={mod.num}
                    onClick={() => scrollToModuleIndex(i)}
                    className={`flex-none ${mod.width} min-h-[380px] rounded-xl border bg-[#031c17] p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                      isCurrent
                        ? 'border-neon/60 shadow-neon-glow -translate-y-1'
                        : 'border-neon/20 hover:border-neon/40 hover:-translate-y-0.5'
                    }`}
                  >
                    <img
                      src={mod.bgImage}
                      alt={mod.title}
                      className="absolute inset-0 w-full h-full object-cover duotone-emerald opacity-20 group-hover:scale-105 group-hover:opacity-30 transition-all duration-500 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#021411] via-[#021411]/80 to-transparent pointer-events-none" />

                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
                        <span className={`font-mono text-xs uppercase tracking-wider font-semibold ${isCurrent ? 'text-neon' : 'text-[#859587]'}`}>
                          {mod.num}
                        </span>
                        {mod.badge && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon/15 text-neon border border-neon/30">
                            {mod.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-2xl sm:text-3xl text-white mt-3 mb-4 group-hover:text-mint transition-colors">
                        {mod.title}
                      </h3>
                      <p className="text-sm text-[#bacbbc] font-sans leading-relaxed">
                        {mod.desc}
                      </p>
                    </div>

                    <div className="relative z-10 mt-8 pt-6 border-t border-[#09382f] font-mono text-xs text-[#859587] flex justify-between items-center">
                      <span>{mod.metricLabel}</span>
                      <span className="text-neon font-semibold text-sm drop-shadow-[0_0_8px_rgba(0,220,130,0.5)]">
                        {mod.metricValue}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pagination inférieure & Guide de navigation gestuelle */}
          <div className="max-w-[1280px] w-full mx-auto px-6 relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {specializedModules.map((mod, idx) => {
                const isCurrent = Math.floor(modulesScrollProgress * 4.99) === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => scrollToModuleIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isCurrent
                        ? 'w-8 bg-neon shadow-neon-sm'
                        : 'w-2 bg-[#09382f] hover:bg-[#16443c]'
                    }`}
                    title={`Aller à ${mod.title}`}
                  />
                );
              })}
            </div>

            <div className="text-xs font-mono text-[#859587] flex items-center gap-2">
              <span>Molette / Pavé tactile pour défiler</span>
              <span className="text-neon">↓</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. LE PRODUIT EN ACTION (Onglets interactifs réactifs)
          ========================================================================= */}
      <section className="py-28 bg-night border-b border-[#09382f]" id="produit">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="font-mono text-xs text-neon tracking-widest uppercase block mb-2">
              Ergonomie Hospitalière
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-white font-normal">
              Le produit en action
            </h2>
            <p className="font-sans text-[#bacbbc] text-base sm:text-lg mt-4">
              Une interface épurée, sans distraction, développée pour minimiser la charge cognitive en situation de crise.
            </p>

            {/* Onglets interactifs vert émeraude */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2 mt-8 p-1.5 bg-[#031714] border border-neon/30 rounded-xl shadow-neon-sm">
              {[
                { id: 'dashboard', label: 'Tableau de bord' },
                { id: 'patient', label: 'Dossier patient' },
                { id: 'pharmacie', label: 'Pharmacie' },
                { id: 'bloc', label: 'Bloc opératoire' },
              ].map((tab) => {
                const isActive = activeProductTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveProductTab(tab.id as any)}
                    type="button"
                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald via-neon to-mint text-darkforest shadow-neon-sm'
                        : 'text-[#bacbbc] hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cadre d'application interactif */}
          <div className="rounded-xl border border-neon/30 bg-[#041f1a]/90 p-8 shadow-emerald-card relative transition-all duration-300 overflow-hidden">
            <div className="laser-line" />

            {/* Onglet 1: Tableau de bord */}
            {activeProductTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#09382f]">
                  <div>
                    <div className="font-serif text-2xl text-white">Vue générale de l'établissement</div>
                    <div className="text-xs text-[#859587] font-mono mt-0.5">Mis à jour il y a 12 secondes • 360 lits monitorés</div>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs bg-[#021411] px-4 py-2 rounded-lg border border-neon/20">
                    <span className="text-[#859587]">Taux d'occupation global :</span>
                    <span className="text-neon font-bold text-sm drop-shadow-[0_0_6px_rgba(0,220,130,0.5)]">92.4%</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-5 rounded-lg bg-[#021411] border border-[#09382f] hover:border-neon/40 transition-colors">
                    <div className="text-xs text-[#859587] font-mono">Lits disponibles</div>
                    <div className="font-serif text-3xl text-white mt-1">28 <span className="text-xs text-[#859587] font-sans">/ 360</span></div>
                    <div className="text-xs text-[#bacbbc] mt-2 font-mono">Urgences : 4 lits</div>
                  </div>
                  <div className="p-5 rounded-lg bg-[#021411] border border-[#09382f] hover:border-neon/40 transition-colors">
                    <div className="text-xs text-[#859587] font-mono">Interventions programmées</div>
                    <div className="font-serif text-3xl text-white mt-1">19 <span className="text-xs text-[#859587] font-sans">ce jour</span></div>
                    <div className="text-xs text-neon mt-2 font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" /> 14 réalisées
                    </div>
                  </div>
                  <div className="p-5 rounded-lg bg-[#021411] border border-[#09382f] hover:border-neon/40 transition-colors">
                    <div className="text-xs text-[#859587] font-mono">Attente moyenne urgences</div>
                    <div className="font-serif text-3xl text-white mt-1">34 <span className="text-xs text-[#859587] font-sans">min</span></div>
                    <div className="text-xs text-mint mt-2 font-mono">Conforme aux objectifs</div>
                  </div>
                  <div className="p-5 rounded-lg bg-[#021411] border border-[#09382f] hover:border-neon/40 transition-colors">
                    <div className="text-xs text-[#859587] font-mono">Alertes pharmacie</div>
                    <div className="font-serif text-3xl text-neon mt-1 drop-shadow-[0_0_8px_rgba(0,220,130,0.5)]">0 <span className="text-xs text-[#859587] font-sans">critique</span></div>
                    <div className="text-xs text-neon mt-2 font-mono">Ruptures prévenues</div>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet 2: Dossier patient */}
            {activeProductTab === 'patient' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#09382f]">
                  <div>
                    <div className="font-serif text-2xl text-white">Dossier Patient Informatisé (DPI)</div>
                    <div className="text-xs text-[#859587] font-mono mt-0.5">Patiente : Sophie MOREL • IPP 89201944</div>
                  </div>
                  <span className="text-xs font-mono px-3 py-1 bg-neon/10 text-neon border border-neon/30 rounded">
                    Séjour Ambulatoire
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-sans">
                  <div className="p-5 rounded-lg bg-[#021411] border border-[#09382f] space-y-2">
                    <div className="text-xs font-mono text-neon uppercase">Antécédents & Facteurs de risque</div>
                    <p className="text-[#d0e7e2]">Allergie avérée aux pénicillines. Hypertension traitée au long cours.</p>
                    <div className="text-xs text-[#859587] pt-2 border-t border-[#09382f] font-mono">Dernier passage cardiologie : 14/02/2024</div>
                  </div>
                  <div className="p-5 rounded-lg bg-[#021411] border border-[#09382f] space-y-2">
                    <div className="text-xs font-mono text-neon uppercase">Ordonnance de sortie générée</div>
                    <p className="text-[#d0e7e2]">Transmission effectuée vers Mon Espace Santé et pharmacie d'officine référente.</p>
                    <div className="text-xs text-neon pt-2 border-t border-[#09382f] font-mono flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-neon" /> Signature électronique apposée (e-CPS)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet 3: Pharmacie */}
            {activeProductTab === 'pharmacie' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#09382f]">
                  <div>
                    <div className="font-serif text-2xl text-white">Validation Pharmaceutique Quotidienne</div>
                    <div className="text-xs text-[#859587] font-mono mt-0.5">Service Réanimation Polyvalente</div>
                  </div>
                  <span className="text-xs font-mono text-mint">32 ordonnances en file d'attente</span>
                </div>
                <div className="p-5 rounded-lg bg-[#021411] border border-[#09382f] space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white font-semibold">Prescription : Vancomycine perfusion continue</span>
                    <span className="text-neon bg-neon/10 px-2 py-0.5 rounded border border-neon/30">
                      Dose ajustée selon fonction rénale
                    </span>
                  </div>
                  <p className="text-xs text-[#d0e7e2] font-sans">
                    Algorithme de clairance validé automatiquement selon le dernier ionogramme reçu du laboratoire de biochimie à 11h20.
                  </p>
                </div>
              </div>
            )}

            {/* Onglet 4: Bloc opératoire */}
            {activeProductTab === 'bloc' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#09382f]">
                  <div>
                    <div className="font-serif text-2xl text-white">Régulation du Plateau Chirurgical</div>
                    <div className="text-xs text-[#859587] font-mono mt-0.5">8 salles d'opération actives</div>
                  </div>
                  <span className="text-xs font-mono text-neon flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" /> Programme respecté à 98%
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-5 rounded-lg bg-[#021411] border border-[#09382f]">
                    <div className="text-[#859587] mb-1">Salle 2 - Chirurgie Vasculaire</div>
                    <div className="text-white font-semibold text-sm">Fin d'intervention estimée : 15h40</div>
                    <div className="text-mint mt-2">Équipe bionettoyage alertée</div>
                  </div>
                  <div className="p-5 rounded-lg bg-[#021411] border border-[#09382f]">
                    <div className="text-[#859587] mb-1">Salle 4 - Orthopédie</div>
                    <div className="text-white font-semibold text-sm">Check-list pré-opératoire validée</div>
                    <div className="text-neon mt-2">Patient en induction anesthésique</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. INTELLIGENCE CLINIQUE & AIDE À LA DÉCISION (avec Canvas Three.js ADN)
          ========================================================================= */}
      <section className="py-28 bg-[#010e0b] border-b border-[#09382f] relative overflow-hidden" id="intelligence">
        {/* Intègre un canvas Three.js interactif représentant une double hélice d'ADN en rotation subtile réagissant au curseur */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[600px] opacity-25 pointer-events-none hidden lg:block">
          <DnaHelixCanvas />
        </div>

        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          <div className="max-w-2xl mb-16">
            <span className="font-mono text-xs text-neon tracking-widest uppercase block mb-2">
              Aide à la Décision
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-white font-normal leading-tight">
              Intelligence clinique au service du praticien
            </h2>
            <p className="font-sans text-[#bacbbc] text-base mt-4">
              Des modules d'aide décisionnelle intégrés nativement, conçus pour épauler le geste médical sans jamais l'entraver.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Carte 1 : Cartographie hospitalière */}
            <div className="p-8 rounded-xl border border-neon/20 bg-[#031c17] hover:border-neon hover:shadow-neon-glow transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
              <img
                src="/images/hospital_emergency_icu.jpg"
                alt="Flux hospitalier et monitoring des lits"
                className="absolute inset-0 w-full h-full object-cover duotone-emerald opacity-15 group-hover:scale-105 group-hover:opacity-25 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#021411] via-[#021411]/85 to-transparent" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg border border-neon/40 flex items-center justify-center text-neon mb-6 bg-[#021411] shadow-neon-sm">
                  <BedDouble className="w-6 h-6 text-neon" />
                </div>
                <h3 className="font-serif text-2xl text-white mb-3 group-hover:text-mint transition-colors">
                  Cartographie hospitalière dynamique
                </h3>
                <p className="text-sm text-[#bacbbc] font-sans leading-relaxed">
                  Visualisation en temps réel de la tension capacitaire des services, du flux des brancardages et de la disponibilité des équipements lourds d'imagerie.
                </p>
              </div>
              <div className="relative z-10 mt-8 pt-4 border-t border-[#09382f] font-mono text-xs text-[#859587] flex justify-between items-center">
                <span>Mise à jour en continu</span>
                <span className="text-neon font-semibold">100% temps réel</span>
              </div>
            </div>

            {/* Carte 2 : Simulateur pharmacogénétique */}
            <div className="p-8 rounded-xl border border-neon/20 bg-[#031c17] hover:border-neon hover:shadow-neon-glow transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
              <img
                src="/images/hospital_genetics_biotech.jpg"
                alt="Simulateur pharmacogénétique"
                className="absolute inset-0 w-full h-full object-cover duotone-emerald opacity-15 group-hover:scale-105 group-hover:opacity-25 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#021411] via-[#021411]/85 to-transparent" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg border border-neon/40 flex items-center justify-center text-neon mb-6 bg-[#021411] shadow-neon-sm">
                  <Dna className="w-6 h-6 text-neon" />
                </div>
                <h3 className="font-serif text-2xl text-white mb-3 group-hover:text-mint transition-colors">
                  Simulateur pharmacogénétique
                </h3>
                <p className="text-sm text-[#bacbbc] font-sans leading-relaxed">
                  Détection anticipée des incompatibilités moléculaires et ajustement automatique des posologies selon le profil génétique et la fonction rénale du patient.
                </p>
                {/* Sélecteur rapide de gène interactif */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {(['CYP2C19', 'DPYD', 'CYP2D6', 'SLCO1B1'] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGene(g)}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                        selectedGene === g
                          ? 'border-neon bg-neon/20 text-neon'
                          : 'border-[#09382f] text-[#859587] hover:text-white'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative z-10 mt-6 pt-4 border-t border-[#09382f] font-mono text-xs text-[#859587] flex justify-between items-center">
                <span>Base Claude Bernard</span>
                <span className="text-neon font-semibold">Certifié HAS</span>
              </div>
            </div>

            {/* Carte 3 : Détection précoce NEWS-2 */}
            <div className="p-8 rounded-xl border border-neon/20 bg-[#031c17] hover:border-neon hover:shadow-neon-glow transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
              <img
                src="/images/medical_stethoscope.jpg"
                alt="Aide au diagnostic et alertes sepsis"
                className="absolute inset-0 w-full h-full object-cover duotone-emerald opacity-15 group-hover:scale-105 group-hover:opacity-25 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#021411] via-[#021411]/85 to-transparent" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg border border-neon/40 flex items-center justify-center text-neon mb-6 bg-[#021411] shadow-neon-sm">
                  <Activity className="w-6 h-6 text-neon" />
                </div>
                <h3 className="font-serif text-2xl text-white mb-3 group-hover:text-mint transition-colors">
                  Détection précoce des détériorations
                </h3>
                <p className="text-sm text-[#bacbbc] font-sans leading-relaxed">
                  Croisement permanent des constantes vitales pour identifier les signes précoces de sepsis ou de choc, alertant immédiatement l'équipe médicale d'astreinte.
                </p>
              </div>
              <div className="relative z-10 mt-8 pt-4 border-t border-[#09382f] font-mono text-xs text-[#859587] flex justify-between items-center">
                <span>Conforme score NEWS-2</span>
                <span className="text-neon font-semibold">Alerte &lt; 60s</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. SECTION DÉPLOIEMENT & FORMULAIRE D'ENGAGEMENT
          ========================================================================= */}
      <section className="relative py-32 bg-night border-b border-[#09382f] overflow-hidden" id="contact">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/images/hospital_modern_hero.jpg"
            alt="Centre Hospitalier Moderne"
            className="w-full h-full object-cover duotone-emerald opacity-15 filter brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-night via-night/95 to-night" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[300px] bg-neon/15 rounded-full blur-[140px] pointer-events-none animate-glow-pulse" />
        </div>

        {/* Ligne ECG traversant toute la largeur et battant doucement en vert électrique */}
        <div className="absolute top-12 left-0 w-full pointer-events-none opacity-60 z-10">
          <svg className="w-full h-16" fill="none" viewBox="0 0 1400 60">
            <path
              className="ecg-pulse-loop"
              d="M0 30 H450 L470 10 L490 50 L510 15 L530 40 L545 30 H950 L970 8 L990 52 L1015 15 L1035 42 L1050 30 H1400"
              stroke="#00dc82"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="relative z-20 max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-6">
              <span className="font-mono text-xs text-neon tracking-widest uppercase block mb-3">
                Déploiement Territorial & CHU
              </span>
              <h2 className="font-serif text-4xl sm:text-6xl text-white font-normal leading-tight">
                Voyez SoftCare dans votre hôpital.
              </h2>
              <p className="font-sans text-[#bacbbc] text-lg mt-6 max-w-lg leading-relaxed">
                Nos consultants médicaux organisent une démonstration adaptée aux spécificités de votre établissement et de vos équipes soignantes.
              </p>

              <div className="mt-12 space-y-4 text-sm text-[#bacbbc] font-mono">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-neon shadow-neon-sm" />
                  <span>Déploiement progressif par pôle clinique</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-neon shadow-neon-sm" />
                  <span>Reprise intégrale de vos historiques de données</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-neon shadow-neon-sm" />
                  <span>Formation sur site assurée par des pairs soignants</span>
                </div>
              </div>
            </div>

            {/* Formulaire dédié */}
            <div className="lg:col-span-6">
              <div className="p-8 sm:p-10 rounded-2xl border border-neon/30 bg-[#031c17]/95 backdrop-blur-md shadow-emerald-card relative overflow-hidden">
                <div className="laser-line" />

                {!formSubmitted ? (
                  <form onSubmit={handleFormSubmit} className="space-y-6 relative z-10">
                    {/* Honeypot anti-spam */}
                    <input
                      type="text"
                      name="website_url"
                      value={formValues.honeypot}
                      onChange={(e) => setFormValues({ ...formValues, honeypot: e.target.value })}
                      className="hidden"
                      tabIndex={-1}
                      autoComplete="off"
                    />

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#d0e7e2] mb-2" htmlFor="form-name">
                        Nom et prénom *
                      </label>
                      <input
                        id="form-name"
                        type="text"
                        required
                        value={formValues.name}
                        onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                        placeholder="Dr. Alexandre Martin"
                        className="w-full px-4 py-3 rounded-lg bg-[#021411] border border-[#09382f] text-white focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon text-sm transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#d0e7e2] mb-2" htmlFor="form-institution">
                        Établissement de santé *
                      </label>
                      <input
                        id="form-institution"
                        type="text"
                        required
                        value={formValues.institution}
                        onChange={(e) => setFormValues({ ...formValues, institution: e.target.value })}
                        placeholder="Centre Hospitalier Universitaire..."
                        className="w-full px-4 py-3 rounded-lg bg-[#021411] border border-[#09382f] text-white focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon text-sm transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#d0e7e2] mb-2" htmlFor="form-email">
                        E-mail professionnel *
                      </label>
                      <input
                        id="form-email"
                        type="email"
                        required
                        value={formValues.email}
                        onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                        placeholder="a.martin@chu-etablissement.fr"
                        className="w-full px-4 py-3 rounded-lg bg-[#021411] border border-[#09382f] text-white focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon text-sm transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#d0e7e2] mb-2" htmlFor="form-message">
                        Périmètre ou modules d'intérêt
                      </label>
                      <textarea
                        id="form-message"
                        rows={3}
                        value={formValues.message}
                        onChange={(e) => setFormValues({ ...formValues, message: e.target.value })}
                        placeholder="Précisez votre nombre de lits ou vos priorités cliniques..."
                        className="w-full px-4 py-3 rounded-lg bg-[#021411] border border-[#09382f] text-white focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon text-sm transition-colors resize-none"
                      />
                    </div>

                    {formError && (
                      <div className="p-3 rounded bg-red-950/50 border border-red-500/40 text-red-200 text-xs">
                        {formError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmittingForm}
                      className="w-full py-4 rounded-lg bg-gradient-to-r from-emerald via-neon to-mint text-darkforest font-bold text-base transition-all duration-300 shadow-neon-glow hover:brightness-110 active:scale-[0.98] flex items-center justify-center cursor-pointer disabled:opacity-50"
                    >
                      {isSubmittingForm ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2 text-darkforest" />
                          <span>Transmission sécurisée...</span>
                        </>
                      ) : (
                        <span>Demander une démo</span>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="p-8 rounded-lg bg-[#021411] border border-neon/50 text-center space-y-4 shadow-neon-sm">
                    <div className="w-12 h-12 rounded-full bg-neon/15 border border-neon flex items-center justify-center mx-auto text-neon shadow-neon-sm">
                      <Check className="w-6 h-6" />
                    </div>
                    <div className="font-serif text-3xl text-white">Demande enregistrée</div>
                    <p className="text-sm text-[#bacbbc] font-sans leading-relaxed">
                      Un référent clinique SoftCare prendra contact sous 24 heures ouvrées pour convenir d'un créneau d'échange personnalisé.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          10. FOOTER INSTITUTIONNEL COMPLET
          ========================================================================= */}
      <footer className="bg-[#010a08] py-16 text-[#859587] text-xs font-sans border-t border-[#09382f]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#082d26]">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 rounded border border-neon/40 flex items-center justify-center bg-deep/80 shadow-neon-sm">
                  <svg className="w-4 h-4 text-neon" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M2 12h5l2-6 4 13 3-9 2 5h4"
                      stroke="#00dc82"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="font-serif text-2xl text-white font-normal">SoftCare</span>
              </div>
              <p className="text-[#859587] leading-relaxed">
                Système d'information hospitalier unifié. Dossier patient informatisé, logistique pharmaceutique et régulation des blocs.
              </p>
            </div>

            <div>
              <div className="font-mono text-neon uppercase tracking-wider mb-4">Navigation</div>
              <ul className="space-y-2">
                <li><a href="#parcours" className="hover:text-white transition-colors">Parcours de soins</a></li>
                <li><a href="#modules" className="hover:text-white transition-colors">Modules cliniques</a></li>
                <li><a href="#produit" className="hover:text-white transition-colors">Le produit</a></li>
                <li><a href="#intelligence" className="hover:text-white transition-colors">IA décisionnelle</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Démonstration</a></li>
              </ul>
            </div>

            <div>
              <div className="font-mono text-neon uppercase tracking-wider mb-4">Établissements</div>
              <ul className="space-y-2">
                <li><span className="text-[#859587]">Centres Hospitaliers Régionaux</span></li>
                <li><span className="text-[#859587]">Cliniques et ESPIC</span></li>
                <li><span className="text-[#859587]">Groupements Hospitaliers de Territoire</span></li>
                <li><span className="text-[#859587]">Établissements de santé mentale</span></li>
              </ul>
            </div>

            <div>
              <div className="font-mono text-neon uppercase tracking-wider mb-4">Contact & Sécurité</div>
              <p className="text-[#859587] mb-2">Direction des relations hospitalières</p>
              <p className="font-mono text-white hover:text-neon transition-colors cursor-pointer mb-3">contact@softcare-sih.fr</p>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#031714] border border-[#09382f] text-[10px] font-mono text-mint">
                <span className="w-1.5 h-1.5 rounded-full bg-neon" />
                Hébergement Certifié HDS & RGPD
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[#859587]">
            <div>© 2025-2026 SoftCare Systems. Tous droits réservés.</div>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-neon transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-neon transition-colors">Protection des données HDS</a>
              <a href="#" className="hover:text-neon transition-colors">Accessibilité</a>
              <a href="#" className="hover:text-neon transition-colors">Plan du site</a>
            </div>
          </div>
        </div>
      </footer>
      </div>

      {/* Modal Démo Etablissement */}
      <DemoRequestModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
      />

      {/* Modal Brochure */}
      <BrochureModal
        isOpen={showBrochureModal}
        onClose={() => setShowBrochureModal(false)}
      />
    </div>
  );
};

export default LandingPage;
