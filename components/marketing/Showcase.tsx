import { Badge } from "@/components/ui/badge";

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
