import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

function parseLocalDateToUTC(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00.000Z");
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export async function GET(req: NextRequest) {
  const { user } = await requireRole("DOCTOR");
  const doctor = await prisma.doctor.findUnique({ where: { userId: user.id } });
  if (!doctor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const where: any = { doctorId: doctor.id };
  if (date) where.date = parseLocalDateToUTC(date);

  const appts = await prisma.appointment.findMany({
    where,
    orderBy: [{ date: "asc" }, { serialNumber: "asc" }],
    include: { patient: { select: { id: true, username: true } } },
  });
  return NextResponse.json(appts);
}