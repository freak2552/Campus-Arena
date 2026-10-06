"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthShell, ui } from "../component/theme";
import type { Role } from "../component/theme";

export default function RegisterPage() {
  const [role, setRole] = useState<Role>("student");

  const [fullName, setFullName] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Check password confirmation
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // 2. Send registration data to backend
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          fullName,
          userId,
          email,
          password,
        }),
      });

      // 3. Read backend response
      const data = await response.json();

      // 4. Handle error
      if (!response.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      // 5. Registration successful
      alert("Account created successfully!");

      // 6. Go to login page
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Registration error:", error);
      alert("Unable to connect to the server.");
    }
  };

  const handleGoogleRegister = () => {
    // Google authentication will be connected later.

    console.log("Google registration clicked");
  };

  return (
    <AuthShell role={role}>
      <div className={ui.card}>
        {/* BACK TO LOGIN */}
        <div className={ui.backToLogin}>
          <Link href="/auth/login" className={ui.link}>
            ← Back to Sign In
          </Link>
        </div>

        {/* HEADING */}
        <div className={ui.heading}>
          <h1 className={ui.title}>Create Your Account</h1>

          <p className={ui.subtitle}>Join your college community</p>
        </div>

        {/* ROLE SELECTION */}
        <div className={ui.roleContainer}>
          {/* STUDENT */}
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

          {/* TEACHER */}
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

        {/* REGISTRATION FORM */}
        <form onSubmit={handleRegister} className={ui.form}>
          {/* FULL NAME */}
          <div className={ui.inputGroup}>
            <label htmlFor="fullName" className={ui.label}>
              Full Name
            </label>

            <input
              id="fullName"
              type="text"
              className={ui.input}
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>

          {/* STUDENT / TEACHER ID */}
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

          {/* EMAIL */}
          <div className={ui.inputGroup}>
            <label htmlFor="email" className={ui.label}>
              Email Address
            </label>

            <input
              id="email"
              type="email"
              className={ui.input}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className={ui.inputGroup}>
            <label htmlFor="password" className={ui.label}>
              Password
            </label>

            <input
              id="password"
              type="password"
              className={ui.input}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className={ui.inputGroup}>
            <label htmlFor="confirmPassword" className={ui.label}>
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              className={ui.input}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          {/* TERMS */}
          <label className={ui.terms}>
            <input type="checkbox" className={ui.checkbox} required />

            <span>
              I agree to the{" "}
              <Link href="#" className={ui.link}>
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link href="#" className={ui.link}>
                Privacy Policy
              </Link>
            </span>
          </label>

          {/* CREATE ACCOUNT */}
          <button type="submit" className={ui.primaryButton}>
            <span>Create Account</span>

            <span className={ui.arrow}>→</span>
          </button>
        </form>

        {/* DIVIDER */}
        <div className={ui.divider}>
          <span className={ui.dividerLine} />

          <p>OR</p>

          <span className={ui.dividerLine} />
        </div>

        {/* GOOGLE */}
        <button
          type="button"
          className={ui.googleButton}
          onClick={handleGoogleRegister}
        >
          <span className={ui.googleIcon}>G</span>

          <span>Continue with Google</span>
        </button>

        {/* LOGIN LINK */}
        <p className={ui.registerText}>
          Already have an account?{" "}
          <Link href="/auth/login" className={ui.link}>
            Sign In
          </Link>
        </p>

        {/* ADMIN LOGIN */}
        <div className={ui.cardBottom}>
          <Link href="/admin/login" className={ui.adminLogin}>
            ⚙ Admin Login
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
