import React, { ReactNode } from 'react';
import { Badge } from '../atoms';

interface FeatureCardProps {
  title: string;
  description: string;
  badge: string;
  badgeVariant?: 'blue' | 'purple' | 'cyan';
  visual: ReactNode;
}

export default function FeatureCard({
  title,
  description,
  badge,
  badgeVariant = 'blue',
  visual,
}: FeatureCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="mb-6 h-48 flex items-center justify-center">{visual}</div>
      <Badge variant={badgeVariant} className="mb-3">
        {badge}
      </Badge>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

