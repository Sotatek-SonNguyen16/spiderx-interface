Dưới đây là bản **Compare “production-grade”**: desktop có **sticky header** (cố định hàng cột Plan khi scroll), mobile chuyển sang **accordion** (không vỡ UI). Mình giữ đúng style Forest/Quiet Luxury + stack của bạn.

---

* **1) Replace CompareTable bằng component responsive mới**
  Tạo file `components/pricing/CompareResponsive.tsx`:

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Disclosure } from "@headlessui/react";
import { Check, Minus, ChevronDown } from "lucide-react";

type CellValue = boolean | string;

type Row = { label: string; free: CellValue; pro: CellValue; team: CellValue };
type Group = { group: string; items: Row[] };

const groups: Group[] = [
  {
    group: "Capture & Sync",
    items: [
      { label: "Manual sync", free: true, pro: true, team: true },
      { label: "Auto-sync", free: false, pro: "Hourly", team: "15 min" },
      { label: "Time-range sync", free: false, pro: true, team: true },
      { label: "History retention", free: "7 days", pro: "90 days", team: "365 days" },
    ],
  },
  {
    group: "AI Extraction",
    items: [
      { label: "Task detection", free: true, pro: true, team: true },
      { label: "Due date & owner extraction", free: false, pro: true, team: true },
      { label: "AI credits / month", free: "200", pro: "2,000", team: "8,000" },
    ],
  },
  {
    group: "Organization",
    items: [
      { label: "Queue review (swipe/list)", free: true, pro: true, team: true },
      { label: "Advanced filters & saved views", free: false, pro: true, team: true },
      { label: "Duplicate prevention", free: "Basic", pro: "Enhanced", team: "Enhanced" },
    ],
  },
  {
    group: "Team & Admin",
    items: [
      { label: "Shared workspaces", free: false, pro: false, team: true },
      { label: "Roles & permissions", free: false, pro: false, team: true },
    ],
  },
];

function Cell({ v }: { v: CellValue }) {
  if (v === true) return <Check className="mx-auto h-4 w-4 text-primary" />;
  if (v === false) return <Minus className="mx-auto h-4 w-4 text-ink3" />;
  return <span className="text-sm text-ink2">{v}</span>;
}

