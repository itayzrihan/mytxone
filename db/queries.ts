import "server-only";

import { genSaltSync, hashSync, compareSync } from "bcrypt-ts"; // Use bcrypt-ts
import { desc, eq, and, like, ilike } from "drizzle-orm"; // Added like, ilike
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema"; // Import the entire schema
const { user, chat, reservation, memories, apiKey, tasks, meditations, scripts } = schema; // Destructure needed tables
import type { User, Memory, ApiKey, Task, Meditation, Script } from "./schema"; // Import types separately

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
let client: ReturnType<typeof postgres> | null = null;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!dbInstance) {
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!dbUrl) {
      throw new Error("DATABASE_URL or POSTGRES_URL environment variable is not set");
    }
    // Don't append sslmode if it's already in the URL
    const connectionUrl = dbUrl.includes('sslmode') ? dbUrl : `${dbUrl}?sslmode=require`;
    console.log("[DB] Connecting to database:", connectionUrl.replace(/:[^:]*@/, ':***@'));
    client = postgres(connectionUrl);
    dbInstance = drizzle(client, { schema });
  }
  return dbInstance;
}

export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await getDb().select().from(user).where(eq(user.email, email));
  } catch (error) {
    console.error("Failed to get user from database");
    throw error;
  }
}

export async function createUser(email: string, password: string) {
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  try {
    return await getDb().insert(user).values({ email, password: hash });
  } catch (error) {
    console.error("Failed to create user in database");
    throw error;
  }
}

