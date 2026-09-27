import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireTeacherWithCollege } from "@/lib/auth";

export async function GET() {
  try {
    // Get the actual logged-in teacher
    const teacher = await requireTeacherWithCollege();

    const courses = await prisma.course.findMany({
      where: {
        teacherId: teacher.id,
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {
        modules: {
          include: {
            topics: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      courses,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "UNAUTHENTICATED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Teacher access required.",
        },
        { status: 403 }
      );
    }

    if (
      error instanceof Error &&
      error.message === "COLLEGE_REQUIRED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You must join a college before using teacher features.",
        },
        { status: 403 }
      );
    }

    console.error("Get courses error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch courses",
      },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    // Get the actual logged-in teacher
    const teacher = await requireTeacherWithCollege();

    const body = await request.json();

    const {
      title,
      description,
      department,
      category,
      semester,
      level,
      credits,
      visibility,
      studentAccess,
    } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Course title is required",
        },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        department: department?.trim() || null,
        category: category?.trim() || null,
        semester: semester?.trim() || null,
        level: level?.trim() || null,

        credits:
          credits !== undefined &&
            credits !== null &&
            credits !== ""
            ? Number(credits)
            : null,

        visibility: visibility || "COLLEGE",
        studentAccess: studentAccess || "OPEN",


        // Use the logged-in teacher's ID.
        teacherId: teacher.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Course created successfully",
        course,
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "UNAUTHENTICATED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Teacher access required.",
        },
        { status: 403 }
      );
    }

    if (
      error instanceof Error &&
      error.message === "COLLEGE_REQUIRED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You must join a college before using teacher features.",
        },
        { status: 403 }
      );
    }

    console.error("Create course error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create course",
      },
      { status: 500 }
    );
  }
}