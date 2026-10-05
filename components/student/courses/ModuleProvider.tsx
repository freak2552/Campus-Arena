"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import type { StudentModuleDetail } from "@/types/student-module";

type ModuleContextValue = {
  courseModule: StudentModuleDetail | null;
  loading: boolean;
  error: string;
  reload: () => void;
  setTopicCompleted: (topicId: number, completed: boolean) => void;
};

const ModuleContext = createContext<ModuleContextValue | null>(null);

// Loads the module once for the top bar and the viewer.
export function ModuleProvider({
  courseId,
  moduleId,
  children,
}: {
  courseId: string;
  moduleId: string;
  children: ReactNode;
}) {
  const router = useRouter();

  const [courseModule, setCourseModule] = useState<StudentModuleDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadModule() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/student/courses/${courseId}/modules/${moduleId}`,
          { cache: "no-store", signal: controller.signal }
        );

        if (response.status === 401) {
          router.replace("/auth/login");
          return;
        }

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load module.");
        }

        setCourseModule(data.module);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;

        setCourseModule(null);
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadModule();

    return () => controller.abort();
  }, [courseId, moduleId, router, reloadKey]);

  // Updates the screen right after a topic is marked done / undone
  const setTopicCompleted = (topicId: number, completed: boolean) => {
    setCourseModule((previous) => {
      if (!previous) return previous;

      const ids = new Set(previous.completedTopicIds);

      if (completed) {
        ids.add(topicId);
      } else {
        ids.delete(topicId);
      }

      return { ...previous, completedTopicIds: Array.from(ids) };
    });
  };

  return (
    <ModuleContext.Provider
      value={{
        courseModule,
        loading,
        error,
        reload: () => setReloadKey((key) => key + 1),
        setTopicCompleted,
      }}
    >
      {children}
    </ModuleContext.Provider>
  );
}

export function useModule() {
  const value = useContext(ModuleContext);

  if (!value) {
    throw new Error("useModule must be used inside ModuleProvider");
  }

  return value;
}
