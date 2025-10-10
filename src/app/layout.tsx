import "./globals.css";
import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";

export const metadata = {
  title: "MindBridge",
  description: "Lifestyle insights, mental health screening, and care matching",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-gradient-to-br from-brand-50 to-white text-gray-900">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}