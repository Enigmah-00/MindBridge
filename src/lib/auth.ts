import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { cookies, headers } from "next/headers";
import { prisma } from "./prisma";

const COOKIE_NAME = "mb_token";

export async function hashPassword(password: string) {
  return argon2.hash(password);
}
export async function verifyPassword(hash: string, password: string) {
  return argon2.verify(hash, password);
}

export type JwtPayload = { sub: string; role: "USER" | "DOCTOR" | "ADMIN" };

export function signJwt(payload: JwtPayload) {
  const secret = process.env.JWT_SECRET!;
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}
export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = verifyJwt(token);
  if (!payload) return null;
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) return null;
  return { user, role: user.role, token };
}

export async function requireSession() {
  const s = await getSession();
  if (!s) throw new Error("Unauthorized");
  return s;
}

export async function requireRole(role: "USER" | "DOCTOR" | "ADMIN") {
  const s = await getSession();
  if (!s) throw new Error("Unauthorized");
  if (s.role !== role && !(role === "USER" && (s.role === "USER"))) throw new Error("Forbidden");
  return s;
}

export function setAuthCookie(token: string) {
  const cookieStore = cookies();
  // Cookie on server actions/route handlers
  cookieStore.then(cs => cs.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  }));
}

export function clearAuthCookie() {
  const cookieStore = cookies();
  cookieStore.then(cs => cs.delete(COOKIE_NAME));
}