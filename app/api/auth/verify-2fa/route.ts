import { auth } from "@/app/(auth)/auth";
import { getDb } from "@/db/queries";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { decryptSecret, verifyTOTPCode } from "@/lib/totp";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize rate limiter
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "15 m"), // 5 attempts per 15 minutes
});

/**
 * POST /api/auth/verify-2fa
 * Verifies TOTP code during login
 * Body: { totpCode: string }
 */
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ error: "User not authenticated" }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }

    // Rate limiting: per user and IP
    const key = `totp:${session.user.id}`;
    const { success } = await ratelimit.limit(key);

    if (!success) {
      return new Response(
        JSON.stringify({ error: "Too many attempts, please try again later" }),
        { status: 429, headers: { "content-type": "application/json" } }
      );
    }

    const { totpCode } = await request.json();

    if (!totpCode || typeof totpCode !== "string" || totpCode.length !== 6) {
      return new Response(
        JSON.stringify({ error: "Invalid TOTP code format" }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    // Get user's TOTP secret
    const userResult = await getDb()
      .select()
      .from(user)
      .where(eq(user.id, session.user.id));

    if (userResult.length === 0) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }

    const userRecord = userResult[0];

    if (!userRecord.totpEnabled || !userRecord.totpSecret) {
      return new Response(
        JSON.stringify({ error: "2FA not enabled for this user" }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    try {
      // Decrypt the secret
      const decryptedSecret = decryptSecret(userRecord.totpSecret);

      // Verify the TOTP code
      const isValid = verifyTOTPCode(decryptedSecret, totpCode);

      if (isValid) {
        // Mark session as 2FA verified
        // In a real app, you might want to set a session flag here
        return new Response(
          JSON.stringify({ success: true, message: "2FA verification successful" }),
          { status: 200, headers: { "content-type": "application/json" } }
        );
      } else {
        return new Response(
          JSON.stringify({ error: "Invalid TOTP code" }),
          { status: 401, headers: { "content-type": "application/json" } }
        );
      }
    } catch (decryptError) {
      console.error("Error decrypting or verifying TOTP:", decryptError);
      return new Response(
        JSON.stringify({ error: "Failed to verify 2FA" }),
        { status: 500, headers: { "content-type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error in verify-2fa:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
