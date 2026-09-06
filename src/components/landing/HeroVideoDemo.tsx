import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, Volume2, VolumeX, RotateCcw, Maximize2,
  Sparkles, Dna, Brain, QrCode, Stethoscope, Activity,
  CheckCircle2, AlertTriangle, ShieldCheck, ChevronRight,
  Layers, ArrowRight
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
    duration: 10,
    subtitle: 'Prise en charge instantanée : constantes vitales en temps réel, score de Glasgow et antécédents médicaux centralisés.',
    voiceText: 'Bienvenue sur SoftCare. Le dossier patient informatisé permet un triage immédiat avec surveillance continue des constantes hémodynamiques et score de sévérité.',
    visualType: 'dpi'
  },
  {
    id: 2,
    title: 'Pharmacie & Traçabilité Code-Barres',
    badge: 'Traçabilité GS1',
    duration: 10,
    subtitle: 'Scan GS1 à la douchette en moins de 5ms : vérification des lots, dates de péremption et sécurisation de la délivrance.',
    voiceText: 'La pharmacie hospitalière intègre un moteur de lecture code-barres haute vitesse pour éliminer tout risque d\'erreur médicamenteuse lors de la délivrance.',
    visualType: 'pharmacy'
  },
  {
    id: 3,
    title: 'Biotechnologies & Intercepteur PGx',
    badge: 'Pharmacogénomique CPIC',
    duration: 12,
    subtitle: 'Interception automatique : détection du variant CYP2C19 *2/*2 et substitution préventive du Clopidogrel.',
    voiceText: 'Le moteur de pharmacogénomique analyse les polymorphismes génétiques du patient pour intercepter les contre-indications médicamenteuses critiques avant administration.',
    visualType: 'pgx'
  },
  {
    id: 4,
    title: 'Diagnostic Différentiel IA & Protocoles',
    badge: 'Intelligence Clinique',
    duration: 12,
    subtitle: 'Hypothèses diagnostiques probabilistes, protocoles CDS Hooks et prescriptions assistées en temps réel.',
    voiceText: 'L\'intelligence clinique suggère les hypothèses diagnostiques probabilistes et guide le praticien vers les examens complémentaires prioritaires.',
    visualType: 'ai'
  }
];

