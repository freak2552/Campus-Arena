"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CourseSettingsPage() {
  const params = useParams();
  const router = useRouter();

  const courseId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    department: "",
    category: "",
    semester: "",
    level: "",
    credits: "",
    coverUrl: "",
    status: "DRAFT",
    visibility: "COLLEGE",
    studentAccess: "OPEN",
  });

  useEffect(() => {
    loadCourse();
  }, []);

  const loadCourse = async () => {
    try {
      const response = await fetch(
        `/api/teacher/courses/${courseId}/settings`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load course"
        );
      }

      const course = data.course;

      setForm({
        title: course.title || "",
        description: course.description || "",
        department: course.department || "",
        category: course.category || "",
        semester: course.semester || "",
        level: course.level || "",
        credits:
          course.credits !== null
            ? String(course.credits)
            : "",
        coverUrl: course.coverUrl || "",
        status: course.status || "DRAFT",
        visibility:
          course.visibility || "COLLEGE",
        studentAccess:
          course.studentAccess || "OPEN",
      });
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to load course"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateField = (
    field: string,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const saveChanges = async () => {
    setSaving(true);

    try {
      const response = await fetch(
        `/api/teacher/courses/${courseId}/settings`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            department: form.department,
            category: form.category,
            semester: form.semester,
            level: form.level,
            credits: form.credits,
            coverUrl: form.coverUrl,
            status: form.status,
            visibility: form.visibility,
            studentAccess: form.studentAccess,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save settings"
        );
      }

      alert("Course settings saved successfully.");
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save settings"
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteCourse = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course? This cannot be undone."
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/teacher/courses/${courseId}/settings`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete course"
        );
      }

      alert("Course deleted successfully.");

      router.push("/teacher/courses");
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete course"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="ml-64 pt-16">
          <div className="p-8">
            <p className="text-gray-600">
              Loading course settings...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <div className="p-8">

          {/* Header */}

          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Course Settings
            </h1>

            <p className="mt-2 text-gray-600">
              Manage the information and access settings
              of your course.
            </p>
          </div>

          <div className="mt-8 mx-auto max-w-4xl space-y-6">

            {/* Basic Information */}

            <div className="rounded-lg border bg-white p-6">

              <h2 className="text-lg font-semibold">
                Basic Information
              </h2>

              <div className="mt-6 space-y-5">

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Course Name
                  </label>

                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      updateField(
                        "title",
                        e.target.value
                      )
                    }
                    className="w-full rounded-md border px-4 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Short Description
                  </label>

                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) =>
                      updateField(
                        "description",
                        e.target.value
                      )
                    }
                    className="w-full rounded-md border px-4 py-3 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Department
                    </label>

                    <input
                      type="text"
                      value={form.department}
                      onChange={(e) =>
                        updateField(
                          "department",
                          e.target.value
                        )
                      }
                      className="w-full rounded-md border px-4 py-3 outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Subject / Category
                    </label>

                    <input
                      type="text"
                      value={form.category}
                      onChange={(e) =>
                        updateField(
                          "category",
                          e.target.value
                        )
                      }
                      className="w-full rounded-md border px-4 py-3 outline-none"
                    />
                  </div>

                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Semester
                    </label>

                    <input
                      type="text"
                      value={form.semester}
                      onChange={(e) =>
                        updateField(
                          "semester",
                          e.target.value
                        )
                      }
                      className="w-full rounded-md border px-4 py-3 outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Level
                    </label>

                    <input
                      type="text"
                      value={form.level}
                      onChange={(e) =>
                        updateField(
                          "level",
                          e.target.value
                        )
                      }
                      className="w-full rounded-md border px-4 py-3 outline-none"
                    />
                  </div>

                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Credits
                  </label>

                  <input
                    type="number"
                    value={form.credits}
                    onChange={(e) =>
                      updateField(
                        "credits",
                        e.target.value
                      )
                    }
                    className="w-full rounded-md border px-4 py-3 outline-none"
                  />
                </div>

              </div>
            </div>


            {/* Course Cover */}

            <div className="rounded-lg border bg-white p-6">

              <h2 className="text-lg font-semibold">
                Course Cover
              </h2>

              <div className="mt-6">

                <input
                  type="text"
                  value={form.coverUrl}
                  onChange={(e) =>
                    updateField(
                      "coverUrl",
                      e.target.value
                    )
                  }
                  placeholder="Paste course cover image URL"
                  className="w-full rounded-md border px-4 py-3"
                />

                {form.coverUrl && (
                  <div className="mt-4">
                    <img
                      src={form.coverUrl}
                      alt="Course cover"
                      className="h-48 w-full rounded-md object-cover"
                    />
                  </div>
                )}

              </div>
            </div>


            {/* Status */}

            <div className="rounded-lg border bg-white p-6">

              <h2 className="text-lg font-semibold">
                Course Status
              </h2>

              <div className="mt-6">

                <label className="mb-2 block text-sm font-medium">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    updateField(
                      "status",
                      e.target.value
                    )
                  }
                  className="w-full rounded-md border bg-white px-4 py-3"
                >
                  <option value="DRAFT">
                    Draft
                  </option>

                  <option value="PUBLISHED">
                    Published
                  </option>

                  <option value="ARCHIVED">
                    Archived
                  </option>
                </select>

              </div>
            </div>


            {/* Access & Visibility */}

            <div className="rounded-lg border bg-white p-6">

              <h2 className="text-lg font-semibold">
                Access & Visibility
              </h2>

              <div className="mt-6 space-y-5">

                <div>

                  <label className="mb-2 block text-sm font-medium">
                    Course Visibility
                  </label>

                  <select
                    value={form.visibility}
                    onChange={(e) =>
                      updateField(
                        "visibility",
                        e.target.value
                      )
                    }
                    className="w-full rounded-md border bg-white px-4 py-3"
                  >

                    <option value="PRIVATE">
                      Private
                    </option>

                    <option value="COLLEGE">
                      College Only
                    </option>

                    <option value="PUBLIC">
                      Public
                    </option>

                  </select>

                </div>


                <div>

                  <label className="mb-2 block text-sm font-medium">
                    Student Access
                  </label>

                  <select
                    value={form.studentAccess}
                    onChange={(e) =>
                      updateField(
                        "studentAccess",
                        e.target.value
                      )
                    }
                    className="w-full rounded-md border bg-white px-4 py-3"
                  >

                    <option value="OPEN">
                      Students can enroll
                    </option>

                    <option value="APPROVAL_REQUIRED">
                      Teacher approval required
                    </option>

                  </select>

                </div>

              </div>

            </div>


            {/* Save */}

            <div className="flex justify-end">

              <button
                type="button"
                onClick={saveChanges}
                disabled={saving}
                className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>


            {/* Danger Zone */}

            <div className="rounded-lg border border-red-200 bg-white p-6">

              <h2 className="text-lg font-semibold text-red-600">
                Danger Zone
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Deleting a course will remove the
                course and its associated content.
              </p>

              <button
                type="button"
                onClick={deleteCourse}
                className="mt-5 rounded-md border border-red-300 px-5 py-2 text-sm font-medium text-red-600"
              >
                Delete Course
              </button>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
}