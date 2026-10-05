"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  Database,
  FileText,
  LayoutDashboard,
  LayoutGrid,
  Megaphone,
  MessageSquare,
} from "lucide-react";

import { useCurrentCourse } from "@/components/student/courses/CurrentCourseProvider";

type CurrentCourseSidebarProps = {
  courseId: string;
  sidebarOpen: boolean;
  onNavigate: () => void;
};

const baseItem =
  "mb-1.5 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors";

const comingSoon = [
  { label: "Resources", icon: FileText },
  { label: "Announcements", icon: Megaphone },
  { label: "Discussions", icon: MessageSquare },
];

export default function CurrentCourseSidebar({
  courseId,
  sidebarOpen,
  onNavigate,
}: CurrentCourseSidebarProps) {
  const pathname = usePathname();
  const { course } = useCurrentCourse();

  if (!sidebarOpen) {
    return null;
  }

  const overviewHref = `/student/courses/${courseId}`;
  const overviewActive = pathname === overviewHref;

  return (
    <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 overflow-y-auto bg-[#0f2247] text-white shadow-sm">
      <nav className="p-4">
        <Link
          href="/student/courses"
          onClick={onNavigate}
          className="mb-4 flex items-center gap-2 px-2 py-2 text-sm font-semibold text-slate-200 transition-colors hover:text-white"
        >
          <ArrowLeft size={18} />
          My Courses
        </Link>

        <div className="mb-4 flex items-center gap-3 rounded-xl bg-blue-200 px-4 py-3 text-blue-950">
          <Database size={18} className="shrink-0" />
          <span className="line-clamp-2 text-sm font-bold">
            {course?.title ?? "Course"}
          </span>
        </div>

        <Link
          href={overviewHref}
          onClick={onNavigate}
          className={`${baseItem} ${
            overviewActive
              ? "bg-white/15 font-semibold text-white"
              : "text-slate-200 hover:bg-white/10 hover:text-white"
          }`}
        >
          <LayoutDashboard size={18} />
          Overview
        </Link>

        <Link
          href={`${overviewHref}#course-modules`}
          onClick={onNavigate}
          className={`${baseItem} text-slate-200 hover:bg-white/10 hover:text-white`}
        >
          <LayoutGrid size={18} />
          Modules
        </Link>

        {comingSoon.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              aria-disabled="true"
              className={`${baseItem} cursor-not-allowed text-slate-400`}
            >
              <Icon size={18} />
              {item.label}
              <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-300">
                Soon
              </span>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
