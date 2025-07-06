import { convertToCoreMessages, Message, streamText } from "ai";
import { z } from 'zod';

import { geminiProModel } from "@/ai"; // Import your configured AI model
import {
  addTaskAction,
  listTasksAction,
  updateTaskAction,
  finishTaskAction,
  deleteTaskAction,
  searchTasksAction,
  batchTaskOperationsAction,
  smartTaskFinderAction,
  saveMemoryAction,
  recallMemoriesAction,
  forgetMemoryAction,
  showMeditationTypeSelectorAction,
  showMeditationPromptSelectorAction,
  showMeditationLanguageSelectorAction,
  createMeditationAction,
  listMeditationsAction,
  getMeditationAction,
  deleteMeditationAction,
  generateMeditationContentAction,
} from "@/ai/heybos-actions/heybos-actions";
// Removed flight/payment queries
import { generateUUID } from "@/lib/utils";

// Input validation schema
const chatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).min(1, "Messages array cannot be empty"),
});

// Interface for the service input
export interface CallSingleToolInput {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  uid: string; // User ID for authentication context
  languageInstruction?: string; // Language instruction for consistent responses
}

// Interface for the service output
export interface CallSingleToolOutput {
  stream: ReadableStream;
  success: boolean;
  error?: string;
}

/**
 * Call Single Tool Service - Handles single tool chat functionality without HTTP overhead
 * This service contains all the logic from the /chat endpoint but as a reusable component
 */
