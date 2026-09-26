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

    const knowledgeCheck =
      await prisma.knowledgeCheck.findUnique({
        where: {
          topicId: topicIdNumber,
        },
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
      });

    return NextResponse.json({
      success: true,
      knowledgeCheck,
    });
  } catch (error) {
    console.error(
      "GET KNOWLEDGE CHECK ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load knowledge check",
      },
      { status: 500 }
    );
  }
}