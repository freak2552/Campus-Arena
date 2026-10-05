import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireStudentContext,
  studentErrorResponse,
} from "@/lib/student/courses";

type RouteParams = {
  params: Promise<{ courseId: string; topicId: string }>;
};

// Marks (mark = true) or un-marks (mark = false) a topic as done.
async function updateProgress(params: RouteParams["params"], mark: boolean) {
  try {
    const ctx = await requireStudentContext();

    const { courseId, topicId } = await params;
    const courseIdNumber = Number(courseId);
    const topicIdNumber = Number(topicId);

    if (!Number.isInteger(courseIdNumber) || !Number.isInteger(topicIdNumber)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID." },
        { status: 400 }
      );
    }

    // The topic must belong to this course, and the student must
    // have joined the (published) course.
    const topic = await prisma.topic.findFirst({
      where: {
        id: topicIdNumber,
        module: {
          courseId: courseIdNumber,
          course: {
            status: "PUBLISHED",
            enrollments: {
              some: { studentId: ctx.user.id, status: "ACTIVE" },
            },
          },
        },
      },
      select: { id: true },
    });

    if (!topic) {
      return NextResponse.json(
        {
          success: false,
          message: "Topic not found, or you have not joined this course.",
        },
        { status: 404 }
      );
    }

    if (mark) {
      // upsert: safe if the button is clicked twice
      await prisma.studentTopicProgress.upsert({
        where: {
          studentId_topicId: {
            studentId: ctx.user.id,
            topicId: topic.id,
          },
        },
        update: {},
        create: { studentId: ctx.user.id, topicId: topic.id },
      });
    } else {
      await prisma.studentTopicProgress.deleteMany({
        where: { studentId: ctx.user.id, topicId: topic.id },
      });
    }

    return NextResponse.json({ success: true, completed: mark });
  } catch (error) {
    const response = studentErrorResponse(error);
    if (response) return response;

    console.error("Student topic progress error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to save your progress." },
      { status: 500 }
    );
  }
}

// POST /api/student/courses/[courseId]/topics/[topicId]/progress  -> Mark as Done
export async function POST(_request: Request, { params }: RouteParams) {
  return updateProgress(params, true);
}

// DELETE /api/student/courses/[courseId]/topics/[topicId]/progress -> Undo
export async function DELETE(_request: Request, { params }: RouteParams) {
  return updateProgress(params, false);
}
