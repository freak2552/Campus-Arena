"use client";

import Link from "next/link";
import {
  Building2,
  CalendarDays,
  ChevronRight,
  Clock,
  FileText,
  Lock,
  MessageCircle,
  Play,
  Trophy,
  TrendingUp,
  User,
} from "lucide-react";

import CourseModulesList from "@/components/student/courses/CourseModulesList";
import { useCurrentCourse } from "@/components/student/courses/CurrentCourseProvider";
import {
  EXAM_UNLOCK_PERCENT,
  getCourseProgress,
  getCurrentModule,
} from "@/components/student/courses/courseProgress";

const cardClass =
  "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900";

const chipClass =
  "rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300";

function ProgressRing({ percent }: { percent: number }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative h-20 w-20 shrink-0">
      <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          strokeWidth="8"
          className="stroke-slate-200 dark:stroke-slate-700"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-emerald-500"
        />
      </svg>

      <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-900 dark:text-white">
        {percent}%
      </span>
    </div>
  );
}

function SoonCard({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div
      aria-disabled="true"
      className="flex cursor-not-allowed items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 opacity-70 dark:border-slate-700 dark:bg-slate-900/70"
    >
      {icon}

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
          {title}
        </p>
        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      </div>

      <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        Soon
      </span>
    </div>
  );
}

