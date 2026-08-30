import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Calendar, Clock, User, Users as UsersIcon, CheckCircle, XCircle, Download, FileSpreadsheet, Printer } from 'lucide-react';
import { WorkSchedule, LeaveRequest } from '../../types';
import { printDocument, generateDocumentHeader, generateDocumentFooter, exportToExcel } from '../../utils/exportUtils';

const ScheduleModule: React.FC = () => {
  const { workSchedules, users, departments, setWorkSchedules, organizationSettings } = useApp();
  const [selectedWeek, setSelectedWeek] = useState(new Date().toISOString().split('T')[0]);
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [showNewSchedule, setShowNewSchedule] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.name || 'Inconnu';
  };

  const getUserRole = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.role || '';
  };

  const getDepartmentName = (deptId: string) => {
    const dept = departments.find(d => d.id === deptId);
    return dept?.name || 'N/A';
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-red-100 text-red-800',
      doctor: 'bg-blue-100 text-blue-800',
      surgeon: 'bg-purple-100 text-purple-800',
      nurse: 'bg-green-100 text-green-800',
      pharmacist: 'bg-yellow-100 text-yellow-800',
      lab_tech: 'bg-indigo-100 text-indigo-800',
      receptionist: 'bg-gray-100 text-gray-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getShiftColor = (shift: string) => {
    const colors: Record<string, string> = {
      day: 'bg-yellow-50 border-yellow-300',
      night: 'bg-indigo-50 border-indigo-300',
      'on-call': 'bg-red-50 border-red-300'
    };
    return colors[shift] || 'bg-gray-50 border-gray-300';
  };

  // Get dates for the current week
  const getWeekDates = (startStr: string) => {
    const start = new Date(startStr);
    const dayOfWeek = start.getDay();
    const monday = new Date(start);
    monday.setDate(start.getDate() - dayOfWeek + 1);

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const weekDates = getWeekDates(selectedWeek);
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  const filteredSchedules = workSchedules.filter(schedule => {
    const matchesDept = filterDepartment === 'all' || schedule.departmentId === filterDepartment;
    const matchesWeek = weekDates.includes(schedule.date);
    return matchesDept && matchesWeek;
  });

  // Group by user
  const userSchedules = users
    .filter(u => u.role !== 'admin')
    .reduce((acc, user) => {
      acc[user.id] = weekDates.map(date => {
        const schedule = workSchedules.find(s => s.userId === user.id && s.date === date);
        return { date, schedule };
      });
      return acc;
    }, {} as Record<string, { date: string; schedule?: WorkSchedule }[]>);

  const generateScheduleHTML = () => {
    const rows = Object.entries(userSchedules)
      .filter(([userId]) => {
        const user = users.find(u => u.id === userId);
        if (!user) return false;
        if (filterDepartment === 'all') return true;
        return user.department === filterDepartment;
      })
      .map(([userId, days]) => {
        const user = users.find(u => u.id === userId);
        if (!user) return '';

        const dayCells = days.map(({ date, schedule }) => {
          if (schedule) {
            const shiftLabel = schedule.shiftType === 'day' ? 'Jour' :
                              schedule.shiftType === 'night' ? 'Nuit' : 'Astreinte';
            return `<td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${shiftLabel}<br/><span style="font-size: 11px; color: #666;">${schedule.startTime}-${schedule.endTime}</span></td>`;
          }
          return '<td style="padding: 8px; border: 1px solid #ddd; text-align: center; background: #f9f9f9;">-</td>';
        }).join('');

        return `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>${user.name}</strong><br/><span style="font-size: 11px; color: #666;">${user.role}</span></td>${dayCells}</tr>`;
      }).join('');

    const headerCells = dayNames.map((d, i) =>
      `<th style="padding: 10px; background-color: ${organizationSettings.primaryColor}; color: white;">${d}<br/><span style="font-size: 11px;">${new Date(weekDates[i]).toLocaleDateString('fr-FR')}</span></th>`
    ).join('');

    return `
      ${generateDocumentHeader(organizationSettings, 'report', `PLN-${Date.now().toString().slice(-8)}`)}
      <h2 style="margin: 20px 0; color: #333;">Planning du Personnel - Semaine du ${new Date(weekDates[0]).toLocaleDateString('fr-FR')}</h2>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr>
            <th style="padding: 10px; background-color: ${organizationSettings.primaryColor}; color: white;">Personnel</th>
            ${headerCells}
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      ${generateDocumentFooter(organizationSettings)}
    `;
  };

  const handleExportPDF = async () => {
    await printDocument(generateScheduleHTML(), organizationSettings, 'Planning-Personnel');
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    const data = filteredSchedules.map(s => ({
      personnel: getUserName(s.userId),
      date: new Date(s.date).toLocaleDateString('fr-FR'),
      service: s.shiftType === 'day' ? 'Jour' : s.shiftType === 'night' ? 'Nuit' : 'Astreinte',
      debut: s.startTime,
      fin: s.endTime,
      departement: getDepartmentName(s.departmentId),
      statut: s.status
    }));
    exportToExcel(data, 'Planning-Personnel', ['Personnel', 'Date', 'Service', 'Debut', 'Fin', 'Departement', 'Statut']);
    setShowExportMenu(false);
  };

  const handlePrint = async () => {
    await printDocument(generateScheduleHTML(), organizationSettings, 'Planning-Personnel');
    setShowExportMenu(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Planning du Personnel</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2"
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
            onClick={() => setShowNewSchedule(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter au planning
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Personnel total</p>
          <p className="text-3xl font-bold text-gray-900">{users.filter(u => u.role !== 'admin').length}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-200 p-4">
          <p className="text-sm text-yellow-600">Service de jour</p>
          <p className="text-3xl font-bold text-yellow-700">
            {filteredSchedules.filter(s => s.shiftType === 'day').length}
          </p>
        </div>
        <div className="bg-indigo-50 rounded-lg shadow-sm border border-indigo-200 p-4">
          <p className="text-sm text-indigo-600">Service de nuit</p>
          <p className="text-3xl font-bold text-indigo-700">
            {filteredSchedules.filter(s => s.shiftType === 'night').length}
          </p>
        </div>
        <div className="bg-red-50 rounded-lg shadow-sm border border-red-200 p-4">
          <p className="text-sm text-red-600">Astreintes</p>
          <p className="text-3xl font-bold text-red-700">
            {filteredSchedules.filter(s => s.shiftType === 'on-call').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Semaine du</label>
            <input
              type="date"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Département</label>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Week Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[200px]">
                Personnel
              </th>
              {weekDates.map((date, idx) => (
                <th key={date} className="px-4 py-3 text-center min-w-[120px]">
                  <p className="text-sm font-medium text-gray-900">{dayNames[idx]}</p>
                  <p className="text-xs text-gray-500">{new Date(date).toLocaleDateString('fr-FR')}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Object.entries(userSchedules)
              .filter(([userId]) => {
                const user = users.find(u => u.id === userId);
                if (!user) return false;
                if (filterDepartment === 'all') return true;
                return user.department === filterDepartment;
              })
              .map(([userId, days]) => {
                const user = users.find(u => u.id === userId);
                if (!user) return null;

                return (
                  <tr key={userId} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </td>
                    {days.map(({ date, schedule }) => (
                      <td key={date} className="px-2 py-2">
                        {schedule ? (
                          <div className={`p-2 rounded-lg border text-center ${getShiftColor(schedule.shiftType)}`}>
                            <p className="text-xs font-medium">
                              {schedule.shiftType === 'day' ? 'Jour' :
                               schedule.shiftType === 'night' ? 'Nuit' : 'Astreinte'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {schedule.startTime} - {schedule.endTime}
                            </p>
                            {schedule.status === 'absent' && (
                              <XCircle className="w-4 h-4 text-red-500 mx-auto mt-1" />
                            )}
                          </div>
                        ) : (
                          <div className="h-12 bg-gray-50 rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
                            <Plus className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* New Schedule Modal */}
      {showNewSchedule && <NewScheduleForm onClose={() => setShowNewSchedule(false)} />}
    </div>
  );
};

// Formulaire nouveau planning
const NewScheduleForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { users, departments, workSchedules, setWorkSchedules } = useApp();
  const [selectedUser, setSelectedUser] = useState('');
  const [formData, setFormData] = useState({
    date: '',
    shiftType: 'day' as WorkSchedule['shiftType'],
    startTime: '08:00',
    endTime: '16:00',
    departmentId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const schedule: WorkSchedule = {
      id: Date.now().toString(),
      userId: selectedUser,
      ...formData,
      status: 'scheduled'
    };

    setWorkSchedules([...workSchedules, schedule]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Ajouter au planning</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <Plus className="w-6 h-6 rotate-45" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Personnel</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Sélectionner</option>
              {users.filter(u => u.role !== 'admin').map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de service</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'day', label: 'Jour' },
                { value: 'night', label: 'Nuit' },
                { value: 'on-call', label: 'Astreinte' }
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    const times: Record<string, [string, string]> = {
                      day: ['08:00', '16:00'],
                      night: ['20:00', '06:00'],
                      'on-call': ['08:00', '08:00']
                    };
                    setFormData(prev => ({
                      ...prev,
                      shiftType: opt.value as WorkSchedule['shiftType'],
                      startTime: times[opt.value][0],
                      endTime: times[opt.value][1]
                    }));
                  }}
                  className={`px-3 py-2 rounded-lg border ${
                    formData.shiftType === opt.value ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Début</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fin</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
            <select
              value={formData.departmentId}
              onChange={(e) => setFormData(prev => ({ ...prev, departmentId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Sélectionner</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
              Annuler
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModule;
