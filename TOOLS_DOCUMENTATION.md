# Gemini Chat: Creating Custom Tools Documentation

This documentation provides a comprehensive guide on how to create and implement new tools for the Gemini Chat project, such as the existing flight booking, task management, and memory features.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Creating New Tools: Step by Step](#creating-new-tools-step-by-step)
4. [UI Implementation](#ui-implementation)
5. [Advanced Implementations](#advanced-implementations)
6. [Best Practices](#best-practices)
7. [Examples](#examples)
8. [Troubleshooting](#troubleshooting)

## Architecture Overview

The Gemini Chat tool system consists of several key components:

### Core Components

1. **AI Model Integration**
   - Uses the Vercel AI SDK with `streamText` function
   - Powered by Google Gemini models (geminiProModel and geminiFlashModel)

2. **Tool Structure**
   - **Tool Definition**: Configured in route handlers (`route.ts` files)
   - **Action Implementation**: Business logic in action files (`actions.ts`)
   - **UI Components**: Display logic in component directories

3. **Key Technologies**
   - **Zod**: For parameter validation and schema definition
   - **React/Next.js**: For UI components
   - **TypeScript**: For type safety across the application

## Project Structure

The Gemini Chat project follows a well-organized structure for implementing tools:

### Key Files for Tool Implementation

```
mytx-ai/
├── ai/
│   ├── actions.ts             # Core logic for tool actions
│   ├── custom-middleware.ts   # Custom AI middleware (extensible)
│   └── index.ts              # AI model configuration
├── app/
│   └── (chat)/
│       └── api/
│           └── chat/
│               └── route.ts   # Tool definitions and POST handler
├── components/
│   ├── custom/
│   │   ├── message.tsx        # Tool result rendering logic
│   │   └── [other UI files]
│   ├── flights/               # UI components for flight tools
│   ├── memories/              # UI components for memory tools
│   ├── tasks/                 # UI components for task tools
│   └── ui/                    # Reusable UI components
└── db/
    ├── queries.ts             # Database operations used by tools
    └── schema.ts              # Database schema definitions
```

### File Responsibilities

1. **ai/actions.ts**: Contains the implementation of tool actions, including:
   - AI-generated content functions (using `generateObject`)
   - Database interaction functions
   - External API calls
   - Task and memory management functions

2. **app/(chat)/api/chat/route.ts**: Defines the tools interface:
   - Tool descriptions and parameter schemas
   - Execute functions that call the corresponding actions
   - System prompt guidance for multi-step tool workflows

3. **components/{feature}/**: UI components organized by feature:
   - Each tool category has its own folder (flights, tasks, memories)
   - Components are responsible for rendering tool results
   - New tools should add components in appropriate folders

4. **db/queries.ts**: Database operations that tools may need:
   - CRUD operations for persistent data
   - Tool actions call these functions when database access is needed

5. **components/custom/message.tsx**: Central component that:
   - Maps tool names to their corresponding UI components
   - Renders tool results or loading states
   - Must be updated for each new tool

When creating a new tool category, you should add a new folder under `components/` with components specific to that tool type.

## Creating New Tools: Step by Step

### 1. Define Action Implementation

First, implement the core logic in `ai/actions.ts`:

```typescript
// Example: Creating a reminder tool
export async function createReminderAction({
  title,
  dueDate,
  userId,
}: {
  title: string;
  dueDate: string;
  userId: string; // Usually passed from the route handler
}) {
  console.log(`Action: Creating reminder "${title}" for user ${userId}`);
  
  try {
    // Option 1: Database interaction
    // const reminder = await db.insert(reminders).values({
    //   id: generateUUID(),
    //   userId,
    //   title,
    //   dueDate,
    //   createdAt: new Date()
    // }).returning();
    
    // Option 2: For demonstration/testing (no actual DB)
    const reminderId = generateUUID();
    
    // Return confirmation data
    return { 
      reminderId, 
      title,
      dueDate, 
      status: "created" 
    };
  } catch (error) {
    console.error("Error creating reminder:", error);
    return { error: "Failed to create reminder." };
  }
}
```

### 2. Register the Tool in Route Handler

Add your tool to the `tools` object in `app/(chat)/api/chat/route.ts`:

```typescript
// In the existing tools object inside POST handler
createReminder: {
  description: "Create a reminder for the user",
  parameters: z.object({
    title: z.string().describe("Title of the reminder"),
    dueDate: z.string().describe("Due date in ISO format or natural language (e.g., 'tomorrow', 'next Monday')"),
  }),
  execute: async ({ title, dueDate }) => {
    return await createReminderAction({ title, dueDate, userId });
  },
},
```

### 3. Update System Prompt (Optional)

For complex tools or those with multi-step workflows, update the system prompt to guide the AI:

```typescript
system: `
  // ...existing prompt
  - here's the optimal reminder management flow:
    - create reminder (ask for title and due date)
    - list reminders
    - mark a reminder as complete
    - delete a reminder
`,
```

## UI Implementation

### 1. Create UI Components

Create components to display your tool's results:

```typescript
// components/reminders/reminder-confirmation.tsx
interface ReminderConfirmationProps {
  reminderId?: string;
  title?: string;
  dueDate?: string;
  status?: string;
  error?: string;
}

export function ReminderConfirmation({ reminderId, title, dueDate, status, error }: ReminderConfirmationProps) {
  if (error) {
    return (
      <div className="text-red-500 p-2 rounded-md border border-red-300 bg-red-50">
        Error: {error}
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{status === "created" ? "Reminder Created" : "Reminder"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">Due: {new Date(dueDate).toLocaleString()}</p>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 2. Update the Message Component

Add your component to the message renderer in `components/custom/message.tsx`:

```typescript
// In the existing message component where tool results are rendered
{toolName === "createReminder" ? (
  <ReminderConfirmation {...result} />
) : null}

// And in the skeleton loaders section
{toolName === "createReminder" ? (
  <ReminderConfirmation />
) : null}
```

## Advanced Implementations

### Database Integration

For tools requiring database persistence:

1. **Define Schema**:
```typescript
// In db/schema.ts
export const reminders = sqliteTable("reminders", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  dueDate: text("due_date").notNull(),
  isCompleted: integer("is_completed", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
```

2. **Create Database Queries**:
```typescript
// In db/queries.ts
export async function createReminder({
  id,
  userId,
  title,
  dueDate,
}: {
  id: string;
  userId: string;
  title: string;
  dueDate: string;
}): Promise<Array<Reminder>> {
  return db
    .insert(reminders)
    .values({
      id,
      userId,
      title,
      dueDate,
    })
    .returning();
}
```

### External API Integration

For tools that call external APIs:

```typescript
export async function getNewsAction({
  topic,
  count,
}: {
  topic: string;
  count: number;
}) {
  try {
    const API_KEY = process.env.NEWS_API_KEY;
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&pageSize=${count}&apiKey=${API_KEY}`,
      { next: { revalidate: 1800 } } // Cache for 30 minutes
    );
    
    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }
    
    const data = await response.json();
    return { articles: data.articles.slice(0, count) };
  } catch (error) {
    console.error("Error fetching news:", error);
    return { error: "Failed to fetch news articles." };
  }
}
```

### AI-Generated Content

For tools that use AI to generate data:

```typescript
export async function generateRecipeAction({
  ingredients,
  cuisine,
}: {
  ingredients: string[];
  cuisine: string;
}) {
  const { object: recipe } = await generateObject({
    model: geminiFlashModel,
    prompt: `Create a ${cuisine} recipe using these ingredients: ${ingredients.join(", ")}`,
    schema: z.object({
      title: z.string().describe("Recipe name"),
      prepTime: z.number().describe("Preparation time in minutes"),
      cookTime: z.number().describe("Cooking time in minutes"),
      ingredients: z.array(z.string()).describe("List of ingredients with measurements"),
      instructions: z.array(z.string()).describe("Step by step cooking instructions"),
    }),
  });
  
  return recipe;
}
```

## Best Practices

### Parameter Validation

Always use Zod schemas for robust parameter validation:

```typescript
parameters: z.object({
  email: z.string().email().describe("User's email address"),
  age: z.number().int().min(13).max(120).describe("User's age in years"),
  preferences: z.array(z.string()).optional().describe("User preferences"),
}),
```

### Error Handling

Implement proper error handling in all action functions:

```typescript
try {
  // Implementation
  return result;
} catch (error) {
  console.error(`Error in ${actionName}:`, error);
  return { error: `Failed to ${actionDescription}: ${error.message}` };
}
```

### Security Considerations

- Always validate user authentication before database operations
- Use proper authorization checks for sensitive operations
- Sanitize inputs, especially when used in database queries
- Consider rate limiting for tools that use external APIs

### Performance Optimization

- Add caching for expensive operations
- Use pagination for large data sets
- Consider background processing for long-running tasks

## Examples

### Example 1: Simple Calculator Tool

```typescript
// In ai/actions.ts
export async function calculateAction({
  expression,
}: {
  expression: string;
}) {
  try {
    // Use Function constructor with caution - this is just for demonstration
    // In production, use a proper math expression evaluator
    const sanitizedExpression = expression.replace(/[^0-9+\-*/().]/g, '');
    const result = new Function(`return ${sanitizedExpression}`)();
    return { expression, result };
  } catch (error) {
    return { error: "Invalid mathematical expression" };
  }
}

// In route.ts
calculate: {
  description: "Calculate the result of a mathematical expression",
  parameters: z.object({
    expression: z.string().describe("Mathematical expression to evaluate (e.g., '2 + 2')"),
  }),
  execute: async ({ expression }) => {
    return await calculateAction({ expression });
  },
},
```

### Example 2: Multi-step Workflow Tool

```typescript
// Tool definition
createProject: {
  description: "Create a new project with assigned team members",
  parameters: z.object({
    name: z.string().describe("Project name"),
    description: z.string().describe("Project description"),
    dueDate: z.string().describe("Project due date"),
    teamMembers: z.array(z.string()).describe("Email addresses of team members"),
  }),
  execute: async (params) => {
    return await createProjectAction({ ...params, userId });
  },
},

// System prompt guidance
system: `
  // ...existing prompt
  - for project creation, follow these steps:
    - get project details (name, description, due date)
    - ask for team members
    - create the project and confirm
    - offer to send invitations to team members
`,
```

## Troubleshooting

### Common Issues and Solutions

1. **Tool Not Being Called**
   - Verify tool description is clear and matches user intents
   - Check system prompt for proper guidance
   - Ensure parameters are properly described

2. **Parameter Validation Errors**
   - Validate that Zod schemas match expected inputs
   - Provide default values where appropriate
   - Add .optional() to non-required parameters

3. **UI Rendering Issues**
   - Ensure component handles null/undefined values gracefully
   - Add error states for failed tool calls
   - Verify component is properly mapped in the message renderer

4. **Database Errors**
   - Check database connection and schema
   - Verify table exists and has correct columns
   - Add proper error handling for database operations

5. **External API Failures**
   - Validate API keys and endpoint URLs
   - Implement retries for transient failures
   - Add timeout handling for slow responses

---

By following this documentation, you can create powerful new tools that extend the capabilities of the Gemini Chat application, providing users with even more functionality through natural language interactions.