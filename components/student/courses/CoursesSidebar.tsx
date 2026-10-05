"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, BookOpen, Compass, TrendingUp } from "lucide-react";

type CoursesSidebarProps = {
  sidebarOpen: boolean;
  onNavigate: () => void;
};

const items = [
  { label: "My Courses", href: "/student/courses", icon: BookOpen },
  { label: "Explore Courses", href: "/student/courses/explore", icon: Compass },
];

const baseItem =
  "mb-2 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors";

export default function CoursesSidebar({
  sidebarOpen,
  onNavigate,
}: CoursesSidebarProps) {
  const pathname = usePathname();

  if (!sidebarOpen) {
    return null;
  }

  return (
    <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900">
      <nav className="flex flex-col p-4">
        <Link
          href="/student"
          onClick={onNavigate}
          className={`${baseItem} text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800`}
        >
          <ArrowLeft size={18} />
          Student Home
        </Link>

        <div className="my-2 h-px bg-slate-200 dark:bg-slate-700" />

        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`${baseItem} ${
                active
                  ? "bg-emerald-600 font-semibold text-white shadow-sm"
                  : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-300"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}

        {/* Progress is built in a later slice */}
        <div
          className={`${baseItem} cursor-not-allowed text-slate-400 dark:text-slate-500`}
          aria-disabled="true"
        >
          <TrendingUp size={18} />
          Progress
          <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            Soon
          </span>
        </div>
      </nav>
    </aside>
  );
}
