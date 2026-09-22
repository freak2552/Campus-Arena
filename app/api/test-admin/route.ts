import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireRole(["ADMIN"]);

    return NextResponse.json({
      success: true,
      message: "Admin access granted.",
      user: {
        id: user.id,
        userId: user.userId,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHENTICATED") {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 }
      );
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json(
        {
          success: false,
          message: "You do not have permission to access this resource.",
        },
        { status: 403 }
      );
    }

    console.error("Admin authorization error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}