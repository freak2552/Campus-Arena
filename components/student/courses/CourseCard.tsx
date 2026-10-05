import Link from "next/link";
import { BookOpen, Layers, User } from "lucide-react";

import type { StudentCourse } from "@/types/student-course";

type CourseCardProps = {
  course: StudentCourse;
  mode: "my" | "explore";
  enrolling: boolean;
  onEnroll: (course: StudentCourse) => void;
};

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

const buttonBase =
  "flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition";

export default function CourseCard({
  course,
  mode,
  enrolling,
  onEnroll,
}: CourseCardProps) {
  const isEnrolled = mode === "my" || course.enrollmentStatus === "ACTIVE";
  const isPending = course.enrollmentStatus === "PENDING";

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900">
      {/* Cover */}
      {course.coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={course.coverUrl}
          alt=""
          className="h-36 w-full object-cover"
        />
      ) : (
        <div className="flex h-36 w-full items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 text-white/90">
          <BookOpen size={40} />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        {/* Badges */}
        {(course.category || course.level) && (
          <div className="mb-2 flex flex-wrap gap-2">
            {course.category && (
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                {course.category}
              </span>
            )}

            {course.level && (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {course.level}
              </span>
            )}
          </div>
        )}

        <h3 className="line-clamp-2 text-lg font-bold text-slate-900 dark:text-white">
          {course.title}
        </h3>

        {course.description && (
          <p className="mt-1.5 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">
            {course.description}
          </p>
        )}

        <div className="mt-4 space-y-1.5 text-sm text-slate-500 dark:text-slate-400">
          <p className="flex items-center gap-2">
            <User size={15} className="shrink-0" />
            {course.teacherName}
          </p>

          <p className="flex items-center gap-2">
            <Layers size={15} className="shrink-0" />
            {plural(course.moduleCount, "module")} •{" "}
            {plural(course.topicCount, "topic")}
          </p>
        </div>

        {/* Action */}
        <div className="mt-5 pt-1">
          {isEnrolled ? (
            <Link
              href={`/student/courses/${course.id}`}
              className={`${buttonBase} bg-emerald-600 text-white hover:bg-emerald-700`}
            >
              Open course
            </Link>
          ) : isPending ? (
            <button
              type="button"
              disabled
              className={`${buttonBase} cursor-not-allowed bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400`}
            >
              Waiting for approval
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onEnroll(course)}
              disabled={enrolling}
              className={`${buttonBase} bg-emerald-600 text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {enrolling
                ? "Please wait..."
                : course.studentAccess === "APPROVAL_REQUIRED"
                ? "Request to join"
                : "Enroll"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
