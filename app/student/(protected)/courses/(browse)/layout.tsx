import type { ReactNode } from "react";

import CoursesShell from "@/components/student/courses/CoursesShell";

// Level 1 of Courses: header + courses sidebar around My Courses / Explore
export default function CoursesBrowseLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <CoursesShell>{children}</CoursesShell>;
}
