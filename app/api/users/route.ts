import { getAllUsers } from "@/db/queries";
import { auth } from "@/app/(auth)/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    // For now, allow any authenticated user to see users
    // You might want to restrict this to admins only

    const users = await getAllUsers();

    return NextResponse.json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}