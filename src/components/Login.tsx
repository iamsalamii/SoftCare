import React, { useState, useEffect } from 'react';
import {
  User, Lock, ArrowRight, Shield, Heart, Activity, Eye, EyeOff,
  Sparkles, CheckCircle2, AlertCircle, HelpCircle, Mail, Phone,
  Building2, KeyRound, ArrowLeft, RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';

interface LoginProps {
  onBackToLanding?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onBackToLanding }) => {
  const { signIn } = useApp();
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
  const [requestForm, setRequestForm] = useState({ name: '', email: '', service: 'Cardiologie', message: '' });

  const slides = [
    {
      title: "Gestion Hospitalière Unifiée",
      description: "Optimisez vos workflows cliniques et le parcours de soins en un seul endroit.",
      icon: Activity,
      gradient: "from-cyan-500 to-teal-500"
    },
    {
      title: "Dossier Médical & PGx",
      description: "Sécurisez les prescriptions grâce à l'intercepteur pharmacogénomique en direct.",
      icon: Shield,
      gradient: "from-teal-500 to-emerald-500"
    },
    {
      title: "Traçabilité Pharmaceutique",
      description: "Scan douchette GS1, génération de codes-barres 128 et étiquetage 2D instantané.",
      icon: Heart,
      gradient: "from-cyan-600 to-teal-700"
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Realistic hospital authentication sequence
    setLoadingStep('Vérification des accréditations médicales...');
    await new Promise(r => setTimeout(r, 400));

    setLoadingStep('Chargement du profil de service...');
    await new Promise(r => setTimeout(r, 400));

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError);
      toast.error('Échec de connexion', signInError || 'Identifiants incorrects.');
      setLoading(false);
    } else {
      if (rememberMe) {
        localStorage.setItem('softcare_saved_email', email);
      } else {
        localStorage.removeItem('softcare_saved_email');
      }
      toast.success('Connexion réussie', 'Bienvenue sur la plateforme SoftCare.');
    }
  };

  const handleFillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSubmitted(true);
    toast.info('Demande envoyée', 'Un lien sécurisé a été transmis au support de garde.');
    setTimeout(() => {
      setShowForgotPasswordModal(false);
      setForgotSubmitted(false);
      setForgotEmail('');
    }, 2000);
  };

  const handleContactAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSubmitted(true);
    toast.success('Demande enregistrée', 'Votre responsable de service validera vos accès sous 24h.');
    setTimeout(() => {
      setShowContactAdminModal(false);
      setRequestSubmitted(false);
      setRequestForm({ name: '', email: '', service: 'Cardiologie', message: '' });
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      {/* Left side - Branding & Carousel (Desktop & Tablet) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-700 relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Animated ambient glow */}
        <div className="absolute top-10 left-10 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight">SoftCare</span>
              <span className="block text-xs text-cyan-100/80 font-medium">Système d'Information Hospitalier</span>
            </div>
          </div>

          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-xs font-semibold transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Accueil</span>
            </button>
          )}
        </div>

        {/* Center Carousel */}
        <div className="relative z-10 my-auto py-8">
          <div className="relative h-44 mb-6">
            {slides.map((slide, index) => {
              const Icon = slide.icon;
              return (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 ${
                    currentSlide === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{slide.title}</h3>
                      <p className="text-cyan-100 text-base leading-relaxed max-w-md">{slide.description}</p>
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
                  currentSlide === index ? 'w-8 bg-white' : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Hospital Certifications */}
        <div className="relative z-10 border-t border-white/15 pt-6 flex justify-between items-center text-xs text-cyan-100/70">
          <span>Conforme Normes Sanitaires & HDS</span>
          <span>© 2026 SoftCare Hospital System</span>
        </div>
      </div>

      {/* Right side - Login Form (Fully Responsive) */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
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

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Espace Professionnel</h1>
              <p className="text-xs text-gray-500 mt-1">
                Authentification sécurisée pour le personnel médical et soignant.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Identifiant / Email Professionnel
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white transition-all"
                    placeholder="prenom.nom@hopital.fr"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white transition-all"
                    placeholder="••••••••"
                    required
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
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-gray-600">Se souvenir de moi</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(true)}
                  className="text-teal-700 hover:text-teal-800 font-semibold hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-teal-600/25 transition-all hover:scale-[1.01] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{loadingStep || 'Connexion...'}</span>
                  </>
                ) : (
                  <>
                    <span>Se Connecter</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500">
                Pas encore de compte ?{' '}
                <button
                  onClick={() => setShowContactAdminModal(true)}
                  className="text-teal-700 hover:text-teal-800 font-bold hover:underline"
                >
                  Contactez l'administrateur
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1 : MOT DE PASSE OUBLIÉ */}
      {/* ========================================================= */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-gray-900">Réinitialisation Sécurisée</h3>
                <p className="text-xs text-gray-500">Procédure interne de sécurité hospitalière</p>
              </div>
            </div>

            {forgotSubmitted ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs space-y-2 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold">Demande transmise avec succès</p>
                <p>Un administrateur de garde validera la réinitialisation de votre compte.</p>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
                <p className="text-xs text-gray-600">
                  Saisissez votre adresse email professionnelle. Un protocole de réinitialisation sera déclenché via la DSI.
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="nom@etablissement.fr"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(false)}
                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl text-xs font-bold shadow-md hover:from-cyan-700 hover:to-teal-700"
                  >
                    Envoyer Demande
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2 : CONTACTER L'ADMINISTRATEUR */}
      {/* ========================================================= */}
      {showContactAdminModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-gray-900">Demande d'Accès Hospitalier</h3>
                <p className="text-xs text-gray-500">Service Informatique & DSI</p>
              </div>
            </div>

            {requestSubmitted ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs space-y-2 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold">Demande d'inscription enregistrée</p>
                <p>Vos accès seront activés dès validation par votre chef de service.</p>
              </div>
            ) : (
              <form onSubmit={handleContactAdminSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">Nom Complet</label>
                  <input
                    type="text"
                    required
                    value={requestForm.name}
                    onChange={(e) => setRequestForm({ ...requestForm, name: e.target.value })}
                    placeholder="Dr. Jean Dupont"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">Email Professionnel</label>
                  <input
                    type="email"
                    required
                    value={requestForm.email}
                    onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
                    placeholder="jean.dupont@hopital.fr"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">Service Médical</label>
                  <select
                    value={requestForm.service}
                    onChange={(e) => setRequestForm({ ...requestForm, service: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  >
                    <option value="Cardiologie">Cardiologie</option>
                    <option value="Chirurgie">Chirurgie & Bloc</option>
                    <option value="Urgences">Urgences & Triage</option>
                    <option value="Pharmacie">Pharmacie Hospitalière</option>
                    <option value="Biotech">Laboratoire & Biotech</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowContactAdminModal(false)}
                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl text-xs font-bold shadow-md hover:from-cyan-700 hover:to-teal-700"
                  >
                    Soumettre
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
