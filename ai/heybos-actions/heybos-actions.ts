import { generateObject } from "ai";
import { z } from "zod";

import { geminiFlashModel } from "..";
import { generateUUID } from "@/lib/utils";

export async function generateSampleFlightStatus({
  flightNumber,
  date,
}: {
  flightNumber: string;
  date: string;
}) {
  const { object: flightStatus } = await generateObject({
    model: geminiFlashModel,
    prompt: `Flight status for flight number ${flightNumber} on ${date}`,
    schema: z.object({
      flightNumber: z.string().describe("Flight number, e.g., BA123, AA31"),
      departure: z.object({
        cityName: z.string().describe("Name of the departure city"),
        airportCode: z.string().describe("IATA code of the departure airport"),
        airportName: z.string().describe("Full name of the departure airport"),
        timestamp: z.string().describe("ISO 8601 departure date and time"),
        terminal: z.string().describe("Departure terminal"),
        gate: z.string().describe("Departure gate"),
      }),
      arrival: z.object({
        cityName: z.string().describe("Name of the arrival city"),
        airportCode: z.string().describe("IATA code of the arrival airport"),
        airportName: z.string().describe("Full name of the arrival airport"),
        timestamp: z.string().describe("ISO 8601 arrival date and time"),
        terminal: z.string().describe("Arrival terminal"),
        gate: z.string().describe("Arrival gate"),
      }),
      totalDistanceInMiles: z
        .number()
        .describe("Total flight distance in miles"),
    }),
  });

  return flightStatus;
}

export async function generateSampleFlightSearchResults({
  origin,
  destination,
}: {
  origin: string;
  destination: string;
}) {
  const { object: flightSearchResults } = await generateObject({
    model: geminiFlashModel,
    prompt: `Generate search results for flights from ${origin} to ${destination}, limit to 4 results`,
    output: "array",
    schema: z.object({
      id: z
        .string()
        .describe("Unique identifier for the flight, like BA123, AA31, etc."),
      departure: z.object({
        cityName: z.string().describe("Name of the departure city"),
        airportCode: z.string().describe("IATA code of the departure airport"),
        timestamp: z.string().describe("ISO 8601 departure date and time"),
      }),
      arrival: z.object({
        cityName: z.string().describe("Name of the arrival city"),
        airportCode: z.string().describe("IATA code of the arrival airport"),
        timestamp: z.string().describe("ISO 8601 arrival date and time"),
      }),
      airlines: z.array(
        z.string().describe("Airline names, e.g., American Airlines, Emirates"),
      ),
      priceInUSD: z.number().describe("Flight price in US dollars"),
      numberOfStops: z.number().describe("Number of stops during the flight"),
    }),
  });

  return { flights: flightSearchResults };
}

export async function generateSampleSeatSelection({
  flightNumber,
}: {
  flightNumber: string;
}) {
  const { object: rows } = await generateObject({
    model: geminiFlashModel,
    prompt: `Simulate available seats for flight number ${flightNumber}, 6 seats on each row and 5 rows in total, adjust pricing based on location of seat`,
    output: "array",
    schema: z.array(
      z.object({
        seatNumber: z.string().describe("Seat identifier, e.g., 12A, 15C"),
        priceInUSD: z
          .number()
          .describe("Seat price in US dollars, less than $99"),
        isAvailable: z
          .boolean()
          .describe("Whether the seat is available for booking"),
      }),
    ),
  });

  return { seats: rows };
}

export async function generateReservationPrice(props: {
  seats: string[];
  flightNumber: string;
  departure: {
    cityName: string;
    airportCode: string;
    timestamp: string;
    gate: string;
    terminal: string;
  };
  arrival: {
    cityName: string;
    airportCode: string;
    timestamp: string;
    gate: string;
    terminal: string;
  };
  passengerName: string;
}) {
  const { object: reservation } = await generateObject({
    model: geminiFlashModel,
    prompt: `Generate price for the following reservation \n\n ${JSON.stringify(props, null, 2)}`,
    schema: z.object({
      totalPriceInUSD: z
        .number()
        .describe("Total reservation price in US dollars"),
    }),
  });

  return reservation;
}

// --- HeyBos Task Management Actions ---
// These now return instructions for the client to execute locally using the real HeyBos task system

