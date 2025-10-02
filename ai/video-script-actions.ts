import { generateObject } from "ai";
import { z } from "zod";
import { google } from "@ai-sdk/google";
import { experimental_wrapLanguageModel as wrapLanguageModel } from "ai";

import { customMiddleware } from "./custom-middleware";
import { VIDEO_HOOKS, MAIN_CONTENT_TYPES, VIDEO_MOTIFS, type CustomHook, type CustomContentType } from "@/lib/video-script-constants";
import { getScriptById } from "@/db/queries";

// Create a local instance of the model to avoid import dependency issues
export const videoScriptModel = wrapLanguageModel({
  model: google("gemini-2.5-pro"),
  middleware: customMiddleware,
});

type VideoScriptGenerationMode = "object" | "stream";

export interface VideoScriptGenerationParams {
  title: string;
  description: string;
  language: string;
  hookType: string;
  contentType: string;
  scriptLength: string;
  motif?: string;
  strongReferenceId?: string;
  userId?: string;
  customHooks?: CustomHook[];
  customContentTypes?: CustomContentType[];
}

async function buildVideoScriptPrompt(
  {
    title,
    description,
    language,
    hookType,
    contentType,
    scriptLength,
    motif,
    strongReferenceId,
    userId,
    customHooks = [],
    customContentTypes = [],
  }: VideoScriptGenerationParams,
  mode: VideoScriptGenerationMode,
) {
  // Get detailed information about the selected hook and content type (built-in or custom)
  const selectedHook = VIDEO_HOOKS.find((hook) => hook.id === hookType) ||
    customHooks.find((hook) => hook.value === hookType);
  const selectedContentType = MAIN_CONTENT_TYPES.find((ct) => ct.value === contentType) ||
    customContentTypes.find((ct) => ct.value === contentType);

  // Get motif details if specified
  const selectedMotif = motif ? VIDEO_MOTIFS.find((m) => m.value === motif) : null;

  // Get strong reference script if specified
  let strongReferenceScript: Awaited<ReturnType<typeof getScriptById>> | null = null;
  if (strongReferenceId && userId) {
    try {
      strongReferenceScript = await getScriptById(strongReferenceId);
      // Verify the script belongs to the user for security
      if (strongReferenceScript && strongReferenceScript.userId !== userId) {
        strongReferenceScript = null;
      }
    } catch (error) {
      console.error("Error fetching strong reference script:", error);
    }
  }

  const outputInstruction =
    mode === "object"
      ? `Write ONLY the script content - no formatting, no sections, no labels. Just the pure, powerful script that someone would speak directly to camera. Keep it engaging but within exactly ${scriptLength} seconds.`
      : `OUTPUT FORMAT (FOLLOW EXACTLY):
SCRIPT_START
[Write the complete script content that satisfies all requirements above]
SCRIPT_END
SUGGESTED_TITLE: [Provide the optimized viral title in ${language}]

IMPORTANT OUTPUT RULES:
- Do not include any text before SCRIPT_START or after the SUGGESTED_TITLE line.
- The script between SCRIPT_START and SCRIPT_END must strictly follow every instruction above and maintain a natural, spoken flow within ${scriptLength} seconds.
- The suggested title must be concise, emotionally compelling, and tailored for virality in ${language}.
- Never add additional commentary, labels, or metadata beyond this format.`;

  const prompt = `You are the world's best viral video script writer. 

CRITICAL INSTRUCTION: Before generating ANY content, you MUST first analyze and understand ALL the requirements below. Take time to process the hook structure, content type structure, motif, and reference material. Only after fully understanding all requirements should you begin writing the script.

SPECIFICATIONS:
- Title: ${title}
- Description: ${description}
- Language: ${language}
- Hook Type: ${hookType}
- Content Type: ${contentType}

HOOK STRUCTURE REQUIREMENTS (USE AS FOUNDATION):
${selectedHook ? `
Hook: ${"name" in selectedHook ? selectedHook.name : selectedHook.label}
Description: ${selectedHook.description}
Example: ${selectedHook.example}
STRUCTURE FOUNDATION: ${selectedHook.structure}

IMPORTANT: Use this structure as your STARTING FOUNDATION. You may adapt the exact wording and flow to create a seamless transition into your main content. The goal is natural flow, not rigid adherence.
` : `Hook Type: ${hookType} - Use this style for opening`}

CONTENT TYPE STRUCTURE REQUIREMENTS (USE AS GUIDE):
${selectedContentType ? `
Content Type: ${selectedContentType.label}
Description: ${selectedContentType.description}
Example: ${selectedContentType.example}
STRUCTURE GUIDE: ${selectedContentType.structure}

IMPORTANT: Use this structure as your CONTENT GUIDE. Adapt and modify the format to naturally continue from your hook bridge. If it's "Animal Analogy", you MUST use an actual animal as the main metaphor, but the exact structure can flow organically from your hook.
` : `Content Type: ${contentType} - Follow this format for main content`}

${selectedMotif ? `
MOTIF/EMOTIONAL TONE:
${selectedMotif.label} (${selectedMotif.category})
Description: ${selectedMotif.description}
Tone Instructions: Make sure the entire script embodies this emotional tone. Every word, sentence, and transition should reflect this ${selectedMotif.label.toLowerCase()} feeling. The audience should feel ${selectedMotif.description.toLowerCase()} throughout the entire experience.
` : ''}

${strongReferenceScript ? `
STRONG REFERENCE FOR WINNING CONTENT:
Here is a strong reference for winning content that we want to ensure the new script feels similar to. This is NOT a strict guide to copy, but a great reference for powerful structure, techniques, and influencing elements that we want our new script to embody with similar powerful elements:

Reference Title: "${strongReferenceScript.title}"
Reference Hook Style: ${strongReferenceScript.hookType}
Reference Content Type: ${strongReferenceScript.mainContentType}
Reference Content: "${strongReferenceScript.content.substring(0, 1000)}${strongReferenceScript.content.length > 1000 ? '...' : ''}"

REFERENCE ANALYSIS INSTRUCTIONS: Analyze the reference script's:
- Powerful opening techniques and emotional hooks
- Persuasive language patterns and psychological triggers
- Engagement techniques and audience connection methods
- Structure flow and transition techniques
- Call-to-action effectiveness and urgency creation
- Overall viral potential factors

Use these insights to create a new script that captures similar powerful elements while being completely original and tailored to the new topic and requirements.
` : ''}

STEP-BY-STEP GENERATION PROCESS:

STEP 1: ANALYZE ALL REQUIREMENTS
- Read and understand the hook structure pattern as a foundation to build upon
- Read and understand the content type structure pattern as a guide to inform your content
- Identify the LINKING EDGE opportunities between hook and content for seamless combination
- If using animal analogy, choose the appropriate animal for the topic
- Plan how to create ONE UNIFIED FLOW that feels natural and conversational throughout

SPECIAL COMBINATION RULES:
${hookType === 'immediate-storytelling' && contentType === 'animal-analogy' ? `
🚨 CRITICAL: You are combining "Immediate Storytelling" + "Animal Analogy"
- The script MUST start IMMEDIATELY with the ANIMAL as the main character
- DO NOT start with a human name like "דני" or "שרה"  
- Start with the animal name and situation: "[Animal name] was [in situation]..."
- Example: "הבונה היה עומד ליד הנהר הגועש..." NOT "דני בהה בערימת מכתבים..."
- The entire analogy must be told through the animal's perspective first, then connected to humans
` : ''}

${contentType === 'animal-analogy' ? `
🚨 ANIMAL ANALOGY REQUIREMENT:
- You MUST use a real animal as the central metaphor character
- The animal should be relevant to the topic (beaver for building/construction, lion for leadership, ant for hard work, etc.)
- Tell the story FROM the animal's perspective first, then draw parallels to human behavior
- Do NOT use human characters as the main story - the ANIMAL is the protagonist
` : ''}

STEP 2: STRUCTURE PLANNING
- Plan the opening using the hook structure as your foundation
- Plan the middle content using the content type structure as your guide
- Plan the closing with a strong call-to-action
- Ensure the animal (if animal analogy) is the MAIN character throughout

STEP 2.5: SEAMLESS LINKING STRATEGY
🔗 CRITICAL: Find a LINKING EDGE between hook and main content for seamless flow:
- Identify the EMOTIONAL or THEMATIC bridge that connects your hook ending to your main content beginning
- The structure patterns are RECOMMENDATIONS, not rigid constraints - you can adapt them for better flow
- Create a natural transition sentence/phrase that makes the hook and main content feel like ONE unified story
- Look for shared elements: characters, emotions, situations, metaphors, or concepts that can create continuity
- The audience should NOT feel any jarring shift between sections - it should flow like natural conversation
- Examples of linking edges:
  * If hook ends with curiosity → main content starts by addressing that curiosity
  * If hook introduces a character → main content continues with that same character's journey
  * If hook poses a question → main content begins answering while building on the emotional state
  * If hook creates tension → main content maintains and resolves that tension organically

STEP 3: GENERATE THE SCRIPT
Write ONE complete, flowing video script in ${language} that:

1. OPENS with the "${hookType}" hook structure (use as foundation, adapt for flow)
2. CREATES A SEAMLESS BRIDGE using your identified linking edge
3. DEVELOPS using the "${contentType}" structure (use as guide, adapt for natural continuation)
4. ENDS with a powerful call-to-action that drives engagement

MANDATORY REQUIREMENTS:
- Use the hook structure as a FOUNDATION - adapt it as needed for seamless flow into main content
- Use the content type structure as a GUIDE - modify it to naturally continue from your hook bridge
- PRIORITIZE SEAMLESS FLOW over rigid structure adherence - the script should feel like one unified piece
- If it's "Immediate Storytelling" + "Animal Analogy": Start IMMEDIATELY with the animal, not a human character
- Make it EXTREMELY engaging and addictive from the first word
- Write in natural, conversational ${language} (use ניקוד for Hebrew if needed)
- Target exactly ${scriptLength} seconds when spoken
- Include specific details and actionable insights but keep it concise
- Build strong emotional connection and anticipation quickly
- Use psychological triggers that make content go viral
- Make every word count - be impactful but stay within ${scriptLength} seconds
- End with compelling reason to engage (like, comment, share, follow)
- Keep the flow natural and conversational throughout - NO jarring transitions between sections

${outputInstruction}`;

  return {
    prompt,
  };
}

export async function buildStreamingVideoScriptPrompt(params: VideoScriptGenerationParams) {
  const { prompt } = await buildVideoScriptPrompt(params, "stream");
  return prompt;
}

export async function generateVideoScriptAction(params: VideoScriptGenerationParams) {
  const {
    title,
    description,
    language,
    hookType,
    contentType,
    scriptLength,
    motif,
    strongReferenceId,
    userId,
    customHooks = [],
    customContentTypes = [],
  } = params;

  console.log(`Action: Generating viral video script for: ${title}`);
  
  try {
    console.log("Starting AI generation with parameters:", {
      title,
      description,
      language,
      hookType,
      contentType
    });
    const { prompt } = await buildVideoScriptPrompt(
      {
        title,
        description,
        language,
        hookType,
        contentType,
        scriptLength,
        motif,
        strongReferenceId,
        userId,
        customHooks,
        customContentTypes,
      },
      "object",
    );

    const { object: videoScript } = await generateObject({
      model: videoScriptModel,
      prompt,
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