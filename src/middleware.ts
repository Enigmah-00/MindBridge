import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedPaths = [
  "/dashboard",
  "/profile",
  "/lifestyle",
  "/quizzes",
  "/doctors",
  "/appointments",
  "/availability"
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const needsAuth = protectedPaths.some(p => pathname === p || pathname.startsWith(p + "/"));

  if (!needsAuth) return NextResponse.next();

  const token = req.cookies.get("mb_token")?.value;
  
  // Debug logging
  console.log(`[Middleware] Path: ${pathname}, Token present: ${!!token}`);
  
  if (!token) {
    console.log(`[Middleware] No token found, redirecting to login`);
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("[Middleware] JWT_SECRET not found in environment!");
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    
    // Use jose library instead of jsonwebtoken for Edge Runtime compatibility
    const encoder = new TextEncoder();
    await jwtVerify(token, encoder.encode(secret));
    
    console.log(`[Middleware] Token valid, allowing access to ${pathname}`);
    return NextResponse.next();
  } catch (error) {
    console.error(`[Middleware] Token verification failed:`, error);
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