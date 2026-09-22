"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminRegisterPage() {
  const [fullName, setFullName] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");

  const [collegeName, setCollegeName] = useState("");
  const [collegeCode, setCollegeCode] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      alert("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          userId,
          email,
          password,
          collegeName,
          collegeCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed.");
        return;
      }

      alert(
        `Admin account created successfully!\n\nYour College ID is: ${data.college.collegeId}`
      );

      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Admin registration error:", error);
      alert("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px",
        background: "#f4f7fb",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "650px",
          background: "#ffffff",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ marginBottom: "30px" }}>
          <Link href="/auth/login">
            ← Back to Login
          </Link>

          <h1 style={{ marginTop: "25px" }}>
            Create Admin Account
          </h1>

          <p style={{ color: "#64748b" }}>
            Create your admin account and register your college
            on Campus Arena.
          </p>
        </div>

        <form onSubmit={handleRegister}>
          {/* Admin Information */}

          <h2>Admin Information</h2>

          <div style={{ marginBottom: "18px" }}>
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
            }}
          >
            <div>
              <label>User ID</label>

              <input
                type="text"
                placeholder="Choose admin ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* College */}

          <h2 style={{ marginTop: "30px" }}>
            College Information
          </h2>

          <div style={{ marginBottom: "18px" }}>
            <label>College Name</label>

            <input
              type="text"
              placeholder="Enter college name"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label>College Code</label>

            <input
              type="text"
              placeholder="Example: YSM"
              value={collegeCode}
              onChange={(e) =>
                setCollegeCode(e.target.value.toUpperCase())
              }
              required
              style={inputStyle}
            />
          </div>

          {/* Password */}

          <h2 style={{ marginTop: "30px" }}>
            Security
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
            }}
          >
            <div>
              <label>Password</label>

              <input
                type="password"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label>Confirm Password</label>

              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* Terms */}

          <label
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "25px",
              alignItems: "center",
            }}
          >
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />

            <span>
              I agree to the Terms of Service and Privacy Policy.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "25px",
              padding: "14px",
              border: "none",
              borderRadius: "10px",
              background: "#2563eb",
              color: "white",
              fontSize: "16px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading
              ? "Creating Account..."
              : "Create Admin Account"}
          </button>

          <p
            style={{
              textAlign: "center",
              marginTop: "20px",
              color: "#64748b",
            }}
          >
            Already have an account?{" "}
            <Link href="/admin/login">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "7px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "15px",
  boxSizing: "border-box" as const,
};