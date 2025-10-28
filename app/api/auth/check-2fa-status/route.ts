import { NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getUser } from "@/db/queries";

/**
 * GET /api/auth/check-2fa-status
 * 
 * Checks if the currently authenticated user has 2FA enabled
 * Returns: { totpEnabled: boolean }
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get user from database
    const [user] = await getUser(session.user.email);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      totpEnabled: user.totpEnabled || false,
    });
  } catch (error) {
    console.error("[CHECK_2FA_STATUS] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
