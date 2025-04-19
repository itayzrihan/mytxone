import { generateObject } from "ai";
import { z } from "zod";

import { geminiFlashModel } from ".";
import { generateUUID } from "@/lib/utils"; // Import generateUUID if not already present
import { saveMemory, getMemoriesByUserId, deleteMemoryById } from "@/db/queries"; // Import memory queries

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

// --- Task Management Actions ---

export async function addTaskAction({
  taskDescription,
}: {
  taskDescription: string;
}) {
  console.log(`Action: Adding task: ${taskDescription}`);
  // TODO: Replace with actual database interaction
  // const userId = ... get user ID from session ...
  // await db.insert(tasks).values({ id: generateUUID(), userId, description: taskDescription, status: 'pending' });
  return { taskId: generateUUID(), description: taskDescription, status: "added" as const };
}

export async function listTasksAction() {
  console.log("Action: Listing tasks");
  // TODO: Replace with actual database interaction
  // const userId = ... get user ID from session ...
  // const userTasks = await db.select().from(tasks).where(eq(tasks.userId, userId));
  // return { tasks: userTasks };

  // Return sample data for now
  return {
    tasks: [
      { taskId: "task-1", description: "Buy groceries", status: "pending" as const },
      { taskId: "task-2", description: "Finish report", status: "pending" as const },
      { taskId: "task-3", description: "Call mom", status: "completed" as const },
    ],
  };
}

export async function markTaskCompleteAction({ taskId }: { taskId: string }) {
  console.log(`Action: Marking task ${taskId} as complete`);
  // TODO: Replace with actual database interaction
  // const userId = ... get user ID from session ...
  // await db.update(tasks).set({ status: 'completed' }).where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));
  return { taskId: taskId, status: "completed" as const };
}

// --- Memory Management Actions ---

export async function saveMemoryAction({
  userId,
  content,
}: {
  userId: string;
  content: string;
}) {
  console.log(`Action: Saving memory for user ${userId}: ${content}`);
  try {
    const saved = await saveMemory({ userId, content });
    // Return only the necessary confirmation details
    return { memoryId: saved[0]?.id, content: saved[0]?.content, status: "saved" as const };
  } catch (error) {
    console.error("Error in saveMemoryAction:", error);
    return { error: "Failed to save memory." };
  }
}

export async function recallMemoriesAction({ userId }: { userId: string }) {
  console.log(`Action: Recalling memories for user ${userId}`);
  try {
    const memories = await getMemoriesByUserId({ userId });
    return { memories }; // Return the array of memories
  } catch (error) {
    console.error("Error in recallMemoriesAction:", error);
    return { error: "Failed to recall memories." };
  }
}

export async function forgetMemoryAction({ memoryId, userId }: { memoryId: string; userId: string }) {
  console.log(`Action: Forgetting memory ${memoryId} for user ${userId}`);
  try {
    await deleteMemoryById({ id: memoryId, userId });
    return { memoryId, status: "forgotten" as const }; // Confirmation
  } catch (error) {
    console.error("Error in forgetMemoryAction:", error);
    return { error: "Failed to forget memory." };
  }
}
