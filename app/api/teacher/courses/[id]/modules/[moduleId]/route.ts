import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
    moduleId: string;
  }>;
};

export async function PATCH(
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
          message: "Module title is required",
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

    const updatedModule =
      await prisma.courseModule.update({
        where: {
          id: moduleIdNumber,
        },
        data: {
          title,
        },
      });

    return NextResponse.json({
      success: true,
      message: "Module updated successfully",
      module: updatedModule,
    });
  } catch (error) {
    console.error("Update module error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update module",
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

    await prisma.courseModule.delete({
      where: {
        id: moduleIdNumber,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Module deleted successfully",
    });
  } catch (error) {
    console.error("Delete module error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete module",
      },
      { status: 500 }
    );
  }
}