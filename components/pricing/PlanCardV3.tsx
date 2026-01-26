import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export type PlanV3 = {
  id: string;
  name: string;
  blurb: string;
  priceMonthly: number;
  priceYearly: number;
  cta: string;
  recommended?: boolean;
  features: string[];
};

export default function PlanCardV3({
  plan,
  yearly,
  priceLabel,
}: {
  plan: PlanV3;
  yearly: boolean;
  priceLabel: string;
}) {
  const price = yearly ? plan.priceYearly : plan.priceMonthly;

  return (
    <Card className={`p-6 ${plan.recommended ? "border-2 border-primary shadow-s2" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-ink">{plan.name}</div>
          <div className="mt-1 text-sm text-ink2">{plan.blurb}</div>
        </div>
        {plan.recommended ? <Badge variant="success">Recommended</Badge> : null}
      </div>

      <div className="mt-6">
        <div className="flex items-end gap-2">
          <div className="text-4xl font-semibold text-ink">
            {plan.id === "free" ? "$0" : `$${price}`}
          </div>
          {plan.id !== "free" ? <div className="pb-1 text-sm text-ink3">{priceLabel}</div> : null}
        </div>
        <div className="mt-1 text-sm text-ink3">
          {plan.id === "free" ? "Free during early access" : yearly ? "Billed yearly" : "Billed monthly"}
        </div>
      </div>

      <div className="mt-6">
        <Link href="/signin">
          <Button variant={plan.recommended ? "primary" : "secondary"} className="w-full">
            {plan.cta}
          </Button>
        </Link>
      </div>

      <ul className="mt-6 space-y-3">
        {plan.features.slice(0, 6).map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-ink2">
            <Check className="mt-0.5 h-4 w-4 text-primary" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {plan.features.length > 6 ? (
        <div className="mt-4 text-sm font-semibold text-primary hover:underline">
          <Link href="#compare">Compare all features</Link>
        </div>
      ) : null}
    </Card>
  );
}
