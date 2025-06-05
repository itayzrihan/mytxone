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
  deleteTaskById,
  createMeditation,
  getMeditationsByUserId,
  getMeditationById,
  deleteMeditationById
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
  console.log(`Action: Creating meditation "${title}" of type ${type} for user ${userId}`);
  try {
    const meditation = await createMeditation({ userId, type, title, content, duration });
    return { 
      meditationId: meditation[0]?.id, 
      type: meditation[0]?.type,
      title: meditation[0]?.title,
      content: meditation[0]?.content,
      duration: meditation[0]?.duration,
      status: "created" as const 
    };
  } catch (error) {
    console.error("Error in createMeditationAction:", error);
    return { error: "Failed to create meditation." };
  }
}

export async function listMeditationsAction({
  userId,
}: {
  userId: string;
}) {
  console.log(`Action: Listing meditations for user ${userId}`);
  try {
    const userMeditations = await getMeditationsByUserId({ userId });
    return { 
      meditations: userMeditations.map(meditation => ({
        meditationId: meditation.id,
        type: meditation.type,
        title: meditation.title,
        duration: meditation.duration,
        createdAt: meditation.createdAt
      }))
    };
  } catch (error) {
    console.error("Error in listMeditationsAction:", error);
    return { error: "Failed to list meditations." };
  }
}

export async function getMeditationAction({
  meditationId,
  userId,
}: {
  meditationId: string;
  userId: string;
}) {
  console.log(`Action: Getting meditation ${meditationId} for user ${userId}`);
  try {
    const meditation = await getMeditationById({ id: meditationId, userId });
    if (!meditation) {
      return { error: "Meditation not found." };
    }
    return { 
      meditationId: meditation.id,
      type: meditation.type,
      title: meditation.title,
      content: meditation.content,
      duration: meditation.duration,
      createdAt: meditation.createdAt
    };
  } catch (error) {
    console.error("Error in getMeditationAction:", error);
    return { error: "Failed to get meditation." };
  }
}

export async function deleteMeditationAction({
  meditationId,
  userId,
}: {
  meditationId: string;
  userId: string;
}) {
  console.log(`Action: Deleting meditation ${meditationId} for user ${userId}`);
  try {
    await deleteMeditationById({ id: meditationId, userId });
    return { meditationId, status: "deleted" as const };
  } catch (error) {
    console.error("Error in deleteMeditationAction:", error);
    return { error: "Failed to delete meditation." };
  }
}

export async function generateMeditationContentAction({
  type,
  intention,
  chatHistory,
  duration = "10 minutes",
}: {
  type: string;
  intention?: string;
  chatHistory?: string;
  duration?: string;
}) {
  console.log(`Action: Generating ${type} meditation content`);
  try {
    const contextPrompt = chatHistory 
      ? `Based on this chat history: ${chatHistory.slice(-1000)}` // Use last 1000 chars
      : intention 
      ? `Based on this intention: ${intention}`
      : `Create a general ${type} meditation`;    const { object: meditationContent } = await generateObject({
      model: geminiFlashModel,
      prompt: `Generate a ${type} meditation content for ${duration}. ${contextPrompt}. 
      Create a guided meditation that is calming, helpful, and professionally structured.
      
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
      
      Continue this pattern, building a complete 10-minute guided experience that flows naturally for TTS audio.`,
      schema: z.object({
        title: z.string().describe("A meaningful title for the meditation"),
        content: z.string().describe("The complete guided meditation script with clear instructions"),
        estimatedDuration: z.string().describe("Estimated time needed for this meditation"),
        keyBenefits: z.array(z.string()).describe("Key benefits this meditation provides"),
      }),
    });

    return {
      type,
      title: meditationContent.title,
      content: meditationContent.content,
      duration: meditationContent.estimatedDuration,
      keyBenefits: meditationContent.keyBenefits,
      status: "generated" as const
    };
  } catch (error) {
    console.error("Error in generateMeditationContentAction:", error);
    return { error: "Failed to generate meditation content." };
  }
}
