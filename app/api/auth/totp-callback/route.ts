import { updateUser, getDb, getUser } from "@/db/queries";
import {
  encryptSecret,
  validateCallbackTimestamp,
} from "@/lib/totp";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  validateRegistrationToken,
  updateRegistrationToken,
  parseCallbackParams,
} from "@/lib/registration-token";

/**
 * GET /api/auth/totp-callback
 * Receives callback from Legitate when user completes TOTP setup
 * 
 * Parameters (from Simple TOTP):
 *  - success: "true" or "false"
 *  - seed: Generated TOTP secret (Base32) - store this encrypted!
 *  - seedId: ID of created seed
 *  - code: Current 6-digit TOTP code
 *  - regToken: Registration token to identify user
 *  - timestamp: Unix timestamp for validation
 *  - error: Error message if success=false
 * 
 * Works for both:
 * - Authenticated sessions
 * - New registrations (identifies user by regToken)
 * - External third-party apps (redirects to their callback URL)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const {
      success,
      regToken,
      seed,
      code,
      seedId,
      timestamp,
      error,
    } = parseCallbackParams(searchParams);

    // Legacy parameter support
    const legacySecret = searchParams.get("secret");
    const legacyAccount = searchParams.get("account");
    const actualSeed = seed || legacySecret;

    console.log("[TOTP_CALLBACK] Received callback", {
      success,
      hasRegToken: !!regToken,
      hasLegacyAccount: !!legacyAccount,
      hasSeed: !!actualSeed,
    });

    // Validate timestamp to prevent replay attacks
    if (timestamp && !validateCallbackTimestamp(timestamp)) {
      console.warn("[TOTP_CALLBACK] Invalid callback timestamp");
      return new Response(
        `<html><body><h1>❌ Setup Failed</h1><p>Callback expired (invalid timestamp).</p></body></html>`,
        {
          status: 400,
          headers: { "content-type": "text/html" },
        }
      );
    }

    let userEmail: string | null = null;
    let userId: string | null = null;
    let externalCallbackUrl: string | null = null;

    // Priority 1: Registration token (new system)
    if (regToken) {
      const validation = await validateRegistrationToken(regToken);

      if (!validation.valid || !validation.data) {
        console.error(
          "[TOTP_CALLBACK] Invalid registration token:",
          validation.error
        );
        return new Response(
          `<html><body><h1>❌ Setup Failed</h1><p>${validation.error || "Invalid registration token"}</p></body></html>`,
          {
            status: 400,
            headers: { "content-type": "text/html" },
          }
        );
      }

      userEmail = validation.data.email;
      userId = validation.data.userId;
      externalCallbackUrl = validation.data.callbackUrl || null;

      console.log(
        `[TOTP_CALLBACK] Using registration token for ${userEmail}`,
        {
          hasExternalCallback: !!externalCallbackUrl,
        }
      );
    }

    // Priority 2: Legacy account email parameter
    if (!userId && legacyAccount) {
      userEmail = legacyAccount;
      console.log(`[TOTP_CALLBACK] Using legacy account parameter: ${userEmail}`);

      const userResult = await getDb()
        .select()
        .from(user)
        .where(eq(user.email, userEmail));

      if (userResult.length === 0) {
        console.warn(`[TOTP_CALLBACK] User not found for email ${userEmail}`);
        return new Response(
          `<html><body><h1>❌ Setup Failed</h1><p>User not found. Please register first.</p></body></html>`,
          {
            status: 404,
            headers: { "content-type": "text/html" },
          }
        );
      }

      userId = userResult[0].id;
    }

    if (!userId || !userEmail) {
      console.warn("[TOTP_CALLBACK] Could not identify user");
      return new Response(
        `<html><body><h1>❌ Setup Failed</h1><p>Could not identify user. Please try again.</p></body></html>`,
        {
          status: 400,
          headers: { "content-type": "text/html" },
        }
      );
    }

    // Handle rejection
    if (!success) {
      console.log(
        `[TOTP_CALLBACK] User rejected 2FA setup: ${error || "No reason provided"}`
      );

      // Update registration token if it exists
      if (regToken) {
        await updateRegistrationToken(regToken, {
          status: "rejected",
        });
      }

      // If external callback, redirect there with error
      if (externalCallbackUrl) {
        const errorParams = new URLSearchParams({
          success: "false",
          regToken: regToken || "",
          error: error || "User rejected 2FA setup",
          timestamp: Date.now().toString(),
        });

        return new Response(
          `<html><body><h1>Redirecting...</h1><script>window.location='${externalCallbackUrl}?${errorParams.toString()}';</script></body></html>`,
          {
            status: 200,
            headers: { "content-type": "text/html" },
          }
        );
      }

      // Otherwise show error page
      return new Response(
        `<html><body><h1>❌ Setup Cancelled</h1><p>2FA setup was cancelled. Error: ${error || "Unknown error"}</p><p>You can close this window and try again.</p></body></html>`,
        {
          status: 200,
          headers: { "content-type": "text/html" },
        }
      );
    }

    // Handle success
    if (actualSeed && code) {
      try {
        const encryptedSeed = encryptSecret(actualSeed);

        // Update user with TOTP configuration
        await updateUser(userId, {
          totpSecret: encryptedSeed,
          totpEnabled: true,
          totpSeedId: seedId || null,
          totpSetupCompleted: new Date(),
        });

        // Update registration token status
        if (regToken) {
          await updateRegistrationToken(regToken, {
            status: "completed",
            seedId: seedId || undefined,
            totpSeed: encryptedSeed,
            completedAt: new Date(),
          });
        }

        console.log(
          `[TOTP_CALLBACK] ✅ 2FA setup completed for user ${userId} (${userEmail})`
        );

        // Always redirect to the confirmation page with success parameters
        // This allows for a beautiful UI and proper session handling
        const confirmationUrl = new URL(externalCallbackUrl || `${new URL(request.url).origin}/auth/totp-confirmation`);
        confirmationUrl.searchParams.set("success", "true");
        confirmationUrl.searchParams.set("regToken", regToken || "");
        confirmationUrl.searchParams.set("seedId", seedId || "");
        confirmationUrl.searchParams.set("seed", actualSeed);
        confirmationUrl.searchParams.set("code", code);
        confirmationUrl.searchParams.set("timestamp", Date.now().toString());

        console.log(
          `[TOTP_CALLBACK] Redirecting to confirmation: ${confirmationUrl.toString()}`
        );

        return new Response(
          `<html><body><h1>Redirecting...</h1><script>window.location='${confirmationUrl.toString()}';</script></body></html>`,
          {
            status: 200,
            headers: { "content-type": "text/html" },
          }
        );
      } catch (encryptError) {
        console.error("[TOTP_CALLBACK] Error encrypting TOTP secret:", encryptError);
        return new Response(
          `<html><body><h1>❌ Setup Failed</h1><p>There was an error storing your 2FA configuration. Please try again.</p></body></html>`,
          {
            status: 500,
            headers: { "content-type": "text/html" },
          }
        );
      }
    } else {
      console.error(
        "[TOTP_CALLBACK] Missing seed or code in successful callback"
      );
      return new Response(
        `<html><body><h1>❌ Setup Failed</h1><p>Invalid callback data received.</p></body></html>`,
        {
          status: 400,
          headers: { "content-type": "text/html" },
        }
      );
    }
  } catch (error) {
    console.error("[TOTP_CALLBACK] Error in totp-callback:", error);
    return new Response(
      `<html><body><h1>❌ Error</h1><p>An unexpected error occurred.</p></body></html>`,
      {
        status: 500,
        headers: { "content-type": "text/html" },
      }
    );
  }
}
