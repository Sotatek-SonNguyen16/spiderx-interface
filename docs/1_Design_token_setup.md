Chuẩn stack của bạn (Next 15 + React 19 + Tailwind v4 + HeadlessUI + lucide) thì mình gói design system kiểu **“recipes + component primitives”** (không thêm dependency mới) là hợp nhất. Dưới đây là bộ file bạn copy vào repo là chạy được ngay theo **Hướng B (Forest primary / Museum-core)**.

## 1) Tokens CSS (Tailwind v4 friendly)

Tạo `src/styles/tokens.css`:

```css
:root{
  --bg:#F7F3EA;
  --surface:#FFFDFA;
  --surface2:#F2EEE6;
  --border:#E7E1D7;

  --ink:#14171F;
  --ink2:#4B5563;
  --ink3:#7B8794;

  --primary:#1F3A2E;
  --primaryHover:#173025;
  --primaryPressed:#102219;
  --primarySoft:#E3EFE8;

  --ai:#6D5BD0;
  --aiSoft:#EEEAFE;

  --success:#1E7A4C;
  --successSoft:#E7F4ED;
  --warning:#B45309;
  --warningSoft:#FEF3C7;
  --danger:#B42318;
  --dangerSoft:#FEE4E2;

  --shadow1:0 8px 20px rgba(20,23,31,.06);
  --shadow2:0 12px 28px rgba(20,23,31,.08);

  --rSm:10px;
  --rMd:14px;
  --rLg:18px;
  --rXl:24px;
}
```

Trong `app/globals.css` (hoặc `src/app/globals.css`) import:

```css
@import "../styles/tokens.css";
@import "tailwindcss";

html, body { background: var(--bg); color: var(--ink); }
```

## 2) Tailwind v4 theme mapping (để dùng class kiểu `bg-bg`, `text-ink`…)

Tạo `tailwind.config.ts` (nếu bạn đã có thì merge phần extend):

```ts
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        surface2: "var(--surface2)",
        border: "var(--border)",
        ink: "var(--ink)",
        ink2: "var(--ink2)",
        ink3: "var(--ink3)",

        primary: "var(--primary)",
        primaryHover: "var(--primaryHover)",
        primaryPressed: "var(--primaryPressed)",
        primarySoft: "var(--primarySoft)",

        ai: "var(--ai)",
        aiSoft: "var(--aiSoft)",

        success: "var(--success)",
        successSoft: "var(--successSoft)",
        warning: "var(--warning)",
        warningSoft: "var(--warningSoft)",
        danger: "var(--danger)",
        dangerSoft: "var(--dangerSoft)",
      },
      borderRadius: {
        sm: "var(--rSm)",
        md: "var(--rMd)",
        lg: "var(--rLg)",
        xl: "var(--rXl)",
      },
      boxShadow: {
        s1: "var(--shadow1)",
        s2: "var(--shadow2)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
} satisfies Config;
```

## 3) `cn()` helper (không cần clsx)

Tạo `src/lib/cn.ts`:

```ts
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
```

## 4) Recipes (class presets) – 1 nguồn sự thật

Tạo `src/ui/recipes.ts`:

```ts
export const recipes = {
  focusRing:
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primarySoft",

  button: {
    base:
      "inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition-colors duration-200",
    primary:
      "bg-primary text-surface shadow-s1 hover:bg-primaryHover active:bg-primaryPressed disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
      "bg-surface text-primary border border-border hover:bg-surface2 active:bg-surface2 disabled:opacity-50 disabled:cursor-not-allowed",
    ghost:
      "px-3 py-2 text-primary hover:bg-primarySoft",
    destructive:
      "bg-danger text-surface shadow-s1 hover:opacity-95 active:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed",
  },

  card: {
    base: "bg-surface border border-border rounded-lg shadow-s1",
    clickable:
      "bg-surface border border-border rounded-lg shadow-s1 hover:shadow-s2 hover:-translate-y-[1px] transition-all duration-200",
    padSm: "p-4",
    padMd: "p-5",
    padLg: "p-6",
    recommended: "border-2 border-primary shadow-s2",
  },

  input: {
    base:
      "w-full rounded-md bg-surface border border-border px-4 py-3 text-sm text-ink placeholder:text-ink3 focus:border-primary focus:ring-4 focus:ring-primarySoft focus:outline-none transition duration-150",
    error:
      "border-danger focus:border-danger focus:ring-4 focus:ring-dangerSoft",
    label: "text-sm font-semibold text-ink",
    helper: "mt-1 text-xs text-ink3",
    errorText: "mt-1 text-xs font-semibold text-danger",
  },

  badge: {
    base:
      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border border-border",
    default: "bg-surface2 text-ink2",
    ai: "bg-aiSoft text-ai",
    success: "bg-successSoft text-success",
    warning: "bg-warningSoft text-warning",
    danger: "bg-dangerSoft text-danger",
  },

  toast: {
    base:
      "flex items-start gap-3 rounded-lg border border-border bg-surface shadow-s2 p-4",
    title: "text-sm font-semibold text-ink",
    body: "mt-0.5 text-sm text-ink2",
  },

  progress: {
    track:
      "w-full h-2 rounded-full bg-surface2 overflow-hidden border border-border",
    fillPrimary: "h-full bg-primary transition-[width] duration-200",
    fillAI: "h-full bg-ai transition-[width] duration-200",
    step: "text-sm text-ink2",
    meta: "text-xs text-ink3",
  },

  chip: {
    container:
      "fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full border border-border bg-surface shadow-s2 px-4 py-3",
    title: "text-sm font-semibold text-ink",
    meta: "text-xs text-ink3",
    iconBtn:
      "inline-flex h-8 w-8 items-center justify-center rounded-full text-ink2 hover:bg-surface2",
  },
} as const;
```

## 5) Button / Card / Badge / Input components

### `src/components/ui/Button.tsx`

```tsx
import * as React from "react";
import { cn } from "@/lib/cn";
import { recipes } from "@/ui/recipes";

type Variant = "primary" | "secondary" | "ghost" | "destructive";

export function Button({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const v =
    variant === "primary"
      ? recipes.button.primary
      : variant === "secondary"
      ? recipes.button.secondary
      : variant === "ghost"
      ? recipes.button.ghost
      : recipes.button.destructive;

  return (
    <button
      className={cn(recipes.button.base, recipes.focusRing, v, className)}
      {...props}
    />
  );
}
```

### `src/components/ui/Card.tsx`

```tsx
import * as React from "react";
import { cn } from "@/lib/cn";
import { recipes } from "@/ui/recipes";

export function Card({
  className,
  clickable,
  pad = "md",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { clickable?: boolean; pad?: "sm" | "md" | "lg" }) {
  const padCls = pad === "sm" ? recipes.card.padSm : pad === "lg" ? recipes.card.padLg : recipes.card.padMd;
  return (
    <div
      className={cn(
        clickable ? recipes.card.clickable : recipes.card.base,
        padCls,
        className
      )}
      {...props}
    />
  );
}
```

### `src/components/ui/Badge.tsx`

```tsx
import * as React from "react";
import { cn } from "@/lib/cn";
import { recipes } from "@/ui/recipes";

type Variant = "default" | "ai" | "success" | "warning" | "danger";

export function Badge({
  variant = "default",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  const v =
    variant === "ai"
      ? recipes.badge.ai
      : variant === "success"
      ? recipes.badge.success
      : variant === "warning"
      ? recipes.badge.warning
      : variant === "danger"
      ? recipes.badge.danger
      : recipes.badge.default;

  return <span className={cn(recipes.badge.base, v, className)} {...props} />;
}
```

### `src/components/ui/Input.tsx`

```tsx
import * as React from "react";
import { cn } from "@/lib/cn";
import { recipes } from "@/ui/recipes";

export function Field({
  label,
  helper,
  error,
  children,
}: {
  label: string;
  helper?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className={recipes.input.label}>{label}</label>
      {children}
      {error ? (
        <div className={recipes.input.errorText}>{error}</div>
      ) : helper ? (
        <div className={recipes.input.helper}>{helper}</div>
      ) : null}
    </div>
  );
}

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }
>(function Input({ className, hasError, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(recipes.input.base, hasError && recipes.input.error, className)}
      {...props}
    />
  );
});
```

## 6) Drawer (HeadlessUI Dialog) – dùng cho Sync/AI details

`src/components/ui/Drawer.tsx`