export async function addTaskAction({
  taskDescription,
  userId,
  taskType = "onetime",
  priority = "medium",
  dueDate,
  relatedTo,
}: {
  taskDescription: string;
  userId: string;
  taskType?: "onetime" | "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  relatedTo?: string[];
}) {
  console.log(`Action: Adding HeyBos task with details:`, {
    taskDescription,
    taskType,
    priority,
    dueDate,
    relatedTo
  });
  
  // Parse the task description to extract name and description
  // If the description contains multiple sentences, use first as name, rest as description
  const sentences = taskDescription.split('.').map(s => s.trim()).filter(s => s.length > 0);
  const name = sentences[0] || taskDescription;
  const description = sentences.length > 1 ? sentences.slice(1).join('. ') : null;
  
  // Return instruction for TheBaze to handle locally using the real HeyBos task system
  return { 
    action: "addTask",
    name: name,
    description: description || taskDescription,
    taskType,
    priority,
    dueDate,
    relatedTo: relatedTo || [],
    status: "added" as const,
    message: `I'll add "${name}" as a ${taskType} task with ${priority} priority${dueDate ? ` due ${new Date(dueDate).toLocaleDateString()}` : ''}.`
  };
}

export async function listTasksAction({
  userId,
  filter = "active",
  limit = 20,
  offset = 0,
  searchQuery,
}: {
  userId: string;
  filter?: "active" | "finished" | "all";
  limit?: number;
  offset?: number;
  searchQuery?: string;
}) {
  console.log(`Action: Listing HeyBos tasks instruction for user ${userId}, filter: ${filter}`);
  // Return instruction for TheBaze to handle locally using the real HeyBos task system
  return { 
    action: "listTasks",
    filter,
    limit,
    offset,
    searchQuery,
    status: "listed" as const,
    message: searchQuery 
      ? `Here are your tasks matching "${searchQuery}":` 
      : `Here are your ${filter === 'active' ? 'active' : filter === 'finished' ? 'completed' : ''} tasks:`
  };
}

export async function updateTaskAction({ 
  taskId,
  userId,
  name,
  description,
  taskType,
  priority,
  status,
  dueDate,
  relatedTo,
}: { 
  taskId: string;
  userId: string;
  name?: string;
  description?: string;
  taskType?: "onetime" | "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  priority?: "low" | "medium" | "high";
  status?: "pending" | "running" | "paused" | "finished" | "skipped";
  dueDate?: string;
  relatedTo?: string[];
}) {
  console.log(`Action: Updating HeyBos task ${taskId} instruction for user ${userId}`);
  // Return instruction for TheBaze to handle locally using the real HeyBos task system
  const updates: any = {};
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;
  if (taskType !== undefined) updates.taskType = taskType;
  if (priority !== undefined) updates.priority = priority;
  if (status !== undefined) updates.status = status;
  if (dueDate !== undefined) updates.dueDate = dueDate;
  if (relatedTo !== undefined) updates.relatedTo = relatedTo;

  return { 
    action: "updateTask",
    taskId,
    ...updates,
    status: "updated" as const,
    message: `I'll update that task for you.`
  };
}

export async function finishTaskAction({ 
  taskId,
  userId,
}: { 
  taskId: string;
  userId: string;
}) {
  console.log(`Action: Finishing HeyBos task ${taskId} instruction for user ${userId}`);
  // Return instruction for TheBaze to handle locally using the real HeyBos task system
  return { 
    action: "finishTask",
    taskId,
    status: "finished" as const,
    message: `I'll mark that task as finished.`
  };
}

export async function deleteTaskAction({
  taskId,
  userId,
}: {
  taskId: string;
  userId: string;
}) {
  console.log(`Action: Deleting HeyBos task ${taskId} instruction for user ${userId}`);
  // Return instruction for TheBaze to handle locally using the real HeyBos task system
  return { 
    action: "deleteTask",
    taskId,
    status: "deleted" as const,
    message: "I'll delete that task for you."
  };
}

export async function searchTasksAction({
  userId,
  query,
  limit = 20,
}: {
  userId: string;
  query: string;
  limit?: number;
}) {
  console.log(`Action: Basic searching HeyBos tasks for user ${userId}, query: ${query}`);
  
  // Return instruction for TheBaze to handle locally using basic search
  return { 
    action: "searchTasks",
    query,
    limit,
    status: "searching" as const,
    message: `Searching for tasks matching "${query}"...`
  };
}

