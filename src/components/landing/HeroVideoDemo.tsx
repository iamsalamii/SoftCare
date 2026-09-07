import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, Volume2, VolumeX, RotateCcw, Maximize2,
  Sparkles, Dna, Brain, QrCode, Stethoscope, Activity,
  CheckCircle2, AlertTriangle, ShieldCheck, ChevronRight,
  Layers, ArrowRight, UserCheck, Video, Radio, Mic, MicOff,
  Eye, LayoutDashboard
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
    duration: 11,
    subtitle: 'Prise en charge instantanée : constantes vitales en temps réel, score de Glasgow et antécédents médicaux centralisés.',
    voiceText: "Bonjour, je suis le Docteur Éléonore Vance. Voici le dossier patient informatisé SoftCare. Dès l'admission, les constantes vitales sont acquises en temps réel avec calcul automatique du score de gravité pour un triage sans délai.",
    visualType: 'dpi'
  },
  {
    id: 2,
    title: 'Pharmacie & Traçabilité GS1',
    badge: 'Traçabilité GS1 (<5ms)',
    duration: 11,
    subtitle: 'Scan GS1 à la douchette en moins de 5ms : vérification des lots, dates de péremption et sécurisation de la délivrance.',
    voiceText: "Dans le module de pharmacie hospitalière, la douchette code-barres identifie chaque boîte de médicament en moins de cinq millisecondes, vérifie le numéro de lot, la péremption et déduit automatiquement le stock de l'officine.",
    visualType: 'pharmacy'
  },
  {
    id: 3,
    title: 'Biotechnologies & Intercepteur PGx',
    badge: 'Pharmacogénomique CPIC',
    duration: 13,
    subtitle: 'Interception automatique : détection du variant CYP2C19 *2/*2 et substitution préventive du Clopidogrel.',
    voiceText: "SoftCare intègre une innovation majeure : l'intercepteur pharmacogénomique. En croisant le génotype CYP2C19 du patient, le système bloque immédiatement toute prescription toxique de Clopidogrel et suggère l'alternative adaptée.",
    visualType: 'pgx'
  },
  {
    id: 4,
    title: 'Diagnostic Différentiel IA & Protocoles',
    badge: 'Intelligence Clinique CDS',
    duration: 12,
    subtitle: 'Hypothèses diagnostiques probabilistes, protocoles CDS Hooks et prescriptions assistées en temps réel.',
    voiceText: "Enfin, notre moteur d'intelligence clinique analyse les symptômes et antécédents pour calculer les probabilités diagnostiques différentielles et vous proposer le protocole CDS Hooks le plus pertinent.",
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
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const currentChapter = DEMO_CHAPTERS[currentChapterIndex];

  // Pick female voice if available
  const getFemaleVoice = (): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    const frenchVoices = voices.filter(v => v.lang.startsWith('fr'));
    
    // Look for female voice name indicators
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
    utterance.pitch = 1.08; // slightly higher pitch for warm female physician voice

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
      // Short delay for natural transition
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
          // Advance to next chapter
          setCurrentChapterIndex(oldIndex => (oldIndex + 1) % DEMO_CHAPTERS.length);
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isPlaying, currentChapterIndex, currentChapter.duration]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleSelectChapter = (index: number) => {
    setCurrentChapterIndex(index);
    setChapterProgress(0);
    setIsPlaying(true);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden border border-cyan-500/30 shadow-2xl bg-slate-950 text-white select-none">
      {/* Top Video Header / HUD Bar */}
      <div className="px-4 sm:px-6 py-3 bg-slate-900/95 backdrop-blur-md border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
          </div>
          <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            DÉMO GÉNÉRATIVE LIVE &middot; Dr. Éléonore Vance
          </span>
        </div>

        {/* View Mode & Audio Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* View Mode Toggle */}
          <div className="hidden md:flex items-center bg-slate-950/80 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded-lg transition-all font-semibold ${
                viewMode === 'split' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-gray-400 hover:text-white'
              }`}
            >
              Vue Mixte
            </button>
            <button
              onClick={() => setViewMode('presenter')}
              className={`px-2.5 py-1 rounded-lg transition-all font-semibold ${
                viewMode === 'presenter' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-gray-400 hover:text-white'
              }`}
            >
              Présentatrice
            </button>
            <button
              onClick={() => setViewMode('interface')}
              className={`px-2.5 py-1 rounded-lg transition-all font-semibold ${
                viewMode === 'interface' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-gray-400 hover:text-white'
              }`}
            >
              Logiciel
            </button>
          </div>

          {/* Voice-over Audio Equalizer indicator */}
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <span className="text-[11px] font-semibold text-gray-300 hidden sm:inline">Voix off IA :</span>
            <div className="flex items-center gap-0.5 h-3">
              {[70, 100, 45, 90, 60].map((h, i) => (
                <span
                  key={i}
                  className={`w-0.5 bg-cyan-400 rounded-full transition-all duration-150 ${
                    isPlaying && !isMuted ? 'animate-pulse' : 'opacity-30'
                  }`}
                  style={{ height: isPlaying && !isMuted ? `${h}%` : '20%' }}
                />
              ))}
            </div>
          </div>

          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-cyan-300 transition-colors"
            title={isMuted ? 'Activer la voix off' : 'Couper la voix off'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Main Video Viewport Display */}
      <div className="relative min-h-[420px] sm:min-h-[500px] bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 p-4 sm:p-6 flex flex-col justify-between overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Dynamic Display Layout */}
        <div className="relative z-10 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          
          {/* LEFT: Generative Video Presenter (Doctor) */}
          {(viewMode === 'split' || viewMode === 'presenter') && (
            <div className={`${viewMode === 'presenter' ? 'lg:col-span-12' : 'lg:col-span-5'} flex flex-col items-center justify-center`}>
              <div className="relative w-full max-w-sm aspect-[4/3] rounded-3xl overflow-hidden border-2 border-cyan-400/40 shadow-2xl bg-slate-900 group">
                <img
                  src="/demo-doctor.jpg"
                  alt="Dr. Éléonore Vance - Présentatrice Démo Médicale"
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    isPlaying ? 'scale-105 filter brightness-105' : 'scale-100 filter brightness-95'
                  }`}
                />
                
                {/* Live Presenter Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/30 pointer-events-none" />
                
                {/* Top Live Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md rounded-full border border-red-500/40">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="text-[10px] font-bold text-red-300 uppercase tracking-wider">Direct</span>
                </div>

                {/* Voice Equalizer overlay */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md rounded-full border border-cyan-500/40">
                  <Mic className="w-3 h-3 text-cyan-400" />
                  <span className="text-[10px] font-mono text-cyan-300 font-bold">
                    {isVoiceSpeaking ? 'Audio Actif' : 'Prête'}
                  </span>
                </div>

                {/* Bottom Presenter Credentials */}
                <div className="absolute bottom-3 left-3 right-3 p-2.5 bg-slate-950/85 backdrop-blur-md rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Dr. Éléonore Vance</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      </p>
                      <p className="text-[10px] text-cyan-300 font-medium">Directrice Médicale &bull; SoftCare</p>
                    </div>
                    <span className="px-2 py-0.5 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-[9px] font-bold text-cyan-200">
                      IA Clinique
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* RIGHT: High-Tech Software Interface Simulation */}
          {(viewMode === 'split' || viewMode === 'interface') && (
            <div className={`${viewMode === 'interface' ? 'lg:col-span-12' : 'lg:col-span-7'} space-y-3`}>
              
              {/* SCENE 1: DPI & Triage */}
              {currentChapter.visualType === 'dpi' && (
                <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-cyan-500/30 space-y-3 shadow-xl animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                        <Stethoscope className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Jean-Marc DUPONT &middot; 58 ans</p>
                        <p className="text-[10px] text-gray-400 font-mono">IPP : PAT-2026-08492 &middot; Lit Urgences #04</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 bg-red-500/20 text-red-300 border border-red-500/30 rounded-full text-[10px] font-bold animate-pulse">
                      Triage Niveau 2 (Sévère)
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 bg-slate-950/70 rounded-xl border border-white/5">
                      <p className="text-[10px] text-gray-400">Pouls Hémodynamique</p>
                      <p className="text-base font-black text-cyan-400">118 <span className="text-[10px] font-normal text-gray-400">bpm</span></p>
                    </div>
                    <div className="p-2.5 bg-slate-950/70 rounded-xl border border-white/5">
                      <p className="text-[10px] text-gray-400">Tension Artérielle</p>
                      <p className="text-base font-black text-emerald-400">145/92 <span className="text-[10px] font-normal text-gray-400">mmHg</span></p>
                    </div>
                    <div className="p-2.5 bg-slate-950/70 rounded-xl border border-white/5">
                      <p className="text-[10px] text-gray-400">Saturation SpO2</p>
                      <p className="text-base font-black text-teal-400">96 <span className="text-[10px] font-normal text-gray-400">%</span></p>
                    </div>
                  </div>

                  <div className="p-3 bg-teal-500/10 rounded-xl border border-teal-500/20 text-[11px] text-teal-200 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
                    <span>Surveillance continue active &middot; Transmission en direct au cardiologue</span>
                  </div>
                </div>
              )}

              {/* SCENE 2: Pharmacie & Barcode Scan */}
              {currentChapter.visualType === 'pharmacy' && (
                <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-teal-500/30 space-y-3 shadow-xl animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                        <QrCode className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Scan GS1 DataMatrix &middot; Vitesse &lt; 5ms</p>
                        <p className="text-[10px] text-gray-400 font-mono">Douchette Code-Barres Haute Fréquence</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-bold">
                      Scan Validé
                    </span>
                  </div>

                  <div className="p-3 bg-slate-950/80 rounded-xl border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">Amoxicilline 1g Comprimés</p>
                      <p className="text-[10px] text-gray-400 font-mono">Lot #BX-84920 &middot; Exp : 12/2028</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-400">Stock : 420 unités</p>
                      <p className="text-[10px] text-gray-400">Rayon B-04 &middot; Valide</p>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-[11px] text-emerald-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Délivrance sécurisée & Déduction instantanée de stock automatisée</span>
                  </div>
                </div>
              )}

              {/* SCENE 3: PGx Interceptor */}
              {currentChapter.visualType === 'pgx' && (
                <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-red-500/40 space-y-3 shadow-xl animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
                        <Dna className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Intercepteur PGx &middot; Variant CYP2C19 *2/*2</p>
                        <p className="text-[10px] text-red-300 font-mono">Directives CPIC &amp; DPWG Hospitalières</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 bg-red-500/30 text-red-200 border border-red-500/50 rounded-full text-[10px] font-bold animate-pulse">
                      ALERTE ROUGE
                    </span>
                  </div>

                  <div className="p-3 bg-red-950/50 rounded-xl border border-red-500/30 space-y-1">
                    <div className="flex items-center gap-2 text-red-300 text-xs font-bold">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span>Blocage Prescription : Clopidogrel 75mg</span>
                    </div>
                    <p className="text-[11px] text-gray-300 leading-relaxed">
                      Patient métaboliseur lent : risque d'inefficacité thérapeutique majeure et récidive d'infarctus.
                    </p>
                  </div>

                  <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-[11px] text-cyan-200 flex items-center justify-between">
                    <span>Alternative validée : <strong>Prasugrel 10mg</strong></span>
                    <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded font-bold text-[10px]">Substitution</span>
                  </div>
                </div>
              )}

              {/* SCENE 4: Clinical AI */}
              {currentChapter.visualType === 'ai' && (
                <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-cyan-500/30 space-y-3 shadow-xl animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                        <Brain className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Diagnostic Différentiel IA &middot; CDS Hooks</p>
                        <p className="text-[10px] text-cyan-300 font-mono">Modèle Clinique Hybride Prédictif</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full text-[10px] font-bold">
                      Probabilité
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-200 font-semibold">Syndrome Coronarien Aigu (SCA)</span>
                        <span className="text-red-400 font-bold">92%</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full rounded-full transition-all duration-500" style={{ width: '92%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-300 font-semibold">Dissection Aortique</span>
                        <span className="text-yellow-400 font-bold">28%</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                        <div className="bg-yellow-500 h-full rounded-full transition-all duration-500" style={{ width: '28%' }} />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-[11px] text-cyan-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Protocole suggéré : Dosage Troponine hs-cTnI &amp; Coronarographie</span>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Subtitle Caption Bar */}
        <div className="relative z-10 mt-4 p-3.5 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-cyan-500/20 text-cyan-300 font-bold text-[10px] rounded-lg border border-cyan-500/30 uppercase tracking-wider shrink-0">
              {currentChapter.badge}
            </span>
            <p className="text-xs sm:text-sm text-gray-200 leading-snug">
              {currentChapter.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onRequestDemo}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/30 transition-all hover:scale-105 flex items-center gap-1.5"
            >
              <span>Demander cette démo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Video Controls & Chapter Navigation Footer */}
      <div className="p-4 bg-slate-900 border-t border-white/10 space-y-3">
        {/* Timeline Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden cursor-pointer relative">
          <div
            className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 h-full rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${chapterProgress}%` }}
          />
        </div>

        {/* Chapters selection buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DEMO_CHAPTERS.map((chapter, idx) => {
            const isSelected = currentChapterIndex === idx;
            return (
              <button
                key={chapter.id}
                onClick={() => handleSelectChapter(idx)}
                className={`p-2.5 rounded-xl text-left transition-all border ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/10'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">0{chapter.id}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
                </div>
                <p className="text-xs font-bold truncate text-white">{chapter.title}</p>
                <p className="text-[10px] text-gray-400 truncate">{chapter.badge}</p>
              </button>
            );
          })}
        </div>

        {/* Main Controls Row */}
        <div className="flex items-center justify-between pt-1 text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-2 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors flex items-center gap-1 shadow-md shadow-cyan-500/20"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              <span className="text-xs">{isPlaying ? 'Pause' : 'Lecture'}</span>
            </button>

            <button
              onClick={() => {
                setChapterProgress(0);
                setCurrentChapterIndex(0);
                setIsPlaying(true);
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
              title="Recommencer la démo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono text-gray-400">
              Chapitre {currentChapterIndex + 1} / {DEMO_CHAPTERS.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onGoToLogin}
              className="text-xs text-gray-300 hover:text-cyan-300 font-semibold transition-colors flex items-center gap-1"
            >
              <span>Accéder à l'espace praticien</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroVideoDemo;
