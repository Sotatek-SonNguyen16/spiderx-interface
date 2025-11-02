"use client";

import { Mail, MessageSquare, MessageCircle } from 'lucide-react';
import { IntegrationCard } from '../molecules';
import { Button } from '../atoms';

interface IntegrationSectionProps {
  onRequestIntegration: () => void;
}

export default function IntegrationSection({ onRequestIntegration }: IntegrationSectionProps) {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4 tracking-tight">Integrations</h2>
          <p className="text-xl text-gray-600">Connect SpiderX with your favorite tools</p>
        </div>

        <div className="space-y-12">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6 text-center">
              Connected
            </h3>
            <div className="flex justify-center gap-6 flex-wrap">
              <IntegrationCard
                name="Gmail"
                icon={<Mail className="w-7 h-7 text-red-500" />}
                status="connected"
              />
              <IntegrationCard
                name="Google Chat"
                icon={<MessageSquare className="w-7 h-7 text-green-600" />}
                status="connected"
                iconBgColor="bg-green-50"
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6 text-center">
              Coming Soon
            </h3>
            <div className="flex justify-center gap-6 flex-wrap">
              <IntegrationCard
                name="Slack"
                icon={<span className="text-2xl font-bold text-purple-600">#</span>}
                status="coming-soon"
              />
              <IntegrationCard
                name="WhatsApp"
                icon={<MessageCircle className="w-7 h-7 text-green-500" />}
                status="coming-soon"
              />
              <IntegrationCard
                name="Telegram"
                icon={<span className="text-2xl font-bold text-blue-600">✈</span>}
                status="coming-soon"
              />
              <IntegrationCard
                name="Discord"
                icon={<span className="text-2xl font-bold text-indigo-600">🎮</span>}
                status="coming-soon"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Want to request an integration?</p>
          <Button variant="outline" onClick={onRequestIntegration}>
            Request Integration
          </Button>
        </div>
      </div>
    </section>
  );
}