export async function enhancedSearchTasksAction({
  userId,
  query,
  limit = 20,
  dateFilter,
  priorityFilter,
  statusFilter,
  tagFilter,
}: {
  userId: string;
  query: string;
  limit?: number;
  dateFilter?: {
    type: 'today' | 'tomorrow' | 'next_few_days' | 'this_week' | 'next_week' | 'this_month' | 'overdue' | 'upcoming' | 'range';
    startDate?: string;
    endDate?: string;
    includeNoDueDate?: boolean;
  };
  priorityFilter?: 'low' | 'medium' | 'high' | 'all';
  statusFilter?: 'pending' | 'running' | 'paused' | 'finished' | 'skipped' | 'all';
  tagFilter?: string | string[];
}) {
  console.log(`Action: Enhanced searching HeyBos tasks instruction for user ${userId}, query: ${query}`);
  console.log(`Filters received - Date: ${JSON.stringify(dateFilter)}, Priority: ${priorityFilter}, Status: ${statusFilter}, Tag: ${tagFilter}`);
  
  // Auto-detect missing date filter from query if not provided and calculate actual dates
  let autoDetectedDateFilter = dateFilter;
  if (!dateFilter) {
    const lowerQuery = query.toLowerCase();
    const hebrewQuery = query;
    const now = new Date();
    
    // Helper function to format date for frontend
    const formatDateForFrontend = (date: Date): string => {
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };
    
    if (lowerQuery.includes('today') || hebrewQuery.includes('היום')) {
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      
      autoDetectedDateFilter = { 
        type: 'range',
        startDate: formatDateForFrontend(startOfDay),
        endDate: formatDateForFrontend(endOfDay)
      };
    } else if (lowerQuery.includes('tomorrow') || hebrewQuery.includes('מחר')) {
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const endOfTomorrow = new Date(tomorrow);
      endOfTomorrow.setHours(23, 59, 59, 999);
      
      autoDetectedDateFilter = { 
        type: 'range',
        startDate: formatDateForFrontend(tomorrow),
        endDate: formatDateForFrontend(endOfTomorrow)
      };
    } else if (lowerQuery.includes('next week') || hebrewQuery.includes('לשבוע הקרוב') || hebrewQuery.includes('השבוע הבא')) {
      // Next week starts from next Monday
      const nextMonday = new Date(now);
      const daysUntilNextMonday = (8 - now.getDay()) % 7 || 7; // If today is Monday, next Monday is in 7 days
      nextMonday.setDate(now.getDate() + daysUntilNextMonday);
      nextMonday.setHours(0, 0, 0, 0);
      
      const nextSunday = new Date(nextMonday);
      nextSunday.setDate(nextMonday.getDate() + 6);
      nextSunday.setHours(23, 59, 59, 999);
      
      autoDetectedDateFilter = { 
        type: 'range',
        startDate: formatDateForFrontend(nextMonday),
        endDate: formatDateForFrontend(nextSunday)
      };
    } else if (lowerQuery.includes('this week') || hebrewQuery.includes('השבוע')) {
      // This week from Monday to Sunday
      const thisMonday = new Date(now);
      const daysSinceMonday = (now.getDay() + 6) % 7; // Sunday = 0, Monday = 1, etc. -> Monday = 0
      thisMonday.setDate(now.getDate() - daysSinceMonday);
      thisMonday.setHours(0, 0, 0, 0);
      
      const thisSunday = new Date(thisMonday);
      thisSunday.setDate(thisMonday.getDate() + 6);
      thisSunday.setHours(23, 59, 59, 999);
      
      autoDetectedDateFilter = { 
        type: 'range',
        startDate: formatDateForFrontend(thisMonday),
        endDate: formatDateForFrontend(thisSunday)
      };
    } else if (lowerQuery.includes('next month') || hebrewQuery.includes('לחודש הקרוב') || hebrewQuery.includes('החודש הבא')) {
      // Next month or "לחודש הקרוב" - include tasks from yesterday through next month
      // This is more natural for Hebrew speakers who mean "in the coming period"
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 1); // Include yesterday's tasks
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(now);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0); // Last day of next month
      endDate.setHours(23, 59, 59, 999);
      
      autoDetectedDateFilter = { 
        type: 'range',
        startDate: formatDateForFrontend(startDate),
        endDate: formatDateForFrontend(endDate)
      };
    } else if (lowerQuery.includes('this month') || hebrewQuery.includes('החודש')) {
      // This month from 1st to last day
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      firstDayOfMonth.setHours(0, 0, 0, 0);
      
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      lastDayOfMonth.setHours(23, 59, 59, 999);
      
      autoDetectedDateFilter = { 
        type: 'range',
        startDate: formatDateForFrontend(firstDayOfMonth),
        endDate: formatDateForFrontend(lastDayOfMonth)
      };
    } else if (lowerQuery.includes('next few days') || hebrewQuery.includes('בימים הקרובים')) {
      // Next 3 days
      const startOfToday = new Date(now);
      startOfToday.setHours(0, 0, 0, 0);
      
      const endOfThreeDays = new Date(now);
      endOfThreeDays.setDate(now.getDate() + 3);
      endOfThreeDays.setHours(23, 59, 59, 999);
      
      autoDetectedDateFilter = { 
        type: 'range',
        startDate: formatDateForFrontend(startOfToday),
        endDate: formatDateForFrontend(endOfThreeDays)
      };
    } else if (lowerQuery.includes('overdue') || hebrewQuery.includes('פג תוקף')) {
      // Tasks due before today
      const endOfYesterday = new Date(now);
      endOfYesterday.setDate(now.getDate() - 1);
      endOfYesterday.setHours(23, 59, 59, 999);
      
      // Start from a year ago to catch all overdue tasks
      const yearAgo = new Date(now);
      yearAgo.setFullYear(now.getFullYear() - 1);
      yearAgo.setHours(0, 0, 0, 0);
      
      autoDetectedDateFilter = { 
        type: 'range',
        startDate: formatDateForFrontend(yearAgo),
        endDate: formatDateForFrontend(endOfYesterday)
      };
    }
    
    if (autoDetectedDateFilter) {
      console.log(`Auto-detected date filter from query: ${JSON.stringify(autoDetectedDateFilter)}`);
    }
  }
  
  // Auto-detect missing priority filter from query if not provided
  let autoDetectedPriorityFilter = priorityFilter;
  if (!priorityFilter) {
    const lowerQuery = query.toLowerCase();
    const hebrewQuery = query;
    
    if (lowerQuery.includes('urgent') || lowerQuery.includes('important') || lowerQuery.includes('high priority') || 
        hebrewQuery.includes('דחוף') || hebrewQuery.includes('חשוב')) {
      autoDetectedPriorityFilter = 'high';
    } else if (lowerQuery.includes('low priority') || lowerQuery.includes('not urgent') || hebrewQuery.includes('נמוך')) {
      autoDetectedPriorityFilter = 'low';
    }
    
    if (autoDetectedPriorityFilter) {
      console.log(`Auto-detected priority filter from query: ${autoDetectedPriorityFilter}`);
    }
  }
  
  // Auto-detect missing status filter from query if not provided
  let autoDetectedStatusFilter = statusFilter;
  if (!statusFilter) {
    const lowerQuery = query.toLowerCase();
    const hebrewQuery = query;
    
    if (lowerQuery.includes('running') || lowerQuery.includes('active') || hebrewQuery.includes('פועל')) {
      autoDetectedStatusFilter = 'running';
    } else if (lowerQuery.includes('finished') || lowerQuery.includes('completed') || hebrewQuery.includes('הושלם')) {
      autoDetectedStatusFilter = 'finished';
    } else if (lowerQuery.includes('pending') || hebrewQuery.includes('ממתין')) {
      autoDetectedStatusFilter = 'pending';
    }
    
    if (autoDetectedStatusFilter) {
      console.log(`Auto-detected status filter from query: ${autoDetectedStatusFilter}`);
    }
  }
  
  // Generate relevant keywords using AI with explicit tag search instructions
  const { object: searchAnalysis } = await generateObject({
    model: geminiFlashModel,
    prompt: `Analyze the search query "${query}" and generate relevant keywords and synonyms that might help find related tasks. Consider:
    - Different ways to express the same action/concept
    - Related activities or contexts
    - Alternative spellings or phrasings
    - Both English and Hebrew terms if applicable
    - Temporal keywords like dates if the query mentions time (today, tomorrow, next week, etc.)
    - Priority indicators (urgent, important, low priority, etc.)
    - Status keywords (finished, pending, running, etc.)
    - Tag-related keywords that might match tag names (e.g., "work", "personal", "urgent", "project names", etc.)
    
    IMPORTANT FOR TAG SEARCH:
    - The frontend will use these keywords to find tags by name/description
    - Tasks are then filtered to include only those with matching tag IDs (AND logic)
    - This means tasks must have tags that match the keyword search
    - Include both broad category terms and specific descriptive words
    - Consider synonyms and related terms for tag matching
    
    Example: If query is "work", include keywords like ["work", "job", "office", "business", "professional"] 
    so the frontend can find tags named "Work", "Business", "Office", etc.
    
    Return a comprehensive list of keywords that would help match relevant tasks and their associated tags.`,
    schema: z.object({
      primaryKeywords: z.array(z.string()).describe("Main keywords from the query"),
      relatedKeywords: z.array(z.string()).describe("Related terms and synonyms"),
      contextKeywords: z.array(z.string()).describe("Contextual terms that might be relevant"),
      hebrewTerms: z.array(z.string()).describe("Hebrew equivalents if applicable"),
      tagKeywords: z.array(z.string()).describe("Keywords that might be tag names or relate to tags/categories - these are used for tag ID matching with AND logic"),
    }),
  });

  // Process date filter to ensure proper frontend format (for manually provided range filters)
  let processedDateFilter = autoDetectedDateFilter;
  if (processedDateFilter && processedDateFilter.type === 'range' && processedDateFilter !== autoDetectedDateFilter) {
    // Only process if this is a manually provided range filter (not auto-detected)
    const formatDateForFrontend = (date: Date): string => {
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };
    
    if (processedDateFilter.startDate && !processedDateFilter.startDate.includes(':')) {
      // If only date is provided, add time
      const startDate = new Date(processedDateFilter.startDate);
      startDate.setHours(0, 0, 0, 0);
      processedDateFilter = {
        ...processedDateFilter,
        startDate: formatDateForFrontend(startDate)
      };
    }
    if (processedDateFilter.endDate && !processedDateFilter.endDate.includes(':')) {
      // If only date is provided, add time
      const endDate = new Date(processedDateFilter.endDate);
      endDate.setHours(23, 59, 59, 999);
      processedDateFilter = {
        ...processedDateFilter!,
        endDate: formatDateForFrontend(endDate)
      };
    }
  }

  console.log(`Final filters - Date: ${JSON.stringify(processedDateFilter)}, Priority: ${autoDetectedPriorityFilter}, Status: ${autoDetectedStatusFilter}`);

  // Return instruction for TheBaze to handle locally using enhanced search
  return { 
    action: "enhancedSearchTasks",
    query,
    searchAnalysis,
    limit,
    dateFilter: processedDateFilter,
    priorityFilter: autoDetectedPriorityFilter,
    statusFilter: autoDetectedStatusFilter,
    tagFilter,
    status: "searching" as const,
    message: `Searching for tasks related to "${query}" using smart keyword matching...`
  };
}



