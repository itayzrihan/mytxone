import { generateObject } from "ai";
import { z } from "zod";
import { google } from "@ai-sdk/google";
import { experimental_wrapLanguageModel as wrapLanguageModel } from "ai";

import { customMiddleware } from "./custom-middleware";
import { VIDEO_HOOKS, MAIN_CONTENT_TYPES, VIDEO_MOTIFS, type Hook, type ContentType, type CustomHook, type CustomContentType, type Motif } from "@/lib/video-script-constants";
import { getScriptById } from "@/db/queries";

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
  motif,
  strongReferenceId,
  userId,
  customHooks = [],
  customContentTypes = [],
}: {
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

    // Get motif details if specified
    const selectedMotif = motif ? VIDEO_MOTIFS.find(m => m.value === motif) : null;

    // Get strong reference script if specified
    let strongReferenceScript = null;
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

    const { object: videoScript } = await generateObject({
      model: geminiProModel,
      prompt: `You are the world's best viral video script writer. 

CRITICAL INSTRUCTION: Before generating ANY content, you MUST first analyze and understand ALL the requirements below. Take time to process the hook structure, content type structure, motif, and reference material. Only after fully understanding all requirements should you begin writing the script.

SPECIFICATIONS:
- Title: ${title}
- Description: ${description}
- Language: ${language}
- Hook Type: ${hookType}
- Content Type: ${contentType}

HOOK STRUCTURE REQUIREMENTS (MUST FOLLOW EXACTLY):
${selectedHook ? `
Hook: ${'name' in selectedHook ? selectedHook.name : selectedHook.label}
Description: ${selectedHook.description}
Example: ${selectedHook.example}
MANDATORY STRUCTURE: ${selectedHook.structure}

IMPORTANT: You MUST follow this exact structure format. If it's "Immediate Storytelling", start IMMEDIATELY with the character/situation described in the structure pattern.
` : `Hook Type: ${hookType} - Use this style for opening`}

CONTENT TYPE STRUCTURE REQUIREMENTS (MUST FOLLOW EXACTLY):
${selectedContentType ? `
Content Type: ${selectedContentType.label}
Description: ${selectedContentType.description}
Example: ${selectedContentType.example}
MANDATORY STRUCTURE: ${selectedContentType.structure}

IMPORTANT: You MUST incorporate this content structure into your script. If it's "Animal Analogy", you MUST use an actual animal as the main metaphor throughout the content.
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
- Read and understand the hook structure pattern completely
- Read and understand the content type structure pattern completely
- Identify how to combine both structures seamlessly
- If using animal analogy, choose the appropriate animal for the topic
- Plan how the immediate storytelling will incorporate the animal analogy

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
- Plan the opening following the EXACT hook structure format
- Plan the middle content following the EXACT content type structure format
- Plan the closing with a strong call-to-action
- Ensure the animal (if animal analogy) is the MAIN character throughout

STEP 3: GENERATE THE SCRIPT
Write ONE complete, flowing video script in ${language} that:

1. OPENS with the EXACT "${hookType}" hook structure pattern (no deviations)
2. DEVELOPS using the EXACT "${contentType}" structure pattern (no deviations)
3. ENDS with a powerful call-to-action that drives engagement

MANDATORY REQUIREMENTS:
- Follow the EXACT hook structure word-for-word pattern provided above
- Follow the EXACT content type structure word-for-word pattern provided above  
- If it's "Immediate Storytelling" + "Animal Analogy": Start IMMEDIATELY with the animal, not a human character
- Make it EXTREMELY engaging and addictive from the first word
- Write in natural, conversational ${language} (use ניקוד for Hebrew if needed)
- Target exactly ${scriptLength} seconds when spoken
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