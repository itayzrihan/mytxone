import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const topicsSchema = z.object({
  topics: z.array(z.string()).length(50).describe("Array of exactly 50 viral video topic titles")
});

export async function POST(request: NextRequest) {
  try {
    const { mainSubject, tellMeMore, desiredCTA, exampleScripts } = await request.json();

    if (!mainSubject || !tellMeMore || !desiredCTA) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Prepare the context for AI
    const context = `
Main Topic: ${mainSubject}
Detailed Context: ${tellMeMore}
Desired Call-to-Action: ${desiredCTA}
`;

    const exampleScriptsText = exampleScripts?.length > 0 
      ? `\n\nExample Scripts for Learning:\n${exampleScripts.map((script: string, index: number) => `Script ${index + 1}:\n${script}`).join('\n\n')}`
      : "";

    const prompt = `
Give me a list of 50 viral video scripts powerful topics (topics only), after you analyze their hook, message, and the way they keep viewers watching until the end.

The topic is: ${context}

The example scripts are only for direction and learning — the scripts you create should be unique.
${exampleScriptsText}

Create 50 powerful, viral-worthy video topics that:
1. Have strong hooks that grab attention immediately
2. Promise value or solve problems for the target audience
3. Are optimized for short-form content (20-30 seconds)
4. Encourage engagement and sharing
5. Align with the main subject and desired CTA
6. Are written in the SAME LANGUAGE as the user's main subject, context, and CTA

Each topic should be a compelling title that would make someone stop scrolling and watch the video. Focus on topics that have viral potential in the ${mainSubject} niche.

IMPORTANT: Generate all topics in the exact same language as the user's inputs. Do not translate or change the language.

Return exactly 50 topics as an array.
`;

    const result = await generateObject({
      model: google("gemini-2.0-flash-001"),
      schema: topicsSchema,
      prompt: prompt,
    });

    return NextResponse.json({
      topics: result.object.topics,
      success: true
    });

  } catch (error) {
    console.error("Error generating topics:", error);
    return NextResponse.json(
      { error: "Failed to generate topics" },
      { status: 500 }
    );
  }
}