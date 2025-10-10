import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const COOKIE_NAME = "mb_token";
const isProd = process.env.NODE_ENV === "production";

export type JwtPayload = { sub: string; role: "USER" | "DOCTOR" | "ADMIN" };

export async function hashPassword(password: string) {
  return argon2.hash(password);
}

export async function verifyPassword(hash: string, password: string) {
  return argon2.verify(hash, password);
}

export function signJwt(payload: JwtPayload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET environment variable is not set");
      return null;
    }
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

export async function getSession() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = verifyJwt(token);
  if (!payload) return null;
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) return null;
  return { user, role: user.role, token };
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireRole(role: "USER" | "DOCTOR" | "ADMIN") {
  const session = await requireSession();
  if (session.user.role !== role) {
    throw new Error("Forbidden");
  }
  return session;
}

// Set and clear cookie helpers (use inside API route handlers on the response)
export function setAuthCookieOn(res: NextResponse, token: string) {
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd ? true : false, // allow HTTP on localhost
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookieOn(res: NextResponse) {
  res.cookies.delete(COOKIE_NAME);
}