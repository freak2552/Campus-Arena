"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Course = {
  id: number;
  title: string;
  description: string | null;

  department: {
    id: number;
    name: string;
  } | null;

  programmes: {
    programme: {
      id: number;
      name: string;
    };
  }[];

  semesters: {
    semester: {
      id: number;
      number: number;
      programmeId: number;
    };
  }[];

  category: string | null;
  level: string | null;
  credits: number | null;

  status: string;
  visibility: string;
  studentAccess: string;

  modules: {
    id: number;
    title: string;
    topics: {
      id: number;
      title: string;
    }[];
  }[];
};

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetch("/api/teacher/courses");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load courses"
          );
        }

        setCourses(data.courses || []);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <div className="mx-auto max-w-6xl">

          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                My Courses
              </h1>

              <p className="mt-2 text-gray-600">
                Manage your courses and course content.
              </p>
            </div>

            <Link
              href="/teacher/create-course"
              className="rounded-md bg-black px-5 py-3 text-sm font-medium text-white"
            >
              + Create Course
            </Link>
          </div>

          {/* ==================================================
              LOADING
          ================================================== */}

          {loading && (
            <div className="mt-8 rounded-lg border bg-white p-8 text-center text-gray-500">
              Loading courses...
            </div>
          )}

          {/* ==================================================
              ERROR
          ================================================== */}

          {!loading && error && (
            <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
              {error}
            </div>
          )}

          {/* ==================================================
              EMPTY
          ================================================== */}

          {!loading &&
            !error &&
            courses.length === 0 && (
              <div className="mt-8 rounded-lg border bg-white p-10 text-center">

                <h2 className="text-lg font-semibold">
                  No courses yet
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Create your first course to start
                  building your content.
                </p>

                <Link
                  href="/teacher/create-course"
                  className="mt-5 inline-block rounded-md bg-black px-5 py-3 text-sm text-white"
                >
                  Create Course
                </Link>

              </div>
            )}

          {/* ==================================================
              COURSES
          ================================================== */}

          {!loading &&
            !error &&
            courses.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-6">

                {courses.map((course) => {

                  const topicCount =
                    course.modules.reduce(
                      (total, module) =>
                        total +
                        module.topics.length,
                      0
                    );

                  return (
                    <div
                      key={course.id}
                      className="rounded-lg border bg-white p-6"
                    >

                      {/* ========================================
                          COURSE HEADER
                      ======================================== */}

                      <div className="flex items-start justify-between">

                        <div>
                          <h2 className="text-lg font-semibold">
                            {course.title}
                          </h2>

                          <p className="mt-2 text-sm text-gray-500">
                            {course.description ||
                              "No description provided."}
                          </p>
                        </div>

                        <span className="rounded-full border px-3 py-1 text-xs">
                          {course.status}
                        </span>

                      </div>

                      {/* ========================================
                          COURSE INFORMATION
                      ======================================== */}

                      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">

                        {/* Department */}

                        <div>
                          <span className="text-gray-500">
                            Department
                          </span>

                          <p className="font-medium">
                            {course.department?.name ||
                              "-"}
                          </p>
                        </div>

                        {/* Programmes */}

                        <div>
                          <span className="text-gray-500">
                            Programme
                          </span>

                          <div className="mt-1 space-y-1">
                            {course.programmes.length >
                            0 ? (
                              course.programmes.map(
                                ({
                                  programme,
                                }) => (
                                  <p
                                    key={
                                      programme.id
                                    }
                                    className="font-medium"
                                  >
                                    {programme.name}
                                  </p>
                                )
                              )
                            ) : (
                              <p className="font-medium">
                                -
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Semesters */}

                        <div>
                          <span className="text-gray-500">
                            Semester
                          </span>

                          <div className="mt-1 flex flex-wrap gap-1">
                            {course.semesters.length >
                            0 ? (
                              course.semesters.map(
                                ({
                                  semester,
                                }) => (
                                  <span
                                    key={
                                      semester.id
                                    }
                                    className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium"
                                  >
                                    Sem{" "}
                                    {
                                      semester.number
                                    }
                                  </span>
                                )
                              )
                            ) : (
                              <span className="font-medium">
                                -
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Modules */}

                        <div>
                          <span className="text-gray-500">
                            Modules
                          </span>

                          <p className="font-medium">
                            {course.modules.length}
                          </p>
                        </div>

                        {/* Topics */}

                        <div>
                          <span className="text-gray-500">
                            Topics
                          </span>

                          <p className="font-medium">
                            {topicCount}
                          </p>
                        </div>

                      </div>

                      {/* ========================================
                          ACTIONS
                      ======================================== */}

                      <div className="mt-6 flex gap-3">

                        <Link
                          href={`/teacher/courses/${course.id}/builder`}
                          className="rounded-md bg-black px-4 py-2 text-sm text-white"
                        >
                          Course Builder
                        </Link>

                        <Link
                          href={`/teacher/courses/${course.id}/settings`}
                          className="rounded-md border px-4 py-2 text-sm"
                        >
                          Settings
                        </Link>

                      </div>

                    </div>
                  );
                })}

              </div>
            )}

        </div>
      </div>
    </div>
  );
}