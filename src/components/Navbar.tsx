"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState<"USER" | "DOCTOR" | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-lg shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-sm">MB</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MindBridge
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {authed && (
              <>
                <Link 
                  href="/dashboard" 
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive('/dashboard') 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </Link>
                {role === "USER" && (
                  <>
                    <Link 
                      href="/profile" 
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive('/profile') 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Profile
                    </Link>
                    <Link 
                      href="/quizzes" 
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive('/quizzes') 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Assessments
                    </Link>
                    <Link 
                      href="/games" 
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive('/games') 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Games
                    </Link>
                    <Link 
                      href="/doctors" 
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive('/doctors') 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Doctors
                    </Link>
                    <Link 
                      href="/appointments" 
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive('/appointments') 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Appointments
                    </Link>
                    <Link 
                      href="/chatbot" 
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive('/chatbot') 
                          ? 'bg-gradient-to-r from-indigo-50 to-pink-50 text-indigo-600' 
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-pink-50'
                      }`}
                    >
                      🤖 AI Chat
                    </Link>
                    <Link 
                      href="/resources" 
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive('/resources') 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      📚 Resources
                    </Link>
                  </>
                )}
                {role === "DOCTOR" && (
                  <>
                    <Link 
                      href="/availibility" 
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive('/availibility') 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Availability
                    </Link>
                    <Link 
                      href="/appointments" 
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive('/appointments') 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Appointments
                    </Link>
                  </>
                )}
                <Link 
                  href="/messages" 
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive('/messages') 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  💬 Messages
                </Link>
                <button 
                  onClick={logout} 
                  className="ml-2 btn btn-secondary text-sm"
                >
                  Logout
                </button>
              </>
            )}
            {!authed && (
              <>
                <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                  Login
                </Link>
                <Link href="/auth/signup" className="btn btn-primary text-sm ml-2">
                  Sign up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t animate-slide-up">
            {authed && (
              <div className="space-y-1">
                <Link href="/dashboard" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                  Dashboard
                </Link>
                {role === "USER" && (
                  <>
                    <Link href="/profile" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                      Profile
                    </Link>
                    <Link href="/quizzes" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                      Assessments
                    </Link>
                    <Link href="/games" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                      Games
                    </Link>
                    <Link href="/doctors" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                      Doctors
                    </Link>
                    <Link href="/appointments" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                      Appointments
                    </Link>
                    <Link href="/chatbot" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                      🤖 AI Chat
                    </Link>
                    <Link href="/resources" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                      📚 Resources
                    </Link>
                  </>
                )}
                {role === "DOCTOR" && (
                  <>
                    <Link href="/availibility" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                      Availability
                    </Link>
                    <Link href="/appointments" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                      Appointments
                    </Link>
                  </>
                )}
                <Link href="/messages" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                  💬 Messages
                </Link>
                <button onClick={logout} className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                  Logout
                </button>
              </div>
            )}
            {!authed && (
              <div className="space-y-1">
                <Link href="/auth/login" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                  Login
                </Link>
                <Link href="/auth/signup" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}