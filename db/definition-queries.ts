import "server-only";

import { desc, eq, and } from "drizzle-orm";
import { definitions } from "./definitions-schema";
import { db } from "./queries";
import type { Definition } from "./definitions-schema";

// --- Definition Queries ---

export async function saveDefinition({
  userId,
  name,
  description,
  content,
}: {
  userId: string;
  name: string;
  description?: string;
  content: string;
}): Promise<Array<Definition>> {
  try {
    const newDefinition = await db
      .insert(definitions)
      .values({
        userId,
        name,
        description: description || null,
        content,
      })
      .returning();
    return newDefinition;
  } catch (error) {
    console.error("Failed to save definition in database:", error);
    throw error;
  }
}

export async function getDefinitionsByUserId({
  userId,
}: {
  userId: string;
}): Promise<Array<Definition>> {
  try {
    return await db
      .select()
      .from(definitions)
      .where(eq(definitions.userId, userId))
      .orderBy(desc(definitions.updatedAt));
  } catch (error) {
    console.error("Failed to get definitions by user from database:", error);
    throw error;
  }
}

export async function getDefinitionById({
  id,
  userId,
}: {
  id: string;
  userId: string;
}): Promise<Definition | undefined> {
  try {
    const [selectedDefinition] = await db
      .select()
      .from(definitions)
      .where(and(eq(definitions.id, id), eq(definitions.userId, userId)));
    return selectedDefinition;
  } catch (error) {
    console.error("Failed to get definition by id from database:", error);
    throw error;
  }
}

export async function deleteDefinitionById({
  id,
  userId,
}: {
  id: string;
  userId: string;
}): Promise<void> {
  try {
    await db
      .delete(definitions)
      .where(and(eq(definitions.id, id), eq(definitions.userId, userId)));
  } catch (error) {
    console.error("Failed to delete definition by id from database:", error);
    throw error;
  }
}

export async function updateDefinition({
  id,
  userId,
  name,
  description,
  content,
}: {
  id: string;
  userId: string;
  name?: string;
  description?: string;
  content?: string;
}): Promise<void> {
  try {
    const updateData: Partial<Definition> = {};
    
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (content !== undefined) updateData.content = content;
    updateData.updatedAt = new Date();
    
    await db
      .update(definitions)
      .set(updateData)
      .where(and(eq(definitions.id, id), eq(definitions.userId, userId)));
  } catch (error) {
    console.error("Failed to update definition in database:", error);
    throw error;
  }
}
