import type { ReactNode } from "react";

import ModuleShell from "@/components/student/courses/ModuleShell";

// Level 3 of Courses: minimal study layout (no sidebar) for the Module Viewer
export default function ModuleLayout({ children }: { children: ReactNode }) {
  return <ModuleShell>{children}</ModuleShell>;
}
