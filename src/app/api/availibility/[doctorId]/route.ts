import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function parseLocalDateToUTC(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00.000Z");
  d.setUTCHours(0, 0, 0, 0);
  return d;
}
function weekdayFromDateUtc(dateUtc: Date): number {
  return dateUtc.getUTCDay();
}
function generateDailySlots(avails: any[], weekday: number) {
  const dayAvails = avails.filter((a: any) => a.weekday === weekday);
  const slots: { startMinute: number; endMinute: number; slotMinutes: number }[] = [];
  for (const a of dayAvails) {
    const step = a.slotMinutes;
    for (let m = a.startMinute; m + step <= a.endMinute; m += step) {
      slots.push({ startMinute: m, endMinute: m + step, slotMinutes: step });
    }
  }
  return slots;
}

export async function GET(req: NextRequest, { params }: { params: { doctorId: string } }) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  if (!date) return NextResponse.json({ error: "date is required (YYYY-MM-DD)" }, { status: 400 });

  const avails = await prisma.doctorWeeklyAvailability.findMany({ where: { doctorId: params.doctorId } });
  if (avails.length === 0) return NextResponse.json([]);

  const dateUtc = parseLocalDateToUTC(date);
  const weekday = weekdayFromDateUtc(dateUtc);

  const slots = generateDailySlots(avails, weekday);
  const appts = await prisma.appointment.findMany({ where: { doctorId: params.doctorId, date: dateUtc, status: { in: ["BOOKED", "COMPLETED"] } } });
  const booked = new Set(appts.map(a => a.startMinute));
  const free = slots.filter(s => !booked.has(s.startMinute));

  return NextResponse.json(free);
}