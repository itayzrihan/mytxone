import { convertToCoreMessages, Message, streamText } from "ai";
import { z } from 'zod';
import { geminiProModel } from "@/ai";

// Input validation schema
const stepsDesigningRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).min(1, "Messages array cannot be empty"),
});

// Interface for the service input
export interface StepsDesigningInput {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  uid: string; // User ID for authentication context
  userAnswer: string; // Anna's initial response to show user
  originalMessage: string; // User's original request
  languageInstruction?: string; // Language instruction for consistent responses
}

// Interface for the service output
export interface StepsDesigningOutput {
  stream?: ReadableStream;
  success: boolean;
  error?: string;
  shortSummary?: string; // Short summary for user streaming
  detailedPlan?: string; // Full detailed plan for operator
}

/**
 * StepsDesigning Service - Enhanced agent that can interact with crew of agents
 * This service creates both a short summary for the user and a detailed plan for the operator
 */
export async function stepsDesigningService(input: StepsDesigningInput): Promise<StepsDesigningOutput> {
  try {
    // 1. Validate input
    const validationResult = stepsDesigningRequestSchema.safeParse({ messages: input.messages });
    if (!validationResult.success) {
      console.error('[StepsDesigning Service] Invalid request format:', validationResult.error.flatten());
      return {
        success: false,
        error: 'Invalid request format'
      };
    }

    // 2. Prepare messages with IDs
    const messages: Message[] = validationResult.data.messages.map((msg, idx) => ({
      ...msg,
      id: `msg-${idx}-${Date.now()}`
    }));

    // 3. Convert to core messages
    const coreMessages = convertToCoreMessages(messages).filter(
      (message) => message.content.length > 0 && (message.role === 'user' || message.role === 'assistant')
    );

    // 4. Call AI Model to generate structured steps for complex multi-step operations
    console.log('[StepsDesigning Service] Calling AI model...');
    const result = await streamText({
      model: geminiProModel,
      system: `${input.languageInstruction || ''}

You are the StepsDesigning Agent, an enhanced AI assistant that specializes in breaking down complex user requests into clear, structured step-by-step plans for mission completion.

Your task is to create BOTH:
1. A SHORT SUMMARY (2-3 sentences) for the user explaining that you've created a plan
2. A DETAILED STEP-BY-STEP PLAN for the operator to execute

Always respond in the user's language (Hebrew, English, Arabic, etc.)

USER'S ORIGINAL REQUEST: "${input.originalMessage}"
ANNA'S INITIAL RESPONSE: "${input.userAnswer}"

Format your response EXACTLY as follows:

SHORT_SUMMARY_START
[Write a brief, friendly 2-3 sentence summary in the user's language explaining that you've created a detailed plan and are passing it to the operator]
SHORT_SUMMARY_END

DETAILED_PLAN_START
[Write a comprehensive, detailed step-by-step plan with numbered steps, explanations, prerequisites, considerations, and potential challenges. Be thorough and methodical.]
DETAILED_PLAN_END

Example format:
SHORT_SUMMARY_START
יצרתי תוכנית מפורטת למציאת ומחיקת כל המשימות הקשורות לעבודה. התוכנית מועברת עכשיו לסוכן האופרטור לביצוע.
SHORT_SUMMARY_END

DETAILED_PLAN_START
1. **חיפוש משימות עבודה**: חפש במערכת את כל המשימות המכילות את המילה "עבודה"
2. **הצגת רשימה**: הצג למשתמש את כל המשימות שנמצאו לאישור
3. **אישור מחיקה**: קבל אישור מפורש מהמשתמש למחיקת המשימות
4. **ביצוע מחיקה**: מחק את כל המשימות המאושרות מהמערכת
5. **אימות תוצאה**: ודא שהמחיקה בוצעה בהצלחה והצג הודעת אישור
DETAILED_PLAN_END`,
      messages: coreMessages,
      experimental_telemetry: {
        isEnabled: true,
        functionId: "steps-designing-service",
      },
    });

    // 5. Get the complete response and parse it
    console.log('[StepsDesigning Service] Getting response...');
    const streamResponse = result.toDataStreamResponse();
    const reader = streamResponse.body?.getReader();
    let fullContent = '';
    
    if (reader) {
      const decoder = new TextDecoder();
      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.trim() === '') continue;
          
          if (line.startsWith('0:')) {
            try {
              const textPart = JSON.parse(line.substring(2));
              if (typeof textPart === 'string') {
                fullContent += textPart;
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }
    }

    console.log('[StepsDesigning Service] Full content received, length:', fullContent.length);

    // 6. Parse the response to extract short summary and detailed plan
    let shortSummary = '';
    let detailedPlan = '';

    const shortSummaryMatch = fullContent.match(/SHORT_SUMMARY_START\s*([\s\S]*?)\s*SHORT_SUMMARY_END/);
    const detailedPlanMatch = fullContent.match(/DETAILED_PLAN_START\s*([\s\S]*?)\s*DETAILED_PLAN_END/);

    if (shortSummaryMatch) {
      shortSummary = shortSummaryMatch[1].trim();
    }

    if (detailedPlanMatch) {
      detailedPlan = detailedPlanMatch[1].trim();
    }

    // Fallback: if parsing fails, use the full content
    if (!shortSummary && !detailedPlan) {
      console.log('[StepsDesigning Service] Parsing failed, using fallback approach');
      if (fullContent.length > 200) {
        shortSummary = fullContent.substring(0, 200) + '...';
        detailedPlan = fullContent;
      } else {
        shortSummary = fullContent;
        detailedPlan = fullContent;
      }
    } else if (!shortSummary) {
      shortSummary = detailedPlan.substring(0, 200) + (detailedPlan.length > 200 ? '...' : '');
    } else if (!detailedPlan) {
      detailedPlan = shortSummary;
    }

    console.log('[StepsDesigning Service] Parsed content:', {
      shortSummaryLength: shortSummary.length,
      detailedPlanLength: detailedPlan.length
    });

    return {
      success: true,
      shortSummary: shortSummary,
      detailedPlan: detailedPlan
    };

  } catch (error: any) {
    console.error("[StepsDesigning Service] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error during processing";
    
    return {
      success: false,
      error: errorMessage
    };
  }
}
