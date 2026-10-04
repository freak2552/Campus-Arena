import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireTeacherWithCollege } from "@/lib/auth";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// ============================================================
// GET COURSE SETTINGS
// ============================================================

export async function GET(
  request: Request,
  { params }: Params
) {
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

    const { id } = await params;
    const courseId = Number(id);

    if (!Number.isInteger(courseId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid course ID",
        },
        { status: 400 }
      );
    }

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,

        // Teacher can only access their own course
        teacherId: teacher.id,

        // Course must belong to teacher's college
        department: {
          collegeId: teacher.collegeId,
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
                departmentId: true,
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


// ============================================================
// UPDATE COURSE SETTINGS
// ============================================================

export async function PATCH(
  request: Request,
  { params }: Params
) {
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

    const { id } = await params;
    const courseId = Number(id);

    if (!Number.isInteger(courseId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid course ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    // --------------------------------------------------------
    // Find course belonging to logged-in teacher
    // --------------------------------------------------------

    const existingCourse =
      await prisma.course.findFirst({
        where: {
          id: courseId,
          teacherId: teacher.id,

          department: {
            collegeId: teacher.collegeId,
          },
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

    // --------------------------------------------------------
    // Validate basic academic IDs
    // --------------------------------------------------------

    const departmentId = Number(body.departmentId);

    const programmeIds: number[] = Array.isArray(
      body.programmeIds
    )
      ? Array.from(
        new Set(
          body.programmeIds.map(Number)
        )
      )
      : [];

    const semesterIds: number[] = Array.isArray(
      body.semesterIds
    )
      ? Array.from(
        new Set(
          body.semesterIds.map(Number)
        )
      )
      : [];

    if (!Number.isInteger(departmentId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid departmentId is required.",
        },
        { status: 400 }
      );
    }

    if (programmeIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "At least one programme must be selected.",
        },
        { status: 400 }
      );
    }

    if (semesterIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "At least one semester must be selected.",
        },
        { status: 400 }
      );
    }

    if (
      programmeIds.some(
        (id) => !Number.isInteger(id)
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
      semesterIds.some(
        (id) => !Number.isInteger(id)
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

    // --------------------------------------------------------
    // Verify department belongs to teacher's college
    // --------------------------------------------------------

    const department =
      await prisma.department.findFirst({
        where: {
          id: departmentId,
          collegeId: teacher.collegeId,
        },
      });

    if (!department) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Department not found in your college.",
        },
        { status: 404 }
      );
    }

    // --------------------------------------------------------
    // Verify programmes belong to department
    // --------------------------------------------------------

    const programmes =
      await prisma.programme.findMany({
        where: {
          id: {
            in: programmeIds,
          },
          departmentId,
        },

        select: {
          id: true,
        },
      });

    if (programmes.length !== programmeIds.length) {
      return NextResponse.json(
        {
          success: false,
          message:
            "One or more selected programmes do not belong to the selected department.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // Verify semesters belong to selected programmes
    // --------------------------------------------------------

    const semesters =
      await prisma.semester.findMany({
        where: {
          id: {
            in: semesterIds,
          },

          programmeId: {
            in: programmeIds,
          },
        },

        select: {
          id: true,
          programmeId: true,
        },
      });

    if (semesters.length !== semesterIds.length) {
      return NextResponse.json(
        {
          success: false,
          message:
            "One or more selected semesters do not belong to the selected programmes.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // Prepare optional fields
    // --------------------------------------------------------

    const updateData: any = {
      title:
        body.title !== undefined
          ? String(body.title).trim()
          : undefined,

      description:
        body.description !== undefined
          ? String(body.description).trim() || null
          : undefined,

      category:
        body.category !== undefined
          ? String(body.category).trim() || null
          : undefined,

      level:
        body.level !== undefined
          ? String(body.level).trim() || null
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

      // New department relation
      department: {
        connect: {
          id: departmentId,
        },
      },

      // Replace existing programme relationships
      programmes: {
        deleteMany: {},

        create: programmeIds.map(
          (programmeId: number) => ({
            programme: {
              connect: {
                id: programmeId,
              },
            },
          })
        ),
      },

      // Replace existing semester relationships
      semesters: {
        deleteMany: {},

        create: semesterIds.map(
          (semesterId: number) => ({
            semester: {
              connect: {
                id: semesterId,
              },
            },
          })
        ),
      },
    };

    // --------------------------------------------------------
    // Update course
    // --------------------------------------------------------

    const updatedCourse =
      await prisma.course.update({
        where: {
          id: courseId,
        },

        data: updateData,

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

    return NextResponse.json({
      success: true,
      message: "Course settings updated successfully",
      course: updatedCourse,
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


// ============================================================
// DELETE COURSE
// ============================================================

export async function DELETE(
  request: Request,
  { params }: Params
) {
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

    const { id } = await params;
    const courseId = Number(id);

    if (!Number.isInteger(courseId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid course ID",
        },
        { status: 400 }
      );
    }

    // Only allow teacher to delete their own course
    // from their own college.
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        teacherId: teacher.id,

        department: {
          collegeId: teacher.collegeId,
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