import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/password";
import { createSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { role, userId, password } = body;

    // 1. Basic validation
    if (!role || !userId || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID, password and role are required.",
        },
        { status: 400 }
      );
    }

    // 2. Check valid role
    if (role !== "student" && role !== "teacher" && role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid role.",
        },
        { status: 400 }
      );
    }

    // 3. Find user
    const user = await prisma.user.findUnique({
      where: {
        userId,
      },
    });

    // 4. User not found
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid User ID or password.",
        },
        { status: 401 }
      );
    }

    // 5. Check role
    const expectedRole = role === "student" ? "STUDENT" : role === "teacher"? "TEACHER" : "ADMIN";

    if (user.role !== expectedRole) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid User ID or password.",
        },
        { status: 401 }
      );
    }

    // 6. Check password
    if (!user.passwordHash) {
      return NextResponse.json(
        {
          success: false,
          message: "This account does not have a password login.",
        },
        { status: 401 }
      );
    }

    const passwordMatch = await comparePassword(
      password,
      user.passwordHash
    );

    if (!passwordMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid User ID or password.",
        },
        { status: 401 }
      );
    }

    // 7. Create session
    await createSession(user.id);

    // 8. Successful login
    return NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        user: {
          id: user.id,
          userId: user.userId,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while logging in.",
      },
      { status: 500 }
    );
  }
}