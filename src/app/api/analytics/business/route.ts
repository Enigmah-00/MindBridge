import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get all appointments with related data
    const appointments = await prisma.appointment.findMany({
      include: {
        doctor: {
          include: {
            specialties: {
              include: {
                specialty: true,
              },
            },
          },
        },
      },
    });

    // Get all doctors
    const doctors = await prisma.doctor.findMany({
      select: {
        id: true,
        name: true,
        feePerVisit: true,
        telehealth: true,
        avgRating: true,
        totalReviews: true,
        appointments: true,
        specialties: {
          include: {
            specialty: true,
          },
        },
      },
    });

    // Get unique patients
    const uniquePatients = new Set(appointments.map((a) => a.patientUserId)).size;

    // 1. APPOINTMENTS BY DAY OF WEEK
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const appointmentsByDay = Array.from({ length: 7 }, (_, i) => ({
      day: i.toString(),
      dayName: dayNames[i] || "Unknown",
      count: 0,
    }));

    appointments.forEach((apt) => {
      const dayOfWeek = new Date(apt.date).getDay();
      const dayData = appointmentsByDay[dayOfWeek];
      if (dayData) {
        dayData.count++;
      }
    });

    const peakDay = [...appointmentsByDay].sort((a, b) => b.count - a.count)[0] || appointmentsByDay[0];

    // 2. FEE RANGE ANALYSIS
    const feeRanges = [
      { min: 0, max: 500, range: "৳0-500" },
      { min: 500, max: 1000, range: "৳500-1,000" },
      { min: 1000, max: 1500, range: "৳1,000-1,500" },
      { min: 1500, max: 2000, range: "৳1,500-2,000" },
      { min: 2000, max: 999999, range: "৳2,000+" },
    ];

    const feeAnalysis = feeRanges.map((range) => {
      const doctorsInRange = doctors.filter(
        (d) => d.feePerVisit && d.feePerVisit >= range.min && d.feePerVisit < range.max
      );
      const totalAppointments = doctorsInRange.reduce(
        (sum, d) => sum + d.appointments.length,
        0
      );
      const avgAppointments =
        doctorsInRange.length > 0 ? totalAppointments / doctorsInRange.length : 0;

      return {
        range: range.range,
        avgAppointments,
        doctorCount: doctorsInRange.length,
        totalAppointments,
      };
    });

    const optimalFeeRange =
      [...feeAnalysis]
        .filter((f) => f.doctorCount > 0)
        .sort((a, b) => b.avgAppointments - a.avgAppointments)[0]?.range || "৳500-1,000";

    // 3. REVENUE ANALYSIS
    const doctorsWithFees = doctors.filter((d) => d.feePerVisit);
    const avgFee =
      doctorsWithFees.length > 0
        ? Math.round(
            doctorsWithFees.reduce((sum, d) => sum + (d.feePerVisit || 0), 0) /
              doctorsWithFees.length
          )
        : 0;

    // Only calculate revenue for doctors who have fees set (no guessing)
    const estimatedTotalRevenue = doctors.reduce((sum, d) => {
      if (!d.feePerVisit) return sum; // Skip doctors without fees
      return sum + d.feePerVisit * d.appointments.length;
    }, 0);

    const revenueByRange = feeRanges.map((range) => {
      const doctorsInRange = doctors.filter(
        (d) => d.feePerVisit && d.feePerVisit >= range.min && d.feePerVisit < range.max
      );
      const revenue = doctorsInRange.reduce((sum, d) => {
        return sum + (d.feePerVisit || 0) * d.appointments.length;
      }, 0);
      return { range: range.range, revenue };
    });

    const topEarningRange =
      [...revenueByRange].sort((a, b) => b.revenue - a.revenue)[0] || revenueByRange[0];

    // 4. SPECIALTY ANALYSIS
    const specialtyCounts = new Map<string, number>();
    appointments.forEach((apt) => {
      apt.doctor.specialties.forEach((ds) => {
        const name = ds.specialty.name;
        specialtyCounts.set(name, (specialtyCounts.get(name) || 0) + 1);
      });
    });

    const sortedSpecialties = Array.from(specialtyCounts.entries()).sort(
      (a, b) => b[1] - a[1]
    );
    const mostBookedSpecialty = sortedSpecialties[0] || ["Unknown", 0];

    // 5. TELEHEALTH VS IN-PERSON
    const telehealthCount = appointments.filter((a) => a.doctor.telehealth).length;
    const inPersonCount = appointments.length - telehealthCount;

    // 6. PEAK BOOKING HOUR
    const hourCounts = new Map<number, number>();
    appointments.forEach((apt) => {
      const hour = Math.floor(apt.startMinute / 60);
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
    });

    const sortedHours = Array.from(hourCounts.entries()).sort((a, b) => b[1] - a[1]);
    const [peakHour, peakHourCount] = sortedHours[0] || [10, 0];
    const peakHourStr = `${peakHour}:00 - ${peakHour + 1}:00`;

    // 7. TOP DOCTORS (ranked by average rating first)
    // Show ALL doctors (even without fees set) - fees are optional
    const topDoctors = doctors
      .map((d) => ({
        name: d.name,
        appointments: d.appointments.length,
        fee: d.feePerVisit ?? 0, // Show 0 if no fee set
        revenue: (d.feePerVisit ?? 0) * d.appointments.length,
        avgRating: d.avgRating ?? null,
        totalReviews: d.totalReviews ?? 0,
      }))
      .sort((a, b) => {
        // First: Doctors with ratings come before those without
        const aHasRating = a.avgRating !== null && a.avgRating > 0;
        const bHasRating = b.avgRating !== null && b.avgRating > 0;
        
        if (!aHasRating && bHasRating) return 1;  // b comes first
        if (aHasRating && !bHasRating) return -1; // a comes first
        
        // Both have ratings - sort by rating (higher is better)
        if (aHasRating && bHasRating) {
          if (b.avgRating! !== a.avgRating!) {
            return b.avgRating! - a.avgRating!;
          }
          // If ratings are equal, sort by number of reviews
          if (b.totalReviews !== a.totalReviews) {
            return b.totalReviews - a.totalReviews;
          }
        }
        
        // Both have no ratings, or ratings are tied - sort by appointments then revenue
        if (a.appointments !== b.appointments) {
          return b.appointments - a.appointments;
        }
        return b.revenue - a.revenue;
      })
      .slice(0, 10); // Show top 10 doctors

    return NextResponse.json({
      // Day Analysis
      appointmentsByDay,
      peakDay,

      // Fee Analysis
      feeRanges: feeAnalysis,
      optimalFeeRange,

      // Overall Stats
      totalDoctors: doctors.length,
      totalAppointments: appointments.length,
      totalPatients: uniquePatients,
      avgAppointmentsPerDoctor:
        doctors.length > 0 ? appointments.length / doctors.length : 0,

      // Revenue Insights
      avgFee,
      estimatedTotalRevenue: Math.round(estimatedTotalRevenue),
      topEarningRange,

      // Patient Behavior
      mostBookedSpecialty: {
        name: mostBookedSpecialty[0],
        count: mostBookedSpecialty[1],
      },
      telehealthVsInPerson: {
        telehealth: telehealthCount,
        inPerson: inPersonCount,
      },
      peakBookingHour: {
        hour: peakHourStr,
        count: peakHourCount,
      },

      // Doctor Performance
      topDoctors,
    });
  } catch (error: unknown) {
    console.error("Analytics error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to generate analytics", details: errorMessage },
      { status: 500 }
    );
  }
}
