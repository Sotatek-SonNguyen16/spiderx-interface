import React from 'react';

interface RoadmapCardProps {
  title: string;
  color: 'blue' | 'purple' | 'green';
  items: string[];
}

export default function RoadmapCard({ title, color, items }: RoadmapCardProps) {
  return (
    <div className={`bg-${color}-50 rounded-2xl p-6`}>
      <div className="flex items-center gap-2 mb-6">
        <div className={`w-3 h-3 bg-${color}-500 rounded-full`} />
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <div className="space-y-4">
        {items.map((item, j) => (
          <div
            key={j}
            className="bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
          >
            <div className="font-medium text-sm mb-2">{item}</div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Feature</span>
          </div>
        ))}
      </div>
    </div>
  );
}

