import "server-only";

import { desc, eq, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { customHooks, customContentTypes, type CustomHook, type CustomContentType } from "./schema";

// Initialize database connection
let client = postgres(`${process.env.POSTGRES_URL!}?sslmode=require`);
export let db = drizzle(client, { schema });

// Custom Hooks Queries

export async function getCustomHooksByUserId(userId: string): Promise<CustomHook[]> {
  return await db
    .select()
    .from(customHooks)
    .where(or(
      eq(customHooks.userId, userId), // User's own custom hooks
      eq(customHooks.isPublic, true)  // Public custom hooks from all users
    ))
    .orderBy(desc(customHooks.createdAt));
}

export async function createCustomHook({
  userId,
  value,
  label,
  description,
  example,
  structure,
  isPublic,
}: {
  userId: string;
  value: string;
  label: string;
  description: string;
  example: string;
  structure: string;
  isPublic: boolean;
}): Promise<CustomHook> {
  const [hook] = await db
    .insert(customHooks)
    .values({
      userId,
      value,
      label,
      description,
      example,
      structure,
      isPublic,
    })
    .returning();
  
  return hook;
}

export async function updateCustomHook({
  id,
  userId,
  value,
  label,
  description,
  example,
  structure,
  isPublic,
}: {
  id: string;
  userId: string;
  value?: string;
  label?: string;
  description?: string;
  example?: string;
  structure?: string;
  isPublic?: boolean;
}): Promise<CustomHook> {
  const [hook] = await db
    .update(customHooks)
    .set({
      ...(value !== undefined && { value }),
      ...(label !== undefined && { label }),
      ...(description !== undefined && { description }),
      ...(example !== undefined && { example }),
      ...(structure !== undefined && { structure }),
      ...(isPublic !== undefined && { isPublic }),
      updatedAt: new Date(),
    })
    .where(eq(customHooks.id, id))
    .returning();
  
  return hook;
}

export async function deleteCustomHook(id: string, userId: string): Promise<void> {
  await db
    .delete(customHooks)
    .where(eq(customHooks.id, id));
}

export async function getCustomHookById(id: string): Promise<CustomHook | null> {
  const [hook] = await db
    .select()
    .from(customHooks)
    .where(eq(customHooks.id, id))
    .limit(1);
  
  return hook || null;
}

// Custom Content Types Queries

export async function getCustomContentTypesByUserId(userId: string): Promise<CustomContentType[]> {
  return await db
    .select()
    .from(customContentTypes)
    .where(or(
      eq(customContentTypes.userId, userId), // User's own custom content types
      eq(customContentTypes.isPublic, true)  // Public custom content types from all users
    ))
    .orderBy(desc(customContentTypes.createdAt));
}

export async function createCustomContentType({
  userId,
  value,
  label,
  description,
  example,
  structure,
  category,
  isPublic,
}: {
  userId: string;
  value: string;
  label: string;
  description: string;
  example: string;
  structure: string;
  category: string;
  isPublic: boolean;
}): Promise<CustomContentType> {
  const [contentType] = await db
    .insert(customContentTypes)
    .values({
      userId,
      value,
      label,
      description,
      example,
      structure,
      category,
      isPublic,
    })
    .returning();
  
  return contentType;
}

export async function updateCustomContentType({
  id,
  userId,
  value,
  label,
  description,
  example,
  structure,
  category,
  isPublic,
}: {
  id: string;
  userId: string;
  value?: string;
  label?: string;
  description?: string;
  example?: string;
  structure?: string;
  category?: string;
  isPublic?: boolean;
}): Promise<CustomContentType> {
  const [contentType] = await db
    .update(customContentTypes)
    .set({
      ...(value !== undefined && { value }),
      ...(label !== undefined && { label }),
      ...(description !== undefined && { description }),
      ...(example !== undefined && { example }),
      ...(structure !== undefined && { structure }),
      ...(category !== undefined && { category }),
      ...(isPublic !== undefined && { isPublic }),
      updatedAt: new Date(),
    })
    .where(eq(customContentTypes.id, id))
    .returning();
  
  return contentType;
}

export async function deleteCustomContentType(id: string, userId: string): Promise<void> {
  await db
    .delete(customContentTypes)
    .where(eq(customContentTypes.id, id));
}

export async function getCustomContentTypeById(id: string): Promise<CustomContentType | null> {
  const [contentType] = await db
    .select()
    .from(customContentTypes)
    .where(eq(customContentTypes.id, id))
    .limit(1);
  
  return contentType || null;
}

// Combined queries for easier use

export async function getAllCustomItemsByUserId(userId: string): Promise<{
  customHooks: CustomHook[];
  customContentTypes: CustomContentType[];
}> {
  const [hooks, contentTypes] = await Promise.all([
    getCustomHooksByUserId(userId),
    getCustomContentTypesByUserId(userId)
  ]);

  return {
    customHooks: hooks,
    customContentTypes: contentTypes
  };
}