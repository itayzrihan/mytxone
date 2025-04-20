"use server";

import { randomBytes } from "crypto";

import { hashSync } from "bcrypt-ts"; // Import hashSync from bcrypt-ts
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createApiKeyRecord,
  createUser,
  deleteApiKeyByIdAndUserId,
  findValidApiKey, // Also needed for validation logic if kept here
  getApiKeysByUserId,
  getUser,
  updateApiKeyLastUsed // Also needed for validation logic if kept here
  // Import the new API key query functions
} from "@/db/queries";

import { auth, signIn, signOut } from "./auth";

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export interface LoginActionState {
  status: "idle" | "in_progress" | "success" | "failed" | "invalid_data";
}

export const login = async (
  _: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }

    return { status: "failed" };
  }
};

export interface RegisterActionState {
  status:
    | "idle"
    | "in_progress"
    | "success"
    | "failed"
    | "user_exists"
    | "invalid_data";
}

export const register = async (
  _: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    let [user] = await getUser(validatedData.email);

    if (user) {
      return { status: "user_exists" } as RegisterActionState;
    } else {
      await createUser(validatedData.email, validatedData.password);
      await signIn("credentials", {
        email: validatedData.email,
        password: validatedData.password,
        redirect: false,
      });

      return { status: "success" };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }

    return { status: "failed" };
  }
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
};

// --- API Key Actions (Using Query Functions) ---

// Helper function to generate a secure API key
function generateApiKey(length = 32) {
  return `mytx_${randomBytes(length).toString("hex")}`;
}

export async function getApiKeysForUser(): Promise<{
  // Type remains the same, but implementation changes
  keys: Awaited<ReturnType<typeof getApiKeysByUserId>>;
  error?: string;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { keys: [], error: "User not authenticated" };
  }

  try {
    // Use the query function
    const keys = await getApiKeysByUserId(session.user.id);
    return { keys };
  } catch (error) {
    console.error("Error fetching API keys via query:", error);
    return { keys: [], error: "Failed to fetch API keys." };
  }
}

export async function createApiKey(formData: FormData): Promise<{
  success?: boolean;
  newKey?: string; // Return the raw key only on creation
  name?: string | null;
  error?: string;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "User not authenticated" };
  }

  const name = formData.get("name") as string | null;
  const rawKey = generateApiKey();

  try {
    // Use hashSync from bcrypt-ts. It takes the salt rounds as the second argument.
    const saltRounds = 10;
    const hashedKey = hashSync(rawKey, saltRounds);

    // Use the query function to create the record
    await createApiKeyRecord({
      userId: session.user.id,
      hashedKey: hashedKey, // Pass the correctly hashed key
      name: name || null,
    });

    revalidatePath("/"); // Or a more specific path if applicable
    return { success: true, newKey: rawKey, name: name || null };
  } catch (error) {
    console.error("Error creating API key via query:", error);
    return { error: "Failed to create API key." };
  }
}

export async function deleteApiKey(formData: FormData): Promise<{
  success?: boolean;
  error?: string;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "User not authenticated" };
  }

  const keyId = formData.get("keyId") as string;

  if (!keyId) {
    return { error: "API Key ID is required." };
  }

  try {
    // Use the query function to delete
    const deletedCount = await deleteApiKeyByIdAndUserId(keyId, session.user.id);

    if (deletedCount === 0) {
      return { error: "API Key not found or you do not have permission to delete it." };
    }

    revalidatePath("/"); // Or a more specific path if applicable
    return { success: true };
  } catch (error) {
    console.error("Error deleting API key via query:", error);
    return { error: "Failed to delete API key." };
  }
}

// --- Helper to validate API key (moved logic mostly to queries.ts) ---
// This function now primarily orchestrates the validation and update

export async function validateAndRecordApiKeyUsage(apiKeyHeader: string | null): Promise<{ isValid: boolean; userId?: string }> {
  if (!apiKeyHeader || !apiKeyHeader.startsWith("Bearer ")) {
    return { isValid: false };
  }

  const rawKey = apiKeyHeader.split(" ")[1];
  if (!rawKey) {
    return { isValid: false };
  }

  try {
    // Use the query function to find a valid key
    const validKeyDetails = await findValidApiKey(rawKey);

    if (validKeyDetails) {
      // Key is valid, update lastUsedAt asynchronously (fire and forget)
      // Use the dedicated query function for updating
      updateApiKeyLastUsed(validKeyDetails.id).catch((err) =>
        console.error("Failed to update lastUsedAt via query:", err)
      );

      return { isValid: true, userId: validKeyDetails.userId };
    }

    // No matching key found
    return { isValid: false };
  } catch (error) {
    // Errors during validation are treated as invalid keys
    console.error("Error during API key validation process:", error);
    return { isValid: false };
  }
}
