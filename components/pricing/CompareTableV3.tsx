import { Card } from "@/components/ui/card";
import { Check, Minus } from "lucide-react";

const rows = [
  { group: "Capture & Sync", items: [
    { label: "Manual sync", free: true, pro: true, team: true },
    { label: "Auto-sync", free: false, pro: "Hourly", team: "15 min" },
    { label: "Time-range sync", free: false, pro: true, team: true },
    { label: "History retention", free: "7 days", pro: "90 days", team: "365 days" },
  ]},
  { group: "AI Extraction", items: [
    { label: "Task detection", free: true, pro: true, team: true },
    { label: "Due date & owner extraction", free: false, pro: true, team: true },
    { label: "AI credits / month", free: "200", pro: "2,000", team: "8,000" },
  ]},
  { group: "Organization", items: [
    { label: "Queue review (swipe/list)", free: true, pro: true, team: true },
    { label: "Advanced filters & saved views", free: false, pro: true, team: true },
    { label: "Duplicate prevention", free: "Basic", pro: "Enhanced", team: "Enhanced" },
  ]},
  { group: "Team & Admin", items: [
    { label: "Shared workspaces", free: false, pro: false, team: true },
    { label: "Roles & permissions", free: false, pro: false, team: true },
  ]},
];

type CellValue = boolean | string;

function Cell({ v }: { v: CellValue }) {
  if (v === true) return <Check className="mx-auto h-4 w-4 text-primary" />;
  if (v === false) return <Minus className="mx-auto h-4 w-4 text-ink3" />;
  return <span className="text-sm text-ink2">{v}</span>;
}

export default function CompareTableV3() {
  return (
    <section id="compare" className="scroll-mt-24">
      <div className="max-w-2xl">
        <h2 className="font-heading text-3xl tracking-[-0.02em] md:text-4xl">Compare plans</h2>
        <p className="mt-3 text-base text-ink2">
          Keep it simple: pay for scale (integrations, history, AI capacity).
        </p>
      </div>

      <Card className="mt-8 overflow-hidden p-0">
        <div className="grid grid-cols-4 border-b border-border bg-surface2 px-6 py-4 text-sm font-semibold text-ink">
          <div>Feature</div>
          <div className="text-center">Free</div>
          <div className="text-center">Pro</div>
          <div className="text-center">Team</div>
        </div>

        {rows.map((g) => (
          <div key={g.group} className="border-b border-border last:border-b-0">
            <div className="bg-surface px-6 py-4 text-sm font-semibold text-ink">
              {g.group}
            </div>
            <div className="divide-y divide-border">
              {g.items.map((r) => (
                <div key={r.label} className="grid grid-cols-4 px-6 py-4">
                  <div className="text-sm text-ink2">{r.label}</div>
                  <div className="text-center"><Cell v={r.free} /></div>
                  <div className="text-center"><Cell v={r.pro} /></div>
                  <div className="text-center"><Cell v={r.team} /></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Card>

      <p className="mt-4 text-sm text-ink3">
        Need SSO/SAML, SCIM, or custom retention? Add Enterprise later.
      </p>
    </section>
  );
}
