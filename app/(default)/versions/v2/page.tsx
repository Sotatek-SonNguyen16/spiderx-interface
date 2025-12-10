"use client";

import { useState } from 'react';
import {
  VersionBadge,
  Navigation,
  HeroSection,
  ProblemStatement,
  DemoSection,
  IntegrationSection,
  RoadmapSection,
  CTASection,
  Footer,
  EmailModal,
  FeatureRequestModal,
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* <VersionBadge version="v2" /> */}
      {/* <Navigation /> */}
      <HeroSection onEmailSubmit={handleEmailSubmit} />
      <ProblemStatement />
      <DemoSection />
      <IntegrationSection onRequestIntegrationAction={() => setShowFeatureRequest(true)} />
      <RoadmapSection onRequestFeature={() => setShowFeatureRequest(true)} />
      <CTASection onEmailSubmit={handleEmailSubmit} />
      <Footer />

      <EmailModal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} showConfetti={showEmailConfetti} />
      <FeatureRequestModal
        isOpen={showFeatureRequest}
        onClose={() => setShowFeatureRequest(false)}
        onSubmit={handleFeatureSubmit}
      />
    </div>
  );
}
