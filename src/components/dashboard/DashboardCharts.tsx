import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { TrendingUp, Users, Calendar, DollarSign } from 'lucide-react';

const COLORS = ['#0891b2', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const DashboardCharts: React.FC = () => {
  const { patients, appointments, invoices, beds, organizationSettings } = useApp();

  // Patient admissions per day (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const admissionsData = last7Days.map(date => {
    const dayAppointments = appointments.filter(a => a.date === date).length;
    return {
      date: new Date(date).toLocaleDateString('fr-FR', { weekday: 'short' }),
      consultations: dayAppointments,
    };
  });

  // Revenue by month
  const revenueByMonth = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Fev', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Avr', revenue: 61000 },
    { month: 'Mai', revenue: 55000 },
    { month: 'Jun', revenue: 67000 },
  ];

  // Department occupancy
  const departmentData = [
    { name: 'Cardiologie', value: 85 },
    { name: 'Pediatrie', value: 72 },
    { name: 'Chirurgie', value: 90 },
    { name: 'Urgences', value: 95 },
    { name: 'Maternite', value: 60 },
  ];

  // Gender distribution
  const genderData = [
    { name: 'Hommes', value: patients.filter(p => p.gender === 'male').length || 45 },
    { name: 'Femmes', value: patients.filter(p => p.gender === 'female').length || 55 },
  ];

  const totalRevenue = revenueByMonth.reduce((sum, m) => sum + m.revenue, 0);
  const avgRevenue = Math.round(totalRevenue / revenueByMonth.length);

  return (
    <div className="space-y-6">
      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Patients actifs</p>
              <p className="text-3xl font-bold mt-1">{patients.length}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Consultations/mois</p>
              <p className="text-3xl font-bold mt-1">{appointments.length}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Revenus/mois</p>
              <p className="text-3xl font-bold mt-1">{avgRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Taux occupation</p>
              <p className="text-3xl font-bold mt-1">78%</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consultations Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultations cette semaine</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={admissionsData}>
                <defs>
                  <linearGradient id="colorConsultations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="consultations"
                  stroke="#0891b2"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorConsultations)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenus mensuels ({organizationSettings.currencySymbol})</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} ${organizationSettings.currencySymbol}`, 'Revenu']}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Occupancy */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Occupation par departement</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number) => [`${value}%`, 'Occupation']}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {departmentData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.value > 90 ? '#ef4444' : entry.value > 70 ? '#f59e0b' : '#10b981'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Repartition par genre</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;