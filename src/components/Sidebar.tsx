import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home, Users, FileText, Pill, Calendar, UserCog, BarChart3,
  LogOut, FlaskConical, Heart, AlertTriangle, Dna,
  Scissors, Clock, CreditCard, BedDouble, Settings, ShoppingCart, ChevronLeft, ChevronRight,
  Video, ShieldCheck
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, currentUser, signOut, sidebarCollapsed, setSidebarCollapsed } = useApp();

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home, roles: ['admin', 'doctor', 'nurse', 'pharmacist', 'receptionist', 'lab_tech', 'surgeon'] },
    { id: 'patients', label: 'Patients', icon: Users, roles: ['admin', 'doctor', 'nurse', 'receptionist'] },
    { id: 'medical-records', label: 'Dossiers médicaux', icon: FileText, roles: ['admin', 'doctor', 'nurse'] },
    { id: 'appointments', label: 'Rendez-vous', icon: Calendar, roles: ['admin', 'doctor', 'nurse', 'receptionist'] },
    { id: 'teleconsultation', label: 'Téléconsultation', icon: Video, roles: ['admin', 'doctor', 'nurse'] },
    { id: 'admissions', label: 'Admissions & Lits', icon: BedDouble, roles: ['admin', 'doctor', 'nurse', 'receptionist'] },
    { id: 'pharmacy', label: 'Pharmacie (Stock)', icon: Pill, roles: ['admin', 'pharmacist', 'doctor'] },
    { id: 'pharmacy-pos', label: 'Pharmacie (Vente)', icon: ShoppingCart, roles: ['admin', 'pharmacist'] },
    { id: 'lab', label: 'Laboratoire', icon: FlaskConical, roles: ['admin', 'doctor', 'lab_tech', 'nurse'] },
    { id: 'biotech', label: 'Biotech & PGx', icon: Dna, roles: ['admin', 'doctor', 'lab_tech', 'pharmacist'] },
    { id: 'nursing', label: 'Soins infirmiers', icon: Heart, roles: ['admin', 'nurse', 'doctor'] },
    { id: 'emergencies', label: 'Urgences', icon: AlertTriangle, roles: ['admin', 'doctor', 'nurse', 'receptionist'] },
    { id: 'surgery', label: 'Bloc opératoire', icon: Scissors, roles: ['admin', 'surgeon', 'doctor', 'nurse'] },
    { id: 'billing', label: 'Facturation', icon: CreditCard, roles: ['admin', 'receptionist'] },
    { id: 'schedule', label: 'Planning', icon: Clock, roles: ['admin', 'doctor', 'nurse', 'pharmacist', 'lab_tech', 'surgeon', 'receptionist'] },
    { id: 'audit', label: 'Audit Trail & RGPD', icon: ShieldCheck, roles: ['admin', 'doctor'] },
    { id: 'users', label: 'Utilisateurs', icon: UserCog, roles: ['admin'] },
    { id: 'reports', label: 'Rapports', icon: BarChart3, roles: ['admin', 'doctor'] },
    { id: 'settings', label: 'Paramètres', icon: Settings, roles: ['admin'] },
  ];

  const filteredMenuItems = menuItems.filter(item =>
    item.roles.includes(currentUser?.role || '')
  );

  const handleLogout = () => {
    signOut();
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

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {!sidebarCollapsed && (
        <div
          onClick={() => setSidebarCollapsed(true)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      <aside
        className={`bg-white border-r border-gray-200 flex flex-col h-screen transition-all duration-300 shadow-sm z-50 fixed lg:static inset-y-0 left-0 ${
          sidebarCollapsed
            ? '-translate-x-full lg:translate-x-0 lg:w-20'
            : 'translate-x-0 w-72 lg:w-64'
        }`}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 lg:w-11 lg:h-11 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30 flex-shrink-0">
              <svg viewBox="0 0 40 40" className="w-6 h-6 lg:w-7 lg:h-7 text-white">
                <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <path d="M20 8 L20 32 M8 20 L32 20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
            {(!sidebarCollapsed || window.innerWidth < 1024) && (
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                  SoftCare
                </h1>
                <p className="text-[11px] text-gray-500">Gestion hospitalière</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            title={sidebarCollapsed ? 'Déplier le menu' : 'Replier le menu'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto modal-scroll">
          <ul className="space-y-1.5">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setCurrentView(item.id);
                      if (window.innerWidth < 1024) {
                        setSidebarCollapsed(true);
                      }
                    }}
                    className={`w-full flex items-center ${
                      sidebarCollapsed ? 'lg:justify-center gap-3' : 'gap-3'
                    } px-3.5 py-2.5 rounded-xl text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-teal-500/25 font-bold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
                    }`}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    {(!sidebarCollapsed || window.innerWidth < 1024) && (
                      <span className="text-xs truncate">{item.label}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-100">
          <div className={`flex items-center ${sidebarCollapsed ? 'lg:justify-center gap-3' : 'gap-3'} mb-3`}>
            <div
              className={`w-9 h-9 rounded-xl ${getRoleColor(
                currentUser?.role || ''
              )} flex items-center justify-center text-white shadow-md flex-shrink-0`}
            >
              <span className="text-xs font-bold">
                {currentUser?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2) || 'U'}
              </span>
            </div>
            {(!sidebarCollapsed || window.innerWidth < 1024) && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">{currentUser?.name}</p>
                <span className="text-[10px] text-gray-500 block truncate">
                  {getRoleLabel(currentUser?.role || '')}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${
              sidebarCollapsed ? 'lg:justify-center gap-2.5' : 'gap-2.5'
            } px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-xs font-semibold`}
            title="Déconnexion"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {(!sidebarCollapsed || window.innerWidth < 1024) && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
