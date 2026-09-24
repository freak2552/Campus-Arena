import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: {
        teacherId: 1, // temporary until session is connected
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
      teacherId,
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

    if (!teacherId) {
      return NextResponse.json(
        {
          success: false,
          message: "Teacher ID is required",
        },
        { status: 400 }
      );
    }

    const teacher = await prisma.user.findUnique({
      where: {
        id: Number(teacherId),
      },
    });

    if (!teacher) {
      return NextResponse.json(
        {
          success: false,
          message: "Teacher not found",
        },
        { status: 404 }
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
        teacherId: Number(teacherId),
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