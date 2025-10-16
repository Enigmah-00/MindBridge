import { NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('mb_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyJwt(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all check-ins ordered by date descending
    const checkIns = await prisma.dailyCheckIn.findMany({
      where: {
        userId: user.id,
        morningComplete: true,
        eveningComplete: true,
      },
      orderBy: {
        date: 'desc',
      },
      select: {
        date: true,
      },
    });

    if (checkIns.length === 0) {
      return NextResponse.json({
        currentStreak: 0,
        longestStreak: 0,
        totalCheckIns: 0,
        lastCheckIn: null,
      });
    }

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < checkIns.length; i++) {
      const checkIn = checkIns[i];
      if (!checkIn) break;
      
      const checkInDate = new Date(checkIn.date);
      checkInDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);

      if (checkInDate.getTime() === expectedDate.getTime()) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 1;

    for (let i = 0; i < checkIns.length - 1; i++) {
      const currentCheckIn = checkIns[i];
      const nextCheckIn = checkIns[i + 1];
      if (!currentCheckIn || !nextCheckIn) continue;
      
      const currentDate = new Date(currentCheckIn.date);
      const nextDate = new Date(nextCheckIn.date);
      currentDate.setHours(0, 0, 0, 0);
      nextDate.setHours(0, 0, 0, 0);

      const diffTime = Math.abs(currentDate.getTime() - nextDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    const latestCheckIn = checkIns[0]?.date ?? null;

    return NextResponse.json({
      currentStreak,
      longestStreak,
      totalCheckIns: checkIns.length,
      lastCheckIn: latestCheckIn,
    });
  } catch (error) {
    console.error('Error fetching streak:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
