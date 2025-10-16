import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest) {
  try {
    const { user } = await requireSession();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if email is already taken by another user
    const existing = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        NOT: { id: user.id }
      }
    });

    if (existing) {
      return NextResponse.json(
        { error: "This email is already in use by another account" },
        { status: 409 }
      );
    }

    // Update user email
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { email: email.toLowerCase() },
      select: {
        id: true,
        username: true,
        email: true,
        role: true
      }
    });

    return NextResponse.json({
      message: "Email updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Update email error:", error);
    return NextResponse.json(
      { error: "Failed to update email" },
      { status: 500 }
    );
  }
}
