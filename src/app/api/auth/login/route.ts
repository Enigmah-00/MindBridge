import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signJwt, setAuthCookieOn } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { usernameOrEmail, password } = body;

  if (!usernameOrEmail || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    },
  });

  if (!user || !(await verifyPassword(user.passwordHash, password))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = signJwt({ sub: user.id, role: user.role });
  const res = NextResponse.json({ message: "Login successful", user: { id: user.id, username: user.username, role: user.role } });
  setAuthCookieOn(res, token);
  return res;
}