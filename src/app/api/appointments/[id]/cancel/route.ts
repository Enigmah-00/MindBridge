import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function PATCH(_: NextRequest, { params }: { params: { id: string } }) {
  const { user } = await requireSession();
  const appt = await prisma.appointment.findUnique({ where: { id: params.id } });
  if (!appt) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const doctor = await prisma.doctor.findUnique({ where: { userId: user.id } });
  const isDoctor = !!doctor && doctor.id === appt.doctorId;
  if (appt.patientUserId !== user.id && !isDoctor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const updated = await prisma.appointment.update({ where: { id: appt.id }, data: { status: "CANCELLED" } });
  return NextResponse.json(updated);
}