```tsx
"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { cn } from "@/lib/cn";
import { recipes } from "@/ui/recipes";
import { X } from "lucide-react";

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  widthClass = "w-[420px] max-w-[90vw]",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  widthClass?: string;
}) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-ink/20 backdrop-blur-[2px]" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 flex justify-end">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="ease-in duration-150"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel
                className={cn(
                  "h-full bg-surface border-l border-border shadow-s2 rounded-l-xl",
                  widthClass
                )}
              >
                <div className="flex items-start justify-between gap-4 p-6 border-b border-border">
                  <div>
                    <Dialog.Title className="text-lg font-semibold text-ink">
                      {title}
                    </Dialog.Title>
                    {subtitle ? (
                      <p className="mt-1 text-sm text-ink2">{subtitle}</p>
                    ) : null}
                  </div>
                  <button
                    onClick={onClose}
                    className={cn(recipes.chip.iconBtn, recipes.focusRing)}
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-6 space-y-5">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
```

## 7) ProgressChip + ProgressUI (đúng flow “chip nhỏ + drawer chi tiết”)

`src/components/ui/ProgressChip.tsx`

```tsx
"use client";

import { cn } from "@/lib/cn";
import { recipes } from "@/ui/recipes";
import { X, ChevronRight } from "lucide-react";
import { Button } from "./Button";

export function ProgressChip({
  title,
  meta,
  onView,
  onDismiss,
}: {
  title: string;
  meta?: string;
  onView: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className={recipes.chip.container}>
      <div className="min-w-0">
        <div className={recipes.chip.title}>{title}</div>
        {meta ? <div className={recipes.chip.meta}>{meta}</div> : null}
      </div>
      <Button variant="ghost" onClick={onView} className="px-3 py-2">
        View <ChevronRight className="h-4 w-4" />
      </Button>
      <button
        onClick={onDismiss}
        className={cn(recipes.chip.iconBtn, recipes.focusRing)}
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
```

`src/components/ui/ProgressBlock.tsx`

```tsx
import { recipes } from "@/ui/recipes";

export function ProgressBlock({
  percent,
  stepText,
  meta,
  mode = "sync",
}: {
  percent: number; // 0..100
  stepText: string;
  meta?: string;
  mode?: "sync" | "ai";
}) {
  const fillCls = mode === "ai" ? recipes.progress.fillAI : recipes.progress.fillPrimary;
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className={recipes.progress.step}>{stepText}</div>
        <div className={recipes.progress.meta}>{percent}%</div>
      </div>
      <div className={recipes.progress.track}>
        <div className={fillCls} style={{ width: `${Math.max(0, Math.min(100, percent))}%` }} />
      </div>
      {meta ? <div className={recipes.progress.meta}>{meta}</div> : null}
    </div>
  );
}
```

## 8) Ví dụ dùng cho “Syncing / AI generating” (để bạn thấy đúng UX)

```tsx
"use client";

import { useState } from "react";
import { ProgressChip } from "@/components/ui/ProgressChip";
import { Drawer } from "@/components/ui/Drawer";
import { ProgressBlock } from "@/components/ui/ProgressBlock";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function SyncUXDemo() {
  const [open, setOpen] = useState(false);
  const [showChip, setShowChip] = useState(true);

  const percent = 10;

  return (
    <>
      {showChip && (
        <ProgressChip
          title={`Syncing · Step 1/4 · ${percent}%`}
          meta="Scanning Google Chat & Gmail"
          onView={() => setOpen(true)}
          onDismiss={() => setShowChip(false)} // chỉ ẩn chip, không stop sync
        />
      )}

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Syncing messages…"
        subtitle="Google Chat & Gmail"
      >
        <Badge variant="ai">AI-assisted sync</Badge>
        <ProgressBlock
          percent={percent}
          stepText="Step 1 of 4: Scanning messages"
          meta="This may take a few minutes. You can keep working."
          mode="sync"
        />
        <div className="pt-2">
          <Button variant="secondary">Stop sync</Button>
          <p className="mt-2 text-xs text-ink3">
            Already created tasks will be kept. You can review or delete them later.
          </p>
        </div>
      </Drawer>
    </>
  );
}
```

Nếu bạn muốn mình “đóng gói chuẩn design system” hơn nữa: mình sẽ viết thêm 2 component quan trọng cho SpiderX theo style này: **(1) QueueSwipeCard (stack-ready)** và **(2) PricingPlanCard (recommended + compare rows)**, dùng đúng recipes phía trên để bạn làm landing/pricing/app đồng bộ 100%.
