"use client";

import { useEffect, useState } from "react";
import {
    ArrowRight,
    BookOpen,
    Building2,
    Check,
    ChevronDown,
    ChevronUp,
    CircleHelp,
    EllipsisVertical,
    GraduationCap,
    Pencil,
    Plus,
    Trash2,
    X,
} from "lucide-react";

type Semester = {
    id: number;
    semesterNumber: number;
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

export default function CollegeSetupPage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);

    const [expandedDepartment, setExpandedDepartment] =
        useState<number | null>(null);

    const [showDepartmentModal, setShowDepartmentModal] =
        useState(false);

    const [showProgrammeModal, setShowProgrammeModal] =
        useState(false);

    const [selectedDepartment, setSelectedDepartment] =
        useState<Department | null>(null);

    const [departmentName, setDepartmentName] = useState("");
    const [programmeName, setProgrammeName] = useState("");
    const [semesterCount, setSemesterCount] = useState("6");

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    /*
     * --------------------------------
     * Load departments
     * --------------------------------
     */

    async function loadDepartments() {
        try {
            setLoading(true);
            setMessage("");

            const [departmentsResponse, programmesResponse] =
                await Promise.all([
                    fetch("/api/admin/college-setup/departments", {
                        method: "GET",
                        credentials: "include",
                    }),

                    fetch("/api/admin/college-setup/programmes", {
                        method: "GET",
                        credentials: "include",
                    }),
                ]);

            const departmentsData =
                await departmentsResponse.json();

            const programmesData =
                await programmesResponse.json();

            if (!departmentsResponse.ok) {
                throw new Error(
                    departmentsData?.message ||
                    "Failed to load departments."
                );
            }

            if (!programmesResponse.ok) {
                throw new Error(
                    programmesData?.message ||
                    "Failed to load programmes."
                );
            }

            const rawDepartments =
                Array.isArray(departmentsData.departments)
                    ? departmentsData.departments
                    : [];

            const rawProgrammes =
                Array.isArray(programmesData.programmes)
                    ? programmesData.programmes
                    : [];

            
            //Attach programmes to their department         
             
            const formattedDepartments: Department[] =
                rawDepartments.map((department: any) => {
                    const departmentProgrammes =
                        rawProgrammes
                            .filter(
                                (programme: any) =>
                                    programme.departmentId === department.id
                            )
                            .map((programme: any) => ({
                                id: programme.id,
                                name: programme.name,

                                semesters: Array.isArray(
                                    programme.semesters
                                )
                                    ? programme.semesters.map(
                                        (semester: any) => ({
                                            id: semester.id,
                                            semesterNumber: semester.number,
                                        })
                                    )
                                    : [],
                            }));

                    return {
                        id: department.id,
                        name: department.name,
                        programmes: departmentProgrammes,
                    };
                });

            setDepartments(formattedDepartments);
        } catch (error) {
            console.error(
                "Department loading error:",
                error
            );

            setMessage(
                error instanceof Error
                    ? error.message
                    : "Unable to load departments."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDepartments();
    }, []);


    /*
     * --------------------------------
     * Create Department
     * --------------------------------
     */

    async function handleCreateDepartment() {
        if (!departmentName.trim()) {
            setMessage("Please enter a department name.");
            return;
        }

        try {
            setSaving(true);
            setMessage("");

            const response = await fetch(
                "/api/admin/college-setup/departments",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        name: departmentName.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message || "Failed to create department."
                );
            }

            setDepartmentName("");
            setShowDepartmentModal(false);

            await loadDepartments();
        } catch (error) {
            console.error("Create department error:", error);

            setMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to create department."
            );
        } finally {
            setSaving(false);
        }
    }


    /*
     * --------------------------------
     * Create Programme
     * --------------------------------
     */

    async function handleCreateProgramme() {
        if (!selectedDepartment) {
            setMessage("Please select a department.");
            return;
        }

        if (!programmeName.trim()) {
            setMessage("Please enter a programme name.");
            return;
        }

        try {
            setSaving(true);
            setMessage("");

            const response = await fetch(
                "/api/admin/college-setup/programmes",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        departmentId: selectedDepartment.id,
                        name: programmeName.trim(),
                        totalSemesters: Number(semesterCount),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message || "Failed to create programme."
                );
            }

            setProgrammeName("");
            setSemesterCount("6");
            setShowProgrammeModal(false);

            await loadDepartments();
        } catch (error) {
            console.error("Create programme error:", error);

            setMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to create programme."
            );
        } finally {
            setSaving(false);
        }
    }


    /*
     * --------------------------------
     * Open Programme Modal
     * --------------------------------
     */

    function openProgrammeModal(department: Department) {
        setSelectedDepartment(department);
        setProgrammeName("");
        setSemesterCount("6");
        setMessage("");
        setShowProgrammeModal(true);
    }


    /*
     * --------------------------------
     * Toggle Department
     * --------------------------------
     */

    function toggleDepartment(id: number) {
        setExpandedDepartment((current) =>
            current === id ? null : id
        );
    }


    /*
     * --------------------------------
     * Totals
     * --------------------------------
     */

    const totalProgrammes = departments.reduce(
        (total, department) =>
            total + department.programmes.length,
        0
    );

    const totalSemesters = departments.reduce(
        (total, department) =>
            total +
            department.programmes.reduce(
                (programmeTotal, programme) =>
                    programmeTotal + programme.semesters.length,
                0
            ),
        0
    );


    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-5 transition-colors dark:bg-slate-950 md:p-8">

            <div className="mx-auto max-w-[1450px]">

                {/* ===================================== */}
                {/* PAGE HEADER                           */}
                {/* ===================================== */}

                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                            College Setup
                        </h1>

                        <p className="mt-1 max-w-3xl text-base text-slate-500 dark:text-slate-400">
                            Manage your college's academic structure.
                            Create departments, add programmes and set
                            the number of semesters.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="flex w-fit items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 dark:border-blue-900 dark:bg-slate-900 dark:text-blue-400 dark:hover:bg-slate-800"
                    >
                        <CircleHelp size={18} />
                        How it works?
                    </button>

                </div>


                {/* ===================================== */}
                {/* MESSAGE                               */}
                {/* ===================================== */}

                {message && (
                    <div className="mb-5 flex items-center justify-between rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">

                        <span>{message}</span>

                        <button
                            type="button"
                            onClick={() => setMessage("")}
                        >
                            <X size={18} />
                        </button>

                    </div>
                )}


                {/* ===================================== */}
                {/* 3 STEP GUIDE                          */}
                {/* ===================================== */}

                <section className="mb-6 rounded-2xl border border-blue-200 bg-blue-50/60 p-5 dark:border-blue-900 dark:bg-blue-950/20">

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                        <Step
                            number="1"
                            title="Create Department"
                            description="Add a department for your college"
                        />

                        <Step
                            number="2"
                            title="Add Programme"
                            description="Add programmes under a department"
                        />

                        <Step
                            number="3"
                            title="Set Number of Semesters"
                            description="Choose the total and the system creates them automatically"
                        />

                    </div>

                </section>


                {/* ===================================== */}
                {/* DEPARTMENT SECTION                    */}
                {/* ===================================== */}

                <section className="rounded-2xl border border-slate-300 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">

                    {/* Section Header */}
                    <div className="flex flex-col gap-4 border-b border-slate-300 p-5 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                <Building2 size={24} />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Departments ({departments.length})
                                </h2>

                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Manage departments in your college.
                                </p>
                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setDepartmentName("");
                                setMessage("");
                                setShowDepartmentModal(true);
                            }}
                            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                        >
                            <Plus size={18} />
                            Add Department
                        </button>

                    </div>


                    {/* ================================= */}
                    {/* DEPARTMENT LIST                   */}
                    {/* ================================= */}

                    <div className="space-y-4 p-5">

                        {loading ? (
                            <LoadingState />
                        ) : departments.length === 0 ? (
                            <EmptyState
                                onAdd={() => {
                                    setShowDepartmentModal(true);
                                    setDepartmentName("");
                                }}
                            />
                        ) : (
                            departments.map((department) => {

                                const expanded =
                                    expandedDepartment === department.id;

                                const semesterTotal =
                                    department.programmes.reduce(
                                        (total, programme) =>
                                            total + programme.semesters.length,
                                        0
                                    );

                                return (
                                    <div
                                        key={department.id}
                                        className="overflow-hidden rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900"
                                    >

                                        {/* Department Header */}
                                        <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">

                                            <div className="flex items-center gap-4">

                                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                                    <GraduationCap size={27} />
                                                </div>

                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                                        {department.name}
                                                    </h3>

                                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                        {department.programmes.length}{" "}
                                                        {department.programmes.length === 1
                                                            ? "programme"
                                                            : "programmes"}{" "}
                                                        <span className="mx-1">•</span>
                                                        {semesterTotal} semesters
                                                    </p>
                                                </div>

                                            </div>


                                            <div className="flex items-center gap-2">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openProgrammeModal(department)
                                                    }
                                                    className="flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 dark:border-blue-900 dark:bg-slate-900 dark:text-blue-400 dark:hover:bg-slate-800"
                                                >
                                                    <Plus size={17} />
                                                    Add Programme
                                                </button>

                                                <button
                                                    type="button"
                                                    className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                    aria-label="Department options"
                                                >
                                                    <EllipsisVertical size={20} />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toggleDepartment(department.id)
                                                    }
                                                    className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                                    aria-label={
                                                        expanded
                                                            ? "Collapse department"
                                                            : "Expand department"
                                                    }
                                                >
                                                    {expanded ? (
                                                        <ChevronUp size={21} />
                                                    ) : (
                                                        <ChevronDown size={21} />
                                                    )}
                                                </button>

                                            </div>

                                        </div>


                                        {/* ================================= */}
                                        {/* PROGRAMMES                        */}
                                        {/* ================================= */}

                                        {expanded && (
                                            <div className="border-t border-slate-300 dark:border-slate-700">

                                                <div className="flex items-center gap-2 px-5 py-4">

                                                    <BookOpen
                                                        size={20}
                                                        className="text-slate-700 dark:text-slate-300"
                                                    />

                                                    <h4 className="font-bold text-slate-900 dark:text-white">
                                                        Programmes ({department.programmes.length})
                                                    </h4>

                                                </div>


                                                {department.programmes.length === 0 ? (
                                                    <div className="mx-5 mb-5 rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">

                                                        <BookOpen
                                                            size={28}
                                                            className="mx-auto mb-2 text-slate-400"
                                                        />

                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                                            No programmes yet
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-400">
                                                            Add the first programme for this department.
                                                        </p>

                                                    </div>
                                                ) : (
                                                    <div className="mx-5 mb-5 overflow-hidden rounded-xl border border-slate-300 dark:border-slate-700">

                                                        {/* Table Header */}
                                                        <div className="hidden grid-cols-[60px_1.5fr_150px_1fr_90px] border-b border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 md:grid">

                                                            <span>#</span>
                                                            <span>Programme Name</span>
                                                            <span>Total Semesters</span>
                                                            <span>Semesters</span>
                                                            <span className="text-center">
                                                                Actions
                                                            </span>

                                                        </div>


                                                        {department.programmes.map(
                                                            (programme, index) => (
                                                                <div
                                                                    key={programme.id}
                                                                    className="grid grid-cols-1 gap-3 border-b border-slate-200 px-4 py-4 last:border-b-0 dark:border-slate-700 md:grid-cols-[60px_1.5fr_150px_1fr_90px] md:items-center"
                                                                >

                                                                    <div className="text-sm text-slate-500">
                                                                        {index + 1}
                                                                    </div>

                                                                    <div>
                                                                        <p className="font-medium text-slate-900 dark:text-white">
                                                                            {programme.name}
                                                                        </p>

                                                                        <p className="mt-1 text-xs text-slate-400 md:hidden">
                                                                            {programme.semesters.length} semesters
                                                                        </p>
                                                                    </div>

                                                                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                                        {programme.semesters.length}
                                                                    </div>


                                                                    {/* Semester pills */}
                                                                    <div className="flex flex-wrap gap-2">

                                                                        {programme.semesters.map(
                                                                            (semester) => (
                                                                                <span
                                                                                    key={semester.id}
                                                                                    className="flex h-8 min-w-8 items-center justify-center rounded-md border border-slate-200 bg-slate-100 px-2 text-xs font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                                                                >
                                                                                    {semester.semesterNumber}
                                                                                </span>
                                                                            )
                                                                        )}

                                                                    </div>


                                                                    {/* Actions */}
                                                                    <div className="flex items-center justify-start gap-1 md:justify-center">

                                                                        <button
                                                                            type="button"
                                                                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800"
                                                                            aria-label="Edit programme"
                                                                        >
                                                                            <Pencil size={17} />
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                                                                            aria-label="Delete programme"
                                                                        >
                                                                            <Trash2 size={17} />
                                                                        </button>

                                                                    </div>

                                                                </div>
                                                            )
                                                        )}

                                                    </div>
                                                )}

                                            </div>
                                        )}

                                    </div>
                                );
                            })
                        )}

                    </div>

                </section>


                {/* ===================================== */}
                {/* SUMMARY                               */}
                {/* ===================================== */}

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">

                    <SummaryCard
                        label="Departments"
                        value={departments.length}
                    />

                    <SummaryCard
                        label="Programmes"
                        value={totalProgrammes}
                    />

                    <SummaryCard
                        label="Semesters"
                        value={totalSemesters}
                    />

                </div>

            </div>


            {/* ======================================= */}
            {/* ADD DEPARTMENT MODAL                    */}
            {/* ======================================= */}

            {showDepartmentModal && (
                <Modal
                    title="Create Department"
                    description="Add a new academic department to your college."
                    onClose={() => setShowDepartmentModal(false)}
                >

                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Department Name
                    </label>

                    <input
                        type="text"
                        value={departmentName}
                        onChange={(event) =>
                            setDepartmentName(event.target.value)
                        }
                        placeholder="e.g. Computer Science"
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-950"
                    />

                    <div className="mt-6 flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                setShowDepartmentModal(false)
                            }
                            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            disabled={saving}
                            onClick={handleCreateDepartment}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? (
                                "Creating..."
                            ) : (
                                <>
                                    <Plus size={17} />
                                    Create Department
                                </>
                            )}
                        </button>

                    </div>

                </Modal>
            )}


            {/* ======================================= */}
            {/* ADD PROGRAMME MODAL                    */}
            {/* ======================================= */}

            {showProgrammeModal && (
                <Modal
                    title="Add Programme"
                    description={
                        selectedDepartment
                            ? `Add a programme under ${selectedDepartment.name}.`
                            : "Add a programme."
                    }
                    onClose={() => setShowProgrammeModal(false)}
                >

                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Programme Name
                    </label>

                    <input
                        type="text"
                        value={programmeName}
                        onChange={(event) =>
                            setProgrammeName(event.target.value)
                        }
                        placeholder="e.g. B.Sc Information Technology"
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-950"
                    />


                    <label className="mb-2 mt-5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Total Number of Semesters
                    </label>

                    <select
                        value={semesterCount}
                        onChange={(event) =>
                            setSemesterCount(event.target.value)
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-950"
                    >
                        {Array.from({ length: 12 }, (_, index) => {
                            const number = index + 1;

                            return (
                                <option key={number} value={number}>
                                    {number} {number === 1 ? "Semester" : "Semesters"}
                                </option>
                            );
                        })}
                    </select>


                    {/* Preview */}
                    <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">

                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                            Automatic creation
                        </p>

                        <p className="mt-1 text-sm text-blue-900 dark:text-blue-200">
                            The system will automatically create:
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">

                            {Array.from(
                                { length: Number(semesterCount) },
                                (_, index) => (
                                    <span
                                        key={index}
                                        className="flex h-8 min-w-8 items-center justify-center rounded-md bg-white px-2 text-xs font-semibold text-blue-700 shadow-sm dark:bg-slate-900 dark:text-blue-300"
                                    >
                                        {index + 1}
                                    </span>
                                )
                            )}

                        </div>

                    </div>


                    <div className="mt-6 flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                setShowProgrammeModal(false)
                            }
                            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            disabled={saving}
                            onClick={handleCreateProgramme}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? (
                                "Creating..."
                            ) : (
                                <>
                                    <Check size={17} />
                                    Create Programme
                                </>
                            )}
                        </button>

                    </div>

                </Modal>
            )}

        </div>
    );
}


