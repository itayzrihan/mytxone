import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

/**
 * Serve temporary video files with proper metadata headers
 * This endpoint ensures Blotato and other media services can read metadata
 * GET /api/social/serve-temp-video?filename=video-1234567890.mp4
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");

    if (!filename) {
      return NextResponse.json(
        { error: "Missing filename parameter" },
        { status: 400 }
      );
    }

    // Security: Only allow video files from tempfiles directory
    if (!filename.match(/^video-\d+\.(mp4|mov|avi|webm|mkv)$/i)) {
      return NextResponse.json(
        { error: "Invalid filename format" },
        { status: 400 }
      );
    }

    const filePath = join(process.cwd(), "public", "tempfiles", filename);

    // Security: Verify file is in tempfiles directory (prevent directory traversal)
    if (!filePath.startsWith(join(process.cwd(), "public", "tempfiles"))) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // Get file stats for metadata
    const fileStats = await stat(filePath);
    const fileSize = fileStats.size;

    // Read the file
    const fileBuffer = await readFile(filePath);

    // Determine content type based on extension
    const ext = filename.split(".").pop()?.toLowerCase();
    const contentTypeMap: Record<string, string> = {
      mp4: "video/mp4",
      mov: "video/quicktime",
      avi: "video/x-msvideo",
      webm: "video/webm",
      mkv: "video/x-matroska",
    };
    const contentType = contentTypeMap[ext || "mp4"] || "video/mp4";

    // Check for Range request (important for video streaming and metadata reading)
    const range = request.headers.get("range");
    if (range) {
      const ranges = range.replace(/bytes=/, "").split("-");
      const start = parseInt(ranges[0], 10);
      const end = ranges[1] ? parseInt(ranges[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const chunk = fileBuffer.slice(start, end + 1);

      return new NextResponse(chunk as unknown as BodyInit, {
        status: 206, // Partial Content
        headers: {
          "Content-Type": contentType,
          "Content-Length": chunkSize.toString(),
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Cache-Control": "public, max-age=3600",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Range",
          "Access-Control-Expose-Headers": "Content-Length, Content-Range, Accept-Ranges",
        },
      });
    }

    // Create response with proper headers for media metadata reading
    const response = new NextResponse(fileBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": fileSize.toString(),
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
        "Accept-Ranges": "bytes",
        // CORS headers for external access (Blotato)
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Range",
        "Access-Control-Expose-Headers": "Content-Length, Content-Range, Accept-Ranges",
        // Additional headers to help with metadata reading
        "X-Content-Type-Options": "nosniff",
      },
    });

    return response;
  } catch (error) {
    console.error("Serve temp video error:", error);
    return NextResponse.json(
      {
        error: `Failed to serve video: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}

/**
 * Support for Range requests (important for video streaming)
 * Allows clients to request specific byte ranges of the file
 */
export async function HEAD(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");

    if (!filename) {
      return NextResponse.json(
        { error: "Missing filename parameter" },
        { status: 400 }
      );
    }

    // Security: Only allow video files from tempfiles directory
    if (!filename.match(/^video-\d+\.(mp4|mov|avi|webm|mkv)$/i)) {
      return NextResponse.json(
        { error: "Invalid filename format" },
        { status: 400 }
      );
    }

    const filePath = join(process.cwd(), "public", "tempfiles", filename);

    // Security: Verify file is in tempfiles directory
    if (!filePath.startsWith(join(process.cwd(), "public", "tempfiles"))) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // Get file stats
    const fileStats = await stat(filePath);
    const fileSize = fileStats.size;

    // Determine content type
    const ext = filename.split(".").pop()?.toLowerCase();
    const contentTypeMap: Record<string, string> = {
      mp4: "video/mp4",
      mov: "video/quicktime",
      avi: "video/x-msvideo",
      webm: "video/webm",
      mkv: "video/x-matroska",
    };
    const contentType = contentTypeMap[ext || "mp4"] || "video/mp4";

    // Return HEAD response with metadata headers
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": fileSize.toString(),
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "public, max-age=3600",
        "Accept-Ranges": "bytes",
        // CORS headers for external access (Blotato)
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Range",
        "Access-Control-Expose-Headers": "Content-Length, Content-Range, Accept-Ranges",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Serve temp video HEAD error:", error);
    return NextResponse.json(
      {
        error: `Failed to get video metadata: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}

/**
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Range",
      "Access-Control-Expose-Headers": "Content-Length, Content-Range, Accept-Ranges",
    },
  });
}
