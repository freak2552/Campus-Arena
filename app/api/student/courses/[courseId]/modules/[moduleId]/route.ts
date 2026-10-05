import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireStudentContext,
  studentErrorResponse,
} from "@/lib/student/courses";

// GET /api/student/courses/[courseId]/modules/[moduleId]
// Returns one module with all its topics and content blocks.
// Only works for published courses the student has joined.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ courseId: string; moduleId: string }> }
) {
  try {
    const ctx = await requireStudentContext();

    const { courseId, moduleId } = await params;
    const courseIdNumber = Number(courseId);
    const moduleIdNumber = Number(moduleId);

    if (!Number.isInteger(courseIdNumber) || !Number.isInteger(moduleIdNumber)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID." },
        { status: 400 }
      );
    }

    const courseModule = await prisma.courseModule.findFirst({
      where: {
        id: moduleIdNumber,
        courseId: courseIdNumber,
        course: {
          status: "PUBLISHED",
          enrollments: {
            some: { studentId: ctx.user.id, status: "ACTIVE" },
          },
        },
      },
      select: {
        id: true,
        title: true,
        course: { select: { id: true, title: true } },
        topics: {
          orderBy: { position: "asc" },
          select: {
            id: true,
            title: true,
            position: true,
            contentBlocks: {
              orderBy: { position: "asc" },
              select: {
                id: true,
                type: true,
                position: true,
                content: true,
                url: true,
              },
            },
          },
        },
      },
    });

    if (!courseModule) {
      return NextResponse.json(
        {
          success: false,
          message: "Module not found, or you have not joined this course.",
        },
        { status: 404 }
      );
    }

    // Needed for the module number and the Previous / Next buttons
    const allModules = await prisma.courseModule.findMany({
      where: { courseId: courseIdNumber },
      orderBy: { position: "asc" },
      select: { id: true },
    });

    const index = allModules.findIndex((item) => item.id === courseModule.id);

    // Topics of this module the student has marked as done
    const completedTopics = await prisma.studentTopicProgress.findMany({
      where: {
        studentId: ctx.user.id,
        topic: { moduleId: courseModule.id },
      },
      select: { topicId: true },
    });

    return NextResponse.json({
      success: true,
      module: {
        id: courseModule.id,
        title: courseModule.title,
        number: index + 1,
        totalModules: allModules.length,
        prevModuleId: index > 0 ? allModules[index - 1].id : null,
        nextModuleId:
          index < allModules.length - 1 ? allModules[index + 1].id : null,
        course: courseModule.course,
        topics: courseModule.topics,
        completedTopicIds: completedTopics.map((item) => item.topicId),
      },
    });
  } catch (error) {
    const response = studentErrorResponse(error);
    if (response) return response;

    console.error("Student module GET error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load module." },
      { status: 500 }
    );
  }
}
