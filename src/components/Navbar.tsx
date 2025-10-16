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
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center group-hover:bg-blue-700 transition-colors">
              <span className="text-white font-bold">MB</span>
            </div>
            <span className="font-bold text-xl text-gray-900">
              MindBridge
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {authed && (
              <>
                <Link 
                  href="/dashboard" 
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/dashboard') 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Dashboard
                </Link>
                {role === "USER" && (
                  <>
                    <Link 
                      href="/profile" 
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/profile') 
                          ? 'bg-gray-100 text-gray-900' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      Profile
                    </Link>
                    <Link 
                      href="/quizzes" 
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/quizzes') 
                          ? 'bg-gray-100 text-gray-900' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      Assessments
                    </Link>
                    <Link 
                      href="/games" 
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/games') 
                          ? 'bg-gray-100 text-gray-900' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      Games
                    </Link>
                    <Link 
                      href="/doctors" 
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/doctors') 
                          ? 'bg-gray-100 text-gray-900' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      Doctors
                    </Link>
                    <Link 
                      href="/appointments" 
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/appointments') 
                          ? 'bg-gray-100 text-gray-900' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      Appointments
                    </Link>
                    <Link 
                      href="/ml-insights" 
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/ml-insights') || isActive('/chatbot')
                          ? 'bg-blue-50 text-blue-700' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      MindMap
                    </Link>
                    <Link 
                      href="/resources" 
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/resources') 
                          ? 'bg-gray-100 text-gray-900' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      Resources
                    </Link>
                  </>
                )}
                {role === "DOCTOR" && (
                  <>
                    <Link 
                      href="/profile" 
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/profile') 
                          ? 'bg-gray-100 text-gray-900' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      Profile
                    </Link>
                    <Link 
                      href="/availibility" 
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/availibility') 
                          ? 'bg-gray-100 text-gray-900' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      Availability
                    </Link>
                    <Link 
                      href="/appointments" 
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/appointments') 
                          ? 'bg-gray-100 text-gray-900' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      Appointments
                    </Link>
                    <Link 
                      href="/analytics" 
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/analytics') 
                          ? 'bg-gray-100 text-gray-900' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      Analytics
                    </Link>
                  </>
                )}
                <Link 
                  href="/messages" 
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/messages') 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Messages
                </Link>
                <button 
                  onClick={logout} 
                  className="ml-2 px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
            {!authed && (
              <>
                <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
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
                    <Link href="/ml-insights" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                      � MindMap
                    </Link>
                    <Link href="/resources" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                      Resources
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