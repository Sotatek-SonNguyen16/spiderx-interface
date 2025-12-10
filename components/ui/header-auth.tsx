"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Settings, Bell, Plus } from "lucide-react";

export default function HeaderAuth() {
  return (
    <header className="z-30 w-full text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo & Search */}
          <div className="flex items-center gap-8">
            {/* Logo - Click to navigate to Todos */}
            <Link href="/todos" className="flex items-center gap-2">
               <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
               </div>
            </Link>

            {/* Search */}
            <div className="relative hidden md:block">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-white/60" />
              </div>
              <input
                type="text"
                className="block w-full rounded-md border-0 bg-white/10 py-1.5 pl-10 pr-3 text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/50 sm:text-sm sm:leading-6 min-w-[300px]"
                placeholder="Search..."
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            <Link href="/integration" className="hidden items-center gap-2 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-[#5D5FEF] hover:bg-gray-50 md:flex">
              <Plus className="h-4 w-4" />
              Platform connection
            </Link>

            <button className="rounded-full p-1.5 text-white/80 hover:bg-white/10 hover:text-white">
              <Settings className="h-5 w-5" />
            </button>

            <button className="rounded-full p-1.5 text-white/80 hover:bg-white/10 hover:text-white">
              <Bell className="h-5 w-5" />
            </button>

            {/* User Avatar */}
            <button className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white/20">
              <Image
                src="/images/testimonial-01.jpg" // Placeholder avatar
                alt="User"
                fill
                className="object-cover"
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
