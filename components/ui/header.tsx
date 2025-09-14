"use client";

import Link from "next/link";
import Logo from "./logo";
import { config } from "@/lib/config";

export default function Header() {
  return (
    <header className="z-30 mt-2 w-full md:mt-5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-white/90 px-3 shadow-sm ring-1 ring-black/5 after:absolute after:inset-0 after:-z-10 after:backdrop-blur-xs">
          {/* Site branding */}
          <div className="flex flex-1 items-center">
            <div className="flex items-center gap-2">
              <Logo />
              <span className="font-semibold text-ink text-xl">{config.branding.name}</span>
            </div>
          </div>

          {/* Desktop sign in links */}
          <ul className="flex flex-1 items-center justify-end gap-3">
            {/* <li>
              <Link
                href="/signin"
                className="btn-sm relative bg-linear-to-b from-gray-100 to-gray-100/60 bg-[length:100%_100%] bg-[bottom] py-[5px] text-gray-700 hover:bg-[length:100%_150%]"
              >
                Sign In
              </Link>
            </li>
            <li>
              <Link
                href="/signup"
                className="btn-sm bg-linear-to-t from-brand-600 to-brand-500 bg-[length:100%_100%] bg-[bottom] py-[5px] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%]"
              >
                Register
              </Link>
            </li> */}
            <li>
              <Link
                href="/contact"
                className="btn-sm bg-linear-to-t from-brand-600 to-brand-500 bg-[length:100%_100%] bg-[bottom] py-[5px] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%]"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
