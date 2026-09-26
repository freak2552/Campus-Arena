import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
    moduleId: string;
    topicId: string;
    questionId: string;
  }>;
};

export async function POST(
  request: Request,
  { params }: Params
) {
  try {
    const {
      id,
      moduleId,
      topicId,
      questionId,
    } = await params;

    const courseId = Number(id);
    const moduleIdNumber = Number(moduleId);
    const topicIdNumber = Number(topicId);
    const questionIdNumber = Number(questionId);

    const body = await request.json();

    const text = body.text?.trim();

    if (!text) {
      return NextResponse.json(
        {
          success: false,
          message: "Option text is required",
        },
        { status: 400 }
      );
    }

    const question =
      await prisma.question.findFirst({
        where: {
          id: questionIdNumber,
          knowledgeCheck: {
            topicId: topicIdNumber,
            topic: {
              moduleId: moduleIdNumber,
              module: {
                courseId,
              },
            },
          },
        },
      });

    if (!question) {
      return NextResponse.json(
        {
          success: false,
          message: "Question not found",
        },
        { status: 404 }
      );
    }

    const lastOption =
      await prisma.questionOption.findFirst({
        where: {
          questionId: questionIdNumber,
        },
        orderBy: {
          position: "desc",
        },
      });

    const position = lastOption
      ? lastOption.position + 1
      : 1;

    if (body.isCorrect) {
      await prisma.questionOption.updateMany({
        where: {
          questionId: questionIdNumber,
        },
        data: {
          isCorrect: false,
        },
      });
    }

    const option =
      await prisma.questionOption.create({
        data: {
          text,
          isCorrect: Boolean(body.isCorrect),
          position,
          questionId: questionIdNumber,
        },
      });

    return NextResponse.json(
      {
        success: true,
        option,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create option",
      },
      { status: 500 }
    );
  }
}