import { convertToCoreMessages, Message, streamText } from "ai";
import admin from 'firebase-admin';
import { decode } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { geminiProModel } from "@/ai"; // Import your configured AI model
import { BASE_URL } from "@/components/internalurls"; // Import the base URL for internal links
import { callMytxAction } from "@/ai/heybos-actions/anna-actions";

// --- Environment Configuration ---
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'development';
// Temporarily allow bypass for testing - remove this later
const BYPASS_AUTH_FOR_DEV = true; // Force enable for debugging
// const BYPASS_AUTH_FOR_DEV = IS_DEVELOPMENT && (process.env.BYPASS_FIREBASE_AUTH === 'true' || process.env.BYPASS_FIREBASE_AUTH === '1');

if (BYPASS_AUTH_FOR_DEV) {
  console.log('[Firebase Chat API] Running in development mode with authentication bypass enabled.');
}
// --- End Environment Configuration ---

// --- Firebase Admin Initialization ---
// Ensure Firebase Admin SDK is initialized
if (!admin.apps.length) {
  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };
    // Check if all required service account details are present
    if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
      throw new Error("Missing Firebase Admin SDK configuration details in environment variables.");
    }
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    console.log('[Firebase Chat API] Firebase Admin initialized.');
  } catch (error)
  {
    console.error('[Firebase Chat API] Firebase Admin initialization failed:', error);
    // We might want to prevent the API from running if Firebase Admin fails to initialize,
    // depending on the desired behavior. For now, we log the error.
  }
} else {
  console.log('[Firebase Chat API] Firebase Admin already initialized.');
}
// --- End Firebase Admin Initialization ---

// --- CORS Helper ---
const setCorsHeaders = (response: NextResponse, origin: string | null) => {
  // Allow only specific origins
  const allowedOrigins = [
    'http://localhost:8081',
    'http://localhost:3000',
    'https://heybos.me',
    'https://heybos.com',
    'http://10.100.102.8:8081',
    'https://10.100.102.8:8081',
    'https://mytx-ai.vercel.app'
  ];
  let allowedOrigin = '';
  if (origin && allowedOrigins.includes(origin)) {
    allowedOrigin = origin;
  } else {
    allowedOrigin = 'null'; // Disallow by setting to 'null'
  }
  response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
};
// --- End CORS Helper ---

// --- Authentication Helper ---
async function authenticateFirebaseUser(request: NextRequest): Promise<{ uid: string | null; errorResponse: NextResponse | null }> {
  const serverTimeStart = Date.now(); // Log server time at start
  const origin = request.headers.get('Origin');
  const authHeader = request.headers.get('Authorization');
  
  // Check if we're bypassing auth for development
  if (BYPASS_AUTH_FOR_DEV) {
    console.log('[Firebase Chat API Auth] Development mode - bypassing authentication');
    // Use a valid UUID format for development to prevent database errors
    return { uid: '00000000-0000-0000-0000-000000000000', errorResponse: null };
  }
  
  console.log(`[Firebase Chat API Auth] Received request. Server time: ${serverTimeStart}`); // Log server time

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const res = NextResponse.json({ error: 'Missing or invalid Authorization header' }, { status: 401 });
    setCorsHeaders(res, origin);
    console.error('[Firebase Chat API Auth] Missing or invalid Authorization header.');
    return { uid: null, errorResponse: res };
  }

  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log(`[Firebase Chat API Auth] Token verified successfully for UID: ${decodedToken.uid}. Server time: ${Date.now()}`);
    return { uid: decodedToken.uid, errorResponse: null };
  } catch (error) {
    const serverTimeError = Date.now(); // Log server time at error
    console.error(`[Firebase Chat API Auth] Firebase token verification failed. Server time: ${serverTimeError}`, error);

    // Decode token for debugging (without verification)
    try {
        const decoded = decode(token);
        if (decoded && typeof decoded === 'object') {
             // Safely access claims with checks
             const iat = decoded.iat ? `${decoded.iat} (${new Date(decoded.iat * 1000).toISOString()})` : 'undefined';
             const exp = decoded.exp ? `${decoded.exp} (${new Date(decoded.exp * 1000).toISOString()})` : 'undefined';
             const auth_time = decoded.auth_time ? `${decoded.auth_time} (${new Date(decoded.auth_time * 1000).toISOString()})` : 'undefined';

             console.error(`[Firebase Chat API Auth Debug] Decoded token claims: iat=${iat}, exp=${exp}, auth_time=${auth_time}. Current Server Time (epoch): ${Math.floor(serverTimeError / 1000)}`);
        } else {
             console.error("[Firebase Chat API Auth Debug] Could not decode token or token format unexpected.");
        }
    } catch (decodeError) {
         console.error("[Firebase Chat API Auth Debug] Error decoding token:", decodeError);
    }

    const res = NextResponse.json({ error: 'Unauthorized - Invalid Firebase token' }, { status: 401 });
    setCorsHeaders(res, origin);
    return { uid: null, errorResponse: res };
  }
}
// --- End Authentication Helper ---

