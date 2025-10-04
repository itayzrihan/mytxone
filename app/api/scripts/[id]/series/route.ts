import { auth } from "@/app/(auth)/auth";
import { NextResponse, NextRequest } from "next/server";
import { getScriptSeries } from "@/db/queries";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const series = await getScriptSeries(params.id);
    return NextResponse.json(series);
  } catch (error) {
    console.error("Error fetching script series:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
