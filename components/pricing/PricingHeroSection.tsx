"use client";

import BillingToggle from './BillingToggle';

interface PricingHeroSectionProps {
  billingPeriod: 'monthly' | 'yearly';
  onBillingChange: (period: 'monthly' | 'yearly') => void;
}

export default function PricingHeroSection({ billingPeriod, onBillingChange }: PricingHeroSectionProps) {
  return (
    <section className="pt-24 md:pt-28 pb-8 md:pb-12 px-4 md:px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-4 leading-tight tracking-tight">
          Pricing that scales with your workflow
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Capture tasks from email & chat, review in Queue, keep projects in sync.
        </p>
        
        <BillingToggle value={billingPeriod} onChange={onBillingChange} />
      </div>
    </section>
  );
}
