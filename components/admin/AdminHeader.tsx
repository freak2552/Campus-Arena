"use client";

import {
  Bell,
  Building2,
  ChevronDown,
  GraduationCap,
  Menu,
  Moon,
  Sun,
} from "lucide-react";

import type {
  Dispatch,
  SetStateAction,
} from "react";

import { useEffect, useState } from "react";

type AdminHeaderProps = {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  darkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
};

type HeaderData = {
  admin: {
    fullName: string;
    email: string;
  };

  college: {
    name: string;
    collegeId: string;
    code: string;
  };
};

export default function AdminHeader({
  sidebarOpen,
  setSidebarOpen,
  darkMode,
  setDarkMode,
}: AdminHeaderProps) {
  const [data, setData] =
    useState<HeaderData | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadHeaderData() {
      try {
        const response = await fetch(
          "/api/admin/dashboard",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load admin information."
          );
        }

        const result = await response.json();

        if (result.success) {
          setData({
            admin: {
              fullName: result.admin.fullName,
              email: result.admin.email,
            },

            college: {
              name: result.college.name,
              collegeId:
                result.college.collegeId,
              code: result.college.code,
            },
          });
        }
      } catch (error) {
        console.error(
          "Admin header error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadHeaderData();
  }, []);

  /*
   * -----------------------------------------
   * Admin initials
   * -----------------------------------------
   */

  const getInitials = (
    name: string
  ) => {
    if (!name) return "AD";

    const parts = name
      .trim()
      .split(/\s+/);

    if (parts.length === 1) {
      return parts[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return (
      parts[0][0] +
      parts[parts.length - 1][0]
    ).toUpperCase();
  };

  const adminName =
    data?.admin.fullName || "Admin";

  const initials =
    getInitials(adminName);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-slate-300 bg-white transition-colors dark:border-slate-700 dark:bg-slate-900">

      <div className="flex h-full items-center justify-between px-4">

        {/* ================================= */}
        {/* LEFT SIDE                         */}
        {/* ================================= */}

        <div className="flex min-w-0 items-center gap-3">

          {/* Hamburger */}

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(
                (prev) => !prev
              )
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle sidebar"
          >
            <Menu size={22} />
          </button>


          {/* ================================= */}
          {/* CAMPUS ARENA BRANDING              */}
          {/* ================================= */}

          <div className="flex shrink-0 items-center gap-2 border-r border-slate-200 pr-4 dark:border-slate-700">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <GraduationCap
                size={20}
              />
            </div>

            <span className="hidden text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:block">
              Campus Arena
            </span>

          </div>


          {/* ================================= */}
          {/* COLLEGE INFORMATION                */}
          {/* ================================= */}

          <div className="hidden min-w-0 items-center gap-3 md:flex">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <Building2 size={19} />
            </div>

            <div className="min-w-0">

              {loading ? (
                <>
                  <div className="h-4 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />

                  <div className="mt-1.5 h-3 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                </>
              ) : (
                <>
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                    {data?.college.name ||
                      "College"}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400">

                    {data?.college.collegeId ||
                      "College ID"}

                    <span className="mx-2">
                      |
                    </span>

                    {data?.college.code ||
                      "---"}

                  </p>
                </>
              )}

            </div>

          </div>

        </div>


        {/* ================================= */}
        {/* RIGHT SIDE                         */}
        {/* ================================= */}

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">

          {/* ================================= */}
          {/* DARK / LIGHT MODE                 */}
          {/* ================================= */}

          <button
            type="button"
            onClick={() =>
              setDarkMode(
                (prev) => !prev
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle dark mode"
            title={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {darkMode ? (
              <Sun size={21} />
            ) : (
              <Moon size={21} />
            )}
          </button>


          {/* ================================= */}
          {/* NOTIFICATIONS                      */}
          {/* ================================= */}

          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Notifications"
          >
            <Bell size={21} />

            {/* Notification indicator */}

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600" />
          </button>


          {/* Divider */}

          <div className="hidden h-8 w-px bg-slate-200 dark:bg-slate-700 sm:block" />


          {/* ================================= */}
          {/* ADMIN PROFILE                      */}
          {/* ================================= */}

          <button
            type="button"
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-slate-50 dark:hover:bg-slate-800"
          >

            {/* Avatar */}

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              {initials}
            </div>


            {/* Name */}

            <div className="hidden max-w-[150px] text-left sm:block">

              <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                {adminName}
              </p>

            </div>


            {/* Dropdown icon */}

            <ChevronDown
              size={17}
              className="text-slate-500 dark:text-slate-400"
            />

          </button>

        </div>

      </div>

    </header>
  );
}