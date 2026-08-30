import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Mail, Phone, MapPin, Lock, Save, Camera } from 'lucide-react';

const ProfileSettings: React.FC = () => {
  const { currentUser, setCurrentUser, users, setUsers } = useApp();
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    department: currentUser?.department || '',
    specialization: currentUser?.specialization || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        specialization: formData.specialization
      };
      setCurrentUser(updatedUser);
      setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Administrateur',
      doctor: 'Medecin',
      nurse: 'Infirmier(e)',
      pharmacist: 'Pharmacien',
      lab_tech: 'Technicien de laboratoire',
      surgeon: 'Chirurgien',
      receptionist: 'Agent d\'accueil'
    };
    return labels[role] || role;
  };

  if (!currentUser) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Mon Profil
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Gerez vos informations personnelles
        </p>
      </div>

      <div className="p-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50">
              <Camera className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{currentUser.name}</h3>
            <p className="text-gray-500">{getRoleLabel(currentUser.role)}</p>
            {currentUser.licenseNumber && (
              <p className="text-sm text-gray-400">Licence: {currentUser.licenseNumber}</p>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom complet
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telephone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departement
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {(currentUser.role === 'doctor' || currentUser.role === 'surgeon') && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialisation
              </label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => handleChange('specialization', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Password Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Changer le mot de passe
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="password"
              placeholder="Mot de passe actuel"
              value={formData.currentPassword}
              onChange={(e) => handleChange('currentPassword', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              value={formData.newPassword}
              onChange={(e) => handleChange('newPassword', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex items-center justify-end gap-4">
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

export default ProfileSettings;
