"use client";

import { useEffect, useState } from "react";

type TeacherUser = {
  id: string;
  role: "TEACHER";
  fullName: string;
  collegeId?: string | null;
};

export default function TeacherPage() {
  const [user, setUser] = useState<TeacherUser | null>(null);
  const [collegeId, setCollegeId] = useState("");
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const response = await fetch("/api/auth/me");

      if (!response.ok) {
        throw new Error("Failed to load user");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to load user");
      }

      // Make sure only teachers can access this page
      if (data.user.role !== "TEACHER") {
        window.location.href = "/";
        return;
      }

      setUser(data.user);
    } catch (error) {
      console.error("Failed to load teacher:", error);
      setError("Unable to load your account.");
    } finally {
      setLoading(false);
    }
  }

  async function joinCollege() {
    if (!collegeId.trim()) {
      setError("Please enter your College ID.");
      return;
    }

    setJoining(true);
    setError("");

    try {
      const response = await fetch("/api/teacher/join-college", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collegeId: collegeId.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to join college.");
        return;
      }

      // Update the logged-in user locally
      setUser((previousUser) => {
        if (!previousUser) return previousUser;

        return {
          ...previousUser,
          collegeId: data.college.id,
        };
      });

      setCollegeId("");
    } catch (error) {
      console.error("Join college error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setJoining(false);
    }
  }

  // --------------------------------
  // Loading
  // --------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // --------------------------------
  // Error
  // --------------------------------

  if (error && !user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // --------------------------------
  // Teacher has NOT joined a college
  // --------------------------------

  if (user && !user.collegeId) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-100 p-6">

        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">

          <div className="mb-6">
            <p className="text-sm font-medium text-green-600">
              Welcome, {user.fullName}
            </p>

            <h1 className="mt-2 text-2xl font-bold text-gray-900">
              Connect Your College
            </h1>

            <p className="mt-2 leading-relaxed text-gray-600">
              Enter your College ID to continue your teaching journey
              on Campus Arena.
            </p>
          </div>

          <label className="text-sm font-medium text-gray-700">
            College ID
          </label>

          <input
            type="text"
            value={collegeId}
            onChange={(e) => {
              setCollegeId(e.target.value);
              setError("");
            }}
            placeholder="CA-E99AD06B"
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />

          {error && (
            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            onClick={joinCollege}
            disabled={joining}
            className="mt-5 w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {joining ? "Connecting..." : "Connect College"}
          </button>

          <p className="mt-4 text-center text-xs text-gray-500">
            Get your College ID from your college administration.
          </p>

        </div>
      </div>
    );
  }

  // --------------------------------
  // Normal Teacher Dashboard
  // --------------------------------

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-100 p-8">

      <div className="mx-auto max-w-6xl">

        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {user.fullName}
        </h1>

        <p className="mt-2 text-gray-600">
          You are connected to your college and ready to teach.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">
              My Courses
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Create and manage your courses.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">
              Students
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Manage students and learning activities.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">
              College
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Your college is connected.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}