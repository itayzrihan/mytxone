import { eq, and } from "drizzle-orm";
import { getDb } from "./queries";
import { userFavorites, type UserFavorite } from "./schema";

export type FavoriteType = 'content_type' | 'hook';

/**
 * Get all user favorites by type
 */
export async function getUserFavorites(userId: string, favoriteType?: FavoriteType): Promise<UserFavorite[]> {
  try {
    const conditions = [eq(userFavorites.userId, userId)];
    
    if (favoriteType) {
      conditions.push(eq(userFavorites.favoriteType, favoriteType));
    }

    const favorites = await getDb()
      .select()
      .from(userFavorites)
      .where(and(...conditions));

    return favorites;
  } catch (error) {
    console.error("Error getting user favorites:", error);
    throw new Error("Failed to get user favorites");
  }
}

/**
 * Get user favorite IDs as an array for easy lookup
 */
export async function getUserFavoriteIds(userId: string, favoriteType: FavoriteType): Promise<string[]> {
  try {
    const favorites = await getUserFavorites(userId, favoriteType);
    return favorites.map(fav => fav.favoriteId);
  } catch (error) {
    console.error("Error getting user favorite IDs:", error);
    return [];
  }
}

/**
 * Add a favorite for a user
 */
export async function addUserFavorite(
  userId: string, 
  favoriteType: FavoriteType, 
  favoriteId: string
): Promise<UserFavorite> {
  try {
    // Check if favorite already exists
    const existing = await getDb()
      .select()
      .from(userFavorites)
      .where(and(
        eq(userFavorites.userId, userId),
        eq(userFavorites.favoriteType, favoriteType),
        eq(userFavorites.favoriteId, favoriteId)
      ));

    if (existing.length > 0) {
      return existing[0];
    }

    // Insert new favorite
    const [newFavorite] = await getDb()
      .insert(userFavorites)
      .values({
        userId,
        favoriteType,
        favoriteId,
      })
      .returning();

    return newFavorite;
  } catch (error) {
    console.error("Error adding user favorite:", error);
    throw new Error("Failed to add user favorite");
  }
}

/**
 * Remove a favorite for a user
 */
export async function removeUserFavorite(
  userId: string, 
  favoriteType: FavoriteType, 
  favoriteId: string
): Promise<boolean> {
  try {
    const result = await getDb()
      .delete(userFavorites)
      .where(and(
        eq(userFavorites.userId, userId),
        eq(userFavorites.favoriteType, favoriteType),
        eq(userFavorites.favoriteId, favoriteId)
      ));

    return Array.isArray(result) ? result.length > 0 : true;
  } catch (error) {
    console.error("Error removing user favorite:", error);
    throw new Error("Failed to remove user favorite");
  }
}

/**
 * Toggle a favorite for a user (add if not exists, remove if exists)
 */
export async function toggleUserFavorite(
  userId: string, 
  favoriteType: FavoriteType, 
  favoriteId: string
): Promise<{ isFavorite: boolean; favorite?: UserFavorite }> {
  try {
    // Check if favorite exists
    const existing = await getDb()
      .select()
      .from(userFavorites)
      .where(and(
        eq(userFavorites.userId, userId),
        eq(userFavorites.favoriteType, favoriteType),
        eq(userFavorites.favoriteId, favoriteId)
      ));

    if (existing.length > 0) {
      // Remove favorite
      await removeUserFavorite(userId, favoriteType, favoriteId);
      return { isFavorite: false };
    } else {
      // Add favorite
      const newFavorite = await addUserFavorite(userId, favoriteType, favoriteId);
      return { isFavorite: true, favorite: newFavorite };
    }
  } catch (error) {
    console.error("Error toggling user favorite:", error);
    throw new Error("Failed to toggle user favorite");
  }
}

/**
 * Check if an item is favorited by a user
 */
export async function isUserFavorite(
  userId: string, 
  favoriteType: FavoriteType, 
  favoriteId: string
): Promise<boolean> {
  try {
    const existing = await getDb()
      .select()
      .from(userFavorites)
      .where(and(
        eq(userFavorites.userId, userId),
        eq(userFavorites.favoriteType, favoriteType),
        eq(userFavorites.favoriteId, favoriteId)
      ));

    return existing.length > 0;
  } catch (error) {
    console.error("Error checking user favorite:", error);
    return false;
  }
}

/**
 * Get user's favorite content types with full data
 */
export async function getUserFavoriteContentTypes(userId: string) {
  try {
    const favoriteIds = await getUserFavoriteIds(userId, 'content_type');
    
    // Import here to avoid circular dependency
    const { getContentTypesWithFavorites } = await import('../lib/video-script-constants');
    
    return getContentTypesWithFavorites(favoriteIds);
  } catch (error) {
    console.error("Error getting user favorite content types:", error);
    return [];
  }
}

/**
 * Get user's favorite hooks with full data
 */
export async function getUserFavoriteHooks(userId: string) {
  try {
    const favoriteIds = await getUserFavoriteIds(userId, 'hook');
    
    // Import here to avoid circular dependency
    const { getHooksWithFavorites } = await import('../lib/video-script-constants');
    
    return getHooksWithFavorites(favoriteIds);
  } catch (error) {
    console.error("Error getting user favorite hooks:", error);
    return [];
  }
}