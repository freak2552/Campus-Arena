"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
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
    }
  };

  return (
    <main>
      <h1>Admin Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Admin ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">
          Admin Login
        </button>
      </form>
    </main>
  );
}