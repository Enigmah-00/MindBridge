import { NextResponse } from "next/server";
import { clearAuthCookieOn } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  clearAuthCookieOn(res);
  return res;
}