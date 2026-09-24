import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import TeacherHeader from "@/components/teacher/TeacherHeader";
import TeacherSidebar from "@/components/teacher/TeacherSidebar";
import { requireRole } from "@/lib/auth";

export default async function TeacherLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  let user;

  try {
    user = await requireRole(["TEACHER"]);
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

  return (
    <div className="min-h-screen bg-slate-100">
      <TeacherHeader />
      <TeacherSidebar />

      {children}
    </div>
  );
}
