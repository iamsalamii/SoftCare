import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Mail, Smartphone, Clock, AlertTriangle, CheckCircle, Save } from 'lucide-react';

const NotificationSettings: React.FC = () => {
  const { currentUser } = useApp();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    appointmentReminders: true,
    labResultAlerts: true,
    emergencyAlerts: true,
    lowStockAlerts: true,
    billingNotifications: true,
    reminderTime: '30',
    digest: 'daily'
  });
  const [saved, setSaved] = useState(false);

  const handleToggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
    setSaved(false);
  };

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
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
          <Bell className="w-5 h-5 text-blue-600" />
          Preferences de notification
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Choisissez comment vous souhaitez etre notifie
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* General Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Canaux de notification</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Notifications par email</p>
                  <p className="text-sm text-gray-500">Recevoir les alertes par email</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Notifications push</p>
                  <p className="text-sm text-gray-500">Recevoir les alertes dans l'application</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={() => handleToggle('pushNotifications')}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Alert Types */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Types d'alertes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900">Rappels de rendez-vous</p>
                  <p className="text-sm text-gray-500">Avant chaque rendez-vous</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.appointmentReminders}
                onChange={() => handleToggle('appointmentReminders')}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">Resultats de laboratoire</p>
                  <p className="text-sm text-gray-500">Quand les resultats sont prets</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.labResultAlerts}
                onChange={() => handleToggle('labResultAlerts')}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <div>
                  <p className="font-medium text-gray-900">Alertes d'urgence</p>
                  <p className="text-sm text-gray-500">Cas d'urgence critiques</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.emergencyAlerts}
                onChange={() => handleToggle('emergencyAlerts')}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium text-gray-900">Stock faible</p>
                  <p className="text-sm text-gray-500">Quand le stock est bas</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.lowStockAlerts}
                onChange={() => handleToggle('lowStockAlerts')}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="font-medium text-gray-900">Notifications de facturation</p>
                  <p className="text-sm text-gray-500">Factures et paiements</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.billingNotifications}
                onChange={() => handleToggle('billingNotifications')}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Timing Settings */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rappel avant rendez-vous (minutes)
              </label>
              <select
                value={settings.reminderTime}
                onChange={(e) => handleChange('reminderTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 heure</option>
                <option value="120">2 heures</option>
                <option value="1440">1 jour</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume des notifications
              </label>
              <select
                value={settings.digest}
                onChange={(e) => handleChange('digest', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="realtime">Temps reel</option>
                <option value="hourly">Toutes les heures</option>
                <option value="daily">Quotidien</option>
                <option value="weekly">Hebdomadaire</option>
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

export default NotificationSettings;
