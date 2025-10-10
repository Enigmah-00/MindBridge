import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { haversine } from "@/lib/geo";

export async function GET(req: NextRequest) {
  const { user } = await requireSession();
  const { searchParams } = new URL(req.url);
  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");
  const maxKm = parseFloat(searchParams.get("maxKm") ?? "50");

  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });

  const uLat = latParam ? parseFloat(latParam) : profile?.latitude;
  const uLng = lngParam ? parseFloat(lngParam) : profile?.longitude;

  if (uLat == null || uLng == null) {
    return NextResponse.json({ error: "Provide location or set it in profile" }, { status: 400 });
  }

  const concerns = await prisma.derivedConcern.findMany({ where: { userId: user.id } });
  const concernKeys = new Set(concerns.map(c => c.concern));
  // Map concerns -> specialties
  const mapped = new Set<string>();
  for (const c of concernKeys) {
    if (c === "anxiety" || c === "depression") mapped.add("therapy-cbt");
    if (c === "sleep") mapped.add("sleep-medicine");
    mapped.add("psychiatry");
  }

  const doctors = await prisma.doctor.findMany({
    include: { specialties: { include: { specialty: true } } }
  });

  const filtered = doctors
    .map(d => {
      const hasMatch = d.specialties.some(s => mapped.size === 0 || mapped.has(s.specialty.key));
      const dist = d.latitude != null && d.longitude != null ? haversine(uLat!, uLng!, d.latitude, d.longitude) : Number.POSITIVE_INFINITY;
      return { ...d, distanceKm: dist, hasMatch };
    })
    .filter(d => d.hasMatch && d.distanceKm <= maxKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 10);

  return NextResponse.json(filtered);
}