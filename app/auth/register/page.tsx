"use client";

import { useState } from "react";
import Link from "next/link";

type Role = "student" | "teacher";

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
    <main className="auth-page">

      {/* =========================================
          BACKGROUND
      ========================================= */}

      <div className="auth-background" />


      {/* =========================================
          REGISTER CONTAINER
      ========================================= */}

      <section className="auth-container">

        <div className="login-card">

          {/* =========================================
              BACK TO LOGIN
          ========================================= */}

          <div className="back-to-login">
            <Link href="/auth/login">
              ← Back to Sign In
            </Link>
          </div>


          {/* =========================================
              HEADING
          ========================================= */}

          <div className="login-heading">

            <h1>
              Create Your Account
            </h1>

            <p>
              Join your college community
            </p>

          </div>


          {/* =========================================
              ROLE SELECTION
          ========================================= */}

          <div className="role-container">

            {/* STUDENT */}

            <button
              type="button"
              className={`role-button ${role === "student"
                  ? "active student"
                  : ""
                }`}
              onClick={() => setRole("student")}
            >

              <span className="role-icon">
                🎓
              </span>

              <span className="role-content">

                <strong>
                  Student
                </strong>

                <small>
                  Learn · Compete · Grow
                </small>

              </span>

            </button>


            {/* TEACHER */}

            <button
              type="button"
              className={`role-button ${role === "teacher"
                  ? "active teacher"
                  : ""
                }`}
              onClick={() => setRole("teacher")}
            >

              <span className="role-icon">
                👨‍🏫
              </span>

              <span className="role-content">

                <strong>
                  Teacher
                </strong>

                <small>
                  Teach · Guide · Inspire
                </small>

              </span>

            </button>

          </div>


          {/* =========================================
              REGISTRATION FORM
          ========================================= */}

          <form
            onSubmit={handleRegister}
            className="login-form"
          >

            {/* FULL NAME */}

            <div className="input-group">

              <label htmlFor="fullName">
                Full Name
              </label>

              <input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
                autoComplete="name"
                required
              />

            </div>


            {/* STUDENT / TEACHER ID */}

            <div className="input-group">

              <label htmlFor="userId">

                {role === "student"
                  ? "Student ID / User ID"
                  : "Teacher ID / Employee ID"}

              </label>

              <input
                id="userId"
                type="text"
                placeholder={
                  role === "student"
                    ? "Enter your student ID"
                    : "Enter your teacher ID"
                }
                value={userId}
                onChange={(e) =>
                  setUserId(e.target.value)
                }
                autoComplete="username"
                required
              />

            </div>


            {/* EMAIL */}

            <div className="input-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                autoComplete="email"
                required
              />

            </div>


            {/* PASSWORD */}

            <div className="input-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                autoComplete="new-password"
                required
              />

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="input-group">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                autoComplete="new-password"
                required
              />

            </div>


            {/* TERMS */}

            <label className="terms">

              <input
                type="checkbox"
                required
              />

              <span>
                I agree to the{" "}
                <Link href="#">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link href="#">
                  Privacy Policy
                </Link>
              </span>

            </label>


            {/* CREATE ACCOUNT */}

            <button
              type="submit"
              className="login-button"
            >

              <span>
                Create Account
              </span>

              <span className="arrow">
                →
              </span>

            </button>

          </form>


          {/* =========================================
              DIVIDER
          ========================================= */}

          <div className="divider">

            <span />

            <p>
              OR
            </p>

            <span />

          </div>


          {/* =========================================
              GOOGLE
          ========================================= */}

          <button
            type="button"
            className="google-button"
            onClick={handleGoogleRegister}
          >

            <span className="google-icon">
              G
            </span>

            <span>
              Continue with Google
            </span>

          </button>


          {/* =========================================
              LOGIN LINK
          ========================================= */}

          <p className="register-text">

            Already have an account?{" "}

            <Link href="/auth/login">
              Sign In
            </Link>

          </p>


          {/* =========================================
              ADMIN LOGIN
          ========================================= */}

          <div className="card-bottom">

            <Link
              href="/admin/login"
              className="admin-login"
            >
              ⚙ Admin Login
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}