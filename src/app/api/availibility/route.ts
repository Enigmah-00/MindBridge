import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { user } = await requireRole("DOCTOR");
  const doctor = await prisma.doctor.findUnique({ where: { userId: user.id } });
  if (!doctor) return NextResponse.json({ error: "Doctor not found" }, { status: 400 });

  const { slots } = await req.json() as {
    slots: { weekday: number; startMinute: number; endMinute: number; slotMinutes?: number; timezone: string }[];
  };
  if (!Array.isArray(slots) || slots.length === 0) return NextResponse.json({ error: "No slots provided" }, { status: 400 });

  await prisma.$transaction(async (tx) => {
    await tx.doctorWeeklyAvailability.deleteMany({ where: { doctorId: doctor.id } });
    await tx.doctorWeeklyAvailability.createMany({
      data: slots.map(s => ({
        doctorId: doctor.id,
        weekday: s.weekday,
        startMinute: s.startMinute,
        endMinute: s.endMinute,
        slotMinutes: s.slotMinutes ?? 20,
        timezone: s.timezone,
      })),
    });
  });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const { user } = await requireRole("DOCTOR");
  const doctor = await prisma.doctor.findUnique({ where: { userId: user.id } });
  if (!doctor) return NextResponse.json({ error: "Doctor not found" }, { status: 400 });
  const av = await prisma.doctorWeeklyAvailability.findMany({ where: { doctorId: doctor.id }, orderBy: [{ weekday: "asc" }, { startMinute: "asc" }] });
  return NextResponse.json(av);
}