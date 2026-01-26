Dưới đây là **starter kit Landing + Pricing** theo đúng style bạn chọn (**Quiet Luxury / Editorial Minimalism / Forest primary**) và đúng stack của bạn (**Next 15 + Tailwind v4 + HeadlessUI + lucide**). Mình viết dạng **file-by-file** để bạn copy vào repo là chạy.

---

## 0) Folder gợi ý

```txt
app/
  page.tsx
  pricing/page.tsx
components/
  marketing/
    Navbar.tsx
    Footer.tsx
    Hero.tsx
    Showcase.tsx
    Pain.tsx
    CTA.tsx
  pricing/
    PricingClient.tsx
    PlanCard.tsx
    CompareTable.tsx
    FAQ.tsx
src/
  ui/recipes.ts
  lib/cn.ts
  styles/tokens.css
```

---

## 1) Landing page (app/page.tsx)

```tsx
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import Hero from "@/components/marketing/Hero";
import Showcase from "@/components/marketing/Showcase";
import Pain from "@/components/marketing/Pain";
import CTA from "@/components/marketing/CTA";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <Navbar />
      <main>
        <Hero />
        <Showcase />
        <Pain />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
```

---

## 2) Navbar + Footer (components/marketing/Navbar.tsx, Footer.tsx)

### Navbar.tsx

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md border border-border bg-surface shadow-s1" />
          <span className="text-sm font-semibold tracking-wide text-ink">SpiderX</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/pricing" className="text-sm font-semibold text-ink2 hover:text-ink">
            Pricing
          </Link>
          <Link href="/integrations" className="text-sm font-semibold text-ink2 hover:text-ink">
            Integrations
          </Link>
          <Link href="/signin" className="text-sm font-semibold text-ink2 hover:text-ink">
            Sign in
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/pricing" className="hidden md:block">
            <Button variant="secondary">View plans</Button>
          </Link>
          <Link href="/signin">
            <Button>Get early access</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
```

### Footer.tsx

```tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-[1200px] px-6 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-semibold text-ink">SpiderX</div>
            <div className="mt-1 text-sm text-ink2">
              Calm task capture across your work tools.
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm font-semibold text-ink2">
            <Link href="/pricing" className="hover:text-ink">Pricing</Link>
            <Link href="/privacy" className="hover:text-ink">Privacy</Link>
            <Link href="/tos" className="hover:text-ink">Terms</Link>
          </div>
        </div>
        <div className="mt-8 text-xs text-ink3">© {new Date().getFullYear()} SpiderX</div>
      </div>
    </footer>
  );
}
```

---

## 3) Hero (components/marketing/Hero.tsx) — đúng “editorial + calm”

```tsx
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

function PaperTexture() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.035]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 20%, #000 1px, transparent 1px), radial-gradient(circle at 80% 60%, #000 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    />
  );
}

