import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

// GET: Fetch all conversations for the current user
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await requireSession();
  const { searchParams } = new URL(req.url);
  const otherUserId = searchParams.get("with");

  if (otherUserId) {
    // Get messages with a specific user
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: session.user.id },
        ],
      },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: { id: true, username: true, role: true },
        },
        receiver: {
          select: { id: true, username: true, role: true },
        },
      },
    });

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        receiverId: session.user.id,
        senderId: otherUserId,
        read: false,
      },
      data: { read: true },
    });

    return NextResponse.json(messages);
  }

  // Get all conversations (list of users the current user has messaged with)
  const sentMessages = await prisma.message.findMany({
    where: { senderId: session.user.id },
    select: { receiverId: true },
    distinct: ["receiverId"],
  });

  const receivedMessages = await prisma.message.findMany({
    where: { receiverId: session.user.id },
    select: { senderId: true },
    distinct: ["senderId"],
  });

  const userIds = [
    ...sentMessages.map((m: { receiverId: string }) => m.receiverId),
    ...receivedMessages.map((m: { senderId: string }) => m.senderId),
  ];
  const uniqueUserIds = [...new Set(userIds)];

  const conversations = await Promise.all(
    uniqueUserIds.map(async (userId) => {
      const lastMessage = await prisma.message.findFirst({
        where: {
          OR: [
            { senderId: session.user.id, receiverId: userId },
            { senderId: userId, receiverId: session.user.id },
          ],
        },
        orderBy: { createdAt: "desc" },
        include: {
          sender: { select: { username: true, role: true } },
          receiver: { select: { username: true, role: true } },
        },
      });

      const unreadCount = await prisma.message.count({
        where: {
          senderId: userId,
          receiverId: session.user.id,
          read: false,
        },
      });

      const otherUser = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          role: true,
          doctor: {
            select: {
              name: true,
              city: true,
              country: true,
            },
          },
        },
      });

      return {
        userId,
        user: otherUser,
        lastMessage,
        unreadCount,
      };
    })
  );

  return NextResponse.json(conversations);
}

// POST: Send a message
export async function POST(req: NextRequest) {
  const session = await requireSession();
  const body = await req.json();
  const { receiverId, content } = body;

  if (!receiverId || !content) {
    return NextResponse.json(
      { error: "receiverId and content are required" },
      { status: 400 }
    );
  }

  // Check if receiver exists and is a doctor (users can only message doctors)
  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
    select: { role: true },
  });

  if (!receiver) {
    return NextResponse.json({ error: "Receiver not found" }, { status: 404 });
  }

  // Only allow users to message doctors, not other users
  if (session.user.role === "USER" && receiver.role !== "DOCTOR") {
    return NextResponse.json(
      { error: "You can only message doctors" },
      { status: 403 }
    );
  }

  const message = await prisma.message.create({
    data: {
      senderId: session.user.id,
      receiverId,
      content,
    },
    include: {
      sender: {
        select: { id: true, username: true, role: true },
      },
      receiver: {
        select: { id: true, username: true, role: true },
      },
    },
  });

  return NextResponse.json(message);
}
