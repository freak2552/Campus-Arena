import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: "Logout API - to be built later.",
    },
    { status: 501 }
  );
}