import { convertToCoreMessages, Message, streamText } from "ai";
import { z } from 'zod';
import { geminiProModel } from "@/ai";

// Input validation schema
const mytxAgentRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).min(1, "Messages array cannot be empty"),
});

// Interface for the service input
export interface MytxAgentInput {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  uid: string; // User ID for authentication context
  userAnswer: string; // Anna's initial response to show user
  originalMessage: string; // User's original request
}

// Interface for the service output
export interface MytxAgentOutput {
  stream: ReadableStream;
  success: boolean;
  error?: string;
}

/**
 * MytxAgent Service - Handles complex multi-step tasks by structuring steps
 * This service analyzes complex requests and provides structured step-by-step plans
 */
export async function mytxAgentService(input: MytxAgentInput): Promise<MytxAgentOutput> {
  try {
    // 1. Validate input
    const validationResult = mytxAgentRequestSchema.safeParse({ messages: input.messages });
    if (!validationResult.success) {
      console.error('[MytxAgent Service] Invalid request format:', validationResult.error.flatten());
      return {
        success: false,
        error: 'Invalid request format',
        stream: new ReadableStream()
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

    // 4. Call AI Model to generate structured steps
    const result = await streamText({
      model: geminiProModel,
      system: `You are MytxAgent, an enhanced AI assistant that specializes in breaking down complex user requests into clear, structured step-by-step plans.
Always respond in the user's language and focus on providing comprehensive planning rather than executing actions.

Your role:
- Analyze complex multi-step requests from users
- Create detailed, actionable step-by-step plans
- Structure the response in a clear, easy-to-follow format
- Focus on providing comprehensive planning rather than executing actions

IMPORTANT GUIDELINES:
1. Always start your response by acknowledging the user's request
2. Break down the task into logical, sequential steps
3. Be specific about what each step involves
4. Use clear formatting with numbered steps
5. Include any prerequisites or considerations
6. End with a summary or next steps

USER'S ORIGINAL REQUEST: "${input.originalMessage}"
ANNA'S INITIAL RESPONSE: "${input.userAnswer}"

Your task is to provide a detailed step-by-step plan for accomplishing the user's request. Structure your response as "stepsReflectionToUser" - a comprehensive plan that the user can follow or that can guide further automation.

Examples of good step structures:
- For "delete task called run 2 miles": 
  1. Search for tasks containing "run 2 miles"
  2. Identify the correct task from search results
  3. Confirm task details with user
  4. Delete the specified task
  5. Confirm successful deletion

- For "edit task to eat fruits":
  1. Search for existing tasks to identify which one to edit
  2. Present found tasks to user for selection
  3. Gather new task details ("eat fruits")
  4. Update the selected task with new information
  5. Confirm changes and show updated task

Focus on being thorough and helpful in your planning.`,
      messages: coreMessages,
      experimental_telemetry: {
        isEnabled: true,
        functionId: "mytx-agent-service",
      },
    });

    // 5. Return the stream result
    const streamResponse = result.toDataStreamResponse();
    
    return {
      success: true,
      stream: streamResponse.body || new ReadableStream()
    };

  } catch (error: any) {
    console.error("[MytxAgent Service] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error during processing";
    
    return {
      success: false,
      error: errorMessage,
      stream: new ReadableStream()
    };
  }
}
