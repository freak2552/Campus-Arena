import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireStudentContext,
  studentErrorResponse,
} from "@/lib/student/courses";

// GET /api/student/courses/[courseId]
// Returns one course with its modules and topics (titles only).
// Only works for published courses the student has joined.
export async function GET(
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

    const course = await prisma.course.findFirst({
      where: {
        id,
        status: "PUBLISHED",
        enrollments: {
          some: { studentId: ctx.user.id, status: "ACTIVE" },
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        level: true,
        credits: true,
        coverUrl: true,
        updatedAt: true,
        department: { select: { name: true } },
        teacher: { select: { fullName: true } },
        semesters: { select: { semester: { select: { number: true } } } },
        modules: {
          orderBy: { position: "asc" },
          select: {
            id: true,
            title: true,
            position: true,
            topics: {
              orderBy: { position: "asc" },
              select: { id: true, title: true, position: true },
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          message: "Course not found, or you have not joined it yet.",
        },
        { status: 404 }
      );
    }

    // Topics of this course the student has marked as done
    const completedTopics = await prisma.studentTopicProgress.findMany({
      where: {
        studentId: ctx.user.id,
        topic: { module: { courseId: course.id } },
      },
      select: { topicId: true },
    });

    return NextResponse.json({
      success: true,
      course: {
        id: course.id,
        title: course.title,
        description: course.description,
        category: course.category,
        level: course.level,
        credits: course.credits,
        coverUrl: course.coverUrl,
        updatedAt: course.updatedAt,
        departmentName: course.department.name,
        teacherName: course.teacher.fullName,
        semesterNumbers: course.semesters
          .map((item) => item.semester.number)
          .sort((a, b) => a - b),
        modules: course.modules,
        completedTopicIds: completedTopics.map((item) => item.topicId),
      },
    });
  } catch (error) {
    const response = studentErrorResponse(error);
    if (response) return response;

    console.error("Student course GET error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load course." },
      { status: 500 }
    );
  }
}
