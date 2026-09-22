import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

function generateCollegeId() {
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();

  return `CA-${random}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      fullName,
      userId,
      email,
      password,
      collegeName,
      collegeCode,
    } = body;

    // Basic validation
    if (
      !fullName ||
      !userId ||
      !email ||
      !password ||
      !collegeName ||
      !collegeCode
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All required fields must be provided.",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters long.",
        },
        { status: 400 }
      );
    }

    // Check User ID
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

    // Check email
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

    // Check college code
    const existingCollege = await prisma.college.findUnique({
      where: {
        code: collegeCode,
      },
    });

    if (existingCollege) {
      return NextResponse.json(
        {
          success: false,
          message: "This college code is already registered.",
        },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Generate public College ID
    const collegeId = generateCollegeId();

    // Create College + Admin together
    const result = await prisma.$transaction(async (tx) => {
      const college = await tx.college.create({
        data: {
          collegeId,
          name: collegeName,
          code: collegeCode,
        },
      });

      const admin = await tx.user.create({
        data: {
          userId,
          fullName,
          email,
          passwordHash,
          role: "ADMIN",
          collegeId: college.id,
        },
      });

      return {
        college,
        admin,
      };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Admin account and college created successfully.",

        admin: {
          id: result.admin.id,
          userId: result.admin.userId,
          fullName: result.admin.fullName,
          email: result.admin.email,
          role: result.admin.role,
        },

        college: {
          id: result.college.id,
          collegeId: result.college.collegeId,
          name: result.college.name,
          code: result.college.code,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin registration error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while creating the admin account.",
      },
      { status: 500 }
    );
  }
}