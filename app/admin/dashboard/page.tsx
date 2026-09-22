import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";

export default async function AdminDashboardPage() {
  let user;

  try {
    user = await requireRole(["ADMIN"]);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "UNAUTHENTICATED") {
        redirect("/admin/login");
      }

      if (error.message === "FORBIDDEN") {
        redirect("/auth/login");
      }
    }

    throw error;
  }

  return (
    <main>
      <h1>Admin Dashboard</h1>

      <p>
        Welcome, {user.fullName}
      </p>

      <p>
        Admin ID: {user.userId}
      </p>

      <p>
        Role: {user.role}
      </p>
    </main>
  );
}