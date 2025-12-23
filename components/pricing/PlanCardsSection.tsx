"use client";

import { PRICING_CONFIG } from '@/lib/config/pricing';
import PlanCard from './PlanCard';
import EnterpriseStrip from './EnterpriseStrip';

interface PlanCardsSectionProps {
  billingPeriod: 'monthly' | 'yearly';
}

export default function PlanCardsSection({ billingPeriod }: PlanCardsSectionProps) {
  const { plans } = PRICING_CONFIG;

  return (
    <div className="space-y-8">
      {/* Three Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {/* Free Plan */}
        <PlanCard
          plan={plans.free}
          billingPeriod={billingPeriod}
        />

        {/* Pro Plan (Recommended) */}
        <PlanCard
          plan={plans.pro}
          billingPeriod={billingPeriod}
          recommended={plans.pro.recommended}
        />

        {/* Team Plan */}
        <PlanCard
          plan={plans.team}
          billingPeriod={billingPeriod}
        />
      </div>

      {/* Enterprise Strip */}
      <EnterpriseStrip plan={plans.enterprise} />
    </div>
  );
}
