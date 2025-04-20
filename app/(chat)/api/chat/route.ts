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
  saveMemoryAction,
  recallMemoriesAction,
  forgetMemoryAction,
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

// Initialize Upstash Redis client and Ratelimit
// Use existing Vercel KV environment variables instead of UPSTASH_REDIS_REST_* variables
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.KV_URL || '',
  token: process.env.KV_REST_API_TOKEN || ''
});
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(200, "1 d"), // 200 requests per 1 day
  analytics: true,
  prefix: "@upstash/ratelimit",
});

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
  const { success, limit, remaining, reset } = await ratelimit.limit(userId);

  // Prepare headers for both success and failure cases
  const rateLimitHeaders = {
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
          - mark a task as complete
        - here's the optimal memory management flow
          - save a memory (e.g., "Remember my favorite color is blue")
          - recall memories (e.g., "What do you remember?", "What is my favorite color?")
          - forget a memory: 
            - If the user asks to forget something specific (e.g., "forget my name", "forget my favorite color"), FIRST use the recallMemories tool internally (don't show the user the full list yet). 
            - Check if the recalled memories contain a SINGLE, clear match for the user's request. 
            - If ONE match is found, ask the user for confirmation: "Are you sure you want me to forget that [memory content]? (ID: [memory ID])". 
            - If the user confirms, THEN use the forgetMemory tool with that specific ID. 
            - If there are multiple matches, no matches, or the user's request was vague (e.g., "forget something"), THEN use the recallMemories tool to show the user the list and ask them to provide the ID for the forgetMemory tool.
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
        description: "Add a new task to the user's task list.",
        parameters: z.object({
          taskDescription: z.string().describe(
            "The description of the task to add.",
          ),
        }),
        execute: async ({ taskDescription }) => {
          return await addTaskAction({ taskDescription });
        },
      },
      listTasks: {
        description: "List all the user's current tasks.",
        parameters: z.object({}),
        execute: async () => {
          return await listTasksAction();
        },
      },
      markTaskComplete: {
        description: "Mark a specific task as complete.",
        parameters: z.object({
          taskId: z.string().describe("The ID of the task to mark as complete."),
        }),
        execute: async ({ taskId }) => {
          return await markTaskCompleteAction({ taskId });
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
          return await forgetMemoryAction({ memoryId, userId });
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
