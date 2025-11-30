"use client";

import AuthGuard from "@/components/auth/auth-guard";
import HeaderAuth from "@/components/ui/header-auth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Blue Header Section */}
        <div className="bg-[#5D5FEF] pb-32">
          <HeaderAuth />
        </div>

        {/* Main Content Card */}
        <main className="-mt-24 px-4 pb-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-white shadow-xl">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