export const HeroVideoDemo: React.FC<HeroVideoDemoProps> = ({ onRequestDemo, onGoToLogin }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [chapterProgress, setChapterProgress] = useState(0); // 0 to 100
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const currentChapter = DEMO_CHAPTERS[currentChapterIndex];

  // Speak function for voice-over
  const speakVoiceOver = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    if (isMuted) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsVoiceSpeaking(true);
    utterance.onend = () => setIsVoiceSpeaking(false);
    utterance.onerror = () => setIsVoiceSpeaking(false);

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Trigger voice-over when chapter changes or when unmuting
  useEffect(() => {
    if (isPlaying && !isMuted) {
      speakVoiceOver(currentChapter.voiceText);
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
      <div className="px-4 sm:px-6 py-3 bg-slate-900/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
          </div>
          <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            LIVE DEMO &middot; SoftCare Hospital OS
          </span>
        </div>

        {/* Voice-over Audio Equalizer indicator */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <span className="text-[11px] font-semibold text-gray-300">Voix off clinique :</span>
            <div className="flex items-center gap-0.5 h-3">
              {[60, 100, 40, 80, 50].map((h, i) => (
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
      <div className="relative aspect-[16/9] min-h-[360px] sm:min-h-[460px] bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 p-4 sm:p-8 flex flex-col justify-between overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Dynamic Scene Visualizer */}
        <div className="relative z-10 w-full flex-1 flex flex-col justify-center">
          {/* SCENE 1: DPI & Triage */}
          {currentChapter.visualType === 'dpi' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center animate-in fade-in duration-300">
              <div className="md:col-span-7 bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-cyan-500/30 space-y-3">
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
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-300 border border-red-500/30 rounded-full text-[10px] font-bold animate-pulse">
                    Niveau 2 - Très Urgent
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-slate-950/60 rounded-xl border border-white/5">
                    <p className="text-[10px] text-gray-400">Fréquence Cardiaque</p>
                    <p className="text-base font-black text-cyan-400">118 <span className="text-[10px] font-normal text-gray-400">bpm</span></p>
                  </div>
                  <div className="p-2 bg-slate-950/60 rounded-xl border border-white/5">
                    <p className="text-[10px] text-gray-400">Tension Artérielle</p>
                    <p className="text-base font-black text-emerald-400">145/92 <span className="text-[10px] font-normal text-gray-400">mmHg</span></p>
                  </div>
                  <div className="p-2 bg-slate-950/60 rounded-xl border border-white/5">
                    <p className="text-[10px] text-gray-400">Saturation SpO2</p>
                    <p className="text-base font-black text-teal-400">96 <span className="text-[10px] font-normal text-gray-400">%</span></p>
                  </div>
                </div>

                <div className="p-2.5 bg-teal-500/10 rounded-xl border border-teal-500/20 text-[11px] text-teal-200 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
                  <span>ECG en cours d'acquisition &middot; Pas d'arythmie ventriculaire détectée</span>
                </div>
              </div>

              <div className="md:col-span-5 space-y-3">
                <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Conformité HDS & Traçabilité</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Dossier partagé en temps réel entre le médecin urgentiste, le cardiologue et l'équipe infirmière.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SCENE 2: Pharmacie & Barcode Scan */}
          {currentChapter.visualType === 'pharmacy' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center animate-in fade-in duration-300">
              <div className="md:col-span-7 bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-teal-500/30 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Scan Médicament &middot; GS1 DataMatrix</p>
                      <p className="text-[10px] text-gray-400 font-mono">Douchette Code-Barres USB / Sans Fil</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-bold">
                    Scan Validé (&lt; 5ms)
                  </span>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-xl border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">Amoxicilline 1g Comprimés</p>
                    <p className="text-[10px] text-gray-400 font-mono">Lot #BX-84920 &middot; Exp : 12/2028</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-emerald-400">Stock : 420 unités</p>
                    <p className="text-[10px] text-gray-400">Emplacement : Rayon B-04</p>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-[11px] text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Délivrance autorisée & déduction instantanée de stock</span>
                </div>
              </div>

              <div className="md:col-span-5 space-y-3">
                <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-300">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>Point de Vente & Tarification Tiers-Payant</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Gestion automatisée des flux de délivrance nominative et facturation directe CPAM / Mutuelles.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SCENE 3: PGx Interceptor */}
          {currentChapter.visualType === 'pgx' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center animate-in fade-in duration-300">
              <div className="md:col-span-7 bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-red-500/40 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
                      <Dna className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Intercepteur PGx &middot; CYP2C19 *2/*2</p>
                      <p className="text-[10px] text-red-300 font-mono">Consortiums CPIC &amp; DPWG</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-red-500/30 text-red-200 border border-red-500/50 rounded-full text-[10px] font-bold animate-pulse">
                    ALERTE ROUGE CRITIQUE
                  </span>
                </div>

                <div className="p-3 bg-red-950/40 rounded-xl border border-red-500/30 space-y-1">
                  <div className="flex items-center gap-2 text-red-300 text-xs font-bold">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span>Prescription de Clopidogrel (Plavix) Interdite</span>
                  </div>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    Patient métaboliseur lent : risque d'échec thérapeutique et thrombose de stent.
                  </p>
                </div>

                <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-[11px] text-cyan-200 flex items-center justify-between">
                  <span>Alternative recommandée : <strong>Prasugrel 10mg</strong> ou <strong>Ticagrélor 90mg</strong></span>
                  <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded font-bold text-[10px]">Auto-remplacement</span>
                </div>
              </div>

              <div className="md:col-span-5 space-y-3">
                <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                    <Dna className="w-4 h-4 text-teal-400" />
                    <span>Médecine de Précision Hospitalière</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Intégration native des profils génomiques aux protocoles de cardiologie et d'oncologie.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SCENE 4: Clinical AI */}
          {currentChapter.visualType === 'ai' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center animate-in fade-in duration-300">
              <div className="md:col-span-7 bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                      <Brain className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Diagnostic Différentiel IA &middot; CDS Hooks</p>
                      <p className="text-[10px] text-cyan-300 font-mono">Modèle Médical Hybride Validé</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full text-[10px] font-bold">
                    Probabilité Calculée
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

                <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-[11px] text-cyan-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Protocole immédiat : Dosage Troponine hs-cTnI &amp; ECG 18 dérivations</span>
                </div>
              </div>

              <div className="md:col-span-5 space-y-3">
                <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Aide à la Décision Médicale</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Le praticien reste toujours le décideur final, soutenu par des alertes basées sur les preuves.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Subtitle Caption Bar */}
        <div className="relative z-10 mt-4 p-3 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
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
                className={`p-2 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-cyan-950/80 border-cyan-500/50 text-white shadow-sm'
                    : 'bg-slate-950/40 border-white/5 text-gray-400 hover:text-gray-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 mb-0.5">
                  <span>0{chapter.id}.</span>
                  {isSelected && isPlaying && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
                </div>
                <p className="text-xs font-bold truncate">{chapter.title}</p>
              </button>
            );
          })}
        </div>

        {/* Playback Controls & CTAs */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause' : 'Lire la démo'}</span>
            </button>

            <button
              onClick={() => handleSelectChapter(0)}
              className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-colors"
              title="Recommencer depuis le début"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onGoToLogin}
              className="text-xs font-bold text-gray-400 hover:text-white transition-colors hidden sm:inline-block"
            >
              Accéder à l'Espace Pro &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroVideoDemo;
