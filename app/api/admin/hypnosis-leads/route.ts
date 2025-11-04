import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/queries";
import { hypnosisLead } from "@/db/schema";
import { desc } from "drizzle-orm";
import { auth } from "@/app/(auth)/auth";
import { checkIfUserIsAdmin } from "@/db/queries";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const isAdmin = await checkIfUserIsAdmin(session.user.id);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const db = getDb();

    // Fetch all hypnosis leads ordered by creation date (newest first)
    const leads = await db
      .select()
      .from(hypnosisLead)
      .orderBy(desc(hypnosisLead.createdAt));

    return NextResponse.json({
      success: true,
      total: leads.length,
      leads,
    });
  } catch (error) {
    console.error("Error fetching hypnosis leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
