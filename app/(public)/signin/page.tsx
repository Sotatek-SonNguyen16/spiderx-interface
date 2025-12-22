"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authService } from "@/features/auth";
import { googleChatService } from "@/features/googleChat/services/googleChat.service";
import { apiClient } from "@/lib/api";
import { Eye, EyeOff } from "lucide-react";
import Logo from "@/components/ui/logo";

export default function SignIn() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if users already logged in
    const token = apiClient.getAuthToken();
    if (token) {
      router.push("/todos");
      return;
    }

    const rememberedUsername = localStorage.getItem("remembered_username");
    if (rememberedUsername) {
      setUsername(rememberedUsername);
      setRememberMe(true);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await authService.login({ username, password });

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Kiểm tra response structure
      const token = result.data?.access_token;
      if (!token) {
        console.error("Login response:", result);
        setError("Không nhận được access token từ server");
        setLoading(false);
        return;
      }

      console.log(
        "✅ Login thành công, token:",
        token.substring(0, 20) + "..."
      );

      // Save/Remove remembered username based on checkbox
      if (rememberMe) {
        localStorage.setItem("remembered_username", username);
      } else {
        localStorage.removeItem("remembered_username");
      }

      // Set token with remember flag
      apiClient.setAuthToken(token, rememberMe);

      // Check Google Chat integration status
      console.log("🔍 Checking Google Chat integration status...");
      const integrationResult = await googleChatService.fetchStatus();

      if (integrationResult.data?.status === "connected") {
        // Already integrated - go to todos
        console.log("✅ Google Chat đã kết nối, redirect đến /todos");
        window.location.href = "/todos";
      } else {
        // Not integrated - go to integration page
        console.log("⚠️ Google Chat chưa kết nối, redirect đến /integration");
        window.location.href = "/integration";
      }
    } catch (err: any) {
      setError(err.message || "Đăng nhập thất bại");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Panel - Image & Branding (Giữ nguyên ảnh gốc) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-50 text-white p-12 flex-col justify-between">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/login-thumb.png"
            alt="Background"
            fill
            className="object-fill"
            priority
            sizes="(max-width: 1024px) 0vw, 50vw"
          />
        </div>

        <div className="relative z-10">
          <div className="mb-6">
            <Logo />
          </div>
          <h1 className="text-4xl font-bold leading-tight max-w-md mb-4">
            Capture tasks from email & chat, automatically
          </h1>
          <p className="text-lg text-white/90 max-w-md">
            Connect Gmail, Google Chat, and Slack to never miss a task again
          </p>
        </div>

        {/* Trust Badge */}
        <div className="relative z-10 flex items-center gap-2 text-sm text-white/80">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Secure sign-in with encryption</span>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-gray-50 px-6 py-12 lg:px-12">
        <div className="w-full max-w-[440px]">
          {/* Card Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            {/* Header */}
            <div className="mb-8 text-center lg:text-left">
              <div className="flex items-center gap-2 mb-6 justify-center lg:justify-start">
                <Logo />
                <span className="text-xl font-bold text-gray-900">SpiderX</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back
              </h2>
              <p className="text-sm text-gray-600">
                Sign in to SpiderX to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 flex items-start gap-2">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label
                  className="mb-2 block text-sm font-medium text-gray-700"
                  htmlFor="username"
                >
                  Work email
                </label>
                <input
                  id="username"
                  type="text"
                  className="form-input w-full rounded-xl border-gray-300 px-4 py-3 text-sm focus:border-brand-500 focus:ring-brand-500 transition-colors"
                  placeholder="name@company.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="password"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="form-input w-full rounded-xl border-gray-300 px-4 py-3 text-sm focus:border-brand-500 focus:ring-brand-500 pr-11 transition-colors"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-600"
                >
                  Keep me signed in <span className="text-gray-400">(on this device)</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !username || !password}
                className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white 
                         hover:bg-brand-700 active:bg-brand-800
                         focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 
                         disabled:opacity-50 disabled:cursor-not-allowed 
                         transition-all duration-200 shadow-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Log in"
                )}
              </button>

              {/* Trust Message */}
              <p className="text-xs text-center text-gray-500">
                Secure sign-in. We never post without permission.
              </p>
            </form>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link 
              className="font-semibold text-brand-600 hover:text-brand-700 transition-colors hover:underline" 
              href="/signup"
            >
              Create an account
            </Link>
          </div>

          {/* Footer Links */}
          <div className="mt-8 flex items-center justify-center gap-4 text-xs text-gray-500">
            <Link href="/privacy" className="hover:text-gray-700 transition-colors">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-gray-700 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
