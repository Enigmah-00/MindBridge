import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signJwt, setAuthCookieOn, verifyPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { usernameOrEmail, password } = await req.json();
  const user = await prisma.user.findFirst({
    where: { OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }] },
  });
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  const ok = await verifyPassword(user.passwordHash, password);
  if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = signJwt({ sub: user.id, role: user.role as any });
  const res = NextResponse.json({ id: user.id, username: user.username, role: user.role });
  setAuthCookieOn(res, token);
  return res;
}