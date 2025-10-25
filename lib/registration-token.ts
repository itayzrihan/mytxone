/**
 * Registration Token Management
 * 
 * Generates and manages registration tokens for tracking 2FA setup
 * across deep link redirects and callbacks
 * 
 * Tokens are persisted to the database for durability across server restarts
 */

import { getDb } from "@/db/queries";
import { registrationToken } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface RegistrationTokenData {
  id: string;
  token: string;
  userId: string;
  email: string;
  serviceName: string;
  callbackUrl?: string;
  status: "pending" | "completed" | "rejected" | "expired";
  createdAt: Date;
  expiresAt: Date;
  completedAt?: Date;
  seedId?: string;
  totpSeed?: string; // Encrypted
}

/**
 * Generate a unique registration token
 * Format: reg_TIMESTAMP_RANDOM
 */
export function generateRegistrationToken(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 13);
  return `reg_${timestamp}_${random}`;
}

/**
 * Create a registration token in the database
 */
export async function createRegistrationToken(data: {
  userId: string;
  email: string;
  serviceName: string;
  callbackUrl?: string;
}): Promise<RegistrationTokenData> {
  const token = generateRegistrationToken();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

  try {
    const db = getDb();
    const result = await db
      .insert(registrationToken)
      .values({
        token,
        userId: data.userId,
        email: data.email,
        serviceName: data.serviceName,
        callbackUrl: data.callbackUrl,
        status: "pending",
        createdAt: now,
        expiresAt,
      })
      .returning();

    const created = result[0];

    console.log(
      `[REGISTRATION_TOKEN] Created token ${token} for ${data.email} (expires in 24h)`
    );

    return {
      id: created.id,
      token: created.token,
      userId: created.userId,
      email: created.email,
      serviceName: created.serviceName,
      callbackUrl: created.callbackUrl || undefined,
      status: created.status as "pending" | "completed" | "rejected" | "expired",
      createdAt: created.createdAt,
      expiresAt: created.expiresAt,
      completedAt: created.completedAt || undefined,
      seedId: created.seedId || undefined,
      totpSeed: created.totpSeed || undefined,
    };
  } catch (error) {
    console.error("[REGISTRATION_TOKEN] Error creating token:", error);
    throw error;
  }
}

/**
 * Get a registration token from the database
 */
export async function getRegistrationToken(
  token: string
): Promise<RegistrationTokenData | null> {
  try {
    const db = getDb();
    const result = await db
      .select()
      .from(registrationToken)
      .where(eq(registrationToken.token, token))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const row = result[0];

    return {
      id: row.id,
      token: row.token,
      userId: row.userId,
      email: row.email,
      serviceName: row.serviceName,
      callbackUrl: row.callbackUrl || undefined,
      status: row.status as "pending" | "completed" | "rejected" | "expired",
      createdAt: row.createdAt,
      expiresAt: row.expiresAt,
      completedAt: row.completedAt || undefined,
      seedId: row.seedId || undefined,
      totpSeed: row.totpSeed || undefined,
    };
  } catch (error) {
    console.error("[REGISTRATION_TOKEN] Error fetching token:", error);
    return null;
  }
}

/**
 * Update registration token status in the database
 */
export async function updateRegistrationToken(
  token: string,
  updates: Partial<{
    status: "completed" | "rejected" | "expired";
    seedId?: string;
    totpSeed?: string;
    completedAt?: Date;
  }>
): Promise<RegistrationTokenData | null> {
  try {
    const db = getDb();
    
    const updateData: any = {
      ...updates,
      status: updates.status,
    };

    const result = await db
      .update(registrationToken)
      .set(updateData)
      .where(eq(registrationToken.token, token))
      .returning();

    if (result.length === 0) {
      return null;
    }

    const updated = result[0];

    console.log(
      `[REGISTRATION_TOKEN] Updated token ${token} status to ${updated.status}`
    );

    return {
      id: updated.id,
      token: updated.token,
      userId: updated.userId,
      email: updated.email,
      serviceName: updated.serviceName,
      callbackUrl: updated.callbackUrl || undefined,
      status: updated.status as "pending" | "completed" | "rejected" | "expired",
      createdAt: updated.createdAt,
      expiresAt: updated.expiresAt,
      completedAt: updated.completedAt || undefined,
      seedId: updated.seedId || undefined,
      totpSeed: updated.totpSeed || undefined,
    };
  } catch (error) {
    console.error("[REGISTRATION_TOKEN] Error updating token:", error);
    return null;
  }
}

/**
 * Validate registration token
 * Checks if token exists, is not expired, and is in pending status
 */
export async function validateRegistrationToken(
  token: string
): Promise<{
  valid: boolean;
  data?: RegistrationTokenData;
  error?: string;
}> {
  const tokenData = await getRegistrationToken(token);

  if (!tokenData) {
    return {
      valid: false,
      error: "Registration token not found or invalid",
    };
  }

  if (tokenData.status !== "pending") {
    return {
      valid: false,
      error: `Registration token already ${tokenData.status}`,
    };
  }

  if (new Date() > tokenData.expiresAt) {
    await updateRegistrationToken(token, { status: "expired" });
    return {
      valid: false,
      error: "Registration token has expired",
    };
  }

  return {
    valid: true,
    data: tokenData,
  };
}

/**
 * Build callback URL with parameters
 */
export function buildCallbackUrl(
  baseUrl: string,
  token: string,
  seedId: string,
  seed: string,
  code: string
): string {
  const params = new URLSearchParams({
    success: "true",
    regToken: token,
    seedId,
    seed,
    code,
    timestamp: Date.now().toString(),
  });

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Parse callback parameters from URL
 */
export function parseCallbackParams(searchParams: URLSearchParams): {
  success: boolean;
  regToken?: string;
  seedId?: string;
  seed?: string;
  code?: string;
  timestamp?: string;
  error?: string;
} {
  return {
    success: searchParams.get("success") === "true",
    regToken: searchParams.get("regToken") || undefined,
    seedId: searchParams.get("seedId") || undefined,
    seed: searchParams.get("seed") || undefined,
    code: searchParams.get("code") || undefined,
    timestamp: searchParams.get("timestamp") || undefined,
    error: searchParams.get("error") || undefined,
  };
}