export async function updateUser(
  userId: string,
  updates: Partial<{
    totpSecret: string | null;
    totpEnabled: boolean;
    totpSeedId: string | null;
    totpSetupCompleted: Date | null;
  }>
) {
  try {
    return await getDb()
      .update(user)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));
  } catch (error) {
    console.error("Failed to update user in database");
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
    const selectedChats = await getDb().select().from(chat).where(eq(chat.id, id));

    if (selectedChats.length > 0) {
      return await getDb()
        .update(chat)
        .set({
          messages: JSON.stringify(messages),
        })
        .where(eq(chat.id, id));
    }

    return await getDb().insert(chat).values({
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
    return await getDb().delete(chat).where(eq(chat.id, id));
  } catch (error) {
    console.error("Failed to delete chat by id from database");
    throw error;
  }
}

export async function getChatsByUserId({ id }: { id: string }) {
  try {
    return await getDb()
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
    const [selectedChat] = await getDb().select().from(chat).where(eq(chat.id, id));
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
  return await getDb().insert(reservation).values({
    id,
    createdAt: new Date(),
    userId,
    hasCompletedPayment: false,
    details: JSON.stringify(details),
  });
}

export async function getReservationById({ id }: { id: string }) {
  const [selectedReservation] = await getDb()
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
  return await getDb()
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
    const newMemory = await getDb()
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
    return await getDb()
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
    return await getDb()
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
    return await getDb()
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
    const newTask = await getDb()
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
    return await getDb()
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
    await getDb()
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
    await getDb()
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
    await getDb()
      .update(tasks)
      .set({ description })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
  } catch (error) {
    console.error("Failed to update task description in database");
    throw error;
  }
}

// --- API Key Queries ---

// --- Meditation Queries ---

export async function createMeditation({
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
}): Promise<Array<Meditation>> {
  try {
    const newMeditation = await getDb()
      .insert(meditations)
      .values({
        userId,
        type,
        title,
        content,
        duration,
      })
      .returning();
    return newMeditation;
  } catch (error) {
    console.error("Failed to create meditation in database");
    throw error;
  }
}

export async function getMeditationsByUserId({
  userId,
}: {
  userId: string;
}): Promise<Array<Meditation>> {
  try {
    return await getDb()
      .select()
      .from(meditations)
      .where(eq(meditations.userId, userId))
      .orderBy(desc(meditations.createdAt));
  } catch (error) {
    console.error("Failed to get meditations from database");
    throw error;
  }
}

export async function getMeditationById({
  id,
  userId,
}: {
  id: string;
  userId: string;
}): Promise<Meditation | undefined> {
  try {
    const result = await getDb()
      .select()
      .from(meditations)
      .where(and(eq(meditations.id, id), eq(meditations.userId, userId)));
    return result[0];
  } catch (error) {
    console.error("Failed to get meditation by ID from database");
    throw error;
  }
}

export async function deleteMeditationById({
  id,
  userId,
}: {
  id: string;
  userId: string;
}): Promise<number> {
  try {
    const result = await getDb()
      .delete(meditations)
      .where(and(eq(meditations.id, id), eq(meditations.userId, userId)));
    return 1; // Assuming successful deletion affects 1 row
  } catch (error) {
    console.error("Failed to delete meditation by ID from database");
    throw error;
  }
}

// --- API Key Queries ---

export async function getApiKeysByUserId(userId: string): Promise<Array<ApiKey>> {
  try {
    return await getDb().query.apiKey.findMany({
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
    return await getDb().insert(apiKey).values(data).returning();
  } catch (error) {
    console.error("Failed to create API key record in database");
    throw error;
  }
}

export async function deleteApiKeyByIdAndUserId(keyId: string, userId: string): Promise<number> {
  try {
    const result = await getDb()
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
    const potentialKeys = await getDb().query.apiKey.findMany({
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
    await getDb()
      .update(apiKey)
      .set({ lastUsedAt: new Date() })
      .where(eq(apiKey.id, keyId));
  } catch (error) {
    console.error("Failed to update API key lastUsedAt:", keyId, error);
  }
}

// Script-related functions
export async function getUserScripts(userId: string) {
  try {
    return await getDb().select().from(schema.scripts).where(eq(schema.scripts.userId, userId)).orderBy(desc(schema.scripts.updatedAt));
  } catch (error) {
    console.error("Failed to get user scripts from database");
    throw error;
  }
}

export async function getScriptById(scriptId: string) {
  try {
    const result = await getDb().select().from(schema.scripts).where(eq(schema.scripts.id, scriptId));
    return result[0] || null;
  } catch (error) {
    console.error("Failed to get script by id from database");
    throw error;
  }
}

export async function getScriptsByUserId(userId: string) {
  try {
    return await getDb().select({
      id: schema.scripts.id,
      title: schema.scripts.title,
      description: schema.scripts.description,
      content: schema.scripts.content,
      hookType: schema.scripts.hookType,
      mainContentType: schema.scripts.mainContentType,
      createdAt: schema.scripts.createdAt,
      status: schema.scripts.status
    }).from(schema.scripts)
      .where(eq(schema.scripts.userId, userId))
      .orderBy(desc(schema.scripts.createdAt));
  } catch (error) {
    console.error("Failed to get scripts by user id from database");
    throw error;
  }
}

export async function createScript(scriptData: {
  userId: string;
  title: string;
  description?: string;
  content: string;
  language: string;
  hookType: string;
  mainContentType: string;
  contentFolderLink?: string;
  productionVideoLink?: string;
  uploadedVideoLinks?: string[];
  status?: string;
  tags?: string[];
  isPublic?: boolean;
}) {
  try {
    return await getDb().insert(schema.scripts).values({
      ...scriptData,
      tags: scriptData.tags ? JSON.stringify(scriptData.tags) : null,
      uploadedVideoLinks: scriptData.uploadedVideoLinks ? JSON.stringify(scriptData.uploadedVideoLinks) : null,
    }).returning();
  } catch (error) {
    console.error("Failed to create script in database");
    throw error;
  }
}

export async function updateScript(scriptId: string, scriptData: {
  title?: string;
  description?: string;
  content?: string;
  language?: string;
  hookType?: string;
  mainContentType?: string;
  contentFolderLink?: string;
  productionVideoLink?: string;
  uploadedVideoLinks?: string[];
  status?: string;
  tags?: string[];
  isPublic?: boolean;
}) {
  try {
    const updateData = {
      ...scriptData,
      updatedAt: new Date(),
      tags: scriptData.tags ? JSON.stringify(scriptData.tags) : undefined,
      uploadedVideoLinks: scriptData.uploadedVideoLinks ? JSON.stringify(scriptData.uploadedVideoLinks) : undefined,
    };
    
    return await getDb().update(schema.scripts)
      .set(updateData)
      .where(eq(schema.scripts.id, scriptId))
      .returning();
  } catch (error) {
    console.error("Failed to update script in database");
    throw error;
  }
}

export async function deleteScript(scriptId: string) {
  try {
    return await getDb().delete(schema.scripts).where(eq(schema.scripts.id, scriptId));
  } catch (error) {
    console.error("Failed to delete script from database");
    throw error;
  }
}

// ===== SCRIPT SERIES FUNCTIONS =====

export async function getUserSeries(userId: string) {
  try {
    return await getDb().select()
      .from(schema.scriptSeries)
      .where(eq(schema.scriptSeries.userId, userId))
      .orderBy(schema.scriptSeries.order, desc(schema.scriptSeries.createdAt));
  } catch (error) {
    console.error("Failed to get user series from database");
    throw error;
  }
}

export async function getSeriesById(seriesId: string) {
  try {
    const result = await getDb().select()
      .from(schema.scriptSeries)
      .where(eq(schema.scriptSeries.id, seriesId));
    return result[0] || null;
  } catch (error) {
    console.error("Failed to get series by id from database");
    throw error;
  }
}

export async function createSeries(seriesData: {
  userId: string;
  name: string;
  description?: string;
  order?: number;
}) {
  try {
    return await getDb().insert(schema.scriptSeries)
      .values(seriesData)
      .returning();
  } catch (error) {
    console.error("Failed to create series in database");
    throw error;
  }
}

export async function updateSeries(seriesId: string, seriesData: {
  name?: string;
  description?: string;
  order?: number;
}) {
  try {
    return await getDb().update(schema.scriptSeries)
      .set({
        ...seriesData,
        updatedAt: new Date(),
      })
      .where(eq(schema.scriptSeries.id, seriesId))
      .returning();
  } catch (error) {
    console.error("Failed to update series in database");
    throw error;
  }
}

export async function deleteSeries(seriesId: string) {
  try {
    return await getDb().delete(schema.scriptSeries)
      .where(eq(schema.scriptSeries.id, seriesId));
  } catch (error) {
    console.error("Failed to delete series from database");
    throw error;
  }
}

export async function addScriptToSeries(scriptId: string, seriesId: string, orderInSeries?: number) {
  try {
    return await getDb().insert(schema.scriptSeriesLinks)
      .values({
        scriptId,
        seriesId,
        orderInSeries: orderInSeries || 0,
      })
      .returning();
  } catch (error) {
    console.error("Failed to add script to series in database");
    throw error;
  }
}

export async function removeScriptFromSeries(scriptId: string, seriesId: string) {
  try {
    return await getDb().delete(schema.scriptSeriesLinks)
      .where(
        and(
          eq(schema.scriptSeriesLinks.scriptId, scriptId),
          eq(schema.scriptSeriesLinks.seriesId, seriesId)
        )
      );
  } catch (error) {
    console.error("Failed to remove script from series in database");
    throw error;
  }
}

export async function getSeriesScripts(seriesId: string) {
  try {
    const results = await getDb().select({
      script: schema.scripts,
      link: schema.scriptSeriesLinks,
    })
      .from(schema.scriptSeriesLinks)
      .innerJoin(schema.scripts, eq(schema.scriptSeriesLinks.scriptId, schema.scripts.id))
      .where(eq(schema.scriptSeriesLinks.seriesId, seriesId))
      .orderBy(schema.scriptSeriesLinks.orderInSeries, desc(schema.scriptSeriesLinks.createdAt));
    
    return results.map(r => ({ ...r.script, orderInSeries: r.link.orderInSeries }));
  } catch (error) {
    console.error("Failed to get series scripts from database");
    throw error;
  }
}

export async function getScriptSeries(scriptId: string) {
  try {
    const results = await getDb().select({
      series: schema.scriptSeries,
      link: schema.scriptSeriesLinks,
    })
      .from(schema.scriptSeriesLinks)
      .innerJoin(schema.scriptSeries, eq(schema.scriptSeriesLinks.seriesId, schema.scriptSeries.id))
      .where(eq(schema.scriptSeriesLinks.scriptId, scriptId))
      .orderBy(schema.scriptSeries.order);
    
    return results.map(r => r.series);
  } catch (error) {
    console.error("Failed to get script series from database");
    throw error;
  }
}

export async function updateScriptOrderInSeries(scriptId: string, seriesId: string, newOrder: number) {
  try {
    return await getDb().update(schema.scriptSeriesLinks)
      .set({ orderInSeries: newOrder })
      .where(
        and(
          eq(schema.scriptSeriesLinks.scriptId, scriptId),
          eq(schema.scriptSeriesLinks.seriesId, seriesId)
        )
      )
      .returning();
  } catch (error) {
    console.error("Failed to update script order in series in database");
    throw error;
  }
}

// ===== PROMPT FUNCTIONS =====

export async function getUserPrompts(userId: string) {
  try {
    return await getDb().select()
      .from(schema.prompts)
      .where(eq(schema.prompts.userId, userId))
      .orderBy(desc(schema.prompts.updatedAt));
  } catch (error) {
    console.error("Failed to get user prompts from database");
    throw error;
  }
}

export async function getPromptById(promptId: string) {
  try {
    const result = await getDb().select()
      .from(schema.prompts)
      .where(eq(schema.prompts.id, promptId));
    return result[0] || null;
  } catch (error) {
    console.error("Failed to get prompt by id from database");
    throw error;
  }
}

export async function createPrompt(promptData: {
  userId: string;
  title: string;
  description?: string;
  promptText: string;
  category?: string;
  tags?: string[];
  isFavorite?: boolean;
  isPublic?: boolean;
}) {
  try {
    return await getDb().insert(schema.prompts)
      .values({
        ...promptData,
        tags: promptData.tags ? JSON.stringify(promptData.tags) : null,
      })
      .returning();
  } catch (error) {
    console.error("Failed to create prompt in database");
    throw error;
  }
}

export async function updatePrompt(promptId: string, promptData: {
  title?: string;
  description?: string;
  promptText?: string;
  category?: string;
  tags?: string[];
  isFavorite?: boolean;
  isPublic?: boolean;
}) {
  try {
    const updateData = {
      ...promptData,
      updatedAt: new Date(),
      tags: promptData.tags ? JSON.stringify(promptData.tags) : undefined,
    };
    
    return await getDb().update(schema.prompts)
      .set(updateData)
      .where(eq(schema.prompts.id, promptId))
      .returning();
  } catch (error) {
    console.error("Failed to update prompt in database");
    throw error;
  }
}

export async function deletePrompt(promptId: string) {
  try {
    return await getDb().delete(schema.prompts)
      .where(eq(schema.prompts.id, promptId));
  } catch (error) {
    console.error("Failed to delete prompt from database");
    throw error;
  }
}

export async function incrementPromptUsage(promptId: string) {
  try {
    const prompt = await getPromptById(promptId);
    if (!prompt) {
      throw new Error("Prompt not found");
    }
    
    return await getDb().update(schema.prompts)
      .set({ 
        usageCount: prompt.usageCount + 1,
        updatedAt: new Date(),
      })
      .where(eq(schema.prompts.id, promptId))
      .returning();
  } catch (error) {
    console.error("Failed to increment prompt usage in database");
    throw error;
  }
}

// ===== USER MANAGEMENT & ADMIN FUNCTIONS =====

// Safe user type without password field
export type SafeUser = Omit<User, 'password'>;

export async function getAllUsers(): Promise<Array<SafeUser>> {
  try {
    return await getDb().select({
      id: user.id,
      email: user.email,
      role: user.role,
      subscription: user.subscription,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      totpSecret: user.totpSecret,
      totpEnabled: user.totpEnabled,
      totpSeedId: user.totpSeedId,
      totpSetupCompleted: user.totpSetupCompleted,
      // Exclude password field for security
    }).from(user).orderBy(desc(user.createdAt));
  } catch (error) {
    console.error("Failed to get all users from database");
    throw error;
  }
}

export async function getUserById(userId: string): Promise<SafeUser | null> {
  try {
    const users = await getDb().select({
      id: user.id,
      email: user.email,
      role: user.role,
      subscription: user.subscription,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      totpSecret: user.totpSecret,
      totpEnabled: user.totpEnabled,
      totpSeedId: user.totpSeedId,
      totpSetupCompleted: user.totpSetupCompleted,
      // Exclude password field for security
    }).from(user).where(eq(user.id, userId));
    return users[0] || null;
  } catch (error) {
    console.error("Failed to get user by ID from database");
    throw error;
  }
}

export async function updateUserRole(userId: string, role: 'user' | 'admin'): Promise<SafeUser | null> {
  try {
    const [updatedUser] = await getDb().update(user)
      .set({ 
        role,
        updatedAt: new Date()
      })
      .where(eq(user.id, userId))
      .returning({
        id: user.id,
        email: user.email,
        role: user.role,
        subscription: user.subscription,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        totpSecret: user.totpSecret,
        totpEnabled: user.totpEnabled,
        totpSeedId: user.totpSeedId,
        totpSetupCompleted: user.totpSetupCompleted,
      });
    return updatedUser || null;
  } catch (error) {
    console.error("Failed to update user role in database");
    throw error;
  }
}

export async function updateUserSubscription(userId: string, subscription: 'free' | 'basic' | 'pro'): Promise<SafeUser | null> {
  try {
    const [updatedUser] = await getDb().update(user)
      .set({ 
        subscription,
        updatedAt: new Date()
      })
      .where(eq(user.id, userId))
      .returning({
        id: user.id,
        email: user.email,
        role: user.role,
        subscription: user.subscription,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        totpSecret: user.totpSecret,
        totpEnabled: user.totpEnabled,
        totpSeedId: user.totpSeedId,
        totpSetupCompleted: user.totpSetupCompleted,
      });
    return updatedUser || null;
  } catch (error) {
    console.error("Failed to update user subscription in database");
    throw error;
  }
}

export async function checkIfUserIsAdmin(userId: string): Promise<boolean> {
  try {
    const users = await getDb().select({ role: user.role })
      .from(user)
      .where(eq(user.id, userId));
    return users[0]?.role === 'admin';
  } catch (error) {
    console.error("Failed to check user admin status");
    return false;
  }
}

export async function getUsersCount(): Promise<{ 
  total: number; 
  admins: number; 
  users: number;
  subscriptions: {
    free: number;
    basic: number;
    pro: number;
  }
}> {
  try {
    const allUsers = await getDb().select({ 
      role: user.role, 
      subscription: user.subscription 
    }).from(user);
    
    const total = allUsers.length;
    const admins = allUsers.filter(u => u.role === 'admin').length;
    const users = allUsers.filter(u => u.role === 'user').length;
    
    const subscriptions = {
      free: allUsers.filter(u => u.subscription === 'free').length,
      basic: allUsers.filter(u => u.subscription === 'basic').length,
      pro: allUsers.filter(u => u.subscription === 'pro').length,
    };
    
    return { total, admins, users, subscriptions };
  } catch (error) {
    console.error("Failed to get user counts from database");
    throw error;
  }
}
