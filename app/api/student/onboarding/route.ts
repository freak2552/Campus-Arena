import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

// ============================================
// GET — Load college academic structure
// ============================================
export async function GET(request: Request) {
  try {
    await requireRole(["STUDENT"]);

    const { searchParams } = new URL(request.url);
    const publicCollegeId = searchParams.get("collegeId")?.trim();

    if (!publicCollegeId) {
      return NextResponse.json(
        {
          success: false,
          message: "College ID is required.",
        },
        { status: 400 }
      );
    }

    // Find college using the PUBLIC college ID
    const college = await prisma.college.findUnique({
      where: {
        collegeId: publicCollegeId,
      },
      select: {
        id: true,
        collegeId: true,
        name: true,
      },
    });

    if (!college) {
      return NextResponse.json(
        {
          success: false,
          message: "College not found. Please check your College ID.",
        },
        { status: 404 }
      );
    }

    // Use the INTERNAL College.id for academic relationships
    const departments = await prisma.department.findMany({
      where: {
        collegeId: college.id,
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
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      college: {
        collegeId: college.collegeId,
        name: college.name,
      },
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
    console.error("Student onboarding GET error:", error);

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
            message: "Only students can access this.",
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while loading college information.",
      },
      { status: 500 }
    );
  }
}

// ============================================
// POST — Save student's academic profile
// ============================================
export async function POST(request: Request) {
  try {
    const student = await requireRole(["STUDENT"]);

    const body = await request.json();

    const publicCollegeId = body.collegeId?.trim();
    const departmentId = Number(body.departmentId);
    const programmeId = Number(body.programmeId);
    const semesterId = Number(body.semesterId);

    // ----------------------------------------
    // Basic validation
    // ----------------------------------------
    if (
      !publicCollegeId ||
      !Number.isInteger(departmentId) ||
      !Number.isInteger(programmeId) ||
      !Number.isInteger(semesterId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Valid College ID, department, programme and semester are required.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------
    // Find college using PUBLIC College ID
    // ----------------------------------------
    const college = await prisma.college.findUnique({
      where: {
        collegeId: publicCollegeId,
      },
      select: {
        id: true,
        collegeId: true,
        name: true,
      },
    });

    if (!college) {
      return NextResponse.json(
        {
          success: false,
          message: "College not found.",
        },
        { status: 404 }
      );
    }

    // ----------------------------------------
    // Verify department belongs to this college
    // ----------------------------------------
    const department = await prisma.department.findFirst({
      where: {
        id: departmentId,
        collegeId: college.id,
      },
      select: {
        id: true,
      },
    });

    if (!department) {
      return NextResponse.json(
        {
          success: false,
          message: "Department does not belong to this college.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------
    // Verify programme belongs to department
    // ----------------------------------------
    const programme = await prisma.programme.findFirst({
      where: {
        id: programmeId,
        departmentId,
      },
      select: {
        id: true,
      },
    });

    if (!programme) {
      return NextResponse.json(
        {
          success: false,
          message: "Programme does not belong to this department.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------
    // Verify semester belongs to programme
    // ----------------------------------------
    const semester = await prisma.semester.findFirst({
      where: {
        id: semesterId,
        programmeId,
      },
      select: {
        id: true,
      },
    });

    if (!semester) {
      return NextResponse.json(
        {
          success: false,
          message: "Semester does not belong to this programme.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------
    // Save everything in one transaction
    // ----------------------------------------
    const result = await prisma.$transaction(async (tx) => {
      // IMPORTANT:
      // User.collegeId stores the INTERNAL College.id
      // not the public "cx-dfd656e" value.
      const updatedUser = await tx.user.update({
        where: {
          id: student.id,
        },
        data: {
          collegeId: college.id,
        },
      });

      const academicProfile =
        await tx.studentAcademicProfile.upsert({
          where: {
            userId: student.id,
          },
          update: {
            departmentId,
            programmeId,
            semesterId,
          },
          create: {
            userId: student.id,
            departmentId,
            programmeId,
            semesterId,
          },
        });

      return {
        updatedUser,
        academicProfile,
      };
    });

    return NextResponse.json({
      success: true,
      message: "Student academic profile saved successfully.",
      profile: {
        collegeId: result.updatedUser.collegeId,
        departmentId: result.academicProfile.departmentId,
        programmeId: result.academicProfile.programmeId,
        semesterId: result.academicProfile.semesterId,
      },
    });
  } catch (error) {
    console.error("Student onboarding POST error:", error);

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
            message: "Only students can complete onboarding.",
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while saving your academic profile.",
      },
      { status: 500 }
    );
  }
}