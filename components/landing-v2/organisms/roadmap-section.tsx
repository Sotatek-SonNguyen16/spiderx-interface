"use client";

import { RoadmapCard } from '../molecules';
import { Button } from '../atoms';

interface RoadmapSectionProps {
  onRequestFeature: () => void;
}

const roadmapData = [
  {
    title: 'Planned',
    color: 'blue' as const,
    items: ['Slack Integration', 'Smart Reminders', 'Calendar Sync', 'Mobile App'],
  },
  {
    title: 'In Progress',
    color: 'purple' as const,
    items: ['WhatsApp Detection', 'AI Priority Scoring', 'Team Collaboration'],
  },
  {
    title: 'Complete',
    color: 'green' as const,
    items: ['Gmail Integration', 'Google Chat Monitor', 'Context Grouping', 'Ask AI Assistant'],
  },
];

export default function RoadmapSection({ onRequestFeature }: RoadmapSectionProps) {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4 tracking-tight">Roadmap</h2>
            <p className="text-xl text-gray-600">See what we're building and suggest new features</p>
          </div>
          <Button onClick={onRequestFeature}>Request Feature</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roadmapData.map((col, i) => (
            <RoadmapCard key={i} title={col.title} color={col.color} items={col.items} />
          ))}
        </div>

        <div className="mt-12 text-center p-8 bg-gray-50 rounded-2xl flex flex-col items-center justify-center gap-4">
          <h3 className="text-xl font-semibold text-gray-900">Have a feature idea?</h3>
          <p className="text-gray-600">We'd love to hear your suggestions for SpiderX</p>
          <Button variant="outline" onClick={onRequestFeature}>
            Request Feature
          </Button>
        </div>
      </div>
    </section>
  );
}

