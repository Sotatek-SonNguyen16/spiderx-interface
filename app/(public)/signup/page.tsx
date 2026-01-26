"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/features/auth";
import { apiClient } from "@/lib/api";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Register user
      const registerResult = await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name || null,
      });

      if (registerResult.error) {
        setError(registerResult.error);
        setLoading(false);
        return;
      }

      // 2. Tự động login sau khi register thành công
      const loginResult = await authService.login({
        username: formData.username,
        password: formData.password,
      });

      if (loginResult.error) {
        setError(loginResult.error || "Đăng ký thành công nhưng đăng nhập thất bại");
        setLoading(false);
        return;
      }

      // Kiểm tra response structure
      const token = loginResult.data?.access_token;
      if (!token) {
        console.error("Login response:", loginResult);
        setError("Không nhận được access token từ server");
        setLoading(false);
        return;
      }

      console.log("✅ Login thành công, token:", token.substring(0, 20) + "...");

      // Lưu token vào localStorage
      localStorage.setItem("auth_token", token);
      // Set token vào apiClient
      apiClient.setAuthToken(token);
      
      console.log("✅ Token đã được lưu, redirect đến /integration");
      
      // Redirect đến trang integration
      router.push("/integration");
      // Force reload để đảm bảo navigation hoạt động
      window.location.href = "/integration";
    } catch (err: any) {
      setError(err.message || "Đăng ký thất bại");
      setLoading(false);
    }
  };

  return (
    <section className="bg-bg">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="pb-12 text-center">
            <h1 className="font-heading text-3xl font-semibold text-ink md:text-4xl">
              Create an account
            </h1>
          </div>
          {/* Contact form */}
          <form className="mx-auto max-w-[400px]" onSubmit={handleSubmit}>
            <div className="bg-surface rounded-lg shadow-s1 border border-border p-8">
              {error && (
                <div className="mb-4 rounded-lg bg-dangerSoft border border-danger/20 p-3 text-sm text-danger">
                  {error}
                </div>
              )}
              <div className="space-y-5">
                <div>
                  <label
                    className="mb-1 block text-sm font-semibold text-ink"
                    htmlFor="username"
                  >
                    Username <span className="text-danger">*</span>
                  </label>
                  <input
                    id="username"
                    type="text"
                    className="w-full rounded-md bg-surface border border-border px-4 py-3 text-sm text-ink placeholder:text-ink3 focus:border-primary focus:ring-4 focus:ring-primarySoft focus:outline-none transition duration-150"
                    placeholder="Your username (3-50 chars)"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    minLength={3}
                    maxLength={50}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label
                    className="mb-1 block text-sm font-semibold text-ink"
                    htmlFor="full_name"
                  >
                    Full Name
                  </label>
                  <input
                    id="full_name"
                    type="text"
                    className="w-full rounded-md bg-surface border border-border px-4 py-3 text-sm text-ink placeholder:text-ink3 focus:border-primary focus:ring-4 focus:ring-primarySoft focus:outline-none transition duration-150"
                    placeholder="Your full name"
                    value={formData.full_name}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label
                    className="mb-1 block text-sm font-semibold text-ink"
                    htmlFor="email"
                  >
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full rounded-md bg-surface border border-border px-4 py-3 text-sm text-ink placeholder:text-ink3 focus:border-primary focus:ring-4 focus:ring-primarySoft focus:outline-none transition duration-150"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-semibold text-ink"
                    htmlFor="password"
                  >
                    Password <span className="text-danger">*</span>
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="w-full rounded-md bg-surface border border-border px-4 py-3 text-sm text-ink placeholder:text-ink3 focus:border-primary focus:ring-4 focus:ring-primarySoft focus:outline-none transition duration-150"
                    placeholder="Password (at least 8 characters)"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="mt-6 space-y-5">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </div>
            </div>
          </form>
          {/* Bottom link */}
          <div className="mt-6 text-center text-sm text-ink2">
            Already have an account?{" "}
            <Link className="font-semibold text-primary hover:text-primaryHover transition-colors" href="/signin">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