export async function batchTaskOperationsAction({
  userId,
  operations,
  confirmationRequired = true,
}: {
  userId: string;
  operations: Array<{
    operation: 'add' | 'update' | 'delete' | 'finish';
    taskId?: string;
    taskData?: any;
  }>;
  confirmationRequired?: boolean;
}) {
  console.log(`Action: Batch task operations for user ${userId}, operations:`, operations);
  
  // Return instruction for TheBaze to handle locally with batch processing
  return { 
    action: "batchTaskOperations",
    operations,
    confirmationRequired,
    status: "pending_confirmation" as const,
    message: `I'll process ${operations.length} task operations. ${confirmationRequired ? 'Please confirm to proceed:' : 'Processing...'}`
  };
}

export async function smartTaskFinderAction({
  userId,
  searchCriteria,
  fuzzyMatch = true,
}: {
  userId: string;
  searchCriteria: {
    keywords?: string[];
    description?: string;
    status?: string;
    priority?: string;
    dateRange?: { from?: string; to?: string; };
  };
  fuzzyMatch?: boolean;
}) {
  console.log(`Action: Smart task finder for user ${userId}:`, searchCriteria);
  
  // Return instruction for TheBaze to handle locally with advanced matching
  return { 
    action: "smartTaskFinder",
    searchCriteria,
    fuzzyMatch,
    status: "searching" as const,
    message: "Using intelligent search to find matching tasks..."
  };
}

