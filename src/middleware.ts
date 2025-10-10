import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const protectedPaths = [
  "/dashboard",
  "/profile",
  "/lifestyle",
  "/quizzes",
  "/doctors",
  "/appointments",
  "/availability"
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const needsAuth = protectedPaths.some(p => pathname === p || pathname.startsWith(p + "/"));

  if (!needsAuth) return NextResponse.next();

  const token = req.cookies.get("mb_token")?.value;
  if (!token) return NextResponse.redirect(new URL("/auth/login", req.url));

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/lifestyle/:path*",
    "/quizzes/:path*",
    "/doctors/:path*",
    "/appointments/:path*",
    "/availability/:path*",
  ],
};