function ProductMock() {
  return (
    <div className="relative rounded-xl border border-border bg-surface shadow-s2">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="h-2.5 w-2.5 rounded-full bg-surface2" />
        <div className="h-2.5 w-2.5 rounded-full bg-surface2" />
        <div className="h-2.5 w-2.5 rounded-full bg-surface2" />
        <div className="ml-2 text-xs font-semibold text-ink2">Inbox → Queue</div>
      </div>

      <div className="grid gap-3 p-4">
        <div className="rounded-lg border border-border bg-surface2 p-3">
          <div className="text-xs font-semibold text-ink3">From Gmail</div>
          <div className="mt-1 text-sm font-semibold text-ink">
            “Can you prepare the sprint report by tomorrow?”
          </div>
        </div>

        <div className="relative rounded-lg border border-border bg-surface p-3 shadow-s1">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-ink">Prepare sprint report</div>
            <Badge variant="ai">AI</Badge>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-ink3">
            <span className="rounded-full border border-border bg-surface2 px-2 py-1">Due: Tomorrow</span>
            <span className="rounded-full border border-border bg-surface2 px-2 py-1">Priority: High</span>
            <span className="rounded-full border border-border bg-surface2 px-2 py-1">Project: Growth</span>
          </div>

          {/* tiny callouts */}
          <div className="pointer-events-none absolute -right-3 top-4 hidden md:block">
            <div className="rounded-full border border-border bg-aiSoft px-3 py-1 text-xs font-semibold text-ai shadow-s1">
              Extracted deadline
            </div>
          </div>
          <div className="pointer-events-none absolute -left-3 bottom-4 hidden md:block">
            <div className="rounded-full border border-border bg-primarySoft px-3 py-1 text-xs font-semibold text-primary shadow-s1">
              Ready for Queue review
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <PaperTexture />
      <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-20">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="ai">AI task capture</Badge>
            <span className="text-xs font-semibold text-ink3">Gmail & Google Chat first</span>
          </div>

          <h1 className="mt-6 font-heading text-4xl leading-[1.05] tracking-[-0.02em] text-ink md:text-6xl">
            Capture tasks from email & chat — automatically.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink2 md:text-lg">
            SpiderX turns scattered messages into structured todos, then lets you review them in Queue
            before they hit your task list.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/signin">
              <Button className="w-full sm:w-auto">Get early access</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="secondary" className="w-full sm:w-auto">
                View pricing
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-sm text-ink3">
            Calm by design. Cancel anytime. No credit card for Free.
          </p>

          <div className="mt-10 flex flex-wrap gap-3 text-xs font-semibold text-ink2">
            <span className="rounded-full border border-border bg-surface px-3 py-1">Gmail</span>
            <span className="rounded-full border border-border bg-surface px-3 py-1">Google Chat</span>
            <span className="rounded-full border border-border bg-surface px-3 py-1">Slack (soon)</span>
            <span className="rounded-full border border-border bg-surface px-3 py-1">WhatsApp (soon)</span>
          </div>
        </div>

        <div className="md:pl-6">
          <ProductMock />
        </div>
      </div>
    </section>
  );
}
```

---

## 4) Showcase (components/marketing/Showcase.tsx) — “annotated nhưng không rối”

```tsx
import { Badge } from "@/components/ui/Badge";

function Callout({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-s1">
      <div className="flex items-start gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface2 text-xs font-semibold text-ink2">
          {n}
        </div>
        <div>
          <div className="text-sm font-semibold text-ink">{title}</div>
          <div className="mt-1 text-sm text-ink2">{body}</div>
        </div>
      </div>
    </div>
  );
}

function ShowcaseMock() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-surface shadow-s2">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-ink">Queue</div>
          <Badge variant="ai">AI generated</Badge>
        </div>
        <div className="mt-1 text-xs text-ink3">Review tasks before they enter your todo list</div>
      </div>

      <div className="p-5">
        <div className="space-y-3">
          {[
            { t: "Follow up vendor contract", m: "From Google Chat · Due Fri" },
            { t: "Prepare sprint report", m: "From Gmail · Due Tomorrow" },
            { t: "Schedule onboarding call", m: "From Gmail · Next week" },
          ].map((x) => (
            <div key={x.t} className="rounded-lg border border-border bg-surface2 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-ink">{x.t}</div>
                <div className="text-xs text-ink3">Swipe →</div>
              </div>
              <div className="mt-2 text-xs text-ink3">{x.m}</div>
            </div>
          ))}
        </div>
      </div>

      {/* subtle watermark */}
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-primarySoft opacity-60 blur-2xl" />
    </div>
  );
}

export default function Showcase() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="max-w-2xl">
          <h2 className="font-heading text-3xl tracking-[-0.02em] text-ink md:text-4xl">
            Proof before promises.
          </h2>
          <p className="mt-3 text-base text-ink2">
            You should understand SpiderX in seconds: capture → extract context → review in Queue → do.
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <ShowcaseMock />

          <div className="space-y-4">
            <Callout n="1" title="Detect tasks from messages" body="Finds actionable items in email & chat without manual copying." />
            <Callout n="2" title="Extracts context" body="Pulls due dates, owners, and intent—so tasks are usable immediately." />
            <Callout n="3" title="Queue review prevents noise" body="Swipe to accept or skip before tasks enter your real list." />
            <Callout n="4" title="Organized by project" body="Keeps tasks grouped so multi-project work stays calm." />
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## 5) Pain + CTA (components/marketing/Pain.tsx, CTA.tsx)

