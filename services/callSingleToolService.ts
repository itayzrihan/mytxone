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
  enhancedSearchTasksAction,
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
  userTimezone?: string; // User's timezone (e.g., 'Asia/Jerusalem', 'America/New_York')
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

    // Helper function to get user's current time
    const getUserCurrentTime = () => {
      const now = new Date();
      const timezone = input.userTimezone || 'UTC';
      try {
        return now.toLocaleString('en-US', { 
          timeZone: timezone,
          year: 'numeric',
          month: '2-digit', 
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
      } catch (error) {
        console.warn(`Invalid timezone: ${timezone}, falling back to UTC`);
        return now.toLocaleString('en-US', { 
          timeZone: 'UTC',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit', 
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
      }
    };

    const userCurrentTime = getUserCurrentTime();
    const userTimezone = input.userTimezone || 'UTC';

    // 5. Call AI Model with Full Tools Support
    const result = await streamText({
      model: geminiProModel,
      system: `${input.languageInstruction ? `LANGUAGE REQUIREMENT: ${input.languageInstruction}` : 'LANGUAGE REQUIREMENT: Respond in the same language as the user\'s message.'}
        
        CRITICAL: If user writes in Hebrew (עברית), respond in Hebrew. If user writes in English, respond in English.
        Hebrew responses should include: "אני אוסיף", "המשימה נוספה", "מתי צריך לסיים", "איזו עדיפות", etc.
        
        TIMEZONE: User is in ${userTimezone} timezone. Current user local time: ${userCurrentTime}
        When calculating relative times (בעוד שעה, in 2 hours, מחר), use the user's timezone: ${userTimezone}
        
        IMMEDIATE ACTION PROTOCOL: Take action immediately for ALL user requests unless critical information is missing.
        
        IMPORTANT: When you see conversation history, only respond to the LATEST user message. 
        Previous messages in the conversation are for context only - do not re-execute old actions or respond to old requests.
        
        - you are also generally helpful and friendly and helping with anything else.
        whenever the user asks if you remember something you should check the memory first. even if the user not explicitly asks you to recall it might be a good idea to try to recall it.
        - you help users book flights, manage their tasks, AND remember information!
        - keep your responses limited to a sentence.
        - DO NOT output lists.
        - CRITICAL FOR ALL OPERATIONS: Take immediate action for ANY user request. DO NOT ask follow-up questions unless CRITICAL information is missing.
        - CRITICAL FOR TASKS: When user asks to add a task, IMMEDIATELY use the addTask tool. DO NOT ask for more details.
        - TIMEZONE AWARENESS: Current user time is ${userCurrentTime} (${userTimezone} timezone).
        - When user says "in one hour" or "בעוד שעה", calculate from current user time: ${userCurrentTime}
        - CRITICAL: When providing dueDate in tools, use ISO format but preserve the user's timezone intent.
        - For dates, use format: YYYY-MM-DDTHH:MM:SS (local time in user's timezone)
        - Example: if user says "בעוד שעה" at 01:30, provide dueDate as "2025-07-07T02:30:00"
        - IMPORTANT: ALWAYS provide a text response when using tools. Never send just tool calls without accompanying text.
        - after every tool call, always include a brief text message explaining what you're doing or what the result shows.
        - today's date is ${new Date().toLocaleDateString()}.
        - IMMEDIATE ACTION RULE: Take action immediately for ALL requests (tasks, searches, memories, etc.) unless critical info is missing.
        - ONLY ask follow-up questions if absolutely critical information is missing (like flight origin/destination, passenger name for reservations).
        - For tasks, searches, memories: act immediately with available information and smart defaults.
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
          - LANGUAGE REQUIREMENT: If the user speaks Hebrew, respond in Hebrew. If English, respond in English.
          - IMMEDIATE ACTION RULE: ALWAYS add tasks immediately without asking for additional details.
          - Parse whatever information is available and use smart defaults:
            * If no due date provided: set as null (no due date)
            * If no priority provided: default to "medium"
            * If no task type provided: default to "onetime"
            * Extract task name from user's description and clean it up
          - NEVER ask "What priority?" or "When is it due?" - just add the task immediately
          - User can always edit the task later if they want to change details
          - For Hebrew users, use Hebrew responses like:
            * Adding task: "אוסיף את המשימה [task name]" / "המשימה '[task name]' נוספה"
            * With due date: "המשימה נוספה למועד [date]"
            * Success: "המשימה נוספה בהצלחה"
          - When adding a task, use addTask tool directly with available information
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
          
          - TASK CREATION EXAMPLES - ALWAYS ACT IMMEDIATELY:
            * User: "תוסיף משימה לאכול בעוד שעה" → IMMEDIATELY use addTask with name "אכול", dueDate calculated as current Israel time + 1 hour
            * User: "add task to call mom" → IMMEDIATELY use addTask with name "call mom", default priority "medium", no due date
            * User: "תוסיף משימה דחופה לסיים הפרויקט מחר" → IMMEDIATELY use addTask with name "סיים הפרויקט", priority "high", dueDate tomorrow Israel time
            * User: "add daily exercise task" → IMMEDIATELY use addTask with name "exercise", taskType "daily"
          - TIMEZONE CALCULATION: When user says relative times like "בעוד שעה", "in 2 hours", "מחר", always calculate from Israel timezone (GMT+2/+3).
          - Current Israel time reference: ${new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' })}
          - DO NOT ask follow-up questions for task creation - parse available info and use smart defaults
          
          - ENHANCED SMART SEARCH AND OPERATIONS:
            * When user wants to search for specific tasks (any search terms), ALWAYS use enhancedSearchTasks - it provides better matching and filtering
            * Use listTasks ONLY when user asks for "all tasks", "show me my tasks", or similar general requests without search terms
            * When user references a task by description (e.g., "edit the running task", "finish the exercise task"), use enhancedSearchTasks first
            * CRITICAL: ALWAYS parse temporal keywords from user query and set appropriate dateFilter with actual dates:
              - "היום", "today" → dateFilter: {type: "range", startDate: "2025-07-07 00:00:00", endDate: "2025-07-07 23:59:59"}
              - "מחר", "tomorrow" → dateFilter: {type: "range", startDate: "2025-07-08 00:00:00", endDate: "2025-07-08 23:59:59"}
              - "לשבוע הקרוב", "next week", "השבוע הבא" → dateFilter: {type: "range", startDate: "2025-07-14 00:00:00", endDate: "2025-07-20 23:59:59"}
              - "השבוע", "this week" → dateFilter: {type: "range", startDate: "2025-07-07 00:00:00", endDate: "2025-07-13 23:59:59"}
              - "החודש", "this month" → dateFilter: {type: "range", startDate: "2025-07-01 00:00:00", endDate: "2025-07-31 23:59:59"}
              - "בימים הקרובים", "next few days" → dateFilter: {type: "range", startDate: "2025-07-07 00:00:00", endDate: "2025-07-10 23:59:59"}
              - "פג תוקף", "overdue" → dateFilter: {type: "range", startDate: "2024-07-07 00:00:00", endDate: "2025-07-06 23:59:59"}
            * CRITICAL: ALWAYS parse priority keywords and set priorityFilter:
              - "דחוף", "urgent", "חשוב", "important", "high priority" → priorityFilter: "high"
              - "נמוך", "low priority", "not urgent" → priorityFilter: "low"
            * CRITICAL: ALWAYS parse status keywords and set statusFilter:
              - "פועל", "running", "active" → statusFilter: "running"
              - "הושלם", "finished", "completed" → statusFilter: "finished"
              - "ממתין", "pending" → statusFilter: "pending"
            * For complex operations like "delete all finished tasks" or "add 5 tasks", use workflowManager
            * For bulk operations, use batchTaskOperations with proper confirmation
            * Use smartTaskFinder for advanced filtering and fuzzy matching
            * Always show task details and ask for confirmation before destructive operations
            * Examples of when to use enhancedSearchTasks:
              - "תראי לי את כל המשימות עם המילה ארגון" → enhancedSearchTasks with query "ארגון"
              - "find tasks due tomorrow" → enhancedSearchTasks with query "tomorrow" AND dateFilter: {type: "range", startDate: "2025-07-08 00:00:00", endDate: "2025-07-08 23:59:59"}
              - "תראי לי את כל המשימות לשבוע הקרוב" → enhancedSearchTasks with query "לשבוע הקרוב" AND dateFilter: {type: "range", startDate: "2025-07-14 00:00:00", endDate: "2025-07-20 23:59:59"}
              - "show high priority tasks" → enhancedSearchTasks with query "high priority" AND priorityFilter: "high"
              - "urgent tasks" → enhancedSearchTasks with query "urgent" AND priorityFilter: "high"
          
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
            // Call the action to get the list configuration
            const result = await listTasksAction({ filter, limit, offset, searchQuery, userId: input.uid });
            
            // Return a completion message - the frontend will execute the local action based on the tool name
            return `✅ Listed ${filter || 'active'} tasks.`;
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
          description: "Basic search for tasks by name or description. Use this for simple queries without complex filtering.",
          parameters: z.object({
            query: z.string().describe("Search query to find tasks."),
            limit: z.number().optional().describe("Number of results to return - defaults to 20."),
          }),
          execute: async ({ query, limit }) => {
            // Call the action to get the search configuration
            const result = await searchTasksAction({ query, limit, userId: input.uid });
            
            // Debug logging to confirm we're returning the searchAnalysis
            console.log('[CallSingleToolService] searchTasks result:', {
              action: result.action,
              hasSearchAnalysis: !!(result as any).searchAnalysis,
              searchAnalysisKeys: (result as any).searchAnalysis ? Object.keys((result as any).searchAnalysis) : [],
              keywordCounts: (result as any).searchAnalysis ? {
                primaryKeywords: (result as any).searchAnalysis.primaryKeywords?.length || 0,
                relatedKeywords: (result as any).searchAnalysis.relatedKeywords?.length || 0,
                contextKeywords: (result as any).searchAnalysis.contextKeywords?.length || 0,
                hebrewTerms: (result as any).searchAnalysis.hebrewTerms?.length || 0,
                tagKeywords: (result as any).searchAnalysis.tagKeywords?.length || 0
              } : null
            });
            
            // Return the full result object so the frontend gets the searchAnalysis with keywords
            return result;
          },
        },
        enhancedSearchTasks: {
          description: "Enhanced search for tasks with AI-powered analysis, date filtering, priority matching, and advanced tag support using AND logic. IMPORTANT: Uses keywords to find tag IDs, then filters tasks that have those tag IDs (AND logic). Parse temporal keywords from the query and set appropriate dateFilter.",
          parameters: z.object({
            query: z.string().describe("Search query to find tasks. Can include natural language like 'tasks due tomorrow', 'high priority tasks', 'tasks with ארגון', 'לשבוע הקרוב', etc."),
            limit: z.number().optional().describe("Number of results to return - defaults to 20."),
            dateFilter: z.object({
              type: z.enum(['today', 'tomorrow', 'next_few_days', 'this_week', 'next_week', 'this_month', 'overdue', 'upcoming', 'range']).describe("Type of date filter - PARSE FROM QUERY: 'היום/today'→range with today's dates, 'מחר/tomorrow'→range with tomorrow's dates, 'לשבוע הקרוב/next week'→range with next week dates, 'השבוע/this week'→range with this week dates, 'החודש/this month'→range with this month dates"),
              startDate: z.string().optional().describe("Start date for range filter in frontend format 'YYYY-MM-DD HH:mm:ss' - ALWAYS provide when using range type"),
              endDate: z.string().optional().describe("End date for range filter in frontend format 'YYYY-MM-DD HH:mm:ss' - ALWAYS provide when using range type"),
              includeNoDueDate: z.boolean().optional().describe("Whether to include tasks with no due date")
            }).optional().describe("REQUIRED when query contains time references: Extract from query and calculate actual dates - 'היום'/'today'→{type:'range', startDate:'2025-07-07 00:00:00', endDate:'2025-07-07 23:59:59'}, 'לשבוע הקרוב'/'next week'→{type:'range', startDate:'2025-07-14 00:00:00', endDate:'2025-07-20 23:59:59'}"),
            priorityFilter: z.enum(['low', 'medium', 'high', 'all']).optional().describe("Filter by priority level - PARSE FROM QUERY: 'דחוף'/'urgent'/'high'→high, 'חשוב'/'important'→high, 'נמוך'/'low'→low"),
            statusFilter: z.enum(['pending', 'running', 'paused', 'finished', 'skipped', 'all']).optional().describe("Filter by task status - PARSE FROM QUERY: 'פועל'/'running'→running, 'הושלם'/'finished'→finished, 'ממתין'/'pending'→pending"),
            tagFilter: z.union([z.string(), z.array(z.string())]).optional().describe("Filter by tag ID(s)")
          }),
          execute: async ({ query, limit, dateFilter, priorityFilter, statusFilter, tagFilter }) => {
            // Call the action to get the search configuration
            const result = await enhancedSearchTasksAction({ 
              query, 
              limit, 
              dateFilter, 
              priorityFilter, 
              statusFilter, 
              tagFilter, 
              userId: input.uid 
            });
            
            // Debug logging to confirm we're returning the searchAnalysis
            console.log('[CallSingleToolService] enhancedSearchTasks result:', {
              action: result.action,
              hasSearchAnalysis: !!(result as any).searchAnalysis,
              searchAnalysisKeys: (result as any).searchAnalysis ? Object.keys((result as any).searchAnalysis) : [],
              keywordCounts: (result as any).searchAnalysis ? {
                primaryKeywords: (result as any).searchAnalysis.primaryKeywords?.length || 0,
                relatedKeywords: (result as any).searchAnalysis.relatedKeywords?.length || 0,
                contextKeywords: (result as any).searchAnalysis.contextKeywords?.length || 0,
                hebrewTerms: (result as any).searchAnalysis.hebrewTerms?.length || 0,
                tagKeywords: (result as any).searchAnalysis.tagKeywords?.length || 0
              } : null
            });
            
            // Return the full result object so the frontend gets the searchAnalysis with keywords
            return result;
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

    // 6. Return the stream result with proper closure handling
    const streamResponse = result.toDataStreamResponse();
    
    // Create a new ReadableStream that properly handles closure
    const wrappedStream = new ReadableStream({
      start(controller) {
        if (!streamResponse.body) {
          controller.close();
          return;
        }
        
        const reader = streamResponse.body.getReader();
        
        function pump(): Promise<void> {
          return reader.read().then(({ done, value }) => {
            if (done) {
              console.log('[CallSingleToolService] Stream completed, closing controller');
              controller.close();
              return;
            }
            
            controller.enqueue(value);
            return pump();
          }).catch(error => {
            console.error('[CallSingleToolService] Stream error:', error);
            controller.error(error);
          });
        }
        
        return pump();
      }
    });
    
    return {
      success: true,
      stream: wrappedStream
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
