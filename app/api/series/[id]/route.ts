import { auth } from "@/app/(auth)/auth";
import { NextResponse, NextRequest } from "next/server";
import { getSeriesById, updateSeries, deleteSeries } from "@/db/queries";

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

    return NextResponse.json(series);
  } catch (error) {
    console.error("Error fetching series:", error);
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

    const series = await getSeriesById(params.id);
    
    if (!series) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }

    if (series.userId !== session.user.id!) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, order } = body;

    const updatedSeries = await updateSeries(params.id, {
      name,
      description,
      order,
    });

    return NextResponse.json(updatedSeries[0]);
  } catch (error) {
    console.error("Error updating series:", error);
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

    await deleteSeries(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting series:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
