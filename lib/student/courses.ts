import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

/**
 * Checks that the logged-in user is a STUDENT who has finished onboarding
 * (college + academic profile). Throws a coded Error otherwise.
 */
export async function requireStudentContext() {
  const user = await requireRole(["STUDENT"]);

  if (!user.collegeId) {
    throw new Error("COLLEGE_REQUIRED");
  }

  const profile = await prisma.studentAcademicProfile.findUnique({
    where: { userId: user.id },
  });

  if (!profile) {
    throw new Error("PROFILE_REQUIRED");
  }

  return { user, collegeId: user.collegeId, profile };
}

export type StudentContext = Awaited<ReturnType<typeof requireStudentContext>>;

/**
 * Courses a student is allowed to see/join:
 * published, not private, same college, and matching the student's
 * department + programme + semester.
 */
export function availableCoursesWhere(ctx: StudentContext) {
  return {
    status: "PUBLISHED" as const,
    visibility: { in: ["COLLEGE", "PUBLIC"] as ("COLLEGE" | "PUBLIC")[] },
    departmentId: ctx.profile.departmentId,
    department: { collegeId: ctx.collegeId },
    programmes: { some: { programmeId: ctx.profile.programmeId } },
    semesters: { some: { semesterId: ctx.profile.semesterId } },
  };
}

/**
 * Turns the coded errors above (and the ones from requireRole)
 * into JSON responses. Returns null for unknown errors.
 */
export function studentErrorResponse(error: unknown) {
  if (!(error instanceof Error)) return null;

  switch (error.message) {
    case "UNAUTHENTICATED":
      return NextResponse.json(
        { success: false, message: "You must be logged in." },
        { status: 401 }
      );
    case "FORBIDDEN":
      return NextResponse.json(
        { success: false, message: "Only students can access this." },
        { status: 403 }
      );
    case "COLLEGE_REQUIRED":
    case "PROFILE_REQUIRED":
      return NextResponse.json(
        { success: false, message: "Please complete your onboarding first." },
        { status: 403 }
      );
    default:
      return null;
  }
}
