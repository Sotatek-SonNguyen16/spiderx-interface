"use client";

import { useState } from 'react';
import {
  HeroSection,
  ProductShowcase,
  ProblemStatement,
  ValueExpansion,
  IntegrationSection,
  RoadmapSection,
  CTASection,
  Footer,
  EmailModal,
  FeatureRequestModal,
  StickyCTA,
} from '@/components/landing-v2';
import Header from '@/components/ui/header';

const n8nUrl: Record<'test' | 'production' , string> = {test: 'https://n8n.sotaagents.ai/webhook-test/5927fbec-5b13-4aad-8d7a-3bf4de67a9e3', production: 'https://n8n.sotaagents.ai/webhook/5927fbec-5b13-4aad-8d7a-3bf4de67a9e3'};


export default function HomeV2() {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showEmailConfetti, setShowEmailConfetti] = useState(false);
  const [showFeatureRequest, setShowFeatureRequest] = useState(false);

  const handleEmailSubmit = async (email: string) => {
    setShowEmailConfetti(true);
    setShowEmailModal(true);

    // Send email to n8n webhook
    try {
      await fetch(n8nUrl.production, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: "email_submission",
          email,
        }),
        mode: 'no-cors',
      });
    } catch {
    }

    setTimeout(() => {
      setShowEmailConfetti(false);
    }, 3000);
  };

  const handleFeatureSubmit = async (description: string, priority: string) => {
    // Send feature request data to n8n webhook
    try {
        await fetch(n8nUrl.production, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: "feature_request",
          description,
          priority,
        }),
      });
    } catch  {
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Header />
      {/* 1. HERO - What is this? */}
      <HeroSection onEmailSubmit={handleEmailSubmit} />
      
      {/* 2. SHOWCASE - How does it work? (Trust builder) */}
      <ProductShowcase />
      
      {/* 3. PROBLEMS - Why it matters (Validated by showcase) */}
      <ProblemStatement />
      
      {/* 4. VALUE EXPANSION - Why it's better (Multi-project focus) */}
      <ValueExpansion />
      
      {/* 5. INTEGRATIONS - Will it fit my workflow? */}
      <IntegrationSection onRequestIntegrationAction={() => setShowFeatureRequest(true)} />
      
      {/* 6. ROADMAP - Can I trust you? (Near footer) */}
      <RoadmapSection onRequestFeature={() => setShowFeatureRequest(true)} />
      
      {/* 7. CTA - What do I do now? */}
      <CTASection onEmailSubmit={handleEmailSubmit} />
      
      <Footer />

      {/* Mobile sticky CTA */}
      <StickyCTA onCtaClick={() => {
        // Scroll to CTA section
        document.querySelector('section:last-of-type')?.scrollIntoView({ behavior: 'smooth' });
      }} />

      <EmailModal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} showConfetti={showEmailConfetti} />
      <FeatureRequestModal
        isOpen={showFeatureRequest}
        onClose={() => setShowFeatureRequest(false)}
        onSubmit={handleFeatureSubmit}
      />
    </div>
  );
}
