"use client";

import Link from "next/link";
import Logo from "./logo";
import { config } from "@/lib/config";

export default function Header() {
  return (
    <header className="z-30 mt-2 w-full md:mt-5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-xl bg-surface/90 px-3 shadow-s1 ring-1 ring-ink/5 after:absolute after:inset-0 after:-z-10 after:backdrop-blur-xs">
          {/* Site branding */}
          <div className="flex flex-1 items-center">
            <Link href="/" className="flex items-center gap-2">
              <Logo />
              <span className="font-semibold text-ink text-xl">
                {config.branding.name}
              </span>
            </Link>
          </div>

          {/* Navigation + CTA + Auth links */}
          <ul className="flex flex-1 items-center justify-end gap-3">
            {/* Pricing Link */}
            <li>
              <Link
                href="/pricing"
                className="text-sm font-medium text-ink2 hover:text-primary transition-colors duration-200"
              >
                Pricing
              </Link>
            </li>
            
            {/* CTA Button - Get Started */}
            <li>
              <Link
                href="/signin"
                className="btn-sm bg-primary py-[5px] text-surface shadow-s1 hover:bg-primaryHover transition-colors duration-200"
              >
                Start here
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
