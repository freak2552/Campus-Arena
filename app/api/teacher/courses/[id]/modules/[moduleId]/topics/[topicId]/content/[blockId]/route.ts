import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
    moduleId: string;
    topicId: string;
    blockId: string;
  }>;
};

const validTypes = [
  "TEXT",
  "VIDEO",
  "YOUTUBE",
  "PDF",
  "ARTICLE",
  "IMAGE",
  "FUN_FACT",
  "GOOD_TO_KNOW",
  "COMMON_MISTAKE",
];

export async function PATCH(
  request: Request,
  { params }: Params
) {
  try {
    const {
      id,
      moduleId,
      topicId,
      blockId,
    } = await params;

    const courseId = Number(id);
    const moduleIdNumber = Number(moduleId);
    const topicIdNumber = Number(topicId);
    const blockIdNumber = Number(blockId);

    if (
      Number.isNaN(courseId) ||
      Number.isNaN(moduleIdNumber) ||
      Number.isNaN(topicIdNumber) ||
      Number.isNaN(blockIdNumber)
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

    if (
      body.type !== undefined &&
      !validTypes.includes(body.type)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid content type",
        },
        { status: 400 }
      );
    }

    const block = await prisma.contentBlock.findFirst({
      where: {
        id: blockIdNumber,
        topicId: topicIdNumber,
        topic: {
          moduleId: moduleIdNumber,
          module: {
            courseId,
          },
        },
      },
    });

    if (!block) {
      return NextResponse.json(
        {
          success: false,
          message: "Content block not found",
        },
        { status: 404 }
      );
    }

    const updatedBlock =
      await prisma.contentBlock.update({
        where: {
          id: blockIdNumber,
        },
        data: {
          ...(body.type !== undefined && {
            type: body.type,
          }),

          ...(body.content !== undefined && {
            content: body.content,
          }),

          ...(body.url !== undefined && {
            url: body.url,
          }),
        },
      });

    return NextResponse.json({
      success: true,
      message: "Content block updated successfully",
      block: updatedBlock,
    });
  } catch (error) {
    console.error("Update content block error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update content block",
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
    const {
      id,
      moduleId,
      topicId,
      blockId,
    } = await params;

    const courseId = Number(id);
    const moduleIdNumber = Number(moduleId);
    const topicIdNumber = Number(topicId);
    const blockIdNumber = Number(blockId);

    if (
      Number.isNaN(courseId) ||
      Number.isNaN(moduleIdNumber) ||
      Number.isNaN(topicIdNumber) ||
      Number.isNaN(blockIdNumber)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid ID",
        },
        { status: 400 }
      );
    }

    const block = await prisma.contentBlock.findFirst({
      where: {
        id: blockIdNumber,
        topicId: topicIdNumber,
        topic: {
          moduleId: moduleIdNumber,
          module: {
            courseId,
          },
        },
      },
    });

    if (!block) {
      return NextResponse.json(
        {
          success: false,
          message: "Content block not found",
        },
        { status: 404 }
      );
    }

    await prisma.contentBlock.delete({
      where: {
        id: blockIdNumber,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Content block deleted successfully",
    });
  } catch (error) {
    console.error("Delete content block error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete content block",
      },
      { status: 500 }
    );
  }
}