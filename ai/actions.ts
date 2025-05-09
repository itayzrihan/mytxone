import { generateObject } from "ai";
import { z } from "zod";

import { geminiFlashModel } from ".";
import { generateUUID } from "@/lib/utils";
import { 
  saveMemory, 
  getMemoriesByUserId, 
  deleteMemoryById,
  addTask,
  getTasksByUserId,
  updateTaskStatus,
  updateTaskDescription,
  deleteTaskById
} from "@/db/queries";

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
  userId,
}: {
  taskDescription: string;
  userId: string;
}) {
  console.log(`Action: Adding task: ${taskDescription} for user ${userId}`);
  try {
    const task = await addTask({ userId, description: taskDescription });
    return { 
      taskId: task[0]?.id, 
      description: task[0]?.description, 
      status: "added" as const 
    };
  } catch (error) {
    console.error("Error in addTaskAction:", error);
    return { error: "Failed to add task." };
  }
}

export async function listTasksAction({
  userId,
}: {
  userId: string;
}) {
  console.log(`Action: Listing tasks for user ${userId}`);
  try {
    const userTasks = await getTasksByUserId({ userId });
    return { 
      tasks: userTasks.map(task => ({
        taskId: task.id,
        description: task.description,
        status: task.status as "pending" | "completed"
      }))
    };
  } catch (error) {
    console.error("Error in listTasksAction:", error);
    return { error: "Failed to list tasks." };
  }
}

export async function markTaskCompleteAction({ 
  taskId,
  userId,
  setComplete = true,
}: { 
  taskId: string;
  userId: string;
  setComplete?: boolean;
}) {
  const action = setComplete ? "complete" : "incomplete";
  const status = setComplete ? "completed" : "pending";
  
  console.log(`Action: Marking task ${taskId} as ${action} for user ${userId}`);
  try {
    await updateTaskStatus({ id: taskId, userId, status });
    return { taskId, status: status as "completed" | "pending" };
  } catch (error) {
    console.error(`Error in markTaskCompleteAction:`, error);
    return { error: `Failed to mark task as ${action}.` };
  }
}

export async function deleteTaskAction({
  taskId,
  userId,
}: {
  taskId: string;
  userId: string;
}) {
  console.log(`Action: Deleting task ${taskId} for user ${userId}`);
  try {
    await deleteTaskById({ id: taskId, userId });
    return { taskId, status: "deleted" as const };
  } catch (error) {
    console.error("Error in deleteTaskAction:", error);
    return { error: "Failed to delete task." };
  }
}

export async function updateTaskNameAction({ 
  taskId,
  userId,
  newDescription,
}: { 
  taskId: string;
  userId: string;
  newDescription: string;
}) {
  console.log(`Action: Updating task ${taskId} name to "${newDescription}" for user ${userId}`);
  try {
    await updateTaskDescription({ id: taskId, userId, description: newDescription });
    return { taskId, description: newDescription, status: "updated" as const };
  } catch (error) {
    console.error("Error in updateTaskNameAction:", error);
    return { error: "Failed to update task name." };
  }
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
    return { memories };
  } catch (error) {
    console.error("Error in recallMemoriesAction:", error);
    return { error: "Failed to recall memories." };
  }
}

export async function forgetMemoryAction({ memoryId, userId }: { memoryId: string; userId: string }) {
  console.log(`Action: Forgetting memory ${memoryId} for user ${userId}`);
  try {
    await deleteMemoryById({ id: memoryId, userId });
    return { memoryId, status: "forgotten" as const };
  } catch (error) {
    console.error("Error in forgetMemoryAction:", error);
    return { error: "Failed to forget memory." };
  }
}
