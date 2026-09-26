import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
    moduleId: string;
    topicId: string;
    questionId: string;
    optionId: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: Params
) {
  try {
    const {
      id,
      moduleId,
      topicId,
      questionId,
      optionId,
    } = await params;

    const courseId = Number(id);
    const moduleIdNumber = Number(moduleId);
    const topicIdNumber = Number(topicId);
    const questionIdNumber = Number(questionId);
    const optionIdNumber = Number(optionId);

    const body = await request.json();

    const option =
      await prisma.questionOption.findFirst({
        where: {
          id: optionIdNumber,
          questionId: questionIdNumber,
          question: {
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
        },
      });

    if (!option) {
      return NextResponse.json(
        {
          success: false,
          message: "Option not found",
        },
        { status: 404 }
      );
    }

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

    const updated =
      await prisma.questionOption.update({
        where: {
          id: optionIdNumber,
        },
        data: {
          text:
            body.text !== undefined
              ? body.text.trim()
              : undefined,

          isCorrect:
            body.isCorrect !== undefined
              ? Boolean(body.isCorrect)
              : undefined,
        },
      });

    return NextResponse.json({
      success: true,
      option: updated,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update option",
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
      questionId,
      optionId,
    } = await params;

    const courseId = Number(id);
    const moduleIdNumber = Number(moduleId);
    const topicIdNumber = Number(topicId);
    const questionIdNumber = Number(questionId);
    const optionIdNumber = Number(optionId);

    const option =
      await prisma.questionOption.findFirst({
        where: {
          id: optionIdNumber,
          questionId: questionIdNumber,
          question: {
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
        },
      });

    if (!option) {
      return NextResponse.json(
        {
          success: false,
          message: "Option not found",
        },
        { status: 404 }
      );
    }

    await prisma.questionOption.delete({
      where: {
        id: optionIdNumber,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Option deleted",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete option",
      },
      { status: 500 }
    );
  }
}