import { getDb } from "@/db/queries";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { decryptSecret, verifyTOTPCode } from "@/lib/totp";
import { rateLimit } from "@/lib/redis-ratelimit";

// Rate limiting constants
const TOTP_RATE_LIMIT = 5; // 5 attempts
const TOTP_RATE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

/**
 * POST /api/auth/verify-2fa-internal
 * Verifies TOTP code during login using email (internal use)
 * Body: { email: string, totpCode: string }
 * 
 * This endpoint is called from the server action during login
 * It does NOT require an authenticated session, only email verification
 */
export async function POST(request: Request) {
  try {
    const { email, totpCode } = await request.json();

    if (!email || !totpCode) {
      return new Response(
        JSON.stringify({ error: "Missing email or TOTP code" }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    if (typeof totpCode !== "string" || totpCode.length < 6 || totpCode.length > 8) {
      return new Response(
        JSON.stringify({ error: "Invalid TOTP code format" }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    // Rate limiting: per email
    const key = `totp:login:${email}`;
    try {
      const { success } = await rateLimit(key, TOTP_RATE_LIMIT, TOTP_RATE_WINDOW_MS);

      if (!success) {
        return new Response(
          JSON.stringify({ error: "Too many attempts, please try again later" }),
          { status: 429, headers: { "content-type": "application/json" } }
        );
      }
    } catch (error) {
      console.warn('[2FA Internal Verification] Rate limiting check failed, proceeding:', error);
      // Continue if rate limiting fails
    }

    // Get user by email
    const userResult = await getDb()
      .select()
      .from(user)
      .where(eq(user.email, email));

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
    console.error("Error in verify-2fa-internal:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
