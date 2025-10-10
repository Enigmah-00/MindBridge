"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState<"USER" | "DOCTOR" | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(async r => {
      if (r.ok) {
        const j = await r.json();
        setAuthed(true);
        setRole(j.role);
      } else {
        setAuthed(false);
        setRole(null);
      }
    }).catch(() => { setAuthed(false); setRole(null); });
  }, [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <header className="border-b bg-white/70 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight text-xl">MindBridge</Link>
        <nav className="flex items-center gap-4 text-sm">
          {authed && (
            <>
              <Link href="/dashboard" className="hover:text-brand-700">Dashboard</Link>
              {role === "USER" && (
                <>
                  <Link href="/profile" className="hover:text-brand-700">Profile</Link>
                  <Link href="/quizzes" className="hover:text-brand-700">Quizzes</Link>
                  <Link href="/doctors" className="hover:text-brand-700">Doctors</Link>
                  <Link href="/appointments" className="hover:text-brand-700">Appointments</Link>
                </>
              )}
              {role === "DOCTOR" && (
                <>
                  <Link href="/availability" className="hover:text-brand-700">Availability</Link>
                  <Link href="/appointments" className="hover:text-brand-700">Appointments</Link>
                </>
              )}
              <Link href="/messages" className="hover:text-brand-700">💬 Messages</Link>
              <button onClick={logout} className="btn">Logout</button>
            </>
          )}
          {!authed && (
            <>
              <Link href="/auth/login" className="hover:text-brand-700">Login</Link>
              <Link href="/auth/signup" className="btn">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}