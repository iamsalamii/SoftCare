import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  User, Lock, ArrowRight, Shield, Heart, Activity, Eye, EyeOff,
  Sparkles, CheckCircle2, AlertCircle, HelpCircle, Mail, Phone,
  Building2, KeyRound, ArrowLeft, RefreshCw, Dna, Stethoscope,
  ChevronRight, X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import CustomSelect from './common/CustomSelect';

interface LoginProps {
  onBackToLanding?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onBackToLanding }) => {
  const { signIn, departments, dropdownOptions } = useApp();
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

  // Dynamic department options from hospital settings / database
  const departmentOptions = departments.length > 0
    ? departments.map(d => ({ value: d.name, label: d.name, badge: d.code }))
    : [
        { value: 'Cardiologie', label: 'Cardiologie', badge: 'CARD' },
        { value: 'Chirurgie & Bloc', label: 'Chirurgie & Bloc', badge: 'CHIR' },
        { value: 'Urgences & Triage', label: 'Urgences & Triage', badge: 'URG' },
        { value: 'Pharmacie Hospitalière', label: 'Pharmacie Hospitalière', badge: 'PHARM' },
        { value: 'Laboratoire & Biotech', label: 'Laboratoire & Biotech', badge: 'LAB' },
        { value: 'Maternité & Pédiatrie', label: 'Maternité & Pédiatrie', badge: 'MAT' },
        { value: 'Radiologie & Imagerie', label: 'Radiologie & Imagerie', badge: 'RAD' }
      ];

  const slides = [
    {
      title: "Gestion Hospitalière Unifiée",
      description: "DPI, Triage des urgences et coordination des équipes soignantes en temps réel.",
      badge: "Hospital OS v2.4",
      icon: Activity
    },
    {
      title: "Biotechnologies & PGx",
      description: "Sécurisation pharmacogénomique en direct (CPIC/DPWG) et biobanque cryogénique.",
      badge: "Médecine de Précision",
      icon: Dna
    },
    {
      title: "Traçabilité Pharmaceutique",
      description: "Scanner GS1, codes-barres 128 / 2D QR vectoriels et délivrance robotisée.",
      badge: "Normes Sanitaires HDS",
      icon: Shield
    }
  ];

  useEffect(() => {
    // Restore saved email if remember me was active
    const savedEmail = localStorage.getItem('softcare_saved_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
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

    // Hospital authentication progression
    setLoadingStep('Vérification des accréditations médicales...');
    await new Promise(r => setTimeout(r, 350));

    setLoadingStep('Chargement du profil de service...');
    await new Promise(r => setTimeout(r, 350));

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
    }, 2500);
  };

  const handleContactAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSubmitted(true);
    toast.success('Demande d\'inscription transmise', `Service demandé : ${requestForm.service}`);
    setTimeout(() => {
      setShowContactAdminModal(false);
      setRequestSubmitted(false);
      setRequestForm({ name: '', email: '', service: departments[0]?.name || 'Cardiologie', message: '' });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row relative overflow-hidden font-sans select-none">
      {/* Haikei / Organic Ambient Background Accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Left side - Medical Brand Presentation (Modern Organic Glassmorphism) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-cyan-600 via-teal-700 to-teal-900 p-12 flex-col justify-between text-white overflow-hidden shadow-2xl">
        {/* Haikei Style Fluid Wave Overlay */}
        <svg
          className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none"
          viewBox="0 0 800 800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 0 300 C 150 200 350 400 500 250 C 650 100 750 350 800 300 L 800 800 L 0 800 Z"
            fill="#ffffff"
          />
        </svg>

        {/* Top bar with back to landing button */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg">
              <Activity className="w-7 h-7" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white block">SoftCare</span>
              <span className="text-[10px] text-cyan-200 font-bold uppercase tracking-widest">
                Système Hospitalier & Biotech
              </span>
            </div>
          </div>

          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Accueil</span>
            </button>
          )}
        </div>

        {/* Carousel Slides (Motion Primitives feel) */}
        <div className="relative z-10 my-auto py-8">
          <div className="space-y-6 max-w-lg">
            {slides.map((slide, index) => {
              const Icon = slide.icon;
              const isActive = currentSlide === index;
              return (
                <div
                  key={index}
                  className={`transition-all duration-500 transform ${
                    isActive
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-4 scale-95 absolute inset-0 pointer-events-none'
                  }`}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold text-cyan-100 mb-4 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                    <span>{slide.badge}</span>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl flex-shrink-0">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-extrabold tracking-tight mb-2 text-white">{slide.title}</h3>
                      <p className="text-cyan-100/90 text-sm leading-relaxed">{slide.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dots Indicator */}
          <div className="flex gap-2 pt-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Hospital Certifications */}
        <div className="relative z-10 border-t border-white/15 pt-6 flex justify-between items-center text-xs text-cyan-100/75">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Conforme Normes Sanitaires & HDS
          </span>
          <span className="font-mono text-[11px]">Édition Clinique 2026</span>
        </div>
      </div>

      {/* Right side - Clean Medical Login Form (Responsive) */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative z-10">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile top bar */}
          <div className="lg:hidden flex items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-md">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-gray-900">SoftCare</span>
            </div>
            {onBackToLanding && (
              <button
                onClick={onBackToLanding}
                className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Accueil</span>
              </button>
            )}
          </div>

          {/* Login Card (Watermelon UI soft style) */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-cyan-50 text-cyan-800 border border-cyan-200 rounded-full text-[10px] font-bold mb-2">
                <Shield className="w-3 h-3 text-cyan-600" />
                <span>Portail Hospitalier Sécurisé</span>
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Espace Professionnel</h1>
              <p className="text-xs text-gray-500 mt-1">
                Authentification certifiée pour les praticiens, pharmaciens et soignants.
              </p>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Identifiant / Email Professionnel <span className="text-rose-500">*</span>
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
                    placeholder="identifiant.pro@etablissement.sante.fr"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Mot de Passe <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-mono"
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
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-gray-300"
                  />
                  <span>Se souvenir de moi</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(true)}
                  className="text-teal-700 hover:text-teal-900 font-bold hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || lockoutSeconds > 0}
                className={`w-full py-3.5 rounded-2xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
                  lockoutSeconds > 0
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-cyan-600 via-teal-600 to-teal-700 hover:from-cyan-700 hover:to-teal-800 text-white shadow-teal-600/25 hover:scale-[1.01] disabled:opacity-50'
                }`}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{loadingStep || 'Connexion...'}</span>
                  </>
                ) : lockoutSeconds > 0 ? (
                  <span>🔒 Réessayer dans {lockoutSeconds}s</span>
                ) : (
                  <>
                    <span>Se Connecter</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500">
                Pas encore de compte ?{' '}
                <button
                  onClick={() => setShowContactAdminModal(true)}
                  className="text-teal-700 hover:text-teal-900 font-bold hover:underline"
                >
                  Contactez l'administrateur / DSI
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1 : MOT DE PASSE OUBLIÉ (PORTALISÉ & SCROLL CONTAINED) */}
      {/* ========================================================= */}
      {showForgotPasswordModal && createPortal(
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-cyan-100 max-w-md w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900">Réinitialisation Sécurisée</h3>
                  <p className="text-xs text-gray-500">Procédure interne de sécurité hospitalière</p>
                </div>
              </div>
              <button
                onClick={() => setShowForgotPasswordModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 modal-scroll">
              {forgotSubmitted ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs space-y-2 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-bold">Demande transmise avec succès</p>
                  <p>Un administrateur de garde validera la réinitialisation de votre compte.</p>
                </div>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Saisissez votre adresse email professionnelle. Un protocole de réinitialisation sécurisé sera déclenché via la DSI de l'établissement.
                  </p>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Email Professionnel <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="praticien@etablissement.sante.fr"
                      required
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotPasswordModal(false)}
                      className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl text-xs font-bold shadow-md hover:from-cyan-700 hover:to-teal-700 transition-all"
                    >
                      Envoyer Demande
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================= */}
      {/* MODAL 2 : CONTACTER L'ADMINISTRATEUR (SERVICES DYNAMIQUES & CUSTOM SELECT) */}
      {/* ========================================================= */}
      {showContactAdminModal && createPortal(
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-cyan-100 max-w-lg w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900">Demande d'Accès Hospitalier</h3>
                  <p className="text-xs text-gray-500">Service Informatique & DSI</p>
                </div>
              </div>
              <button
                onClick={() => setShowContactAdminModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 modal-scroll space-y-4">
              {requestSubmitted ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs space-y-2 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-bold">Demande d'inscription enregistrée</p>
                  <p>Vos accès seront activés dès validation par votre chef de service ou la DSI.</p>
                </div>
              ) : (
                <form onSubmit={handleContactAdminSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Nom Complet & Titre <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={requestForm.name}
                      onChange={(e) => setRequestForm({ ...requestForm, name: e.target.value })}
                      placeholder="Dr. Jean Dupont (Praticien Hospitalier)"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Email Professionnel <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={requestForm.email}
                      onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
                      placeholder="jean.dupont@hopital.com"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Service Médical d'Affectation <span className="text-rose-500">*</span>
                    </label>
                    <CustomSelect
                      options={departmentOptions}
                      value={requestForm.service}
                      onChange={(val) => setRequestForm({ ...requestForm, service: val })}
                      searchable={true}
                      allowCustom={true}
                      placeholder="Sélectionner ou saisir un service..."
                    />
                    <p className="text-[10px] text-gray-400 mt-1">
                      Liste dynamique des départements de l'établissement (recherche ou saisie libre).
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Observations / Rôle Souhaité
                    </label>
                    <textarea
                      rows={2}
                      value={requestForm.message}
                      onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                      placeholder="Médecin remplaçant en Cardiologie..."
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowContactAdminModal(false)}
                      className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl text-xs font-bold shadow-md hover:from-cyan-700 hover:to-teal-700 transition-all"
                    >
                      Soumettre Demande
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
