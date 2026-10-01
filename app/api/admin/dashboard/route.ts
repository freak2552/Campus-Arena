import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    // ============================================
    // 1. Check that the user is an ADMIN
    // ============================================

    const admin = await requireRole(["ADMIN"]);

    // ============================================
    // 2. Admin must belong to a college
    // ============================================

    if (!admin.collegeId) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin is not associated with a college.",
        },
        { status: 400 }
      );
    }

    // ============================================
    // 3. Get college information
    // ============================================

    const college = await prisma.college.findUnique({
      where: {
        id: admin.collegeId,
      },
      select: {
        id: true,
        collegeId: true,
        name: true,
        code: true,
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

    // ============================================
    // 4. Get dashboard counts
    // ============================================

    const [
      departmentCount,
      programmeCount,
      semesterCount,
      teacherCount,
      studentCount,
    ] = await Promise.all([
      // Departments
      prisma.department.count({
        where: {
          collegeId: admin.collegeId,
        },
      }),

      // Programmes
      prisma.programme.count({
        where: {
          department: {
            collegeId: admin.collegeId,
          },
        },
      }),

      // Semesters
      prisma.semester.count({
        where: {
          programme: {
            department: {
              collegeId: admin.collegeId,
            },
          },
        },
      }),

      // Teachers
      prisma.user.count({
        where: {
          collegeId: admin.collegeId,
          role: "TEACHER",
        },
      }),

      // Students
      prisma.user.count({
        where: {
          collegeId: admin.collegeId,
          role: "STUDENT",
        },
      }),
    ]);

    // ============================================
    // 5. Return dashboard data
    // ============================================

    return NextResponse.json({
      success: true,

      admin: {
        id: admin.id,
        userId: admin.userId,
        fullName: admin.fullName,
        email: admin.email,
      },

      college: {
        id: college.id,
        collegeId: college.collegeId,
        name: college.name,
        code: college.code,
      },

      stats: {
        departments: departmentCount,
        programmes: programmeCount,
        semesters: semesterCount,
        teachers: teacherCount,
        students: studentCount,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    // ============================================
    // Authentication errors
    // ============================================

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
            message: "Only admins can access this dashboard.",
          },
          { status: 403 }
        );
      }
    }

    // ============================================
    // Generic error
    // ============================================

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while loading the dashboard.",
      },
      { status: 500 }
    );
  }
}