import { auth } from "@/app/(auth)/auth";
import { getDb } from "@/db/queries";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Check if user is authenticated and has 2FA enabled
 * Returns user info or null if not authenticated or 2FA not enabled
 */
export async function requireAuth2FA() {
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

  const userRecord = userResult[0];

  // If 2FA is required, ensure it's enabled
  if (!userRecord.totpEnabled) {
    return null;
  }

  return userRecord;
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
export function forbiddenResponse(message: string = "2FA not enabled") {
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
