"use client";

import { useState } from "react";
import Link from "next/link";

const inputClass =
  "mt-[7px] box-border w-full rounded-lg border border-[#d1d5db] p-3 text-[15px]";

const linkClass = "text-[#0000ee] underline";

export default function AdminLoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: "admin",
          userId,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      alert("Admin login successful!");

      window.location.href = "/admin/dashboard";
    } catch (error) {
      console.error("Admin login error:", error);
      alert("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f7fb] p-4 sm:p-[30px]">
      <div className="w-full max-w-[450px] rounded-[20px] bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.08)] sm:p-10">
        <div className="mb-[30px]">
          <Link href="/auth/login" className={linkClass}>
            ← Back to Login
          </Link>

          <h1 className="mb-[21px] mt-[25px] text-[26px] font-bold sm:text-[32px]">
            Admin Login
          </h1>

          <p className="my-4 text-[#64748b]">
            Login to manage your college on Campus Arena.
          </p>

          <p className="mb-0 mt-4 text-[#64748b]">
            Don&apos;t have an account?{" "}
            <Link href="/admin/register" className={linkClass}>
              Register here
            </Link>
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-[18px]">
            <label>Admin ID</label>

            <input
              type="text"
              placeholder="Admin ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div className="mb-[18px]">
            <label>Password</label>

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-[25px] w-full cursor-pointer rounded-[10px] border-none bg-[#2563eb] p-3.5 text-[16px] font-semibold text-white disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Admin Login"}
          </button>
        </form>
      </div>
    </main>
  );
}