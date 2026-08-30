import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings as SettingsIcon, Building2, Palette, List, Users, FileText, Download, Printer, ChevronRight, Save, Plus, Trash2, CreditCard as Edit2, Home, ArrowLeft } from 'lucide-react';
import OrganizationSettingsForm from './OrganizationSettingsForm';
import DropdownManager from './DropdownManager';
import ProfileSettings from './ProfileSettings';
import NotificationSettings from './NotificationSettings';
import UserPreferences from './UserPreferences';

type SettingsTab = 'organization' | 'dropdowns' | 'profile' | 'notifications' | 'preferences';

interface SettingsModuleProps {
  onBack?: () => void;
}

const SettingsModule: React.FC<SettingsModuleProps> = ({ onBack }) => {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<SettingsTab>('organization');

  const tabs = [
    { id: 'organization' as const, label: 'Organisation', icon: Building2, description: 'Informations et logo' },
    { id: 'dropdowns' as const, label: 'Listes & Outils', icon: List, description: 'Gerer les options des menus deroulants' },
    { id: 'profile' as const, label: 'Mon Profil', icon: Users, description: 'Informations personnelles' },
    { id: 'notifications' as const, label: 'Notifications', icon: FileText, description: 'Preferences de notification' },
    { id: 'preferences' as const, label: 'Preferences', icon: Palette, description: 'Theme et langue' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'organization':
        return <OrganizationSettingsForm />;
      case 'dropdowns':
        return <DropdownManager />;
      case 'profile':
        return <ProfileSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'preferences':
        return <UserPreferences />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Retour</span>
              </button>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Parametres</h1>
              <p className="mt-2 text-gray-600">Configurez votre application selon vos besoins</p>
            </div>
            <button
              onClick={onBack}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Accueil</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-4 px-4 py-4 text-left transition-colors border-l-4 ${
                      isActive
                        ? 'bg-blue-50 border-blue-600 text-blue-700'
                        : 'border-transparent hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{tab.label}</p>
                      <p className="text-xs text-gray-500 truncate">{tab.description}</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModule;
