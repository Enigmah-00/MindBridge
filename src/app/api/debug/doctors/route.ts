import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({
      select: {
        name: true,
        avgRating: true,
        totalReviews: true,
        feePerVisit: true,
        appointments: {
          select: {
            id: true,
            rating: true,
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    const debugData = doctors.map(d => ({
      name: d.name,
      avgRating: d.avgRating,
      totalReviews: d.totalReviews,
      feePerVisit: d.feePerVisit,
      appointmentCount: d.appointments.length,
      appointmentRatings: d.appointments.map(a => a.rating).filter(r => r !== null)
    }));

    return NextResponse.json({
      message: "Debug data for all doctors",
      doctors: debugData,
      count: doctors.length
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json(
      { error: "Failed to fetch debug data" },
      { status: 500 }
    );
  }
}
