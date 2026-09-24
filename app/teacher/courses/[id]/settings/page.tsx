"use client";

export default function CourseSettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      <main className="ml-64 pt-16">
        <div className="p-8">

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Course Settings
            </h1>

            <p className="mt-2 text-gray-600">
              Manage the information and access settings of your course.
            </p>
          </div>

          <div className="mt-8 max-w-4xl space-y-6">

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
                    defaultValue="Database Management Systems"
                    className="w-full rounded-md border px-4 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Short Description
                  </label>

                  <textarea
                    rows={4}
                    defaultValue="Learn the fundamentals of database management systems."
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
                      defaultValue="Information Technology"
                      className="w-full rounded-md border px-4 py-3 outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Subject / Category
                    </label>

                    <input
                      type="text"
                      defaultValue="Database Management"
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
                      defaultValue="Semester 5"
                      className="w-full rounded-md border px-4 py-3 outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Level
                    </label>

                    <input
                      type="text"
                      defaultValue="Undergraduate"
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
                    defaultValue="4"
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
                  type="file"
                  accept="image/*"
                  className="w-full rounded-md border px-4 py-3"
                />

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
                    defaultValue="college"
                    className="w-full rounded-md border bg-white px-4 py-3"
                  >
                    <option value="private">
                      Private
                    </option>

                    <option value="college">
                      College Only
                    </option>

                    <option value="public">
                      Public
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Student Access
                  </label>

                  <select
                    defaultValue="enrollment"
                    className="w-full rounded-md border bg-white px-4 py-3"
                  >
                    <option value="enrollment">
                      Students can enroll
                    </option>

                    <option value="teacher-only">
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
                className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white"
              >
                Save Changes
              </button>

            </div>

            {/* Danger Zone */}
            <div className="rounded-lg border border-red-200 bg-white p-6">

              <h2 className="text-lg font-semibold text-red-600">
                Danger Zone
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Deleting a course will remove the course and its
                associated content.
              </p>

              <button
                type="button"
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