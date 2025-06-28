import { convertToCoreMessages, Message, streamText } from "ai";
import admin from 'firebase-admin';
import { decode } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { geminiProModel } from "@/ai"; // Import your configured AI model
import {
  generateReservationPrice,
  generateSampleFlightSearchResults,
  generateSampleFlightStatus,
  generateSampleSeatSelection,
  addTaskAction,
  listTasksAction,
  markTaskCompleteAction,
  deleteTaskAction,
  updateTaskNameAction,
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
} from "@/ai/actions";
import {
  createReservation,
  getReservationById,
} from "@/db/queries";
import { generateUUID } from "@/lib/utils";

// --- Environment Configuration ---
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'development';
const BYPASS_AUTH_FOR_DEV = IS_DEVELOPMENT && (process.env.BYPASS_FIREBASE_AUTH === 'true' || process.env.BYPASS_FIREBASE_AUTH === '1');

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
    return { uid: 'dev-user-bypass', errorResponse: null };
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

  // 4. Call AI Model with Full Tools Support
  try {
    const result = await streamText({
      model: geminiProModel,
      system: `
        - you are also generally helpful and friendly and helping with anything else.
        whenever the user asks if you remember something you should check the memory first. even if the user not explicitly asks you to recall it might be a good idea to try to recall it.
        - you help users book flights, manage their tasks, AND remember information!
        - keep your responses limited to a sentence.
        - DO NOT output lists.
        - after every tool call, pretend you're showing the result to the user and keep your response limited to a phrase.
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
        - here's the optimal task management flow
          - add a task
          - list tasks (automatically show the list after adding or completing a task)
          - mark a task as complete        - here's the optimal memory management flow
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
        getWeather: {
          description: "Get the current weather at a location",
          parameters: z.object({
            latitude: z.number().describe("Latitude coordinate"),
            longitude: z.number().describe("Longitude coordinate"),
          }),
          execute: async ({ latitude, longitude }) => {
            const response = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`,
            );

            const weatherData = await response.json();
            return weatherData;
          },
        },
        displayFlightStatus: {
          description: "Display the status of a flight",
          parameters: z.object({
            flightNumber: z.string().describe("Flight number"),
            date: z.string().describe("Date of the flight"),
          }),
          execute: async ({ flightNumber, date }) => {
            const flightStatus = await generateSampleFlightStatus({
              flightNumber,
              date,
            });

            return flightStatus;
          },
        },
        searchFlights: {
          description: "Search for flights based on the given parameters",
          parameters: z.object({
            origin: z.string().describe("Origin airport or city"),
            destination: z.string().describe("Destination airport or city"),
          }),
          execute: async ({ origin, destination }) => {
            const results = await generateSampleFlightSearchResults({
              origin,
              destination,
            });

            return results;
          },
        },
        selectSeats: {
          description: "Select seats for a flight",
          parameters: z.object({
            flightNumber: z.string().describe("Flight number"),
          }),
          execute: async ({ flightNumber }) => {
            const seats = await generateSampleSeatSelection({ flightNumber });
            return seats;
          },
        },
        createReservation: {
          description: "Display pending reservation details",
          parameters: z.object({
            seats: z.string().array().describe("Array of selected seat numbers"),
            flightNumber: z.string().describe("Flight number"),
            departure: z.object({
              cityName: z.string().describe("Name of the departure city"),
              airportCode: z.string().describe("Code of the departure airport"),
              timestamp: z.string().describe("ISO 8601 date of departure"),
              gate: z.string().describe("Departure gate"),
              terminal: z.string().describe("Departure terminal"),
            }),
            arrival: z.object({
              cityName: z.string().describe("Name of the arrival city"),
              airportCode: z.string().describe("Code of the arrival airport"),
              timestamp: z.string().describe("ISO 8601 date of arrival"),
              gate: z.string().describe("Arrival gate"),
              terminal: z.string().describe("Arrival terminal"),
            }),
            passengerName: z.string().describe("Name of the passenger"),
          }),
          execute: async (props) => {
            const { totalPriceInUSD } = await generateReservationPrice(props);

            const id = generateUUID();

            // Use the Firebase UID for creating reservations in TheBaze context
            if (uid) {
              await createReservation({
                id,
                userId: uid,
                details: { ...props, totalPriceInUSD },
              });

              return { id, ...props, totalPriceInUSD };
            } else {
              return {
                error: "User is not signed in to perform this action!",
              };
            }
          },
        },
        authorizePayment: {
          description:
            "User will enter credentials to authorize payment, wait for user to repond when they are done",
          parameters: z.object({
            reservationId: z
              .string()
              .describe("Unique identifier for the reservation"),
          }),
          execute: async ({ reservationId }) => {
            return { reservationId };
          },
        },
        verifyPayment: {
          description: "Verify payment status",
          parameters: z.object({
            reservationId: z
              .string()
              .describe("Unique identifier for the reservation"),
          }),
          execute: async ({ reservationId }) => {
            const reservation = await getReservationById({ id: reservationId });

            if (reservation.hasCompletedPayment) {
              return { hasCompletedPayment: true };
            } else {
              return { hasCompletedPayment: false };
            }
          },
        },
        displayBoardingPass: {
          description: "Display a boarding pass",
          parameters: z.object({
            reservationId: z
              .string()
              .describe("Unique identifier for the reservation"),
            passengerName: z
              .string()
              .describe("Name of the passenger, in title case"),
            flightNumber: z.string().describe("Flight number"),
            seat: z.string().describe("Seat number"),
            departure: z.object({
              cityName: z.string().describe("Name of the departure city"),
              airportCode: z.string().describe("Code of the departure airport"),
              airportName: z.string().describe("Name of the departure airport"),
              timestamp: z.string().describe("ISO 8601 date of departure"),
              terminal: z.string().describe("Departure terminal"),
              gate: z.string().describe("Departure gate"),
            }),
            arrival: z.object({
              cityName: z.string().describe("Name of the arrival city"),
              airportCode: z.string().describe("Code of the arrival airport"),
              airportName: z.string().describe("Name of the arrival airport"),
              timestamp: z.string().describe("ISO 8601 date of arrival"),
              terminal: z.string().describe("Arrival terminal"),
              gate: z.string().describe("Arrival gate"),
            }),
          }),
          execute: async (boardingPass) => {
            return boardingPass;
          },
        },
        addTask: {
          description:
            "Add a task for the user to complete later.",
          parameters: z.object({
            taskDescription: z.string().describe(
              "Description of the task to add.",
            ),
          }),
          execute: async ({ taskDescription }) => {
            return await addTaskAction({ taskDescription, userId: uid });
          },
        },
        listTasks: {
          description:
            "List all tasks for the user, including pending and completed tasks.",
          parameters: z.object({}),
          execute: async () => {
            return await listTasksAction({ userId: uid });
          },
        },
        markTaskComplete: {
          description: "Mark a specific task as complete or incomplete. If the task is already completed, it will be marked as incomplete instead.",
          parameters: z.object({
            taskId: z.string().describe("The ID of the task to toggle completion status."),
            setComplete: z.boolean().optional().describe("Optional: true to mark as complete, false to mark as incomplete. If not provided, the status will be toggled."),
          }),
          execute: async ({ taskId, setComplete }) => {
            return await markTaskCompleteAction({ taskId, userId: uid, setComplete });
          },
        },
        deleteTask: {
          description: "Delete a specific task.",
          parameters: z.object({
            taskId: z.string().describe("The ID of the task to delete."),
          }),
          execute: async ({ taskId }) => {
            return await deleteTaskAction({ taskId, userId: uid });
          },
        },
        updateTaskName: {
          description: "Update the name/description of an existing task.",
          parameters: z.object({
            taskId: z.string().describe("The ID of the task to update."),
            newDescription: z.string().describe("The new description for the task."),
          }),
          execute: async ({ taskId, newDescription }) => {
            return await updateTaskNameAction({ taskId, userId: uid, newDescription });
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
            return await saveMemoryAction({ userId: uid, content });
          },
        },
        recallMemories: {
          description:
            "Recall all pieces of information previously saved by the user. Also used internally to find a specific memory before forgetting.",
          parameters: z.object({}),
          execute: async () => {
            return await recallMemoriesAction({ userId: uid });
          },
        },      forgetMemory: {
          description:
            "Forget a specific piece of information previously saved. Requires the memory ID. Usually, you should recall memories first to find the correct ID and ask for user confirmation if a specific memory was requested to be forgotten.",
          parameters: z.object({
            memoryId: z.string().describe(
              "The unique ID of the memory to forget.",
            ),
          }),
          execute: async ({ memoryId }) => {
            return await forgetMemoryAction({ memoryId, userId: uid });
          },      },
        showMeditationTypeSelector: {
          description: "Show UI cards with different meditation types for the user to select from. Use this when user asks for meditation or you recognize they might need one.",
          parameters: z.object({}),
          execute: async () => {
            return await showMeditationTypeSelectorAction();
          },
        },      showMeditationPromptSelector: {
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
        },      generateMeditationContent: {
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
            return await createMeditationAction({ userId: uid, type, title, content, duration });
          },
        },
        listMeditations: {
          description: "List all saved meditations for the user.",
          parameters: z.object({}),
          execute: async () => {
            return await listMeditationsAction({ userId: uid });
          },
        },
        getMeditation: {
          description: "Get the full content of a specific saved meditation.",
          parameters: z.object({
            meditationId: z.string().describe("The ID of the meditation to retrieve"),
          }),
          execute: async ({ meditationId }) => {
            return await getMeditationAction({ meditationId, userId: uid });
          },
        },      deleteMeditation: {
          description: "Delete a specific saved meditation.",
          parameters: z.object({
            meditationId: z.string().describe("The ID of the meditation to delete"),
          }),
          execute: async ({ meditationId }) => {
            return await deleteMeditationAction({ meditationId, userId: uid });
          },
        },      generateMeditationAudio: {
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
      },
      // Optional: Add telemetry or other options if needed
      experimental_telemetry: {
        isEnabled: true,
        functionId: "heybos-stream-text",
      },
    });

    // 5. Return Streaming Response
    // Apply CORS headers to the actual response stream
    const streamResponse = result.toDataStreamResponse();
    const nextStreamResponse = new NextResponse(streamResponse.body, {
      status: streamResponse.status,
      statusText: streamResponse.statusText,
      headers: streamResponse.headers,
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