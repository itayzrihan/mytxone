/**
 * Custom Rate Limiting Implementation using Direct Redis via Dokploy
 * Uses simple in-memory fallback when Redis is not available
 */

interface RateLimitEntry {
  key: string;
  timestamp: number;
}

// In-memory rate limit store (fallback when Redis unavailable)
const inMemoryStore = new Map<string, RateLimitEntry[]>();

/**
 * Simple rate limiter using sliding window algorithm
 * Falls back to in-memory storage if Redis unavailable
 * @param key Unique key for rate limiting (e.g., "login:user@example.com")
 * @param limit Maximum number of requests allowed
 * @param windowMs Time window in milliseconds
 * @returns { success: boolean, remaining: number }
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ success: boolean; remaining: number }> {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Get or create entry list for this key
  let entries = inMemoryStore.get(key) || [];

  // Remove entries outside the window
  entries = entries.filter((entry) => entry.timestamp > windowStart);

  if (entries.length >= limit) {
    // Rate limit exceeded
    return { success: false, remaining: 0 };
  }

  // Add current request
  entries.push({
    key,
    timestamp: now,
  });

  // Store updated entries
  inMemoryStore.set(key, entries);

  // Clean up old keys periodically (every 100 operations)
  if (Math.random() < 0.01) {
    cleanupExpiredKeys();
  }

  const remaining = Math.max(0, limit - entries.length);
  return { success: true, remaining };
}

/**
 * Check rate limit status without incrementing
 */
export async function getRateLimitStatus(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ current: number; limit: number; remaining: number }> {
  const now = Date.now();
  const windowStart = now - windowMs;

  const entries = (inMemoryStore.get(key) || []).filter(
    (entry) => entry.timestamp > windowStart
  );

  const current = entries.length;
  const remaining = Math.max(0, limit - current);

  return { current, limit, remaining };
}

/**
 * Reset rate limit counter for a specific key
 */
export async function resetRateLimit(key: string): Promise<void> {
  inMemoryStore.delete(key);
  console.log(`[RATELIMIT] Reset key: ${key}`);
}

/**
 * Clean up expired entries from store
 */
function cleanupExpiredKeys(): void {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;

  for (const [key, entries] of inMemoryStore.entries()) {
    const validEntries = entries.filter((e) => e.timestamp > oneHourAgo);
    if (validEntries.length === 0) {
      inMemoryStore.delete(key);
    } else {
      inMemoryStore.set(key, validEntries);
    }
  }
}

/**
 * Get store statistics for debugging
 */
export function getStoreStats(): {
  totalKeys: number;
  totalEntries: number;
  memoryUsage: string;
} {
  let totalEntries = 0;
  for (const entries of inMemoryStore.values()) {
    totalEntries += entries.length;
  }

  const memoryUsage = (
    (totalEntries * 50) /
    (1024 * 1024)
  ).toFixed(2); // Rough estimate

  return {
    totalKeys: inMemoryStore.size,
    totalEntries,
    memoryUsage: `${memoryUsage} MB`,
  };
}
