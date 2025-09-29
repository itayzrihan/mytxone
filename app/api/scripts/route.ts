import { auth } from "@/app/(auth)/auth";
import { NextResponse, NextRequest } from "next/server";
import { getUserScripts, createScript } from "@/db/queries";

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

    const scripts = await getUserScripts(userId);
    return NextResponse.json(scripts);
  } catch (error) {
    console.error("Error fetching scripts:", error);
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
      content, 
      language, 
      hookType, 
      mainContentType,
      contentFolderLink,
      productionVideoLink,
      uploadedVideoLinks,
      status,
      tags, 
      isPublic 
    } = body;

    if (!title || !content || !language || !hookType || !mainContentType) {
      return NextResponse.json({ 
        error: "Missing required fields: title, content, language, hookType, mainContentType" 
      }, { status: 400 });
    }

    const script = await createScript({
      userId: session.user.id!,
      title,
      description,
      content,
      language,
      hookType,
      mainContentType,
      contentFolderLink,
      productionVideoLink,
      uploadedVideoLinks: uploadedVideoLinks || [],
      status: status || "in-progress",
      tags: tags || [],
      isPublic: isPublic || false,
    });

    return NextResponse.json(script[0], { status: 201 });
  } catch (error) {
    console.error("Error creating script:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}