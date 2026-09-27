import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated.",
        },
        { status: 401 }
      );
    }

    if (user.role !== "TEACHER") {
      return NextResponse.json(
        {
          success: false,
          message: "Teacher access required.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const collegeId = body.collegeId?.trim();

    if (!collegeId) {
      return NextResponse.json(
        {
          success: false,
          message: "College ID is required.",
        },
        { status: 400 }
      );
    }

    // Find the college using the public College ID
    const college = await prisma.college.findUnique({
      where: {
        collegeId: collegeId,
      },
    });

    if (!college) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid College ID.",
        },
        { status: 404 }
      );
    }

    // Connect the teacher to this college
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        collegeId: college.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "You have successfully joined the college.",
      college: {
        id: college.id,
        collegeId: college.collegeId,
        name: college.name,
      },
    });
  } catch (error) {
    console.error("Join college error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}