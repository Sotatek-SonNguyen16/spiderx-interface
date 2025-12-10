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
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="pb-12 text-center">
            <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-900),var(--color-brand-600),var(--color-gray-800),var(--color-purple-600),var(--color-gray-900))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Create an account
            </h1>
          </div>
          {/* Contact form */}
          <form className="mx-auto max-w-[400px]" onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                {error}
              </div>
            )}
            <div className="space-y-5">
              <div>
                <label
                  className="mb-1 block text-sm font-medium text-gray-700"
                  htmlFor="username"
                >
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  id="username"
                  type="text"
                  className="form-input w-full"
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
                  className="mb-1 block text-sm font-medium text-gray-700"
                  htmlFor="full_name"
                >
                  Full Name
                </label>
                <input
                  id="full_name"
                  type="text"
                  className="form-input w-full"
                  placeholder="Your full name"
                  value={formData.full_name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div>
                <label
                  className="mb-1 block text-sm font-medium text-gray-700"
                  htmlFor="email"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-input w-full"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="password"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-input w-full"
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
                className="btn w-full bg-linear-to-t from-brand-600 to-brand-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>
          {/* Bottom link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link className="font-medium text-brand-600 hover:text-brand-500 transition-colors" href="/signin">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
