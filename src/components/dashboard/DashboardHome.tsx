import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users, Calendar, Pill, FileText, AlertTriangle, BedDouble,
  FlaskConical, Heart, AlertCircle, Scissors, CreditCard,
  TrendingUp, ArrowRight, Bed, Activity, Clock
} from 'lucide-react';

const DashboardHome: React.FC = () => {
  const {
    patients, appointments, medications, medicalRecords, beds,
    labOrders, emergencyVisits, surgeries, invoices, departments, setCurrentView, dataLoading
  } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments?.filter(apt => apt.date === today) || [];
  const lowStockMeds = medications?.filter(med => med.stock <= (med.minStock || 10)) || [];
  const occupiedBeds = beds?.filter(b => b.status === 'occupied') || [];
  const pendingLabs = labOrders?.filter(o => o.status === 'pending') || [];
  const activeEmergencies = emergencyVisits?.filter(e => e.status === 'waiting' || e.status === 'in-treatment') || [];
  const todaySurgeries = surgeries?.filter(s => s.scheduledDate === today) || [];
  const pendingInvoices = invoices?.filter(i => i.status === 'sent' || i.status === 'overdue') || [];

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Chargement des donnees...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Patients hospitalises',
      value: occupiedBeds.length,
      icon: BedDouble,
      color: 'bg-gradient-to-br from-cyan-400 to-teal-500',
      shadow: 'shadow-teal-500/30',
      onClick: () => setCurrentView('admissions')
    },
    {
      title: "RDV aujourd'hui",
      value: todayAppointments.length,
      icon: Calendar,
      color: 'bg-gradient-to-br from-blue-400 to-indigo-500',
      shadow: 'shadow-indigo-500/30',
      onClick: () => setCurrentView('appointments')
    },
    {
      title: 'Alertes stock',
      value: lowStockMeds.length,
      icon: AlertTriangle,
      color: 'bg-gradient-to-br from-rose-400 to-red-500',
      shadow: 'shadow-rose-500/30',
      alert: lowStockMeds.length > 0,
      onClick: () => setCurrentView('pharmacy')
    },
    {
      title: 'Dossiers medicaux',
      value: medicalRecords?.length || 0,
      icon: FileText,
      color: 'bg-gradient-to-br from-emerald-400 to-green-500',
      shadow: 'shadow-emerald-500/30',
      onClick: () => setCurrentView('medical-records')
    },
    {
      title: 'Analyses en attente',
      value: pendingLabs.length,
      icon: FlaskConical,
      color: 'bg-gradient-to-br from-violet-400 to-purple-500',
      shadow: 'shadow-purple-500/30',
      onClick: () => setCurrentView('lab')
    },
    {
      title: 'Urgences actives',
      value: activeEmergencies.length,
      icon: AlertCircle,
      color: 'bg-gradient-to-br from-amber-400 to-orange-500',
      shadow: 'shadow-orange-500/30',
      alert: activeEmergencies.length > 0,
      onClick: () => setCurrentView('emergencies')
    },
    {
      title: "Chirurgies aujourd'hui",
      value: todaySurgeries.length,
      icon: Scissors,
      color: 'bg-gradient-to-br from-pink-400 to-rose-500',
      shadow: 'shadow-rose-500/30',
      onClick: () => setCurrentView('surgery')
    },
    {
      title: 'Factures impayees',
      value: pendingInvoices.length,
      icon: CreditCard,
      color: 'bg-gradient-to-br from-slate-400 to-gray-500',
      shadow: 'shadow-gray-500/30',
      onClick: () => setCurrentView('billing')
    }
  ];

  const clinicalDepts = departments?.filter(d => d.type !== 'administrative') || [];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Bienvenue sur SoftCare</h1>
            <p className="text-white/80 text-lg">Tableau de bord hospitalier</p>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center mb-1">
                <Users className="w-5 h-5" />
                <span className="text-4xl font-bold">{patients?.length || 0}</span>
              </div>
              <span className="text-white/70 text-sm">Patients</span>
            </div>
            <div className="h-12 w-px bg-white/30" />
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center mb-1">
                <Calendar className="w-5 h-5" />
                <span className="text-4xl font-bold">{todayAppointments.length}</span>
              </div>
              <span className="text-white/70 text-sm">RDV aujourd'hui</span>
            </div>
            <div className="h-12 w-px bg-white/30" />
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center mb-1">
                <Bed className="w-5 h-5" />
                <span className="text-4xl font-bold">{occupiedBeds.length}</span>
              </div>
              <span className="text-white/70 text-sm">Lits occupes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <button
            key={index}
            onClick={stat.onClick}
            className={`${stat.color} ${stat.shadow} rounded-2xl p-5 text-white transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-lg relative overflow-hidden group`}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="w-8 h-8 opacity-80" />
                {stat.alert && (
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-white/80 mt-1">{stat.title}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Critical Alerts Section */}
      {(lowStockMeds.length > 0 || activeEmergencies.length > 0) && (
        <div className="bg-gradient-to-r from-rose-50 to-red-50 border border-rose-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/30">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-rose-900">Alertes Critiques</h3>
              <p className="text-sm text-rose-600">Action immediate requise</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {lowStockMeds.length > 0 && (
              <div className="bg-white rounded-xl p-5 border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <Pill className="w-5 h-5 text-rose-600" />
                  <span className="font-semibold text-rose-800">Stock faible</span>
                  <span className="ml-auto text-sm bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                    {lowStockMeds.length} produits
                  </span>
                </div>
                <div className="space-y-3">
                  {lowStockMeds.slice(0, 4).map(med => (
                    <div key={med.id} className="flex justify-between items-center text-sm bg-rose-50 p-2 rounded-lg">
                      <span className="text-gray-700 font-medium truncate mr-2">{med.name}</span>
                      <span className="text-rose-600 font-bold bg-white px-2 py-1 rounded-md">
                        {med.stock} / {med.minStock}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeEmergencies.length > 0 && (
              <div className="bg-white rounded-xl p-5 border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                  <span className="font-semibold text-rose-800">Urgences en cours</span>
                  <span className="ml-auto text-sm bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                    {activeEmergencies.length} cas
                  </span>
                </div>
                <div className="space-y-3">
                  {activeEmergencies.slice(0, 4).map(visit => (
                    <div key={visit.id} className="flex items-center gap-3 text-sm bg-rose-50 p-2 rounded-lg">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        visit.triageLevel <= 2 ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
                      }`}>
                        {visit.triageLevel}
                      </span>
                      <span className="text-gray-700 truncate flex-1">{visit.chiefComplaint}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments Today */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Rendez-vous du jour</h3>
              <p className="text-sm text-gray-500">{todayAppointments.length} rendez-vous programmes</p>
            </div>
            <button
              onClick={() => setCurrentView('appointments')}
              className="text-sm text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1"
            >
              Voir tout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {todayAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Aucun rendez-vous aujourd'hui</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppointments.slice(0, 5).map(apt => {
                const patient = patients?.find(p => p.id === apt.patientId);
                return (
                  <div key={apt.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {patient ? `${patient.firstName} ${patient.lastName}` : 'Patient inconnu'}
                      </p>
                      <p className="text-sm text-gray-500">{apt.type} - {apt.time}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      apt.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                      apt.status === 'in-progress' ? 'bg-amber-100 text-amber-700' :
                      apt.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {apt.status === 'scheduled' ? 'Programme' :
                       apt.status === 'in-progress' ? 'En cours' :
                       apt.status === 'completed' ? 'Termine' : apt.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-5">Actions rapides</h3>
          <div className="space-y-3">
            <button
              onClick={() => setCurrentView('patients-new')}
              className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl hover:from-cyan-100 hover:to-teal-100 transition-colors group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center shadow-md shadow-teal-500/30">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Nouveau patient</p>
                <p className="text-xs text-gray-500">Enregistrer un patient</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-cyan-600 transition-colors" />
            </button>
            <button
              onClick={() => setCurrentView('appointments-new')}
              className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-colors group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/30">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Nouveau RDV</p>
                <p className="text-xs text-gray-500">Planifier un rendez-vous</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-blue-600 transition-colors" />
            </button>
            <button
              onClick={() => setCurrentView('lab')}
              className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl hover:from-violet-100 hover:to-purple-100 transition-colors group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center shadow-md shadow-purple-500/30">
                <FlaskConical className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Demande analyse</p>
                <p className="text-xs text-gray-500">Creer une demande labo</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-violet-600 transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Department Overview */}
      {clinicalDepts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-5">Occupation par departement</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {clinicalDepts.map(dept => {
              const deptBeds = beds?.filter(b => b.department === dept.name) || [];
              const occupied = deptBeds.filter(b => b.status === 'occupied').length;
              const total = deptBeds.length;
              const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;

              return (
                <div key={dept.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                  <p className="text-xs font-medium text-gray-600 truncate mb-2">{dept.name}</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {occupied}<span className="text-gray-400 text-lg">/{total}</span>
                  </p>
                  <div className="mt-3 relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`absolute left-0 top-0 h-full rounded-full transition-all ${
                        occupancyRate > 90 ? 'bg-gradient-to-r from-rose-500 to-red-500' :
                        occupancyRate > 70 ? 'bg-gradient-to-r from-amber-400 to-orange-500' :
                        'bg-gradient-to-r from-emerald-400 to-teal-500'
                      }`}
                      style={{ width: `${occupancyRate}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">{occupancyRate}% occupe</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Today's Surgeries */}
      {todaySurgeries.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Programme operateur</h3>
              <p className="text-sm text-gray-500">{todaySurgeries.length} interventions prevues</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todaySurgeries.map(surgery => (
              <div
                key={surgery.id}
                className={`p-5 rounded-xl border-l-4 transition-all hover:shadow-md ${
                  surgery.status === 'in-progress' ? 'bg-violet-50 border-violet-500' :
                  surgery.status === 'completed' ? 'bg-emerald-50 border-emerald-500' :
                  'bg-gray-50 border-cyan-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{surgery.procedure}</span>
                  <span className={`px-3 py-1 text-xs rounded-lg font-medium ${
                    surgery.status === 'in-progress' ? 'bg-violet-200 text-violet-800' :
                    surgery.status === 'completed' ? 'bg-emerald-200 text-emerald-800' :
                    'bg-cyan-100 text-cyan-700'
                  }`}>
                    {surgery.status === 'in-progress' ? 'En cours' :
                     surgery.status === 'completed' ? 'Terminee' : 'Planifiee'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {surgery.scheduledTime} ({surgery.duration} min)
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
