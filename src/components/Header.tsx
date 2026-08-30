import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Search, Settings, User, LogOut, ChevronDown, CheckCircle, AlertTriangle, AlertCircle, Info, Brain, Sparkles } from 'lucide-react';
import { MedicalAiAssistantModal } from './ai/MedicalAiAssistantModal';

const Header: React.FC = () => {
  const { currentUser, setCurrentUser, signOut, notifications, markNotificationRead, unreadCount, setCurrentView } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'critical': return <AlertCircle className="w-5 h-5 text-rose-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Administrateur',
      doctor: 'Medecin',
      nurse: 'Infirmier(e)',
      pharmacist: 'Pharmacien',
      lab_tech: 'Technicien labo',
      surgeon: 'Chirurgien',
      receptionist: 'Accueil'
    };
    return labels[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-gradient-to-r from-rose-500 to-red-500',
      doctor: 'bg-gradient-to-r from-cyan-500 to-teal-500',
      nurse: 'bg-gradient-to-r from-pink-500 to-rose-500',
      pharmacist: 'bg-gradient-to-r from-amber-500 to-orange-500',
      lab_tech: 'bg-gradient-to-r from-violet-500 to-purple-500',
      surgeon: 'bg-gradient-to-r from-emerald-500 to-green-500',
      receptionist: 'bg-gradient-to-r from-slate-500 to-gray-500'
    };
    return colors[role] || 'bg-gradient-to-r from-gray-500 to-slate-500';
  };

  if (!currentUser) return null;

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-700">
              {new Date().toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              })}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-cyan-50 to-indigo-50 border border-cyan-200/80 rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-cyan-900">
              .NET 9 + PostgreSQL Core
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 w-72 transition-all text-sm"
            />
          </div>

          {/* IA Clinical Assistant Button */}
          <button
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 transition-all hover:scale-105"
            title="Assistant Clinique & Aide au Diagnostic IA"
          >
            <Brain className="w-4 h-4 text-purple-200" />
            <span className="hidden sm:inline">Assistant IA (CDS)</span>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 bg-gradient-to-r from-rose-500 to-red-500 text-white text-xs rounded-full flex items-center justify-center px-1 font-medium shadow-lg shadow-rose-500/30">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 max-h-[480px] overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <span className="text-xs text-cyan-600 cursor-pointer hover:underline font-medium">
                    Tout marquer comme lu
                  </span>
                </div>
                <div className="overflow-y-auto max-h-80">
                  {!notifications || notifications.length === 0 ? (
                    <div className="py-10 text-center text-gray-500">
                      <Bell className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                      <p>Aucune notification</p>
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`px-5 py-4 flex items-start gap-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors ${!notif.read ? 'bg-cyan-50/50' : ''}`}
                      >
                        {getNotificationIcon(notif.type)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900">{notif.title}</p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notif.createdAt).toLocaleString('fr-FR')}
                          </p>
                        </div>
                        {!notif.read && (
                          <div className="w-2 h-2 bg-cyan-500 rounded-full mt-1.5"></div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <div className={`w-9 h-9 rounded-xl ${getRoleColor(currentUser.role)} flex items-center justify-center text-white font-semibold text-sm shadow-lg`}>
                {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                <p className="text-xs text-gray-500">{getRoleLabel(currentUser.role)}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                <div className={`px-5 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white`}>
                  <p className="font-semibold">{currentUser.name}</p>
                  <p className="text-sm text-white/80">{currentUser.email}</p>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => {
                      setCurrentView('settings');
                      setShowProfile(false);
                    }}
                    className="w-full flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">Mon profil</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('settings');
                      setShowProfile(false);
                    }}
                    className="w-full flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">Parametres</span>
                  </button>
                </div>
                <div className="border-t border-gray-100 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-5 py-3 text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Deconnexion</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <MedicalAiAssistantModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
      />
    </header>
  );
};

export default Header;
