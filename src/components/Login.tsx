import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  User, Lock, ArrowRight, Shield, Heart, Activity, Eye, EyeOff,
  Sparkles, CheckCircle2, AlertCircle, HelpCircle, Mail, Phone,
  Building2, KeyRound, ArrowLeft, RefreshCw, Dna, Stethoscope,
  ChevronRight, X, ShieldCheck, HeartPulse, Pill
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import CustomSelect, { SelectOption } from './common/CustomSelect';

interface LoginProps {
  onBackToLanding?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onBackToLanding }) => {
  const { signIn, departments } = useApp();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Modals
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showContactAdminModal, setShowContactAdminModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [requestForm, setRequestForm] = useState({
    name: '',
    email: '',
    service: departments[0]?.name || 'Cardiologie',
    message: ''
  });

  const departmentOptions: SelectOption[] = departments.length > 0
    ? departments.map(d => ({ value: d.name, label: d.name, badge: d.code, icon: Building2 }))
    : [
        { value: 'Cardiologie', label: 'Cardiologie', badge: 'CARD', icon: HeartPulse },
        { value: 'Chirurgie & Bloc', label: 'Chirurgie & Bloc', badge: 'CHIR', icon: Stethoscope },
        { value: 'Urgences & Triage', label: 'Urgences & Triage', badge: 'URG', icon: Activity },
        { value: 'Pharmacie Hospitalière', label: 'Pharmacie Hospitalière', badge: 'PHARM', icon: Pill },
        { value: 'Laboratoire & Biotech', label: 'Laboratoire & Biotech', badge: 'LAB', icon: Dna },
        { value: 'Maternité & Pédiatrie', label: 'Maternité & Pédiatrie', badge: 'MAT', icon: Heart }
      ];

  const slides = [
    {
      title: "Système d'Information Hospitalier Unifié",
      description: "DPI en temps réel, coordination des soins, admissions et régulation des flux d'urgences.",
      badge: "Hospital OS v2.4",
      icon: Activity
    },
    {
      title: "Biotechnologies & Pharmacogénomique",
      description: "Interception automatique des contre-indications génétiques (CPIC/DPWG) et biobanque cryogénique.",
      badge: "Médecine de Précision",
      icon: Dna
    },
    {
      title: "Traçabilité & Pharmacie Sécurisée",
      description: "Scanner GS1 DataMatrix < 5ms, gestion des lots, chaîne du froid et sécurisation de la délivrance.",
      badge: "Normes Sanitaires HDS",
      icon: ShieldCheck
    }
  ];

  useEffect(() => {
    const savedEmail = localStorage.getItem('softcare_saved_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lockoutSeconds > 0) {
      timer = setInterval(() => {
        setLockoutSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) {
      toast.error('Accès temporairement bloqué', `Veuillez patienter ${lockoutSeconds}s avant de réessayer.`);
      return;
    }

    setError('');
    setLoading(true);

    setLoadingStep('Vérification des accréditations médicales...');
    await new Promise(r => setTimeout(r, 300));

    setLoadingStep('Chargement de l\'espace de travail...');
    await new Promise(r => setTimeout(r, 300));

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= 5) {
        setLockoutSeconds(60);
        setError(`Nombre maximal de tentatives dépassé. Compte temporairement verrouillé pendant 60 secondes.`);
        toast.error('Sécurité renforcée', 'Trop de tentatives infructueuses. Veuillez patienter 60s.');
      } else {
        const remaining = 5 - newAttempts;
        setError(`Identifiant ou mot de passe incorrect. (${remaining} tentative${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''})`);
        toast.error('Échec de connexion', 'Identifiant ou mot de passe incorrect.');
      }
      setLoading(false);
    } else {
      setFailedAttempts(0);
      setLockoutSeconds(0);
      if (rememberMe) {
        localStorage.setItem('softcare_saved_email', email);
      } else {
        localStorage.removeItem('softcare_saved_email');
      }
      toast.success('Connexion réussie', 'Bienvenue sur la plateforme SoftCare.');
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSubmitted(true);
    toast.success('Demande transmise', 'La DSI a reçu votre demande de réinitialisation.');
    setTimeout(() => {
      setShowForgotPasswordModal(false);
      setForgotSubmitted(false);
      setForgotEmail('');
    }, 2000);
  };

  const handleContactAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSubmitted(true);
    toast.success('Demande transmise', `Service demandé : ${requestForm.service}`);
    setTimeout(() => {
      setShowContactAdminModal(false);
      setRequestSubmitted(false);
      setRequestForm({ name: '', email: '', service: departments[0]?.name || 'Cardiologie', message: '' });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/40 to-teal-50/50 flex flex-col lg:flex-row relative overflow-hidden font-sans select-none text-slate-800">
      {/* Radiant Néon Ambient Glow Orbs */}
      <div className="absolute top-0 left-1/6 w-[550px] h-[550px] bg-gradient-to-br from-cyan-400/25 to-teal-400/20 rounded-full blur-[120px] pointer-events-none animate-pulse duration-3000" />
      <div className="absolute bottom-0 right-1/6 w-[550px] h-[550px] bg-gradient-to-tr from-teal-400/20 to-emerald-400/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-300/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Left side - Light Glassmorphic Showcase Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-white/60 backdrop-blur-2xl p-12 flex-col justify-between border-r border-white/80 shadow-2xl shadow-cyan-950/5">
        {/* Top bar with back to landing button */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-600/30 border border-white/40">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-cyan-700 via-teal-700 to-emerald-700 bg-clip-text text-transparent block">
                SoftCare
              </span>
              <span className="text-[10px] text-teal-800/80 font-mono uppercase tracking-widest font-bold">
                Hospital System &middot; v2.4
              </span>
            </div>
          </div>

          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="px-4 py-2 bg-white/80 hover:bg-white border border-teal-100 text-teal-900 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs hover:shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-600" />
              <span>Accueil</span>
            </button>
          )}
        </div>

        {/* Carousel Presentation */}
        <div className="relative z-10 my-auto py-12 max-w-lg space-y-8">
          <div className="space-y-6">
            {slides.map((slide, index) => {
              const Icon = slide.icon;
              const isActive = currentSlide === index;
              return (
                <div
                  key={index}
                  className={`transition-all duration-700 transform ${
                    isActive
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-6 scale-95 absolute inset-0 pointer-events-none'
                  }`}
                >
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-cyan-100/80 border border-cyan-300/60 rounded-full text-xs font-bold text-cyan-900 mb-4 shadow-sm shadow-cyan-500/10">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                    <span>{slide.badge}</span>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/15 via-teal-500/20 to-emerald-500/15 border border-cyan-400/40 flex items-center justify-center shadow-lg shadow-teal-500/10 flex-shrink-0 text-teal-700">
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-extrabold tracking-tight mb-2 text-gray-900">{slide.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{slide.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dots Indicator */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index ? 'w-8 bg-cyan-600 shadow-xs' : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Live Telemetry Bar */}
          <div className="p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-teal-100 shadow-sm flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-gray-700 font-mono font-semibold">Système Hospitalier Actif</span>
            </div>
            <span className="text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60">
              Chiffrement AES-256 &middot; Protocole HDS
            </span>
          </div>
        </div>

        {/* Footer certifications */}
        <div className="relative z-10 border-t border-gray-200/80 pt-6 flex justify-between items-center text-xs text-gray-500">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Hébergement Données de Santé (HDS) &amp; RGPD</span>
          </span>
          <span className="font-mono text-[11px] text-teal-800 font-bold">Édition Clinique 2026</span>
        </div>
      </div>

      {/* Right side - Light Glassmorphic Form Card */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative z-10">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile top header */}
          <div className="lg:hidden flex items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-tr from-cyan-600 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-md">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-gray-900">SoftCare</span>
            </div>
            {onBackToLanding && (
              <button
                onClick={onBackToLanding}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Accueil</span>
              </button>
            )}
          </div>

          {/* Main Card (Light Glassmorphic Glow) */}
          <div className="bg-white/85 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-cyan-950/10 border border-white/80 p-6 sm:p-8 space-y-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-50 text-cyan-800 border border-cyan-200/80 rounded-full text-xs font-bold">
                <Shield className="w-3.5 h-3.5 text-cyan-600" />
                <span>Portail Hospitalier Sécurisé</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Connexion
              </h1>
              <p className="text-xs text-gray-500">
                Accédez à votre espace clinique, DPI et pharmacie hospitalière.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  Email Professionnel
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nom.praticien@hopital.fr"
                    className="w-full pl-10 pr-4 py-3 bg-white/90 border border-gray-200/90 rounded-2xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all placeholder:text-gray-400 shadow-2xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-700">
                    Mot de Passe
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(true)}
                    className="text-xs text-teal-700 hover:text-teal-900 font-bold hover:underline"
                  >
                    Oublié ?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-white/90 border border-gray-200/90 rounded-2xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all font-mono placeholder:text-gray-400 shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-gray-600 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500/20"
                  />
                  <span>Mémoriser mon identifiant</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || lockoutSeconds > 0}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 ${
                  lockoutSeconds > 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-700 hover:to-emerald-700 text-white shadow-teal-600/30 hover:scale-[1.02] active:scale-[0.99] disabled:opacity-50'
                }`}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{loadingStep || 'Connexion en cours...'}</span>
                  </>
                ) : lockoutSeconds > 0 ? (
                  <span>🔒 Déverrouillage dans {lockoutSeconds}s</span>
                ) : (
                  <>
                    <span>Accéder à l'Espace Pro</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500">
                Besoin d'un accès soignant ?{' '}
                <button
                  onClick={() => setShowContactAdminModal(true)}
                  className="text-teal-700 hover:text-teal-900 font-bold hover:underline"
                >
                  Demander une accréditation
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1 : MOT DE PASSE OUBLIÉ */}
      {showForgotPasswordModal && createPortal(
        <div className="fixed inset-0 z-[9999] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-teal-100 max-w-md w-full overflow-hidden flex flex-col text-gray-900">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900">Réinitialisation Sécurisée</h3>
                  <p className="text-xs text-gray-500">Procédure DSI / Sécurité Hospitalière</p>
                </div>
              </div>
              <button
                onClick={() => setShowForgotPasswordModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {forgotSubmitted ? (
                <div className="p-5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs space-y-2 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-bold text-sm text-gray-900">Demande Transmise avec Succès</p>
                  <p>Un administrateur DSI validera la réinitialisation de vos accréditations sous peu.</p>
                </div>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Saisissez votre adresse email professionnelle. Le protocole de réinitialisation sécurisé sera déclenché via la DSI.
                  </p>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Email Professionnel *
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="nom.praticien@hopital.fr"
                      required
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotPasswordModal(false)}
                      className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-2xl text-xs font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md"
                    >
                      Transmettre
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 2 : DEMANDE D'ACCÈS / CONTACT DSI */}
      {showContactAdminModal && createPortal(
        <div className="fixed inset-0 z-[9999] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-teal-100 max-w-md w-full overflow-hidden flex flex-col text-gray-900">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900">Demande d'Accréditation</h3>
                  <p className="text-xs text-gray-500">Attribution d'un rôle hospitalier</p>
                </div>
              </div>
              <button
                onClick={() => setShowContactAdminModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {requestSubmitted ? (
                <div className="p-5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs space-y-2 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-bold text-sm text-gray-900">Demande d'Accès Enregistrée</p>
                  <p>Votre demande pour le service <strong>{requestForm.service}</strong> a été transmise au responsable des accréditations.</p>
                </div>
              ) : (
                <form onSubmit={handleContactAdminSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Nom et Prénom *
                    </label>
                    <input
                      type="text"
                      required
                      value={requestForm.name}
                      onChange={(e) => setRequestForm({ ...requestForm, name: e.target.value })}
                      placeholder="Dr. Thomas Bernard"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Email Professionnel *
                    </label>
                    <input
                      type="email"
                      required
                      value={requestForm.email}
                      onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
                      placeholder="t.bernard@hopital.fr"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Service Hospitalier
                    </label>
                    <CustomSelect
                      options={departmentOptions}
                      value={requestForm.service}
                      onChange={(val) => setRequestForm({ ...requestForm, service: val })}
                      placeholder="Sélectionner le service..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Justification / Rôle souhaité
                    </label>
                    <textarea
                      rows={2}
                      value={requestForm.message}
                      onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                      placeholder="Praticien remplaçant, interne de garde..."
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none resize-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowContactAdminModal(false)}
                      className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-2xl text-xs font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md"
                    >
                      Envoyer la Demande
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Login;
