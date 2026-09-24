import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const courseId = Number(id);

    if (!courseId || Number.isNaN(courseId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid course ID",
        },
        { status: 400 }
      );
    }

    const modules = await prisma.courseModule.findMany({
      where: {
        courseId,
      },
      orderBy: {
        position: "asc",
      },
      include: {
        topics: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      modules,
    });
  } catch (error) {
    console.error("Get modules error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch modules",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const courseId = Number(id);

    if (!courseId || Number.isNaN(courseId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid course ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const title = body.title?.trim();

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message: "Module title is required",
        },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
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

    const lastModule = await prisma.courseModule.findFirst({
      where: {
        courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const position = lastModule
      ? lastModule.position + 1
      : 1;

    const module = await prisma.courseModule.create({
      data: {
        title,
        position,
        courseId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Module created successfully",
        module,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create module error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create module",
      },
      { status: 500 }
    );
  }
}