### Pain.tsx

```tsx
import { Card } from "@/components/ui/Card";

const items = [
  { title: "Tasks are scattered", body: "Emails, chats, docs… the real work is spread everywhere." },
  { title: "Important work gets buried", body: "Non-urgent but critical tasks slip through over time." },
  { title: "No consistent structure", body: "Even when you capture tasks, they’re missing context and ownership." },
];

export default function Pain() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <h2 className="font-heading text-3xl tracking-[-0.02em] text-ink md:text-4xl">
          Built for multi-context work.
        </h2>
        <p className="mt-3 max-w-2xl text-base text-ink2">
          SpiderX is designed for people who juggle multiple projects—without turning task management into a second job.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((x) => (
            <Card key={x.title} className="p-6">
              <div className="text-lg font-semibold text-ink">{x.title}</div>
              <div className="mt-2 text-sm leading-relaxed text-ink2">{x.body}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### CTA.tsx

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function CTA() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="rounded-xl border border-border bg-surface p-10 shadow-s2">
          <h3 className="font-heading text-3xl tracking-[-0.02em] text-ink md:text-4xl">
            Start calm. Upgrade when it fits.
          </h3>
          <p className="mt-3 max-w-2xl text-base text-ink2">
            Capture tasks from messages, review in Queue, and keep projects organized—without the overhead.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/signin">
              <Button className="w-full sm:w-auto">Get early access</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="secondary" className="w-full sm:w-auto">View plans</Button>
            </Link>
          </div>

          <div className="mt-4 text-sm text-ink3">
            No credit card for Free • Cancel anytime • Your data stays yours
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

# Pricing page

## 6) Pricing page route (app/pricing/page.tsx)

```tsx
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import PricingClient from "@/components/pricing/PricingClient";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <Navbar />
      <main className="mx-auto max-w-[1200px] px-6 py-16">
        <PricingClient />
      </main>
      <Footer />
    </div>
  );
}
```

---

## 7) PricingClient + Toggle (HeadlessUI Switch) (components/pricing/PricingClient.tsx)

```tsx
"use client";

import { useMemo, useState } from "react";
import { Switch } from "@headlessui/react";
import { Badge } from "@/components/ui/Badge";
import PlanCard, { Plan } from "@/components/pricing/PlanCard";
import CompareTable from "@/components/pricing/CompareTable";
import FAQ from "@/components/pricing/FAQ";

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    blurb: "Try SpiderX on one account",
    priceMonthly: 0,
    priceYearly: 0,
    cta: "Start free",
    features: ["1 integration", "1 workspace", "7-day history", "200 AI credits / mo", "Manual sync", "Queue review"],
  },
  {
    id: "pro",
    name: "Pro",
    blurb: "For multi-project professionals",
    priceMonthly: 12,
    priceYearly: 10,
    recommended: true,
    cta: "Get Pro",
    features: ["Up to 3 integrations", "3 workspaces", "90-day history", "2,000 AI credits / mo", "Auto-sync hourly", "Advanced filters"],
  },
  {
    id: "team",
    name: "Team",
    blurb: "Shared context for teams",
    priceMonthly: 20,
    priceYearly: 16,
    cta: "Start Team",
    features: ["Up to 8 integrations", "Unlimited workspaces", "365-day history", "8,000 AI credits / mo", "Auto-sync 15 min", "Roles & permissions"],
  },
];

