"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import PlanCardV3, { PlanV3 } from "@/components/pricing/PlanCardV3";
import CompareResponsiveV3 from "@/components/pricing/CompareResponsiveV3";
import FAQV3 from "@/components/pricing/FAQV3";
import AddOnsV3 from "@/components/pricing/AddOnsV3";
import EnterpriseStripV3 from "@/components/pricing/EnterpriseStripV3";
import PricingStickyCTAV3 from "@/components/pricing/PricingStickyCTAV3";

const plans: PlanV3[] = [
  {
    id: "free",
    name: "Free",
    blurb: "Try SpiderX on one account",
    priceMonthly: 0,
    priceYearly: 0,
    cta: "Start free",
    features: [
      "1 integration",
      "1 workspace",
      "7-day history",
      "200 AI credits / mo",
      "Manual sync",
      "Queue review",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    blurb: "For multi-project professionals",
    priceMonthly: 12,
    priceYearly: 10,
    recommended: true,
    cta: "Get Pro",
    features: [
      "Up to 3 integrations",
      "3 workspaces",
      "90-day history",
      "2,000 AI credits / mo",
      "Auto-sync hourly",
      "Advanced filters",
    ],
  },
  {
    id: "team",
    name: "Team",
    blurb: "Shared context for teams",
    priceMonthly: 20,
    priceYearly: 16,
    cta: "Start Team",
    features: [
      "Up to 8 integrations",
      "Unlimited workspaces",
      "365-day history",
      "8,000 AI credits / mo",
      "Auto-sync 15 min",
      "Roles & permissions",
    ],
  },
];

function BillingToggle({
  yearly,
  onChange,
}: {
  yearly: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={yearly}
      onClick={() => onChange(!yearly)}
      className="relative inline-flex h-9 w-16 items-center rounded-full border border-border bg-surface shadow-s1 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-primarySoft"
    >
      <span
        className={`inline-block h-7 w-7 transform rounded-full bg-primary transition-transform duration-200 ${
          yearly ? "translate-x-8" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function PricingClientV3() {
  const [yearly, setYearly] = useState(true);

  const priceLabel = useMemo(
    () => (yearly ? "/user/mo (billed yearly)" : "/user/mo"),
    [yearly]
  );

  return (
    <div className="space-y-14">
      <section>
        <div className="max-w-2xl">
          <Image
            src="/logo.svg"
            alt=""
            width={32}
            height={32}
            className="mb-6 opacity-80"
          />
          <h1 className="font-heading text-4xl leading-[1.05] tracking-[-0.02em] md:text-6xl">
            Pricing that scales with your workflow.
          </h1>
          <p className="mt-4 text-base text-ink2 md:text-lg">
            Pay for what grows value: integrations, history, and AI extraction
            capacity. Keep everything calm by design.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`text-sm font-semibold ${
                !yearly ? "text-ink" : "text-ink3"
              }`}
            >
              Monthly
            </span>
            <BillingToggle yearly={yearly} onChange={setYearly} />
            <span
              className={`text-sm font-semibold ${
                yearly ? "text-ink" : "text-ink3"
              }`}
            >
              Yearly
            </span>
            <Badge variant="warning">Save 20%</Badge>
          </div>
          <div className="text-sm text-ink3">
            Cancel anytime • Upgrade in one click
          </div>
        </div>

        <section id="plans" className="mt-10">
          <div className="grid gap-5 md:grid-cols-3">
            {plans.map((p) => (
              <PlanCardV3
                key={p.id}
                plan={p}
                yearly={yearly}
                priceLabel={p.id === "free" ? "" : priceLabel}
              />
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-3 rounded-xl border border-border bg-surface p-6 shadow-s1 md:grid-cols-4">
          {[
            ["Works with your tools", "Gmail & Google Chat first"],
            ["AI extracts context", "Due dates, owners, priorities"],
            ["Queue prevents noise", "Accept or skip before todo"],
            ["Calm UX", "Modeless progress + recovery"],
          ].map(([t, b]) => (
            <div key={t}>
              <div className="text-sm font-semibold text-ink">{t}</div>
              <div className="mt-1 text-sm text-ink2">{b}</div>
            </div>
          ))}
        </div>
      </section>

      <CompareResponsiveV3 />
      <AddOnsV3 />
      <EnterpriseStripV3 />
      <FAQV3 />

      <PricingStickyCTAV3
        yearly={yearly}
        priceProMonthly={12}
        priceProYearly={10}
      />
    </div>
  );
}
