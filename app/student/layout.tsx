import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireRole(["STUDENT"]);

    return <>{children}</>;
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
}