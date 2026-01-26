"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Settings, Bell, Plus, LogOut, ListTodo } from "lucide-react";
import { useLogout } from "@/hooks/use-logout";

export default function HeaderAuth() {
  const { logout } = useLogout();

  return (
    <header className="z-30 w-full bg-primary text-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo & Search */}
          <div className="flex items-center gap-8">
            {/* Logo - Click to navigate to Todos */}
            <Link href="/todos" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-surface/20 backdrop-blur-sm">
                <Image
                  src="/logo.svg"
                  alt="SpiderX"
                  width={20}
                  height={20}
                  className="brightness-0 invert"
                />
              </div>
            </Link>

            {/* Search */}
            <div className="relative hidden md:block">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-surface/80" />
              </div>
              <input
                type="text"
                className="block w-full rounded-md border-0 bg-surface/20 py-1.5 pl-10 pr-3 text-surface placeholder:text-surface/70 focus:ring-2 focus:ring-surface/50 sm:text-sm sm:leading-6 min-w-[300px]"
                placeholder="Search..."
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/integration"
              className="hidden items-center gap-2 rounded-md bg-surface px-3 py-1.5 text-sm font-medium text-primary hover:bg-surface2 transition-colors duration-200 md:flex"
            >
              <Plus className="h-4 w-4" />
              Platform connection
            </Link>

            <Link
              href="/todos"
              className="rounded-full p-1.5 text-surface/80 hover:bg-surface/10 hover:text-surface transition-colors duration-200"
              title="Todos"
            >
              <ListTodo className="h-5 w-5" />
            </Link>

            <button className="rounded-full p-1.5 text-surface/80 hover:bg-surface/10 hover:text-surface transition-colors duration-200">
              <Settings className="h-5 w-5" />
            </button>

            <button className="rounded-full p-1.5 text-surface/80 hover:bg-surface/10 hover:text-surface transition-colors duration-200">
              <Bell className="h-5 w-5" />
            </button>

            {/* User Avatar */}
            <button className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-surface/20">
              <Image
                src="/images/testimonial-01.jpg" // Placeholder avatar
                alt="User"
                fill
                className="object-cover"
              />
            </button>

            <button
              onClick={logout}
              className="rounded-full p-1.5 text-surface/80 hover:bg-surface/10 hover:text-surface transition-colors duration-200"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
