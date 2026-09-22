import Link from "next/link";

const courses = [
  {
    title: "Database Management Systems",
    category: "Database",
    modules: 4,
    sections: 3,
    students: 87,
    progress: 68,
    icon: "🗄️",
    bg: "from-[#ccebdc] to-[#dceaff]",
  },
  {
    title: "HTML & Web Development",
    category: "Web Development",
    modules: 5,
    sections: 2,
    students: 64,
    progress: 52,
    icon: "</>",
    bg: "from-[#ffe4c4] to-[#ffefc9]",
  },
  {
    title: "Python Programming",
    category: "Programming",
    modules: 6,
    sections: 2,
    students: 71,
    progress: 44,
    icon: "🐍",
    bg: "from-[#dcecff] to-[#fff0b9]",
  },
];

export default function MyCoursesPage() {
  return (
    <div>

      <div className="mb-7 flex items-center justify-between gap-6">
        <div>
          <p className="mb-1.5 text-xs text-[#638177]">
            Teacher / My Courses
          </p>

          <h1 className="text-[31px] font-bold tracking-tight">
            My Courses
          </h1>

          <p className="mt-1.5 text-sm text-[#687d74]">
            Manage the courses and learning experiences you teach.
          </p>
        </div>

        <Link
          href="/teacher/courses/create"
          className="rounded-lg bg-[#0b9b61] px-4 py-3 text-[13px] font-bold text-white hover:bg-[#078451]"
        >
          + Create Course
        </Link>
      </div>

      {/* Search */}
      <div className="mb-[22px] flex gap-3 rounded-[13px] border border-[#e1eee8] bg-white p-3">

        <input
          placeholder="Search my courses..."
          className="flex-1 rounded-lg border border-[#dce9e3] px-3 py-2.5 text-[13px] outline-none focus:border-[#0b9b61]"
        />

        <select className="rounded-lg border border-[#dce9e3] bg-white px-3 text-[13px] outline-none">
          <option>All Courses</option>
          <option>Active</option>
          <option>Draft</option>
        </select>
      </div>

      {/* Courses */}
      <div className="grid grid-cols-3 gap-5">

        {courses.map((course) => (
          <div
            key={course.title}
            className="overflow-hidden rounded-[17px] border border-[#e1eee8] bg-white"
          >

            <div
              className={`grid h-[145px] place-items-center bg-gradient-to-br ${course.bg}`}
            >
              <span className="text-[52px]">
                {course.icon}
              </span>
            </div>

            <div className="p-[18px]">

              <span className="inline-block rounded-full bg-[#e5f6ed] px-2 py-1 text-[10px] text-[#0b8e5b]">
                {course.category}
              </span>

              <h2 className="mt-2.5 text-[17px] font-bold">
                {course.title}
              </h2>

              <p className="mt-1.5 text-[11px] text-[#73857e]">
                {course.modules} Modules · {course.sections} Sections ·{" "}
                {course.students} Students
              </p>

              <div className="mt-[18px] flex justify-between text-[11px]">
                <span>Student progress</span>
                <strong>{course.progress}%</strong>
              </div>

              <div className="mt-2 h-[7px] overflow-hidden rounded-full bg-[#e8efec]">
                <div
                  className="h-full rounded-full bg-[#0ca36a]"
                  style={{ width: `${course.progress}%` }}
                />
              </div>

              <div className="mt-[18px] flex gap-2">

                <Link
                  href={`/teacher/courses/${encodeURIComponent(
                    course.title.toLowerCase().replaceAll(" ", "-")
                  )}/manage`}
                  className="flex-1 rounded-lg bg-[#eef6f2] px-3 py-2.5 text-center text-[12px] font-bold text-[#07533c] hover:bg-[#dceee6]"
                >
                  Manage Course
                </Link>

                <button className="rounded-lg border border-[#dce8e3] bg-white px-3 text-sm">
                  •••
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}