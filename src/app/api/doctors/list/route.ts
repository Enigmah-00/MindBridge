import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // Simple list for booking UI
  const doctors = await prisma.doctor.findMany({ select: { id: true, name: true } });
  return NextResponse.json(doctors);
}