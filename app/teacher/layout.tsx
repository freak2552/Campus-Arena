import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import TeacherShell from "@/components/teacher/TeacherShell";
import { requireRole } from "@/lib/auth";

export default async function TeacherLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  try {
    await requireRole(["TEACHER"]);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "UNAUTHENTICATED") {
        redirect("/auth/login");
      }

      if (error.message === "FORBIDDEN") {
        redirect("/auth/login");
      }
    }

    throw error;
  }

  return <TeacherShell>{children}</TeacherShell>;
}