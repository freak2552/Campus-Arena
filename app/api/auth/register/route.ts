import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      role,
      fullName,
      userId,
      email,
      password,
    } = body;

    // 1. Basic validation
    if (
      !role ||
      !fullName ||
      !userId ||
      !email ||
      !password
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All required fields must be provided.",
        },
        { status: 400 }
      );
    }

    // 2. Check valid role
    if (role !== "student" && role !== "teacher") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid role.",
        },
        { status: 400 }
      );
    }

    // 3. Check password length
    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters long.",
        },
        { status: 400 }
      );
    }

    // 4. Check whether User ID already exists
    const existingUserId = await prisma.user.findUnique({
      where: {
        userId,
      },
    });

    if (existingUserId) {
      return NextResponse.json(
        {
          success: false,
          message: "This User ID is already registered.",
        },
        { status: 409 }
      );
    }

    // 5. Check whether email already exists
    const existingEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "This email is already registered.",
        },
        { status: 409 }
      );
    }

    // 6. Hash password
    const passwordHash = await hashPassword(password);

    // 7. Convert frontend role to Prisma enum
    const prismaRole =
      role === "student" ? "STUDENT" : "TEACHER";

    // 8. Create user
    const user = await prisma.user.create({
      data: {
        userId,
        fullName,
        email,
        passwordHash,
        role: prismaRole,
      },
    });

    // 9. Send safe response
    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        user: {
          id: user.id,
          userId: user.userId,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while creating the account.",
      },
      { status: 500 }
    );
  }
}