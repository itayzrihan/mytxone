import { Ratelimit } from "@upstash/ratelimit"; // Add import
import { Redis } from "@upstash/redis"; // Add import
import { convertToCoreMessages, Message, streamText } from "ai"; // Import AI SDK components
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod'; // Import zod for basic validation

import { geminiProModel } from "@/ai"; // Import your configured AI model
import {
  forgetMemoryAction,
  recallMemoriesAction,
  saveMemoryAction,
} from "@/ai/actions";
import { findValidApiKey, updateApiKeyLastUsed } from '@/db/queries'; // Import DB functions

// Initialize Upstash Redis client and Ratelimit conditionally
const REDIS_URL = process.env.KV_REST_API_URL || process.env.KV_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN;

let redis: Redis | null = null;
let ratelimit: Ratelimit | null = null;

// Only initialize Redis if we have proper credentials
if (REDIS_URL && REDIS_TOKEN) {
  try {
    redis = new Redis({
      url: REDIS_URL,
      token: REDIS_TOKEN
    });
    ratelimit = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(200, "1 d"), // 200 requests per 1 day per user (identified by userId)
      analytics: true,
      prefix: "@upstash/ratelimit_external_v1", // Use a distinct prefix for this endpoint
    });
    console.log('[External API] Redis rate limiting initialized');
  } catch (error) {
    console.warn('[External API] Failed to initialize Redis, rate limiting disabled:', error);
    redis = null;
    ratelimit = null;
  }
} else {
  console.log('[External API] Redis credentials not found, rate limiting disabled');
}

const MAX_INPUT_LENGTH = 10000; // Define max input length

// Function to validate the API key using the database
const validateAndRecordApiKey = async (authorizationHeader: string | null): Promise<{ isValid: boolean; userId: string | null }> => {
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    console.log('API Key Validation Failed: Missing or invalid Authorization header format.');
    return { isValid: false, userId: null };
  }

  const rawKey = authorizationHeader.split(' ')[1];
  if (!rawKey) {
    console.log('API Key Validation Failed: No key found after Bearer.');
    return { isValid: false, userId: null };
  }

  console.log(`Attempting to validate API key ending with: ...${rawKey.slice(-6)}`);

  try {
    const validKeyDetails = await findValidApiKey(rawKey);

    if (validKeyDetails) {
      console.log(`API Key validated successfully for user: ${validKeyDetails.userId}`);
      // Key is valid, update last used time (fire and forget)
      updateApiKeyLastUsed(validKeyDetails.id).catch(console.error);
      return { isValid: true, userId: validKeyDetails.userId };
    } else {
      console.log(`API Key Validation Failed: No matching key found in database for key ending with ...${rawKey.slice(-6)}`);
    }
  } catch (error) {
    console.error('API Key Validation Failed: Error during database lookup:', error);
    // Log the error but treat it as invalid key for security
  }

  return { isValid: false, userId: null };
};

// Define the expected request body structure
const externalApiRequestSchema = z.object({
  messages: z.array(z.object({ // Expect an array of messages
    id: z.string(), // Add the required 'id' field
    role: z.enum(['user', 'assistant', 'system', 'tool']),
    content: z.string(),
    tool_calls: z.any().optional(), // Allow optional tool calls/results if needed later
    tool_call_id: z.string().optional(),
  })).min(1), // Require at least one message
  // Add other potential parameters if needed, e.g., specific model selection
});

