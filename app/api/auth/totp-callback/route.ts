import { auth } from "@/app/(auth)/auth";
import { updateUser } from "@/db/queries";
import {
  encryptSecret,
  validateCallbackTimestamp,
} from "@/lib/totp";

/**
 * GET /api/auth/totp-callback
 * Receives callback from Legitate when user completes TOTP setup
 * Parameters:
 *  - success: "true" or "false"
 *  - secret: Generated TOTP secret (Base32) - store this encrypted!
 *  - seedId: ID of created seed
 *  - error: Error message if success=false
 *  - timestamp: Unix timestamp for validation
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const success = searchParams.get("success");
    const secret = searchParams.get("secret");
    const seedId = searchParams.get("seedId");
    const error = searchParams.get("error");
    const timestamp = searchParams.get("timestamp");

    // Validate timestamp to prevent replay attacks
    if (!timestamp || !validateCallbackTimestamp(timestamp)) {
      console.warn("Invalid callback timestamp");
      return new Response("Callback expired", { status: 400 });
    }

    const session = await auth();
    if (!session?.user?.id) {
      console.warn("Unauthenticated callback attempt");
      return new Response("Unauthorized", { status: 401 });
    }

    if (success === "true" && secret) {
      // Success! Encrypt and store the secret
      try {
        const encryptedSecret = encryptSecret(secret);

        await updateUser(session.user.id, {
          totpSecret: encryptedSecret,
          totpEnabled: true,
          totpSeedId: seedId || null,
          totpSetupCompleted: new Date(),
        });

        console.log(`2FA setup completed for user ${session.user.id}`);
        return new Response("OK", { status: 200 });
      } catch (encryptError) {
        console.error("Error encrypting TOTP secret:", encryptError);
        return new Response("Failed to store secret", { status: 500 });
      }
    } else {
      // User rejected or error occurred
      console.warn(`TOTP setup failed for user ${session.user.id}: ${error}`);
      return new Response("OK", { status: 200 });
    }
  } catch (error) {
    console.error("Error in totp-callback:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
