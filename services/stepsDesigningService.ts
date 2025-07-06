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
  userTimezone?: string; // User's timezone for date/time calculations
}

// Interface for the service output
export interface StepsDesigningOutput {
  stream?: ReadableStream;
  success: boolean;
  error?: string;
  shortSummary?: string; // Short summary for user streaming
  steps?: { [key: string]: string }; // Dynamic step fields (step1, step2, etc.) - max 25 steps
  totalSteps?: number; // Total number of steps for operator to report to user
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
2. INDIVIDUAL STEPS (maximum 25 steps) that will be passed to the operator

Always respond in the user's language (Hebrew, English, Arabic, etc.)

USER'S ORIGINAL REQUEST: "${input.originalMessage}"
ANNA'S INITIAL RESPONSE: "${input.userAnswer}"

Format your response EXACTLY as follows:

SHORT_SUMMARY_START
[Write a brief, friendly 2-3 sentence summary in the user's language explaining that you've created a detailed plan and are passing it to the operator]
SHORT_SUMMARY_END

STEPS_START
STEP_1: [First step description]
STEP_2: [Second step description]
STEP_3: [Third step description]
... (continue with STEP_4, STEP_5, etc. up to maximum 25 steps)
STEPS_END

Example format:
SHORT_SUMMARY_START
יצרתי תוכנית מפורטת למציאת ומחיקת כל המשימות הקשורות לעבודה. התוכנית מועברת עכשיו לסוכן האופרטור לביצוע.
SHORT_SUMMARY_END

STEPS_START
STEP_1: חיפוש משימות עבודה - חפש במערכת את כל המשימות המכילות את המילה "עבודה"
STEP_2: הצגת רשימה - הצג למשתמש את כל המשימות שנמצאו לאישור
STEP_3: אישור מחיקה - קבל אישור מפורש מהמשתמש למחיקת המשימות
STEP_4: ביצוע מחיקה - מחק את כל המשימות המאושרות מהמערכת
STEP_5: אימות תוצאה - ודא שהמחיקה בוצעה בהצלחה והצג הודעת אישור
STEPS_END`,
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

    // 6. Parse the response to extract short summary and individual steps
    let shortSummary = '';
    const steps: { [key: string]: string } = {};
    let totalSteps = 0;

    const shortSummaryMatch = fullContent.match(/SHORT_SUMMARY_START\s*([\s\S]*?)\s*SHORT_SUMMARY_END/);
    const stepsMatch = fullContent.match(/STEPS_START\s*([\s\S]*?)\s*STEPS_END/);

    if (shortSummaryMatch) {
      shortSummary = shortSummaryMatch[1].trim();
    }

    if (stepsMatch) {
      const stepsContent = stepsMatch[1].trim();
      const stepLines = stepsContent.split('\n').filter(line => line.trim().startsWith('STEP_'));
      
      for (const line of stepLines) {
        const stepMatch = line.match(/STEP_(\d+):\s*(.*)/);
        if (stepMatch && totalSteps < 25) { // Limit to 25 steps
          const stepNumber = stepMatch[1];
          const stepContent = stepMatch[2].trim();
          steps[`step${stepNumber}`] = stepContent;
          totalSteps++;
        }
      }
    }

    // Fallback: if parsing fails, create a single step with the full content
    if (!shortSummary && Object.keys(steps).length === 0) {
      console.log('[StepsDesigning Service] Parsing failed, using fallback approach');
      if (fullContent.length > 200) {
        shortSummary = fullContent.substring(0, 200) + '...';
        steps.step1 = fullContent;
        totalSteps = 1;
      } else {
        shortSummary = fullContent;
        steps.step1 = fullContent;
        totalSteps = 1;
      }
    } else if (!shortSummary) {
      // Create summary from first step if available
      const firstStep = Object.values(steps)[0];
      shortSummary = firstStep ? (firstStep.substring(0, 200) + (firstStep.length > 200 ? '...' : '')) : 'Plan created successfully';
    } else if (Object.keys(steps).length === 0) {
      // Create a single step from summary if no steps found
      steps.step1 = shortSummary;
      totalSteps = 1;
    }

    console.log('[StepsDesigning Service] Parsed content:', {
      shortSummaryLength: shortSummary.length,
      totalSteps: totalSteps,
      stepKeys: Object.keys(steps)
    });

    return {
      success: true,
      shortSummary: shortSummary,
      steps: steps,
      totalSteps: totalSteps
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
