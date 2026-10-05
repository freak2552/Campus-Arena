import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  availableCoursesWhere,
  requireStudentContext,
  studentErrorResponse,
} from "@/lib/student/courses";

// POST /api/student/courses/[courseId]/enroll
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const ctx = await requireStudentContext();

    const { courseId } = await params;
    const id = Number(courseId);

    if (!Number.isInteger(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid course ID." },
        { status: 400 }
      );
    }

    // The course must be one this student is allowed to join
    const course = await prisma.course.findFirst({
      where: { id, ...availableCoursesWhere(ctx) },
      select: { id: true, studentAccess: true },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found or not available for you." },
        { status: 404 }
      );
    }

    // upsert makes this safe to call twice (no duplicate rows)
    const enrollment = await prisma.courseEnrollment.upsert({
      where: {
        studentId_courseId: {
          studentId: ctx.user.id,
          courseId: course.id,
        },
      },
      update: {},
      create: {
        studentId: ctx.user.id,
        courseId: course.id,
        status: course.studentAccess === "OPEN" ? "ACTIVE" : "PENDING",
      },
      select: { status: true },
    });

    return NextResponse.json({
      success: true,
      status: enrollment.status,
      message:
        enrollment.status === "ACTIVE"
          ? "You are enrolled in this course."
          : "Your request is waiting for approval.",
    });
  } catch (error) {
    const response = studentErrorResponse(error);
    if (response) return response;

    console.error("Student course enroll error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to enroll in course." },
      { status: 500 }
    );
  }
}
