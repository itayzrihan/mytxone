import { auth } from "@/app/(auth)/auth";
import { NextResponse, NextRequest } from "next/server";
import { getScriptById, updateScript, deleteScript } from "@/db/queries";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const script = await getScriptById(params.id);
    if (!script) {
      return NextResponse.json({ error: "Script not found" }, { status: 404 });
    }

    // Check if user owns the script or if it's public
    if (script.userId !== session.user.id! && !script.isPublic) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(script);
  } catch (error) {
    console.error("Error fetching script:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const script = await getScriptById(params.id);
    if (!script) {
      return NextResponse.json({ error: "Script not found" }, { status: 404 });
    }

    // Check if user owns the script
    if (script.userId !== session.user.id!) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

    const updatedScript = await updateScript(params.id, {
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
      isPublic,
    });

    return NextResponse.json(updatedScript[0]);
  } catch (error) {
    console.error("Error updating script:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const script = await getScriptById(params.id);
    if (!script) {
      return NextResponse.json({ error: "Script not found" }, { status: 404 });
    }

    // Check if user owns the script
    if (script.userId !== session.user.id!) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await deleteScript(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting script:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}