// --- Request Body Schema ---
const chatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']), // Only user and assistant roles for clean chat
    content: z.string(),
    // Exclude tool-related fields for this endpoint
  })).min(1, "Messages array cannot be empty"), // Require at least one message
});
// --- End Request Body Schema ---

// --- OPTIONS Handler (for CORS Preflight) ---
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('Origin');
  const response = new NextResponse(null, { status: 204 }); // Use 204 No Content for OPTIONS
  setCorsHeaders(response, origin);
  console.log('[Firebase Chat API OPTIONS] Responding to preflight request.');
  return response;
}
// --- End OPTIONS Handler ---

// --- POST Handler ---
export async function POST(request: NextRequest) {
  const origin = request.headers.get('Origin');

  // 1. Authenticate User
  const { uid, errorResponse } = await authenticateFirebaseUser(request);
  if (errorResponse) {
    return errorResponse; // Return the authentication error response
  }
  if (!uid) {
    // Should not happen if errorResponse is null, but good practice
    const res = NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    setCorsHeaders(res, origin);
    return res;
  }

  console.log(`[Firebase Chat API POST] Request authenticated for user UID: ${uid}`);

  // 2. Parse and Validate Request Body
  let body;
  try {
    body = await request.json();
  } catch (error) {
    console.error('[Firebase Chat API POST] Invalid JSON in request body:', error);
    const res = NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    setCorsHeaders(res, origin);
    return res;
  }

  const validationResult = chatRequestSchema.safeParse(body);
  if (!validationResult.success) {
    console.error('[Firebase Chat API POST] Invalid request body format:', validationResult.error.flatten());
    const res = NextResponse.json({ error: 'Invalid request body format', details: validationResult.error.flatten() }, { status: 400 });
    setCorsHeaders(res, origin);
    return res;
  }

  // Add 'id' property to each message to satisfy the Message type
  const messages: Message[] = validationResult.data.messages.map((msg, idx) => ({
    ...msg,
    id: `msg-${idx}-${Date.now()}`
  }));

  // 3. Prepare Messages for AI SDK
  const coreMessages = convertToCoreMessages(messages).filter(
    (message) => message.content.length > 0 && (message.role === 'user' || message.role === 'assistant')
  );

  // Basic input length check (optional, adjust as needed)
  const totalContentLength = coreMessages.reduce((sum, msg) => sum + (typeof msg.content === 'string' ? msg.content.length : 0), 0);
  const MAX_INPUT_LENGTH = 20000; // Example limit
  if (totalContentLength > MAX_INPUT_LENGTH) {
      console.log(`[Firebase Chat API POST] Input length exceeded for user: ${uid}. Length: ${totalContentLength}`);
      const res = NextResponse.json({ error: `Input exceeds the maximum length of ${MAX_INPUT_LENGTH} characters.` }, { status: 400 });
      setCorsHeaders(res, origin);
      return res;
  }

  // 4. Call AI Model with Only CallMytx Tool Support
  try {
    const result = await streamText({
      model: geminiProModel,
      system: `You are Anna, The Personal AI Assistant by Heybos. You are very kind, helpful and smart. You can answer any question, you use NLP and Psychology to answer relevantly. If needed, you use humor and human slang.

Your one and only mission is to answer the user relevantly and decide if tools are needed to accomplish the user request. 

CRITICAL RULE: You must use the CallMytx tool for ANY request that involves taking action, even if details are missing. Do NOT ask for clarification - use CallMytx and let the Mytx agent handle gathering additional details.

IMPORTANT: When you use the CallMytx tool, do NOT provide any additional text response. The userAnswer parameter in the tool call will be displayed to the user. Only provide text responses when NOT using tools.

Use CallMytx for:
- Adding, creating, managing, or organizing tasks (even with minimal details)
- Remembering, saving, or storing any information/memories  
- Searching the web or getting external information
- Sending messages or communications
- Flight bookings, reservations, or travel planning
- Meditation creation or management
- Any action that requires data storage or external services
- Complex planning or organization requests

ONLY respond directly (without tools) for:
- Simple greetings and casual conversation
- General knowledge questions that don't require storage
- Basic explanations or definitions  
- Emotional support or encouragement

Examples:
- "תוסיף לי משימה לקנות חלב" → USE CallMytx (action needed) - NO additional text
- "תזכור לי שיש לי פגישה מחר" → USE CallMytx (memory storage needed) - NO additional text
- "חפש לי מידע על מזג האויר" → USE CallMytx (external search needed) - NO additional text
- "איך מעירים?" → Answer directly (greeting) - provide text response
- "מה זה בינה מלאכותית?" → Answer directly (general knowledge) - provide text response

When you use CallMytx:
1. userAnswer: Give an immediate friendly response showing you're handling their request (this will be shown to the user)
2. mytxRequest: Clearly describe what action needs to be taken, even if details are missing
3. originalMessage: Quote their exact message
4. Do NOT provide any additional text response - the userAnswer parameter will be displayed

For simple conversations, respond directly without using any tools.

Today's date is ${new Date().toLocaleDateString()}.`,
      messages: coreMessages,
      tools: {
        CallMytx: {
          description: "Call the Mytx agent to handle complex tasks that go beyond regular conversation. Use this when the user needs: task management, memory operations, flight booking, meditation, web search, sending messages, or any action-based request.",
          parameters: z.object({
            userAnswer: z.string().describe("A friendly, conversational response to show the user while the request is being processed. Keep it encouraging and let them know you're working on their request."),
            mytxRequest: z.string().describe("A clear, detailed request for the Mytx agent based on the user's message. Include all relevant context and specify exactly what action needs to be taken."),
            originalMessage: z.string().describe("The exact original message from the user, quoted as-is."),
          }),
          execute: async ({ userAnswer, mytxRequest, originalMessage }) => {
            try {
              console.log(`[Anna CallMytx] Processing request for user ${uid}`);
              console.log(`[Anna CallMytx] User Answer: ${userAnswer}`);
              console.log(`[Anna CallMytx] Mytx Request: ${mytxRequest}`);
              
              // Use the callMytxAction function from anna-actions.ts
              const result = await callMytxAction({
                userAnswer,
                mytxRequest,
                originalMessage
              });
              
              console.log(`[Anna CallMytx] Action result:`, result);
              
              // Build the full request for Mytx including context
              const fullMytxRequest = `User Request: "${originalMessage}"
              
Task for Mytx Agent: ${mytxRequest}

Context: This request came from Anna (simple assistant) and needs to be handled by the full Mytx system with all available tools and capabilities.`;

              // Call the main chat endpoint and handle streaming response
              const mytxResponse = await fetch(`${BASE_URL}/api/heybos/chat`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': request.headers.get('Authorization') || '',
                  'Origin': request.headers.get('Origin') || '',
                },
                body: JSON.stringify({
                  messages: [
                    {
                      role: 'user',
                      content: fullMytxRequest
                    }
                  ]
                }),
              });

              if (!mytxResponse.ok) {
                console.error(`[Anna CallMytx] Mytx API call failed: ${mytxResponse.status}`);
                return {
                  type: 'error',
                  userAnswer: userAnswer,
                  mytxResponse: "I encountered an issue while processing your request. Please try again in a moment.",
                  showCapabilityMissing: false
                };
              }

              // Read the streaming response from Mytx
              let mytxContent = "";
              let mytxToolInvocations = [];
              
              try {
                const reader = mytxResponse.body?.getReader();
                const decoder = new TextDecoder();
                let buffer = '';

                if (reader) {
                  while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                      if (line.trim() === '') continue;
                      
                      if (line.startsWith('0:')) {
                        // Text chunks
                        try {
                          const textPart = JSON.parse(line.substring(2));
                          if (typeof textPart === 'string') {
                            mytxContent += textPart;
                          }
                        } catch (e) {
                          // Ignore parse errors
                        }
                      } else if (line.startsWith('9:') || line.startsWith('a:')) {
                        // Tool invocations
                        try {
                          const toolData = JSON.parse(line.substring(2));
                          mytxToolInvocations.push(toolData);
                        } catch (e) {
                          // Ignore parse errors
                        }
                      }
                    }
                  }
                }
              } catch (streamError) {
                console.error('[Anna CallMytx] Error reading Mytx stream:', streamError);
              }

              // Check if Mytx couldn't fulfill the request
              const isCapabilityMissing = mytxContent && (
                mytxContent.includes("I am sorry, I cannot fulfill this request") ||
                mytxContent.includes("I don't have the ability") ||
                mytxContent.includes("I cannot") ||
                mytxContent.includes("I'm unable to") ||
                mytxToolInvocations.length === 0
              );

              console.log(`[Anna CallMytx] Capability missing: ${isCapabilityMissing}`);

              if (isCapabilityMissing) {
                // For capability missing, return a special result that will trigger the UI
                return {
                  type: 'capability_missing',
                  userAnswer: userAnswer,
                  originalMessage: originalMessage,
                  mytxResponse: mytxContent,
                  showCapabilityMissing: true
                };
              } else {
                // For successful operations, we need to inject the Mytx tool invocations
                // into the current stream context so they get processed by TheBaze
                console.log(`[Anna CallMytx] Injecting ${mytxToolInvocations.length} tool invocations from Mytx`);
                
                // Return special object that will be processed by the streaming system
                return {
                  type: 'success',
                  userAnswer: userAnswer,
                  mytxResponse: mytxContent,
                  mytxToolInvocations: mytxToolInvocations,
                  originalMessage: originalMessage,
                  showCapabilityMissing: false,
                  // Special flag to indicate that tool invocations should be injected
                  injectToolInvocations: true
                };
              }

            } catch (error) {
              console.error('[Anna CallMytx] Error calling Mytx:', error);
              return {
                type: 'error',
                userAnswer: userAnswer,
                mytxResponse: "I encountered an error while processing your request. Please try again.",
                showCapabilityMissing: false
              };
            }
          },
        },
      },
      // Optional: Add telemetry or other options if needed
      experimental_telemetry: {
        isEnabled: true,
        functionId: "anna-simple-chat",
      },
    });

    // 5. Return Streaming Response with Custom Tool Injection
    // We need to intercept the stream to inject Mytx tool invocations when CallMytx returns them
    const originalStream = result.toDataStreamResponse();
    
    // Create a transform stream that can inject tool invocations
    const { readable, writable } = new TransformStream({
      transform(chunk, controller) {
        // Parse the chunk to check for CallMytx tool results
        const chunkText = new TextDecoder().decode(chunk);
        const lines = chunkText.split('\n');
        
        let modifiedChunk = chunkText;
        let shouldInjectTools = false;
        let toolInvocationsToInject: any[] = [];
        
        for (const line of lines) {
          if (line.startsWith('a:') || line.startsWith('9:')) {
            try {
              const toolData = JSON.parse(line.substring(2));
              if (toolData?.result?.injectToolInvocations && toolData?.result?.mytxToolInvocations) {
                shouldInjectTools = true;
                toolInvocationsToInject = toolData.result.mytxToolInvocations;
                console.log(`[Anna Stream] Found tool invocations to inject: ${toolInvocationsToInject.length}`);
                
                // Modify the tool result to only show the userAnswer
                const modifiedResult = {
                  type: 'success',
                  userAnswer: toolData.result.userAnswer,
                  showCapabilityMissing: false
                };
                
                // Replace the line with the modified result
                const newLine = line.substring(0, 2) + JSON.stringify({
                  ...toolData,
                  result: modifiedResult
                });
                modifiedChunk = modifiedChunk.replace(line, newLine);
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
        
        // Send the (possibly modified) chunk
        controller.enqueue(new TextEncoder().encode(modifiedChunk));
        
        // If we need to inject tool invocations, send them as additional chunks
        if (shouldInjectTools && toolInvocationsToInject.length > 0) {
          for (const toolInvocation of toolInvocationsToInject) {
            console.log(`[Anna Stream] Injecting tool invocation:`, toolInvocation);
            
            // Format the tool invocation according to the AI SDK stream format
            const injectedChunk = `a:${JSON.stringify(toolInvocation)}\n`;
            controller.enqueue(new TextEncoder().encode(injectedChunk));
          }
        }
      }
    });
    
    // Pipe the original stream through our transform
    originalStream.body?.pipeTo(writable).catch(error => {
      console.error('[Anna Stream] Stream error:', error);
    });
    
    const nextStreamResponse = new NextResponse(readable, {
      status: originalStream.status,
      statusText: originalStream.statusText,
      headers: originalStream.headers,
    });
    setCorsHeaders(nextStreamResponse, origin);
    return nextStreamResponse;

  } catch (error: any) {
    console.error("[Firebase Chat API POST] Error calling AI model:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error during AI processing";
    const res = NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
    setCorsHeaders(res, origin);
    return res;
  }
}
// --- End POST Handler ---