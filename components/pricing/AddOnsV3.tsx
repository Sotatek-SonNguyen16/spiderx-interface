import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Plug, History } from "lucide-react";

type AddOn = {
  icon: React.ReactNode;
  title: string;
  desc: string;
  price: string;
  tag?: "ai" | "default";
};

const addons: AddOn[] = [
  {
    icon: <Sparkles className="h-5 w-5 text-ai" />,
    title: "Extra AI credits",
    desc: "Increase monthly extraction capacity for high-volume workflows.",
    price: "$5 / +1,000 credits",
    tag: "ai",
  },
  {
    icon: <Plug className="h-5 w-5 text-primary" />,
    title: "Additional integrations",
    desc: "Connect more sources as your toolset grows.",
    price: "$3 / integration",
  },
  {
    icon: <History className="h-5 w-5 text-primary" />,
    title: "Extended history retention",
    desc: "Keep more context available for audits and long-running projects.",
    price: "$8 / +365 days",
  },
];

export default function AddOnsV3() {
  return (
    <section>
      <div className="max-w-2xl">
        <h2 className="font-heading text-3xl tracking-[-0.02em] md:text-4xl">Add-ons</h2>
        <p className="mt-3 text-base text-ink2">
          Keep plans simple. Add scale only when you need it.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {addons.map((a) => (
          <Card key={a.title} className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface2">
                  {a.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink">{a.title}</div>
                  <div className="mt-1 text-sm text-ink2">{a.desc}</div>
                </div>
              </div>
              {a.tag === "ai" ? <Badge variant="ai">AI</Badge> : null}
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-ink">{a.price}</div>
              <Button variant="secondary" className="px-4 py-2 text-sm">
                Add
              </Button>
            </div>

            <p className="mt-3 text-xs text-ink3">
              Add-ons can be applied anytime. Limits and billing update immediately.
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
