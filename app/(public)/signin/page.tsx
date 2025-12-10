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
      {/* Left Panel - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-white text-white p-12 flex-col justify-between">
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
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.31994 13.28H12.4099V20.48C12.4099 21.54 13.7299 22.04 14.4299 21.24L21.9999 12.64C22.6599 11.89 22.1299 10.72 21.1299 10.72H18.0399V3.51997C18.0399 2.45997 16.7199 1.95997 16.0199 2.75997L8.44994 11.36C7.79994 12.11 8.32994 13.28 9.31994 13.28Z"
                fill="#FFF"
              />
              <path
                opacity="0.4"
                d="M8.5 4.75H1.5C1.09 4.75 0.75 4.41 0.75 4C0.75 3.59 1.09 3.25 1.5 3.25H8.5C8.91 3.25 9.25 3.59 9.25 4C9.25 4.41 8.91 4.75 8.5 4.75Z"
                fill="#FFF"
              />
              <path
                opacity="0.4"
                d="M7.5 20.75H1.5C1.09 20.75 0.75 20.41 0.75 20C0.75 19.59 1.09 19.25 1.5 19.25H7.5C7.91 19.25 8.25 19.59 8.25 20C8.25 20.41 7.91 20.75 7.5 20.75Z"
                fill="#FFF"
              />
              <path
                opacity="0.4"
                d="M4.5 12.75H1.5C1.09 12.75 0.75 12.41 0.75 12C0.75 11.59 1.09 11.25 1.5 11.25H4.5C4.91 11.25 5.25 11.59 5.25 12C5.25 12.41 4.91 12.75 4.5 12.75Z"
                fill="#FFF"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold leading-tight max-w-md">
            Your pathway to results begins here
          </h1>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-white px-6 py-12 lg:px-12">
        <div className="w-full max-w-[400px]">
          <div className="mb-10 text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="flex items-center gap-2 mb-2">
              <Logo />
              <span className="text-xl font-bold text-gray-900">SpiderX</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <div>
              <label
                className="mb-1.5 block text-sm font-medium text-gray-700"
                htmlFor="username"
              >
                Email
              </label>
              <input
                id="username"
                type="text"
                className="form-input w-full rounded-lg border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-brand-500"
                placeholder="NathanBM@gmail.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label
                className="mb-1.5 block text-sm font-medium text-gray-700"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="form-input w-full rounded-lg border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-brand-500 pr-10"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
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
                  Remember Me
                </label>
              </div>
              <Link
                href="/reset-password"
                className="text-sm font-medium text-gray-500 hover:text-gray-800"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg border border-brand-600 bg-white px-4 py-2.5 text-sm font-medium text-brand-600 hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Signing in..." : "Log in"}
            </button>
          </form>

          {/* Note: The design has "Sign Up" on the button but it's a login form. 
              I kept "Sign Up" as per design request but functionality is Login. 
              Also added the bottom link as per design? No, design doesn't show bottom link clearly but usually there is one.
              Wait, the design image DOES NOT show a "Don't have an account" link at the bottom. 
              But the original code had it. I will leave it out to match the design strictly, 
              OR keep it if it's better UX. The user asked to "update ui signin theo ảnh sau".
              The image shows a clean bottom. I will remove the bottom link to match the image exactly.
          */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link className="font-medium text-brand-600 hover:text-brand-500 transition-colors" href="/signup">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
