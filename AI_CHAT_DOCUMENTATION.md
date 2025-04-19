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
7.  **Database Interaction (`db/queries.ts`, `db/schema.ts`)**: Handles saving and retrieving chat history, reservation data, and (eventually) task data from the database (e.g., using Drizzle ORM).
8.  **UI Components for Tool Results (`components/flights/*`, `components/tasks/*`, `components/custom/weather.tsx`)**: Specific React components designed to render the structured data returned by tool executions (e.g., displaying flight lists, seat maps, weather information, task lists, task confirmations).

## Request/Response Flow

1.  **User Input**: User types a message (`chat.tsx`).
2.  **API Request**: Frontend sends history + message + ID to `/api/chat` (POST).
3.  **Backend Processing (`route.ts`)**:
    *   Authentication check.
    *   Message preparation.
    *   **AI Call (`streamText`)**: Calls `streamText` with the model, system prompt, messages, and the `tools` object (containing tool definitions with `zod` parameter schemas).
4.  **AI Decision**: AI processes input and decides whether to respond with text or use a tool.
5.  **Tool Execution (If AI chooses a tool)**:
    *   AI response indicates the tool and arguments.
    *   `streamText` intercepts and validates arguments against the tool's `zod` parameter schema.
    *   It calls the tool's `execute` function defined in `route.ts`.
    *   The `execute` function typically calls the corresponding action function in `ai/actions.ts`.
    *   The action function in `ai/actions.ts` performs the logic (e.g., calls `generateObject` with a `zod` schema, interacts with APIs, performs database operations - currently placeholders for tasks).
    *   The result from the action function is returned through the `execute` function to `streamText`.
    *   `streamText` sends this result back to the AI model.
6.  **AI Final Response Generation**:
    *   If a tool was used, the AI formulates a brief response based on the tool's result and the system prompt (e.g., "Okay, here are the flights," or "Okay, I've added that task.").
    *   *Task Flow Update*: If `addTask` or `markTaskComplete` was successful, the system prompt now instructs the AI to immediately call the `listTasks` tool.
    *   If no tool was used, the AI generates its text response directly.
7.  **Streaming Response (`streamText` -> Frontend)**:
    *   `streamText` streams the AI's text response and any structured tool results (like flight data or task lists) back to the frontend.
8.  **Frontend Rendering (`chat.tsx` -> `message.tsx`)**:
    *   Receives the stream.
    *   `message.tsx` displays the AI text.
    *   If structured data for a UI component is present (identified by `toolName` in `toolInvocations`), it renders the corresponding component (e.g., `<ListFlights data={flightData} />`, `<ListTasks tasks={taskData.tasks} />`).
9.  **Save History (`onFinish` callback in `route.ts`)**: Saves the updated conversation history to the database.

## System Prompt Influence

The system prompt (`route.ts`) guides the AI's behavior:

*   **Persona**: Friendly assistant for flights and tasks.
*   **Conciseness**: Brief responses.
*   **Flows**:
    *   **Flight Booking**: search -> select -> reserve -> pay -> board.
    *   **Task Management**: add -> list -> complete. Crucially, it now instructs the AI to automatically call `listTasks` after a successful `addTask` or `markTaskComplete`.
*   **Tool Usage**: Encourages tool use, dictates phrasing.
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

This architecture uses `zod` for robust data definition and validation, separates action logic (`ai/actions.ts`) from tool definition (`route.ts`), and leverages the system prompt to create interactive flows with automatic UI updates for tasks.
