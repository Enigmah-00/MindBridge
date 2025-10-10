import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signJwt, setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, email, password, role, doctorProfile } = body as {
    username: string; email?: string; password: string; role?: "USER" | "DOCTOR";
    doctorProfile?: { name: string; city?: string; country?: string; latitude?: number; longitude?: number; telehealth?: boolean }
  };

  if (!username || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const r = role === "DOCTOR" ? "DOCTOR" : "USER";
  try {
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({ data: { username, email, passwordHash, role: r as any } });
    if (r === "DOCTOR") {
      const dp = doctorProfile ?? { name: username };
      await prisma.doctor.create({
        data: {
          userId: user.id,
          name: dp.name,
          city: dp.city,
          country: dp.country,
          latitude: dp.latitude,
          longitude: dp.longitude,
          telehealth: !!dp.telehealth,
        },
      });
    }
    const token = signJwt({ sub: user.id, role: r as any });
    setAuthCookie(token);
    return NextResponse.json({ id: user.id, username: user.username, role: r });
  } catch (e: any) {
    if (e.code === "P2002") return NextResponse.json({ error: "Username or email exists" }, { status: 409 });
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}