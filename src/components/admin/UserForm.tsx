import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { X, Save, Shield, Loader2, Eye, EyeOff, KeyRound } from 'lucide-react';

interface UserFormProps {
  userId?: string | null;
  onClose: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ userId, onClose }) => {
  const { users, addUser, updateUser, addNotification } = useApp();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [resettingPwd, setResettingPwd] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'nurse' as 'admin' | 'doctor' | 'nurse' | 'pharmacist' | 'receptionist' | 'lab_tech' | 'surgeon',
    department: '',
    phone: '',
    status: 'active' as 'active' | 'inactive',
    password: ''
  });

  const availablePermissions = {
    admin: [
      'manage_users',
      'system_admin',
      'view_all_data',
      'manage_permissions',
      'view_reports',
      'manage_departments'
    ],
    doctor: [
      'view_patients',
      'edit_patients',
      'create_prescriptions',
      'view_medical_records',
      'create_medical_records',
      'manage_appointments',
      'view_reports'
    ],
    nurse: [
      'view_patients',
      'edit_vital_signs',
      'view_medical_records',
      'manage_appointments',
      'administer_medications'
    ],
    pharmacist: [
      'manage_medications',
      'dispense_prescriptions',
      'manage_stock',
      'view_prescriptions',
      'manage_inventory'
    ]
  };

  const permissionLabels: { [key: string]: string } = {
    manage_users: 'Gérer les utilisateurs',
    system_admin: 'Administration système',
    view_all_data: 'Voir toutes les données',
    manage_permissions: 'Gérer les permissions',
    view_reports: 'Voir les rapports',
    manage_departments: 'Gérer les départements',
    view_patients: 'Voir les patients',
    edit_patients: 'Modifier les patients',
    create_prescriptions: 'Créer des prescriptions',
    view_medical_records: 'Voir les dossiers médicaux',
    create_medical_records: 'Créer des dossiers médicaux',
    manage_appointments: 'Gérer les rendez-vous',
    edit_vital_signs: 'Modifier les signes vitaux',
    administer_medications: 'Administrer des médicaments',
    manage_medications: 'Gérer les médicaments',
    dispense_prescriptions: 'Délivrer des prescriptions',
    manage_stock: 'Gérer le stock',
    view_prescriptions: 'Voir les prescriptions',
    manage_inventory: 'Gérer l\'inventaire'
  };

  useEffect(() => {
    if (userId) {
      const user = users.find(u => u.id === userId);
      if (user) {
        setFormData({
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department || '',
          phone: user.phone || '',
          status: user.status || 'active',
          password: ''
        });
      }
    }
  }, [userId, users]);

  const handleResetPassword = async () => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    setResettingPwd(true);
    try {
      // Generate a temporary password and update
      const tempPwd = `Temp${Math.random().toString(36).slice(-6).toUpperCase()}#1`;
      await updateUser(userId!, { passwordHash: tempPwd });
      // Notify admins
      addNotification({
        id: `PWD-${Date.now()}`,
        type: 'warning',
        title: 'Mot de passe réinitialisé',
        message: `Le mot de passe de ${user.name} (${user.email}) a été réinitialisé. Mot de passe temporaire : ${tempPwd}`,
        read: false,
        userId: 'all',
        createdAt: new Date().toISOString()
      });
      toast.success(
        'Mot de passe réinitialisé',
        `Nouveau mot de passe temporaire généré pour ${user.name}. Il sera affiché dans les notifications.`
      );
    } catch (err) {
      toast.error('Erreur', 'Impossible de réinitialiser le mot de passe.');
    } finally {
      setResettingPwd(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        phone: formData.phone,
        status: formData.status,
        passwordHash: formData.password || undefined
      };

      if (userId) {
        await updateUser(userId, userData);
      } else {
        await addUser(userData);
      }

      onClose();
    } catch (err) {
      console.error('Error saving user:', err);
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    'Cardiologie',
    'Urgences',
    'Chirurgie',
    'Pédiatrie',
    'Neurologie',
    'Pharmacie',
    'Radiologie',
    'Laboratoire',
    'IT',
    'Administration'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {userId ? 'Modifier Utilisateur' : 'Nouvel Utilisateur'}
        </h1>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <select
                required
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                className="sc-select"
              >
                <option value="nurse">Infirmier(e)</option>
                <option value="doctor">Medecin</option>
                <option value="pharmacist">Pharmacien</option>
                <option value="admin">Administrateur</option>
                <option value="receptionist">Agent d'accueil</option>
                <option value="lab_tech">Technicien labo</option>
                <option value="surgeon">Chirurgien</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive'})}
                className="sc-select"
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departement
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="sc-select"
              >
                <option value="">Selectionner un departement</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telephone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {!userId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe par défaut *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Le mot de passe est masqué par défaut pour protéger la confidentialité.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            {/* Left: Reset Password button - only when editing */}
            {userId && (
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={resettingPwd}
                className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors text-sm font-semibold disabled:opacity-50"
              >
                {resettingPwd ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                <span>{resettingPwd ? 'Réinitialisation...' : 'Réinitialiser MDP'}</span>
              </button>
            )}
            {!userId && <span />}

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{loading ? 'Enregistrement...' : (userId ? 'Modifier' : 'Creer')}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;