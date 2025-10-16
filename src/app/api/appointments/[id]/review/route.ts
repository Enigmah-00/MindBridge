import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// Submit a review for a completed appointment
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user } = await requireSession();
  const { rating, review } = await req.json();
  
  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
  }

  try {
    // Find the appointment
    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
      include: { doctor: true },
    });

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    // Check if user owns this appointment
    if (appointment.patientUserId !== user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Check if appointment has already been reviewed
    if (appointment.rating !== null) {
      return NextResponse.json({ error: "Appointment already reviewed" }, { status: 400 });
    }

    // Check if appointment date/time has passed
    const appointmentDateTime = new Date(appointment.date);
    appointmentDateTime.setMinutes(appointment.startMinute);
    const now = new Date();
    
    if (appointmentDateTime > now) {
      return NextResponse.json({ error: "Cannot review future appointments" }, { status: 400 });
    }

    // Update appointment with review
    const updated = await prisma.appointment.update({
      where: { id: params.id },
      data: {
        rating,
        review: review || null,
        reviewedAt: new Date(),
        status: "COMPLETED", // Mark as completed when reviewed
      },
    });

    // Recalculate doctor's average rating
    const allReviews = await prisma.appointment.findMany({
      where: {
        doctorId: appointment.doctorId,
        rating: { not: null },
      },
      select: { rating: true },
    });

    const totalReviews = allReviews.length;
    const avgRating = totalReviews > 0
      ? allReviews.reduce((sum, apt) => sum + (apt.rating || 0), 0) / totalReviews
      : null;

    // Update doctor's rating stats
    await prisma.doctor.update({
      where: { id: appointment.doctorId },
      data: {
        avgRating,
        totalReviews,
      },
    });

    return NextResponse.json({
      message: "Review submitted successfully",
      appointment: updated,
    });
  } catch (error: any) {
    console.error("Review submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
