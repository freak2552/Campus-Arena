import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";


// ================================
// CREATE DEPARTMENT
// ================================
export async function POST(request: Request) {
  try {
    // 1. Check that the user is logged in
    //    and is an ADMIN
    const admin = await requireRole(["ADMIN"]);

    // 2. Admin must belong to a college
    if (!admin.collegeId) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin is not associated with a college.",
        },
        { status: 400 }
      );
    }

    // 3. Read request body
    const body = await request.json();

    const name = body.name?.trim();

    // 4. Validate department name
    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Department name is required.",
        },
        { status: 400 }
      );
    }

    // 5. Check whether this department
    //    already exists in this college
    const existingDepartment = await prisma.department.findUnique({
      where: {
        collegeId_name: {
          collegeId: admin.collegeId,
          name,
        },
      },
    });

    if (existingDepartment) {
      return NextResponse.json(
        {
          success: false,
          message: "This department already exists.",
        },
        { status: 409 }
      );
    }

    // 6. Create department
    const department = await prisma.department.create({
      data: {
        name,
        collegeId: admin.collegeId,
      },
    });

    // 7. Return created department
    return NextResponse.json(
      {
        success: true,
        message: "Department created successfully.",
        department: {
          id: department.id,
          name: department.name,
          collegeId: department.collegeId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create department error:", error);

    // Authentication / authorization errors
    if (error instanceof Error) {
      if (error.message === "UNAUTHENTICATED") {
        return NextResponse.json(
          {
            success: false,
            message: "You must be logged in.",
          },
          { status: 401 }
        );
      }

      if (error.message === "FORBIDDEN") {
        return NextResponse.json(
          {
            success: false,
            message: "Only admins can create departments.",
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while creating the department.",
      },
      { status: 500 }
    );
  }
}


// ================================
// GET DEPARTMENTS
// ================================
export async function GET() {
  try {
    // 1. Check logged-in Admin
    const admin = await requireRole(["ADMIN"]);

    // 2. Admin must belong to a college
    if (!admin.collegeId) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin is not associated with a college.",
        },
        { status: 400 }
      );
    }

    // 3. Get departments belonging ONLY
    //    to this Admin's college
    const departments = await prisma.department.findMany({
      where: {
        collegeId: admin.collegeId,
      },

      orderBy: {
        name: "asc",
      },

      include: {
        _count: {
          select: {
            programmes: true,
          },
        },
      },
    });

    // 4. Return departments
    return NextResponse.json({
      success: true,
      departments: departments.map((department) => ({
        id: department.id,
        name: department.name,
        programmeCount: department._count.programmes,
        createdAt: department.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get departments error:", error);

    if (error instanceof Error) {
      if (error.message === "UNAUTHENTICATED") {
        return NextResponse.json(
          {
            success: false,
            message: "You must be logged in.",
          },
          { status: 401 }
        );
      }

      if (error.message === "FORBIDDEN") {
        return NextResponse.json(
          {
            success: false,
            message: "Only admins can view departments.",
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while loading departments.",
      },
      { status: 500 }
    );
  }
}