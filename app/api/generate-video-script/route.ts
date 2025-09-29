import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { generateVideoScriptAction } from "@/ai/video-script-actions";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const { title, description, language, hookType, contentType, scriptLength, motif, strongReferenceId } = await request.json();

    // Validate required fields
    if (!title || !description || !language || !hookType || !contentType || !scriptLength) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate video script using AI
    const result = await generateVideoScriptAction({
      title,
      description,
      language,
      hookType,
      contentType,
      scriptLength,
      motif,
      strongReferenceId,
      userId: session.user.id, // Pass user ID for strong reference lookup
    });

    // Check for errors
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // Return successful result
    return NextResponse.json(result);

  } catch (error) {
    console.error("Error in generate-video-script API:", error);
    console.error("Error details:", error instanceof Error ? error.message : String(error));
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}