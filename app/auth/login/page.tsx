"use client";

import { useState } from "react";
import Link from "next/link";

type Role = "student" | "teacher";

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
        <main className="auth-page login-page">

            {/* Campus background */}
            <div className="auth-background" />

            {/* Mobile Login Button */}
            <button
                type="button"
                className="mobile-login-button"
                onClick={() => setShowLogin(true)}
            >
                Login <span>→</span>
            </button>

            {/* Login container */}
            <section
                className={`auth-container ${showLogin ? "mobile-login-open" : ""
                    }`}
            >
                <div className="login-card">

                    {/* Mobile back button */}
                    <button
                        type="button"
                        className="mobile-back-button"
                        onClick={() => setShowLogin(false)}
                    >
                        ← Back
                    </button>

                    {/* Login heading */}
                    <div className="login-heading">
                        <h1>Welcome to Campus Arena</h1>

                        <p>
                            Sign in to continue your journey
                        </p>
                    </div>

                    {/* Student / Teacher */}
                    <div className="role-container">

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
                                <strong>Student</strong>

                                <small>
                                    Learn · Compete · Grow
                                </small>
                            </span>
                        </button>

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
                                <strong>Teacher</strong>

                                <small>
                                    Teach · Guide · Inspire
                                </small>
                            </span>
                        </button>

                    </div>

                    {/* Login form */}
                    <form
                        onSubmit={handleLogin}
                        className="login-form"
                    >

                        {/* User ID */}
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

                        {/* Password */}
                        <div className="input-group">

                            <label htmlFor="password">
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                autoComplete="current-password"
                                required
                            />

                        </div>

                        {/* Forgot password */}
                        <div className="forgot-password">

                            <Link href="/auth/forgot-password">
                                Forgot password?
                            </Link>

                        </div>

                        {/* Sign in */}
                        <button
                            type="submit"
                            className="login-button"
                        >
                            <span>Sign In</span>
                            <span className="arrow">→</span>
                        </button>

                    </form>

                    {/* OR */}
                    <div className="divider">
                        <span />
                        <p>OR</p>
                        <span />
                    </div>

                    {/* Google */}
                    <button
                        type="button"
                        className="google-button"
                        onClick={handleGoogleLogin}
                    >
                        <span className="google-icon">
                            G
                        </span>

                        <span>
                            Continue with Google
                        </span>
                    </button>

                    {/* Create account and admin login */}
                    <div className="card-bottom">

                        <p className="register-text">
                            New here?{" "}
                            <Link href="/auth/register">
                                Create an account
                            </Link>
                        </p>

                        <Link
                            href="/admin/register"
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