export async function POST(req: NextRequest) {
  const authorizationHeader = req.headers.get('Authorization');

  // Validate the API key
  const { isValid, userId } = await validateAndRecordApiKey(authorizationHeader);

  if (!isValid || !userId) { // Ensure userId is also valid
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log(`API request authorized for user: ${userId}`);

  // --- Rate Limiting Logic ---
  // Use the validated userId as the identifier for rate limiting
  if (ratelimit) {
    try {
      const { success, limit, remaining, reset } = await ratelimit.limit(userId);

      if (!success) {
        console.log(`Rate limit exceeded for user: ${userId}`);
        return new Response("Rate limit exceeded. Please try again later.", {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        });
      }
      console.log(`Rate limit check passed for user: ${userId}. Remaining: ${remaining}`);
    } catch (error) {
      console.warn('[External API] Rate limiting check failed, proceeding without rate limit:', error);
      // Continue without rate limiting if Redis fails
    }
  } else {
    console.log('[External API] Rate limiting disabled - no Redis configuration');
  }
  // --- End Rate Limiting Logic ---

  try {
    const body = await req.json();

    // Validate the request body structure
    const validationResult = externalApiRequestSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('Invalid request body:', validationResult.error.flatten());
      return NextResponse.json({ error: 'Invalid request body format', details: validationResult.error.flatten() }, { status: 400 });
    }

    const { messages }: { messages: Message[] } = validationResult.data;

    // Convert messages to the format expected by the AI SDK
    const coreMessages = convertToCoreMessages(messages).filter(
      (message) => message.content.length > 0,
    );

    // --- Input Length Validation ---
    const userMessagesContent = coreMessages
      .filter((msg) => msg.role === 'user')
      .map((msg) => typeof msg.content === 'string' ? msg.content : '') // Handle potential non-string content
      .join('');

    if (userMessagesContent.length > MAX_INPUT_LENGTH) {
      console.log(`Input length exceeded for user: ${userId}. Length: ${userMessagesContent.length}`);
      return NextResponse.json({ error: `Input exceeds the maximum length of ${MAX_INPUT_LENGTH} characters.` }, { status: 400 });
    }
    // --- End Input Length Validation ---

    // --- Call the AI model ---
    const result = await streamText({
      model: geminiProModel,
      // Updated system prompt with memory instructions
      system: `You are a helpful assistant responding via an external API.
        You can help users manage their tasks AND remember information!
        Keep your responses concise.
        Today's date is ${new Date().toLocaleDateString()}.

        Memory Management Flow:
        - Save a memory (e.g., "Remember my favorite color is blue"). Use the saveMemory tool.
        - Recall memories (e.g., "What do you remember?", "What is my favorite color?"). Use the recallMemories tool.
        - Forget a memory:
          - If the user asks to forget something specific (e.g., "forget my name"), FIRST use the recallMemories tool internally.
          - Check if the recalled memories contain a SINGLE, clear match.
          - If ONE match is found, ask the user for confirmation: "Are you sure you want me to forget that [memory content]? (ID: [memory ID])".
          - If the user confirms, THEN use the forgetMemory tool with that specific ID.
          - If multiple matches, no matches, or the request was vague, use recallMemories to show the list and ask for the ID.
        `,
      messages: coreMessages,
      // Add memory tools
      tools: {
        saveMemory: {
          description: "Save a piece of information provided by the user for later recall.",
          parameters: z.object({
            content: z.string().describe("The specific piece of information to remember."),
          }),
          execute: async ({ content }) => {
            // Pass the validated userId to the action
            return await saveMemoryAction({ userId, content });
          },
        },
        recallMemories: {
          description: "Recall all pieces of information previously saved by the user. Also used internally to find a specific memory before forgetting.",
          parameters: z.object({}),
          execute: async () => {
            // Pass the validated userId to the action
            return await recallMemoriesAction({ userId });
          },
        },
        forgetMemory: {
          description: "Forget a specific piece of information previously saved. Requires the memory ID. Usually, you should recall memories first to find the correct ID and ask for user confirmation if a specific memory was requested to be forgotten.",
          parameters: z.object({
            memoryId: z.string().describe("The unique ID of the memory to forget."),
          }),
          execute: async ({ memoryId }) => {
            // Pass the validated userId to the action
            return await forgetMemoryAction({ memoryId, userId });
          },
        },
        // TODO: Add other tools (tasks, flights?) if desired for the external API
      },
      // Add user ID to context if needed by middleware/tools (optional but good practice if middleware relies on it)
      // experimental_options: { userId: userId }
    });

    // Return the AI's response stream
    return result.toDataStreamResponse();

  } catch (error: any) { // Specify type for error
    console.error("API Error:", error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }
    // Log the specific error for internal debugging
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`Internal Server Error processing API request: ${errorMessage}`);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
    const authorizationHeader = req.headers.get('Authorization');
    const { isValid, userId } = await validateAndRecordApiKey(authorizationHeader);

    if (!isValid) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log(`API GET request authorized for user: ${userId}`);

    // TODO: Implement GET logic
    return NextResponse.json({ message: 'This is the GET endpoint for the external API' });
}