import React from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, UserPlus, Calendar, Pill } from 'lucide-react';

const QuickActions: React.FC = () => {
  const { setCurrentView, currentUser } = useApp();

  const actions = [
    {
      label: 'Nouveau patient',
      icon: UserPlus,
      color: 'blue',
      action: () => setCurrentView('patients'),
      roles: ['admin', 'doctor', 'nurse']
    },
    {
      label: 'Nouveau RDV',
      icon: Calendar,
      color: 'green',
      action: () => setCurrentView('appointments'),
      roles: ['admin', 'doctor', 'nurse']
    },
    {
      label: 'Gérer stock',
      icon: Pill,
      color: 'purple',
      action: () => setCurrentView('pharmacy'),
      roles: ['admin', 'pharmacist']
    }
  ];

  const filteredActions = actions.filter(action => 
    action.roles.includes(currentUser?.role || '')
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
      <div className="space-y-3">
        {filteredActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.action}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 border-dashed transition-colors ${
                action.color === 'blue' ? 'border-blue-300 hover:border-blue-400 hover:bg-blue-50' :
                action.color === 'green' ? 'border-green-300 hover:border-green-400 hover:bg-green-50' :
                'border-purple-300 hover:border-purple-400 hover:bg-purple-50'
              }`}
            >
              <Icon className={`w-5 h-5 ${
                action.color === 'blue' ? 'text-blue-600' :
                action.color === 'green' ? 'text-green-600' : 'text-purple-600'
              }`} />
              <span className="font-medium text-gray-700">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;