"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Conversation {
  userId: string;
  user: {
    id: string;
    username: string;
    role: string;
    doctor?: {
      name: string;
      city: string;
      country: string;
    };
  };
  lastMessage: {
    content: string;
    createdAt: string;
    sender: { username: string };
  };
  unreadCount: number;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  async function loadConversations() {
    setLoading(true);
    const res = await fetch("/api/messages");
    const data = await res.json();
    setConversations(data);
    setLoading(false);
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">💬 Messages</h1>

      {loading ? (
        <div className="card p-6 text-center text-gray-500">Loading...</div>
      ) : conversations.length === 0 ? (
        <div className="card p-6 text-center text-gray-500">
          No conversations yet. Visit the{" "}
          <Link href="/doctors" className="text-blue-600 underline">
            Doctors page
          </Link>{" "}
          to start a conversation.
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conv) => (
            <Link
              key={conv.userId}
              href={`/messages/${conv.userId}`}
              className="card p-4 block hover:bg-gray-50 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">
                      {conv.user.doctor?.name || conv.user.username}
                    </h3>
                    {conv.user.role === "DOCTOR" && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        Doctor
                      </span>
                    )}
                    {conv.unreadCount > 0 && (
                      <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                        {conv.unreadCount} new
                      </span>
                    )}
                  </div>
                  {conv.user.doctor && (
                    <div className="text-xs text-gray-500">
                      {conv.user.doctor.city}, {conv.user.doctor.country}
                    </div>
                  )}
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    <span className="font-medium">
                      {conv.lastMessage.sender.username}:
                    </span>{" "}
                    {conv.lastMessage.content}
                  </p>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(conv.lastMessage.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
