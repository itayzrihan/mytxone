import { generateObject } from "ai";
import { z } from "zod";

import { geminiFlashModel } from ".";
import { generateUUID } from "@/lib/utils";

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
// These now return instructions for the client to execute locally

export async function addTaskAction({
  taskDescription,
  userId,
}: {
  taskDescription: string;
  userId: string;
}) {
  console.log(`Action: Adding task instruction: ${taskDescription} for user ${userId}`);
  // Return instruction for TheBaze to handle locally
  return { 
    action: "addTask",
    description: taskDescription,
    status: "added" as const,
    message: `I'll add "${taskDescription}" to your tasks.`
  };
}

export async function listTasksAction({
  userId,
}: {
  userId: string;
}) {
  console.log(`Action: Listing tasks instruction for user ${userId}`);
  // Return instruction for TheBaze to handle locally
  return { 
    action: "listTasks",
    status: "listed" as const,
    message: "Here are your current tasks:"
  };
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
  console.log(`Action: Marking task ${taskId} as ${action} instruction for user ${userId}`);
  // Return instruction for TheBaze to handle locally
  return { 
    action: "markTaskComplete",
    taskId,
    setComplete,
    status: setComplete ? "completed" : "pending" as const,
    message: `I'll mark that task as ${action}.`
  };
}

export async function deleteTaskAction({
  taskId,
  userId,
}: {
  taskId: string;
  userId: string;
}) {
  console.log(`Action: Deleting task ${taskId} instruction for user ${userId}`);
  // Return instruction for TheBaze to handle locally
  return { 
    action: "deleteTask",
    taskId,
    status: "deleted" as const,
    message: "I'll delete that task for you."
  };
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
  console.log(`Action: Updating task ${taskId} name instruction to "${newDescription}" for user ${userId}`);
  // Return instruction for TheBaze to handle locally
  return { 
    action: "updateTaskName",
    taskId,
    newDescription,
    status: "updated" as const,
    message: `I'll update that task to "${newDescription}".`
  };
}

// --- Memory Management Actions ---
// These now return instructions for the client to execute locally

export async function saveMemoryAction({
  userId,
  content,
}: {
  userId: string;
  content: string;
}) {
  console.log(`Action: Saving memory instruction for user ${userId}: ${content}`);
  // Return instruction for TheBaze to handle locally
  return { 
    action: "saveMemory",
    content: content, 
    status: "saved" as const,
    message: `I'll remember that: "${content}"`
  };
}

export async function recallMemoriesAction({ userId }: { userId: string }) {
  console.log(`Action: Recalling memories instruction for user ${userId}`);
  // Return instruction for TheBaze to handle locally
  return { 
    action: "recallMemories",
    status: "recalled" as const,
    message: "Let me check what I remember..."
  };
}

