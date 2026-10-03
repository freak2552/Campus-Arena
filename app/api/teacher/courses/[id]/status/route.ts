import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // -----------------------------
    // 1. Check logged-in teacher
    // -----------------------------
    const teacher = await requireRole(["TEACHER"]);

    // -----------------------------
    // 2. Get course ID
    // -----------------------------
    const { id } = await params;

    const courseId = Number(id);

    if (!courseId || Number.isNaN(courseId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid course ID",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // 3. Get requested status
    // -----------------------------
    const body = await request.json();

    const newStatus = body.status;

    const allowedStatuses = [
      "DRAFT",
      "PUBLISHED",
      "ARCHIVED",
    ];

    if (!allowedStatuses.includes(newStatus)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid course status",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // 4. Find course owned by teacher
    // -----------------------------
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        teacherId: teacher.id,
      },
      include: {
        modules: {
          include: {
            topics: {
              include: {
                contentBlocks: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          message: "Course not found",
        },
        { status: 404 }
      );
    }

    // -----------------------------
    // 5. Validate before publishing
    // -----------------------------
    if (newStatus === "PUBLISHED") {
      // Title
      if (!course.title?.trim()) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Course title is required before publishing.",
          },
          { status: 400 }
        );
      }

      // Description
      if (!course.description?.trim()) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Course description is required before publishing.",
          },
          { status: 400 }
        );
      }

      // At least one module
      if (course.modules.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Course must have at least one module before publishing.",
          },
          { status: 400 }
        );
      }

      // At least one topic somewhere
      const hasTopic = course.modules.some(
        (module) => module.topics.length > 0
      );

      if (!hasTopic) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Course must have at least one topic before publishing.",
          },
          { status: 400 }
        );
      }

      // At least one content block somewhere
      const hasContentBlock = course.modules.some(
        (module) =>
          module.topics.some(
            (topic) =>
              topic.contentBlocks.length > 0
          )
      );

      if (!hasContentBlock) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Course must have at least one content block before publishing.",
          },
          { status: 400 }
        );
      }
    }

    // -----------------------------
    // 6. Change course status
    // -----------------------------
    const updatedCourse =
      await prisma.course.update({
        where: {
          id: courseId,
        },
        data: {
          status: newStatus,
        },
      });

    // -----------------------------
    // 7. Success response
    // -----------------------------
    return NextResponse.json({
      success: true,
      message: `Course status changed to ${newStatus}.`,
      course: updatedCourse,
    });
  } catch (error) {
    console.error(
      "Update course status error:",
      error
    );

    if (error instanceof Error) {
      if (
        error.message === "UNAUTHENTICATED"
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Authentication required.",
          },
          { status: 401 }
        );
      }

      if (error.message === "FORBIDDEN") {
        return NextResponse.json(
          {
            success: false,
            message: "Teacher access required.",
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update course status.",
      },
      { status: 500 }
    );
  }
}