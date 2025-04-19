import "server-only";

import { genSaltSync, hashSync } from "bcrypt-ts";
import { desc, eq, and, like, ilike } from "drizzle-orm"; // Added like, ilike
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { user, chat, User, reservation, memories, Memory } from "./schema"; // Added memories, Memory

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
let client = postgres(`${process.env.POSTGRES_URL!}?sslmode=require`);
let db = drizzle(client);

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
}): Promise<Array<Memory>> { // Return the created memory
  try {
    // Insert the new memory and return it
    const newMemory = await db
      .insert(memories)
      .values({
        userId,
        content,
      })
      .returning(); // Return the inserted row
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
    // Retrieve all memories for the user, ordered by creation date
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

// Function to find memories by content (case-insensitive search)
export async function findMemoriesByContent({
  userId,
  contentQuery,
}: {
  userId: string;
  contentQuery: string;
}): Promise<Array<Memory>> {
  try {
    // Use ilike for case-insensitive partial matching
    return await db
      .select()
      .from(memories)
      .where(
        and(
          eq(memories.userId, userId),
          ilike(memories.content, `%${contentQuery}%`) // Search for query within content
        )
      )
      .orderBy(desc(memories.createdAt));
  } catch (error) {
    console.error("Failed to find memories by content from database");
    throw error;
  }
}

// Optional: Function to delete a specific memory
export async function deleteMemoryById({
  id,
  userId, // Ensure user owns the memory
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
