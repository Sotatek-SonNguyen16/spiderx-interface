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
      <div className="min-h-screen bg-gray-50">
        {/* Header Section with Image Background */}
        <div className="relative pb-32">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/cover.jpg"
              alt="Background"
              fill
              className="object-cover"
              priority
            />
            {/* Optional overlay for better text visibility if needed */}
            <div className="absolute inset-0 bg-black/10" />
          </div>
          <div className="relative z-10">
            <HeaderAuth />
          </div>
        </div>

        {/* Main Content Card */}
        <main className="-mt-24 px-4 pb-12 sm:px-6 lg:px-8 z-[99] relative">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-white shadow-xl">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