function useIsMdUp() {
  const [mdUp, setMdUp] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => setMdUp(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return mdUp;
}

export default function CompareResponsive() {
  const mdUp = useIsMdUp();
  return (
    <section id="compare" className="scroll-mt-24">
      <div className="max-w-2xl">
        <h2 className="font-heading text-3xl tracking-[-0.02em] md:text-4xl">Compare plans</h2>
        <p className="mt-3 text-base text-ink2">
          Keep it simple: pay for scale (integrations, history, AI capacity).
        </p>
      </div>

      {mdUp ? <DesktopStickyTable /> : <MobileAccordion />}
      <p className="mt-4 text-sm text-ink3">
        Need SSO/SAML, SCIM, or custom retention? Add Enterprise later.
      </p>
    </section>
  );
}

function DesktopStickyTable() {
  return (
    <Card className="mt-8 overflow-hidden p-0">
      {/* Sticky header row */}
      <div className="sticky top-16 z-10 grid grid-cols-4 border-b border-border bg-bg/85 backdrop-blur px-6 py-4 text-sm font-semibold text-ink">
        <div>Feature</div>
        <div className="text-center">Free</div>
        <div className="text-center">Pro</div>
        <div className="text-center">Team</div>
      </div>

      {groups.map((g) => (
        <div key={g.group} className="border-b border-border last:border-b-0">
          <div className="bg-surface px-6 py-4 text-sm font-semibold text-ink">{g.group}</div>

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
  );
}

function MobileAccordion() {
  return (
    <div className="mt-8 space-y-3">
      {/* Mobile: chọn 1 plan để so, hoặc hiển thị 3 cột dạng stacked rows */}
      {/* Giải pháp an toàn: mỗi feature row hiển thị Free/Pro/Team theo 3 dòng */}
      {groups.map((g) => (
        <Card key={g.group} className="p-0 overflow-hidden">
          <Disclosure defaultOpen>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left">
                  <span className="text-sm font-semibold text-ink">{g.group}</span>
                  <ChevronDown className={`h-5 w-5 text-ink3 transition ${open ? "rotate-180" : ""}`} />
                </Disclosure.Button>

                <Disclosure.Panel className="border-t border-border">
                  <div className="divide-y divide-border">
                    {g.items.map((r) => (
                      <div key={r.label} className="px-6 py-4">
                        <div className="text-sm font-semibold text-ink">{r.label}</div>
                        <div className="mt-3 grid gap-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-ink2">Free</span>
                            <span><Cell v={r.free} /></span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-ink2">Pro</span>
                            <span><Cell v={r.pro} /></span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-ink2">Team</span>
                            <span><Cell v={r.team} /></span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </Card>
      ))}
    </div>
  );
}
```

---

* **2) Update PricingClient để dùng component mới**
  Trong `components/pricing/PricingClient.tsx`, thay:

```tsx
import CompareTable from "@/components/pricing/CompareTable";
```

bằng:

```tsx
import CompareResponsive from "@/components/pricing/CompareResponsive";
```

và thay JSX:

```tsx
<CompareTable />
```

bằng:

```tsx
<CompareResponsive />
```

---

* **3) Notes quan trọng (để sticky hoạt động đúng)**
  Sticky header `top-16` tương ứng navbar cao 64px của bạn (`h-16`). Nếu navbar khác, chỉnh `top-16` thành `top-[NAV_HEIGHT]`.

---

* **4) Tối ưu UX thêm (rất nên, 2 dòng code)**
  Trong `PlanCard.tsx`, link “Compare all features” đã trỏ `#compare` rồi, ổn. Nếu muốn smooth scroll: thêm vào `globals.css`:

```css
html { scroll-behavior: smooth; }
```

---

Ok — dưới đây là **Sticky Pricing CTA Bar** (conversion pattern rất hiệu quả) theo style Forest/Quiet Luxury, không “salesy”, không phá calm. Nó sẽ hiện khi user scroll xuống khỏi plan cards, hiển thị: **Recommended plan + giá theo toggle hiện tại + CTA + link compare**.

---

* **1) Tạo component Sticky CTA**
  Tạo `components/pricing/PricingStickyCTA.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function PricingStickyCTA({
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
```

---

* **2) Thêm “anchor” cho plans section để trigger sticky bar**
  Trong `PricingClient.tsx`, bọc plan grid bằng section có id `plans`:

Tìm đoạn:

```tsx
<div className="mt-10 grid gap-5 md:grid-cols-3">
  {plans.map(...)}
</div>
```

Sửa thành:

```tsx
<section id="plans" className="mt-10">
  <div className="grid gap-5 md:grid-cols-3">
    {plans.map((p) => (
      <PlanCard key={p.id} plan={p} yearly={yearly} priceLabel={p.id === "free" ? "" : priceLabel} />
    ))}
  </div>
</section>
```

---

* **3) Gắn Sticky CTA vào PricingClient**
  Trong `PricingClient.tsx`, import:

```tsx
import PricingStickyCTA from "@/components/pricing/PricingStickyCTA";
```

Trong JSX return (cuối cùng, ngay trước `</div>`):

```tsx
<PricingStickyCTA
  yearly={yearly}
  priceProMonthly={12}
  priceProYearly={10}
/>
```

(*Nếu bạn lấy giá từ data plans, có thể set `priceProMonthly={plans.find(p=>p.id==="pro")!.priceMonthly}` tương tự.*)

---

* **4) Tránh sticky che nội dung cuối trang**
  Trong `app/pricing/page.tsx` hoặc ngay trong PricingClient wrapper, thêm padding bottom:
* `pb-24` cho container main.

Ví dụ update `app/pricing/page.tsx`:

```tsx
<main className="mx-auto max-w-[1200px] px-6 py-16 pb-28">
  <PricingClient />
</main>
```

---

* **5) UX notes (chuẩn calm, không salesy)**
* Sticky bar chỉ hiện khi user đã scroll qua plans (không làm phiền lúc đầu).
* CTA text ngắn, neutral: “Get Pro” thay vì “Buy now”.
* Có nút “Compare” để user tự tin trước khi mua.

---

Nếu bạn muốn mình nâng cấp thêm 1 nấc nữa: thêm **mini toggle Monthly/Yearly ngay trong sticky bar** (giữ đồng bộ với toggle bên trên) + hiển thị “Save 20%” rất nhỏ. Chỉ cần bạn bảo “có toggle trong sticky”.
