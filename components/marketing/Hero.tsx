import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HeroVisual from "./HeroVisual";

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

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <PaperTexture />
      <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-20">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <Image
              src="/logo.svg"
              alt=""
              width={24}
              height={24}
              className="opacity-80"
            />
            <Badge variant="ai">AI task capture</Badge>
            <span className="text-xs font-semibold text-ink3">
              Gmail & Google Chat first
            </span>
          </div>

          <h1 className="mt-6 font-heading text-4xl leading-[1.05] tracking-[-0.02em] text-ink md:text-6xl">
            Proof before promises.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink2 md:text-lg">
            Đây là landing, SpiderX hiện support Gmail & Google Chat trước. Điểm
            khác của mình là: Proof before promises – mình show luôn luồng
            capture → extract context → queue review.
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
            <span className="rounded-full border border-border bg-surface px-3 py-1">
              Gmail
            </span>
            <span className="rounded-full border border-border bg-surface px-3 py-1">
              Google Chat
            </span>
            <span className="rounded-full border border-border bg-surface px-3 py-1">
              Slack (soon)
            </span>
            <span className="rounded-full border border-border bg-surface px-3 py-1">
              WhatsApp (soon)
            </span>
          </div>
        </div>

        <div className="md:pl-6">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