/* ================================================= */
/* STEP                                               */
/* ================================================= */

function Step({
    number,
    title,
    description,
}: {
    number: string;
    title: string;
    description: string;
}) {
    return (
        <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                {number}
            </div>

            <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                    {title}
                </h3>

                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {description}
                </p>
            </div>

            {number !== "3" && (
                <ArrowRight
                    size={20}
                    className="ml-auto hidden text-slate-400 md:block"
                />
            )}

        </div>
    );
}


/* ================================================= */
/* SUMMARY CARD                                       */
/* ================================================= */

function SummaryCard({
    label,
    value,
}: {
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">

            <p className="text-sm text-slate-500 dark:text-slate-400">
                Total {label}
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                {value}
            </p>

        </div>
    );
}


/* ================================================= */
/* LOADING                                            */
/* ================================================= */

function LoadingState() {
    return (
        <div className="rounded-xl border border-slate-300 p-10 text-center dark:border-slate-700">

            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />

            <p className="mt-3 text-sm text-slate-500">
                Loading departments...
            </p>

        </div>
    );
}


/* ================================================= */
/* EMPTY STATE                                        */
/* ================================================= */

function EmptyState({
    onAdd,
}: {
    onAdd: () => void;
}) {
    return (
        <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">

            <Building2
                size={40}
                className="mx-auto mb-3 text-slate-400"
            />

            <h3 className="font-semibold text-slate-800 dark:text-white">
                No departments yet
            </h3>

            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
                Start by creating your first department.
                You can then add programmes and semesters under it.
            </p>

            <button
                type="button"
                onClick={onAdd}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
                <Plus size={17} />
                Add Department
            </button>

        </div>
    );
}


/* ================================================= */
/* MODAL                                              */
/* ================================================= */

function Modal({
    title,
    description,
    children,
    onClose,
}: {
    title: string;
    description: string;
    children: React.ReactNode;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">

                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-700">

                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            {title}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {description}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        aria-label="Close"
                    >
                        <X size={19} />
                    </button>

                </div>

                {/* Content */}
                <div className="p-6">
                    {children}
                </div>

            </div>

        </div>
    );
}