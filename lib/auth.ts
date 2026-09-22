import { getSessionUser } from "@/lib/session";

export async function requireUser() {
  const user = await getSessionUser();

  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }

  return user;
}

export async function requireRole(
  allowedRoles: ("STUDENT" | "TEACHER" | "ADMIN")[]
) {
  const user = await requireUser();

  if (!allowedRoles.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }

  return user;
}