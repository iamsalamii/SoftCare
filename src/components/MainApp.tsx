import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Login from './Login';
import Dashboard from './Dashboard';
import SettingsModule from './settings/SettingsModule';
import LandingPage from './landing/LandingPage';

const MainApp: React.FC = () => {
  const { currentUser, currentView, setCurrentView, dataLoading, dataError, authLoading } = useApp();
  const [showLogin, setShowLogin] = useState(false);

  const handleBackToHome = () => {
    setCurrentView('dashboard');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm font-medium">Vérification de la session médicale...</p>
        </div>
      </div>
    );
  }

  // Not logged in: Show Landing Page or Login screen
  if (!currentUser) {
    if (!showLogin) {
      return <LandingPage onGoToLogin={() => setShowLogin(true)} />;
    }
    return <Login onBackToLanding={() => setShowLogin(false)} />;
  }

  if (currentView === 'settings') {
    return <SettingsModule onBack={handleBackToHome} />;
  }

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm font-medium">Chargement des dossiers patients...</p>
        </div>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-rose-600 font-medium mb-2">Erreur de chargement</p>
          <p className="text-gray-500 text-sm">{dataError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl hover:from-cyan-700 hover:to-teal-700 transition-colors shadow-md"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return <Dashboard />;
};

export default MainApp;
