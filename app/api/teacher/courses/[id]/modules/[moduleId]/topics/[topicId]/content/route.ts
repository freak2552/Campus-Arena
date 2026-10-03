import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
    moduleId: string;
    topicId: string;
  }>;
};

export async function POST(
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

    const body = await request.json();

    const type = body.type;

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

    if (type === "YOUTUBE") {
      const url = body.url?.trim();

      if (!url) {
        return NextResponse.json(
          {
            success: false,
            message: "YouTube URL is required",
          },
          { status: 400 }
        );
      }

      try {
        const parsedUrl = new URL(url);

        const isYouTube =
          parsedUrl.hostname === "youtube.com" ||
          parsedUrl.hostname === "www.youtube.com" ||
          parsedUrl.hostname === "youtu.be";

        if (!isYouTube) {
          return NextResponse.json(
            {
              success: false,
              message: "Please provide a valid YouTube URL",
            },
            { status: 400 }
          );
        }
      } catch {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid YouTube URL",
          },
          { status: 400 }
        );
      }
    }

    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid content type",
        },
        { status: 400 }
      );
    }

    const lastBlock = await prisma.contentBlock.findFirst({
      where: {
        topicId: topicIdNumber,
      },
      orderBy: {
        position: "desc",
      },
    });

    const position = lastBlock
      ? lastBlock.position + 1
      : 1;

    const block = await prisma.contentBlock.create({
      data: {
        type,
        position,
        content: body.content ?? null,
        url: body.url ?? null,

        cloudinaryPublicId:
          body.cloudinaryPublicId ?? null,

        cloudinaryResourceType:
          body.cloudinaryResourceType ?? null,

        topicId: topicIdNumber,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Content block created successfully",
        block,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create content block error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create content block",
      },
      { status: 500 }
    );
  }
}