import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getDb } from "@/db/queries";
import { scripts } from "@/db/schema";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { 
      title, 
      content, 
      description, 
      topic,
      workflowId,
      tags = []
    } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const newScript = await getDb().insert(scripts).values({
      userId: session.user.id,
      title: title,
      description: description || `Generated script for: ${topic}`,
      content: content,
      language: "english",
      hookType: "viral-hook",
      mainContentType: "video-script",
      status: "ready",
      tags: [...tags, "workflow-generated", workflowId || "video-production"],
      isPublic: false,
    }).returning();

    return NextResponse.json({
      success: true,
      script: newScript[0]
    });

  } catch (error) {
    console.error("Error saving script:", error);
    return NextResponse.json(
      { error: "Failed to save script" },
      { status: 500 }
    );
  }
}