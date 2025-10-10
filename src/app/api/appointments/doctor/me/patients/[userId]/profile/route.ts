import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET(_: Request, { params }: { params: { userId: string } }) {
  const { user } = await requireRole("DOCTOR");
  const doc = await prisma.doctor.findUnique({ where: { userId: user.id } });
  if (!doc) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const patientUserId = params.userId;
  const hasRelationship = await prisma.appointment.findFirst({
    where: { doctorId: doc.id, patientUserId },
  });
  if (!hasRelationship) return NextResponse.json({ error: "No appointment relationship" }, { status: 403 });

  const profile = await prisma.profile.findUnique({ where: { userId: patientUserId } });
  return NextResponse.json(profile ?? {});
}