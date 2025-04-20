import { NextRequest, NextResponse } from 'next/server';
import { findValidApiKey, updateApiKeyLastUsed } from '@/db/queries'; // Import DB functions
import { convertToCoreMessages, Message, streamText } from "ai"; // Import AI SDK components
import { geminiProModel } from "@/ai"; // Import your configured AI model
import { z } from 'zod'; // Import zod for basic validation

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

    // --- Call the AI model ---
    const result = await streamText({
      model: geminiProModel, // Use your configured model
      // Basic system prompt - adjust as needed for external API context
      system: `You are a helpful assistant responding via an external API. Today's date is ${new Date().toLocaleDateString()}. Keep responses concise.`,
      messages: coreMessages,
      // TODO: Decide if/which tools should be available to the external API
      // tools: { ... }
      // Add user ID to context if needed by middleware/tools (optional)
      // experimental_options: { userId: userId }
    });

    // Return the AI's response stream
    return result.toDataStreamResponse();

  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    // Log the specific error for internal debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Internal Server Error processing API request: ${errorMessage}`);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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