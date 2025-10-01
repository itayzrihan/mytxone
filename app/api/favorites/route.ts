import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { toggleUserFavorite, getUserFavorites, type FavoriteType } from "@/db/favorites-queries";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { favoriteType, favoriteId } = await request.json();

    if (!favoriteType || !favoriteId) {
      return NextResponse.json(
        { error: "favoriteType and favoriteId are required" },
        { status: 400 }
      );
    }

    if (favoriteType !== 'content_type' && favoriteType !== 'hook') {
      return NextResponse.json(
        { error: "favoriteType must be 'content_type' or 'hook'" },
        { status: 400 }
      );
    }

    const result = await toggleUserFavorite(session.user.id!, favoriteType as FavoriteType, favoriteId);

    return NextResponse.json({
      success: true,
      isFavorite: result.isFavorite,
      favorite: result.favorite
    });

  } catch (error) {
    console.error("Error toggling favorite:", error);
    return NextResponse.json(
      { error: "Failed to toggle favorite" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const favoriteType = searchParams.get('type') as FavoriteType | null;

    const favorites = await getUserFavorites(session.user.id!, favoriteType || undefined);

    return NextResponse.json({
      success: true,
      favorites
    });

  } catch (error) {
    console.error("Error getting favorites:", error);
    return NextResponse.json(
      { error: "Failed to get favorites" },
      { status: 500 }
    );
  }
}