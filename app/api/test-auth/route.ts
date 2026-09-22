import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireUser();

    return NextResponse.json({
      success: true,
      message: "You are authenticated.",
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

    console.error("Auth test error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}