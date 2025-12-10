"use client";

import Image from 'next/image';
import { IntegrationCard } from '../molecules';
import { Button } from '../atoms';

interface IntegrationSectionProps {
  onRequestIntegrationAction: () => void;
}

export default function IntegrationSection({ onRequestIntegrationAction }: IntegrationSectionProps) {
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
                icon={
                  <Image
                    src="/images/Gmail.png"
                    alt="Gmail"
                    width={28}
                    height={28}
                    className="w-7 h-7 object-contain"
                  />
                }
                status="connected"
              />
              <IntegrationCard
                name="Google Chat"
                icon={
                  <Image
                    src="/images/Google-Chat.png"
                    alt="Google Chat"
                    width={48}
                    height={48}
                    className="w-12 h-12 object-contain"
                  />
                }
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
                icon={
                  <Image
                    src="/images/Slack.png"
                    alt="Slack"
                    width={48}
                    height={48}
                    className="w-12 h-12 object-contain"
                  />
                }
                status="coming-soon"
              />
              <IntegrationCard
                name="WhatsApp"
                icon={
                  <Image
                    src="/images/whatsapp.webp"
                    alt="WhatsApp"
                    width={48}
                    height={48}
                    className="w-12 h-12 object-contain rounded-full"
                  />
                }
                status="coming-soon"
              />
              <IntegrationCard
                name="Telegram"
                icon={
                  <Image
                    src="/images/Telegram.png"
                    alt="Telegram"
                    width={48}
                    height={48}
                    className="w-12 h-12 object-contain"
                  />
                }
                status="coming-soon"
              />
              <IntegrationCard
                name="Discord"
                icon={
                  <Image
                    src="/images/discord.jpg"
                    alt="Discord"
                    width={48}
                    height={48}
                    className="w-12 h-12 object-contain"
                  />
                }
                status="coming-soon"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 text-center flex flex-col items-center justify-center gap-4">
          <p className="text-gray-600">Want to request an integration?</p>
          <Button variant="outline" onClick={onRequestIntegrationAction}>
            Request Integration
          </Button>
        </div>
      </div>
    </section>
  );
}

