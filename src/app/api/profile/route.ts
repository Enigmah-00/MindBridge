import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deriveConcernsFromProfile } from "@/lib/suggestions";

export async function GET() {
  const { user } = await requireSession();
  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
  return NextResponse.json(profile ?? {});
}

export async function PUT(req: NextRequest) {
  const { user } = await requireSession();
  const data = await req.json();
  const profile = await prisma.profile.upsert({
    where: { userId: user.id },
    update: data,
    create: { ...data, userId: user.id },
  });

  const derived = deriveConcernsFromProfile(profile);
  if (derived.length) {
    await prisma.derivedConcern.createMany({
      data: derived.map(d => ({ userId: user.id, source: "lifestyle", concern: d.concern, score: d.score })),
      skipDuplicates: true,
    });
  }

  return NextResponse.json(profile);
}