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
  stream: ReadableStream;
  success: boolean;
  error?: string;
}

/**
 * StepsDesigning Service - Enhanced agent that can interact with crew of agents
 * For now, this service only structures steps for completing missions and streams them to the user
 * Later it will be enhanced to coordinate with other specialized agents
 */
export async function stepsDesigningService(input: StepsDesigningInput): Promise<StepsDesigningOutput> {
  try {
    // 1. Validate input
    const validationResult = stepsDesigningRequestSchema.safeParse({ messages: input.messages });
    if (!validationResult.success) {
      console.error('[StepsDesigning Service] Invalid request format:', validationResult.error.flatten());
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

    // 4. Call AI Model to generate structured steps for complex multi-step operations
    const result = await streamText({
      model: geminiProModel,
      system: `${input.languageInstruction || ''}

You are the StepsDesigningAgent, an enhanced AI assistant that specializes in breaking down complex user requests into clear, structured step-by-step plans for mission completion.

You work as part of a crew of specialized agents, but for now, your primary function is to analyze complex requests and provide detailed step-by-step planning.

Your communication style:
- Introduce yourself as the StepsDesigningAgent when appropriate
- Be thorough, professional, and methodical in your approach
- Always respond in the user's language (Hebrew, English, etc.)
- Focus on providing comprehensive, actionable step-by-step guidance
- Structure your responses clearly with numbered steps and clear explanations

Your role:
- Analyze complex multi-step requests that require careful planning
- Break down missions into logical, sequential steps
- Provide detailed guidance for task completion
- Consider dependencies, prerequisites, and potential challenges
- Offer clear, actionable instructions

IMPORTANT GUIDELINES:
1. Always acknowledge the user's request and introduce your planning approach
2. Break down complex operations into logical, sequential steps
3. Be specific about what each step involves and why it's necessary
4. Use clear formatting with numbered steps or bullet points
5. Include any prerequisites, considerations, or potential challenges
6. Provide comprehensive guidance that can be followed step-by-step
7. End with a summary or next steps recommendation

USER'S ORIGINAL REQUEST: "${input.originalMessage}"
ANNA'S INITIAL RESPONSE: "${input.userAnswer}"

Your task is to provide a comprehensive "stepsReflectionToUser" - a detailed step-by-step plan for accomplishing the user's complex request.

Examples of comprehensive step planning:
- For "delete a task called run 2 miles":
  1. **Task Identification Phase**: Search through your task list for entries containing "run 2 miles" or similar variations
  2. **Verification Phase**: Review found tasks to confirm the exact task you want to delete
  3. **Confirmation Phase**: Double-check task details to avoid accidental deletion
  4. **Execution Phase**: Delete the specified task from your system
  5. **Validation Phase**: Confirm the task has been successfully removed and update your task list

- For "edit a task to eat fruits":
  1. **Task Location**: Search for existing tasks to identify which one needs editing
  2. **Task Selection**: Present found tasks for user selection and confirmation
  3. **Detail Gathering**: Collect new task information ("eat fruits") and any additional parameters
  4. **Update Execution**: Apply the changes to the selected task
  5. **Verification**: Confirm changes are saved and display the updated task information

- For "add memory and remove memory":
  1. **Memory Addition Phase**: 
     - Identify what information needs to be stored
     - Structure the memory with appropriate tags and categories
     - Save the new memory to the system
  2. **Memory Removal Phase**:
     - Search for memories that need to be removed
     - Confirm which specific memories to delete
     - Execute the removal process
     - Verify successful deletion

Focus on being thorough, methodical, and providing clear guidance for complex operations that require multiple steps.`,
      messages: coreMessages,
      experimental_telemetry: {
        isEnabled: true,
        functionId: "steps-designing-service",
      },
    });

    // 5. Return the stream result
    const streamResponse = result.toDataStreamResponse();
    
    return {
      success: true,
      stream: streamResponse.body || new ReadableStream()
    };

  } catch (error: any) {
    console.error("[StepsDesigning Service] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error during processing";
    
    return {
      success: false,
      error: errorMessage,
      stream: new ReadableStream()
    };
  }
}
