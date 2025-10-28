import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getDb } from "@/db/queries";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

interface RouteParams {
  username: string;
}

// GET /api/user/profile/[username] - Fetch user profile by username
export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const username = params.username;
    const db = getDb();

    // Find user by email (username + @mytx.one)
    const userEmail = `${username}@mytx.one`;
    const targetUser = await db
      .select()
      .from(user)
      .where(eq(user.email, userEmail))
      .limit(1);

    if (targetUser.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userProfile = targetUser[0];

    return NextResponse.json({
      id: userProfile.id,
      email: userProfile.email,
      fullName: userProfile.fullName,
      phoneNumber: userProfile.phoneNumber,
      notMytxEmail: userProfile.notMytxEmail,
      profileImageUrl: userProfile.profileImageUrl,
      subscription: userProfile.subscription,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
