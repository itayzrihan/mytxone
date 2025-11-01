import { NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { z } from "zod";

const PostToSocialSchema = z.object({
  driveLink: z.string().url("Valid Google Drive link required"),
  title: z.string().min(1, "Title is required"),
  caption: z.string().min(1, "Caption is required"),
  source: z.enum(["upload", "existing"]).default("existing"),
});

/**
 * Post video to all social media platforms
 * Accepts both:
 * 1. New uploads (after Google Drive upload)
 * 2. Existing Google Drive links
 * 
 * Triggers the n8n workflow: blotato-api.json
 * 
 * POST /api/social/post-video
 * 
 * Body:
 * {
 *   driveLink: string (URL to Google Drive file),
 *   title: string,
 *   caption: string,
 *   source: "upload" | "existing"
 * }
 * 
 * Returns:
 * {
 *   success: true,
 *   message: "Video posted to social media",
 *   workflowId: string,
 *   platforms: ["tiktok", "instagram", "youtube", ...]
 * }
 */
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate request body
    const validatedData = PostToSocialSchema.safeParse(body);

    if (!validatedData.success) {
      const errors = validatedData.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join(", ");
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const { driveLink, title, caption, source } = validatedData.data;

    // Get n8n webhook URL
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
      return NextResponse.json(
        {
          error: "n8n webhook URL not configured. Set N8N_WEBHOOK_URL environment variable.",
        },
        { status: 500 }
      );
    }

    try {
      // Call n8n webhook to trigger workflow
      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          driveLink,
          title,
          caption,
          source, // Track whether this came from direct upload or existing link
          userId: session.user.id,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!n8nResponse.ok) {
        const errorText = await n8nResponse.text();
        console.error("n8n workflow error:", errorText);
        throw new Error(`Workflow trigger failed: ${errorText}`);
      }

      const workflowResponse = await n8nResponse.json();

      return NextResponse.json({
        success: true,
        message:
          source === "upload"
            ? "Video uploaded to Google Drive and sent to all social platforms"
            : "Video sent to all social platforms",
        workflowId: workflowResponse.executionId || "pending",
        platforms: [
          "tiktok_itay_zrihan",
          "tiktok_itay_tech",
          "tiktok_itay_zrihan_warmed",
          "tiktok_spammer",
          "instagram_sales_growth",
          "instagram_itay_zrihan",
          "instagram_itay_chi",
          "instagram_itay_zrihan_official",
          "youtube_itay_zrihan",
          "youtube_mytx",
          "linkedin",
          "facebook",
          "twitter",
          "threads",
        ],
        estimatedPostingTime: "10-15 minutes",
        note: "Your video is being posted to all platforms with staggered delays to avoid rate limiting.",
      });
    } catch (n8nError) {
      console.error("n8n workflow error:", n8nError);
      return NextResponse.json(
        {
          error: `Failed to trigger workflow: ${n8nError instanceof Error ? n8nError.message : "Unknown error"}`,
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