export default function CourseOverview() {
  const { course, loading, error, reload } = useCurrentCourse();

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-5 p-4 sm:p-6 lg:p-8">
        <div className="h-40 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-28 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="mx-auto max-w-xl p-4 sm:p-6 lg:p-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950">
          <p className="text-sm text-red-700 dark:text-red-200">
            {error || "Course not found."}
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={reload}
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100"
            >
              Try again
            </button>

            <Link
              href="/student/courses/explore"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const progress = getCourseProgress(course);
  const current = getCurrentModule(course);
  const examUnlocked = progress.percent >= EXAM_UNLOCK_PERCENT;

  const updatedLabel = new Date(course.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  const semesterLabel =
    course.semesterNumbers.length > 0
      ? `Semester ${course.semesterNumbers.join(", ")}`
      : "—";

  const continueHref = current
    ? `/student/courses/${course.id}/modules/${current.module.id}`
    : `/student/courses/${course.id}`;

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      {/* Breadcrumb */}
      <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
        <Link
          href="/student/courses"
          className="hover:text-slate-800 dark:hover:text-slate-200"
        >
          My Courses
        </Link>
        <ChevronRight size={14} />
        <span className="truncate font-medium text-slate-700 dark:text-slate-200">
          {course.title}
        </span>
      </nav>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* LEFT COLUMN */}
        <div className="min-w-0 space-y-5">
          {/* Hero */}
          <section className="flex items-center justify-between gap-6 rounded-2xl border border-slate-200 bg-gradient-to-r from-amber-50 via-white to-blue-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                {course.title}
              </h1>

              <div className="mt-4 flex flex-wrap gap-2">
                {course.category && (
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {course.category}
                  </span>
                )}

                {course.level && <span className={chipClass}>{course.level}</span>}

                {course.credits !== null && (
                  <span className={chipClass}>{course.credits} Credits</span>
                )}

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  {course.modules.length} Module
                  {course.modules.length === 1 ? "" : "s"}
                </span>

                <span className={chipClass}>Updated {updatedLabel}</span>
              </div>
            </div>

            {course.coverUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={course.coverUrl}
                alt=""
                className="hidden h-28 w-44 shrink-0 rounded-xl object-cover md:block"
              />
            )}
          </section>

          {/* Progress */}
          <section className={`${cardClass} grid gap-5 md:grid-cols-2`}>
            <div className="flex items-center gap-5">
              <ProgressRing percent={progress.percent} />

              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-900 dark:text-white">
                  Your Progress
                </p>

                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  You&apos;ve completed {progress.done} of {progress.total}{" "}
                  topic{progress.total === 1 ? "" : "s"}
                </p>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <p className="font-bold text-slate-900 dark:text-white">
                {progress.percent === 0
                  ? "Ready to start?"
                  : examUnlocked
                  ? "Great work!"
                  : "You're doing great!"}
              </p>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {examUnlocked
                  ? "You've unlocked the course exam in Compete."
                  : `Complete ${EXAM_UNLOCK_PERCENT}% to unlock the ${course.title} course exam in Compete.`}
              </p>
            </div>
          </section>

          {/* Quick actions */}
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href={continueHref}
              className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 transition hover:shadow-md dark:border-emerald-900 dark:bg-emerald-950"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Play size={18} fill="currentColor" />
              </span>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  Continue Learning
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {current
                    ? `Module ${current.number} · ${current.module.title}`
                    : "No modules yet"}
                </p>
              </div>

              <ChevronRight size={16} className="ml-auto shrink-0 text-slate-400" />
            </Link>

            <SoonCard
              icon={
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-300">
                  <FileText size={18} />
                </span>
              }
              title="Course Resources"
              subtitle="Notes, PDFs, Links"
            />

            <SoonCard
              icon={
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300">
                  <MessageCircle size={18} />
                </span>
              }
              title="Ask a Doubt"
              subtitle="Go to Discussions"
            />

            <SoonCard
              icon={
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                  <TrendingUp size={18} />
                </span>
              }
              title="View Progress"
              subtitle="See detailed stats"
            />
          </section>

          {/* Modules */}
          <CourseModulesList course={course} />
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-5">
          <section className={cardClass}>
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
              About This Course
            </h2>

            <dl className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
              <div className="flex items-center gap-3 py-3">
                <User size={17} className="shrink-0 text-slate-400" />
                <dt className="w-24 shrink-0 text-slate-600 dark:text-slate-300">
                  Instructor
                </dt>
                <dd className="min-w-0 flex-1 truncate font-medium text-slate-900 dark:text-white">
                  {course.teacherName}
                </dd>
              </div>

              <div className="flex items-center gap-3 py-3">
                <CalendarDays size={17} className="shrink-0 text-slate-400" />
                <dt className="w-24 shrink-0 text-slate-600 dark:text-slate-300">
                  Semester
                </dt>
                <dd className="min-w-0 flex-1 truncate font-medium text-slate-900 dark:text-white">
                  {semesterLabel}
                </dd>
              </div>

              <div className="flex items-center gap-3 py-3">
                <Building2 size={17} className="shrink-0 text-slate-400" />
                <dt className="w-24 shrink-0 text-slate-600 dark:text-slate-300">
                  Department
                </dt>
                <dd className="min-w-0 flex-1 font-medium text-slate-900 dark:text-white">
                  {course.departmentName}
                </dd>
              </div>

              <div className="flex items-center gap-3 py-3">
                <Clock size={17} className="shrink-0 text-slate-400" />
                <dt className="w-24 shrink-0 text-slate-600 dark:text-slate-300">
                  Last Updated
                </dt>
                <dd className="min-w-0 flex-1 font-medium text-slate-900 dark:text-white">
                  {updatedLabel}
                </dd>
              </div>
            </dl>
          </section>

          {/* Teacher's course description (replaces "What You'll Learn") */}
          <section className={cardClass}>
            <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">
              Course Description
            </h2>

            {course.description ? (
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {course.description}
              </p>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Your teacher hasn&apos;t added a description yet.
              </p>
            )}
          </section>

          {/* Exam */}
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm dark:border-amber-900 dark:bg-amber-950/40">
            <div className="flex items-center gap-2">
              <Trophy size={20} className="text-amber-500" />

              <h2 className="font-bold text-slate-900 dark:text-white">
                Course Exam{" "}
                <span className="font-semibold text-orange-500">
                  (In Compete)
                </span>
              </h2>

              {!examUnlocked && (
                <Lock size={16} className="ml-auto text-red-500" />
              )}
            </div>

            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Complete at least {EXAM_UNLOCK_PERCENT}% of the course to unlock
              the exam in Compete.
            </p>

            <p className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
              {progress.percent}% / {EXAM_UNLOCK_PERCENT}%
            </p>

            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-amber-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{
                  width: `${Math.min(
                    100,
                    (progress.percent / EXAM_UNLOCK_PERCENT) * 100
                  )}%`,
                }}
              />
            </div>

            <Link
              href="/student/compete"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Go to Compete
              <ChevronRight size={16} />
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
