import React, { ReactNode } from 'react';
import { Badge } from '../atoms';

interface IntegrationCardProps {
  name: string;
  icon: ReactNode;
  status?: 'connected' | 'coming-soon';
  iconBgColor?: string;
  className?: string;
}

export default function IntegrationCard({
  name,
  icon,
  status = 'coming-soon',
  iconBgColor,
  className = '',
}: IntegrationCardProps) {
  return (
    <div className={`relative ${className}`}>
      <div
        className={`w-[120px] h-[120px] border-2 border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer group p-4 ${
          status === 'connected'
            ? 'bg-white hover:border-gray-300 transition-all hover:shadow-lg'
            : 'bg-gray-50 opacity-75 hover:opacity-90 transition-opacity'
        }`}
      >
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform ${
            iconBgColor || (status === 'connected' ? 'bg-red-50' : '')
          }`}
        >
          {icon}
        </div>
        <div
          className={`text-sm font-semibold text-center ${
            status === 'connected' ? 'text-gray-900' : 'text-gray-700'
          }`}
        >
          {name}
        </div>
      </div>
      {status === 'connected' && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
      )}
      {status === 'coming-soon' && (
        <Badge variant="soon" className="absolute -top-2 -right-2 text-[10px] font-bold">
          Soon
        </Badge>
      )}
    </div>
  );
}

