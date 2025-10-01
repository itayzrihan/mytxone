import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getUserFavoriteIds } from "@/db/favorites-queries";
import { getContentTypesWithFavorites, getHooksWithFavorites } from "@/lib/video-script-constants";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'content_types' or 'hooks'

    if (type === 'content_types') {
      const favoriteIds = await getUserFavoriteIds(session.user.id!, 'content_type');
      const contentTypes = getContentTypesWithFavorites(favoriteIds);
      
      return NextResponse.json({
        success: true,
        data: contentTypes
      });
    } else if (type === 'hooks') {
      const favoriteIds = await getUserFavoriteIds(session.user.id!, 'hook');
      const hooks = getHooksWithFavorites(favoriteIds);
      
      return NextResponse.json({
        success: true,
        data: hooks
      });
    } else {
      // Return both if no type specified
      const [contentTypeFavorites, hookFavorites] = await Promise.all([
        getUserFavoriteIds(session.user.id!, 'content_type'),
        getUserFavoriteIds(session.user.id!, 'hook')
      ]);

      const contentTypes = getContentTypesWithFavorites(contentTypeFavorites);
      const hooks = getHooksWithFavorites(hookFavorites);

      return NextResponse.json({
        success: true,
        data: {
          contentTypes,
          hooks
        }
      });
    }

  } catch (error) {
    console.error("Error getting data with favorites:", error);
    return NextResponse.json(
      { error: "Failed to get data with favorites" },
      { status: 500 }
    );
  }
}