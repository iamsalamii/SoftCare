import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, Volume2, VolumeX, RotateCcw, Maximize2, Minimize2,
  Sparkles, Dna, Brain, QrCode, Stethoscope, Activity,
  CheckCircle2, AlertTriangle, ShieldCheck, ChevronRight,
  Layers, ArrowRight, UserCheck, Video, Radio, Mic, MicOff,
  Eye, LayoutDashboard, Zap, RefreshCw, X, MessageSquare,
  ShieldAlert, Scan, Plus, Minus
} from 'lucide-react';

interface HeroVideoDemoProps {
  onRequestDemo: () => void;
  onGoToLogin: () => void;
}

interface DemoChapter {
  id: number;
  title: string;
  badge: string;
  duration: number; // in seconds
  subtitle: string;
  voiceText: string;
  visualType: 'dpi' | 'pharmacy' | 'pgx' | 'ai';
}

const DEMO_CHAPTERS: DemoChapter[] = [
  {
    id: 1,
    title: 'Dossier Patient & Triage Urgences',
    badge: 'DPI Hémodynamique',
    duration: 12,
    subtitle: 'Prise en charge instantanée : constantes vitales en temps réel, score de Glasgow et antécédents médicaux centralisés.',
    voiceText: "Bonjour, je suis le Docteur Éléonore Vance. Bienvenue dans SoftCare. Dès l'admission du patient, les constantes vitales sont acquises en temps réel avec calcul automatique du score de gravité pour un triage médical sans délai. Vous pouvez tester l'ajustement des constantes directement sur l'écran.",
    visualType: 'dpi'
  },
  {
    id: 2,
    title: 'Pharmacie & Traçabilité GS1',
    badge: 'Traçabilité GS1 (<5ms)',
    duration: 12,
    subtitle: 'Scan GS1 à la douchette en moins de 5ms : vérification des lots, dates de péremption et sécurisation de la délivrance.',
    voiceText: "Dans le module de pharmacie hospitalière, la douchette code-barres identifie chaque boîte de médicament en moins de cinq millisecondes. Cliquez sur le bouton de scan pour déclencher la douchette et constater la déduction instantanée de stock.",
    visualType: 'pharmacy'
  },
  {
    id: 3,
    title: 'Biotechnologies & Intercepteur PGx',
    badge: 'Pharmacogénomique CPIC',
    duration: 14,
    subtitle: 'Interception automatique : détection du variant CYP2C19 *2/*2 et substitution préventive du Clopidogrel.',
    voiceText: "SoftCare intègre une innovation majeure : l'intercepteur pharmacogénomique. En croisant le profil génétique du patient, le système bloque immédiatement toute prescription toxique de Clopidogrel. Cliquez sur le bouton pour appliquer la substitution sécurisée.",
    visualType: 'pgx'
  },
  {
    id: 4,
    title: 'Diagnostic Différentiel IA & Protocoles',
    badge: 'Intelligence Clinique CDS',
    duration: 13,
    subtitle: 'Hypothèses diagnostiques probabilistes, protocoles CDS Hooks et prescriptions assistées en temps réel.',
    voiceText: "Enfin, notre intelligence clinique assiste le praticien en calculant les probabilités diagnostiques différentielles en temps réel. Cliquez sur les biomarqueurs pour recalculer les probabilités algorithmiques.",
    visualType: 'ai'
  }
];

