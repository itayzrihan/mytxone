import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getDb } from "@/db/queries";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/user/profile - Fetch user profile
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const db = getDb();
    const currentUser = await db
      .select()
      .from(user)
      .where(eq(user.email, session.user.email))
      .limit(1);

    if (currentUser.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userProfile = currentUser[0];

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

// PUT /api/user/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const db = getDb();
    const currentUser = await db
      .select()
      .from(user)
      .where(eq(user.email, session.user.email))
      .limit(1);

    if (currentUser.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const fullName = formData.get("fullName") as string | null;
    const phoneNumber = formData.get("phoneNumber") as string | null;
    const notMytxEmail = formData.get("notMytxEmail") as string | null;
    const profileImage = formData.get("profileImage") as File | null;

    let profileImageUrl = currentUser[0].profileImageUrl;

    // Handle image upload if provided
    if (profileImage) {
      // Convert image to base64
      const buffer = await profileImage.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      const mimeType = profileImage.type;
      profileImageUrl = `data:${mimeType};base64,${base64}`;
    }

    // Update user profile
    const updatedUser = await db
      .update(user)
      .set({
        fullName: fullName || null,
        phoneNumber: phoneNumber || null,
        notMytxEmail: notMytxEmail || null,
        profileImageUrl,
        updatedAt: new Date(),
      })
      .where(eq(user.id, currentUser[0].id))
      .returning();

    return NextResponse.json({
      id: updatedUser[0].id,
      email: updatedUser[0].email,
      fullName: updatedUser[0].fullName,
      phoneNumber: updatedUser[0].phoneNumber,
      notMytxEmail: updatedUser[0].notMytxEmail,
      profileImageUrl: updatedUser[0].profileImageUrl,
      subscription: updatedUser[0].subscription,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
