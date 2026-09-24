import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
    moduleId: string;
    topicId: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    const { id, moduleId, topicId } = await params;

    const courseId = Number(id);
    const moduleIdNumber = Number(moduleId);
    const topicIdNumber = Number(topicId);

    if (
      Number.isNaN(courseId) ||
      Number.isNaN(moduleIdNumber) ||
      Number.isNaN(topicIdNumber)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid ID",
        },
        { status: 400 }
      );
    }

    const topic = await prisma.topic.findFirst({
      where: {
        id: topicIdNumber,
        moduleId: moduleIdNumber,
        module: {
          courseId,
        },
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

    if (!topic) {
      return NextResponse.json(
        {
          success: false,
          message: "Topic not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      topic,
    });
  } catch (error) {
    console.error("Get topic error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch topic",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: Params
) {
  try {
    const { id, moduleId, topicId } = await params;

    const courseId = Number(id);
    const moduleIdNumber = Number(moduleId);
    const topicIdNumber = Number(topicId);

    if (
      Number.isNaN(courseId) ||
      Number.isNaN(moduleIdNumber) ||
      Number.isNaN(topicIdNumber)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid ID",
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

    const topic = await prisma.topic.findFirst({
      where: {
        id: topicIdNumber,
        moduleId: moduleIdNumber,
        module: {
          courseId,
        },
      },
    });

    if (!topic) {
      return NextResponse.json(
        {
          success: false,
          message: "Topic not found",
        },
        { status: 404 }
      );
    }

    const updatedTopic = await prisma.topic.update({
      where: {
        id: topicIdNumber,
      },
      data: {
        title,
      },
    });

    return NextResponse.json({
      success: true,
      topic: updatedTopic,
    });
  } catch (error) {
    console.error("Update topic error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update topic",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: Params
) {
  try {
    const { id, moduleId, topicId } = await params;

    const courseId = Number(id);
    const moduleIdNumber = Number(moduleId);
    const topicIdNumber = Number(topicId);

    if (
      Number.isNaN(courseId) ||
      Number.isNaN(moduleIdNumber) ||
      Number.isNaN(topicIdNumber)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid ID",
        },
        { status: 400 }
      );
    }

    const topic = await prisma.topic.findFirst({
      where: {
        id: topicIdNumber,
        moduleId: moduleIdNumber,
        module: {
          courseId,
        },
      },
    });

    if (!topic) {
      return NextResponse.json(
        {
          success: false,
          message: "Topic not found",
        },
        { status: 404 }
      );
    }

    await prisma.topic.delete({
      where: {
        id: topicIdNumber,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Topic deleted successfully",
    });
  } catch (error) {
    console.error("Delete topic error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete topic",
      },
      { status: 500 }
    );
  }
}