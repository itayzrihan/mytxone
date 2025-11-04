import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/queries";
import { hypnosisLead } from "@/db/schema";

interface LeadRequestBody {
  fullName: string;
  email: string;
  phoneNumber: string;
  allowCommunication: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: LeadRequestBody = await request.json();

    // Validate required fields
    if (!body.fullName || !body.email || !body.phoneNumber) {
      return NextResponse.json(
        { 
          error: "Missing required fields: fullName, email, or phoneNumber" 
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate phone number (basic validation - at least 10 digits)
    const phoneDigits = body.phoneNumber.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      return NextResponse.json(
        { error: "Invalid phone number. Please provide at least 10 digits." },
        { status: 400 }
      );
    }

    // Get database instance
    const db = getDb();

    // Insert into database
    const result = await db
      .insert(hypnosisLead)
      .values({
        fullName: body.fullName.trim(),
        email: body.email.toLowerCase().trim(),
        phoneNumber: body.phoneNumber.trim(),
        allowMarketing: body.allowCommunication,
        allowHypnosisKnowledge: body.allowCommunication,
        source: "hypno-landing",
      })
      .returning();

    return NextResponse.json(
      { 
        success: true,
        message: "Lead successfully saved! Check your email for the free e-book.",
        leadId: result[0]?.id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving hypnosis lead:", error);
    return NextResponse.json(
      { error: "Failed to save lead. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
