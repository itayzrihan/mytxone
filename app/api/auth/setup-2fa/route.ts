import { auth } from "@/app/(auth)/auth";
import { getTOTPSetupURL } from "@/lib/totp";

/**
 * POST /api/auth/setup-2fa
 * Initiates 2FA setup by returning a deep link to Legitate
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

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const deepLink = getTOTPSetupURL(baseUrl, session.user.email || "", "mytx.one");

    return new Response(
      JSON.stringify({
        success: true,
        deepLink,
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
