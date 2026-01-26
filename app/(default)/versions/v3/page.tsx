"use client";

import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import Hero from "@/components/marketing/Hero";
import Showcase from "@/components/marketing/Showcase";
import Integrations from "@/components/marketing/Integrations";
import Pain from "@/components/marketing/Pain";
import CTA from "@/components/marketing/CTA";

export default function HomeV3() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <Navbar />
      <main>
        <Hero />
        <Showcase />
        <Integrations />
        <Pain />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
