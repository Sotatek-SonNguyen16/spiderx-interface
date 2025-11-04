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

export default function HomeV2() {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showEmailConfetti, setShowEmailConfetti] = useState(false);
  const [showFeatureRequest, setShowFeatureRequest] = useState(false);

  const handleEmailSubmit = (email: string) => {
    setShowEmailConfetti(true);
    setShowEmailModal(true);
    setTimeout(() => {
      setShowEmailConfetti(false);
    }, 3000);
  };

  const handleFeatureSubmit = (description: string, priority: string) => {
    // Handle feature submission logic here
    console.log('Feature request:', { description, priority });
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
