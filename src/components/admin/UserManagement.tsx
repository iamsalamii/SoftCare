import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, CreditCard as Edit, Trash2, User, Download, FileSpreadsheet, Printer, Loader2 } from 'lucide-react';
import UserForm from './UserForm';
import { printDocument, generateDocumentHeader, generateDocumentFooter, exportToExcel } from '../../utils/exportUtils';
import ConfirmDialog from '../common/ConfirmDialog';

const UserManagement: React.FC = () => {
  const { users, organizationSettings, deleteUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState('all');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const roles = ['all', 'admin', 'doctor', 'nurse', 'pharmacist', 'receptionist', 'lab_tech', 'surgeon'];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'doctor': return 'bg-blue-100 text-blue-800';
      case 'nurse': return 'bg-green-100 text-green-800';
      case 'pharmacist': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'doctor': return 'Medecin';
      case 'nurse': return 'Infirmier(e)';
      case 'pharmacist': return 'Pharmacien';
      case 'receptionist': return "Agent d'accueil";
      case 'lab_tech': return 'Technicien labo';
      case 'surgeon': return 'Chirurgien';
      default: return role;
    }
  };

  const handleNewUser = () => {
    setSelectedUser(null);
    setShowForm(true);
  };

  const handleEditUser = (userId: string) => {
    setSelectedUser(userId);
    setShowForm(true);
  };

  const handleDeleteUser = (userId: string) => {
    setShowDeleteConfirm(userId);
  };

  const handleDeleteConfirm = async (userId: string) => {
    setDeleting(true);
    try {
      await deleteUser(userId);
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting user:', err);
    } finally {
      setDeleting(false);
    }
  };

  const generateUsersHTML = () => {
    const rows = filteredUsers.map(u => `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;">${u.name}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${u.email}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${getRoleText(u.role)}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${u.department || '-'}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${u.active ? 'Actif' : 'Inactif'}</td>
      </tr>
    `).join('');

    return `
      ${generateDocumentHeader(organizationSettings, 'report', `USR-${Date.now().toString().slice(-8)}`)}
      <h2 style="margin: 20px 0; color: #333;">Liste des Utilisateurs</h2>
      <p style="color: #666; margin-bottom: 20px;">Total: ${filteredUsers.length} utilisateurs</p>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: ${organizationSettings.primaryColor};">
            <th style="padding: 10px; color: white; text-align: left;">Nom</th>
            <th style="padding: 10px; color: white; text-align: left;">Email</th>
            <th style="padding: 10px; color: white; text-align: left;">Role</th>
            <th style="padding: 10px; color: white; text-align: left;">Departement</th>
            <th style="padding: 10px; color: white; text-align: left;">Statut</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      ${generateDocumentFooter(organizationSettings)}
    `;
  };

  const handleExportPDF = async () => {
    await printDocument(generateUsersHTML(), organizationSettings, 'Utilisateurs');
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    const data = filteredUsers.map(u => ({
      nom: u.name,
      email: u.email,
      role: getRoleText(u.role),
      departement: u.department || '-',
      statut: u.active ? 'Actif' : 'Inactif'
    }));
    exportToExcel(data, 'Utilisateurs', ['Nom', 'Email', 'Role', 'Departement', 'Statut']);
    setShowExportMenu(false);
  };

  const handlePrint = async () => {
    await printDocument(generateUsersHTML(), organizationSettings, 'Utilisateurs');
    setShowExportMenu(false);
  };

  if (showForm) {
    return (
      <UserForm
        userId={selectedUser}
        onClose={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exporter
            </button>

            {showExportMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                  <button
                    onClick={handleExportPDF}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Download className="w-4 h-4 text-red-500" />
                    <span>Exporter PDF</span>
                  </button>
                  <button
                    onClick={handleExportExcel}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-green-500" />
                    <span>Exporter Excel</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Printer className="w-4 h-4 text-blue-500" />
                    <span>Imprimer</span>
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleNewUser}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvel Utilisateur</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {roles.map(role => (
                <option key={role} value={role}>
                  {role === 'all' ? 'Tous les rôles' : getRoleText(role)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Departement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {getRoleText(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.department || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.phone || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditUser(user.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!showDeleteConfirm}
        title="Supprimer l'utilisateur"
        message="Etes-vous sur de vouloir supprimer cet utilisateur? Cette action est irreversible."
        confirmLabel={deleting ? 'Suppression...' : 'Supprimer'}
        onConfirm={() => showDeleteConfirm && handleDeleteConfirm(showDeleteConfirm)}
        onCancel={() => setShowDeleteConfirm(null)}
        variant="danger"
        loading={deleting}
      />
    </div>
  );
};

export default UserManagement;