// --- Memory Management Actions ---
// These now return instructions for the client to execute locally

export async function saveMemoryAction({
  userId,
  content,
}: {
  userId: string;
  content: string;
}) {
  console.log(`Action: Saving memory instruction for user ${userId}: ${content}`);
  // Return instruction for TheBaze to handle locally
  return { 
    action: "saveMemory",
    content: content, 
    status: "saved" as const,
    message: `I'll remember that: "${content}"`
  };
}

export async function recallMemoriesAction({ userId }: { userId: string }) {
  console.log(`Action: Recalling memories instruction for user ${userId}`);
  // Return instruction for TheBaze to handle locally
  return { 
    action: "recallMemories",
    status: "recalled" as const,
    message: "Let me check what I remember..."
  };
}

export async function forgetMemoryAction({ memoryId, userId }: { memoryId: string; userId: string }) {
  console.log(`Action: Forgetting memory ${memoryId} instruction for user ${userId}`);
  // Return instruction for TheBaze to handle locally
  return { 
    action: "forgetMemory",
    memoryId: memoryId,
    status: "forgotten" as const,
    message: "I'll forget that memory for you."
  };
}

// --- Meditation Management Actions ---

export async function showMeditationTypeSelectorAction() {
  console.log(`Action: Showing meditation type selector UI`);
  return { 
    status: "showing_types" as const,
    message: "Please select a meditation type from the options below."
  };
}

