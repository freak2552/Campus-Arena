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


//checking whether User is a teacher + Teacher belongs to a college
export async function requireTeacherWithCollege() {
  const teacher = await requireRole(["TEACHER"]);

  if (!teacher.collegeId) {
    throw new Error("COLLEGE_REQUIRED");
  }

  return teacher;
}