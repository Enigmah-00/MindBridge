import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function parseLocalDateToUTC(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00.000Z");
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { user } = await requireSession();
  const { doctorId, date, startMinute } = await req.json() as { doctorId: string; date: string; startMinute: number };
  if (!doctorId || !date || startMinute == null) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const dateUtc = parseLocalDateToUTC(date);

  try {
    const result = await prisma.$transaction(async (tx) => {
      const weekday = dateUtc.getUTCDay();
      const av = await tx.doctorWeeklyAvailability.findFirst({
        where: { doctorId, weekday, startMinute: { lte: startMinute }, endMinute: { gt: startMinute } },
      });
      if (!av) throw new Error("Slot not in doctor's availability");

      const existing = await tx.appointment.findUnique({ where: { doctorId_date_startMinute: { doctorId, date: dateUtc, startMinute } } });
      if (existing) throw new Error("Slot already booked");

      // Get current counter and increment
      const existingCounter = await tx.appointmentDayCounter.findUnique({
        where: { doctorId_date: { doctorId, date: dateUtc } },
      });
      
      const serial = existingCounter ? existingCounter.nextSerial + 1 : 1;
      
      await tx.appointmentDayCounter.upsert({
        where: { doctorId_date: { doctorId, date: dateUtc } },
        update: { nextSerial: serial },
        create: { doctorId, date: dateUtc, nextSerial: serial },
      });

      const appt = await tx.appointment.create({
        data: {
          doctorId,
          patientUserId: user.id,
          date: dateUtc,
          startMinute,
          status: "BOOKED",
          serialNumber: serial,
        },
      });
      return appt;
    });

    return NextResponse.json({ appointmentId: result.id, serialNumber: result.serialNumber });
  } catch (e: any) {
    const msg: string = e?.message || "Booking failed";
    const code = msg.includes("already booked") || msg.includes("availability") ? 409 : 500;
    return NextResponse.json({ error: msg }, { status: code });
  }
}

export async function GET() {
  const { user } = await requireSession();
  const appts = await prisma.appointment.findMany({
    where: { patientUserId: user.id },
    orderBy: [{ date: "desc" }, { startMinute: "desc" }],
    include: { doctor: { select: { name: true } } }
  });
  return NextResponse.json(appts);
}