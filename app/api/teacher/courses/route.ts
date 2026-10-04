import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireTeacherWithCollege } from "@/lib/auth";

// ============================================================
// GET — Get courses created by the logged-in teacher
// ============================================================

export async function GET() {
  try {
    const teacher = await requireTeacherWithCollege();

    if (teacher.collegeId === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Teacher is not associated with a college.",
        },
        { status: 403 }
      );
    }

    const courses = await prisma.course.findMany({
      where: {
        teacherId: teacher.id,
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },

        programmes: {
          include: {
            programme: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },

        semesters: {
          include: {
            semester: {
              select: {
                id: true,
                number: true,
                programmeId: true,
              },
            },
          },
        },

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
          message:
            "You must join a college before using teacher features.",
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

// ============================================================
// POST — Create a new course
// ============================================================

export async function POST(request: Request) {
  try {
    // 1. Get the logged-in teacher
    const teacher = await requireTeacherWithCollege();

    if (teacher.collegeId === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Teacher is not associated with a college.",
        },
        { status: 403 }
      );
    }

    // 2. Read request body
    const body = await request.json();

    const {
      title,
      description,
      departmentId,
      programmeIds,
      semesterIds,
      category,
      level,
      credits,
      visibility,
      studentAccess,
    } = body;

    // 3. Basic validation
    if (!title?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Course title is required",
        },
        { status: 400 }
      );
    }

    const parsedDepartmentId = Number(departmentId);

    if (
      !departmentId ||
      !Number.isInteger(parsedDepartmentId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid departmentId is required.",
        },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(programmeIds) ||
      programmeIds.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "At least one programme must be selected.",
        },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(semesterIds) ||
      semesterIds.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "At least one semester must be selected.",
        },
        { status: 400 }
      );
    }

    const parsedProgrammeIds: number[] =
      programmeIds.map(Number);

    const parsedSemesterIds: number[] =
      semesterIds.map(Number);

    // Make sure all IDs are valid integers
    if (
      parsedProgrammeIds.some(
        (id: number) => !Number.isInteger(id)
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid programme IDs.",
        },
        { status: 400 }
      );
    }

    if (
      parsedSemesterIds.some(
        (id: number) => !Number.isInteger(id)
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid semester IDs.",
        },
        { status: 400 }
      );
    }

    // 4. Verify department belongs to teacher's college
    const department = await prisma.department.findFirst({
      where: {
        id: parsedDepartmentId,
        collegeId: teacher.collegeId,
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

    // 5. Verify programmes belong to selected department
    const programmes = await prisma.programme.findMany({
      where: {
        id: {
          in: parsedProgrammeIds,
        },
        departmentId: parsedDepartmentId,
      },

      select: {
        id: true,
        name: true,
      },
    });

    if (programmes.length !== parsedProgrammeIds.length) {
      return NextResponse.json(
        {
          success: false,
          message:
            "One or more selected programmes do not belong to the selected department.",
        },
        { status: 400 }
      );
    }

    // 6. Verify semesters belong to selected programmes
    const semesters = await prisma.semester.findMany({
      where: {
        id: {
          in: parsedSemesterIds,
        },

        programmeId: {
          in: parsedProgrammeIds,
        },
      },

      select: {
        id: true,
        number: true,
        programmeId: true,
      },
    });

    if (semesters.length !== parsedSemesterIds.length) {
      return NextResponse.json(
        {
          success: false,
          message:
            "One or more selected semesters do not belong to the selected programmes.",
        },
        { status: 400 }
      );
    }

    // 7. Create course + programme/semester relationships
    const course = await prisma.course.create({
      data: {
        title: title.trim(),

        description:
          description?.trim() || null,

        category:
          category?.trim() || null,

        level:
          level?.trim() || null,

        credits:
          credits !== undefined &&
          credits !== null &&
          credits !== ""
            ? Number(credits)
            : null,

        visibility:
          visibility || "COLLEGE",

        studentAccess:
          studentAccess || "OPEN",

        department: {
          connect: {
            id: parsedDepartmentId,
          },
        },

        programmes: {
          create: parsedProgrammeIds.map(
            (programmeId: number) => ({
              programme: {
                connect: {
                  id: programmeId,
                },
              },
            })
          ),
        },

        semesters: {
          create: parsedSemesterIds.map(
            (semesterId: number) => ({
              semester: {
                connect: {
                  id: semesterId,
                },
              },
            })
          ),
        },

        teacher: {
          connect: {
            id: teacher.id,
          },
        },
      },

      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },

        programmes: {
          include: {
            programme: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },

        semesters: {
          include: {
            semester: {
              select: {
                id: true,
                number: true,
                programmeId: true,
              },
            },
          },
        },
      },
    });

    // 8. Success
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
          message:
            "You must join a college before using teacher features.",
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