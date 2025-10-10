import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const doctors = await prisma.doctor.findMany({
    select: {
      id: true,
      userId: true,
      name: true,
      city: true,
      country: true,
      telehealth: true,
      latitude: true,
      longitude: true,
      specialties: {
        select: {
          specialty: {
            select: {
              key: true,
              name: true
            }
          }
        }
      }
    },
    orderBy: { name: "asc" }
  });

  // Format the response to be more user-friendly
  const formattedDoctors = doctors.map((doc: any) => ({
    id: doc.id,
    userId: doc.userId,
    name: doc.name,
    location: doc.city && doc.country ? `${doc.city}, ${doc.country}` : doc.city || doc.country || "Location not specified",
    telehealth: doc.telehealth,
    latitude: doc.latitude,
    longitude: doc.longitude,
    specialties: doc.specialties.map((s: any) => s.specialty.name),
  }));

  return NextResponse.json(formattedDoctors);
}