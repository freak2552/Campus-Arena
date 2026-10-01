import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import AdminShell from "@/components/admin/AdminShell";
import { requireRole } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  try {
    await requireRole(["ADMIN"]);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "UNAUTHENTICATED") {
        redirect("/admin/login");
      }

      if (error.message === "FORBIDDEN") {
        redirect("/admin/login");
      }
    }

    throw error;
  }

  return <AdminShell>{children}</AdminShell>;
}