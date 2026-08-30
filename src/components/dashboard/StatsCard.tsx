import React from 'react';
import { Video as LucideIcon, ArrowRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  gradient: string;
  trend?: string;
  trendUp?: boolean;
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, gradient, trend, trendUp, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02] hover:border-gray-200' : ''
      }`}
    >
      {/* Gradient accent */}
      <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${gradient}`} />

      <div className="flex items-start justify-between pl-2">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-4xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trendUp ? (
                <span className="flex items-center text-emerald-600 text-sm font-medium">
                  <span className="mr-1">+</span>
                  {trend}
                </span>
              ) : (
                <span className="flex items-center text-rose-600 text-sm font-medium">
                  {trend}
                </span>
              )}
              <span className="text-gray-400 text-sm">ce mois</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>

      {onClick && (
        <div className="flex items-center gap-1 text-gray-400 text-xs mt-4 pl-2 group-hover:text-gray-600">
          <span>Voir details</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      )}
    </div>
  );
};

export default StatsCard;