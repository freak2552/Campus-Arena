// Sends the logged-in student's basic info to the student pages:
// fullName, userId, role and academic profile (department, programme, semester).

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthenticated",
        },
        { status: 401 }
      );
    }

    if (user.role !== "STUDENT") {
      return NextResponse.json(
        {
          success: false,
          message: "Only students can access this endpoint.",
        },
        { status: 403 }
      );
    }

    const academicProfile = await prisma.studentAcademicProfile.findUnique({
      where: { userId: user.id },
      select: {
        department: { select: { name: true } },
        programme: { select: { name: true } },
        semester: { select: { number: true } },
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        fullName: user.fullName,
        userId: user.userId,
        role: user.role,
        profile: academicProfile
          ? {
              departmentName: academicProfile.department.name,
              programmeName: academicProfile.programme.name,
              semesterNumber: academicProfile.semester.number,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Student /me error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}