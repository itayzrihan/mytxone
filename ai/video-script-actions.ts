import { generateObject } from "ai";
import { z } from "zod";
import { google } from "@ai-sdk/google";
import { experimental_wrapLanguageModel as wrapLanguageModel } from "ai";

import { customMiddleware } from "./custom-middleware";
import { VIDEO_HOOKS, MAIN_CONTENT_TYPES, type Hook, type ContentType, type CustomHook, type CustomContentType } from "@/lib/video-script-constants";

// Create a local instance of the model to avoid import dependency issues
const geminiProModel = wrapLanguageModel({
  model: google("gemini-2.5-pro"),
  middleware: customMiddleware,
});

export async function generateVideoScriptAction({
  title,
  description,
  language,
  hookType,
  contentType,
  scriptLength,
  customHooks = [],
  customContentTypes = [],
}: {
  title: string;
  description: string;
  language: string;
  hookType: string;
  contentType: string;
  scriptLength: string;
  customHooks?: CustomHook[];
  customContentTypes?: CustomContentType[];
}) {
  console.log(`Action: Generating viral video script for: ${title}`);
  
  try {
    console.log("Starting AI generation with parameters:", {
      title,
      description,
      language,
      hookType,
      contentType
    });

    // Get detailed information about the selected hook and content type (built-in or custom)
    const selectedHook = VIDEO_HOOKS.find(hook => hook.id === hookType) || 
                         customHooks.find(hook => hook.value === hookType);
    const selectedContentType = MAIN_CONTENT_TYPES.find(ct => ct.value === contentType) ||
                                customContentTypes.find(ct => ct.value === contentType);

    const { object: videoScript } = await generateObject({
      model: geminiProModel,
      prompt: `You are the world's best viral video script writer. Create a single, flowing, powerful video script that will go viral.

SPECIFICATIONS:
- Title: ${title}
- Description: ${description}
- Language: ${language}
- Hook Type: ${hookType}
- Content Type: ${contentType}

HOOK DETAILS:
${selectedHook ? `
Hook: ${'name' in selectedHook ? selectedHook.name : selectedHook.label}
Description: ${selectedHook.description}
Example: ${selectedHook.example}
Structure: ${selectedHook.structure}
` : `Hook Type: ${hookType} - Use this style for opening`}

CONTENT TYPE DETAILS:
${selectedContentType ? `
Content Type: ${selectedContentType.label}
Description: ${selectedContentType.description}
Example: ${selectedContentType.example}
Structure: ${selectedContentType.structure}
` : `Content Type: ${contentType} - Follow this format for main content`}

INSTRUCTIONS:
Write ONE complete, flowing video script in ${language} that:

1. OPENS with the specific "${hookType}" hook style following its exact structure and approach
2. DEVELOPS the main content using the "${contentType}" format and structure 
3. ENDS with a powerful call-to-action that drives engagement

CRITICAL REQUIREMENTS:
- Make it EXTREMELY engaging and addictive from the first word
- Write in natural, conversational ${language} (use ניקוד for Hebrew if needed)
- Target exactly ${scriptLength} seconds when spoken
- Use the EXACT hook structure provided above
- Follow the EXACT content type structure provided above
- Include specific details and actionable insights but keep it concise
- Build strong emotional connection and anticipation quickly
- Use psychological triggers that make content go viral
- Make every word count - be impactful but stay within ${scriptLength} seconds
- End with compelling reason to engage (like, comment, share, follow)
- Keep the flow natural and conversational

Write ONLY the script content - no formatting, no sections, no labels. Just the pure, powerful script that someone would speak directly to camera. Keep it engaging but within exactly ${scriptLength} seconds.`,
      schema: z.object({
        script: z.string().describe("The complete, flowing video script ready to be spoken"),
        suggestedTitle: z.string().describe("An optimized, viral-worthy title for maximum impact"),
      }),
    });

    console.log("AI generation successful:", videoScript.suggestedTitle);

    return {
      script: videoScript.script,
      suggestedTitle: videoScript.suggestedTitle,
      language,
      hookType,
      contentType,
      status: "generated" as const
    };
  } catch (error) {
    console.error("Error in generateVideoScriptAction:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Unknown error type'
    });
    return { error: "Failed to generate video script." };
  }
}