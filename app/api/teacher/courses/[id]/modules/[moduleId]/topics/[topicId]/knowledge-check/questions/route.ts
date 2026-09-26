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

    const body = await request.json();

    const questionText = body.question?.trim();

    if (!questionText) {
      return NextResponse.json(
        {
          success: false,
          message: "Question is required",
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

    let knowledgeCheck =
      await prisma.knowledgeCheck.findUnique({
        where: {
          topicId: topicIdNumber,
        },
      });

    if (!knowledgeCheck) {
      knowledgeCheck =
        await prisma.knowledgeCheck.create({
          data: {
            topicId: topicIdNumber,
          },
        });
    }

    const lastQuestion =
      await prisma.question.findFirst({
        where: {
          knowledgeCheckId: knowledgeCheck.id,
        },
        orderBy: {
          position: "desc",
        },
      });

    const position = lastQuestion
      ? lastQuestion.position + 1
      : 1;

    const question = await prisma.question.create({
      data: {
        question: questionText,
        explanation:
          body.explanation?.trim() || null,
        position,
        knowledgeCheckId: knowledgeCheck.id,
        options: {
          create: (body.options || []).map(
            (option: any, index: number) => ({
              text: option.text,
              isCorrect: Boolean(option.isCorrect),
              position: index + 1,
            })
          ),
        },
      },
      include: {
        options: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        question,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create question",
      },
      { status: 500 }
    );
  }
}