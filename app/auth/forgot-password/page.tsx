"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Backend email/reset-token logic will be connected later.
    console.log("Password reset requested for:", email);

    setSubmitted(true);
  };

  return (
    <main className="auth-page">
      {/* Background */}
      <div className="auth-background" />

      <section className="auth-container">
        <div className="login-card forgot-card">

          {!submitted ? (
            <>
              {/* Back to Login */}
              <div className="back-to-login">
                <Link href="/auth/login">
                  ← Back to Sign In
                </Link>
              </div>

              {/* Heading */}
              <div className="login-heading">
                <h1>Forgot Password?</h1>
                <p>
                  Enter your registered email and we'll send you
                  a password reset link.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="login-form">

                <div className="input-group">
                  <label htmlFor="email">
                    Registered Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="login-button"
                >
                  <span>Send Reset Link</span>
                  <span className="arrow">→</span>
                </button>

              </form>

              {/* Google reminder */}
              <div className="forgot-note">
                <p>
                  Using Google to sign in?
                </p>

                <Link href="/auth/login">
                  Continue with Google instead
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="success-icon">
                ✓
              </div>

              <div className="login-heading">
                <h1>Check Your Email</h1>

                <p>
                  If an account exists for{" "}
                  <strong>{email}</strong>, we've sent you
                  a password reset link.
                </p>
              </div>

              <div className="forgot-note success-message">
                <p>
                  Didn't receive the email?
                </p>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                >
                  Try again
                </button>
              </div>

              <Link
                href="/auth/login"
                className="login-button back-button"
              >
                <span>Back to Sign In</span>
                <span className="arrow">→</span>
              </Link>
            </>
          )}

          {/* Bottom */}
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