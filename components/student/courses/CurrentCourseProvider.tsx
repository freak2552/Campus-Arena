"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import type { StudentCourseDetail } from "@/types/student-course-detail";

type CurrentCourseContextValue = {
  course: StudentCourseDetail | null;
  loading: boolean;
  error: string;
  reload: () => void;
};

const CurrentCourseContext = createContext<CurrentCourseContextValue | null>(
  null
);

// Loads the course once for the whole Current Course section,
// so the sidebar and the page share the same data.
export function CurrentCourseProvider({
  courseId,
  children,
}: {
  courseId: string;
  children: ReactNode;
}) {
  const router = useRouter();

  const [course, setCourse] = useState<StudentCourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCourse() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/student/courses/${courseId}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (response.status === 401) {
          router.replace("/auth/login");
          return;
        }

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load course.");
        }

        setCourse(data.course);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;

        setCourse(null);
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadCourse();

    return () => controller.abort();
  }, [courseId, router, reloadKey]);

  return (
    <CurrentCourseContext.Provider
      value={{
        course,
        loading,
        error,
        reload: () => setReloadKey((key) => key + 1),
      }}
    >
      {children}
    </CurrentCourseContext.Provider>
  );
}

export function useCurrentCourse() {
  const value = useContext(CurrentCourseContext);

  if (!value) {
    throw new Error("useCurrentCourse must be used inside CurrentCourseProvider");
  }

  return value;
}
