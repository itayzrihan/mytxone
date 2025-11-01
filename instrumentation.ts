/**
 * Instrumentation file
 * 
 * Note: Temp file cleanup is now handled on-demand (lazy cleanup)
 * It runs only when a new video is uploaded, not on a schedule.
 * This is WordPress-cron style: efficient and resource-conscious.
 */

export async function register() {
  // No background jobs needed - cleanup is triggered on upload
}

