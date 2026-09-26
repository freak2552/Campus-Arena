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
    } = await params;

    const courseId = Number(id);
    const moduleIdNumber = Number(moduleId);
    const topicIdNumber = Number(topicId);
    const questionIdNumber = Number(questionId);

    const body = await request.json();

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

    const updated =
      await prisma.question.update({
        where: {
          id: questionIdNumber,
        },
        data: {
          question:
            body.question !== undefined
              ? body.question.trim()
              : undefined,

          explanation:
            body.explanation !== undefined
              ? body.explanation.trim() || null
              : undefined,
        },
        include: {
          options: {
            orderBy: {
              position: "asc",
            },
          },
        },
      });

    return NextResponse.json({
      success: true,
      question: updated,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update question",
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
    } = await params;

    const courseId = Number(id);
    const moduleIdNumber = Number(moduleId);
    const topicIdNumber = Number(topicId);
    const questionIdNumber = Number(questionId);

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

    await prisma.question.delete({
      where: {
        id: questionIdNumber,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Question deleted",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete question",
      },
      { status: 500 }
    );
  }
}