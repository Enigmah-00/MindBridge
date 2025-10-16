import "./globals.css";
import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";

export const metadata = {
  title: "MindBridge - Your Mental Health Journey",
  description: "Comprehensive mental health platform with lifestyle insights, validated assessments, and specialist connections",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full text-gray-900 antialiased">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-sm text-gray-600">
              <p className="mb-2">
                <span className="font-semibold text-gray-900">
                  MindBridge
                </span>
                {" "}© 2025 - Your Mental Health Journey
              </p>
              <p className="text-xs text-gray-500">
                Professional assessments · Secure & Private · 24/7 Access
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}