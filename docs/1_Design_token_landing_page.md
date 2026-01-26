Ok — mình làm luôn **(1) Add-ons + Enterprise strip cho Pricing** và **(2) Integrations section cho Landing** theo đúng style **Forest / Quiet Luxury** và stack của bạn. Bạn chỉ cần copy các file + thêm vài dòng vào page là chạy.

---

## 1) Pricing: Add-ons + Enterprise strip

### A) `components/pricing/AddOns.tsx`

```tsx
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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

export default function AddOns() {
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
```

### B) `components/pricing/EnterpriseStrip.tsx`

```tsx
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, KeyRound, FileLock2, Headset } from "lucide-react";

const items = [
  { icon: <KeyRound className="h-4 w-4 text-primary" />, label: "SSO/SAML + SCIM" },
  { icon: <FileLock2 className="h-4 w-4 text-primary" />, label: "Custom retention + DPA" },
  { icon: <ShieldCheck className="h-4 w-4 text-primary" />, label: "Security review support" },
  { icon: <Headset className="h-4 w-4 text-primary" />, label: "Dedicated support + SLA" },
];

export default function EnterpriseStrip() {
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
```

### C) Gắn vào PricingClient (update `components/pricing/PricingClient.tsx`)

Thêm import:

```tsx
import AddOns from "@/components/pricing/AddOns";
import EnterpriseStrip from "@/components/pricing/EnterpriseStrip";
```

Và thêm vào cuối `return` (sau CompareTable, trước FAQ hoặc sau FAQ đều được):

```tsx
      <CompareTable />
      <AddOns />
      <EnterpriseStrip />
      <FAQ />
```

---

## 2) Landing: Integrations section (show “multi-platform” trực quan)

### A) `components/marketing/Integrations.tsx`

```tsx
"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Plug, Mail, MessageSquare, Slack, MessagesSquare, FileText, Calendar } from "lucide-react";

const live = [
  { icon: <Mail className="h-5 w-5 text-primary" />, name: "Gmail", note: "Capture tasks from emails" },
  { icon: <MessageSquare className="h-5 w-5 text-primary" />, name: "Google Chat", note: "Turn chats into todos" },
];

const soon = [
  { icon: <Slack className="h-5 w-5 text-ink2" />, name: "Slack", note: "Coming soon" },
  { icon: <MessagesSquare className="h-5 w-5 text-ink2" />, name: "WhatsApp", note: "Coming soon" },
  { icon: <FileText className="h-5 w-5 text-ink2" />, name: "Notion", note: "Coming soon" },
  { icon: <Calendar className="h-5 w-5 text-ink2" />, name: "Google Calendar", note: "Coming soon" },
];

function IntegrationTile({
  icon,
  name,
  note,
  status,
}: {
  icon: React.ReactNode;
  name: string;
  note: string;
  status: "live" | "soon";
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4 shadow-s1">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface2">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold text-ink">{name}</div>
          {status === "live" ? <Badge variant="success">Live</Badge> : <Badge>Soon</Badge>}
        </div>
        <div className="mt-1 text-sm text-ink2">{note}</div>
      </div>
    </div>
  );
}

export default function Integrations() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="ai">AI-based integrations</Badge>
              <span className="text-xs font-semibold text-ink3">Normalize tasks across tools</span>
            </div>
            <h2 className="mt-4 font-heading text-3xl tracking-[-0.02em] md:text-4xl">
              Connect every platform—keep one calm workflow.
            </h2>
            <p className="mt-3 text-base text-ink2">
              SpiderX extracts tasks from where work happens, then standardizes them into Queue for review before they become todos.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-ink2">
            <Plug className="h-4 w-4 text-primary" />
            <span>More sources rolling out</span>
          </div>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <Card className="p-6">
            <div className="text-sm font-semibold text-ink">Available now</div>
            <div className="mt-4 grid gap-3">
              {live.map((x) => (
                <IntegrationTile key={x.name} {...x} status="live" />
              ))}
            </div>
            <p className="mt-4 text-xs text-ink3">
              OAuth connectors are coming; current access uses permissions you grant.
            </p>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-semibold text-ink">Coming soon</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {soon.map((x) => (
                <IntegrationTile key={x.name} {...x} status="soon" />
              ))}
            </div>
            <p className="mt-4 text-xs text-ink3">
              We prioritize platforms that create the most “lost tasks” across teams.
            </p>
          </Card>
        </div>

        {/* The “why it matters” strip */}
        <div className="mt-8 grid gap-3 rounded-xl border border-border bg-surface p-6 shadow-s1 md:grid-cols-3">
          {[
            ["Less copying", "No more manual transfer between tools."],
            ["More context", "Deadlines and owners stay attached to tasks."],
            ["Cleaner execution", "Queue blocks noise from entering your list."],
          ].map(([t, b]) => (
            <div key={t}>
              <div className="text-sm font-semibold text-ink">{t}</div>
              <div className="mt-1 text-sm text-ink2">{b}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### B) Gắn vào Landing (update `app/page.tsx`)

Thêm import + render giữa Showcase và Pain (đúng flow: proof → integrations → pain/value):

```tsx
import Integrations from "@/components/marketing/Integrations";
...
<Hero />
<Showcase />
<Integrations />
<Pain />
<CTA />
```

---

## 3) (Optional) AOS motion nhẹ cho marketing (bạn đã có `aos`)

Nếu muốn “có motion nhưng vẫn calm”, thêm provider init 1 lần.

### `components/marketing/AOSProvider.tsx`

```tsx
"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AOSProvider() {
  useEffect(() => {
    AOS.init({
      duration: 280,
      easing: "ease-out",
      once: true,
      offset: 60,
    });
  }, []);
  return null;
}
```

Gắn vào landing/pricing layout (ví dụ trong `app/layout.tsx` hoặc `app/page.tsx`):

```tsx
import AOSProvider from "@/components/marketing/AOSProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AOSProvider />
        {children}
      </body>
    </html>
  );
}
```

Rồi thêm `data-aos="fade-up"` vào các Card/section bạn muốn (Hero/Showcase/PlanCard).

---

Nếu bạn muốn, bước tiếp theo mình làm ngay: **Pricing “sticky compare header” + mobile accordion compare** (vì table dài trên mobile dễ fail), vẫn giữ style museum-core.
