"use client";

import AuthGuard from "@/components/auth/auth-guard";
import HeaderAuth from "@/components/ui/header-auth";

import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-primary">
        {/* Header Section with Image Background */}
        <div className="relative pb-32">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <Image
              src="/images/cover.jpg"
              alt="Background"
              fill
              className="object-cover opacity-60"
              priority
            />
            {/* Museum-core overlay for better integration with Forest Green */}
            <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/0 via-primary/20 to-primary" />
          </div>
          <div className="relative z-10">
            <HeaderAuth />
          </div>
        </div>

        {/* Main Content Card */}
        <main className="-mt-24 px-4 sm:px-6 lg:px-8 z-20 relative pb-20">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-bg shadow-2xl border border-white/10">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
