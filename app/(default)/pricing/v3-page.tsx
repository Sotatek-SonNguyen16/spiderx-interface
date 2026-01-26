"use client";

import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import PricingClientV3 from "@/components/pricing/PricingClientV3";

export default function PricingPageV3() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <Navbar />
      <main className="mx-auto max-w-[1200px] px-6 py-16 pb-28">
        <PricingClientV3 />
      </main>
      <Footer />
    </div>
  );
}
