"use client";

import Image from 'next/image';
import { IntegrationCard } from '../molecules';
import { Button } from '../atoms';

interface IntegrationSectionProps {
  onRequestIntegrationAction: () => void;
}

const integrations = {
  connected: [
    { name: 'Gmail', icon: '/images/Gmail.png', size: 28 },
    { name: 'Google Chat', icon: '/images/Google-Chat.png', size: 48 },
  ],
  comingSoon: [
    { name: 'Slack', icon: '/images/Slack.png', size: 48 },
    { name: 'WhatsApp', icon: '/images/whatsapp.webp', size: 48, rounded: true },
    { name: 'Telegram', icon: '/images/Telegram.png', size: 48 },
    { name: 'Discord', icon: '/images/discord.jpg', size: 48 },
  ],
};

export default function IntegrationSection({ onRequestIntegrationAction }: IntegrationSectionProps) {
  return (
    <section className="py-12 md:py-20 px-4 md:px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-3 md:mb-4 tracking-tight">
            <span className="md:hidden">Works with your tools</span>
            <span className="hidden md:inline">One task inbox for all your tools</span>
          </h2>
          <p className="text-base md:text-xl text-gray-600 mb-2 md:mb-4">
            <span className="md:hidden">Tasks are normalized into one system.</span>
            <span className="hidden md:inline">SpiderX captures tasks from the platforms you already use and turns them into a single, reliable task system.</span>
          </p>
          <p className="hidden md:block text-base text-gray-500 max-w-2xl mx-auto">
            Tasks from different tools are normalized into the same structure —
            no matter where they come from.
          </p>
        </div>

        {/* MOBILE: Horizontal scroll */}
        <div className="md:hidden">
          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex gap-3 w-max">
              {integrations.connected.map((item) => (
                <div key={item.name} className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 min-w-[100px]">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={item.size}
                      height={item.size}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-sm text-gray-700">{item.name}</span>
                  <span className="text-xs text-green-600 font-medium">Connected</span>
                </div>
              ))}
              {integrations.comingSoon.map((item) => (
                <div key={item.name} className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 min-w-[100px] opacity-75">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={item.size}
                      height={item.size}
                      className={`object-contain ${item.rounded ? 'rounded-full' : ''}`}
                    />
                  </div>
                  <span className="text-sm text-gray-700">{item.name}</span>
                  <span className="text-xs text-gray-500">Soon</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Tasks are normalized into one system
          </p>
        </div>

        {/* DESKTOP: Original layout */}
        <div className="hidden md:block space-y-12">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6 text-center">
              Already connected
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
              More platforms coming — driven by user requests
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

        <div className="mt-8 md:mt-12 text-center flex flex-col items-center justify-center gap-3 md:gap-4">
          <p className="text-sm md:text-base text-gray-600">Want to request an integration?</p>
          <Button variant="outline" onClick={onRequestIntegrationAction}>
            Request Integration
          </Button>
        </div>
      </div>
    </section>
  );
}
