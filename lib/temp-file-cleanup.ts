import { readdir, stat, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

/**
 * Cleanup orphaned temporary video files
 * Deletes files older than 5 minutes from /public/tempfiles
 * 
 * Uses WordPress-style "cron" approach:
 * - Only runs when triggered (lazy cleanup)
 * - Not a scheduled background job
 * - Triggered on each video upload
 * - Minimal resource usage
 */

const TEMP_DIR = join(process.cwd(), "public", "tempfiles");
const MAX_FILE_AGE_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Clean up old temporary files
 * Call this before uploading new files (like WP cron)
 */
export async function cleanupOldTempFiles() {
  try {
    // Ensure temp directory exists
    if (!existsSync(TEMP_DIR)) {
      return; // Directory doesn't exist yet
    }

    const files = await readdir(TEMP_DIR);
    const now = Date.now();
    let deletedCount = 0;

    for (const file of files) {
      const filePath = join(TEMP_DIR, file);

      try {
        const stats = await stat(filePath);
        const fileAge = now - stats.mtimeMs;

        // Delete if older than 5 minutes
        if (fileAge > MAX_FILE_AGE_MS) {
          await unlink(filePath);
          console.log(
            `[TempFileCleanup] Deleted old file: ${file} (${Math.round(fileAge / 1000)}s old)`
          );
          deletedCount++;
        }
      } catch (err) {
        console.error(`[TempFileCleanup] Error processing file ${file}:`, err);
      }
    }

    if (deletedCount > 0) {
      console.log(`[TempFileCleanup] Cleaned up ${deletedCount} old files`);
    }
  } catch (err) {
    console.error("[TempFileCleanup] Error during cleanup:", err);
  }
}
