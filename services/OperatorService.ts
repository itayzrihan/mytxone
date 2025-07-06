import { convertToCoreMessages, Message, streamText } from "ai";
import { z } from 'zod';

import { geminiProModel } from "@/ai"; // Import your configured AI model

// Input validation schema
const operatorRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).min(1, "Messages array cannot be empty"),
});

// Interface for the service input
export interface OperatorInput {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  uid: string; // User ID for authentication context
  userAnswer: string; // Anna's initial response to show user
  originalMessage: string; // User's original request
  stepsContent: string; // The full steps content from StepsDesigning
  languageInstruction?: string; // Language instruction for consistent responses
}

// Interface for the service output
export interface OperatorOutput {
  stream: ReadableStream;
  success: boolean;
  error?: string;
}

/**
 * Operator Service - Handles confirmation and next steps after StepsDesigning
 * This service provides acknowledgment and readiness confirmation for complex multi-step operations
 */
export async function OperatorService(input: OperatorInput): Promise<OperatorOutput> {
  try {
    // 1. Validate input
    const validationResult = operatorRequestSchema.safeParse({ messages: input.messages });
    if (!validationResult.success) {
      console.error('[Operator Service] Invalid request format:', validationResult.error.flatten());
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

    // 4. Input length check
    const totalContentLength = coreMessages.reduce((sum, msg) => sum + (typeof msg.content === 'string' ? msg.content.length : 0), 0);
    const MAX_INPUT_LENGTH = 15000;
    if (totalContentLength > MAX_INPUT_LENGTH) {
      console.log(`[Operator Service] Input length exceeded for user: ${input.uid}. Length: ${totalContentLength}`);
      return {
        success: false,
        error: `Input exceeds the maximum length of ${MAX_INPUT_LENGTH} characters.`,
        stream: new ReadableStream()
      };
    }

    // 5. Call AI Model with Operator Agent personality
    const result = await streamText({
      model: geminiProModel,
      system: `${input.languageInstruction || ''}

You are Operator Agent, the execution-ready assistant that works with StepsDesigning Agent to complete complex multi-step operations.

Your role:
- Acknowledge receipt of detailed plans from StepsDesigning Agent
- Provide confidence and readiness confirmation to users
- Bridge the gap between planning and execution
- Use encouraging, professional language with subtle enthusiasm

Key responsibilities:
- Confirm you've received the step-by-step plan
- Summarize what the plan covers (without repeating full details)
- Express readiness to proceed when user gives approval
- Use checkmark emojis and professional language
- Keep responses concise but reassuring

Context about this request:
- User's original request: "${input.originalMessage}"
- Anna provided initial response: "${input.userAnswer}"
- StepsDesigning created a detailed plan covering: ${input.stepsContent.length > 500 ? 'comprehensive multi-step guidance' : 'basic step-by-step instructions'}

Your response should:
1. Acknowledge successful plan receipt with ✅
2. Briefly mention what the plan covers (1-2 sentences)
3. Express readiness to proceed
4. Use encouraging tone with rocket emoji 🚀
5. Keep it concise (3-4 lines max)

Example format:
"✅ Steps plan received successfully!

I've got the detailed step-by-step plan from StepsDesigning Agent. The plan includes [brief description] for [what it accomplishes].

Ready to proceed when you give the go-ahead! 🚀"
`,
      messages: coreMessages,
      experimental_telemetry: {
        isEnabled: true,
        functionId: "operator-service",
      },
    });

    // 6. Return the stream result
    const streamResponse = result.toDataStreamResponse();
    
    return {
      success: true,
      stream: streamResponse.body || new ReadableStream()
    };

  } catch (error: any) {
    console.error("[Operator Service] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error during processing";
    
    return {
      success: false,
      error: errorMessage,
      stream: new ReadableStream()
    };
  }
}
