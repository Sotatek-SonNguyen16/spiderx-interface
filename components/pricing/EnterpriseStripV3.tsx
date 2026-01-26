import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, KeyRound, FileLock2, Headset } from "lucide-react";

const items = [
  { icon: <KeyRound className="h-4 w-4 text-primary" />, label: "SSO/SAML + SCIM" },
  { icon: <FileLock2 className="h-4 w-4 text-primary" />, label: "Custom retention + DPA" },
  { icon: <ShieldCheck className="h-4 w-4 text-primary" />, label: "Security review support" },
  { icon: <Headset className="h-4 w-4 text-primary" />, label: "Dedicated support + SLA" },
];

export default function EnterpriseStripV3() {
  return (
    <section>
      <Card className="p-8 md:p-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="success">Enterprise</Badge>
              <span className="text-sm font-semibold text-ink3">For compliance & large teams</span>
            </div>
            <h3 className="mt-4 font-heading text-3xl tracking-[-0.02em] md:text-4xl">
              Calm task capture—at enterprise scale.
            </h3>
            <p className="mt-3 text-base text-ink2">
              Add SSO, lifecycle management, custom retention, and dedicated support while keeping the same workflow:
              capture → AI → Queue → todo.
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {items.map((x) => (
                <div key={x.label} className="flex items-center gap-2 text-sm text-ink2">
                  {x.icon}
                  <span>{x.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="shrink-0 md:w-[280px]">
            <div className="rounded-xl border border-border bg-surface2 p-5">
              <div className="text-sm font-semibold text-ink">Custom pricing</div>
              <div className="mt-1 text-sm text-ink2">Based on seats, sources, and retention requirements.</div>
              <div className="mt-5 flex flex-col gap-3">
                <Link href="/contact">
                  <Button className="w-full">Contact sales</Button>
                </Link>
                <Link href="/pricing#compare">
                  <Button variant="secondary" className="w-full">Compare plans</Button>
                </Link>
              </div>
              <div className="mt-3 text-xs text-ink3">Response within 24–48 hours.</div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
