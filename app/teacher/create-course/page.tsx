"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Semester = {
  id: number;
  number: number;
  programmeId: number;
};

type Programme = {
  id: number;
  name: string;
  semesters: Semester[];
};

type Department = {
  id: number;
  name: string;
  programmes: Programme[];
};

export default function CreateCoursePage() {
  const router = useRouter();

  // ============================================================
  // COURSE FORM
  // ============================================================

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "",
    credits: "",
    visibility: "COLLEGE",
    studentAccess: "OPEN",
  });

  // ============================================================
  // ACADEMIC STRUCTURE
  // ============================================================

  const [departments, setDepartments] = useState<Department[]>([]);

  const [departmentId, setDepartmentId] = useState("");

  const [selectedProgrammeIds, setSelectedProgrammeIds] =
    useState<number[]>([]);

  const [selectedSemesterIds, setSelectedSemesterIds] =
    useState<number[]>([]);

  const [academicLoading, setAcademicLoading] = useState(true);

  // ============================================================
  // PAGE STATE
  // ============================================================

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ============================================================
  // LOAD ACADEMIC STRUCTURE
  // ============================================================

  useEffect(() => {
    const loadAcademicStructure = async () => {
      try {
        setAcademicLoading(true);
        setError("");

        const response = await fetch(
          "/api/teacher/academic-structure"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load academic structure."
          );
        }

        setDepartments(data.departments || []);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load academic structure."
        );
      } finally {
        setAcademicLoading(false);
      }
    };

    loadAcademicStructure();
  }, []);

  // ============================================================
  // CURRENT DEPARTMENT
  // ============================================================

  const selectedDepartment = useMemo(() => {
    return departments.find(
      (department) =>
        department.id === Number(departmentId)
    );
  }, [departments, departmentId]);

  // ============================================================
  // PROGRAMMES OF SELECTED DEPARTMENT
  // ============================================================

  const availableProgrammes =
    selectedDepartment?.programmes || [];

  // ============================================================
  // SEMESTERS OF SELECTED PROGRAMMES
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
  // NORMAL FORM CHANGE
  // ============================================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
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

    // Department changed, therefore old
    // programme and semester selections
    // are no longer valid.
    setSelectedProgrammeIds([]);
    setSelectedSemesterIds([]);
  };

  // ============================================================
  // PROGRAMME MULTI-SELECT
  // ============================================================

  const handleProgrammeToggle = (
    programmeId: number
  ) => {
    setSelectedProgrammeIds((previous) => {
      if (previous.includes(programmeId)) {
        return previous.filter(
          (id) => id !== programmeId
        );
      }

      return [...previous, programmeId];
    });

    // If a programme is removed, remove all
    // semesters belonging to that programme.
    const programme = availableProgrammes.find(
      (item) => item.id === programmeId
    );

    if (!programme) {
      return;
    }

    setSelectedSemesterIds((previous) => {
      const programmeSemesterIds =
        programme.semesters.map(
          (semester) => semester.id
        );

      return previous.filter(
        (semesterId) =>
          !programmeSemesterIds.includes(
            semesterId
          )
      );
    });
  };

  // ============================================================
  // SEMESTER MULTI-SELECT
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
  // SUBMIT COURSE
  // ============================================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    // ----------------------------------------------------------
    // Frontend validation
    // ----------------------------------------------------------

    if (!departmentId) {
      setError("Please select a department.");
      setLoading(false);
      return;
    }

    if (selectedProgrammeIds.length === 0) {
      setError(
        "Please select at least one programme."
      );
      setLoading(false);
      return;
    }

    if (selectedSemesterIds.length === 0) {
      setError(
        "Please select at least one semester."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "/api/teacher/courses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            title: formData.title,
            description: formData.description,

            departmentId: Number(departmentId),

            programmeIds: selectedProgrammeIds,

            semesterIds: selectedSemesterIds,

            category: formData.category,
            level: formData.level,

            credits: formData.credits
              ? Number(formData.credits)
              : null,

            visibility: formData.visibility,

            studentAccess:
              formData.studentAccess,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create course"
        );
      }

      setMessage(
        "Course created successfully!"
      );

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

  // ============================================================
  // UI
  // ============================================================

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

                {/* ==================================================
                    COURSE NAME
                ================================================== */}

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

                {/* ==================================================
                    DESCRIPTION
                ================================================== */}

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

                {/* ==================================================
                    DEPARTMENT
                ================================================== */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Department
                  </label>

                  <select
                    value={departmentId}
                    onChange={handleDepartmentChange}
                    disabled={academicLoading}
                    required
                    className="w-full rounded-md border bg-white px-4 py-3 outline-none focus:border-gray-500 disabled:bg-gray-100"
                  >
                    <option value="">
                      {academicLoading
                        ? "Loading departments..."
                        : "Select department"}
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

                {/* ==================================================
                    PROGRAMMES — MULTI SELECT
                ================================================== */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Programme
                  </label>

                  {!departmentId ? (
                    <div className="rounded-md border bg-gray-50 px-4 py-3 text-sm text-gray-500">
                      Select a department first.
                    </div>
                  ) : availableProgrammes.length ===
                    0 ? (
                    <div className="rounded-md border bg-gray-50 px-4 py-3 text-sm text-gray-500">
                      No programmes available for
                      this department.
                    </div>
                  ) : (
                    <div className="space-y-2 rounded-md border p-3">
                      {availableProgrammes.map(
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

                            <span className="text-sm text-gray-800">
                              {programme.name}
                            </span>
                          </label>
                        )
                      )}
                    </div>
                  )}

                  {selectedProgrammeIds.length >
                    0 && (
                    <p className="mt-2 text-xs text-gray-500">
                      {selectedProgrammeIds.length}{" "}
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
                    SEMESTERS — MULTI SELECT
                ================================================== */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Semester
                  </label>

                  {selectedProgrammeIds.length ===
                  0 ? (
                    <div className="rounded-md border bg-gray-50 px-4 py-3 text-sm text-gray-500">
                      Select at least one programme
                      first.
                    </div>
                  ) : availableSemesters.length ===
                    0 ? (
                    <div className="rounded-md border bg-gray-50 px-4 py-3 text-sm text-gray-500">
                      No semesters available for
                      the selected programmes.
                    </div>
                  ) : (
                    <div className="space-y-2 rounded-md border p-3">
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
                              className="space-y-1"
                            >
                              <p className="px-3 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                {programme.name}
                              </p>

                              {programme.semesters.map(
                                (semester) => (
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

                                    <span className="text-sm text-gray-800">
                                      Semester{" "}
                                      {
                                        semester.number
                                      }
                                    </span>
                                  </label>
                                )
                              )}
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}

                  {selectedSemesterIds.length >
                    0 && (
                    <p className="mt-2 text-xs text-gray-500">
                      {selectedSemesterIds.length}{" "}
                      semester
                      {selectedSemesterIds.length >
                      1
                        ? "s"
                        : ""}{" "}
                      selected
                    </p>
                  )}
                </div>

                {/* ==================================================
                    CATEGORY
                ================================================== */}

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

                {/* ==================================================
                    LEVEL
                ================================================== */}

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

                {/* ==================================================
                    CREDITS
                ================================================== */}

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

                {/* ==================================================
                    COURSE COVER
                ================================================== */}

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

                {/* ==================================================
                    VISIBILITY
                ================================================== */}

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

                {/* ==================================================
                    STUDENT ACCESS
                ================================================== */}

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

                {/* ==================================================
                    MESSAGES
                ================================================== */}

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

                {/* ==================================================
                    SUBMIT
                ================================================== */}

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={
                      loading ||
                      academicLoading
                    }
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