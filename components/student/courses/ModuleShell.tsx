"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Moon, Sun } from "lucide-react";

import { useStudentTheme } from "@/components/student/useStudentTheme";
import {
  ModuleProvider,
  useModule,
} from "@/components/student/courses/ModuleProvider";

type TopBarProps = {
  courseId: string;
  darkMode: boolean;
  toggleDarkMode: () => void;
};

// Minimal bar: back to the course, where you are, theme toggle.
function ModuleTopBar({ courseId, darkMode, toggleDarkMode }: TopBarProps) {
  const { courseModule } = useModule();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
        <Link
          href={`/student/courses/${courseId}`}
          className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
        >
          <ArrowLeft size={18} className="shrink-0" />
          <span className="truncate">
            {courseModule?.course.title ?? "Back to course"}
          </span>
        </Link>

        {courseModule && (
          <p className="hidden min-w-0 truncate text-sm text-slate-500 dark:text-slate-400 md:block">
            Module {courseModule.number} of {courseModule.totalModules}
          </p>
        )}

        <button
          type="button"
          onClick={toggleDarkMode}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Toggle dark mode"
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}

// Level 3 of Courses: distraction-free study layout (no sidebar)
export default function ModuleShell({ children }: { children: ReactNode }) {
  const params = useParams<{ courseId: string; moduleId: string }>();
  const { darkMode, toggleDarkMode } = useStudentTheme();

  return (
    <ModuleProvider courseId={params.courseId} moduleId={params.moduleId}>
      <div className={darkMode ? "dark" : ""} style={{ minHeight: "100vh" }}>
        <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
          <ModuleTopBar
            courseId={params.courseId}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />

          <main>{children}</main>
        </div>
      </div>
    </ModuleProvider>
  );
}
