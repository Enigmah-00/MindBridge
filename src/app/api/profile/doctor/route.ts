import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// Get doctor profile with specialties
export async function GET() {
  const { user } = await requireRole("DOCTOR");
  
  const doctor = await prisma.doctor.findUnique({
    where: { userId: user.id },
    include: {
      specialties: {
        include: {
          specialty: true
        }
      }
    }
  });

  if (!doctor) {
    return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...doctor,
    specialtyIds: doctor.specialties.map((ds: any) => ds.specialtyId)
  });
}

// Update doctor profile including specialties
export async function PUT(req: NextRequest) {
  const { user } = await requireRole("DOCTOR");
  const data = await req.json();
  
  const { specialtyIds, ...doctorData } = data;

  // Update doctor basic info
  const doctor = await prisma.doctor.update({
    where: { userId: user.id },
    data: {
      name: doctorData.name,
      city: doctorData.city,
      country: doctorData.country,
      telehealth: doctorData.telehealth === true || doctorData.telehealth === "true",
      feePerVisit: doctorData.feePerVisit !== undefined ? (doctorData.feePerVisit === null || doctorData.feePerVisit === "" ? null : Number(doctorData.feePerVisit)) : undefined,
    }
  });

  // Update specialties if provided
  if (Array.isArray(specialtyIds)) {
    // Delete existing specialties
    await prisma.doctorSpecialty.deleteMany({
      where: { doctorId: doctor.id }
    });

    // Create new specialties
    if (specialtyIds.length > 0) {
      await prisma.doctorSpecialty.createMany({
        data: specialtyIds.map(specialtyId => ({
          doctorId: doctor.id,
          specialtyId: specialtyId
        }))
      });
    }
  }

  // Fetch updated doctor with specialties
  const updatedDoctor = await prisma.doctor.findUnique({
    where: { id: doctor.id },
    include: {
      specialties: {
        include: {
          specialty: true
        }
      }
    }
  });

  return NextResponse.json(updatedDoctor);
}
