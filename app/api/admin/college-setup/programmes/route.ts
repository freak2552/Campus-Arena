import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";


// ============================================
// CREATE PROGRAMME + SEMESTERS
// ============================================
export async function POST(request: Request) {
  try {
    // 1. Check that the user is an ADMIN
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

    // 3. Read request body
    const body = await request.json();

    const departmentId = Number(body.departmentId);
    const name = body.name?.trim();
    const totalSemesters = Number(body.totalSemesters);

    // 4. Validate department
    if (!departmentId || Number.isNaN(departmentId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid departmentId is required.",
        },
        { status: 400 }
      );
    }

    // 5. Validate programme name
    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Programme name is required.",
        },
        { status: 400 }
      );
    }

    // 6. Validate semester count
    if (
      !Number.isInteger(totalSemesters) ||
      totalSemesters < 1 ||
      totalSemesters > 12
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Total semesters must be a whole number between 1 and 12.",
        },
        { status: 400 }
      );
    }

    // 7. Check that the department belongs
    //    to the Admin's college
    const department = await prisma.department.findFirst({
      where: {
        id: departmentId,
        collegeId: admin.collegeId,
      },
    });

    if (!department) {
      return NextResponse.json(
        {
          success: false,
          message: "Department not found in your college.",
        },
        { status: 404 }
      );
    }

    // 8. Check duplicate programme
    //    inside this department
    const existingProgramme = await prisma.programme.findUnique({
      where: {
        departmentId_name: {
          departmentId,
          name,
        },
      },
    });

    if (existingProgramme) {
      return NextResponse.json(
        {
          success: false,
          message: "This programme already exists in this department.",
        },
        { status: 409 }
      );
    }

    // 9. Create programme + semesters
    const programme = await prisma.$transaction(async (tx) => {
      const newProgramme = await tx.programme.create({
        data: {
          name,
          departmentId,
        },
      });

      // Create Semester 1 → N automatically
      await tx.semester.createMany({
        data: Array.from(
          { length: totalSemesters },
          (_, index) => ({
            programmeId: newProgramme.id,
            number: index + 1,
          })
        ),
      });

      return newProgramme;
    });

    // 10. Get the newly-created semesters
    const semesters = await prisma.semester.findMany({
      where: {
        programmeId: programme.id,
      },
      orderBy: {
        number: "asc",
      },
    });

    // 11. Return result
    return NextResponse.json(
      {
        success: true,
        message: "Programme created successfully.",
        programme: {
          id: programme.id,
          name: programme.name,
          departmentId: programme.departmentId,
          semesters: semesters.map((semester) => ({
            id: semester.id,
            number: semester.number,
          })),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create programme error:", error);

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
            message: "Only admins can create programmes.",
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while creating the programme.",
      },
      { status: 500 }
    );
  }
}


// ============================================
// GET PROGRAMMES
// ============================================
export async function GET() {
  try {
    // 1. Check Admin
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

    // 3. Get programmes belonging to
    //    departments inside Admin's college
    const programmes = await prisma.programme.findMany({
      where: {
        department: {
          collegeId: admin.collegeId,
        },
      },

      orderBy: [
        {
          department: {
            name: "asc",
          },
        },
        {
          name: "asc",
        },
      ],

      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },

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
    });

    return NextResponse.json({
      success: true,
      programmes,
    });
  } catch (error) {
    console.error("Get programmes error:", error);

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
            message: "Only admins can view programmes.",
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while loading programmes.",
      },
      { status: 500 }
    );
  }
}