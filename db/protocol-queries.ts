import "server-only";

import { desc, eq, and } from "drizzle-orm";
import { protocols } from "./protocols-schema";
import { db } from "./queries";
import type { Protocol } from "./protocols-schema";

// --- Protocol Queries ---

export async function saveProtocol({
  userId,
  name,
  description,
  parts,
}: {
  userId: string;
  name: string;
  description?: string;
  parts: Array<{ content: string }>;
}): Promise<Array<Protocol>> {
  try {
    const newProtocol = await db
      .insert(protocols)
      .values({
        userId,
        name,
        description: description || null,
        parts: JSON.stringify(parts),
      })
      .returning();
    return newProtocol;
  } catch (error) {
    console.error("Failed to save protocol in database:", error);
    throw error;
  }
}

export async function getProtocolsByUserId({
  userId,
}: {
  userId: string;
}): Promise<Array<Protocol>> {
  try {
    return await db
      .select()
      .from(protocols)
      .where(eq(protocols.userId, userId))
      .orderBy(desc(protocols.createdAt));
  } catch (error) {
    console.error("Failed to get protocols by user from database:", error);
    throw error;
  }
}

export async function getProtocolById({
  id,
  userId,
}: {
  id: string;
  userId: string;
}): Promise<Protocol | undefined> {
  try {
    const [selectedProtocol] = await db
      .select()
      .from(protocols)
      .where(and(eq(protocols.id, id), eq(protocols.userId, userId)));
    return selectedProtocol;
  } catch (error) {
    console.error("Failed to get protocol by id from database:", error);
    throw error;
  }
}

export async function deleteProtocolById({
  id,
  userId,
}: {
  id: string;
  userId: string;
}): Promise<void> {
  try {
    await db
      .delete(protocols)
      .where(and(eq(protocols.id, id), eq(protocols.userId, userId)));
  } catch (error) {
    console.error("Failed to delete protocol by id from database:", error);
    throw error;
  }
}

export async function updateProtocol({
  id,
  userId,
  name,
  description,
  parts,
}: {
  id: string;
  userId: string;
  name?: string;
  description?: string;
  parts?: Array<{ content: string }>;
}): Promise<void> {
  try {
    const updateData: Partial<Protocol> = {};
    
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (parts !== undefined) updateData.parts = JSON.stringify(parts) as any;
    
    await db
      .update(protocols)
      .set(updateData)
      .where(and(eq(protocols.id, id), eq(protocols.userId, userId)));
  } catch (error) {
    console.error("Failed to update protocol in database:", error);
    throw error;
  }
}
