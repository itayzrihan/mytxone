// middleware.ts

import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authConfig } from "@/app/(auth)/auth.config";

const { auth: nextAuthMiddleware } = NextAuth(authConfig);

// List your allowed origins here
const ALLOWED_ORIGINS = [
  "https://heybos.me",
  "https://mytx-ai.vercel.app",
  // add more if needed
];

// Helper to set CORS headers on any NextResponse
function applyCors(res: NextResponse, origin: string | null) {
  const allowOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : "null";
  res.headers.set("Access-Control-Allow-Origin", allowOrigin);
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.headers.set("Access-Control-Allow-Credentials", "true");
  return res;
}

export default async function middleware(req: NextRequest) {
  const origin = req.headers.get("origin");

  // 1️⃣ Handle CORS preflight right away
  if (req.method === "OPTIONS") {
    const res = new NextResponse(null, { status: 204 });
    return applyCors(res, origin);
  }

  // 2️⃣ Skip auth & just forward + CORS on these two API roots
  if (
    req.nextUrl.pathname.startsWith("/api/external/v1") ||
    req.nextUrl.pathname.startsWith("/api/heybos/")
  ) {
    const res = NextResponse.next();
    return applyCors(res, origin);
  }

  // 3️⃣ For everything else, let NextAuth handle it, then add CORS
  const authRes = await nextAuthMiddleware(req as any);
  // Check if authRes is a NextResponse, if not create one
  const response = authRes instanceof NextResponse ? authRes : NextResponse.next();
  return applyCors(response, origin);
}

export const config = {
  matcher: ["/", "/:id", "/api/:path*", "/login", "/register"],
};
