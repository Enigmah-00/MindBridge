import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Convert minutes to time string
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${mins.toString().padStart(2, "0")} ${ampm}`;
}

export async function GET() {
  try {
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
        user: {
          select: {
            role: true,
            username: true
          }
        },
      specialties: {
        select: {
          specialty: {
            select: {
              key: true,
              name: true
            }
          }
        }
      },
      availability: {
        select: {
          weekday: true,
          startMinute: true,
          endMinute: true,
          timezone: true
        },
        orderBy: [
          { weekday: "asc" },
          { startMinute: "asc" }
        ]
      }
    },
    orderBy: { name: "asc" }
  });  // Format the response to be more user-friendly
  const formattedDoctors = doctors.map((doc: any) => {
    // Group availability by weekday
    const availabilityByDay: { [key: number]: string[] } = {};
    doc.availability.forEach((av: any) => {
      if (!availabilityByDay[av.weekday]) {
        availabilityByDay[av.weekday] = [];
      }
      const daySlots = availabilityByDay[av.weekday];
      if (daySlots) {
        daySlots.push(
          `${minutesToTime(av.startMinute)}-${minutesToTime(av.endMinute)}`
        );
      }
    });

    // Create readable availability strings
    const availabilityStrings = Object.entries(availabilityByDay).map(([day, times]) => {
      return `${WEEKDAYS[parseInt(day)]}: ${times.join(", ")}`;
    });

    // Only show availability if doctor is registered as a user AND has availability set
    const isRegisteredDoctor = doc.user && doc.user.role === "DOCTOR";
    const hasAvailabilityRecords = doc.availability.length > 0;
    
    return {
      id: doc.id,
      // Only include userId if the user has DOCTOR role (meaning they're signed up as a doctor)
      userId: isRegisteredDoctor ? doc.userId : undefined,
      name: doc.name,
      location: doc.city && doc.country ? `${doc.city}, ${doc.country}` : doc.city || doc.country || "Location not specified",
      telehealth: doc.telehealth,
      specialties: doc.specialties.map((s: any) => s.specialty.name),
      // Only include availability if doctor is registered AND has set their availability
      availability: isRegisteredDoctor && hasAvailabilityRecords ? availabilityStrings : [],
      hasAvailability: isRegisteredDoctor && hasAvailabilityRecords,
    };
  });

    return NextResponse.json(formattedDoctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 });
  }
}