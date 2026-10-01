"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  ChevronRight,
  GraduationCap,
  Pencil,
  Plus,
  Settings,
  UserRound,
  Users,
  Zap,
} from "lucide-react";

type DashboardData = {
  admin: {
    id: number;
    userId: string;
    fullName: string;
    email: string;
  };

  college: {
    id: number;
    collegeId: string;
    name: string;
    code: string;
  };

  stats: {
    departments: number;
    programmes: number;
    semesters: number;
    teachers: number;
    students: number;
  };
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/admin/dashboard",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Failed to load dashboard."
          );
        }

        setData(result);
      } catch (error) {
        console.error("Dashboard loading error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  /*
   * -----------------------------------------
   * Loading state
   * -----------------------------------------
   */

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-6 dark:bg-slate-950 md:p-8">
        <div className="mx-auto max-w-[1450px]">

          <div className="mb-7">
            <div className="h-9 w-72 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />

            <div className="mt-3 h-5 w-96 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-2xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900"
              />
            ))}
          </div>

        </div>
      </div>
    );
  }

  /*
   * -----------------------------------------
   * Error state
   * -----------------------------------------
   */

  if (error || !data) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-6 dark:bg-slate-950 md:p-8">
        <div className="mx-auto max-w-[1450px]">

          <div className="rounded-2xl border border-red-300 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/30">

            <h2 className="text-lg font-bold text-red-700 dark:text-red-300">
              Unable to load dashboard
            </h2>

            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {error || "Something went wrong."}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-6 transition-colors dark:bg-slate-950 md:p-8">

      <div className="mx-auto max-w-[1450px]">

        {/* -------------------------------- */}
        {/* Welcome                          */}
        {/* -------------------------------- */}

        <div className="mb-7">

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back, {data.admin.fullName}!
          </h1>

          <p className="mt-1 text-base text-slate-500 dark:text-slate-400">
            Here's an overview of your college setup.
          </p>

        </div>


        {/* -------------------------------- */}
        {/* STAT CARDS                       */}
        {/* -------------------------------- */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Departments"
            value={String(data.stats.departments)}
            icon={<Building2 size={26} />}
            iconClass="bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400"
          />

          <StatCard
            title="Programmes"
            value={String(data.stats.programmes)}
            icon={<BookOpen size={26} />}
            iconClass="bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
          />

          <StatCard
            title="Teachers"
            value={String(data.stats.teachers)}
            icon={<UserRound size={26} />}
            iconClass="bg-pink-50 text-pink-600 dark:bg-pink-950/50 dark:text-pink-400"
          />

          <StatCard
            title="Students"
            value={String(data.stats.students)}
            icon={<Users size={26} />}
            iconClass="bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400"
          />

        </div>


        {/* -------------------------------- */}
        {/* INFORMATION + QUICK ACTIONS      */}
        {/* -------------------------------- */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* College Information */}

          <section className="rounded-2xl border border-slate-300 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:col-span-2">

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-700">

              <div className="flex items-center gap-3">

                <Building2
                  size={24}
                  className="text-slate-600 dark:text-slate-300"
                />

                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  College Information
                </h2>

              </div>

              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Pencil size={15} />
                Edit College
              </button>

            </div>


            <div className="px-6">

              <InfoRow
                label="College Name"
                value={data.college.name}
              />

              <InfoRow
                label="College ID"
                value={data.college.collegeId}
              />

              <InfoRow
                label="College Code"
                value={data.college.code}
              />

              <InfoRow
                label="Total Departments"
                value={String(data.stats.departments)}
              />

              <InfoRow
                label="Total Programmes"
                value={String(data.stats.programmes)}
              />

              <InfoRow
                label="Total Semesters"
                value={String(data.stats.semesters)}
                last
              />

            </div>

          </section>


          {/* Quick Actions */}

          <section className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">

            <div className="mb-5 flex items-center gap-3">

              <Zap
                size={23}
                className="text-slate-600 dark:text-slate-300"
              />

              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Quick Actions
              </h2>

            </div>


            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">

              <QuickAction
                title="Add Department"
                description="Create a new department"
                href="/admin/college-setup"
                icon={<Plus size={19} />}
                className="bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300"
              />

              <QuickAction
                title="Add Programme"
                description="Create a new programme"
                href="/admin/college-setup"
                icon={<Plus size={19} />}
                className="bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
              />

              <QuickAction
                title="Add Teacher"
                description="Register a teacher"
                href="/admin/teachers"
                icon={<Plus size={19} />}
                className="bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300"
              />

              <QuickAction
                title="College Settings"
                description="Update college information"
                href="/admin/settings"
                icon={<Settings size={19} />}
                className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />

            </div>

          </section>

        </div>


        {/* -------------------------------- */}
        {/* STRUCTURE PREVIEW                */}
        {/* -------------------------------- */}

        <section className="mt-6 rounded-2xl border border-slate-300 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">

          <div className="mb-5 flex items-center justify-between">

            <div>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                College Academic Structure
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Your college is organized in the following hierarchy.
              </p>

            </div>

            <a
              href="/admin/college-setup"
              className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Manage Structure
              <ArrowRight size={16} />
            </a>

          </div>


          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

            <StructureCard
              number="1"
              title="Departments"
              description="Academic departments"
              icon={<Building2 size={25} />}
              className="bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-900"
            />

            <StructureCard
              number="2"
              title="Programmes"
              description="Programmes under departments"
              icon={<BookOpen size={25} />}
              className="bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900"
            />

            <StructureCard
              number="3"
              title="Semesters"
              description="Semesters under programmes"
              icon={<CalendarDays size={25} />}
              className="bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900"
            />

            <div className="flex flex-col items-center justify-center rounded-xl border border-amber-200 bg-amber-50 p-5 text-center dark:border-amber-900 dark:bg-amber-950/30">

              <GraduationCap
                size={28}
                className="mb-2 text-amber-700 dark:text-amber-400"
              />

              <p className="font-bold text-amber-900 dark:text-amber-300">
                College
              </p>

              <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                One college per Admin
              </p>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}


