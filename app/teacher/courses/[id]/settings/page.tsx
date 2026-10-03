"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Semester = {
  id: number;
  number: number;
  programmeId: number;
};

type Programme = {
  id: number;
  name: string;
  departmentId: number;
  semesters: Semester[];
};

type Department = {
  id: number;
  name: string;
  programmes: Programme[];
};

type Course = {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  level: string | null;
  credits: number | null;
  coverUrl: string | null;
  status: string;
  visibility: string;
  studentAccess: string;

  department: {
    id: number;
    name: string;
  };

  programmes: {
    programme: {
      id: number;
      name: string;
      departmentId: number;
    };
  }[];

  semesters: {
    semester: {
      id: number;
      number: number;
      programmeId: number;
    };
  }[];
};

export default function CourseSettingsPage() {
  const params = useParams();
  const router = useRouter();

  const courseId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [academicLoading, setAcademicLoading] =
    useState(true);

  const [departments, setDepartments] = useState<
    Department[]
  >([]);

  const [departmentId, setDepartmentId] =
    useState("");

  const [selectedProgrammeIds, setSelectedProgrammeIds] =
    useState<number[]>([]);

  const [selectedSemesterIds, setSelectedSemesterIds] =
    useState<number[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    level: "",
    credits: "",
    coverUrl: "",
    status: "DRAFT",
    visibility: "COLLEGE",
    studentAccess: "OPEN",
  });

  // ============================================================
  // LOAD COURSE + ACADEMIC STRUCTURE
  // ============================================================

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        loadCourse(),
        loadAcademicStructure(),
      ]);
    };

    loadData();
  }, []);

  // ============================================================
  // LOAD COURSE
  // ============================================================

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

      const course: Course = data.course;

      setForm({
        title: course.title || "",
        description: course.description || "",
        category: course.category || "",
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

      setDepartmentId(
        String(course.department.id)
      );

      setSelectedProgrammeIds(
        course.programmes.map(
          ({ programme }) => programme.id
        )
      );

      setSelectedSemesterIds(
        course.semesters.map(
          ({ semester }) => semester.id
        )
      );
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

  // ============================================================
  // LOAD ACADEMIC STRUCTURE
  // ============================================================

  const loadAcademicStructure = async () => {
    try {
      const response = await fetch(
        "/api/teacher/academic-structure"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to load academic structure"
        );
      }

      setDepartments(data.departments || []);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to load academic structure"
      );
    } finally {
      setAcademicLoading(false);
    }
  };

  // ============================================================
  // SELECTED DEPARTMENT
  // ============================================================

  const selectedDepartment = useMemo(() => {
    return departments.find(
      (department) =>
        department.id === Number(departmentId)
    );
  }, [departments, departmentId]);

  const availableProgrammes =
    selectedDepartment?.programmes || [];

  // ============================================================
  // AVAILABLE SEMESTERS
  // ============================================================

  const availableSemesters = useMemo(() => {
    const semesters: Semester[] = [];

    for (const programme of availableProgrammes) {
      if (
        selectedProgrammeIds.includes(programme.id)
      ) {
        semesters.push(...programme.semesters);
      }
    }

    return semesters;
  }, [
    availableProgrammes,
    selectedProgrammeIds,
  ]);

  // ============================================================
  // FORM FIELD
  // ============================================================

  const updateField = (
    field: string,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // ============================================================
  // DEPARTMENT CHANGE
  // ============================================================

  const handleDepartmentChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newDepartmentId = e.target.value;

    setDepartmentId(newDepartmentId);

    setSelectedProgrammeIds([]);
    setSelectedSemesterIds([]);
  };

  // ============================================================
  // PROGRAMME TOGGLE
  // ============================================================

  const handleProgrammeToggle = (
    programmeId: number
  ) => {
    const isSelected =
      selectedProgrammeIds.includes(programmeId);

    if (isSelected) {
      setSelectedProgrammeIds((previous) =>
        previous.filter(
          (id) => id !== programmeId
        )
      );

      const programme =
        availableProgrammes.find(
          (item) => item.id === programmeId
        );

      if (programme) {
        const semesterIds =
          programme.semesters.map(
            (semester) => semester.id
          );

        setSelectedSemesterIds((previous) =>
          previous.filter(
            (id) => !semesterIds.includes(id)
          )
        );
      }

      return;
    }

    setSelectedProgrammeIds((previous) => [
      ...previous,
      programmeId,
    ]);
  };

  // ============================================================
  // SEMESTER TOGGLE
  // ============================================================

  const handleSemesterToggle = (
    semesterId: number
  ) => {
    setSelectedSemesterIds((previous) => {
      if (previous.includes(semesterId)) {
        return previous.filter(
          (id) => id !== semesterId
        );
      }

      return [...previous, semesterId];
    });
  };

  // ============================================================
  // UPDATE COURSE STATUS
  // ============================================================

  const updateCourseStatus = async (status: string) => {
    const response = await fetch(
      `/api/teacher/courses/${courseId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to update course status"
      );
    }

    return data;
  };

  // ============================================================
  // SAVE
  // ============================================================

  const saveChanges = async () => {
    setSaving(true);

    try {
      if (!departmentId) {
        throw new Error(
          "Please select a department."
        );
      }

      if (selectedProgrammeIds.length === 0) {
        throw new Error(
          "Please select at least one programme."
        );
      }

      if (selectedSemesterIds.length === 0) {
        throw new Error(
          "Please select at least one semester."
        );
      }

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

            departmentId: Number(
              departmentId
            ),

            programmeIds:
              selectedProgrammeIds,

            semesterIds:
              selectedSemesterIds,

            category: form.category,
            level: form.level,
            credits: form.credits,
            coverUrl: form.coverUrl,
            visibility: form.visibility,
            studentAccess:
              form.studentAccess,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to save settings"
        );
      }

      // Update course status separately
      if (form.status) {
        await updateCourseStatus(form.status);
      }

      alert(
        "Course settings saved successfully."
      );
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

  // ============================================================
  // DELETE COURSE
  // ============================================================

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
          data.message ||
          "Failed to delete course"
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

  // ============================================================
  // LOADING
  // ============================================================

  if (loading || academicLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main>
          <div className="p-8">
            <p className="text-gray-600">
              Loading course settings...
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ============================================================
  // UI
  // ============================================================

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
              Manage the information and access
              settings of your course.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-4xl space-y-6">

            {/* ==================================================
                BASIC INFORMATION
            ================================================== */}

            <div className="rounded-lg border bg-white p-6">

              <h2 className="text-lg font-semibold">
                Basic Information
              </h2>

              <div className="mt-6 space-y-5">

                {/* Course Name */}

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

                {/* Description */}

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

                {/* Department + Category */}

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Department
                    </label>

                    <select
                      value={departmentId}
                      onChange={
                        handleDepartmentChange
                      }
                      className="w-full rounded-md border bg-white px-4 py-3 outline-none"
                    >
                      <option value="">
                        Select department
                      </option>

                      {departments.map(
                        (department) => (
                          <option
                            key={department.id}
                            value={department.id}
                          >
                            {department.name}
                          </option>
                        )
                      )}
                    </select>
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

                {/* ==================================================
                    PROGRAMMES
                ================================================== */}

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Programme
                  </label>

                  {!departmentId ? (
                    <div className="rounded-md border bg-gray-50 px-4 py-3 text-sm text-gray-500">
                      Select a department first.
                    </div>
                  ) : (
                    <div className="space-y-2 rounded-md border p-3">

                      {availableProgrammes.length ===
                        0 ? (
                        <p className="text-sm text-gray-500">
                          No programmes available.
                        </p>
                      ) : (
                        availableProgrammes.map(
                          (programme) => (
                            <label
                              key={programme.id}
                              className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-50"
                            >
                              <input
                                type="checkbox"
                                checked={selectedProgrammeIds.includes(
                                  programme.id
                                )}
                                onChange={() =>
                                  handleProgrammeToggle(
                                    programme.id
                                  )
                                }
                                className="h-4 w-4"
                              />

                              <span className="text-sm">
                                {programme.name}
                              </span>
                            </label>
                          )
                        )
                      )}

                    </div>
                  )}

                  {selectedProgrammeIds.length >
                    0 && (
                      <p className="mt-2 text-xs text-gray-500">
                        {
                          selectedProgrammeIds.length
                        }{" "}
                        programme
                        {selectedProgrammeIds.length >
                          1
                          ? "s"
                          : ""}{" "}
                        selected
                      </p>
                    )}
                </div>

                {/* ==================================================
                    SEMESTERS
                ================================================== */}

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Semester
                  </label>

                  {selectedProgrammeIds.length ===
                    0 ? (
                    <div className="rounded-md border bg-gray-50 px-4 py-3 text-sm text-gray-500">
                      Select at least one
                      programme first.
                    </div>
                  ) : (
                    <div className="space-y-3 rounded-md border p-3">

                      {selectedProgrammeIds.map(
                        (programmeId) => {
                          const programme =
                            availableProgrammes.find(
                              (item) =>
                                item.id ===
                                programmeId
                            );

                          if (!programme) {
                            return null;
                          }

                          return (
                            <div
                              key={programme.id}
                            >
                              <p className="px-3 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                {programme.name}
                              </p>

                              <div className="mt-1">

                                {programme.semesters
                                  .length ===
                                  0 ? (
                                  <p className="px-3 py-2 text-sm text-gray-500">
                                    No semesters
                                    available.
                                  </p>
                                ) : (
                                  programme.semesters.map(
                                    (
                                      semester
                                    ) => (
                                      <label
                                        key={
                                          semester.id
                                        }
                                        className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-50"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={selectedSemesterIds.includes(
                                            semester.id
                                          )}
                                          onChange={() =>
                                            handleSemesterToggle(
                                              semester.id
                                            )
                                          }
                                          className="h-4 w-4"
                                        />

                                        <span className="text-sm">
                                          Semester{" "}
                                          {
                                            semester.number
                                          }
                                        </span>
                                      </label>
                                    )
                                  )
                                )}

                              </div>
                            </div>
                          );
                        }
                      )}

                    </div>
                  )}

                  {selectedSemesterIds.length >
                    0 && (
                      <p className="mt-2 text-xs text-gray-500">
                        {
                          selectedSemesterIds.length
                        }{" "}
                        semester
                        {selectedSemesterIds.length >
                          1
                          ? "s"
                          : ""}{" "}
                        selected
                      </p>
                    )}
                </div>

                {/* Level */}

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

                {/* Credits */}

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

            {/* ==================================================
                COURSE COVER
            ================================================== */}

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

            {/* ==================================================
                STATUS
            ================================================== */}

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

            {/* ==================================================
                ACCESS & VISIBILITY
            ================================================== */}

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

            {/* ==================================================
                SAVE
            ================================================== */}

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

            {/* ==================================================
                DANGER ZONE
            ================================================== */}

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