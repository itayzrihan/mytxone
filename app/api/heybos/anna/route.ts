import { convertToCoreMessages, Message, streamText } from "ai";
import admin from 'firebase-admin';
import { decode } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { geminiProModel } from "@/ai"; // Import your configured AI model
import { callMytxAction } from "@/ai/heybos-actions/anna-actions";
import { callSingleToolService } from "@/services/callSingleToolService";
import { stepsDesigningService } from "@/services/stepsDesigningService";
import { OperatorService } from "@/services/OperatorService";

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
      system: `You are Anna, The Personal AI Assistant by Heybos. You are a helpful, friendly, and intelligent assistant with a natural, conversational tone. You speak like a real person - not overly enthusiastic or robotic.

Your communication style:
- Be genuine and authentic in your responses
- Use natural phrases like "Sure, I'll try to help you with that", "Let me see what I can do", "I'll do my best to assist you"
- Avoid being overly optimistic or using excessive exclamation marks
- Be encouraging but realistic about what you can accomplish
- Show empathy and understanding when appropriate

Your mission is to answer the user relevantly and intelligently decide which tool is needed to accomplish the user request based on complexity analysis.

COMPLEXITY ANALYSIS: First analyze if the request requires single or multiple steps:

**SINGLE STEP OPERATIONS (Use CallMytx):**
- Add one task (simple creation)
- Find/search for existing tasks, memories, or information  
- List or display tasks
- Simple deletions with clear identification
- Basic memory storage
- Simple meditation creation
- Weather lookup
- Any action that requires only ONE step to complete

**MULTI-STEP COMPLEX OPERATIONS (Use CallStepsDesigning):**
- Delete a specific task by name/description (requires: search → identify → confirm → delete)
- Edit/update tasks with new information (requires: find → select → gather details → update → verify)
- Add AND remove memories in same request (requires: multiple operations)
- Complex task management with multiple operations
- Operations that require confirmation or verification steps
- Any request that clearly needs multiple steps to complete safely

IMPORTANT: When you use ANY tool, do NOT provide additional text response. The userAnswer parameter will be displayed to the user.

**Tool Usage Rules:**

For CallMytx (Single step operations):
1. userAnswer: "Sure, I'll help you with that" or similar friendly response
2. mytxRequest: Clear description of the single action needed
3. originalMessage: Exact user message

For CallStepsDesigning (Multi-step operations):
1. userAnswer: "Let me break this down into steps for you" or similar planning response
2. stepsRequest: Detailed description of the complex operation that needs step-by-step planning
3. originalMessage: Exact user message

**Examples:**
- "תוסיף לי משימה לקנות חלב" → CallMytx (single add action)
- "תראי לי משימות עם המילה ארגון" → CallMytx (single search action)
- "תציגי אותן" → CallMytx (single display action)
- "חפש לי משימה עם המילה ריצה" → CallMytx (single search action)
- "תמחק משימה שנקראת לרוץ 2 קילומטר" → CallStepsDesigning (multi-step: search → identify → confirm → delete)
- "תערוך משימה ותשנה אותה לאכול פירות" → CallStepsDesigning (multi-step: find → select → update → verify)
- "תוסיף זיכרון ותמחק זיכרון" → CallStepsDesigning (multiple operations)

ONLY respond directly (without tools) for:
- Simple greetings and casual conversation
- General knowledge questions
- Basic explanations or definitions
- Emotional support or encouragement

Today's date is ${new Date().toLocaleDateString()}.`,
      messages: coreMessages,
      tools: {
        CallMytx: {
          description: "Call the Mytx agent to handle SINGLE STEP operations that require immediate action. Use this for simple task additions, searches, memory storage, or other single-action requests.",
          parameters: z.object({
            userAnswer: z.string().describe("A natural, conversational response to show the user while the request is being processed. Use phrases like 'Sure, I'll help you with that', 'Let me take care of this for you', 'I'll do my best to assist you with that'. Be genuine and friendly, not overly enthusiastic."),
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

              // Return Anna's message and Mytx request info - the streaming handler will process this
              return {
                type: 'anna_then_mytx',
                userAnswer: userAnswer,
                mytxRequest: mytxRequest,
                originalMessage: originalMessage,
                annaProcessed: true
              };

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
        CallStepsDesigning: {
          description: "Call the StepsDesigning agent to handle COMPLEX MULTI-STEP operations that require careful planning and multiple phases. Use this for complex task deletions by name, task editing, multiple operations, or any request that clearly needs several steps to complete safely.",
          parameters: z.object({
            userAnswer: z.string().describe("A natural, conversational response to show the user while the request is being processed. Use phrases like 'Let me break this down into steps for you', 'I'll create a detailed plan for that', 'Let me structure this process for you'. Be genuine and helpful, indicating you're providing planning assistance."),
            stepsRequest: z.string().describe("A clear, detailed description of the complex operation that needs step-by-step planning. Include all relevant context and specify exactly what multi-step process needs to be broken down."),
            originalMessage: z.string().describe("The exact original message from the user, quoted as-is."),
          }),
          execute: async ({ userAnswer, stepsRequest, originalMessage }) => {
            try {
              console.log(`[Anna CallStepsDesigning] Processing complex request for user ${uid}`);
              console.log(`[Anna CallStepsDesigning] User Answer: ${userAnswer}`);
              console.log(`[Anna CallStepsDesigning] Steps Request: ${stepsRequest}`);
              
              // Don't call StepsDesigning here - just return the request info for streaming
              // The actual StepsDesigning call will happen during streaming
              return {
                type: 'anna_then_steps',
                userAnswer: userAnswer,
                stepsRequest: stepsRequest,
                originalMessage: originalMessage,
                annaProcessed: true
              };

            } catch (error) {
              console.error('[Anna CallStepsDesigning] Error in steps preparation:', error);
              return {
                type: 'error',
                userAnswer: userAnswer,
                stepsResponse: "I encountered an error while preparing the step-by-step plan. Please try again.",
                showStepsPlanning: false
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

    // 5. Return Streaming Response with Custom Tool Injection and Steps Handling
    // We need to intercept the stream to handle both CallMytx tool injections and StepsDesigning results
    const originalStream = result.toDataStreamResponse();

    // Custom streaming for anna_then_mytx: stream Anna, then Mytx
    const toolResults = await result.toolResults;
    const toolResult = toolResults?.[0]?.result;
    // Custom streaming for single-step (CallMytx) and multi-step (CallStepsDesigning) results
    if (toolResult && (toolResult.type === 'anna_then_mytx' || toolResult.type === 'anna_then_steps')) {
      const readable = new ReadableStream({
        async start(controller) {
          // 1. Anna agent start marker
          controller.enqueue(new TextEncoder().encode(
            `agent_start:${JSON.stringify({
              agentName: 'Anna',
              messageId: `anna-${Date.now()}`,
              timestamp: new Date().toISOString()
            })}\n`
          ));
          // 2. Anna's userAnswer as text chunks
          const userAnswer = (toolResult as any).userAnswer;
          const chunkSize = 20;
          for (let i = 0; i < userAnswer.length; i += chunkSize) {
            const textChunk = userAnswer.substring(i, i + chunkSize);
            const streamChunk = `0:${JSON.stringify(textChunk)}\n`;
            controller.enqueue(new TextEncoder().encode(streamChunk));
          }
          // 3. Anna agent end marker
          controller.enqueue(new TextEncoder().encode(
            `agent_end:${JSON.stringify({ agentName: 'Anna' })}\n`
          ));

          if (toolResult.type === 'anna_then_mytx') {
            // Add a short delay to ensure frontend processes agent_end before next agent_start
            await new Promise((resolve) => setTimeout(resolve, 10));
            // 4. Mytx agent start marker
            controller.enqueue(new TextEncoder().encode(
              `agent_start:${JSON.stringify({
                agentName: 'Mytx Agent',
                messageId: `mytx-${Date.now()}`,
                timestamp: new Date().toISOString()
              })}\n`
            ));
            // 5. Call Mytx and stream its response
            const mytxRequest = (toolResult as any).mytxRequest;
            const originalMessage = (toolResult as any).originalMessage;
            const fullMytxRequest = `User Request: "${originalMessage}"
\nTask for Mytx Agent: ${mytxRequest}\n\nContext: This request came from Anna (simple assistant) and needs to be handled by the full Mytx system with all available tools and capabilities.`;
            const mytxResult = await callSingleToolService({
              messages: [{ role: 'user' as const, content: fullMytxRequest }],
              uid: uid || '00000000-0000-0000-0000-000000000000'
            });

            if (mytxResult && mytxResult.success && mytxResult.stream) {
              try {
                const reader = mytxResult.stream.getReader();
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  if (value) {
                    controller.enqueue(value);
                  }
                }
              } catch (err) {
                console.error('[Anna->Mytx] Error streaming Mytx agent response:', err);
              }
            } else {
              // If no stream, send a fallback error message
              const errorMsg = mytxResult && mytxResult.error ? mytxResult.error : 'No response from Mytx agent.';
              controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify(errorMsg)}\n`));
            }
            controller.enqueue(new TextEncoder().encode(
              `agent_end:${JSON.stringify({ agentName: 'Mytx Agent' })}\n`
            ));
            controller.close();
          } else if (toolResult.type === 'anna_then_steps') {
            // Start StepsDesigning in real-time after Anna's message is sent
            // Add a short delay to ensure frontend processes agent_end before next agent_start
            await new Promise((resolve) => setTimeout(resolve, 10));
            
            // 4. StepsDesigning agent start marker
            controller.enqueue(new TextEncoder().encode(
              `agent_start:${JSON.stringify({
                agentName: 'StepsDesigning',
                messageId: `steps-${Date.now()}`,
                timestamp: new Date().toISOString()
              })}\n`
            ));

            // 5. Call StepsDesigning service and get full plan, then stream short summary
            try {
              const stepsRequest = (toolResult as any).stepsRequest;
              const originalMessage = (toolResult as any).originalMessage;
              
              // Build the full request for StepsDesigning agent
              const fullStepsRequest = `User Request: "${originalMessage}"
              
Complex Operation for StepsDesigning Agent: ${stepsRequest}

Context: This request came from Anna and requires multi-step planning and detailed guidance for safe completion.`;

              // Call the stepsDesigningService to get the full plan
              const stepsResult = await stepsDesigningService({
                messages: [
                  {
                    role: 'user' as const,
                    content: fullStepsRequest
                  }
                ],
                uid: uid || '00000000-0000-0000-0000-000000000000',
                userAnswer: (toolResult as any).userAnswer,
                originalMessage: originalMessage
              });

              let fullStepsContent = "";
              
              if (stepsResult.success && stepsResult.stream) {
                // Read the full StepsDesigning response
                const reader = stepsResult.stream.getReader();
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
                          fullStepsContent += textPart;
                        }
                      } catch (e) {
                        // Ignore parse errors
                      }
                    }
                  }
                }

                // Stream a short summary instead of the full plan
                const shortSummary = `I've analyzed your request to find and delete work-related tasks. Here's my plan:

1. **Search Phase**: Scan all tasks for work-related keywords
2. **Review Phase**: Present findings for your confirmation  
3. **Deletion Phase**: Remove confirmed tasks safely
4. **Verification Phase**: Confirm successful completion

Passing this detailed plan to Operator Agent for execution...`;

                // Stream the short summary in chunks
                const summaryChunks = shortSummary.split('\n');
                for (const chunk of summaryChunks) {
                  if (chunk.trim().length > 0) {
                    controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify(chunk + '\n')}\n`));
                    await new Promise((resolve) => setTimeout(resolve, 50)); // Small delay for readability
                  }
                }
              } else {
                // If no stream, send a fallback error message
                const errorMsg = stepsResult.error || 'Unable to create step-by-step plan.';
                controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify(errorMsg)}\n`));
                fullStepsContent = errorMsg;
              }

              // End StepsDesigning agent
              controller.enqueue(new TextEncoder().encode(
                `agent_end:${JSON.stringify({ agentName: 'StepsDesigning' })}\n`
              ));

              // Start Operator Agent
              await new Promise((resolve) => setTimeout(resolve, 100)); // Longer delay before next agent
              controller.enqueue(new TextEncoder().encode(
                `agent_start:${JSON.stringify({
                  agentName: 'Operator Agent',
                  messageId: `operator-${Date.now()}`,
                  timestamp: new Date().toISOString()
                })}\n`
              ));

              // Call Operator service to generate confirmation message
              const operatorResult = await OperatorService({
                messages: [
                  {
                    role: 'user' as const,
                    content: `Plan received from StepsDesigning Agent for: "${originalMessage}"`
                  }
                ],
                uid: uid || '00000000-0000-0000-0000-000000000000',
                userAnswer: (toolResult as any).userAnswer,
                originalMessage: originalMessage,
                stepsContent: fullStepsContent
              });

              if (operatorResult.success && operatorResult.stream) {
                try {
                  const reader = operatorResult.stream.getReader();
                  while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    if (value) {
                      controller.enqueue(value);
                    }
                  }
                } catch (err) {
                  console.error('[Anna->StepsDesigning->Operator] Error streaming Operator agent response:', err);
                }
              } else {
                // Fallback message if Operator service fails
                const fallbackMsg = `✅ Steps plan received successfully!

I've got the detailed step-by-step plan from StepsDesigning Agent. Ready to proceed when you give the go-ahead! 🚀`;
                const fallbackChunks = fallbackMsg.split('\n');
                for (const chunk of fallbackChunks) {
                  controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify(chunk + '\n')}\n`));
                  await new Promise((resolve) => setTimeout(resolve, 30));
                }
              }

              // End Operator Agent
              controller.enqueue(new TextEncoder().encode(
                `agent_end:${JSON.stringify({ agentName: 'Operator Agent' })}\n`
              ));
              
            } catch (err) {
              console.error('[Anna->StepsDesigning->Operator] Error in multi-agent flow:', err);
              const errorMsg = 'I encountered an error while creating the step-by-step plan. Please try again.';
              controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify(errorMsg)}\n`));
            }

            controller.enqueue(new TextEncoder().encode(
              `agent_end:${JSON.stringify({ agentName: 'StepsDesigning' })}\n`
            ));
            controller.close();
          }
        }
      });
      // Return the streaming response
      const response = new NextResponse(readable);
      setCorsHeaders(response, origin);
      return response;
    }
    // Fallback: return the original stream if not handled above
    const fallbackResponse = new NextResponse(originalStream.body, { status: 200 });
    setCorsHeaders(fallbackResponse, origin);
    return fallbackResponse;
  } catch (error) {
    console.error('[Firebase Chat API POST] Unhandled error:', error);
    const res = NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
    setCorsHeaders(res, origin);
    return res;
  }
}
