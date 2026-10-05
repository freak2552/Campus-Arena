"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, ChevronRight, Circle, ListChecks } from "lucide-react";

import {
  getCurrentModule,
  getModuleProgress,
} from "@/components/student/courses/courseProgress";
import type { StudentCourseDetail } from "@/types/student-course-detail";

const badgeColors = [
  "bg-emerald-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-pink-500",
];

export default function CourseModulesList({
  course,
}: {
  course: StudentCourseDetail;
}) {
  const completed = new Set(course.completedTopicIds);

  // Start with the module the student is currently on expanded
  const [openIds, setOpenIds] = useState<Set<number>>(() => {
    const current = getCurrentModule(course);
    return new Set(current ? [current.module.id] : []);
  });

  const allOpen =
    course.modules.length > 0 && openIds.size === course.modules.length;

  function toggleModule(id: number) {
    setOpenIds((previous) => {
      const next = new Set(previous);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  function toggleAll() {
    setOpenIds(
      allOpen ? new Set() : new Set(course.modules.map((item) => item.id))
    );
  }

  return (
    <section id="course-modules" className="scroll-mt-24">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Course Modules
        </h2>

        {course.modules.length > 0 && (
          <button
            type="button"
            onClick={toggleAll}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            <ListChecks size={16} />
            {allOpen ? "Collapse All" : "Expand All"}
          </button>
        )}
      </div>

      {course.modules.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
          Your teacher hasn&apos;t added any modules yet.
        </div>
      ) : (
        <div className="space-y-3">
          {course.modules.map((courseModule, moduleIndex) => {
            const isOpen = openIds.has(courseModule.id);
            const progress = getModuleProgress(courseModule, completed);

            return (
              <div
                key={courseModule.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <button
                  type="button"
                  onClick={() => toggleModule(courseModule.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 p-4 text-left"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                      badgeColors[moduleIndex % badgeColors.length]
                    }`}
                  >
                    {moduleIndex + 1}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-slate-900 dark:text-white">
                      {courseModule.title}
                    </span>

                    <span className="block text-sm text-slate-500 dark:text-slate-400">
                      {progress.total} topic{progress.total === 1 ? "" : "s"}
                    </span>
                  </span>

                  <span className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {progress.percent}%
                    </span>

                    <span className="hidden h-2 w-28 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 sm:block">
                      <span
                        className="block h-full rounded-full bg-emerald-500"
                        style={{ width: `${progress.percent}%` }}
                      />
                    </span>

                    <ChevronDown
                      size={18}
                      className={`text-slate-500 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-2 dark:border-slate-800 dark:bg-slate-950/40">
                    {courseModule.topics.length === 0 ? (
                      <p className="py-3 text-sm text-slate-500 dark:text-slate-400">
                        No topics in this module yet.
                      </p>
                    ) : (
                      courseModule.topics.map((topic, topicIndex) => {
                        const done = completed.has(topic.id);

                        return (
                          <Link
                            key={topic.id}
                            href={`/student/courses/${course.id}/modules/${courseModule.id}#topic-${topic.id}`}
                            className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm transition-colors hover:bg-white dark:hover:bg-slate-800"
                          >
                            {done ? (
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                                <Check size={13} strokeWidth={3} />
                              </span>
                            ) : (
                              <Circle
                                size={20}
                                className="shrink-0 text-slate-300 dark:text-slate-600"
                              />
                            )}

                            <span className="w-8 shrink-0 text-slate-400">
                              {moduleIndex + 1}.{topicIndex + 1}
                            </span>

                            <span className="min-w-0 flex-1 truncate text-slate-800 dark:text-slate-100">
                              {topic.title}
                            </span>

                            <ChevronRight
                              size={16}
                              className="shrink-0 text-slate-400"
                            />
                          </Link>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
