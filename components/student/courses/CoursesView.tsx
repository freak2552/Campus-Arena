"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import CourseCard from "@/components/student/courses/CourseCard";
import type { EnrollmentStatus, StudentCourse } from "@/types/student-course";

type CoursesViewProps = {
  view: "my" | "explore";
};

type Banner = { type: "success" | "error"; text: string };

const TEXT = {
  my: {
    title: "My Courses",
    subtitle: "Courses you have joined.",
  },
  explore: {
    title: "Explore Courses",
    subtitle:
      "Courses available for your department, programme and semester.",
  },
};

export default function CoursesView({ view }: CoursesViewProps) {
  const router = useRouter();

  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [enrollingId, setEnrollingId] = useState<number | null>(null);
  const [banner, setBanner] = useState<Banner | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCourses() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/student/courses?view=${view}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (response.status === 401) {
          router.replace("/auth/login");
          return;
        }

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load courses.");
        }

        setCourses(data.courses);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;

        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadCourses();

    return () => controller.abort();
  }, [view, router, reloadKey]);

  async function handleEnroll(course: StudentCourse) {
    setEnrollingId(course.id);
    setBanner(null);

    try {
      const response = await fetch(`/api/student/courses/${course.id}/enroll`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not enroll in this course.");
      }

      setCourses((previous) =>
        previous.map((item) =>
          item.id === course.id
            ? { ...item, enrollmentStatus: data.status as EnrollmentStatus }
            : item
        )
      );

      setBanner({ type: "success", text: `${course.title}: ${data.message}` });
    } catch (err) {
      setBanner({
        type: "error",
        text: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setEnrollingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {TEXT[view].title}
        </h1>

        <p className="mt-1 text-slate-500 dark:text-slate-400">
          {TEXT[view].subtitle}
        </p>
      </div>

      {banner && (
        <div
          className={`mb-5 rounded-lg border px-4 py-3 text-sm ${
            banner.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
              : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
          }`}
        >
          {banner.text}
        </div>
      )}

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-80 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950">
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>

          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="mt-3 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100"
          >
            Try again
          </button>
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
          {view === "my" ? (
            <>
              <p className="font-semibold text-slate-800 dark:text-slate-100">
                You haven&apos;t joined any courses yet.
              </p>

              <Link
                href="/student/courses/explore"
                className="mt-4 inline-block rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Explore Courses
              </Link>
            </>
          ) : (
            <p className="text-slate-600 dark:text-slate-400">
              No new courses are available for your department, programme and
              semester right now.
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              mode={view}
              enrolling={enrollingId === course.id}
              onEnroll={handleEnroll}
            />
          ))}
        </div>
      )}
    </div>
  );
}
