import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireTeacherWithCollege } from "@/lib/auth";

export async function GET() {
  try {
    // Make sure the user is a logged-in teacher
    // who belongs to a college.
    const teacher = await requireTeacherWithCollege();

    // Get only departments belonging to
    // the teacher's college.
    const departments = await prisma.department.findMany({
      where: {
        collegeId: teacher.collegeId,
      },

      orderBy: {
        name: "asc",
      },

      include: {
        programmes: {
          orderBy: {
            name: "asc",
          },

          include: {
            semesters: {
              orderBy: {
                number: "asc",
              },

              select: {
                id: true,
                number: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      departments,
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
          message:
            "You must join a college before using teacher features.",
        },
        { status: 403 }
      );
    }

    console.error("Get teacher academic structure error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load academic structure.",
      },
      { status: 500 }
    );
  }
}