/* -------------------------------- */
/* Stat Card                        */
/* -------------------------------- */

function StatCard({
  title,
  value,
  icon,
  iconClass,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <div className="group flex items-center justify-between rounded-2xl border border-slate-300 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900">

      <div className="flex items-center gap-4">

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

        <div>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>

        </div>

      </div>

      <ChevronRight
        size={22}
        className="text-slate-400 transition group-hover:translate-x-1"
      />

    </div>
  );
}


/* -------------------------------- */
/* Information Row                  */
/* -------------------------------- */

function InfoRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-2 py-3.5 text-sm ${
        last
          ? ""
          : "border-b border-slate-200 dark:border-slate-700"
      }`}
    >

      <span className="text-slate-500 dark:text-slate-400">
        {label}
      </span>

      <span className="font-medium text-slate-900 dark:text-slate-100">
        {value}
      </span>

    </div>
  );
}


/* -------------------------------- */
/* Quick Action                     */
/* -------------------------------- */

function QuickAction({
  title,
  description,
  href,
  icon,
  className,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  className: string;
}) {
  return (
    <a
      href={href}
      className={`group rounded-xl p-4 transition hover:-translate-y-0.5 hover:shadow-sm ${className}`}
    >

      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 dark:bg-black/20">
        {icon}
      </div>

      <p className="font-bold">
        {title}
      </p>

      <p className="mt-1 text-xs opacity-80">
        {description}
      </p>

    </a>
  );
}


/* -------------------------------- */
/* Structure Card                   */
/* -------------------------------- */

function StructureCard({
  number,
  title,
  description,
  icon,
  className,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  className: string;
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${className}`}
    >

      <div className="mb-4 flex items-center justify-between">

        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold shadow-sm dark:bg-slate-900">
          {number}
        </span>

        {icon}

      </div>

      <p className="font-bold text-slate-900 dark:text-white">
        {title}
      </p>

      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
        {description}
      </p>

    </div>
  );
}