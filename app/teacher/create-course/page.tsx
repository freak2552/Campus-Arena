"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateCoursePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    category: "",
    semester: "",
    level: "",
    credits: "",
    visibility: "COLLEGE",
    studentAccess: "OPEN",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/teacher/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          credits: formData.credits
            ? Number(formData.credits)
            : null,

          // Temporary teacher ID.
          // We will replace this with the logged-in teacher
          // from the session later.
          teacherId: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create course"
        );
      }

      setMessage("Course created successfully!");

      setTimeout(() => {
        router.push("/teacher/courses");
      }, 800);
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

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Area */}
      <main>

        <div className="p-8">

          <div className="mx-auto max-w-4xl">

            {/* Page Header */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Create Course
              </h1>

              <p className="mt-2 text-gray-600">
                Create a new course for your students.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 rounded-lg border bg-white p-6"
            >

              <div className="space-y-6">

                {/* Course Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Course Name
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter course name"
                    required
                    className="w-full rounded-md border px-4 py-3 outline-none focus:border-gray-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Short Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe the course briefly"
                    className="w-full rounded-md border px-4 py-3 outline-none focus:border-gray-500"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Department
                  </label>

                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g. Information Technology"
                    className="w-full rounded-md border px-4 py-3 outline-none focus:border-gray-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Subject / Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g. Database Management Systems"
                    className="w-full rounded-md border px-4 py-3 outline-none focus:border-gray-500"
                  />
                </div>

                {/* Semester + Level */}
                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Semester
                    </label>

                    <input
                      type="text"
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      placeholder="e.g. Semester 5"
                      className="w-full rounded-md border px-4 py-3 outline-none focus:border-gray-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Level
                    </label>

                    <input
                      type="text"
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      placeholder="e.g. Undergraduate"
                      className="w-full rounded-md border px-4 py-3 outline-none focus:border-gray-500"
                    />
                  </div>

                </div>

                {/* Credits */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Credits
                  </label>

                  <input
                    type="number"
                    name="credits"
                    value={formData.credits}
                    onChange={handleChange}
                    min="0"
                    placeholder="e.g. 4"
                    className="w-full rounded-md border px-4 py-3 outline-none focus:border-gray-500"
                  />
                </div>

                {/* Course Cover */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Course Cover
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    className="w-full rounded-md border px-4 py-3"
                  />
                </div>

                {/* Visibility */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Course Visibility
                  </label>

                  <select
                    name="visibility"
                    value={formData.visibility}
                    onChange={handleChange}
                    className="w-full rounded-md border bg-white px-4 py-3 outline-none"
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

                {/* Student Access */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Student Access
                  </label>

                  <select
                    name="studentAccess"
                    value={formData.studentAccess}
                    onChange={handleChange}
                    className="w-full rounded-md border bg-white px-4 py-3 outline-none"
                  >
                    <option value="OPEN">
                      Students can enroll
                    </option>

                    <option value="APPROVAL_REQUIRED">
                      Teacher approval required
                    </option>
                  </select>
                </div>

                {/* Messages */}
                {message && (
                  <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {message}
                  </div>
                )}

                {error && (
                  <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <div className="flex justify-end pt-4">

                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading
                      ? "Creating Course..."
                      : "Create Course"}
                  </button>

                </div>

              </div>

            </form>

          </div>

        </div>

      </main>

    </div>
  );
}