export async function callSingleToolService(input: CallSingleToolInput): Promise<CallSingleToolOutput> {
  try {
    // 1. Validate input
    const validationResult = chatRequestSchema.safeParse({ messages: input.messages });
    if (!validationResult.success) {
      console.error('[Call Single Tool Service] Invalid request format:', validationResult.error.flatten());
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
    const MAX_INPUT_LENGTH = 20000;
    if (totalContentLength > MAX_INPUT_LENGTH) {
      console.log(`[Call Single Tool Service] Input length exceeded for user: ${input.uid}. Length: ${totalContentLength}`);
      return {
        success: false,
        error: `Input exceeds the maximum length of ${MAX_INPUT_LENGTH} characters.`,
        stream: new ReadableStream()
      };
    }

    // 5. Call AI Model with Full Tools Support
    const result = await streamText({
      model: geminiProModel,
      system: `${input.languageInstruction || ''}
        
        IMPORTANT: When you see conversation history, only respond to the LATEST user message. 
        Previous messages in the conversation are for context only - do not re-execute old actions or respond to old requests.
        
        - you are also generally helpful and friendly and helping with anything else.
        whenever the user asks if you remember something you should check the memory first. even if the user not explicitly asks you to recall it might be a good idea to try to recall it.
        - you help users book flights, manage their tasks, AND remember information!
        - keep your responses limited to a sentence.
        - DO NOT output lists.
        - IMPORTANT: ALWAYS provide a text response when using tools. Never send just tool calls without accompanying text.
        - after every tool call, always include a brief text message explaining what you're doing or what the result shows.
        - today's date is ${new Date().toLocaleDateString()}.
        - ask follow up questions to nudge user into the optimal flow
        - ask for any details you don't know, like name of passenger, etc.'
        - C and D are aisle seats, A and F are window seats, B and E are middle seats
        - assume the most popular airports for the origin and destination
        - here's the optimal flight booking flow
          - search for flights
          - choose flight
          - select seats
          - create reservation (ask user whether to proceed with payment or change reservation)
          - authorize payment (requires user consent, wait for user to finish payment and let you know when done)
          - display boarding pass (DO NOT display boarding pass without verifying payment)
        - here's the optimal task management flow (enhanced with smart tools):
          - When adding a task, use the workflowManager for complex requests that need confirmation
          - ALWAYS parse the user's request carefully:
            * Extract the main task name/action (keep concise, avoid repetition)
            * Detect task type from keywords (EXACT VALUES: 'onetime', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'):
              - "daily", "every day", "each day", "יומי" → daily
              - "weekly", "every week", "each week", "שבועי" → weekly  
              - "monthly", "every month", "each month", "חודשי" → monthly
              - "quarterly", "every quarter", "רבעוני" → quarterly
              - "yearly", "every year", "annually", "שנתי" → yearly
              - Default or "one time", "once", "חד פעמי" → onetime
            * Detect priority from keywords (EXACT VALUES: 'low', 'medium', 'high'):
              - "urgent", "important", "asap", "critical", "high priority", "גבוהה" → high
              - "later", "whenever", "low priority", "not urgent", "נמוכה" → low
              - Default, "normal", "regular", "בינונית" → medium
            * Parse due dates:
              - "tomorrow", "מחר" → next day
              - "next Friday", "Monday", "יום שני" → specific weekday
              - "June 30th", "30/6", "30 ביוני" → specific date
              - Convert to ISO 8601 format (2025-06-29T10:00:00.000Z)
            * IMPORTANT: Status values are 'pending', 'running', 'paused', 'finished', 'skipped' (Hebrew: ממתין, פועל, מושהה, הושלם, דולג)
          
          - ENHANCED SMART SEARCH AND OPERATIONS:
            * When user references a task by description (e.g., "edit the running task", "finish the exercise task"), use enhancedSearchTasks first
            * For complex operations like "delete all finished tasks" or "add 5 tasks", use workflowManager
            * For bulk operations, use batchTaskOperations with proper confirmation
            * Use smartTaskFinder for advanced filtering and fuzzy matching
            * Always show task details and ask for confirmation before destructive operations
          
          - WORKFLOW EXAMPLES:
            * User: "Change the due date of my running task to tomorrow"
              → enhancedSearchTasks for "running" → show matching tasks → ask for confirmation → updateTask
            * User: "Add tasks for weekly meal prep, daily exercise, and monthly budget review"  
              → workflowManager to plan multi-step addition → ask for confirmation → batchTaskOperations
            * User: "Delete all low priority tasks that are finished"
              → smartTaskFinder with criteria → show matching tasks → ask for confirmation → batchTaskOperations
          
          - After adding tasks, automatically list tasks to show the updated list
          - For task updates, allow editing any field: name, description, type, priority, status, due date
          - Use finishTask to mark tasks as completed
          - Use enhancedSearchTasks when user wants to find specific tasks with smart matching
          - When listing tasks, use appropriate filters (active, finished, all) based on user request        - here's the optimal memory management flow
          - save a memory (e.g., "Remember my favorite color is blue")
          - recall memories (e.g., "What do you remember?", "What is my favorite color?")
          - forget a memory: 
            - If the user asks to forget something specific (e.g., "forget my name", "forget my favorite color"), FIRST use the recallMemories tool internally (don't show the user the full list yet). 
            - Check if the recalled memories contain a SINGLE, clear match for the user's request. 
            - If ONE match is found, ask the user for confirmation: "Are you sure you want me to forget that [memory content]? (ID: [memory ID])". 
            - If the user confirms, THEN use the forgetMemory tool with that specific ID. 
            - If there are multiple matches, no matches, or the user's request was vague (e.g., "forget something"), THEN use the recallMemories tool to show the user the list and ask them to provide the ID for the forgetMemory tool.        - here's the optimal meditation flow
          - when user asks for meditation or you recognize they might need one, ALWAYS use showMeditationTypeSelector tool to show the UI cards
          - DO NOT ask what type of meditation they want - always show the UI selector instead
          - after they select a type (they will tell you which one), use showMeditationPromptSelector tool to show the intention options
          - after they select their prompt/intention, use showMeditationLanguageSelector tool to show Hebrew/English options
          - then proceed with generateMeditationContent based on their choices (type, intention/chat history, and language)
          - IMPORTANT: When generating meditation content, format it with precise timing for TTS playback:
            * Use timestamp format [MM:SS] at the beginning of each line
            * Start with [00:00] for the opening
            * Use larger gaps (30-60 seconds) at the beginning for smooth entry
            * Use smaller gaps (10-20 seconds) for continuing parts to maintain flow
            * Target 12 minutes total duration with the last line at [10:00] (leaving 2 minutes for closing silence)
            * Example format:
              [00:00] Welcome to this peaceful meditation...
              [00:45] Take a deep breath and settle into your space...
              [01:30] Feel your body beginning to relax...
            * This creates perfect pacing for TTS audio meditation experience
        '
      `,
      messages: coreMessages,
      tools: {
        // Removed displayBoardingPass tool
        addTask: {
          description:
            "Add a task for the user. IMPORTANT: Parse the user's request to extract task details properly. Use EXACT enum values only.",
          parameters: z.object({
            taskDescription: z.string().describe("The main description/name of the task. Keep this concise - extract the core task, not all details."),
            taskType: z.enum(['onetime', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly']).optional().describe("Type of task. EXACT VALUES ONLY: 'onetime' (default), 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'. Parse from keywords: daily/יומי, weekly/שבועי, monthly/חודשי, quarterly/רבעוני, yearly/שנתי."),
            priority: z.enum(['low', 'medium', 'high']).optional().describe("Priority level. EXACT VALUES ONLY: 'low', 'medium' (default), 'high'. Parse from keywords: urgent/important/asap→high, later/whenever→low, otherwise→medium."),
            dueDate: z.string().optional().describe("Due date in ISO 8601 format. Parse dates like 'tomorrow', 'next Friday', 'June 30th', etc. Format as '2025-06-29T10:00:00.000Z'."),
          }),
          execute: async ({ taskDescription, taskType, priority, dueDate }) => {
            return await addTaskAction({ taskDescription, taskType, priority, dueDate, userId: input.uid });
          },
        },
        listTasks: {
          description:
            "List tasks for the user with optional filtering and pagination.",
          parameters: z.object({
            filter: z.enum(['active', 'finished', 'all']).optional().describe("Filter tasks by status - defaults to 'active'."),
            limit: z.number().optional().describe("Number of tasks to return - defaults to 20."),
            offset: z.number().optional().describe("Number of tasks to skip - defaults to 0."),
            searchQuery: z.string().optional().describe("Search query to filter tasks by name or description."),
          }),
          execute: async ({ filter, limit, offset, searchQuery }) => {
            return await listTasksAction({ filter, limit, offset, searchQuery, userId: input.uid });
          },
        },
        updateTask: {
          description: "Update an existing task's details. Use the exact enum values for taskType, priority, and status.",
          parameters: z.object({
            taskId: z.string().describe("The ID of the task to update."),
            name: z.string().optional().describe("New name for the task."),
            description: z.string().optional().describe("New description for the task."),
            taskType: z.enum(['onetime', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly']).optional().describe("New task type. EXACT VALUES ONLY: onetime, daily, weekly, monthly, quarterly, yearly."),
            priority: z.enum(['low', 'medium', 'high']).optional().describe("New priority level. EXACT VALUES ONLY: low, medium, high."),
            status: z.enum(['pending', 'running', 'paused', 'finished', 'skipped']).optional().describe("New status. EXACT VALUES ONLY: pending, running, paused, finished, skipped."),
            dueDate: z.string().optional().describe("New due date in ISO 8601 format."),
          }),
          execute: async ({ taskId, name, description, taskType, priority, status, dueDate }) => {
            return await updateTaskAction({ taskId, name, description, taskType, priority, status, dueDate, userId: input.uid });
          },
        },
        finishTask: {
          description: "Mark a specific task as finished.",
          parameters: z.object({
            taskId: z.string().describe("The ID of the task to finish."),
          }),
          execute: async ({ taskId }) => {
            return await finishTaskAction({ taskId, userId: input.uid });
          },
        },
        deleteTask: {
          description: "Delete a specific task.",
          parameters: z.object({
            taskId: z.string().describe("The ID of the task to delete."),
          }),
          execute: async ({ taskId }) => {
            return await deleteTaskAction({ taskId, userId: input.uid });
          },
        },
        searchTasks: {
          description: "Search for tasks by name or description.",
          parameters: z.object({
            query: z.string().describe("Search query to find tasks."),
            limit: z.number().optional().describe("Number of results to return - defaults to 20."),
          }),
          execute: async ({ query, limit }) => {
            return await searchTasksAction({ query, limit, userId: input.uid });
          },
        },
        saveMemory: {
          description:
            "Save a piece of information provided by the user for later recall.",
          parameters: z.object({
            content: z
              .string()
              .describe("The specific piece of information to remember."),
          }),
          execute: async ({ content }) => {
            return await saveMemoryAction({ userId: input.uid, content });
          },
        },
        recallMemories: {
          description:
            "Recall all pieces of information previously saved by the user. Also used internally to find a specific memory before forgetting.",
          parameters: z.object({}),
          execute: async () => {
            return await recallMemoriesAction({ userId: input.uid });
          },
        },
        forgetMemory: {
          description:
            "Forget a specific piece of information previously saved. Requires the memory ID. Usually, you should recall memories first to find the correct ID and ask for user confirmation if a specific memory was requested to be forgotten.",
          parameters: z.object({
            memoryId: z.string().describe(
              "The unique ID of the memory to forget.",
            ),
          }),
          execute: async ({ memoryId }) => {
            return await forgetMemoryAction({ memoryId, userId: input.uid });
          },
        },
        showMeditationTypeSelector: {
          description: "Show UI cards with different meditation types for the user to select from. Use this when user asks for meditation or you recognize they might need one.",
          parameters: z.object({}),
          execute: async () => {
            return await showMeditationTypeSelectorAction();
          },
        },
        showMeditationPromptSelector: {
          description: "Show UI options to choose between chat history or custom intention for meditation creation. Use this after user selects a meditation type.",
          parameters: z.object({
            type: z.string().describe("The type of meditation selected by the user"),
          }),
          execute: async ({ type }) => {
            return await showMeditationPromptSelectorAction({ type });
          },
        },
        showMeditationLanguageSelector: {
          description: "Show language selection UI (Hebrew/English) before generating meditation content. Use this after user selects meditation prompt/intention.",
          parameters: z.object({
            type: z.string().describe("The type of meditation selected by the user"),
            intention: z.string().optional().describe("User's specific intention or goal for the meditation"),
            chatHistory: z.string().optional().describe("Recent chat history to base meditation on"),
          }),
          execute: async ({ type, intention, chatHistory }) => {
            return await showMeditationLanguageSelectorAction({ type, intention, chatHistory });
          },
        },
        generateMeditationContent: {
          description: "Generate custom meditation content based on user intentions or chat history. Returns meditation content that can optionally be saved.",
          parameters: z.object({
            type: z.string().describe("Type of meditation: visualization, mindfulness, sleep story, loving kindness, chakra balancing, breath awareness, affirmations, concentration, body scan, or memory palace enhancement"),
            intention: z.string().optional().describe("User's specific intention or goal for the meditation"),
            chatHistory: z.string().optional().describe("Recent chat history to base meditation on"),
            duration: z.string().optional().describe("Desired meditation duration (e.g., '5 minutes', '10 minutes')"),
            language: z.string().optional().describe("Language for meditation content: 'english' or 'hebrew' (with ניקוד)"),
          }),
          execute: async ({ type, intention, chatHistory, duration, language }) => {
            return await generateMeditationContentAction({ type, intention, chatHistory, duration, language });
          },
        },
        createMeditation: {
          description: "Save a meditation session for the user. Use this after generating meditation content to save it.",
          parameters: z.object({
            type: z.string().describe("Type of meditation"),
            title: z.string().describe("Title for the meditation"),
            content: z.string().describe("The full meditation content/script"),
            duration: z.string().optional().describe("Duration of the meditation"),
          }),
          execute: async ({ type, title, content, duration }) => {
            return await createMeditationAction({ userId: input.uid, type, title, content, duration });
          },
        },
        listMeditations: {
          description: "List all saved meditations for the user.",
          parameters: z.object({}),
          execute: async () => {
            return await listMeditationsAction({ userId: input.uid });
          },
        },
        getMeditation: {
          description: "Get the full content of a specific saved meditation.",
          parameters: z.object({
            meditationId: z.string().describe("The ID of the meditation to retrieve"),
          }),
          execute: async ({ meditationId }) => {
            return await getMeditationAction({ meditationId, userId: input.uid });
          },
        },
        deleteMeditation: {
          description: "Delete a specific saved meditation.",
          parameters: z.object({
            meditationId: z.string().describe("The ID of the meditation to delete"),
          }),
          execute: async ({ meditationId }) => {
            return await deleteMeditationAction({ meditationId, userId: input.uid });
          },
        },
        batchTaskOperations: {
          description: "Execute multiple task operations (add, update, delete, finish) in a single batch. Allows for bulk operations on tasks with optional confirmation prompts.",
          parameters: z.object({
            operations: z.array(z.object({
              operation: z.enum(['add', 'update', 'delete', 'finish']).describe("Type of operation to perform"),
              taskId: z.string().optional().describe("Task ID for update, delete, or finish operations"),
              taskData: z.any().optional().describe("Task data for add or update operations"),
            })).describe("Array of operations to perform"),
            confirmationRequired: z.boolean().optional().describe("Whether to ask for user confirmation before executing - defaults to true for destructive operations"),
          }),
          execute: async ({ operations, confirmationRequired }) => {
            return await batchTaskOperationsAction({ userId: input.uid, operations, confirmationRequired });
          },
        },
        smartTaskFinder: {
          description: "Advanced task finder with intelligent matching capabilities. Can find tasks based on fuzzy matching, date ranges, and complex criteria.",
          parameters: z.object({
            searchCriteria: z.object({
              keywords: z.array(z.string()).optional().describe("Keywords to search for"),
              description: z.string().optional().describe("Description or partial description to match"),
              status: z.string().optional().describe("Task status to filter by"),
              priority: z.string().optional().describe("Priority level to filter by"),
              dateRange: z.object({
                from: z.string().optional().describe("Start date for filtering"),
                to: z.string().optional().describe("End date for filtering"),
              }).optional().describe("Date range for filtering tasks"),
            }).describe("Criteria for finding tasks"),
            fuzzyMatch: z.boolean().optional().describe("Whether to use fuzzy/approximate matching - defaults to true"),
          }),
          execute: async ({ searchCriteria, fuzzyMatch }) => {
            return await smartTaskFinderAction({ userId: input.uid, searchCriteria, fuzzyMatch });
          },
        },
        generateMeditationAudio: {
          description: "Generate TTS audio for a meditation using Gemini's text-to-speech. Returns audio URL for playback.",
          parameters: z.object({
            content: z.string().describe("The meditation content with timestamps"),
            meditationId: z.string().optional().describe("Optional meditation ID for audio file naming"),
            voiceName: z.string().optional().describe("Voice to use for meditation (Enceladus, Callirrhoe, Vindemiatrix, Sulafat, Aoede)"),
          }),
          execute: async ({ content, meditationId, voiceName }) => {
            try {
              const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/tts`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  content,
                  meditationId: meditationId || `meditation_${Date.now()}`,
                  voiceName: voiceName || 'Enceladus'
                }),
              });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate audio');
              }

              const data = await response.json();
              return {
                audioUrl: data.audioUrl,
                segments: data.segments,
                success: true,
                message: "Audio generated successfully! You can now play your meditation."
              };
            } catch (error) {
              console.error('Error generating meditation audio:', error);
              return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to generate audio'
              };
            }
          },
        },
      },        experimental_telemetry: {
          isEnabled: true,
          functionId: "call-single-tool-service",
        },
    });

    // 6. Return the stream result
    const streamResponse = result.toDataStreamResponse();
    
    return {
      success: true,
      stream: streamResponse.body || new ReadableStream()
    };

  } catch (error: any) {      console.error("[Call Single Tool Service] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error during processing";
    
    return {
      success: false,
      error: errorMessage,
      stream: new ReadableStream()
    };
  }
}
