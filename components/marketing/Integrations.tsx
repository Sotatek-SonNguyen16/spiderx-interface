"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plug, Mail, MessageSquare } from "lucide-react";

const live = [
  {
    icon: <Mail className="h-5 w-5 text-primary" />,
    name: "Gmail",
    note: "Capture tasks from emails",
  },
  {
    icon: <MessageSquare className="h-5 w-5 text-primary" />,
    name: "Google Chat",
    note: "Turn chats into todos",
  },
];

const soon = [
  {
    icon: <MessageSquare className="h-5 w-5 text-ink2" />,
    name: "Slack",
    note: "Coming soon",
  },
  {
    icon: <MessageSquare className="h-5 w-5 text-ink2" />,
    name: "WhatsApp",
    note: "Coming soon",
  },
  {
    icon: <MessageSquare className="h-5 w-5 text-ink2" />,
    name: "Notion",
    note: "Coming soon",
  },
  {
    icon: <MessageSquare className="h-5 w-5 text-ink2" />,
    name: "Google Calendar",
    note: "Coming soon",
  },
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
          {status === "live" ? (
            <Badge variant="success">Live</Badge>
          ) : (
            <Badge>Soon</Badge>
          )}
        </div>
        <div className="mt-1 text-sm text-ink2">{note}</div>
      </div>
    </div>
  );
}

function IntegrationsGallery() {
  return (
    <div className="mt-12 flex flex-wrap justify-center gap-4 overflow-hidden py-4 opacity-70 grayscale transition-all hover:grayscale-0 hover:opacity-100">
      {/* Crop 1: Inbox snippet */}
      <div className="h-24 w-32 shrink-0 overflow-hidden rounded-xl border border-border bg-surface">
        <Image
          src="/images/cover.png"
          alt=""
          width={400}
          height={300}
          className="object-cover"
        />
      </div>
      {/* Logo: Gmail */}
      <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-xl border border-border bg-surface">
        <Image
          src="/images/Gmail.png"
          alt="Gmail"
          width={40}
          height={40}
          className="p-2"
        />
        <span className="mt-1 text-[10px] uppercase tracking-widest text-ink3">
          Gmail
        </span>
      </div>
      {/* Texture: Mood */}
      <div className="h-24 w-32 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-dark/5 flex items-center justify-center">
        <div className="text-[10px] text-ink3 uppercase tracking-widest">
          Quiet Luxury
        </div>
      </div>
      {/* Logo: Google Chat */}
      <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-xl border border-border bg-surface">
        <Image
          src="/images/Google-Chat.png"
          alt="Google Chat"
          width={40}
          height={40}
          className="p-2"
        />
        <span className="mt-1 text-[10px] uppercase tracking-widest text-ink3">
          Chat
        </span>
      </div>
      {/* Crop 2: Queue snippet */}
      <div className="h-24 w-32 shrink-0 overflow-hidden rounded-xl border border-border bg-surface">
        <Image
          src="/images/cover.png"
          alt=""
          width={400}
          height={300}
          className="object-bottom object-cover"
        />
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
              <span className="text-xs font-semibold text-ink3">
                Normalize tasks across tools
              </span>
            </div>
            <h2 className="mt-4 font-heading text-3xl tracking-[-0.02em] md:text-4xl">
              Connect every platform—keep one calm workflow.
            </h2>
            <p className="mt-3 text-base text-ink2">
              SpiderX extracts tasks from where work happens, then standardizes
              them into Queue for review before they become todos.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-ink2">
            <Plug className="h-4 w-4 text-primary" />
            <span>More sources rolling out</span>
          </div>
        </div>

        <IntegrationsGallery />

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <Card className="p-6">
            <div className="text-sm font-semibold text-ink">Available now</div>
            <div className="mt-4 grid gap-3">
              {live.map((x) => (
                <IntegrationTile key={x.name} {...x} status="live" />
              ))}
            </div>
            <p className="mt-4 text-xs text-ink3">
              OAuth connectors are coming; current access uses permissions you
              grant.
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
              We prioritize platforms that create the most "lost tasks" across
              teams.
            </p>
          </Card>
        </div>

        {/* The "why it matters" strip */}
        <div className="mt-8 grid gap-3 rounded-xl border border-border bg-surface p-6 shadow-s1 md:grid-cols-3">
          {[
            ["Less copying", "No more manual transfer between tools."],
            ["More context", "Deadlines and owners stay attached to tasks."],
            [
              "Cleaner execution",
              "Queue blocks noise from entering your list.",
            ],
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
