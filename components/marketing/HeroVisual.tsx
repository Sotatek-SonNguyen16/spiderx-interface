"use client";

import Image from "next/image";

function Callout({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={[
        "pointer-events-none absolute rounded-xl border border-border bg-bg/90 px-3 py-2 text-xs text-ink shadow-[0_10px_30px_rgba(0,0,0,0.10)] backdrop-blur",
        className,
      ].join(" ")}
    >
      <span className="inline-flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-primary/80" />
        {label}
      </span>
    </div>
  );
}

export default function HeroVisual() {
  return (
    <div className="relative">
      {/* Mood texture layer (no asset required) */}
      <div
        aria-hidden
        className="absolute -inset-6 rounded-[28px] opacity-70"
        style={{
          background:
            "radial-gradient(60% 60% at 20% 10%, rgba(31,61,45,0.10) 0%, rgba(31,61,45,0.00) 60%), radial-gradient(50% 50% at 80% 70%, rgba(124,58,237,0.08) 0%, rgba(124,58,237,0.00) 60%)",
        }}
      />
      <div
        aria-hidden
        className="absolute -inset-6 rounded-[28px] opacity-[0.10] mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.7) 0.6px, transparent 0.6px)",
          backgroundSize: "14px 14px",
        }}
      />

      {/* Main frame */}
      <div className="relative overflow-hidden rounded-[24px] border border-border bg-surface shadow-[0_30px_80px_rgba(0,0,0,0.12)]">
        {/* “Window chrome” */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink/10" />
          <span className="ml-3 text-xs text-ink3">Inbox → Queue</span>
        </div>

        <div className="relative p-4 md:p-6">
          <div className="relative overflow-hidden rounded-[18px] border border-border bg-bg">
            <Image
              src="/images/cover.png"
              alt="SpiderX — captured tasks in Queue"
              width={1400}
              height={900}
              priority
              className="h-auto w-full"
            />
          </div>

          {/* Callouts (desktop/tablet) */}
          <Callout
            label="Detected from email"
            className="hidden sm:block left-8 top-12"
          />
          <Callout
            label="Extracted deadline"
            className="hidden sm:block right-10 top-28"
          />
          <Callout
            label="Ready for Queue review"
            className="hidden sm:block left-12 bottom-14"
          />

          {/* Art stamp (optional): Placeholder until image is generated or added */}
          <div className="absolute -right-6 -bottom-7 hidden md:block">
            <div className="rounded-[20px] border border-border bg-bg/90 p-2 shadow-[0_16px_40px_rgba(0,0,0,0.10)] backdrop-blur">
              <div className="relative h-[92px] w-[92px] overflow-hidden rounded-[16px] bg-surface-dark/5 flex items-center justify-center">
                {/* Empty state for stamp */}
                <div className="text-[10px] text-ink3 uppercase tracking-widest px-2 text-center">
                  SpiderX Art
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-friendly callouts (below image, no overlay) */}
      <div className="mt-4 flex flex-wrap gap-2 sm:hidden">
        {["Detected from email", "Extracted deadline", "Queue review"].map(
          (t) => (
            <div
              key={t}
              className="rounded-full border border-border bg-bg px-3 py-1 text-xs text-ink2"
            >
              {t}
            </div>
          )
        )}
      </div>
    </div>
  );
}
