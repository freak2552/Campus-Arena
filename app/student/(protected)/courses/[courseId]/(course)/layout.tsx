import type { ReactNode } from "react";

import CurrentCourseShell from "@/components/student/courses/CurrentCourseShell";

// Level 2 of Courses: header + course sidebar around one opened course
export default function CurrentCourseLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <CurrentCourseShell>{children}</CurrentCourseShell>;
}
