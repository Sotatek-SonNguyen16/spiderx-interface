"use client";

import { useState } from "react";
import Header from "@/components/ui/header";
import AnchorTabs from "@/components/pricing/AnchorTabs";
import PricingHeroSection from "@/components/pricing/PricingHeroSection";
import PlanCardsSection from "@/components/pricing/PlanCardsSection";
import ValueStrip from "@/components/pricing/ValueStrip";
import CompareTable from "@/components/pricing/CompareTable";
import AddOnsSection from "@/components/pricing/AddOnsSection";
import FAQSection from "@/components/pricing/FAQSection";
import TrustSection from "@/components/pricing/TrustSection";
import FinalCTASection from "@/components/pricing/FinalCTASection";

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly",
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Anchor Tabs */}
      <AnchorTabs />

      {/* Hero Section */}
      <PricingHeroSection
        billingPeriod={billingPeriod}
        onBillingChange={setBillingPeriod}
      />

      {/* Plan Cards Section */}
      <section id="plans" className="py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <PlanCardsSection billingPeriod={billingPeriod} />
        </div>
      </section>

      {/* Value Strip */}
      <section className="py-8 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <ValueStrip />
        </div>
      </section>

      {/* Compare Table */}
      <section id="compare" className="py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <CompareTable />
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-12 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <AddOnsSection />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <FAQSection />
        </div>
      </section>

      {/* Trust Section */}
      <section id="security" className="py-12 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <TrustSection />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <FinalCTASection />
        </div>
      </section>
    </div>
  );
}
