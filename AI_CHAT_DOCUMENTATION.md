# AI Chat Application Documentation

This document explains the architecture and data flow of the AI-powered chat application, focusing on how user messages are processed, how the AI interacts with defined tools, and how responses are generated and displayed.

## Core Components

1.  **Frontend Chat UI (`components/custom/chat.tsx`)**: Handles user input, displays the conversation history (including AI responses and tool results), and communicates with the backend API.
2.  **Backend API Route (`app/(chat)/api/chat/route.ts`)**: The central hub for processing chat messages. Handles authentication, interacts with the AI model via `streamText`, manages tool definitions (including parameter schemas using `zod`), calls action functions, and saves chat history.
3.  **AI Model Interaction (`ai/index.ts`, `streamText` in `route.ts`)**: Uses the Vercel AI SDK's `streamText` function to communicate with the configured AI model (e.g., `geminiProModel`). Manages the conversation flow, including tool calls and responses.
4.  **Zod (`zod` library, imported as `z`)**: A schema declaration and validation library used extensively to define:
    *   The expected parameters for AI tools within the `tools` object in `route.ts`.
    *   The desired output structure for AI-generated data using `generateObject` within `actions.ts`.
    Ensures type safety and runtime validation for AI interactions.
5.  **Tool Definitions (`tools` object in `route.ts`)**: Defines the specific actions (tools) the AI can perform. Each tool has a description, expected parameters (defined with `zod` schemas), and an `execute` function that typically calls a corresponding action function in `ai/actions.ts`.
6.  **Action Implementations (`ai/actions.ts`)**: Contains the core logic executed when an AI tool is called. This includes:
    *   Functions that generate *sample* data (like flight status, search results, seats) using the AI's `generateObject` capability with `zod` schemas.
    *   Functions that perform task management operations (`addTaskAction`, `listTasksAction`, `markTaskCompleteAction`) - currently placeholders but intended for database interaction.
    *   Functions that perform memory management operations (`saveMemoryAction`, `recallMemoriesAction`, `findMemoriesAction`, `forgetMemoryAction`).
7.  **Database Interaction (`db/queries.ts`, `db/schema.ts`)**: Handles saving and retrieving chat history, reservation data, task data (schema defined but queries might be placeholders), and memory data (`memories` table). Includes functions like `saveMemory`, `getMemoriesByUserId`, `findMemoriesByContent`, and `deleteMemoryById`. Uses Drizzle ORM with Postgres.
8.  **UI Components for Tool Results (`components/flights/*`, `components/tasks/*`, `components/memories/*`, `components/custom/weather.tsx`)**: Specific React components designed to render the structured data returned by tool executions (e.g., displaying flight lists, task lists, memory lists (`ListMemories`), memory confirmations (`MemoryConfirmation`)).

## Request/Response Flow

1.  **User Input**: User types a message (`chat.tsx`).
2.  **API Request**: Frontend sends history + message + ID to `/api/chat` (POST).
3.  **Backend Processing (`route.ts`)**:
    *   Authentication check (retrieves `userId`).
    *   Message preparation.
    *   **AI Call (`streamText`)**: Calls `streamText` with the model, system prompt, messages, and the `tools` object (containing tool definitions with `zod` parameter schemas).
4.  **AI Decision**: AI processes input and decides whether to respond with text or use a tool based on the system prompt and message content.
5.  **Tool Execution (If AI chooses a tool)**:
    *   AI response indicates the tool and arguments.
    *   `streamText` intercepts and validates arguments against the tool's `zod` parameter schema.
    *   It calls the tool's `execute` function defined in `route.ts`, passing the `userId` where needed.
    *   The `execute` function calls the corresponding action function in `ai/actions.ts`.
    *   The action function in `ai/actions.ts` performs the logic (e.g., calls `generateObject`, interacts with APIs, calls database queries like `findMemoriesByContent` or `deleteMemoryById`).
    *   The result from the action function is returned through the `execute` function to `streamText`.
    *   `streamText` sends this result back to the AI model.
6.  **AI Final Response Generation**:
    *   If a tool was used, the AI formulates a response based on the tool's result and the system prompt instructions.
    *   *Task Flow Update*: If `addTask` or `markTaskComplete` was successful, the AI calls `listTasks`.
    *   *Memory Forget Flow*:
        *   If the user asked to "Forget X" and the AI used `findMemories`:
            *   If 1 memory found, AI asks for confirmation ("Okay, I found... Should I forget this?").
            *   If >1 memory found, AI lists them and asks for the ID.
            *   If 0 found, AI says sorry.
        *   Only after user confirmation ("yes" or provides ID) does the AI use the `forgetMemory` tool.
    *   If no tool was used, the AI generates its text response directly.
