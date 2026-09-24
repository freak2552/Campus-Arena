import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
    moduleId: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    const { id, moduleId } = await params;

    const courseId = Number(id);
    const moduleIdNumber = Number(moduleId);

    if (
      Number.isNaN(courseId) ||
      Number.isNaN(moduleIdNumber)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid course or module ID",
        },
        { status: 400 }
      );
    }

    const module = await prisma.courseModule.findFirst({
      where: {
        id: moduleIdNumber,
        courseId,
      },
    });

    if (!module) {
      return NextResponse.json(
        {
          success: false,
          message: "Module not found",
        },
        { status: 404 }
      );
    }

    const topics = await prisma.topic.findMany({
      where: {
        moduleId: moduleIdNumber,
      },
      orderBy: {
        position: "asc",
      },
      include: {
        contentBlocks: {
          orderBy: {
            position: "asc",
          },
        },
        knowledgeCheck: {
          include: {
            questions: {
              orderBy: {
                position: "asc",
              },
              include: {
                options: {
                  orderBy: {
                    position: "asc",
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      topics,
    });
  } catch (error) {
    console.error("Get topics error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch topics",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: Params
) {
  try {
    const { id, moduleId } = await params;

    const courseId = Number(id);
    const moduleIdNumber = Number(moduleId);

    if (
      Number.isNaN(courseId) ||
      Number.isNaN(moduleIdNumber)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid course or module ID",
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
          message: "Topic title is required",
        },
        { status: 400 }
      );
    }

    const module = await prisma.courseModule.findFirst({
      where: {
        id: moduleIdNumber,
        courseId,
      },
    });

    if (!module) {
      return NextResponse.json(
        {
          success: false,
          message: "Module not found",
        },
        { status: 404 }
      );
    }

    const lastTopic = await prisma.topic.findFirst({
      where: {
        moduleId: moduleIdNumber,
      },
      orderBy: {
        position: "desc",
      },
    });

    const position = lastTopic
      ? lastTopic.position + 1
      : 1;

    const topic = await prisma.topic.create({
      data: {
        title,
        position,
        moduleId: moduleIdNumber,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Topic created successfully",
        topic,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create topic error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create topic",
      },
      { status: 500 }
    );
  }
}