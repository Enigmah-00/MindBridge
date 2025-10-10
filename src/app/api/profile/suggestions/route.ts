import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { suggestionsFromProfile } from "@/lib/suggestions";

export async function GET() {
  const { user } = await requireSession();
  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  const suggestions = suggestionsFromProfile(profile);
  return NextResponse.json(suggestions);
}