"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminShell({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("admin-theme");

    if (savedTheme === "dark") {
      setDarkMode(true);
    }
  }, []);

  // Save theme
  useEffect(() => {
    localStorage.setItem(
      "admin-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  return (
    <div
      className={darkMode ? "dark" : ""}
      style={{ minHeight: "100vh" }}
    >
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">

        <AdminHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <AdminSidebar sidebarOpen={sidebarOpen} />

        <main
          className={
            sidebarOpen
              ? "pt-16 pl-64 transition-all duration-200"
              : "pt-16 pl-0 transition-all duration-200"
          }
        >
          {children}
        </main>

      </div>
    </div>
  );
}