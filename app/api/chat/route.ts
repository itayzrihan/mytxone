import { Ratelimit } from "@upstash/ratelimit"; // Add import
import { Redis } from "@upstash/redis"; // Add import
import { convertToCoreMessages, Message, streamText } from "ai";
import { z } from "zod";

import { geminiProModel } from "@/ai";
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
import { auth } from "@/app/(auth)/auth";
import {
  createReservation,
  deleteChatById,
  getChatById,
  getReservationById,
  saveChat,
} from "@/db/queries";
import { generateUUID } from "@/lib/utils";

// Initialize Upstash Redis client and Ratelimit conditionally
// Use existing Vercel KV environment variables instead of UPSTASH_REDIS_REST_* variables
const REDIS_URL = process.env.KV_REST_API_URL || process.env.KV_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN;
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

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
      limiter: Ratelimit.slidingWindow(200, "1 d"), // 200 requests per 1 day
      analytics: true,
      prefix: "@upstash/ratelimit",
    });
    console.log('[Chat API] Redis rate limiting initialized');
  } catch (error) {
    console.warn('[Chat API] Failed to initialize Redis, rate limiting disabled:', error);
    redis = null;
    ratelimit = null;
  }
} else {
  console.log('[Chat API] Redis credentials not found, rate limiting disabled for development');
}

const MAX_INPUT_LENGTH = 10000; // Define max input length

export async function POST(request: Request) {
  const { id, messages }: { id: string; messages: Array<Message> } =
    await request.json();

  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

  // --- Rate Limiting Logic ---
  let rateLimitHeaders = {};
  
  if (ratelimit) {
    try {
      const { success, limit, remaining, reset } = await ratelimit.limit(userId);

      // Prepare headers for both success and failure cases
      rateLimitHeaders = {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
      };

      if (!success) {
        return new Response("Rate limit exceeded. Please try again later.", {
          status: 429,
          headers: rateLimitHeaders, // Include headers in error response
        });
      }
    } catch (error) {
      console.warn('[Chat API] Rate limiting check failed, proceeding without rate limit:', error);
      // Continue without rate limiting if Redis fails
    }
  } else {
    console.log('[Chat API] Rate limiting disabled - no Redis configuration');
  }
  // --- End Rate Limiting Logic ---

  const coreMessages = convertToCoreMessages(messages).filter(
    (message) => message.content.length > 0,
  );

  // --- Input Length Validation ---
  const userMessagesContent = coreMessages
    .filter((msg) => msg.role === "user")
    .map((msg) => (typeof msg.content === "string" ? msg.content : "")) // Handle potential non-string content just in case
    .join("");

  if (userMessagesContent.length > MAX_INPUT_LENGTH) {
    return new Response(
      `Input exceeds the maximum length of ${MAX_INPUT_LENGTH} characters.`,
      { status: 400 },
    );
  }
  // --- End Input Length Validation ---

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

          if (session && session.user && session.user.id) {
            await createReservation({
              id,
              userId: session.user.id,
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
          return await addTaskAction({ taskDescription, userId });
        },
      },
      listTasks: {
        description:
          "List all tasks for the user, including pending and completed tasks.",
        parameters: z.object({}),
        execute: async () => {
          return await listTasksAction({ userId });
        },
      },
      markTaskComplete: {
        description: "Mark a specific task as complete or incomplete. If the task is already completed, it will be marked as incomplete instead.",
        parameters: z.object({
          taskId: z.string().describe("The ID of the task to toggle completion status."),
          setComplete: z.boolean().optional().describe("Optional: true to mark as complete, false to mark as incomplete. If not provided, the status will be toggled."),
        }),
        execute: async ({ taskId, setComplete }) => {
          return await markTaskCompleteAction({ taskId, userId, setComplete });
        },
      },
      deleteTask: {
        description: "Delete a specific task.",
        parameters: z.object({
          taskId: z.string().describe("The ID of the task to delete."),
        }),
        execute: async ({ taskId }) => {
          return await deleteTaskAction({ taskId, userId });
        },
      },
      updateTaskName: {
        description: "Update the name/description of an existing task.",
        parameters: z.object({
          taskId: z.string().describe("The ID of the task to update."),
          newDescription: z.string().describe("The new description for the task."),
        }),
        execute: async ({ taskId, newDescription }) => {
          return await updateTaskNameAction({ taskId, userId, newDescription });
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
          return await saveMemoryAction({ userId, content });
        },
      },
      recallMemories: {
        description:
          "Recall all pieces of information previously saved by the user. Also used internally to find a specific memory before forgetting.",
        parameters: z.object({}),
        execute: async () => {
          return await recallMemoriesAction({ userId });
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
          return await forgetMemoryAction({ memoryId, userId });
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
          return await createMeditationAction({ userId, type, title, content, duration });
        },
      },
      listMeditations: {
        description: "List all saved meditations for the user.",
        parameters: z.object({}),
        execute: async () => {
          return await listMeditationsAction({ userId });
        },
      },
      getMeditation: {
        description: "Get the full content of a specific saved meditation.",
        parameters: z.object({
          meditationId: z.string().describe("The ID of the meditation to retrieve"),
        }),
        execute: async ({ meditationId }) => {
          return await getMeditationAction({ meditationId, userId });
        },
      },      deleteMeditation: {
        description: "Delete a specific saved meditation.",
        parameters: z.object({
          meditationId: z.string().describe("The ID of the meditation to delete"),
        }),
        execute: async ({ meditationId }) => {
          return await deleteMeditationAction({ meditationId, userId });
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
    onFinish: async ({ responseMessages }) => {
      if (session.user && session.user.id) {
        try {
          await saveChat({
            id,
            messages: [...coreMessages, ...responseMessages],
            userId: session.user.id,
          });
        } catch (error) {
          console.error("Failed to save chat");
        }
      }
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: "stream-text",
    },
  });

  // Return the stream response, adding the rate limit headers
  return result.toDataStreamResponse({ headers: rateLimitHeaders });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await deleteChatById({ id });

    return new Response("Chat deleted", { status: 200 });
  } catch (error) {
    return new Response("An error occurred while processing your request", {
      status: 500,
    });
  }
}
