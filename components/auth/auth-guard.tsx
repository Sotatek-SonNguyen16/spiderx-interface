"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/features/auth";
import { googleChatService } from "@/features/googleChat";

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

      // Nếu là trang public nhưng có token, verify và redirect nếu hợp lệ
      if (isPublicRoute && token) {
        try {
          const result = await authService.getMe();
          console.log("AuthGuard - Public route getMe result:", result);
          
          if (result.data && !result.error) {
            // Đã login, check integration status và redirect
            // Backend sẽ lấy userId từ JWT token trong Authorization header
            const integrationStatus = await googleChatService.fetchStatus();
            console.log("AuthGuard - Public route integration status:", integrationStatus);
            
            setIsLoading(false); // Cập nhật loading state trước khi redirect
            if (integrationStatus.data?.status === "connected") {
              router.push("/todos");
            } else {
              router.push("/integration");
            }
            return;
          }
        } catch (error) {
          console.error("AuthGuard - Public route error:", error);
          // Token không hợp lệ, cho phép ở lại trang public
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
        console.log("AuthGuard - getMe result:", result);
        
        if (result.error || !result.data) {
          // Token không hợp lệ, xóa và redirect
          console.error("AuthGuard - Token không hợp lệ:", result.error);
          localStorage.removeItem("auth_token");
          setIsAuthenticated(false);
          setIsLoading(false);
          router.push("/signin");
          return;
        }

        console.log("AuthGuard - User authenticated");

        // Token hợp lệ - check integration status nếu đang vào todos
        // Backend sẽ lấy userId từ JWT token trong Authorization header
        if (pathname === "/todos" || pathname?.startsWith("/todos")) {
          try {
            const integrationStatus = await googleChatService.fetchStatus();
            console.log("AuthGuard - Integration status:", integrationStatus);
            
            // Luôn cập nhật loading state sau khi fetch thành công
            setIsLoading(false);
            
            if (integrationStatus.data?.status !== "connected") {
              // Chưa integration, redirect đến integration page
              console.log("AuthGuard - Chưa integration, redirect đến /integration");
              setIsAuthenticated(true);
              router.push("/integration");
              return;
            }
          } catch (error) {
            console.error("AuthGuard - Error checking integration:", error);
            // Nếu có lỗi khi check integration, vẫn cho vào todos
            setIsLoading(false);
          }
        } else {
          // Không phải trang todos, không cần check integration
          setIsLoading(false);
        }

        // Token hợp lệ và đã integration (hoặc không phải trang todos)
        setIsAuthenticated(true);
      } catch (error) {
        // Lỗi khi verify token
        console.error("AuthGuard - Error:", error);
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

