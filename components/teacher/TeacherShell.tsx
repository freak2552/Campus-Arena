"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import TeacherHeader from "@/components/teacher/TeacherHeader";
import TeacherSidebar from "@/components/teacher/TeacherSidebar";

export default function TeacherShell({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-100">

      <TeacherHeader
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <TeacherSidebar sidebarOpen={sidebarOpen} />

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
  );
}