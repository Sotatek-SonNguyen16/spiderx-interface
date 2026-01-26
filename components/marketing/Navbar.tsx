import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="SpiderX" width={32} height={32} />
          <span className="text-sm font-semibold tracking-wide text-ink">
            SpiderX
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/pricing"
            className="text-sm font-semibold text-ink2 hover:text-ink"
          >
            Pricing
          </Link>
          <Link
            href="/integrations"
            className="text-sm font-semibold text-ink2 hover:text-ink"
          >
            Integrations
          </Link>
          <Link
            href="/signin"
            className="text-sm font-semibold text-ink2 hover:text-ink"
          >
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
