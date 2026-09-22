import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import StudentHome from "./StudentHome";

export default async function StudentPage() {
  try {
    const user = await requireRole(["STUDENT"]);

    return <StudentHome user={user} />;
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