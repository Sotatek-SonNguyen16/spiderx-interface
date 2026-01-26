"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PricingStickyCTAV3({
  yearly,
  priceProMonthly,
  priceProYearly,
  triggerId = "plans",
}: {
  yearly: boolean;
  priceProMonthly: number;
  priceProYearly: number;
  triggerId?: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = document.getElementById(triggerId);
    if (!el) return;

    // show bar when plans section is NOT visible
    const io = new IntersectionObserver(
      (entries) => setShow(!entries[0].isIntersecting),
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [triggerId]);

  const price = yearly ? priceProYearly : priceProMonthly;
  const label = yearly ? "billed yearly" : "billed monthly";

  const text = useMemo(
    () => `Pro · $${price}/user/mo · ${label}`,
    [price, label]
  );

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-200 ease-out ${
        show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <div className="mx-auto max-w-[1200px] px-4 pb-4">
        <div className="rounded-xl border border-border bg-bg/85 backdrop-blur shadow-s2">
          <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Badge variant="success">Recommended</Badge>
                <div className="text-sm font-semibold text-ink">{text}</div>
              </div>
              <div className="mt-1 text-xs text-ink3">
                Best for multi-project professionals. Upgrade anytime.
              </div>
            </div>

            <div className="flex items-center gap-2 sm:shrink-0">
              <Link href="#compare" className="hidden sm:block">
                <Button variant="secondary" className="px-4 py-2 text-sm">
                  Compare
                </Button>
              </Link>
              <Link href="/signin">
                <Button className="px-5 py-2.5 text-sm">Get Pro</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* safe area for iOS */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  );
}