export const HeroVideoDemo: React.FC<HeroVideoDemoProps> = ({ onRequestDemo, onGoToLogin }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [chapterProgress, setChapterProgress] = useState(0); // 0 to 100
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'presenter' | 'interface'>('split');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Interactive Playground States for Live Hands-on Testing
  // Scene 1: Triage
  const [patientHR, setPatientHR] = useState(118);
  const [patientBP, setPatientBP] = useState('145/92');
  const [patientSpO2, setPatientSpO2] = useState(96);
  const [triageLevel, setTriageLevel] = useState<number>(2);

  // Scene 2: Barcode & Pharmacy
  const [stockQuantity, setStockQuantity] = useState(420);
  const [isLaserScanning, setIsLaserScanning] = useState(false);
  const [scannedCount, setScannedCount] = useState(1);
  const [selectedMedication, setSelectedMedication] = useState<'amox' | 'morph' | 'plavix'>('amox');

  // Scene 3: PGx Interceptor
  const [pgxInterceptionActive, setPgxInterceptionActive] = useState(true);
  const [isSubstituted, setIsSubstituted] = useState(false);

  // Scene 4: AI Decision
  const [aiProbabilitySCA, setAiProbabilitySCA] = useState(92);
  const [isCalculatingAI, setIsCalculatingAI] = useState(false);
  const [biomarkerTroponin, setBiomarkerTroponin] = useState(true);
  const [biomarkerECG, setBiomarkerECG] = useState(true);

  // Doctor Vance Live Q&A State
  const [activeQAAnswer, setActiveQAAnswer] = useState<string | null>(null);

  const currentChapter = DEMO_CHAPTERS[currentChapterIndex];

  // Pick female voice if available
  const getFemaleVoice = (): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    const frenchVoices = voices.filter(v => v.lang.startsWith('fr'));
    
    const femaleFrench = frenchVoices.find(v => {
      const name = v.name.toLowerCase();
      return name.includes('female') || name.includes('audrey') || name.includes('amelie') || 
             name.includes('hortense') || name.includes('julie') || name.includes('celine') || 
             name.includes('denise') || name.includes('google français') || name.includes('siwis');
    });

    return femaleFrench || frenchVoices[0] || null;
  };

  // Speak function for voice-over
  const speakVoiceOver = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    if (isMuted) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.02;
    utterance.pitch = 1.08;

    const femaleVoice = getFemaleVoice();
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onstart = () => setIsVoiceSpeaking(true);
    utterance.onend = () => setIsVoiceSpeaking(false);
    utterance.onerror = () => setIsVoiceSpeaking(false);

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Trigger voice-over when chapter changes or when unmuting
  useEffect(() => {
    if (isPlaying && !isMuted) {
      const timer = setTimeout(() => {
        speakVoiceOver(currentChapter.voiceText);
      }, 250);
      return () => clearTimeout(timer);
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsVoiceSpeaking(false);
      }
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentChapterIndex, isMuted, isPlaying]);

  // Main video timer progression loop
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 100; // updates every 100ms
    const stepIncrement = (intervalTime / (currentChapter.duration * 1000)) * 100;

    const interval = setInterval(() => {
      setChapterProgress(prev => {
        if (prev >= 100) {
          setCurrentChapterIndex(oldIndex => (oldIndex + 1) % DEMO_CHAPTERS.length);
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isPlaying, currentChapterIndex, currentChapter.duration]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  const handleSelectChapter = (index: number) => {
    setActiveQAAnswer(null);
    setCurrentChapterIndex(index);
    setChapterProgress(0);
    setIsPlaying(true);
  };

  // Trigger Interactive Barcode Scanner
  const triggerLaserScan = () => {
    setIsLaserScanning(true);
    setTimeout(() => {
      setIsLaserScanning(false);
      setStockQuantity(prev => Math.max(0, prev - 1));
      setScannedCount(prev => prev + 1);
    }, 600);
  };

  // Trigger Interactive AI Recalculation
  const triggerAIRecalculation = () => {
    setIsCalculatingAI(true);
    setTimeout(() => {
      setIsCalculatingAI(false);
      setAiProbabilitySCA(prev => prev === 92 ? 97 : 92);
    }, 800);
  };

  // Trigger Dr. Vance Q&A Answer
  const handleAskDoctor = (question: string, answer: string) => {
    setActiveQAAnswer(answer);
    speakVoiceOver(answer);
  };

  const containerContent = (
    <div className={`relative w-full rounded-3xl overflow-hidden border border-cyan-500/40 shadow-2xl bg-slate-950 text-white select-none transition-all duration-300 ${
      isFullscreen ? 'max-w-7xl mx-auto h-[92vh] flex flex-col justify-between' : 'max-w-6xl mx-auto'
    }`}>
      
      {/* Top Video Header / HUD Bar */}
      <div className="px-4 sm:px-6 py-3 bg-slate-900/95 backdrop-blur-md border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block animate-pulse" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-full">
              <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>DÉMO GRAND FORMAT INTERACTIVE</span>
            </span>
            <span className="hidden lg:inline text-xs text-gray-400 font-sans">
              &bull; Présentée par le <strong>Dr. Éléonore Vance</strong>
            </span>
          </div>
        </div>

        {/* View Mode & Video Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1 rounded-lg transition-all font-semibold ${
                viewMode === 'split' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Vue Mixte
            </button>
            <button
              onClick={() => setViewMode('presenter')}
              className={`px-3 py-1 rounded-lg transition-all font-semibold ${
                viewMode === 'presenter' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Présentatrice
            </button>
            <button
              onClick={() => setViewMode('interface')}
              className={`px-3 py-1 rounded-lg transition-all font-semibold ${
                viewMode === 'interface' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Logiciel
            </button>
          </div>

          {/* Voice Over Audio Toggle */}
          <button
            onClick={toggleMute}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-cyan-300 transition-colors border border-white/10 text-xs font-semibold"
            title={isMuted ? 'Activer la voix off' : 'Couper la voix off'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span className="hidden sm:inline">{isMuted ? 'Voix coupée' : 'Voix active'}</span>
          </button>

          {/* Fullscreen / Theater Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-colors"
            title={isFullscreen ? 'Quitter plein écran' : 'Afficher en Grand Plein Écran'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Video Viewport Display Canvas */}
      <div className={`relative bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 p-4 sm:p-8 flex flex-col justify-between overflow-hidden ${
        isFullscreen ? 'flex-1 overflow-y-auto' : 'min-h-[480px] sm:min-h-[540px]'
      }`}>
        {/* Ambient Glows */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Dynamic Display Grid */}
        <div className="relative z-10 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* LEFT: Generative Video Presenter (Dr. Vance) */}
          {(viewMode === 'split' || viewMode === 'presenter') && (
            <div className={`${viewMode === 'presenter' ? 'lg:col-span-12 max-w-2xl mx-auto' : 'lg:col-span-5'} flex flex-col items-center justify-center`}>
              <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden border-2 border-cyan-400/50 shadow-2xl bg-slate-900 group">
                <img
                  src="/demo-doctor.jpg"
                  alt="Dr. Éléonore Vance - Présentatrice Démo Médicale"
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    isPlaying ? 'scale-105 filter brightness-105' : 'scale-100 filter brightness-95'
                  }`}
                />
                
                {/* Live Presenter Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-black/30 pointer-events-none" />
                
                {/* Top Live Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-slate-950/85 backdrop-blur-md rounded-full border border-red-500/40 shadow-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="text-[11px] font-bold text-red-300 uppercase tracking-wider">Direct Studio</span>
                </div>

                {/* Voice Equalizer status */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-slate-950/85 backdrop-blur-md rounded-full border border-cyan-500/40 shadow-lg">
                  <Mic className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span className="text-[11px] font-mono text-cyan-300 font-bold">
                    {isVoiceSpeaking ? 'En direct' : 'En veille'}
                  </span>
                </div>

                {/* Bottom Presenter Credentials & Interactive Speak Trigger */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 bg-slate-950/90 backdrop-blur-md rounded-2xl border border-white/15 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>Dr. Éléonore Vance</span>
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      </p>
                      <p className="text-xs text-cyan-300 font-medium">Directrice Médicale &bull; SoftCare Hospital OS</p>
                    </div>
                    <button
                      onClick={() => speakVoiceOver(currentChapter.voiceText)}
                      className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Écouter</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Interactive Doctor Q&A Quick Chips */}
              <div className="w-full max-w-md mt-3 space-y-1.5">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Poser une question au Dr. Vance :</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleAskDoctor(
                      "Sécurité HDS",
                      "Toutes les données de santé traitées par SoftCare sont chiffrées de bout en bout et hébergées exclusivement sur des infrastructures certifiées HDS et conformes au RGPD."
                    )}
                    className="px-2.5 py-1 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/40 rounded-lg text-[11px] text-gray-300 hover:text-cyan-200 transition-all text-left"
                  >
                    🔒 Sécurité HDS & RGPD ?
                  </button>
                  <button
                    onClick={() => handleAskDoctor(
                      "Douchette",
                      "Notre moteur de lecture GS1 DataMatrix répond en moins de 5 millisecondes, compatible avec toutes les douchettes USB et Bluetooth du marché hospitalier."
                    )}
                    className="px-2.5 py-1 bg-white/5 hover:bg-teal-500/20 border border-white/10 hover:border-teal-400/40 rounded-lg text-[11px] text-gray-300 hover:text-teal-200 transition-all text-left"
                  >
                    ⚡ Vitesse douchette &lt;5ms ?
                  </button>
                  <button
                    onClick={() => handleAskDoctor(
                      "PGx",
                      "L'intercepteur pharmacogénomique croise les biomarqueurs du patient avec les recommandations CPIC pour bloquer les prescriptions inadaptées comme le Clopidogrel."
                    )}
                    className="px-2.5 py-1 bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-400/40 rounded-lg text-[11px] text-gray-300 hover:text-purple-200 transition-all text-left"
                  >
                    🧬 Blocage génétique PGx ?
                  </button>
                </div>

                {activeQAAnswer && (
                  <div className="p-3 bg-cyan-950/80 border border-cyan-500/40 rounded-2xl text-xs text-cyan-100 mt-2 animate-in fade-in duration-200">
                    <p className="font-bold text-cyan-300 mb-0.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Réponse du Dr. Vance :</span>
                    </p>
                    <p className="leading-relaxed">{activeQAAnswer}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* RIGHT: High-Tech Software Interactive Screen */}
          {(viewMode === 'split' || viewMode === 'interface') && (
            <div className={`${viewMode === 'interface' ? 'lg:col-span-12 max-w-4xl mx-auto' : 'lg:col-span-7'} space-y-4`}>
              
              {/* SCENE 1: DPI & Interactive Triage */}
              {currentChapter.visualType === 'dpi' && (
                <div className="bg-slate-900/95 backdrop-blur-md p-6 rounded-3xl border border-cyan-500/40 space-y-4 shadow-2xl animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Jean-Marc DUPONT &middot; 58 ans</p>
                        <p className="text-xs text-gray-400 font-mono">IPP : PAT-2026-08492 &middot; Lit Urgences #04</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                      triageLevel === 1 ? 'bg-red-500/30 text-red-200 border-red-500 animate-ping' :
                      triageLevel === 2 ? 'bg-red-500/20 text-red-300 border-red-500/40' :
                      triageLevel === 3 ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' :
                      'bg-green-500/20 text-green-300 border-green-500/40'
                    }`}>
                      Niveau de Triage {triageLevel} ({triageLevel === 1 ? 'Urgence Vitale' : triageLevel === 2 ? 'Très Urgent' : 'Stable'})
                    </span>
                  </div>

                  {/* Live Interactive Telemetry Cards */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-slate-950/80 rounded-2xl border border-white/10 hover:border-cyan-500/50 transition-colors">
                      <p className="text-xs text-gray-400">Pouls Cardiaque</p>
                      <p className="text-xl font-black text-cyan-400 mt-1">{patientHR} <span className="text-xs font-normal text-gray-400">bpm</span></p>
                      <div className="flex justify-center gap-1 mt-2">
                        <button
                          onClick={() => setPatientHR(76)}
                          className="px-2 py-0.5 bg-white/10 hover:bg-cyan-500/20 rounded text-[10px] text-gray-300"
                        >
                          76 bpm
                        </button>
                        <button
                          onClick={() => setPatientHR(142)}
                          className="px-2 py-0.5 bg-red-500/20 hover:bg-red-500/30 rounded text-[10px] text-red-300"
                        >
                          142 bpm
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950/80 rounded-2xl border border-white/10 hover:border-emerald-500/50 transition-colors">
                      <p className="text-xs text-gray-400">Tension Artérielle</p>
                      <p className="text-xl font-black text-emerald-400 mt-1">{patientBP} <span className="text-xs font-normal text-gray-400">mmHg</span></p>
                      <div className="flex justify-center gap-1 mt-2">
                        <button
                          onClick={() => setPatientBP('120/80')}
                          className="px-2 py-0.5 bg-white/10 hover:bg-emerald-500/20 rounded text-[10px] text-gray-300"
                        >
                          120/80
                        </button>
                        <button
                          onClick={() => setPatientBP('165/105')}
                          className="px-2 py-0.5 bg-red-500/20 hover:bg-red-500/30 rounded text-[10px] text-red-300"
                        >
                          165/105
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950/80 rounded-2xl border border-white/10 hover:border-teal-500/50 transition-colors">
                      <p className="text-xs text-gray-400">SpO2 / O2</p>
                      <p className="text-xl font-black text-teal-400 mt-1">{patientSpO2} <span className="text-xs font-normal text-gray-400">%</span></p>
                      <div className="flex justify-center gap-1 mt-2">
                        <button
                          onClick={() => setPatientSpO2(99)}
                          className="px-2 py-0.5 bg-white/10 hover:bg-teal-500/20 rounded text-[10px] text-gray-300"
                        >
                          99%
                        </button>
                        <button
                          onClick={() => setPatientSpO2(91)}
                          className="px-2 py-0.5 bg-red-500/20 hover:bg-red-500/30 rounded text-[10px] text-red-300"
                        >
                          91%
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Triage Simulator Button */}
                  <div className="p-3.5 bg-teal-500/10 rounded-2xl border border-teal-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-xs text-teal-200">
                      <Activity className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
                      <span>Échelle de Triage Dynamique :</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4].map(lvl => (
                        <button
                          key={lvl}
                          onClick={() => setTriageLevel(lvl)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                            triageLevel === lvl
                              ? 'bg-cyan-500 text-slate-950 shadow-md scale-110'
                              : 'bg-white/10 hover:bg-white/20 text-gray-300'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SCENE 2: Pharmacie & Interactive Barcode Scanner */}
              {currentChapter.visualType === 'pharmacy' && (
                <div className="bg-slate-900/95 backdrop-blur-md p-6 rounded-3xl border border-teal-500/40 space-y-4 shadow-2xl animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Scanner Douchette GS1 DataMatrix</p>
                        <p className="text-xs text-gray-400 font-mono">Latence matérielle &lt; 5 millisecondes</p>
                      </div>
                    </div>
                    <button
                      onClick={triggerLaserScan}
                      disabled={isLaserScanning}
                      className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-teal-500/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                      <Scan className="w-4 h-4 animate-bounce" />
                      <span>{isLaserScanning ? 'Scan en cours...' : 'BIP ! Tester le Scan'}</span>
                    </button>
                  </div>

                  {/* Medication Display with simulated Laser Scan */}
                  <div className="relative p-4 bg-slate-950/90 rounded-2xl border border-white/10 overflow-hidden">
                    {/* Laser Beam Animation */}
                    {isLaserScanning && (
                      <div className="absolute inset-0 bg-red-500/10 pointer-events-none flex items-center">
                        <div className="w-full h-1 bg-red-500 shadow-[0_0_15px_#ef4444] animate-pulse" />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-mono text-[10px] font-bold">
                            CIP: 3400936284920
                          </span>
                          <span className="text-xs text-gray-400 font-mono">Lot #BX-84920</span>
                        </div>
                        <p className="text-base font-bold text-white">
                          {selectedMedication === 'amox' ? 'Amoxicilline 1g Comprimés' :
                           selectedMedication === 'morph' ? 'Morphine Sulfate 10mg/ml' : 'Plavix Clopidogrel 75mg'}
                        </p>
                        <p className="text-xs text-gray-400">Emplacement : Rayon Officine A-14 &bull; Péremption : 12/2028</p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-400">Stock Hospitalier</p>
                        <p className="text-2xl font-black text-emerald-400">{stockQuantity} <span className="text-xs font-normal text-gray-300">unités</span></p>
                        <p className="text-[10px] text-cyan-300 font-mono">Scans effectués : {scannedCount}</p>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Medicine Chooser */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-gray-400">Changer de produit à scanner :</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setSelectedMedication('amox')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          selectedMedication === 'amox' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'bg-white/5 text-gray-400'
                        }`}
                      >
                        Amoxicilline 1g
                      </button>
                      <button
                        onClick={() => setSelectedMedication('morph')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          selectedMedication === 'morph' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'bg-white/5 text-gray-400'
                        }`}
                      >
                        Morphine 10mg
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SCENE 3: PGx Interceptor Interactive Alert */}
              {currentChapter.visualType === 'pgx' && (
                <div className="bg-slate-900/95 backdrop-blur-md p-6 rounded-3xl border border-red-500/50 space-y-4 shadow-2xl animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
                        <Dna className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Intercepteur PGx &middot; CYP2C19 *2/*2</p>
                        <p className="text-xs text-red-300 font-mono">Recommandations CPIC &amp; DPWG Niveau 1A</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                      isSubstituted
                        ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400'
                        : 'bg-red-500/30 text-red-200 border-red-500 animate-pulse'
                    }`}>
                      {isSubstituted ? 'SÉCURISÉ - SUBSTITUTION VALIDÉE' : 'ALERTE ROUGE BLOQUANTE'}
                    </span>
                  </div>

                  {!isSubstituted ? (
                    <div className="p-4 bg-red-950/60 rounded-2xl border border-red-500/40 space-y-3">
                      <div className="flex items-center gap-2 text-red-300 text-sm font-bold">
                        <ShieldAlert className="w-5 h-5 text-red-400 animate-bounce" />
                        <span>Prescription de Clopidogrel (Plavix 75mg) Interdite</span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        Le patient est <strong>métaboliseur lent CYP2C19 *2/*2</strong>. Incapacité à bioactiver le Clopidogrel : risque majeur de thrombose de stent et récidive d'infarctus.
                      </p>
                      
                      <div className="pt-2 flex flex-wrap gap-2 items-center justify-between border-t border-red-500/30">
                        <span className="text-xs text-cyan-200">Alternative CPIC recommandée : <strong>Prasugrel 10mg</strong></span>
                        <button
                          onClick={() => {
                            setIsSubstituted(true);
                            speakVoiceOver("Substitution validée avec succès. Le Prasugrel 10mg a été inscrit au dossier.");
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition-all hover:scale-105"
                        >
                          Appliquer Substitution Sécurisée
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-emerald-950/60 rounded-2xl border border-emerald-500/40 space-y-2 animate-in zoom-in-95 duration-200">
                      <div className="flex items-center gap-2 text-emerald-300 text-sm font-bold">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span>Prescription Sécurisée : Prasugrel 10mg / jour</span>
                      </div>
                      <p className="text-xs text-gray-300">
                        Remplacement automatique effectué dans le plan de soins du patient avec traçabilité auditable conforme HDS.
                      </p>
                      <button
                        onClick={() => setIsSubstituted(false)}
                        className="text-xs text-cyan-300 underline pt-1"
                      >
                        Réinitialiser l'intercepteur pour tester à nouveau
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* SCENE 4: Clinical AI & CDS Hooks */}
              {currentChapter.visualType === 'ai' && (
                <div className="bg-slate-900/95 backdrop-blur-md p-6 rounded-3xl border border-cyan-500/40 space-y-4 shadow-2xl animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                        <Brain className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Diagnostic Différentiel IA &middot; CDS Hooks</p>
                        <p className="text-xs text-cyan-300 font-mono">Modèle Hybride Validé Haute Précision</p>
                      </div>
                    </div>
                    <button
                      onClick={triggerAIRecalculation}
                      disabled={isCalculatingAI}
                      className="px-3.5 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isCalculatingAI ? 'animate-spin' : ''}`} />
                      <span>Recalculer IA</span>
                    </button>
                  </div>

                  {/* Probabilities Bars */}
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-950/80 rounded-2xl border border-white/5 space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-white">1. Syndrome Coronarien Aigu (SCA ST+)</span>
                        <span className="text-red-400 font-mono">{aiProbabilitySCA}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${aiProbabilitySCA}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950/80 rounded-2xl border border-white/5 space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-gray-300">2. Dissection Aortique Type A</span>
                        <span className="text-yellow-400 font-mono">24%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-yellow-500 h-full rounded-full transition-all duration-500"
                          style={{ width: '24%' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 text-xs text-cyan-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Recommandation CDS : Dosage Troponine hs-cTnI &amp; Coronarographie</span>
                    </div>
                    <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded text-[10px] font-bold">Priorité 1</span>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Subtitle Caption & CTA Bar */}
        <div className="relative z-10 mt-5 p-4 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 font-bold text-xs rounded-xl border border-cyan-500/40 uppercase tracking-wider shrink-0">
              {currentChapter.badge}
            </span>
            <p className="text-xs sm:text-sm text-gray-200 leading-snug">
              {currentChapter.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
            <button
              onClick={onRequestDemo}
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 rounded-xl text-xs font-extrabold shadow-lg shadow-teal-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>Demander une Démo Complète</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Video Controls & Chapter Navigation Footer */}
      <div className="p-4 sm:p-5 bg-slate-900 border-t border-white/10 space-y-3.5">
        {/* Interactive Timeline Progress Scrubber */}
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            const targetChapterIndex = Math.min(DEMO_CHAPTERS.length - 1, Math.floor(clickPos * DEMO_CHAPTERS.length));
            handleSelectChapter(targetChapterIndex);
          }}
          className="w-full bg-slate-800 h-2 rounded-full overflow-hidden cursor-pointer relative hover:h-2.5 transition-all group"
          title="Cliquez pour naviguer dans la démo"
        >
          <div
            className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 h-full rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${((currentChapterIndex * 100) + chapterProgress) / DEMO_CHAPTERS.length}%` }}
          />
        </div>

        {/* 4 Interactive Chapters Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {DEMO_CHAPTERS.map((chapter, idx) => {
            const isSelected = currentChapterIndex === idx;
            return (
              <button
                key={chapter.id}
                onClick={() => handleSelectChapter(idx)}
                className={`p-3 rounded-2xl text-left transition-all border ${
                  isSelected
                    ? 'bg-gradient-to-br from-cyan-500/20 to-teal-500/10 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-500/15 scale-[1.02]'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-cyan-400 font-bold">0{chapter.id}</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                </div>
                <p className="text-xs font-bold truncate text-white">{chapter.title}</p>
                <p className="text-[10px] text-gray-400 truncate">{chapter.badge}</p>
              </button>
            );
          })}
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between pt-1 text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-extrabold hover:bg-cyan-400 transition-colors flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              <span>{isPlaying ? 'Pause' : 'Lecture'}</span>
            </button>

            <button
              onClick={() => {
                setChapterProgress(0);
                setCurrentChapterIndex(0);
                setIsPlaying(true);
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
              title="Recommencer depuis le début"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono text-gray-400">
              Chapitre {currentChapterIndex + 1} / {DEMO_CHAPTERS.length} &bull; {currentChapter.title}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onGoToLogin}
              className="text-xs text-gray-300 hover:text-cyan-300 font-semibold transition-colors flex items-center gap-1"
            >
              <span>Accéder à l'espace praticien</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Normal in-page layout */}
      {!isFullscreen && containerContent}

      {/* Fullscreen Theater Modal Mode */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/95 backdrop-blur-xl p-4 sm:p-6 flex items-center justify-center animate-in fade-in duration-200">
          {containerContent}
        </div>
      )}
    </>
  );
};

export default HeroVideoDemo;
