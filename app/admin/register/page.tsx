"use client";

import { useState } from "react";
import Link from "next/link";

const inputClass =
  "mt-[7px] box-border w-full rounded-lg border border-[#d1d5db] p-3 text-[15px]";

const linkClass = "text-[#0000ee] underline";

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
    <main className="flex min-h-screen items-center justify-center bg-[#f4f7fb] p-[30px]">
      <div className="w-full max-w-[650px] rounded-[20px] bg-white p-10 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
        <div className="mb-[30px]">
          <Link href="/auth/login" className={linkClass}>
            ← Back to Login
          </Link>

          <h1 className="mb-[21px] mt-[25px] text-[32px] font-bold">
            Create Admin Account
          </h1>

          <p className="my-4 text-[#64748b]">
            Create your admin account and register your college on Campus
            Arena.
          </p>

          {/* Already have an account (moved to top) */}
          <p className="mb-0 mt-4 text-[#64748b]">
            Already have an account?{" "}
            <Link href="/admin/login" className={linkClass}>
              Login here
            </Link>
          </p>
        </div>

        <form onSubmit={handleRegister}>
          {/* Admin Information */}

          <h2 className="my-5 text-2xl font-bold">Admin Information</h2>

          <div className="mb-[18px]">
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-[15px]">
            <div>
              <label>User ID</label>

              <input
                type="text"
                placeholder="Choose admin ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                className={inputClass}
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
                className={inputClass}
              />
            </div>
          </div>

          {/* College */}

          <h2 className="mb-5 mt-[30px] text-2xl font-bold">
            College Information
          </h2>

          <div className="mb-[18px]">
            <label>College Name</label>

            <input
              type="text"
              placeholder="Enter college name"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div className="mb-[18px]">
            <label>College Code</label>

            <input
              type="text"
              placeholder="Example: YSM"
              value={collegeCode}
              onChange={(e) => setCollegeCode(e.target.value.toUpperCase())}
              required
              className={inputClass}
            />
          </div>

          {/* Password */}

          <h2 className="mb-5 mt-[30px] text-2xl font-bold">Security</h2>

          <div className="grid grid-cols-2 gap-[15px]">
            <div>
              <label>Password</label>

              <input
                type="password"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label>Confirm Password</label>

              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Terms */}

          <label className="mt-[25px] flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />

            <span>I agree to the Terms of Service and Privacy Policy.</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-[25px] w-full cursor-pointer rounded-[10px] border-none bg-[#2563eb] p-3.5 text-[16px] font-semibold text-white disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Admin Account"}
          </button>
        </form>
      </div>
    </main>
  );
}