7.  **Streaming Response (`streamText` -> Frontend)**:
    *   `streamText` streams the AI's text response and any structured tool results (like flight data, task lists, or memory lists/confirmations) back to the frontend.
8.  **Frontend Rendering (`chat.tsx` -> `message.tsx`)**:
    *   Receives the stream.
    *   `message.tsx` displays the AI text.
    *   If structured data for a UI component is present (identified by `toolName` in `toolInvocations`), it renders the corresponding component (e.g., `<ListFlights />`, `<ListTasks />`, `<ListMemories />`, `<MemoryConfirmation />`).
9.  **Save History (`onFinish` callback in `route.ts`)**: Saves the updated conversation history to the database.

## Sequential Action Execution (AI-Orchestrated)

While the application code doesn't have a mechanism for one action function to directly trigger another within the same backend execution, it achieves sequential actions through **AI orchestration guided by the system prompt**.

Here's the typical flow:

1.  **Initial User Request & Tool Call**: The user's message triggers the AI to use an initial tool (e.g., `addTask`, `findMemories`).
2.  **Tool Execution & Result to AI**: The backend executes the tool's action, and the result is sent back to the AI model.
3.  **AI Follow-up Decision (Prompt-Guided)**: The system prompt contains instructions for the AI on what to do *after* specific tool calls succeed. The AI evaluates the previous tool's result against these instructions.
4.  **Subsequent Tool Call (Next Turn)**: Based on the prompt's guidance, the AI decides to call a follow-up tool in the *next* conversational turn.
5.  **Completion**: This continues until the sequence defined in the prompt is complete.

**Examples:**

*   **Task Listing after Adding**: User says "Add task X". AI calls `addTask`. Action succeeds. Result goes to AI. System prompt tells AI: "automatically show the list after adding". AI then calls `listTasks` in the next turn.
*   **Memory Forgetting Confirmation**: User says "Forget X". AI calls `findMemories`. Action returns 1 match. Result goes to AI. System prompt tells AI: "If 1 memory found: Respond EXACTLY: 'Okay, I found... Should I forget this one? (yes/no)'". AI sends this confirmation message and waits. If user replies "yes", the AI (again guided by the prompt) calls `forgetMemory` with the ID in the following turn.

This approach leverages the AI's conversational ability to manage multi-step processes based on the detailed instructions provided in the system prompt.

## System Prompt Influence (`route.ts`)

The system prompt guides the AI's behavior:

*   **Persona**: Friendly assistant for flights, tasks, and memories.
*   **Conciseness**: Brief responses.
*   **Flows**:
    *   **Flight Booking**: search -> select -> reserve -> pay -> board.
    *   **Task Management**: add -> list -> complete (list automatically shown after add/complete).
    *   **Memory Management**:
        *   Save: "Remember X" -> `saveMemory`.
        *   Recall All: "What do you remember?" -> `recallMemories`.
        *   Recall Specific: "What is my [topic]?" -> `findMemories`.
        *   Forget by Content: "Forget X" -> `findMemories` -> AI asks for confirmation -> User confirms -> `forgetMemory`.
        *   Forget by ID: "Forget memory [ID]" -> `forgetMemory`.
*   **Tool Usage**: Encourages tool use, dictates phrasing, specifies confirmation steps.
*   **Data Awareness**: Current date, seat facts.
*   **Safety**: Payment confirmation/verification.

## Tool Definitions (`tools` object in `route.ts`)

Maps tool names to descriptions, `zod` parameter schemas, and `execute` functions which call actions in `ai/actions.ts`.

*   `getWeather`: Fetches real weather.
*   `displayFlightStatus`: Calls action to generate *sample* status.
*   `searchFlights`: Calls action to generate *sample* results.
*   `selectSeats`: Calls action to generate *sample* seats.
*   `createReservation`: Calls action to generate *sample* price and saves to DB.
*   `authorizePayment`: Simulates payment start.
*   `verifyPayment`: Checks DB for payment status.
*   `displayBoardingPass`: Returns boarding pass details (post-verification).
*   `addTask`: Calls `addTaskAction`.
*   `listTasks`: Calls `listTasksAction`.
*   `markTaskComplete`: Calls `markTaskCompleteAction`.
*   `saveMemory`: Calls `saveMemoryAction`.
*   `recallMemories`: Calls `recallMemoriesAction`.
*   `findMemories`: Calls `findMemoriesAction` (used for searching/confirming before forgetting by content).
*   `forgetMemory`: Calls `forgetMemoryAction` (used *after* user confirmation or when ID is given directly).

This architecture uses `zod` for robust data definition and validation, separates action logic (`ai/actions.ts`) from tool definition (`route.ts`), and leverages the system prompt to create interactive flows with confirmation steps for sensitive actions like forgetting memories.
