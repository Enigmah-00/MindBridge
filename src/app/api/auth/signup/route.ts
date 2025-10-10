import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signJwt, setAuthCookieOn } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, email, password, role, doctorProfile } = body;

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password required" }, { status: 400 });
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, ...(email ? [{ email }] : [])] },
  });
  if (existing) {
    return NextResponse.json({ error: "Username or email already taken" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      username,
      email: email || null,
      passwordHash,
      role: role === "DOCTOR" ? "DOCTOR" : "USER",
      ...(role === "DOCTOR" && doctorProfile
        ? {
            doctor: {
              create: {
                name: doctorProfile.name || username,
                city: doctorProfile.city,
                country: doctorProfile.country,
                latitude: doctorProfile.latitude,
                longitude: doctorProfile.longitude,
                telehealth: doctorProfile.telehealth || false,
              },
            },
          }
        : {}),
    },
  });

  const token = signJwt({ sub: user.id, role: user.role });
  const res = NextResponse.json({ message: "Signup successful", user: { id: user.id, username: user.username, role: user.role } });
  setAuthCookieOn(res, token);
  return res;
}