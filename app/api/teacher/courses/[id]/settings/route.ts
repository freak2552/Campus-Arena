import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// GET COURSE SETTINGS
export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;
    const courseId = Number(id);

    if (Number.isNaN(courseId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid course ID",
        },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        department: true,
        category: true,
        semester: true,
        level: true,
        credits: true,
        coverUrl: true,
        status: true,
        visibility: true,
        studentAccess: true,
        teacherId: true,
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

    return NextResponse.json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("GET COURSE SETTINGS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load course settings",
      },
      { status: 500 }
    );
  }
}


// UPDATE COURSE SETTINGS
export async function PATCH(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;
    const courseId = Number(id);

    if (Number.isNaN(courseId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid course ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const existingCourse =
      await prisma.course.findUnique({
        where: {
          id: courseId,
        },
      });

    if (!existingCourse) {
      return NextResponse.json(
        {
          success: false,
          message: "Course not found",
        },
        { status: 404 }
      );
    }

    const updatedCourse =
      await prisma.course.update({
        where: {
          id: courseId,
        },
        data: {
          title:
            body.title !== undefined
              ? body.title.trim()
              : undefined,

          description:
            body.description !== undefined
              ? body.description.trim() || null
              : undefined,

          department:
            body.department !== undefined
              ? body.department.trim() || null
              : undefined,

          category:
            body.category !== undefined
              ? body.category.trim() || null
              : undefined,

          semester:
            body.semester !== undefined
              ? body.semester.trim() || null
              : undefined,

          level:
            body.level !== undefined
              ? body.level.trim() || null
              : undefined,

          credits:
            body.credits !== undefined &&
            body.credits !== null &&
            body.credits !== ""
              ? Number(body.credits)
              : null,

          coverUrl:
            body.coverUrl !== undefined
              ? body.coverUrl || null
              : undefined,

          status:
            body.status !== undefined
              ? body.status
              : undefined,

          visibility:
            body.visibility !== undefined
              ? body.visibility
              : undefined,

          studentAccess:
            body.studentAccess !== undefined
              ? body.studentAccess
              : undefined,
        },
      });

    return NextResponse.json({
      success: true,
      message: "Course settings updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error(
      "UPDATE COURSE SETTINGS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update course settings",
      },
      { status: 500 }
    );
  }
}


// DELETE COURSE
export async function DELETE(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;
    const courseId = Number(id);

    if (Number.isNaN(courseId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid course ID",
        },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
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

    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("DELETE COURSE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete course",
      },
      { status: 500 }
    );
  }
}