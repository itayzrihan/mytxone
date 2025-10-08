import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(request: NextRequest) {
  try {
    const { topic, mainSubject, tellMeMore, desiredCTA, exampleScripts } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
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
Create a detailed viral video script for this topic: "${topic}"

Context: ${context}
${exampleScriptsText}

IMPORTANT INSTRUCTIONS:
- Return ONLY the script content in plain text
- NO explanations, analysis, or additional commentary
- NO formatting instructions or visual descriptions
- NO "Key Improvements" or rationale sections
- Just the pure script text that will be read/performed
- Write the script in the SAME LANGUAGE as the user's topic, context, and CTA
- Maintain the exact language and tone of the user's inputs

SCRIPT STRUCTURE REQUIREMENTS:
Create a comprehensive script with these sections:
1. HOOK (0-3 seconds): Powerful opening that grabs attention
2. PROBLEM/INTRIGUE (3-8 seconds): Present the problem or create curiosity
3. SOLUTION/VALUE (8-20 seconds): Provide value, tips, or demonstrate the solution
4. PROOF/EXAMPLE (20-25 seconds): Give examples or social proof
5. CALL TO ACTION (25-30 seconds): Clear CTA that matches: ${desiredCTA}

The script should be:
- 20-30 seconds long (approximately 80-120 words for spoken content)
- Have a powerful hook in first 3 seconds
- Include clear value proposition
- Include engaging middle section with examples or demonstrations
- Build tension and keep viewers watching
- End with this call-to-action: ${desiredCTA}
- Be optimized for viral short-form content
- Match the language of the user's inputs exactly
- Be detailed enough to fill 20-30 seconds of spoken content

Make sure the script is comprehensive and detailed enough for a full 20-30 second video.

Return only the script text, nothing else.
`;

    const result = await streamText({
      model: google("gemini-2.0-flash-001"),
      prompt: prompt,
      maxTokens: 500,
      temperature: 0.7,
    });

    return new Response(result.toAIStream(), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error("Error generating script:", error);
    return NextResponse.json(
      { error: "Failed to generate script" },
      { status: 500 }
    );
  }
}