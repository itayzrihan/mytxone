import { auth } from "@/app/(auth)/auth";
import { NextResponse, NextRequest } from "next/server";
import { getSeriesById, getSeriesScripts, addScriptToSeries, removeScriptFromSeries, updateScriptOrderInSeries } from "@/db/queries";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const series = await getSeriesById(params.id);
    
    if (!series) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }

    if (series.userId !== session.user.id!) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const scripts = await getSeriesScripts(params.id);
    return NextResponse.json(scripts);
  } catch (error) {
    console.error("Error fetching series scripts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const series = await getSeriesById(params.id);
    
    if (!series) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }

    if (series.userId !== session.user.id!) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { scriptId, orderInSeries } = body;

    if (!scriptId) {
      return NextResponse.json({ 
        error: "Missing required field: scriptId" 
      }, { status: 400 });
    }

    const link = await addScriptToSeries(scriptId, params.id, orderInSeries);
    return NextResponse.json(link[0], { status: 201 });
  } catch (error) {
    console.error("Error adding script to series:", error);
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

    const series = await getSeriesById(params.id);
    
    if (!series) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }

    if (series.userId !== session.user.id!) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const scriptId = searchParams.get("scriptId");

    if (!scriptId) {
      return NextResponse.json({ 
        error: "Missing required parameter: scriptId" 
      }, { status: 400 });
    }

    await removeScriptFromSeries(scriptId, params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing script from series:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const series = await getSeriesById(params.id);
    
    if (!series) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }

    if (series.userId !== session.user.id!) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { scriptId, orderInSeries } = body;

    if (!scriptId || orderInSeries === undefined) {
      return NextResponse.json({ 
        error: "Missing required fields: scriptId, orderInSeries" 
      }, { status: 400 });
    }

    const updatedLink = await updateScriptOrderInSeries(scriptId, params.id, orderInSeries);
    return NextResponse.json(updatedLink[0]);
  } catch (error) {
    console.error("Error updating script order in series:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
