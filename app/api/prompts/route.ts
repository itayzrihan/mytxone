import { auth } from "@/app/(auth)/auth";
import { NextResponse, NextRequest } from "next/server";
import { getUserPrompts, createPrompt } from "@/db/queries";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    
    if (!userId || userId !== session.user.id!) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const prompts = await getUserPrompts(userId);
    return NextResponse.json(prompts);
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      title, 
      description, 
      promptText, 
      category,
      tags, 
      isFavorite,
      isPublic 
    } = body;

    if (!title || !promptText) {
      return NextResponse.json({ 
        error: "Missing required fields: title, promptText" 
      }, { status: 400 });
    }

    const prompt = await createPrompt({
      userId: session.user.id!,
      title,
      description,
      promptText,
      category: category || "general",
      tags: tags || [],
      isFavorite: isFavorite || false,
      isPublic: isPublic || false,
    });

    return NextResponse.json(prompt[0], { status: 201 });
  } catch (error) {
    console.error("Error creating prompt:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
