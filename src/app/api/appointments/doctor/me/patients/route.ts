import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { user } = await requireRole("DOCTOR");
  const doctor = await prisma.doctor.findUnique({ where: { userId: user.id } });
  if (!doctor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Get all patients who have booked appointments
  const appointments = await prisma.appointment.findMany({
    where: { doctorId: doctor.id },
    select: {
      patientUserId: true,
      status: true,
      date: true,
      startMinute: true,
      serialNumber: true,
      patient: {
        select: {
          id: true,
          username: true,
          profile: true,
        }
      }
    },
    orderBy: { date: 'desc' }
  });

  // Get all patients who have sent messages
  const messages = await prisma.message.findMany({
    where: { receiverId: user.id },
    select: {
      senderId: true,
      createdAt: true,
      sender: {
        select: {
          id: true,
          username: true,
          profile: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Combine and deduplicate patients
  const patientsMap = new Map();

  // Add patients from appointments
  appointments.forEach((apt: any) => {
    if (!patientsMap.has(apt.patientUserId)) {
      patientsMap.set(apt.patientUserId, {
        userId: apt.patient.id,
        username: apt.patient.username,
        profile: apt.patient.profile,
        hasAppointment: true,
        hasMessaged: false,
        lastAppointment: apt.date,
        appointmentStatus: apt.status,
        totalAppointments: 1,
      });
    } else {
      const existing = patientsMap.get(apt.patientUserId);
      existing.totalAppointments += 1;
      if (new Date(apt.date) > new Date(existing.lastAppointment)) {
        existing.lastAppointment = apt.date;
        existing.appointmentStatus = apt.status;
      }
    }
  });

  // Add patients from messages
  messages.forEach((msg: any) => {
    if (!patientsMap.has(msg.senderId)) {
      patientsMap.set(msg.senderId, {
        userId: msg.sender.id,
        username: msg.sender.username,
        profile: msg.sender.profile,
        hasAppointment: false,
        hasMessaged: true,
        lastMessageDate: msg.createdAt,
        totalAppointments: 0,
      });
    } else {
      const existing = patientsMap.get(msg.senderId);
      existing.hasMessaged = true;
      if (!existing.lastMessageDate || new Date(msg.createdAt) > new Date(existing.lastMessageDate)) {
        existing.lastMessageDate = msg.createdAt;
      }
    }
  });

  const patients = Array.from(patientsMap.values());

  return NextResponse.json(patients);
}
