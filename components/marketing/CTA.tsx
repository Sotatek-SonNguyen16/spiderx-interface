import Link from "next/link";
import { Button } from "@/components/ui/button";

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
