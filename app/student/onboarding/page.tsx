"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Semester = {
  id: number;
  number: number;
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

export default function StudentOnboardingPage() {
  const router = useRouter();
  const [collegeId, setCollegeId] = useState("");
  const [collegeName, setCollegeName] = useState("");

  const [departments, setDepartments] = useState<Department[]>([]);

  const [departmentId, setDepartmentId] = useState("");
  const [programmeId, setProgrammeId] = useState("");
  const [semesterId, setSemesterId] = useState("");

  const [loadingCollege, setLoadingCollege] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedDepartment = departments.find(
    (department) => department.id === Number(departmentId)
  );

  const programmes = selectedDepartment?.programmes ?? [];

  const selectedProgramme = programmes.find(
    (programme) => programme.id === Number(programmeId)
  );

  const semesters = selectedProgramme?.semesters ?? [];

  // ============================================
  // Find College
  // ============================================
  async function loadCollege() {
    setError("");
    setSuccess("");
    setCollegeName("");
    setDepartments([]);
    setDepartmentId("");
    setProgrammeId("");
    setSemesterId("");

    const trimmedCollegeId = collegeId.trim();

    if (!trimmedCollegeId) {
      setError("Please enter your College ID.");
      return;
    }

    setLoadingCollege(true);

    try {
      const response = await fetch(
        `/api/student/onboarding?collegeId=${encodeURIComponent(
          trimmedCollegeId
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "College not found.");
      }

      setCollegeName(data.college.name);
      setDepartments(data.departments);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load college information."
      );
    } finally {
      setLoadingCollege(false);
    }
  }

  // ============================================
  // Department changed
  // ============================================
  function handleDepartmentChange(value: string) {
    setDepartmentId(value);
    setProgrammeId("");
    setSemesterId("");
    setError("");
  }

  // ============================================
  // Programme changed
  // ============================================
  function handleProgrammeChange(value: string) {
    setProgrammeId(value);
    setSemesterId("");
    setError("");
  }

  // ============================================
  // Submit
  // ============================================
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setSuccess("");

    const trimmedCollegeId = collegeId.trim();

    if (
      !trimmedCollegeId ||
      !departmentId ||
      !programmeId ||
      !semesterId
    ) {
      setError("Please complete all fields.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/student/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collegeId: trimmedCollegeId,
          departmentId: Number(departmentId),
          programmeId: Number(programmeId),
          semesterId: Number(semesterId),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save your academic details."
        );
      }

      setSuccess(
        "Your academic profile has been saved successfully."
      );
      router.push("/student");
      router.refresh();


    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Complete Your Academic Profile
          </h1>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Enter the College ID provided by your college admin and
            select your academic details.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900"
        >
          {/* College ID */}
          <div className="mb-5">
            <label
              htmlFor="collegeId"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              College ID
            </label>

            <div className="flex gap-2">
              <input
                id="collegeId"
                type="text"
                value={collegeId}
                onChange={(e) => {
                  setCollegeId(e.target.value);
                  setCollegeName("");
                  setDepartments([]);
                  setDepartmentId("");
                  setProgrammeId("");
                  setSemesterId("");
                  setError("");
                  setSuccess("");
                }}
                placeholder="e.g. CA-4C32Z15E"
                className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />

              <button
                type="button"
                onClick={loadCollege}
                disabled={loadingCollege}
                className="rounded-lg bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingCollege ? "Loading..." : "Find"}
              </button>
            </div>
          </div>

          {/* College found */}
          {collegeName && (
            <div className="mb-5 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800 dark:bg-green-950/30 dark:text-green-300">
              <span className="font-semibold">College:</span>{" "}
              {collegeName}
            </div>
          )}

          {/* Department */}
          <div className="mb-5">
            <label
              htmlFor="department"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Department
            </label>

            <select
              id="department"
              value={departmentId}
              onChange={(e) =>
                handleDepartmentChange(e.target.value)
              }
              disabled={departments.length === 0}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-800/50"
            >
              <option value="">Select Department</option>

              {departments.map((department) => (
                <option
                  key={department.id}
                  value={department.id}
                >
                  {department.name}
                </option>
              ))}
            </select>
          </div>

          {/* Programme */}
          <div className="mb-5">
            <label
              htmlFor="programme"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Programme
            </label>

            <select
              id="programme"
              value={programmeId}
              onChange={(e) =>
                handleProgrammeChange(e.target.value)
              }
              disabled={!departmentId || programmes.length === 0}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-800/50"
            >
              <option value="">Select Programme</option>

              {programmes.map((programme) => (
                <option
                  key={programme.id}
                  value={programme.id}
                >
                  {programme.name}
                </option>
              ))}
            </select>
          </div>

          {/* Semester */}
          <div className="mb-6">
            <label
              htmlFor="semester"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Semester
            </label>

            <select
              id="semester"
              value={semesterId}
              onChange={(e) => setSemesterId(e.target.value)}
              disabled={!programmeId || semesters.length === 0}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-800/50"
            >
              <option value="">Select Semester</option>

              {semesters.map((semester) => (
                <option
                  key={semester.id}
                  value={semester.id}
                >
                  Semester {semester.number}
                </option>
              ))}
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-5 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-300">
              {success}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={
              saving ||
              !collegeId.trim() ||
              !departmentId ||
              !programmeId ||
              !semesterId
            }
            className="w-full rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Continue"}
          </button>
        </form>
      </div>
    </main>
  );
}