// middleware.ts

import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authConfig } from "@/app/(auth)/auth.config";
import { getUser } from "@/db/queries";

const { auth: nextAuthMiddleware } = NextAuth(authConfig);

// List your allowed origins here - read from environment variable
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "").split(",").filter(Boolean).map((origin) => origin.trim());

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
    req.nextUrl.pathname.startsWith("/api/heybos/") ||
    req.nextUrl.pathname.startsWith("/api/social/serve-temp-video")
  ) {
    const res = NextResponse.next();
    return applyCors(res, origin);
  }

  // 3️⃣ Admin route protection - redirect to login if not authenticated
  // Note: We let NextAuth handle auth first, then the admin page will do the role check
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const authRes = await nextAuthMiddleware(req as any);
    
    // If NextAuth redirects (user not authenticated), respect that
    if (authRes instanceof NextResponse && authRes.status === 307) {
      return applyCors(authRes, origin);
    }
    
    // Otherwise continue to the admin page (which will do role checking)
    const response = authRes instanceof NextResponse ? authRes : NextResponse.next();
    return applyCors(response, origin);
  }

  // 4️⃣ Admin API route protection - stricter checking
  if (req.nextUrl.pathname.startsWith("/api/admin/")) {
    // For admin API routes, we let the individual route handlers do the auth checks
    // This ensures proper error responses with JSON instead of redirects
    const res = NextResponse.next();
    return applyCors(res, origin);
  }

  // 5️⃣ For everything else, let NextAuth handle it first
  const authRes = await nextAuthMiddleware(req as any);
  
  // Check if authRes is a NextResponse, if not create one
  let response = authRes instanceof NextResponse ? authRes : NextResponse.next();
  
  return applyCors(response, origin);
}

export const config = {
  matcher: [
    "/", 
    "/:id", 
    "/api/:path*", 
    "/login", 
    "/register", 
    "/admin/:path*" // Added admin routes to matcher
  ],
};
