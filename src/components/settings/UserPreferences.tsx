import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Palette, Globe, Moon, Sun, Save, Monitor } from 'lucide-react';

const UserPreferences: React.FC = () => {
  const { currentUser } = useApp();
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'fr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    startPage: 'dashboard',
    itemsPerPage: '10'
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (key: string, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Palette className="w-5 h-5 text-blue-600" />
          Preferences
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Personnalisez votre experience utilisateur
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Theme Selection */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            {preferences.theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            Theme
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => handleChange('theme', 'light')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                preferences.theme === 'light'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Sun className={`w-8 h-8 mx-auto mb-2 ${preferences.theme === 'light' ? 'text-blue-600' : 'text-gray-400'}`} />
              <p className="text-sm font-medium text-gray-900">Clair</p>
            </button>

            <button
              onClick={() => handleChange('theme', 'dark')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                preferences.theme === 'dark'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Moon className={`w-8 h-8 mx-auto mb-2 ${preferences.theme === 'dark' ? 'text-blue-600' : 'text-gray-400'}`} />
              <p className="text-sm font-medium text-gray-900">Sombre</p>
            </button>

            <button
              onClick={() => handleChange('theme', 'system')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                preferences.theme === 'system'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Monitor className={`w-8 h-8 mx-auto mb-2 ${preferences.theme === 'system' ? 'text-blue-600' : 'text-gray-400'}`} />
              <p className="text-sm font-medium text-gray-900">Systeme</p>
            </button>
          </div>
        </div>

        {/* Language & Regional */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Langue et region
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Langue</label>
              <select
                value={preferences.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="fr">Francais</option>
                <option value="en">English</option>
                <option value="es">Espanol</option>
                <option value="ar">العربية</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Format de date</label>
              <select
                value={preferences.dateFormat}
                onChange={(e) => handleChange('dateFormat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Format horaire</label>
              <select
                value={preferences.timeFormat}
                onChange={(e) => handleChange('timeFormat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="24h">24 heures</option>
                <option value="12h">12 heures (AM/PM)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Affichage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Page d'accueil</label>
              <select
                value={preferences.startPage}
                onChange={(e) => handleChange('startPage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="dashboard">Tableau de bord</option>
                <option value="patients">Patients</option>
                <option value="appointments">Rendez-vous</option>
                <option value="medical-records">Dossiers medicaux</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Elements par page</label>
              <select
                value={preferences.itemsPerPage}
                onChange={(e) => handleChange('itemsPerPage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
          {saved && (
            <span className="text-green-600 text-sm font-medium">Modifications enregistrees!</span>
          )}
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPreferences;
