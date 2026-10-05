"use client";

import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { GraduationCap, LogOut, Menu, Moon, Sun } from "lucide-react";

type StudentHeaderProps = {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  darkMode: boolean;
  toggleDarkMode: () => void;
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "ST";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function StudentHeader({
  sidebarOpen,
  setSidebarOpen,
  darkMode,
  toggleDarkMode,
}: StudentHeaderProps) {
  const [fullName, setFullName] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadUser() {
      try {
        const response = await fetch("/api/student/me", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) return;

        const data = await response.json();

        if (data.success && data.user) {
          setFullName(data.user.fullName);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error("Student header error:", error);
      }
    }

    loadUser();

    return () => controller.abort();
  }, []);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      window.location.href = "/auth/login";
    }
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-slate-300 bg-white transition-colors dark:border-slate-700 dark:bg-slate-900">
      <div className="flex h-full items-center justify-between px-4">
        {/* Left */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <Menu size={22} />
          </button>

          <div className="flex shrink-0 items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <GraduationCap size={20} />
            </div>

            <span className="hidden text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:block">
              Campus Arena
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleDarkMode}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle dark mode"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={21} /> : <Moon size={21} />}
          </button>

          <div className="hidden h-8 w-px bg-slate-200 dark:bg-slate-700 sm:block" />

          <div className="flex items-center gap-2 px-1">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              {getInitials(fullName)}
            </div>

            <p className="hidden max-w-[150px] truncate text-sm font-semibold text-slate-800 dark:text-slate-100 sm:block">
              {fullName || "Student"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 disabled:opacity-60 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
