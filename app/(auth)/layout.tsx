"use client";

import PageIllustration from "@/components/page-illustration";
import AuthGuard from "@/components/auth/auth-guard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <main className="relative flex grow flex-col">
        <PageIllustration multiple />

        {children}
      </main>
    </AuthGuard>
  );
}
