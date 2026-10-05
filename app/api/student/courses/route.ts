import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  availableCoursesWhere,
  requireStudentContext,
  studentErrorResponse,
} from "@/lib/student/courses";

// GET /api/student/courses?view=my       -> courses the student has joined
// GET /api/student/courses?view=explore  -> matching courses not joined yet
export async function GET(request: Request) {
  try {
    const ctx = await requireStudentContext();

    const view =
      new URL(request.url).searchParams.get("view") === "explore"
        ? "explore"
        : "my";

    const where =
      view === "my"
        ? {
            status: "PUBLISHED" as const,
            enrollments: {
              some: { studentId: ctx.user.id, status: "ACTIVE" as const },
            },
          }
        : {
            ...availableCoursesWhere(ctx),
            enrollments: {
              none: { studentId: ctx.user.id, status: "ACTIVE" as const },
            },
          };

    const courses = await prisma.course.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        coverUrl: true,
        category: true,
        level: true,
        credits: true,
        studentAccess: true,
        teacher: { select: { fullName: true } },
        modules: { select: { _count: { select: { topics: true } } } },
        enrollments: {
          where: { studentId: ctx.user.id },
          select: { status: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      view,
      courses: courses.map((course) => ({
        id: course.id,
        title: course.title,
        description: course.description,
        coverUrl: course.coverUrl,
        category: course.category,
        level: course.level,
        credits: course.credits,
        studentAccess: course.studentAccess,
        teacherName: course.teacher.fullName,
        moduleCount: course.modules.length,
        topicCount: course.modules.reduce(
          (sum, module) => sum + module._count.topics,
          0
        ),
        enrollmentStatus: course.enrollments[0]?.status ?? null,
      })),
    });
  } catch (error) {
    const response = studentErrorResponse(error);
    if (response) return response;

    console.error("Student courses GET error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load courses." },
      { status: 500 }
    );
  }
}