export async function showMeditationPromptSelectorAction({
  type,
}: {
  type: string;
}) {
  console.log(`Action: Showing meditation prompt selector for ${type}`);
  return { 
    type,
    status: "showing_prompt_selector" as const,
    message: `Now choose how you'd like to create your ${type} meditation.`
  };
}

export async function showMeditationLanguageSelectorAction({
  type,
  intention,
  chatHistory,
}: {
  type: string;
  intention?: string;
  chatHistory?: string;
}) {
  console.log(`Action: Showing meditation language selector for ${type}`);
  return { 
    type,
    intention,
    chatHistory,
    status: "showing_language_selector" as const,
    message: `Please choose the language for your ${type} meditation.`
  };
}

export async function createMeditationAction({
  userId,
  type,
  title,
  content,
  duration,
}: {
  userId: string;
  type: string;
  title: string;
  content: string;
  duration?: string;
}) {
  console.log(`Action: Creating meditation instruction "${title}" of type ${type} for user ${userId}`);
  // Return instruction for TheBaze to handle locally
  return { 
    action: "createMeditation",
    type,
    title,
    content,
    duration,
    status: "created" as const,
    message: `I'll save your ${type} meditation: "${title}"`
  };
}

export async function listMeditationsAction({
  userId,
}: {
  userId: string;
}) {
  console.log(`Action: Listing meditations instruction for user ${userId}`);
  // Return instruction for TheBaze to handle locally
  return { 
    action: "listMeditations",
    status: "listed" as const,
    message: "Here are your saved meditations:"
  };
}

export async function getMeditationAction({
  meditationId,
  userId,
}: {
  meditationId: string;
  userId: string;
}) {
  console.log(`Action: Getting meditation ${meditationId} instruction for user ${userId}`);
  // Return instruction for TheBaze to handle locally
  return { 
    action: "getMeditation",
    meditationId,
    status: "retrieved" as const,
    message: "Here's your meditation:"
  };
}

export async function deleteMeditationAction({
  meditationId,
  userId,
}: {
  meditationId: string;
  userId: string;
}) {
  console.log(`Action: Deleting meditation ${meditationId} instruction for user ${userId}`);
  // Return instruction for TheBaze to handle locally
  return { 
    action: "deleteMeditation",
    meditationId,
    status: "deleted" as const,
    message: "I'll delete that meditation for you."
  };
}

