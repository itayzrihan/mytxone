import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authConfig } from "@/app/(auth)/auth.config";

const { auth: nextAuthMiddleware } = NextAuth(authConfig);

export default async function middleware(req: NextRequest) {
  // Exclude the external API route from default auth handling
  if (req.nextUrl.pathname.startsWith("/api/external/v1")) {
    return NextResponse.next(); // Allow the request to proceed to the route handler
  }

  // Apply default NextAuth handling to other matched routes
  return nextAuthMiddleware(req as any);
}

export const config = {
  // Apply middleware to relevant routes, including the external API path
  // so we can specifically exclude it in the function above.
  matcher: ["/", "/:id", "/api/:path*", "/login", "/register"],
};
