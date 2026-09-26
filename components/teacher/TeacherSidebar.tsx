"use client";

type TeacherSidebarProps = {
  sidebarOpen: boolean;
};

export default function TeacherSidebar({
  sidebarOpen,
}: TeacherSidebarProps) {
  if (!sidebarOpen) {
    return null;
  }

  return (
    <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-slate-200 bg-white shadow-sm">
      <nav className="flex flex-col p-4">

        <a
          href="/teacher"
          className="mb-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          Dashboard
        </a>

        <a
          href="/teacher/courses"
          className="mb-2 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
        >
          My Courses
        </a>

        <a
          href="/teacher/all-courses"
          className="mb-2 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
        >
          All Courses
        </a>

        <a
          href="/teacher/create-course"
          className="mb-2 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
        >
          Create Course
        </a>

        <a
          href="/teacher/sections"
          className="mb-2 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
        >
          Manage Sections
        </a>

        <a
          href="/teacher/students"
          className="mb-2 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
        >
          Students
        </a>

        <a
          href="/teacher/tests"
          className="mb-2 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
        >
          Tests & Assignments
        </a>

        <a
          href="/teacher/resources"
          className="mb-2 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
        >
          Resources
        </a>

        <a
          href="/teacher/announcements"
          className="mb-2 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
        >
          Announcements
        </a>

        <a
          href="/teacher/analytics"
          className="mb-2 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
        >
          Analytics
        </a>

      </nav>
    </aside>
  );
}