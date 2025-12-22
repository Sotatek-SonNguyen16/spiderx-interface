import Image from 'next/image';
import { EmailInput } from '../molecules';
import { Button } from '../atoms';

interface HeroSectionProps {
  onEmailSubmit: (email: string) => void;
}

export default function HeroSection({ onEmailSubmit }: HeroSectionProps) {
  const scrollToShowcase = () => {
    document.getElementById('product-showcase')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="pt-24 md:pt-28 pb-8 md:pb-16 px-4 md:px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Desktop: Side by side layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          {/* Left: Text content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            {/* H1 - Value clarity + Differentiation */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-gray-900 mb-4 md:mb-5 leading-tight tracking-tight">
              Capture tasks from every platform — automatically
            </h1>

            {/* H2 - Explanation */}
            <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-4 md:mb-5 leading-relaxed max-w-xl mx-auto lg:mx-0">
              SpiderX uses AI to detect tasks from emails and chats, then organizes them across all your projects.
            </p>

            {/* Trust micro-line */}
            <p className="text-sm text-gray-500 mb-6 md:mb-8">
              Works with Gmail, Google Chat — more coming soon.
            </p>

            {/* CTA Section */}
            <div className="space-y-3">
              <EmailInput onSubmit={onEmailSubmit} />
              
              {/* Micro-copy reinforcement */}
              <p className="text-xs md:text-sm text-gray-500">
                Free for early users. No credit card required.
              </p>

              {/* Secondary CTA - Desktop only */}
              <button 
                onClick={scrollToShowcase}
                className="hidden md:inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 font-medium mt-2 transition-colors"
              >
                See how it works
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right: Screenshot with callouts */}
          <div className="lg:w-1/2 w-full">
            <div className="relative">
              {/* Screenshot */}
              <div className="relative aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden bg-gray-100 shadow-xl border border-gray-200">
                <Image
                  src="/images/cover.png"
                  alt="Gmail inbox with SpiderX sidebar showing automatically captured tasks"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-contain p-1 md:p-2"
                  priority
                />
              </div>

              {/* Hero-level callouts (3 only) - Desktop */}
              <div className="hidden lg:block">
                {/* Callout 1 - Top left */}
                <div className="absolute -left-4 top-8 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 max-w-[160px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs font-medium text-gray-700">Detected from email</span>
                  </div>
                </div>

                {/* Callout 2 - Right middle */}
                <div className="absolute -right-4 top-1/3 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 max-w-[180px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-xs font-medium text-gray-700">AI extracted deadline</span>
                  </div>
                </div>

                {/* Callout 3 - Bottom right */}
                <div className="absolute -right-4 bottom-12 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 max-w-[160px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span className="text-xs font-medium text-gray-700">Added to task list</span>
                  </div>
                </div>
              </div>

              {/* Mobile callouts - Horizontal below image */}
              <div className="flex lg:hidden justify-center gap-2 mt-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 bg-white rounded-full px-3 py-1 text-xs text-gray-600 border border-gray-200 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Detected from email
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white rounded-full px-3 py-1 text-xs text-gray-600 border border-gray-200 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  AI extracted
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white rounded-full px-3 py-1 text-xs text-gray-600 border border-gray-200 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  Auto-organized
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
