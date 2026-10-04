//this code send USER fullname, userId and role to student/[protected]/page.tsx

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthenticated",
        },
        { status: 401 }
      );
    }

    if (user.role !== "STUDENT") {
      return NextResponse.json(
        {
          success: false,
          message: "Only students can access this endpoint.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        fullName: user.fullName,
        userId: user.userId,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Student /me error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}