export default function PricingClient() {
  const [yearly, setYearly] = useState(true);

  const priceLabel = useMemo(() => (yearly ? "/user/mo (billed yearly)" : "/user/mo"), [yearly]);

  return (
    <div className="space-y-14">
      <section>
        <div className="max-w-2xl">
          <h1 className="font-heading text-4xl leading-[1.05] tracking-[-0.02em] md:text-6xl">
            Pricing that scales with your workflow.
          </h1>
          <p className="mt-4 text-base text-ink2 md:text-lg">
            Pay for what grows value: integrations, history, and AI extraction capacity. Keep everything calm by design.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className={`text-sm font-semibold ${!yearly ? "text-ink" : "text-ink3"}`}>Monthly</span>
            <Switch
              checked={yearly}
              onChange={setYearly}
              className={`relative inline-flex h-9 w-16 items-center rounded-full border border-border bg-surface shadow-s1 transition`}
            >
              <span
                className={`inline-block h-7 w-7 transform rounded-full bg-primary transition ${
                  yearly ? "translate-x-8" : "translate-x-1"
                }`}
              />
            </Switch>
            <span className={`text-sm font-semibold ${yearly ? "text-ink" : "text-ink3"}`}>Yearly</span>
            <Badge variant="warning">Save 20%</Badge>
          </div>
          <div className="text-sm text-ink3">Cancel anytime • Upgrade in one click</div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {plans.map((p) => (
            <PlanCard key={p.id} plan={p} yearly={yearly} priceLabel={p.id === "free" ? "" : priceLabel} />
          ))}
        </div>

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

      <CompareTable />
      <FAQ />
    </div>
  );
}
```

---

## 8) PlanCard (components/pricing/PlanCard.tsx)

```tsx
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Check } from "lucide-react";

export type Plan = {
  id: string;
  name: string;
  blurb: string;
  priceMonthly: number;
  priceYearly: number;
  cta: string;
  recommended?: boolean;
  features: string[];
};

export default function PlanCard({
  plan,
  yearly,
  priceLabel,
}: {
  plan: Plan;
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
```

---

## 9) CompareTable (components/pricing/CompareTable.tsx) — gọn + đúng SaaS

```tsx
import { Card } from "@/components/ui/Card";
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

function Cell({ v }: { v: any }) {
  if (v === true) return <Check className="mx-auto h-4 w-4 text-primary" />;
  if (v === false) return <Minus className="mx-auto h-4 w-4 text-ink3" />;
  return <span className="text-sm text-ink2">{v}</span>;
}

export default function CompareTable() {
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
```

---

## 10) FAQ (components/pricing/FAQ.tsx) — HeadlessUI Accordion style

```tsx
"use client";

import { Disclosure } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/Card";

const faqs = [
  { q: "What is an AI credit?", a: "1 credit covers a single task extraction or update from a message. Credits reset monthly." },
  { q: "Will SpiderX create duplicates?", a: "Pro+ includes enhanced duplicate prevention, and Queue review lets you accept or skip before tasks enter your list." },
  { q: "Can I cancel anytime?", a: "Yes. Cancel anytime. Your existing tasks remain accessible based on your plan’s history retention." },
  { q: "Does SpiderX post messages for me?", a: "No. SpiderX only reads and extracts tasks from connected sources. It never posts without your explicit action." },
];

export default function FAQ() {
  return (
    <section>
      <div className="max-w-2xl">
        <h2 className="font-heading text-3xl tracking-[-0.02em] md:text-4xl">FAQ</h2>
        <p className="mt-3 text-base text-ink2">Short answers, no surprises.</p>
      </div>

      <Card className="mt-8 p-0 overflow-hidden">
        <div className="divide-y divide-border">
          {faqs.map((x) => (
            <Disclosure key={x.q}>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left">
                    <span className="text-sm font-semibold text-ink">{x.q}</span>
                    <ChevronDown className={`h-5 w-5 text-ink3 transition ${open ? "rotate-180" : ""}`} />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-6 pb-5 text-sm text-ink2">
                    {x.a}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      </Card>
    </section>
  );
}
```

---

## Bước tiếp theo mình làm luôn cho bạn

Nếu bạn đồng ý, mình sẽ tiếp tục **2 phần còn lại** để landing/pricing “hoàn chỉnh kiểu SaaS production”:

1. **Pricing Enterprise strip + Add-ons** (extra AI credits / extra integrations / extended retention) đúng tone museum-core, không bán hàng lố.
2. **Integrations section** trên landing theo style bạn thích (grid + “coming soon” + normalize explanation) + motion nhẹ (AOS) nhưng không phá calm.

Bạn muốn làm tiếp phần nào trước: **(1) Add-ons/Enterprise** hay **(2) Integrations landing**?
