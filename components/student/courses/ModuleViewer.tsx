"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

import MarkDoneButton from "@/components/student/courses/MarkDoneButton";
import ModuleContentBlock from "@/components/student/courses/ModuleContentBlock";
import { useModule } from "@/components/student/courses/ModuleProvider";

export default function ModuleViewer() {
  const { courseModule, loading, error, reload, setTopicCompleted } =
    useModule();

  // Jump to a topic when the page is opened with #topic-ID
  useEffect(() => {
    if (!courseModule) return;

    const hash = window.location.hash.slice(1);
    if (!hash) return;

    document.getElementById(hash)?.scrollIntoView({ block: "start" });
  }, [courseModule]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-5 px-4 py-8">
        <div className="h-24 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  }

  if (error || !courseModule) {
    return (
      <div className="mx-auto max-w-xl px-4 py-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950">
          <p className="text-sm text-red-700 dark:text-red-200">
            {error || "Module not found."}
          </p>

          <button
            type="button"
            onClick={reload}
            className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const courseHref = `/student/courses/${courseModule.course.id}`;

  const completed = new Set(courseModule.completedTopicIds);
  const totalTopics = courseModule.topics.length;
  const doneTopics = courseModule.topics.filter((topic) =>
    completed.has(topic.id)
  ).length;
  const donePercent =
    totalTopics === 0 ? 0 : Math.round((doneTopics / totalTopics) * 100);

  const navButton =
    "flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Module heading */}
      <header className="mb-6">
        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
          Module {courseModule.number}
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {courseModule.title}
        </h1>

        {totalTopics > 0 && (
          <div className="mt-3 flex items-center gap-3">
            <div className="h-2 w-40 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${donePercent}%` }}
              />
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              {doneTopics} of {totalTopics} topic{totalTopics === 1 ? "" : "s"}{" "}
              completed
            </p>
          </div>
        )}

        {courseModule.topics.length > 1 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {courseModule.topics.map((topic, topicIndex) => (
              <a
                key={topic.id}
                href={`#topic-${topic.id}`}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              >
                {courseModule.number}.{topicIndex + 1} {topic.title}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* Topics, one after another */}
      {courseModule.topics.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
          This module has no topics yet.
        </div>
      ) : (
        <div className="space-y-6">
          {courseModule.topics.map((topic, topicIndex) => (
            <section
              key={topic.id}
              id={`topic-${topic.id}`}
              className="scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6"
            >
              <h2 className="mb-5 flex items-baseline gap-3 text-xl font-bold text-slate-900 dark:text-white">
                <span className="text-base font-semibold text-slate-400">
                  {courseModule.number}.{topicIndex + 1}
                </span>
                {topic.title}
                {completed.has(topic.id) && (
                  <CheckCircle2
                    size={20}
                    className="shrink-0 self-center text-emerald-500"
                  />
                )}
              </h2>

              {topic.contentBlocks.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No content in this topic yet.
                </p>
              ) : (
                <div className="space-y-5">
                  {topic.contentBlocks.map((block) => (
                    <ModuleContentBlock key={block.id} block={block} />
                  ))}
                </div>
              )}

              <div className="mt-6 flex justify-end border-t border-slate-100 pt-4 dark:border-slate-800">
                <MarkDoneButton
                  courseId={courseModule.course.id}
                  topicId={topic.id}
                  completed={completed.has(topic.id)}
                  onChange={(value) => setTopicCompleted(topic.id, value)}
                />
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Previous / Next module */}
      <nav className="mt-10 flex items-center justify-between gap-3">
        {courseModule.prevModuleId ? (
          <Link
            href={`${courseHref}/modules/${courseModule.prevModuleId}`}
            className={navButton}
          >
            <ArrowLeft size={16} />
            Previous Module
          </Link>
        ) : (
          <Link href={courseHref} className={navButton}>
            <ArrowLeft size={16} />
            Course Overview
          </Link>
        )}

        {courseModule.nextModuleId ? (
          <Link
            href={`${courseHref}/modules/${courseModule.nextModuleId}`}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            Next Module
            <ArrowRight size={16} />
          </Link>
        ) : (
          <Link
            href={courseHref}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            Finish &amp; Back to Course
            <ArrowRight size={16} />
          </Link>
        )}
      </nav>
    </div>
  );
}