export async function forgetMemoryAction({ memoryId, userId }: { memoryId: string; userId: string }) {
  console.log(`Action: Forgetting memory ${memoryId} instruction for user ${userId}`);
  // Return instruction for TheBaze to handle locally
  return { 
    action: "forgetMemory",
    memoryId: memoryId,
    status: "forgotten" as const,
    message: "I'll forget that memory for you."
  };
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

export async function showMeditationLanguageSelectorAction({
  type,
  intention,
  chatHistory,
}: {
  type: string;
  intention?: string;
  chatHistory?: string;
}) {
  console.log(`Action: Showing meditation language selector for ${type}`);
  return { 
    type,
    intention,
    chatHistory,
    status: "showing_language_selector" as const,
    message: `Please choose the language for your ${type} meditation.`
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
  console.log(`Action: Creating meditation instruction "${title}" of type ${type} for user ${userId}`);
  // Return instruction for TheBaze to handle locally
  return { 
    action: "createMeditation",
    type,
    title,
    content,
    duration,
    status: "created" as const,
    message: `I'll save your ${type} meditation: "${title}"`
  };
}

export async function listMeditationsAction({
  userId,
}: {
  userId: string;
}) {
  console.log(`Action: Listing meditations instruction for user ${userId}`);
  // Return instruction for TheBaze to handle locally
  return { 
    action: "listMeditations",
    status: "listed" as const,
    message: "Here are your saved meditations:"
  };
}

export async function getMeditationAction({
  meditationId,
  userId,
}: {
  meditationId: string;
  userId: string;
}) {
  console.log(`Action: Getting meditation ${meditationId} instruction for user ${userId}`);
  // Return instruction for TheBaze to handle locally
  return { 
    action: "getMeditation",
    meditationId,
    status: "retrieved" as const,
    message: "Here's your meditation:"
  };
}

export async function deleteMeditationAction({
  meditationId,
  userId,
}: {
  meditationId: string;
  userId: string;
}) {
  console.log(`Action: Deleting meditation ${meditationId} instruction for user ${userId}`);
  // Return instruction for TheBaze to handle locally
  return { 
    action: "deleteMeditation",
    meditationId,
    status: "deleted" as const,
    message: "I'll delete that meditation for you."
  };
}

export async function generateMeditationContentAction({
  type,
  intention,
  chatHistory,
  duration = "10 minutes",
  language = "english",
}: {
  type: string;
  intention?: string;
  chatHistory?: string;
  duration?: string;
  language?: string;
}) {
  console.log(`Action: Generating ${type} meditation content`);
  try {
    const contextPrompt = chatHistory 
      ? `Based on this chat history: ${chatHistory.slice(-1000)}` // Use last 1000 chars
      : intention 
      ? `Based on this intention: ${intention}`
      : `Create a general ${type} meditation`;    // Prepare language-specific prompt
    const languageInstruction = language === "hebrew" 
      ? `      ===== CRITICAL HEBREW LANGUAGE REQUIREMENT =====
      
      MANDATORY: Generate 100% of the meditation content in Hebrew with COMPLETE ניקוד (vowel marks) on EVERY SINGLE WORD IN EVERY LINE.
      
      CRITICAL INSTRUCTION: Every line with timestamp must have Hebrew text with full ניקוד after the timestamp.
      
      REQUIRED FORMAT FOR HEBREW MEDITATION:
      [00:00] בְּרוּכִים הַבָּאִים לִמְדִיטַצְיַת הַשַּׁלְוָה הַזֹּאת
      [00:30] קְחוּ נְשִׁימָה עֲמֻקָּה וְהַרְגִּישׁוּ אֶת הַגּוּף מִתְרַגֵּעַ
      [01:00] הַאֲזִינוּ לְקוֹל הַנְּשִׁימָה שֶׁלָּכֶם וְהִתְמַקְּדוּ בָּרֶגַע הַזֶּה
      [01:30] כָּל נְשִׁימָה מְבִיאָה אֶתְכֶם יוֹתֵר עָמֹק לְתוֹךְ הַשַּׁלְוָה
      
      VOWEL MARK REQUIREMENTS (MUST BE USED ON EVERY WORD):
      - קָמַץ (kamatz), פַּתַח (patach), צֵירֵי (tzere), סֶגּוֹל (segol)
      - חִירִיק (chirik), חוֹלָם (cholam), שׁוּרוּק (shuruk), קֻבּוּץ (kubutz)
      - שְׁוָא (sheva), דָּגֵשׁ (dagesh) where appropriate
      
      MEDITATION TERMINOLOGY WITH ניקוד:
      - מְדִיטַצְיָה (meditation)
      - הַרְגָּעָה (relaxation)
      - נְשִׁימָה (breathing)
      - רִגְעָה (calmness)
      - שַׁלְוָה (peace)
      - מַחְשָׁבוֹת (thoughts)
      - תְּחוּשׁוֹת (sensations)
      - מַעֲרֶכֶת עַצְמִית (self-system)
      
      ABSOLUTE REQUIREMENT: EVERY Hebrew word in the meditation content must have complete vowel marks. No Hebrew text without ניקוד is acceptable.
      
      VALIDATION: Before generating, ensure each Hebrew word has proper vowel marks like: שִׁמְחָה, רָגוּעַ, מְרֻכָּז
      `
      : `Generate the meditation content in English.`;    const { object: meditationContent } = await generateObject({
      model: geminiFlashModel,
      prompt: `Generate a ${type} meditation content for ${duration}. ${contextPrompt}. 
      Create a guided meditation that is calming, helpful, and professionally structured.
      
      ${languageInstruction}
        ${language === "hebrew" ? `
      ===== HEBREW VALIDATION FOR TIMELINE =====
      MANDATORY: Each timeline entry MUST follow this exact format:
      [MM:SS] [Hebrew text with complete ניקוד]
      
      EXAMPLES OF CORRECT TIMELINE ENTRIES:
      [00:00] בְּרוּכִים הַבָּאִים לִמְדִיטַצְיַת הַשַּׁלְוָה הַזֹּאת
      [00:45] קְחוּ נְשִׁימָה עֲמֻקָּה וְהַרְגִּישׁוּ אֶת הַגּוּף מִתְרַגֵּעַ
      [01:30] הַאֲזִינוּ לְקוֹל הַנְּשִׁימָה שֶׁלָּכֶם וְהִתְמַקְּדוּ בָּרֶגַע הַזֶּה
      [02:00] כָּל נְשִׁימָה מְבִיאָה אֶתְכֶם יוֹתֵר עָמֹק לְתוֹךְ הַשַּׁלְוָה
      [02:20] הַרְגִּישׁוּ אֶת הַמַּתְח נֶעְלָם מִן הַכְּתֵפַיִם וְהַצַּוָּאר
      
      WRONG EXAMPLES (DO NOT DO THIS):
      [00:00] ברוכים הבאים למדיטציית השלווה הזאת (missing ניקוד)
      [00:45] קחו נשימה עמוקה (missing vowel marks)
      
      CRITICAL: EVERY Hebrew word after each timestamp MUST have complete vowel marks.
      ` : ''}
      
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
      
      Continue this pattern, building a complete 10-minute guided experience that flows naturally for TTS audio.`,      schema: z.object({
        title: z.string().describe(language === "hebrew" 
          ? "A meaningful title for the meditation IN HEBREW WITH COMPLETE ניקוד (vowel marks)"
          : "A meaningful title for the meditation"),
        content: z.string().describe(language === "hebrew" 
          ? "The complete guided meditation script IN HEBREW WITH FULL ניקוד on every word. VERIFY: Every Hebrew letter that can receive vowel marks MUST have them."
          : "The complete guided meditation script with clear instructions"),
        estimatedDuration: z.string().describe("Estimated time needed for this meditation"),
        keyBenefits: z.array(z.string()).describe(language === "hebrew"
          ? "Key benefits this meditation provides IN HEBREW WITH COMPLETE ניקוד"
          : "Key benefits this meditation provides"),
      }),
    });

    // Additional validation for Hebrew content
    if (language === "hebrew") {
      const hebrewVowelMarks = /[\u05B0-\u05BC\u05C1\u05C2\u05C4\u05C5\u05C7]/; // Hebrew vowel mark Unicode ranges
      const hasHebrewVowels = hebrewVowelMarks.test(meditationContent.content);
      
      if (!hasHebrewVowels) {
        console.warn("Generated Hebrew content lacks proper ניקוד, attempting regeneration...");        // If no vowel marks detected, try one more time with even more explicit instruction
        const { object: retriedContent } = await generateObject({
          model: geminiFlashModel,
          prompt: `CRITICAL HEBREW REQUIREMENT: You MUST generate Hebrew meditation content with COMPLETE ניקוד on EVERY word in EVERY timeline entry.
          
          Type: ${type}
          Duration: ${duration}
          Context: ${contextPrompt}
          
          MANDATORY TIMELINE FORMAT WITH ניקוד:
          [00:00] בְּרוּכִים הַבָּאִים לִמְדִיטַצְיַת הַשַּׁלְוָה הַזֹּאת
          [00:30] קְחוּ נְשִׁימָה עֲמֻקָּה וְהַרְגִּישׁוּ אֶת הַגּוּף מִתְרַגֵּעַ
          [01:00] הַאֲזִינוּ לְקוֹל הַנְּשִׁימָה שֶׁלָּכֶם וְהִתְמַקְּדוּ בָּרֶגַע הַזֶּה
          [01:30] כָּל נְשִׁימָה מְבִיאָה אֶתְכֶם יוֹתֵר עָמֹק לְתוֹךְ הַשַּׁלְוָה
          [02:00] הַרְגִּישׁוּ אֶת הַמַּתְח נֶעְלָם מִן הַכְּתֵפַיִם וְהַצַּוָּאר
          [02:20] תְּנוּ לַגּוּף שֶׁלָּכֶם לְהַרְגִּישׁ כָּבֵד וְרָגוּעַ יוֹתֵר
          [02:50] עַכְשָׁיו הַקְּדִישׁוּ תַּשׂוּמֶת לֵב לְמַחְשְׁבוֹתֵיכֶם
          [03:20] אַל תִּלָּחֲמוּ בַּמַּחְשָׁבוֹת, פָּשׁוּט צְפוּ בָּהֶן
          [03:50] תְּנוּ לַמַּחְשָׁבוֹת לַחֲלֹף כְּמוֹ עֲנָנִים בַּשָּׁמַיִם
          [04:20] חִזְרוּ אֶל הַנְּשִׁימָה כָּל פַּעַם שֶׁאַתֶּם מְרַכְּזִים דַּעְתְּכֶם
          
          EVERY SINGLE HEBREW WORD MUST HAVE VOWEL MARKS. NO EXCEPTIONS.
          
          Generate a complete ${duration} meditation following this exact format.`,
          schema: z.object({
            title: z.string().describe("Title IN HEBREW WITH COMPLETE ניקוד"),
            content: z.string().describe("Complete meditation timeline IN HEBREW WITH FULL ניקוד on every word"),
            estimatedDuration: z.string().describe("Estimated duration"),
            keyBenefits: z.array(z.string()).describe("Benefits IN HEBREW WITH ניקוד"),
          }),
        });
        
        return {
          type,
          title: retriedContent.title,
          content: retriedContent.content,
          duration: retriedContent.estimatedDuration,
          keyBenefits: retriedContent.keyBenefits,
          language,
          status: "generated" as const
        };
      }
    }

    return {
      type,
      title: meditationContent.title,
      content: meditationContent.content,
      duration: meditationContent.estimatedDuration,
      keyBenefits: meditationContent.keyBenefits,
      language,
      status: "generated" as const
    };
  } catch (error) {
    console.error("Error in generateMeditationContentAction:", error);
    return { error: "Failed to generate meditation content." };
  }
}
