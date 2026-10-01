import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    // 1. Only logged-in Admins can access this
    const admin = await requireRole(["ADMIN"]);

    // 2. Admin must belong to a college
    if (!admin.collegeId) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin is not associated with a college.",
        },
        { status: 400 }
      );
    }

    // 3. Get the complete academic structure
    //    belonging to this Admin's college
    const departments = await prisma.department.findMany({
      where: {
        collegeId: admin.collegeId,
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

    // 4. Return the complete structure
    return NextResponse.json({
      success: true,
      departments: departments.map((department) => ({
        id: department.id,
        name: department.name,

        programmes: department.programmes.map((programme) => ({
          id: programme.id,
          name: programme.name,

          semesters: programme.semesters.map((semester) => ({
            id: semester.id,
            number: semester.number,
          })),
        })),
      })),
    });
  } catch (error) {
    console.error("Get college structure error:", error);

    if (error instanceof Error) {
      if (error.message === "UNAUTHENTICATED") {
        return NextResponse.json(
          {
            success: false,
            message: "You must be logged in.",
          },
          { status: 401 }
        );
      }

      if (error.message === "FORBIDDEN") {
        return NextResponse.json(
          {
            success: false,
            message: "Only admins can view college structure.",
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while loading the college structure.",
      },
      { status: 500 }
    );
  }
}