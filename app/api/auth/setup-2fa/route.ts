import { getTOTPSetupURL, validateCallbackTimestamp } from "@/lib/totp";
import { getDb } from "@/db/queries";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/app/(auth)/auth";
import {
  createRegistrationToken,
  generateRegistrationToken,
} from "@/lib/registration-token";
import { getBaseUrlFromRequest } from "@/lib/url-utils";

/**
 * POST /api/auth/setup-2fa
 * Initiates 2FA setup by returning a deep link to Legitate
 * 
 * Can be called in two ways:
 * 1. With authenticated session (user ID from session)
 * 2. With email + token (for registration flow without session)
 * 
 * Body:
 * - email (optional): User email - used for registration flow
 * - token (optional): Verification token - prevents unauthorized setup
 * - callbackUrl (optional): URL to redirect after 2FA setup
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, token, callbackUrl } = body;

    // Try to get from session first (existing users)
    const session = await auth();
    let userEmail = session?.user?.email;
    let userId = session?.user?.id;

    // If no session, check for email + token (registration flow)
    if (!userId && email && token) {
      console.log(`[SETUP_2FA] Registration flow: Setting up 2FA for ${email}`);

      // Validate token - it should be the email itself (simple validation)
      // In a real app, you'd use a JWT or proper token
      if (token !== email) {
        return new Response(
          JSON.stringify({ error: "Invalid setup token" }),
          { status: 400, headers: { "content-type": "application/json" } }
        );
      }

      // Look up user by email to verify they exist
      const userResult = await getDb()
        .select()
        .from(user)
        .where(eq(user.email, email));

      if (userResult.length === 0) {
        return new Response(
          JSON.stringify({ error: "User not found. Please register first." }),
          { status: 404, headers: { "content-type": "application/json" } }
        );
      }

      userEmail = email;
      userId = userResult[0].id;
    }

    // If still no email, return 401
    if (!userEmail || !userId) {
      return new Response(
        JSON.stringify({
          error: "User not authenticated. Please register or log in first.",
        }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }

    console.log(`[SETUP_2FA] Initiating 2FA setup for ${userEmail}`);

    // Generate registration token to track this 2FA setup
    const regTokenData = await createRegistrationToken({
      userId,
      email: userEmail,
      serviceName: "mytx.one",
      callbackUrl,
    });

    // Get base URL from request headers or environment (handles dynamic ports)
    const baseUrl = getBaseUrlFromRequest(request);
    
    // Tell Legitate to redirect directly to our beautiful confirmation page
    // This page will handle the callback parameters and show success/error
    const confirmationPageUrl = `${baseUrl}/auth/totp-confirmation`;

    // Generate deep link with registration token
    // Legitate will redirect to the confirmation page after TOTP setup
    const deepLink = getTOTPSetupURL(
      baseUrl,
      userEmail,
      "mytx.one",
      confirmationPageUrl, // Legitate redirects directly to confirmation page
      regTokenData.token // Pass registration token
    );

    return new Response(
      JSON.stringify({
        success: true,
        deepLink,
        registrationToken: regTokenData.token,
        message: "Redirect to this URL to set up 2FA",
      }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in setup-2fa:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate setup URL" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
