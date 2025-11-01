import { NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { z } from "zod";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { cleanupOldTempFiles } from "@/lib/temp-file-cleanup";

const UploadSchema = z.object({
  file: z.instanceof(File),
  title: z.string().min(1, "Title is required"),
  caption: z.string().min(1, "Caption is required"),
  fileName: z.string().min(1, "File name is required"),
});

/**
 * Upload video to temporary folder and return shareable link
 * POST /api/social/upload-to-drive
 * 
 * Body: FormData with:
 * - file: File (video)
 * - title: string
 * - caption: string
 * - fileName: string
 * 
 * Returns:
 * {
 *   success: true,
 *   fileId: string (filename without extension),
 *   driveLink: string (temporary file URL),
 *   downloadLink: string (same as driveLink),
 *   title: string,
 *   caption: string
 * }
 */
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;
    const caption = formData.get("caption") as string | null;
    const fileName = formData.get("fileName") as string | null;

    // Validate input
    if (!file || !title || !caption || !fileName) {
      return NextResponse.json(
        { error: "Missing required fields: file, title, caption, fileName" },
        { status: 400 }
      );
    }

    const validatedData = UploadSchema.safeParse({
      file,
      title,
      caption,
      fileName,
    });

    if (!validatedData.success) {
      const errors = validatedData.error.errors
        .map((e) => e.message)
        .join(", ");
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    try {
      // WordPress-cron style: Clean up old files before uploading new one
      // This is lazy cleanup - only runs when someone uploads
      console.log("[FileUpload] Starting cleanup of old temp files...");
      await cleanupOldTempFiles();

      // Create temp folder path
      const tempDir = join(process.cwd(), "public", "tempfiles");
      
      // Ensure temp directory exists
      if (!existsSync(tempDir)) {
        await mkdir(tempDir, { recursive: true });
      }

      // Generate unique filename with timestamp
      const timestamp = Date.now();
      const fileExtension = fileName.split(".").pop() || "mp4";
      const uniqueFileName = `video-${timestamp}.${fileExtension}`;
      const filePath = join(tempDir, uniqueFileName);

      // Write file to disk
      const buffer = await file.arrayBuffer();
      await writeFile(filePath, Buffer.from(buffer));

      // Generate accessible URLs
      const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
      const host = request.headers.get("host") || "localhost:3000";
      const driveLink = `${protocol}://${host}/tempfiles/${uniqueFileName}`;
      const downloadLink = driveLink; // Same link for temporary files

      return NextResponse.json({
        success: true,
        fileId: `video-${timestamp}`,
        driveLink,
        downloadLink,
        title,
        caption,
        message: `Video uploaded successfully to temporary storage.`,
        note: "Old temporary files are automatically cleaned up when uploading new videos.",
      });
    } catch (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        {
          error: `Upload failed: ${uploadError instanceof Error ? uploadError.message : "Unknown error"}`,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Post to social error:", error);
    return NextResponse.json(
      {
        error: `Request failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}
