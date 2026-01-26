import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-bg">
      {/* Subtle Watermark Logo */}
      <div className="pointer-events-none absolute -bottom-10 -left-10 opacity-[0.03]">
        <Image src="/logo.svg" alt="" width={300} height={300} />
      </div>

      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Image src="/logo.svg" alt="SpiderX" width={24} height={24} />
              <div className="text-sm font-semibold text-ink">SpiderX</div>
            </div>
            <div className="mt-2 text-sm text-ink2">
              Calm task capture across your work tools.
            </div>
          </div>
          <div className="flex items-center gap-8 text-sm font-semibold text-ink2">
            <Link href="/pricing" className="transition-colors hover:text-ink">
              Pricing
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-ink">
              Privacy
            </Link>
            <Link href="/tos" className="transition-colors hover:text-ink">
              Terms
            </Link>
          </div>
        </div>
        <div className="mt-12 flex items-center justify-between border-t border-border/50 pt-8 text-xs text-ink3">
          <div>© {new Date().getFullYear()} SpiderX. All rights reserved.</div>
          <div className="uppercase tracking-[0.2em]">Quiet Luxury</div>
        </div>
      </div>
    </footer>
  );
}
