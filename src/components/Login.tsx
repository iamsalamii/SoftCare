import React, { useState, useEffect } from 'react';
import { User, Lock, ArrowRight, Shield, Heart, Activity, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useApp();

  const slides = [
    {
      title: "Gestion Intelligente",
      description: "Optimisez vos workflows hospitaliers avec une plateforme tout-en-un",
      icon: Activity,
      gradient: "from-cyan-500 to-teal-500"
    },
    {
      title: "Dossiers Patients",
      description: "Acces securise et instantane aux dossiers medicaux electroniques",
      icon: Shield,
      gradient: "from-teal-500 to-emerald-500"
    },
    {
      title: "Soins Personnalises",
      description: "Suivi des traitements et plans de soins adaptes a chaque patient",
      icon: Heart,
      gradient: "from-emerald-500 to-green-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError(signInError);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-700 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-emerald-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          {/* Logo */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-8 h-8 text-white">
                  <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <path d="M20 10 L20 30 M10 20 L30 20" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-3xl font-bold tracking-tight">SoftCare</span>
            </div>
            <p className="text-white/80 text-lg max-w-md">
              Plateforme de gestion hospitaliere nouvelle generation
            </p>
          </div>

          {/* Carousel */}
          <div className="relative h-48 mb-8">
            {slides.map((slide, index) => {
              const Icon = slide.icon;
              return (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 ${
                    currentSlide === index
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 translate-x-8'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${slide.gradient} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold mb-2">{slide.title}</h3>
                      <p className="text-white/70 text-lg">{slide.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dots indicator */}
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

          {/* Features list */}
          <div className="mt-12 grid grid-cols-2 gap-4">
            {[
              'Dossiers patients securises',
              'Gestion des rendez-vous',
              'Facturation integree',
              'Tableaux de bord analytiques'
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-white/80">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom branding */}
        <div className="absolute bottom-6 left-16 text-white/60 text-sm">
          2024 SoftCare. Tous droits reserves.
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 40 40" className="w-8 h-8 text-white">
                  <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <path d="M20 10 L20 30 M10 20 L30 20" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-3xl font-bold text-gray-900">SoftCare</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Bienvenue</h1>
              <p className="text-gray-500">Connectez-vous a votre espace</p>
            </div>

            {error && (
              <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mb-5 px-4 py-3 bg-cyan-50 border border-cyan-200 rounded-xl text-sm text-cyan-800">
              <p className="font-medium mb-1">Comptes de demonstration:</p>
              <p>admin@hopital.fr / demo123 (Admin)</p>
              <p>marie.dubois@hopital.fr / demo123 (Medecin)</p>
              <p>sophie.martin@hopital.fr / demo123 (Infirmier)</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 focus:bg-white transition-all"
                    placeholder="nom@etablissement.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 focus:bg-white transition-all"
                    placeholder="Entrez votre mot de passe"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
                  <span className="text-sm text-gray-600">Se souvenir de moi</span>
                </label>
                <button type="button" className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">
                  Mot de passe oublie?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    <span>Connexion en cours...</span>
                  </>
                ) : (
                  <>
                    <span>Se connecter</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Pas encore de compte?{' '}
                <button className="text-cyan-600 hover:text-cyan-700 font-medium">
                  Contactez l'administrateur
                </button>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-400">
            <p>Version 2.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
