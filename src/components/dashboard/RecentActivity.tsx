import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, User, Calendar, FileText } from 'lucide-react';

const RecentActivity: React.FC = () => {
  const { appointments, patients } = useApp();

  // Mock recent activities
  const activities = [
    {
      id: '1',
      type: 'appointment',
      message: 'Nouveau rendez-vous programmé',
      patient: 'Jean Dupont',
      time: '10:30',
      icon: Calendar,
      color: 'blue'
    },
    {
      id: '2',
      type: 'patient',
      message: 'Nouveau patient enregistré',
      patient: 'Marie Martin',
      time: '09:15',
      icon: User,
      color: 'green'
    },
    {
      id: '3',
      type: 'record',
      message: 'Dossier médical mis à jour',
      patient: 'Pierre Bernard',
      time: '08:45',
      icon: FileText,
      color: 'purple'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activity.color === 'blue' ? 'bg-blue-100' :
                activity.color === 'green' ? 'bg-green-100' : 'bg-purple-100'
              }`}>
                <Icon className={`w-5 h-5 ${
                  activity.color === 'blue' ? 'text-blue-600' :
                  activity.color === 'green' ? 'text-green-600' : 'text-purple-600'
                }`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                <p className="text-sm text-gray-600">{activity.patient}</p>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {activity.time}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;