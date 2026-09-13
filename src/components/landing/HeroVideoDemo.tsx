import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, Volume2, VolumeX, RotateCcw, Maximize2, Minimize2,
  Sparkles, Dna, Brain, QrCode, Stethoscope, Activity,
  CheckCircle2, AlertTriangle, ShieldCheck, ChevronRight,
  Layers, ArrowRight, UserCheck, Video, Radio, Mic, MicOff,
  Eye, LayoutDashboard, Zap, RefreshCw, X, MessageSquare,
  ShieldAlert, Scan, Plus, Minus, Film, Settings, Upload,
  Sliders, FastForward, HeartPulse, Pill, Bot, HelpCircle
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
    subtitle: 'Prise en charge instantanée : constantes vitales en temps réel, score de gravité et antécédents médicaux centralisés.',
    voiceText: "Bienvenue dans SoftCare. Dès l'admission du patient, les constantes vitales sont acquises en temps réel avec calcul automatique du score de gravité pour un triage médical sans délai. Vous pouvez tester l'ajustement des constantes directement sur le simulateur.",
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
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
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

  // Live Q&A State
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
    utterance.rate = 1.02 * playbackSpeed;
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
  }, [currentChapterIndex, isMuted, isPlaying, playbackSpeed]);

  // Main timer progression loop
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 100; // updates every 100ms
    const stepIncrement = (intervalTime / (currentChapter.duration * 1000)) * 100 * playbackSpeed;

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
  }, [isPlaying, currentChapterIndex, currentChapter.duration, playbackSpeed]);

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
    }, 500);
  };

  // Trigger Interactive AI Recalculation
  const triggerAIRecalculation = () => {
    setIsCalculatingAI(true);
    setTimeout(() => {
      setIsCalculatingAI(false);
      setAiProbabilitySCA(prev => prev === 92 ? 97 : 92);
    }, 700);
  };

  const handleAskDoctor = (question: string, answer: string) => {
    setActiveQAAnswer(answer);
    speakVoiceOver(answer);
  };

  const containerContent = (
    <div className={`relative w-full rounded-3xl overflow-hidden border border-cyan-500/40 shadow-2xl bg-slate-950 text-white select-none transition-all duration-300 ${
      isFullscreen ? 'max-w-7xl mx-auto h-[94vh] flex flex-col justify-between' : 'max-w-6xl mx-auto'
    }`}>
      
      {/* Top Header / HUD Bar */}
      <div className="px-4 sm:px-6 py-3.5 bg-slate-900/95 backdrop-blur-md border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block animate-pulse" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-full">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>STUDIO INTERACTIF &bull; VOIX OFF CLINIQUE</span>
            </span>
            <span className="hidden sm:inline text-xs text-gray-400">
              Simulation hospitalière en direct
            </span>
          </div>
        </div>

        {/* Audio & Speed Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Voice Over Audio Toggle */}
          <button
            onClick={toggleMute}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all text-xs font-semibold ${
              isMuted
                ? 'bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
            }`}
            title={isMuted ? 'Activer la voix off' : 'Couper la voix off'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
            <span>{isMuted ? 'Voix coupée' : 'Voix active'}</span>
          </button>

          {/* Speed Selector */}
          <button
            onClick={() => setPlaybackSpeed(s => s === 1.0 ? 1.25 : s === 1.25 ? 1.5 : 1.0)}
            className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-mono font-bold text-cyan-300 border border-white/10 transition-colors"
            title="Vitesse de lecture"
          >
            {playbackSpeed}x
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

      {/* Main Viewport Display Canvas */}
      <div className={`relative bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 p-4 sm:p-8 flex flex-col justify-between overflow-hidden ${
        isFullscreen ? 'flex-1 overflow-y-auto' : 'min-h-[480px] sm:min-h-[520px]'
      }`}>
        {/* Ambient Medical Glow Orbs */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Dynamic Display Grid */}
        <div className="relative z-10 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* LEFT: Context Summary & Voice Ticker (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-cyan-500/30 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  <span>{currentChapter.badge}</span>
                </span>
                <span className="text-xs font-mono text-gray-400 font-bold">
                  Chapitre {currentChapterIndex + 1}/4
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2">
                  {currentChapter.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {currentChapter.subtitle}
                </p>
              </div>

              {/* Subtitle Audio Voice Ticker */}
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-cyan-500/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                    <Mic className={`w-3.5 h-3.5 ${isVoiceSpeaking ? 'animate-bounce text-emerald-400' : 'text-cyan-400'}`} />
                    <span>Narration Vocale</span>
                  </span>
                  <button
                    onClick={() => speakVoiceOver(currentChapter.voiceText)}
                    className="text-[11px] text-cyan-300 hover:text-white font-semibold flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Réécouter</span>
                  </button>
                </div>
                <p className="text-xs text-cyan-100 italic leading-relaxed">
                  "{currentChapter.voiceText}"
                </p>
              </div>
            </div>

            {/* Quick Interactive Clinical Chips */}
            <div className="p-4 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 space-y-2">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>Points Clés du Système Hospitalier :</span>
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleAskDoctor(
                    "Sécurité HDS",
                    "Toutes les données de santé traitées par SoftCare sont chiffrées de bout en bout et hébergées conformément aux normes HDS et RGPD Santé."
                  )}
                  className="px-2.5 py-1 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/40 rounded-xl text-[11px] text-gray-300 hover:text-cyan-200 transition-all text-left"
                >
                  🔒 Sécurité HDS & RGPD
                </button>
                <button
                  onClick={() => handleAskDoctor(
                    "Douchette GS1",
                    "Le moteur de lecture GS1 DataMatrix valide les boîtes de médicaments en moins de 5 millisecondes avec traçabilité unitaire des lots."
                  )}
                  className="px-2.5 py-1 bg-white/5 hover:bg-teal-500/20 border border-white/10 hover:border-teal-400/40 rounded-xl text-[11px] text-gray-300 hover:text-teal-200 transition-all text-left"
                >
                  ⚡ Douchette GS1 &lt;5ms
                </button>
                <button
                  onClick={() => handleAskDoctor(
                    "PGx Génomique",
                    "L'intercepteur pharmacogénomique croise les directives internationales CPIC pour stopper net toute prescription inadaptée au profil génétique."
                  )}
                  className="px-2.5 py-1 bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-400/40 rounded-xl text-[11px] text-gray-300 hover:text-purple-200 transition-all text-left"
                >
                  🧬 Blocage PGx CPIC
                </button>
              </div>

              {activeQAAnswer && (
                <div className="mt-2 p-3 bg-cyan-950/70 border border-cyan-500/40 rounded-xl text-xs text-cyan-100 animate-in fade-in">
                  <p className="font-semibold text-cyan-300 mb-0.5">Réponse système :</p>
                  <p className="italic">{activeQAAnswer}</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Live Interactive Clinical Simulator Console (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl border-2 border-cyan-400/40 shadow-2xl p-5 sm:p-6 space-y-5">
              
              {/* Simulator Screen Top HUD Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Console Clinique Temps Réel
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="px-2 py-0.5 bg-white/10 rounded-md font-mono text-[10px]">
                    INTERACTIF
                  </span>
                  <span className="text-cyan-400 font-bold">● LIVE</span>
                </div>
              </div>

              {/* CHAPTER 1 : DPI & TRIAGE URGENCE */}
              {currentChapter.visualType === 'dpi' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-cyan-500/30 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-400">PATIENT ADMIS :</p>
                      <p className="text-sm font-bold text-white">Jean-Paul V. (64 ans) &bull; Lit Urgences 04</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Triage Niveau {triageLevel} (Urgence Majeure)
                    </span>
                  </div>

                  {/* Interactive Telemetry Sliders */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 bg-slate-950/90 rounded-2xl border border-cyan-500/30 text-center space-y-1">
                      <p className="text-[11px] font-bold text-cyan-400">Fréquence Cardiaque</p>
                      <p className="text-2xl font-black font-mono text-emerald-400">{patientHR} <span className="text-xs font-normal">bpm</span></p>
                      <input
                        type="range"
                        min="60"
                        max="160"
                        value={patientHR}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setPatientHR(val);
                          if (val > 130) setTriageLevel(1);
                          else if (val > 100) setTriageLevel(2);
                          else setTriageLevel(3);
                        }}
                        className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      />
                    </div>

                    <div className="p-3.5 bg-slate-950/90 rounded-2xl border border-teal-500/30 text-center space-y-1">
                      <p className="text-[11px] font-bold text-teal-400">Tension Artérielle</p>
                      <p className="text-2xl font-black font-mono text-teal-300">{patientBP} <span className="text-xs font-normal">mmHg</span></p>
                      <div className="flex justify-center gap-1 pt-1">
                        <button
                          onClick={() => { setPatientBP('120/80'); setPatientHR(76); setTriageLevel(3); }}
                          className="px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded text-[10px] text-gray-300 font-semibold"
                        >
                          Normale
                        </button>
                        <button
                          onClick={() => { setPatientBP('165/105'); setPatientHR(138); setTriageLevel(1); }}
                          className="px-2 py-0.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 rounded text-[10px] text-rose-300 font-bold"
                        >
                          Crise HTA
                        </button>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-950/90 rounded-2xl border border-emerald-500/30 text-center space-y-1">
                      <p className="text-[11px] font-bold text-emerald-400">Saturation O2</p>
                      <p className="text-2xl font-black font-mono text-cyan-300">{patientSpO2}%</p>
                      <input
                        type="range"
                        min="85"
                        max="100"
                        value={patientSpO2}
                        onChange={(e) => setPatientSpO2(Number(e.target.value))}
                        className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Glasgow & Shock index */}
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-white/10 flex items-center justify-between text-xs text-gray-300">
                    <span>Score de Glasgow : <strong className="text-white">15/15 (Conscience normale)</strong></span>
                    <span>Index de Choc : <strong className={patientHR > 120 ? 'text-rose-400' : 'text-emerald-400'}>{(patientHR / 120).toFixed(2)}</strong></span>
                  </div>
                </div>
              )}

              {/* CHAPTER 2 : PHARMACIE & GS1 SCANNER */}
              {currentChapter.visualType === 'pharmacy' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 bg-slate-950/90 rounded-2xl border border-teal-500/30 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400 font-bold">MÉDICAMENT SÉLECTIONNÉ</span>
                        <span className="px-2 py-0.5 bg-teal-500/20 text-teal-300 rounded-md font-mono text-[10px]">GS1-128</span>
                      </div>
                      <p className="text-base font-bold text-white">Amoxicilline 500mg Gélules</p>
                      <p className="text-xs text-gray-400">Lot : <strong className="text-cyan-300 font-mono">LOT-2026-AMX42</strong> &bull; Exp : 11/2028</p>
                    </div>

                    <div className="p-4 bg-slate-950/90 rounded-2xl border border-cyan-500/30 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400 font-bold">STOCK EN PHARMACIE</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                      <p className="text-3xl font-black font-mono text-cyan-400 my-1">{stockQuantity} <span className="text-xs font-normal text-gray-400">boîtes</span></p>
                      <p className="text-[11px] text-gray-400">Unités délivrées ce jour : <strong className="text-white">{scannedCount}</strong></p>
                    </div>
                  </div>

                  {/* Interactive Laser Scan Trigger Button */}
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-cyan-400/40 text-center space-y-3">
                    <button
                      onClick={triggerLaserScan}
                      disabled={isLaserScanning}
                      className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 ${
                        isLaserScanning
                          ? 'bg-red-600 text-white animate-pulse'
                          : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 shadow-teal-500/25'
                      }`}
                    >
                      <Scan className="w-5 h-5" />
                      <span>{isLaserScanning ? 'SCAN LASER EN COURS (< 5ms)...' : 'DÉCLENCHER LE SCAN GS1 À LA DOUCHETTE'}</span>
                    </button>
                    <p className="text-[11px] text-gray-400">
                      Cliquez pour simuler le passage d'une boîte sous le faisceau laser de la douchette.
                    </p>
                  </div>
                </div>
              )}

              {/* CHAPTER 3 : BIOTECHNOLOGIES & INTERCEPTEUR PGx */}
              {currentChapter.visualType === 'pgx' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 bg-slate-950/90 rounded-2xl border border-purple-500/40 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-purple-300 font-bold flex items-center gap-1.5">
                        <Dna className="w-4 h-4 text-purple-400" />
                        <span>PROFIL GÉNOMIQUE PATIENT (CPIC)</span>
                      </span>
                      <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-full font-mono text-[10px] font-bold">
                        Variant CYP2C19 *2/*2
                      </span>
                    </div>
                    <p className="text-xs text-gray-300">
                      Statut métabolique : <strong className="text-rose-400">Métaboliseur Lent (Poor Metabolizer)</strong>. Incapacité hépatique à activer le Clopidogrel (Plavix).
                    </p>
                  </div>

                  {/* Red Alert / Interception Notice */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    isSubstituted
                      ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-100'
                      : 'bg-rose-950/70 border-rose-500/70 text-rose-100'
                  }`}>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={`w-6 h-6 flex-shrink-0 mt-0.5 ${isSubstituted ? 'text-emerald-400' : 'text-rose-400 animate-bounce'}`} />
                      <div className="flex-1 text-xs space-y-1">
                        <p className="font-bold text-sm">
                          {isSubstituted
                            ? '✅ Substitution Thérapeutique Sécurisée Appliquée'
                            : '🛑 ALERTE BLOQUANTE PHARMACOGÉNOMIQUE (PGx)'}
                        </p>
                        <p className="leading-relaxed">
                          {isSubstituted
                            ? 'Prescription actualisée vers Prasugrel 10mg. Efficacité antiagrégante optimale garantie.'
                            : 'Tentative de prescription de Clopidogrel 75mg interrompue. Risque majeur de thrombose de stent.'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/10 flex justify-end gap-2">
                      {!isSubstituted ? (
                        <button
                          onClick={() => {
                            setIsSubstituted(true);
                            speakVoiceOver("Substitution sécurisée appliquée avec succès vers le Prasugrel dix milligrammes.");
                          }}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Appliquer Substitution Sécurisée (Prasugrel 10mg)</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsSubstituted(false)}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-gray-300 font-semibold rounded-xl text-xs transition-colors"
                        >
                          Réinitialiser l'alerte
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* CHAPTER 4 : INTELLIGENCE CLINIQUE & CDS */}
              {currentChapter.visualType === 'ai' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 bg-slate-950/90 rounded-2xl border border-cyan-500/30 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                        <Brain className="w-4 h-4 text-cyan-400" />
                        <span>MOTEUR PROBABILISTE CDS HOOKS</span>
                      </span>
                      <button
                        onClick={triggerAIRecalculation}
                        disabled={isCalculatingAI}
                        className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <RefreshCw className={`w-3 h-3 ${isCalculatingAI ? 'animate-spin' : ''}`} />
                        <span>Recalculer IA</span>
                      </button>
                    </div>

                    {/* Probabilities Bars */}
                    <div className="space-y-2.5 pt-1">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-white">Syndrome Coronarien Aigu (SCA)</span>
                          <span className="text-rose-400 font-mono">{aiProbabilitySCA}% (Critique)</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-rose-500 to-red-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${aiProbabilitySCA}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-gray-300">Dissection Aortique</span>
                          <span className="text-amber-400 font-mono">28% (Modérée)</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: '28%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-gray-300">Embolie Pulmonaire</span>
                          <span className="text-cyan-400 font-mono">24% (Basse)</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div className="bg-cyan-500 h-full rounded-full" style={{ width: '24%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-cyan-950/60 rounded-xl border border-cyan-500/30 text-xs text-cyan-200">
                    ⚡ <strong>Recommandation CDS :</strong> ECG 18 dérivations immédiat, Troponine hs-cTnI à H0 et H+1, admission cardiologie interventionnelle.
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Bottom Timeline & Controls */}
        <div className="relative z-10 pt-6 mt-4 border-t border-white/10 space-y-3">
          {/* Progress Bar */}
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-400 to-teal-400 h-full transition-all duration-100 ease-linear"
              style={{ width: `${chapterProgress}%` }}
            />
          </div>

          {/* Chapter Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
    </div>
  );

  return (
    <>
      {!isFullscreen && containerContent}

      {isFullscreen && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/95 backdrop-blur-xl p-4 sm:p-6 flex items-center justify-center animate-in fade-in duration-200">
          {containerContent}
        </div>
      )}
    </>
  );
};

export default HeroVideoDemo;