export async function generateMeditationContentAction({
  type,
  intention,
  chatHistory,
  duration = "10 minutes",
  language = "english",
}: {
  type: string;
  intention?: string;
  chatHistory?: string;
  duration?: string;
  language?: string;
}) {
  console.log(`Action: Generating ${type} meditation content`);
  try {
    const contextPrompt = chatHistory 
      ? `Based on this chat history: ${chatHistory.slice(-1000)}` // Use last 1000 chars
      : intention 
      ? `Based on this intention: ${intention}`
      : `Create a general ${type} meditation`;    // Prepare language-specific prompt
    const languageInstruction = language === "hebrew" 
      ? `      ===== CRITICAL HEBREW LANGUAGE REQUIREMENT =====
      
      MANDATORY: Generate 100% of the meditation content in Hebrew with COMPLETE ניקוד (vowel marks) on EVERY SINGLE WORD IN EVERY LINE.
      
      CRITICAL INSTRUCTION: Every line with timestamp must have Hebrew text with full ניקוד after the timestamp.
      
      REQUIRED FORMAT FOR HEBREW MEDITATION:
      [00:00] בְּרוּכִים הַבָּאִים לִמְדִיטַצְיַת הַשַּׁלְוָה הַזֹּאת
      [00:30] קְחוּ נְשִׁימָה עֲמֻקָּה וְהַרְגִּישׁוּ אֶת הַגּוּף מִתְרַגֵּעַ
      [01:00] הַאֲזִינוּ לְקוֹל הַנְּשִׁימָה שֶׁלָּכֶם וְהִתְמַקְּדוּ בָּרֶגַע הַזֶּה
      [01:30] כָּל נְשִׁימָה מְבִיאָה אֶתְכֶם יוֹתֵר עָמֹק לְתוֹךְ הַשַּׁלְוָה
      
      VOWEL MARK REQUIREMENTS (MUST BE USED ON EVERY WORD):
      - קָמַץ (kamatz), פַּתַח (patach), צֵירֵי (tzere), סֶגּוֹל (segol)
      - חִירִיק (chirik), חוֹלָם (cholam), שׁוּרוּק (shuruk), קֻבּוּץ (kubutz)
      - שְׁוָא (sheva), דָּגֵשׁ (dagesh) where appropriate
      
      MEDITATION TERMINOLOGY WITH ניקוד:
      - מְדִיטַצְיָה (meditation)
      - הַרְגָּעָה (relaxation)
      - נְשִׁימָה (breathing)
      - רִגְעָה (calmness)
      - שַׁלְוָה (peace)
      - מַחְשָׁבוֹת (thoughts)
      - תְּחוּשׁוֹת (sensations)
      - מַעֲרֶכֶת עַצְמִית (self-system)
      
      ABSOLUTE REQUIREMENT: EVERY Hebrew word in the meditation content must have complete vowel marks. No Hebrew text without ניקוד is acceptable.
      
      VALIDATION: Before generating, ensure each Hebrew word has proper vowel marks like: שִׁמְחָה, רָגוּעַ, מְרֻכָּז
      `
      : `Generate the meditation content in English.`;    const { object: meditationContent } = await generateObject({
      model: geminiFlashModel,
      prompt: `Generate a ${type} meditation content for ${duration}. ${contextPrompt}. 
      Create a guided meditation that is calming, helpful, and professionally structured.
      
      ${languageInstruction}
        ${language === "hebrew" ? `
      ===== HEBREW VALIDATION FOR TIMELINE =====
      MANDATORY: Each timeline entry MUST follow this exact format:
      [MM:SS] [Hebrew text with complete ניקוד]
      
      EXAMPLES OF CORRECT TIMELINE ENTRIES:
      [00:00] בְּרוּכִים הַבָּאִים לִמְדִיטַצְיַת הַשַּׁלְוָה הַזֹּאת
      [00:45] קְחוּ נְשִׁימָה עֲמֻקָּה וְהַרְגִּישׁוּ אֶת הַגּוּף מִתְרַגֵּעַ
      [01:30] הַאֲזִינוּ לְקוֹל הַנְּשִׁימָה שֶׁלָּכֶם וְהִתְמַקְּדוּ בָּרֶגַע הַזֶּה
      [02:00] כָּל נְשִׁימָה מְבִיאָה אֶתְכֶם יוֹתֵר עָמֹק לְתוֹךְ הַשַּׁלְוָה
      [02:20] הַרְגִּישׁוּ אֶת הַמַּתְח נֶעְלָם מִן הַכְּתֵפַיִם וְהַצַּוָּאר
      
      WRONG EXAMPLES (DO NOT DO THIS):
      [00:00] ברוכים הבאים למדיטציית השלווה הזאת (missing ניקוד)
      [00:45] קחו נשימה עמוקה (missing vowel marks)
      
      CRITICAL: EVERY Hebrew word after each timestamp MUST have complete vowel marks.
      ` : ''}
      
      CRITICAL: Format the meditation content with precise timing for TTS audio playback:
      - Use timestamp format [MM:SS] at the beginning of each line
      - Start with [00:00] for the opening line
      - Use larger gaps (30-60 seconds) at the beginning for smooth, gentle entry
      - Use smaller gaps (10-20 seconds) for continuing parts to maintain flow and connection
      - Target 12 minutes total duration with the LAST line at [10:00] (leaving 2 minutes for natural closing silence)
      - Create a gradual progression from slow, spacious pacing to more connected flow
      - Each timestamp should feel natural and allow proper breathing/pause time
      
      Example timing structure:
      [00:00] Welcome to this peaceful meditation session...
      [00:45] Take a deep, slow breath and allow yourself to settle...
      [01:30] Feel your body beginning to relax and release...
      [02:00] Notice the rhythm of your breathing...
      [02:20] Let each breath bring you deeper into stillness...
      
      Continue this pattern, building a complete 10-minute guided experience that flows naturally for TTS audio.`,      schema: z.object({
        title: z.string().describe(language === "hebrew" 
          ? "A meaningful title for the meditation IN HEBREW WITH COMPLETE ניקוד (vowel marks)"
          : "A meaningful title for the meditation"),
        content: z.string().describe(language === "hebrew" 
          ? "The complete guided meditation script IN HEBREW WITH FULL ניקוד on every word. VERIFY: Every Hebrew letter that can receive vowel marks MUST have them."
          : "The complete guided meditation script with clear instructions"),
        estimatedDuration: z.string().describe("Estimated time needed for this meditation"),
        keyBenefits: z.array(z.string()).describe(language === "hebrew"
          ? "Key benefits this meditation provides IN HEBREW WITH COMPLETE ניקוד"
          : "Key benefits this meditation provides"),
      }),
    });

    // Additional validation for Hebrew content
    if (language === "hebrew") {
      const hebrewVowelMarks = /[\u05B0-\u05BC\u05C1\u05C2\u05C4\u05C5\u05C7]/; // Hebrew vowel mark Unicode ranges
      const hasHebrewVowels = hebrewVowelMarks.test(meditationContent.content);
      
      if (!hasHebrewVowels) {
        console.warn("Generated Hebrew content lacks proper ניקוד, attempting regeneration...");        // If no vowel marks detected, try one more time with even more explicit instruction
        const { object: retriedContent } = await generateObject({
          model: geminiFlashModel,
          prompt: `CRITICAL HEBREW REQUIREMENT: You MUST generate Hebrew meditation content with COMPLETE ניקוד on EVERY word in EVERY timeline entry.
          
          Type: ${type}
          Duration: ${duration}
          Context: ${contextPrompt}
          
          MANDATORY TIMELINE FORMAT WITH ניקוד:
          [00:00] בְּרוּכִים הַבָּאִים לִמְדִיטַצְיַת הַשַּׁלְוָה הַזֹּאת
          [00:30] קְחוּ נְשִׁימָה עֲמֻקָּה וְהַרְגִּישׁוּ אֶת הַגּוּף מִתְרַגֵּעַ
          [01:00] הַאֲזִינוּ לְקוֹל הַנְּשִׁימָה שֶׁלָּכֶם וְהִתְמַקְּדוּ בָּרֶגַע הַזֶּה
          [01:30] כָּל נְשִׁימָה מְבִיאָה אֶתְכֶם יוֹתֵר עָמֹק לְתוֹךְ הַשַּׁלְוָה
          [02:00] הַרְגִּישׁוּ אֶת הַמַּתְח נֶעְלָם מִן הַכְּתֵפַיִם וְהַצַּוָּאר
          [02:20] תְּנוּ לַגּוּף שֶׁלָּכֶם לְהַרְגִּישׁ כָּבֵד וְרָגוּעַ יוֹתֵר
          [02:50] עַכְשָׁיו הַקְּדִישׁוּ תַּשׂוּמֶת לֵב לְמַחְשְׁבוֹתֵיכֶם
          [03:20] אַל תִּלָּחֲמוּ בַּמַּחְשָׁבוֹת, פָּשׁוּט צְפוּ בָּהֶן
          [03:50] תְּנוּ לַמַּחְשָׁבוֹת לַחֲלֹף כְּמוֹ עֲנָנִים בַּשָּׁמַיִם
          [04:20] חִזְרוּ אֶל הַנְּשִׁימָה כָּל פַּעַם שֶׁאַתֶּם מְרַכְּזִים דַּעְתְּכֶם
          
          EVERY SINGLE HEBREW WORD MUST HAVE VOWEL MARKS. NO EXCEPTIONS.
          
          Generate a complete ${duration} meditation following this exact format.`,
          schema: z.object({
            title: z.string().describe("Title IN HEBREW WITH COMPLETE ניקוד"),
            content: z.string().describe("Complete meditation timeline IN HEBREW WITH FULL ניקוד on every word"),
            estimatedDuration: z.string().describe("Estimated duration"),
            keyBenefits: z.array(z.string()).describe("Benefits IN HEBREW WITH ניקוד"),
          }),
        });
        
        return {
          type,
          title: retriedContent.title,
          content: retriedContent.content,
          duration: retriedContent.estimatedDuration,
          keyBenefits: retriedContent.keyBenefits,
          language,
          status: "generated" as const
        };
      }
    }

    return {
      type,
      title: meditationContent.title,
      content: meditationContent.content,
      duration: meditationContent.estimatedDuration,
      keyBenefits: meditationContent.keyBenefits,
      language,
      status: "generated" as const
    };
  } catch (error) {
    console.error("Error in generateMeditationContentAction:", error);
    return { error: "Failed to generate meditation content." };
  }
}
