"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthShell, ui } from "../component/theme";
import type { Role } from "../component/theme";

export default function LoginPage() {
  const [role, setRole] = useState<Role>("student");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          userId,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      console.log("Logged in user:", data.user);

      alert("Login successful!");

      // Redirect to student dashboard
      if (data.user.role === "STUDENT") {
        window.location.href = "/student";
      } else if (data.user.role === "TEACHER") {
        window.location.href = "/teacher";
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to connect to the server.");
    }
  };

  const handleGoogleLogin = () => {
    // Google authentication will be connected later.
    console.log("Google login clicked");
  };

  return (
    <AuthShell
      role={role}
      mobileCardOpen={showLogin}
      onMobileLogin={() => setShowLogin(true)}
    >
      <div className={ui.card}>
        {/* Mobile back button */}
        <button
          type="button"
          className={ui.mobileBack}
          onClick={() => setShowLogin(false)}
        >
          ← Back
        </button>

        {/* Login heading */}
        <div className={ui.heading}>
          <h1 className={ui.title}>Welcome to Campus Arena</h1>

          <p className={ui.subtitle}>Sign in to continue your journey</p>
        </div>

        {/* Student / Teacher */}
        <div className={ui.roleContainer}>
          <button
            type="button"
            className={ui.roleButton(role === "student", "student")}
            aria-pressed={role === "student"}
            onClick={() => setRole("student")}
          >
            <span className={ui.roleIcon}>🎓</span>

            <span className={ui.roleContent}>
              <strong className={ui.roleName}>Student</strong>

              <small className={ui.roleHint}>Learn · Compete · Grow</small>
            </span>
          </button>

          <button
            type="button"
            className={ui.roleButton(role === "teacher", "teacher")}
            aria-pressed={role === "teacher"}
            onClick={() => setRole("teacher")}
          >
            <span className={ui.roleIcon}>👨‍🏫</span>

            <span className={ui.roleContent}>
              <strong className={ui.roleName}>Teacher</strong>

              <small className={ui.roleHint}>Teach · Guide · Inspire</small>
            </span>
          </button>
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin} className={ui.form}>
          {/* User ID */}
          <div className={ui.inputGroup}>
            <label htmlFor="userId" className={ui.label}>
              {role === "student"
                ? "Student ID / User ID"
                : "Teacher ID / Employee ID"}
            </label>

            <input
              id="userId"
              type="text"
              className={ui.input}
              placeholder={
                role === "student"
                  ? "Enter your student ID"
                  : "Enter your teacher ID"
              }
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          {/* Password */}
          <div className={ui.inputGroup}>
            <label htmlFor="password" className={ui.label}>
              Password
            </label>

            <input
              id="password"
              type="password"
              className={ui.input}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {/* Forgot password */}
          <div className={ui.forgot}>
            <Link href="/auth/forgot-password" className={ui.link}>
              Forgot password?
            </Link>
          </div>

          {/* Sign in */}
          <button type="submit" className={ui.primaryButton}>
            <span>Sign In</span>
            <span className={ui.arrow}>→</span>
          </button>
        </form>

        {/* OR */}
        <div className={ui.divider}>
          <span className={ui.dividerLine} />
          <p>OR</p>
          <span className={ui.dividerLine} />
        </div>

        {/* Google */}
        <button
          type="button"
          className={ui.googleButton}
          onClick={handleGoogleLogin}
        >
          <span className={ui.googleIcon}>G</span>

          <span>Continue with Google</span>
        </button>

        {/* Create account and admin login */}
        <div className={ui.cardBottom}>
          <p>
            New here?{" "}
            <Link href="/auth/register" className={ui.link}>
              Create an account
            </Link>
          </p>

          <Link href="/admin/register" className={ui.adminLogin}>
            ⚙ Admin Login
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
