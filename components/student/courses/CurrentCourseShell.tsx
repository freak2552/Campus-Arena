"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useParams } from "next/navigation";

import StudentHeader from "@/components/student/StudentHeader";
import { useStudentTheme } from "@/components/student/useStudentTheme";
import { CurrentCourseProvider } from "@/components/student/courses/CurrentCourseProvider";
import CurrentCourseSidebar from "@/components/student/courses/CurrentCourseSidebar";

export default function CurrentCourseShell({
  children,
}: {
  children: ReactNode;
}) {
  const params = useParams<{ courseId: string }>();
  const courseId = params.courseId;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { darkMode, toggleDarkMode } = useStudentTheme();

  // On phones/tablets the sidebar starts closed so it doesn't cover the page
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, []);

  const closeOnSmallScreens = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <CurrentCourseProvider courseId={courseId}>
      <div className={darkMode ? "dark" : ""} style={{ minHeight: "100vh" }}>
        <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
          <StudentHeader
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />

          {sidebarOpen && (
            <div
              className="fixed inset-0 top-16 z-30 bg-black/40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <CurrentCourseSidebar
            courseId={courseId}
            sidebarOpen={sidebarOpen}
            onNavigate={closeOnSmallScreens}
          />

          <main
            className={`pt-16 transition-all duration-200 ${
              sidebarOpen ? "lg:pl-64" : ""
            }`}
          >
            {children}
          </main>
        </div>
      </div>
    </CurrentCourseProvider>
  );
}
