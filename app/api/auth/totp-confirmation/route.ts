import { validateRegistrationToken, updateRegistrationToken } from "@/lib/registration-token";
import { updateUser } from "@/db/queries";
import { encryptSecret, validateCallbackTimestamp } from "@/lib/totp";

/**
 * POST /api/auth/totp-confirmation
 * Called from the confirmation page when Legitate redirects with TOTP parameters
 * 
 * Body:
 * - regToken: Registration token from Legitate callback
 * - success: Boolean indicating if setup was successful
 * - seed: TOTP secret (Base32) from Legitate
 * - seedId: Seed ID from Legitate
 * - code: Current TOTP code
 * - timestamp: Unix timestamp for validation
 * 
 * Returns:
 * - Processes and encrypts the TOTP secret
 * - Updates user record with 2FA enabled
 * - Marks registration token as completed
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { regToken, success, seed, seedId, code, timestamp } = body;

    if (!regToken) {
      return new Response(
        JSON.stringify({ error: "Missing registration token" }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    if (!success) {
      return new Response(
        JSON.stringify({ error: "2FA setup was not successful" }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    // Validate timestamp to prevent replay attacks
    if (timestamp && !validateCallbackTimestamp(timestamp)) {
      console.warn("[TOTP_CONFIRMATION] Invalid callback timestamp");
      return new Response(
        JSON.stringify({ error: "Callback expired (invalid timestamp)" }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    // Validate token and get user info
    const validation = await validateRegistrationToken(regToken);

    if (!validation.valid || !validation.data) {
      console.error("[TOTP_CONFIRMATION] Invalid registration token:", validation.error);
      return new Response(
        JSON.stringify({ error: validation.error || "Invalid registration token" }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    const { email, userId } = validation.data;

    // Encrypt and store the TOTP secret
    if (!seed || !code) {
      return new Response(
        JSON.stringify({ error: "Missing TOTP seed or code" }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    try {
      const encryptedSeed = encryptSecret(seed);

      // Update user with TOTP configuration
      await updateUser(userId, {
        totpSecret: encryptedSeed,
        totpEnabled: true,
        totpSeedId: seedId || null,
        totpSetupCompleted: new Date(),
      });

      // Update registration token status
      await updateRegistrationToken(regToken, {
        status: "completed",
        seedId: seedId || undefined,
        totpSeed: encryptedSeed,
        completedAt: new Date(),
      });

      console.log(`[TOTP_CONFIRMATION] ✅ 2FA setup completed for ${email} (${userId})`);

      // Return success response - client will handle redirect
      return new Response(
        JSON.stringify({
          success: true,
          message: "2FA setup confirmed. Redirecting...",
          email,
          userId,
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    } catch (encryptError) {
      console.error("[TOTP_CONFIRMATION] Error encrypting TOTP secret:", encryptError);
      return new Response(
        JSON.stringify({ error: "Failed to store TOTP configuration" }),
        { status: 500, headers: { "content-type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("[TOTP_CONFIRMATION] Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to confirm 2FA setup",
      }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
