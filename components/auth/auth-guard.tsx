"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/features/auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

// Danh sách các route public (không cần authentication)
const PUBLIC_ROUTES = ["/signin", "/signup", "/", "/reset-password"];

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const isPublicRoute = pathname && PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

      // Kiểm tra token trong localStorage
      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

      // Nếu là trang public và không có token, cho phép truy cập
      if (isPublicRoute && !token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Nếu là trang public nhưng có token, verify và redirect đến todos nếu hợp lệ (vừa login xong)
      // CHỈ redirect khi đang ở trang public (signin/signup), KHÔNG redirect khi đang ở các trang khác
      if (isPublicRoute && token && (pathname === "/signin" || pathname === "/signup")) {
        try {
          const result = await authService.getMe();
          
          if (result.data && !result.error) {
            // Token hợp lệ - đã login, redirect đến todos (chỉ khi đang ở signin/signup)
            setIsLoading(false);
            router.push("/todos");
            return;
          }
        } catch (error) {
          // Token không hợp lệ, xóa và cho phép ở lại trang public
          localStorage.removeItem("auth_token");
        }
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Nếu không phải trang public và không có token, redirect đến signin
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        router.push("/signin");
        return;
      }

      // Verify token bằng cách gọi API getMe
      try {
        const result = await authService.getMe();
        
        if (result.error || !result.data) {
          // Token không hợp lệ, xóa và redirect đến signin
          localStorage.removeItem("auth_token");
          setIsAuthenticated(false);
          setIsLoading(false);
          router.push("/signin");
          return;
        }

        // Token hợp lệ, cho phép truy cập (KHÔNG redirect)
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        // Lỗi khi verify token, xóa và redirect đến signin
        localStorage.removeItem("auth_token");
        setIsAuthenticated(false);
        setIsLoading(false);
        router.push("/signin");
      }
    };

    checkAuth();
  }, [router, pathname]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-600 border-r-transparent"></div>
          <p className="text-gray-600">Đang kiểm tra xác thực...</p>
        </div>
      </div>
    );
  }

  // Nếu là trang public, luôn render children
  const isPublicRoute = pathname && PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Nếu chưa authenticated và không phải trang public, không render children
  if (!isAuthenticated) {
    return null;
  }

  // Đã authenticated, render children
  return <>{children}</>;
}

