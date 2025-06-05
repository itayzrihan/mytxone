# AI Chat Tools Development Guide

## Complete Guide for Adding New Tools and UI Elements to the Chat System

This comprehensive guide demonstrates how to add new AI tools with full chat integration, database persistence, and UI components using the **Tasks system** as a real-world example.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Step-by-Step Implementation](#step-by-step-implementation)
3. [Database Integration](#database-integration)
4. [UI Component Development](#ui-component-development)
5. [Chat Integration](#chat-integration)
6. [Testing and Validation](#testing-and-validation)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

### Core Components Flow

```
User Input → Chat API → AI Model → Tool Selection → Action Execution → Database → UI Rendering
     ↑                                                                            ↓
     └─────────────── Chat Response ←──── Stream Response ←─────────────────────┘
```

### Key Files Structure

```
mytx-ai/
├── ai/
│   ├── actions.ts              # Core tool logic & database interactions
│   └── index.ts               # AI model configuration
├── app/(chat)/api/chat/
│   └── route.ts              # Tool definitions & API endpoint
├── components/
│   ├── {feature}/            # Feature-specific UI components
│   │   ├── list-{feature}.tsx
│   │   └── {feature}-confirmation.tsx
│   └── custom/
│       ├── chat.tsx          # Main chat interface
│       └── message.tsx       # Tool result rendering
├── db/
│   ├── schema.ts            # Database table definitions
│   └── queries.ts           # Database operations
└── lib/
    └── utils.ts             # Helper functions
```

---

## Step-by-Step Implementation

### 1. Define Database Schema

**File: `db/schema.ts`**

```typescript
// Example: Tasks table
export const tasks = pgTable("Task", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  description: text("description").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
});

export type Task = InferSelectModel<typeof tasks>;

// Add relation to user table
export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(user, {
    fields: [tasks.userId],
    references: [user.id],
  }),
}));

// Update user relations to include new feature
export const userRelations = relations(user, ({ many }) => ({
  // ... existing relations
  tasks: many(tasks),
}));
```

### 2. Create Database Queries

**File: `db/queries.ts`**

```typescript
import { tasks } from "./schema";
import { db } from "@/lib/drizzle";
import { eq, desc, and } from "drizzle-orm";

// CREATE operation
export async function addTask({
  userId,
  description,
}: {
  userId: string;
  description: string;
}): Promise<Array<Task>> {
  try {
    const newTask = await db
      .insert(tasks)
      .values({
        userId,
        description,
        status: "pending",
      })
      .returning();
    return newTask;
  } catch (error) {
    console.error("Failed to add task to database");
    throw error;
  }
}

// READ operation
export async function getTasksByUserId({
  userId,
}: {
  userId: string;
}): Promise<Array<Task>> {
  try {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(desc(tasks.createdAt));
  } catch (error) {
    console.error("Failed to get tasks by user from database");
    throw error;
  }
}

// UPDATE operations
export async function updateTaskStatus({
  id,
  userId,
  status,
}: {
  id: string;
  userId: string;
  status: string;
}): Promise<void> {
  try {
    await db
      .update(tasks)
      .set({ status })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
  } catch (error) {
    console.error("Failed to update task status in database");
    throw error;
  }
}

export async function updateTaskDescription({
  id,
  userId,
  description,
}: {
  id: string;
  userId: string;
  description: string;
}): Promise<void> {
  try {
    await db
      .update(tasks)
      .set({ description })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
  } catch (error) {
    console.error("Failed to update task description in database");
    throw error;
  }
}

// DELETE operation
export async function deleteTaskById({
  id,
  userId,
}: {
  id: string;
  userId: string;
}): Promise<void> {
  try {
    await db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
  } catch (error) {
    console.error("Failed to delete task from database");
    throw error;
  }
}
```

### 3. Implement Action Functions

**File: `ai/actions.ts`**

```typescript
import { 
  addTask,
  getTasksByUserId,
  updateTaskStatus,
  updateTaskDescription,
  deleteTaskById
} from "@/db/queries";

// CREATE action
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

// READ action
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

// UPDATE actions
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

// DELETE action
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
```

### 4. Define AI Tools

**File: `app/(chat)/api/chat/route.ts`**

```typescript
import { z } from "zod";
import {
  addTaskAction,
  listTasksAction,
  markTaskCompleteAction,
  deleteTaskAction,
  updateTaskNameAction,
} from "@/ai/actions";

// Inside the POST function's tools object:
export async function POST(request: Request) {
  // ... authentication and setup

  const result = await streamText({
    model: geminiProModel,
    system: `
      You are a helpful assistant that can manage tasks.
      
      Here's the optimal task management flow:
      - add a task
      - list tasks (automatically show the list after adding or completing a task)
      - mark a task as complete/incomplete
      - update task names
      - delete tasks
      
      Always be concise and helpful.
    `,
    messages: coreMessages,
    tools: {
      // CREATE tool
      addTask: {
        description: "Add a task for the user to complete later.",
        parameters: z.object({
          taskDescription: z.string().describe(
            "Description of the task to add.",
          ),
        }),
        execute: async ({ taskDescription }) => {
          return await addTaskAction({ taskDescription, userId });
        },
      },

      // READ tool
      listTasks: {
        description: "List all tasks for the user, including pending and completed tasks.",
        parameters: z.object({}),
        execute: async () => {
          return await listTasksAction({ userId });
        },
      },

      // UPDATE tools
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

      // DELETE tool
      deleteTask: {
        description: "Delete a specific task.",
        parameters: z.object({
          taskId: z.string().describe("The ID of the task to delete."),
        }),
        execute: async ({ taskId }) => {
          return await deleteTaskAction({ taskId, userId });
        },
      },
    },
    // ... rest of configuration
  });
}
```

### 5. Create UI Components

#### A. Confirmation Component

**File: `components/tasks/task-confirmation.tsx`**

```tsx
import { CheckCircle, PlusCircle, CircleSlash } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TaskConfirmationProps {
  taskId: string;
  description?: string;
  status: 'added' | 'completed' | 'pending' | 'updated' | 'deleted';
}

export function TaskConfirmation({ taskId, description, status }: TaskConfirmationProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'added':
        return {
          icon: <PlusCircle className="mr-2 size-5 text-green-500" />,
          title: "Task Added",
          description: `Task "${description}" has been added.`
        };
      case 'completed':
        return {
          icon: <CheckCircle className="mr-2 size-5 text-blue-500" />,
          title: "Task Completed",
          description: "Task has been marked as complete."
        };
      case 'pending':
        return {
          icon: <CircleSlash className="mr-2 size-5 text-amber-500" />,
          title: "Task Uncompleted",
          description: "Task has been marked as incomplete."
        };
      case 'updated':
        return {
          icon: <CheckCircle className="mr-2 size-5 text-purple-500" />,
          title: "Task Updated",
          description: `Task has been updated to "${description}".`
        };
      case 'deleted':
        return {
          icon: <CircleSlash className="mr-2 size-5 text-red-500" />,
          title: "Task Deleted",
          description: "Task has been successfully deleted."
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          {config.icon}
          {config.title}
        </CardTitle>
        <CardDescription>
          {config.description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
```

#### B. List Component with Chat Integration

**File: `components/tasks/list-tasks.tsx`**

```tsx
import { useChat } from "ai/react";
import { Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface Task {
  taskId: string;
  description: string;
  status: 'pending' | 'completed';
}

interface ListTasksProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onRemoveTask: (taskId: string) => void;
  chatId?: string; // Optional for chat integration
}

export function ListTasks({ tasks, onToggleTask, onRemoveTask, chatId }: ListTasksProps) {
  // Chat integration for interactive features
  const chat = useChat({
    id: chatId || 'default-id',
    body: chatId ? { id: chatId } : undefined,
    maxSteps: 5,
  });

  const hasChatId = Boolean(chatId);

  const handleTaskClick = (task: Task) => {
    if (hasChatId && chat) {
      // Append a message to rename the task
      chat.append({
        role: "user",
        content: `I want to change the name of task "${task.description}"`,
      });
    }
  };

  const handleCheckboxClick = (task: Task) => {
    if (hasChatId && chat) {
      // Append a message to mark the task as complete
      const action = task.status === 'completed' ? "mark as incomplete" : "mark as complete";
      chat.append({
        role: "user",
        content: `I want to ${action} the task "${task.description}"`,
      });
    }
    // Still call the original toggle handler
    onToggleTask(task.taskId);
  };

  const handleDeleteClick = (task: Task) => {
    if (hasChatId && chat) {
      // Append a message to delete the task
      chat.append({
        role: "user",
        content: `I want to delete the task "${task.description}"`,
      });
    }
    // Still call the original remove handler
    onRemoveTask(task.taskId);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Current Tasks</CardTitle>
        <CardDescription>
          {tasks.length > 0
            ? "Here's your current task list:"
            : "You don't have any tasks yet."}
        </CardDescription>
      </CardHeader>
      {tasks.length > 0 && (
        <CardContent>
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li 
                key={task.taskId} 
                className="flex items-center justify-between border-b pb-2 rounded px-1"
              >
                <div className="flex items-center grow mr-2">
                  <Checkbox
                    id={`task-${task.taskId}`}
                    checked={task.status === 'completed'}
                    onChange={(e) => {
                      e.stopPropagation();
                      if (chatId) {
                        handleCheckboxClick(task);
                      } else {
                        onToggleTask(task.taskId);
                      }
                    }}
                    className={chatId ? 'cursor-pointer' : ''}
                  />
                  <span 
                    className={`ml-2 ${task.status === 'completed' ? "line-through text-muted-foreground" : ""} ${chatId ? 'cursor-pointer hover:underline' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (chatId) {
                        handleTaskClick(task);
                      }
                    }}
                  >
                    {task.description}
                  </span>
                  {chatId && (
                    <Edit 
                      className="ml-2 size-3 text-muted-foreground hover:text-foreground cursor-pointer" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTaskClick(task);
                      }}
                    />
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (chatId) {
                      handleDeleteClick(task);
                    } else {
                      onRemoveTask(task.taskId);
                    }
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  );
}
```

### 6. Integrate with Message Rendering

**File: `components/custom/message.tsx`**

```tsx
// Import your new components
import { ListTasks } from "../tasks/list-tasks";
import { TaskConfirmation } from "../tasks/task-confirmation";

// Inside the Message component's toolInvocations rendering:
{toolInvocations && (
  <div className="flex flex-col gap-4">
    {toolInvocations.map((toolInvocation) => {
      const { toolName, toolCallId, state } = toolInvocation;

      if (state === "result") {
        const { result } = toolInvocation;

        return (
          <div key={toolCallId}>
            {/* Add your tool result rendering */}
            {toolName === "addTask" ? (
              <TaskConfirmation {...result} />
            ) : toolName === "listTasks" ? (
              <ListTasks
                tasks={result.tasks}
                onToggleTask={() => {}}
                onRemoveTask={() => {}}
                chatId={chatId}
              />
            ) : toolName === "markTaskComplete" ? (
              <TaskConfirmation status={result.status} taskId={result.taskId} />
            ) : toolName === "deleteTask" ? (
              <TaskConfirmation status="deleted" taskId={result.taskId} />
            ) : toolName === "updateTaskName" ? (
              <TaskConfirmation 
                status="updated" 
                taskId={result.taskId} 
                description={result.description} 
              />
            ) : (
              <div>{JSON.stringify(result, null, 2)}</div>
            )}
          </div>
        );
      } else {
        // Loading state
        return (
          <div key={toolCallId} className="skeleton">
            {toolName === "addTask" ? (
              <TaskConfirmation status="added" taskId="temp-skeleton" />
            ) : toolName === "listTasks" ? (
              <ListTasks tasks={[]} onToggleTask={() => {}} onRemoveTask={() => {}} chatId={chatId} />
            ) : toolName === "markTaskComplete" ? (
              <TaskConfirmation status="pending" taskId="temp-skeleton" />
            ) : null}
          </div>
        );
      }
    })}
  </div>
)}
```

---

## Database Integration

### 1. Database Migration

Create a new migration file:

```typescript
// drizzle/migrations/XXXX_add_tasks_table.sql
CREATE TABLE IF NOT EXISTS "Task" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"description" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "Task" ADD CONSTRAINT "Task_user_id_User_id_fk" 
FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE no action ON UPDATE no action;
```

### 2. Database Configuration

Ensure your `drizzle.config.ts` is properly configured:

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./lib/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
```

### 3. Run Migration

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

---

## UI Component Development

### 1. Design Principles

- **Consistent UI**: Use the existing shadcn/ui components
- **Responsive Design**: Ensure components work on all screen sizes
- **Loading States**: Provide skeleton states for better UX
- **Error Handling**: Display helpful error messages
- **Accessibility**: Include proper ARIA labels and keyboard navigation

### 2. Styling Guidelines

```tsx
// Use consistent styling patterns
<Card className="w-full max-w-md">
  <CardHeader>
    <CardTitle className="flex items-center">
      <Icon className="mr-2 size-5 text-color" />
      Title
    </CardTitle>
    <CardDescription>
      Description text
    </CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### 3. Component Structure

```
components/
├── {feature}/
│   ├── list-{feature}.tsx      # Main list/display component
│   ├── {feature}-confirmation.tsx  # Action confirmation
│   ├── create-{feature}.tsx    # Optional: Creation form
│   └── {feature}-detail.tsx    # Optional: Detail view
```

---

## Chat Integration

### 1. Interactive Components

Components can integrate with the chat system by:

- Using `useChat` hook for sending messages
- Handling click events to trigger AI actions
- Providing visual feedback for user interactions

### 2. Message Flow

```
User clicks UI element → Component sends message to chat → AI processes → Tool executed → Result displayed
```

### 3. Best Practices

- **Dual Functionality**: Components should work both with and without chat integration
- **Fallback Handlers**: Provide non-chat handlers for standalone usage
- **Clear Intent**: Make user intentions clear in generated messages
- **Immediate Feedback**: Provide instant visual feedback before AI processing

---

## Testing and Validation

### 1. Test Database Operations

```typescript
// Test your database queries
import { addTask, getTasksByUserId } from "@/db/queries";

// Test CREATE
const task = await addTask({ 
  userId: "test-user-id", 
  description: "Test task" 
});

// Test READ
const tasks = await getTasksByUserId({ userId: "test-user-id" });
```

### 2. Test AI Actions

```typescript
// Test your action functions
import { addTaskAction } from "@/ai/actions";

const result = await addTaskAction({
  taskDescription: "Test task",
  userId: "test-user-id"
});
```

### 3. Test UI Components

```tsx
// Test your React components
import { render, screen } from "@testing-library/react";
import { TaskConfirmation } from "@/components/tasks/task-confirmation";

test("renders task confirmation", () => {
  render(
    <TaskConfirmation 
      taskId="test-id" 
      status="added" 
      description="Test task" 
    />
  );
  expect(screen.getByText("Task Added")).toBeInTheDocument();
});
```

---

## Best Practices

### 1. Error Handling

```typescript
// Always handle errors gracefully
export async function yourAction({ param, userId }: { param: string; userId: string }) {
  console.log(`Action: Your action for user ${userId}`);
  try {
    const result = await yourDatabaseOperation({ param, userId });
    return { success: true, data: result };
  } catch (error) {
    console.error("Error in yourAction:", error);
    return { error: "Failed to perform action." };
  }
}
```

### 2. Type Safety

```typescript
// Use proper TypeScript types
interface YourFeatureProps {
  items: YourItem[];
  onAction: (id: string) => void;
  chatId?: string;
}

type ActionStatus = 'created' | 'updated' | 'deleted' | 'error';
```

### 3. Database Security

```typescript
// Always include userId in database operations for security
export async function getUserSpecificData({
  id,
  userId, // Always required
}: {
  id: string;
  userId: string;
}): Promise<void> {
  await db
    .select()
    .from(yourTable)
    .where(and(eq(yourTable.id, id), eq(yourTable.userId, userId))); // Ensure user owns the data
}
```

### 4. AI System Prompts

```typescript
// Be specific in your system prompts
system: `
  You are a helpful assistant that can manage [feature].
  
  Here's the optimal [feature] management flow:
  - step 1: description
  - step 2: description
  - step 3: description (automatically show list after action)
  
  Guidelines:
  - Always be concise
  - Show confirmation after actions
  - Ask for clarification when needed
`
```

### 5. Component Reusability

```tsx
// Make components flexible and reusable
interface ListComponentProps {
  items: Item[];
  onAction?: (id: string) => void;
  chatId?: string; // Optional chat integration
  className?: string; // Allow custom styling
  showActions?: boolean; // Optional action buttons
}
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Tool Not Being Called

**Problem**: AI doesn't call your tool
**Solutions**:
- Check tool description is clear and specific
- Ensure parameters are properly typed with `z.object()`
- Update system prompt to guide tool usage
- Verify tool is exported in the tools object

#### 2. Database Errors

**Problem**: Database operations failing
**Solutions**:
- Check database connection
- Verify table schema matches your queries
- Ensure foreign key relationships are correct
- Run migrations: `npx drizzle-kit migrate`

#### 3. UI Not Rendering

**Problem**: Tool results not displaying
**Solutions**:
- Check toolName matches in message.tsx
- Verify component imports
- Ensure proper props are passed
- Check for TypeScript errors

#### 4. Chat Integration Issues

**Problem**: Interactive elements not working
**Solutions**:
- Verify `useChat` hook is properly configured
- Check chatId is being passed correctly
- Ensure event handlers prevent propagation
- Test with and without chat integration

#### 5. Type Errors

**Problem**: TypeScript compilation errors
**Solutions**:
- Ensure all interfaces are properly defined
- Check database schema types match query returns
- Verify action function return types
- Update component prop types

### Debugging Tips

1. **Use Console Logs**: Add logging to action functions
2. **Check Network Tab**: Verify API calls in browser dev tools
3. **Database Inspection**: Use database client to verify data
4. **Component Testing**: Test components in isolation
5. **AI Responses**: Check AI responses in network tab

---

## Conclusion

This guide provides a complete framework for adding new tools to the AI chat system. The Tasks system serves as a perfect example of:

- **Full CRUD Operations**: Create, Read, Update, Delete
- **Database Integration**: Proper schema design and queries
- **AI Tool Definitions**: Clear parameter schemas and execution
- **Interactive UI Components**: Chat-integrated and standalone modes
- **Error Handling**: Graceful failure management
- **Type Safety**: Full TypeScript support

By following this guide, you can implement any new feature with confidence, ensuring consistency with the existing codebase and providing a seamless user experience.

Remember to always:
- Test thoroughly at each step
- Follow existing code patterns
- Maintain type safety
- Handle errors gracefully
- Provide clear user feedback

Happy coding! 🚀
