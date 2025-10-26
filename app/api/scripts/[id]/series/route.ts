import { auth } from "@/app/(auth)/auth";
import { NextResponse, NextRequest } from "next/server";
import { getScriptById, getScriptSeries, getSeriesScripts } from "@/db/queries";
import { Script } from "@/db/schema";

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

    // Get all series this script belongs to
    const seriesArray = await getScriptSeries(params.id);
    
    if (seriesArray.length === 0) {
      // Script is not part of any series
      return NextResponse.json({
        id: null,
        name: null,
        description: null,
        previousScript: null,
        nextScript: null,
        currentIndex: -1,
        totalScripts: 0
      });
    }

    // Get the first series (user can belong to multiple series, but we'll focus on the first)
    const series = seriesArray[0];
    const seriesScripts = await getSeriesScripts(series.id);
    const currentIndex = seriesScripts.findIndex((s: any) => s.id === params.id);

    const previousScript = currentIndex > 0 ? seriesScripts[currentIndex - 1] : null;
    const nextScript = currentIndex < seriesScripts.length - 1 ? seriesScripts[currentIndex + 1] : null;

    return NextResponse.json({
      id: series.id,
      name: series.name,
      description: series.description,
      previousScript: previousScript || null,
      nextScript: nextScript || null,
      currentIndex,
      totalScripts: seriesScripts.length
    });
  } catch (error) {
    console.error("Error fetching script series info:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
