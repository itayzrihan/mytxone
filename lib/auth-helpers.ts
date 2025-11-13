import { auth } from "@/app/(auth)/auth";
import { getDb } from "@/db/queries";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Check if user is authenticated
 * Returns user info or null if not authenticated
 */
export async function requireAuth() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const userResult = await getDb()
    .select()
    .from(user)
    .where(eq(user.id, session.user.id));

  if (userResult.length === 0) {
    return null;
  }

  return userResult[0];
}

/**
 * Create a 401 Unauthorized response
 */
export function unauthorizedResponse(message: string = "User not authenticated") {
  return new Response(
    JSON.stringify({ error: message }),
    { status: 401, headers: { "content-type": "application/json" } }
  );
}

/**
 * Create a 403 Forbidden response
 */
export function forbiddenResponse(message: string = "Access denied") {
  return new Response(
    JSON.stringify({ error: message }),
    { status: 403, headers: { "content-type": "application/json" } }
  );
}

/**
 * Create a 429 Rate Limited response
 */
export function rateLimitedResponse(message: string = "Too many attempts, please try again later") {
  return new Response(
    JSON.stringify({ error: message }),
    { status: 429, headers: { "content-type": "application/json" } }
  );
}
