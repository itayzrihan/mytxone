import { auth } from "@/app/(auth)/auth";
import { NextResponse, NextRequest } from "next/server";
import { getUserSeries, createSeries } from "@/db/queries";

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

    const series = await getUserSeries(userId);
    return NextResponse.json(series);
  } catch (error) {
    console.error("Error fetching series:", error);
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
    const { name, description, order } = body;

    if (!name) {
      return NextResponse.json({ 
        error: "Missing required field: name" 
      }, { status: 400 });
    }

    const series = await createSeries({
      userId: session.user.id!,
      name,
      description,
      order: order || 0,
    });

    return NextResponse.json(series[0], { status: 201 });
  } catch (error) {
    console.error("Error creating series:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
