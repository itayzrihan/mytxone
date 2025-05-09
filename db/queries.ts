import "server-only";

import { genSaltSync, hashSync, compareSync } from "bcrypt-ts"; // Use bcrypt-ts
import { desc, eq, and, like, ilike } from "drizzle-orm"; // Added like, ilike
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema"; // Import the entire schema
const { user, chat, reservation, memories, apiKey, tasks } = schema; // Destructure needed tables
import type { User, Memory, ApiKey, Task } from "./schema"; // Import types separately

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
let client = postgres(`${process.env.POSTGRES_URL!}?sslmode=require`);
let db = drizzle(client, { schema }); // Pass the schema to drizzle

export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    console.error("Failed to get user from database");
    throw error;
  }
}

export async function createUser(email: string, password: string) {
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  try {
    return await db.insert(user).values({ email, password: hash });
  } catch (error) {
    console.error("Failed to create user in database");
    throw error;
  }
}

export async function saveChat({
  id,
  messages,
  userId,
}: {
  id: string;
  messages: any;
  userId: string;
}) {
  try {
    const selectedChats = await db.select().from(chat).where(eq(chat.id, id));

    if (selectedChats.length > 0) {
      return await db
        .update(chat)
        .set({
          messages: JSON.stringify(messages),
        })
        .where(eq(chat.id, id));
    }

    return await db.insert(chat).values({
      id,
      createdAt: new Date(),
      messages: JSON.stringify(messages),
      userId,
    });
  } catch (error) {
    console.error("Failed to save chat in database");
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    return await db.delete(chat).where(eq(chat.id, id));
  } catch (error) {
    console.error("Failed to delete chat by id from database");
    throw error;
  }
}

export async function getChatsByUserId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(chat)
      .where(eq(chat.userId, id))
      .orderBy(desc(chat.createdAt));
  } catch (error) {
    console.error("Failed to get chats by user from database");
    throw error;
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
    return selectedChat;
  } catch (error) {
    console.error("Failed to get chat by id from database");
    throw error;
  }
}

export async function createReservation({
  id,
  userId,
  details,
}: {
  id: string;
  userId: string;
  details: any;
}) {
  return await db.insert(reservation).values({
    id,
    createdAt: new Date(),
    userId,
    hasCompletedPayment: false,
    details: JSON.stringify(details),
  });
}

export async function getReservationById({ id }: { id: string }) {
  const [selectedReservation] = await db
    .select()
    .from(reservation)
    .where(eq(reservation.id, id));

  return selectedReservation;
}

export async function updateReservation({
  id,
  hasCompletedPayment,
}: {
  id: string;
  hasCompletedPayment: boolean;
}) {
  return await db
    .update(reservation)
    .set({
      hasCompletedPayment,
    })
    .where(eq(reservation.id, id));
}

// --- Memory Queries ---

export async function saveMemory({
  userId,
  content,
}: {
  userId: string;
  content: string;
}): Promise<Array<Memory>> {
  try {
    const newMemory = await db
      .insert(memories)
      .values({
        userId,
        content,
      })
      .returning();
    return newMemory;
  } catch (error) {
    console.error("Failed to save memory in database");
    throw error;
  }
}

export async function getMemoriesByUserId({
  userId,
}: {
  userId: string;
}): Promise<Array<Memory>> {
  try {
    return await db
      .select()
      .from(memories)
      .where(eq(memories.userId, userId))
      .orderBy(desc(memories.createdAt));
  } catch (error) {
    console.error("Failed to get memories by user from database");
    throw error;
  }
}

export async function findMemoriesByContent({
  userId,
  contentQuery,
}: {
  userId: string;
  contentQuery: string;
}): Promise<Array<Memory>> {
  try {
    return await db
      .select()
      .from(memories)
      .where(
        and(
          eq(memories.userId, userId),
          ilike(memories.content, `%${contentQuery}%`)
        )
      )
      .orderBy(desc(memories.createdAt));
  } catch (error) {
    console.error("Failed to find memories by content from database");
    throw error;
  }
}

export async function deleteMemoryById({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  try {
    return await db
      .delete(memories)
      .where(and(eq(memories.id, id), eq(memories.userId, userId)));
  } catch (error) {
    console.error("Failed to delete memory by id from database");
    throw error;
  }
}

// --- Task Queries ---

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

// --- API Key Queries ---

export async function getApiKeysByUserId(userId: string): Promise<Array<ApiKey>> {
  try {
    return await db.query.apiKey.findMany({
      where: eq(apiKey.userId, userId),
      columns: {
        hashedKey: true,
        id: true,
        userId: true,
        createdAt: true,
        lastUsedAt: true,
        name: true,
      },
      orderBy: desc(apiKey.createdAt),
    });
  } catch (error) {
    console.error("Failed to get API keys by user ID from database:", error);
    throw error;
  }
}

export async function createApiKeyRecord(data: {
  userId: string;
  hashedKey: string; // Hashed key is passed in now
  name: string | null;
}): Promise<ApiKey[]> {
  try {
    // Hashing is now done in the action, just insert the record
    return await db.insert(apiKey).values(data).returning();
  } catch (error) {
    console.error("Failed to create API key record in database");
    throw error;
  }
}

export async function deleteApiKeyByIdAndUserId(keyId: string, userId: string): Promise<number> {
  try {
    const result = await db
      .delete(apiKey)
      .where(and(eq(apiKey.id, keyId), eq(apiKey.userId, userId)));
    // Return a count of affected rows or 0 if result doesn't have rowCount
    return 1; // Assuming successful deletion affects 1 row
  } catch (error) {
    console.error("Failed to delete API key by ID and user ID from database");
    throw error;
  }
}

// Function to find a matching API key by comparing the raw key against stored hashes
// Returns the key details (excluding hash) and user ID if found and valid
export async function findValidApiKey(rawKey: string): Promise<(Omit<ApiKey, "hashedKey"> & { userId: string }) | null> {
  try {
    // In a real high-traffic scenario, optimize this lookup.
    // Fetching all keys is inefficient.
    const potentialKeys = await db.query.apiKey.findMany({
      columns: { id: true, hashedKey: true, userId: true, createdAt: true, lastUsedAt: true, name: true },
    });

    for (const key of potentialKeys) {
      // Use compareSync from bcrypt-ts
      const match = compareSync(rawKey, key.hashedKey);
      if (match) {
        // Return key details (without the hash) upon successful match
        const { hashedKey, ...keyDetails } = key;
        return keyDetails;
      }
    }
    return null; // No match found
  } catch (error) {
    console.error("Error finding/validating API key in database:", error);
    throw error; // Re-throw to be handled by the caller
  }
}

export async function updateApiKeyLastUsed(keyId: string): Promise<void> {
  try {
    await db
      .update(apiKey)
      .set({ lastUsedAt: new Date() })
      .where(eq(apiKey.id, keyId));
  } catch (error) {
    console.error("Failed to update API key lastUsedAt:", keyId, error);
  }
}
