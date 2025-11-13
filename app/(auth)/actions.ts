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
import { rateLimit } from "@/lib/redis-ratelimit";
import { usernameToEmail, validateUsernameWithMessage } from "@/lib/username-utils";

import { auth, signIn, signOut } from "./auth";

// Login schema: accepts username or email
const loginFormSchema = z.object({
  username: z.string().min(1, "Username or email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Registration schema: username only
const registrationFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(32, "Username must not exceed 32 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  notMytxEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  phoneNumber: z.string().min(5, "Phone number must be valid").optional().or(z.literal("")),
  profileImageData: z.string().optional(),
});

// Rate limiting constants (10 attempts per 15 minutes)
const RATE_LIMIT_ATTEMPTS = 10;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export interface LoginActionState {
  status: "idle" | "in_progress" | "success" | "failed" | "invalid_data" | "2fa_required" | "2fa_verified" | "2fa_setup_required";
  userEmail?: string;
  totpSeedId?: string | null;
  error?: string;
}

/**
 * Verify TOTP code and complete login
 * This action is called after user enters 2FA code during login
 */
export const verifyTOTPAndLogin = async (
  formData: FormData,
): Promise<LoginActionState> => {
  try {
    console.log("[VERIFY_TOTP] Starting TOTP verification for login");
    
    const email = formData.get("email") as string;
    const totpCode = formData.get("totpCode") as string;
    const password = formData.get("password") as string;

    if (!email || !totpCode || !password) {
      console.log("[VERIFY_TOTP] Missing required fields");
      return { status: "invalid_data" };
    }

    // Verify TOTP code first
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    if (!baseUrl) {
      console.error("[VERIFY_TOTP] NEXTAUTH_URL not configured");
      return { status: "failed", error: "Server configuration error" };
    }
    
    const totpResponse = await fetch(`${baseUrl}/api/auth/verify-2fa-internal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email,
        totpCode 
      }),
    });

    if (!totpResponse.ok) {
      console.log("[VERIFY_TOTP] TOTP verification failed");
      return { status: "failed" };
    }

    console.log("[VERIFY_TOTP] TOTP verified successfully, now signing in");
    
    // TOTP verified, now sign in with credentials
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    console.log("[VERIFY_TOTP] Sign in successful");
    return { status: "2fa_verified" };
  } catch (error) {
    console.error("[VERIFY_TOTP] Error occurred:", error);
    return { status: "failed" };
  }
};

export const login = async (
  _: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> => {
  try {
    console.log("[LOGIN] Starting login process");
    
    const validatedData = loginFormSchema.parse({
      username: formData.get("username"),
      password: formData.get("password"),
    });
    
    // Convert username to email for internal use
    const email = usernameToEmail(validatedData.username);
    console.log("[LOGIN] Form validated:", { username: validatedData.username, email });

    // Rate limiting: 10 attempts per 15 minutes per email
    const { success, remaining } = await rateLimit(
      `login:${email}`,
      RATE_LIMIT_ATTEMPTS,
      RATE_LIMIT_WINDOW_MS
    );
    
    if (!success) {
      console.warn(`[LOGIN] Rate limit exceeded for ${email}`);
      return { 
        status: "failed",
        error: "Too many login attempts. Please try again in 15 minutes." 
      };
    }

    // Sign in with credentials
    console.log("[LOGIN] Attempting to sign in with credentials");
    const result = await signIn("credentials", {
      email: email,
      password: validatedData.password,
      redirect: false,
    });
    
    console.log("[LOGIN] Sign in result:", result);
    
    if (!result || result.ok === false) {
      console.log("[LOGIN] Sign in failed - invalid credentials");
      return { status: "failed" };
    }

    console.log("[LOGIN] Sign in successful");
    return { status: "success" };
  } catch (error) {
    console.error("[LOGIN] Error occurred:", error);
    
    if (error instanceof z.ZodError) {
      console.error("[LOGIN] Validation error:", error.errors);
      return { status: "invalid_data" };
    }

    console.error("[LOGIN] Unknown error, full details:", {
      message: error instanceof Error ? error.message : String(error),
      error
    });
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
  error?: string;
  data?: { email: string };
}

export const register = async (
  _: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> => {
  try {
    console.log("[REGISTER] Starting registration process");
    console.log("[REGISTER] FormData entries:", Array.from(formData.entries()).map(([k, v]) => [k, typeof v === 'string' ? v.substring(0, 50) : v]));
    
    const rawData = {
      username: formData.get("username"),
      password: formData.get("password"),
      fullName: formData.get("fullName"),
      notMytxEmail: formData.get("notMytxEmail"),
      phoneNumber: formData.get("phoneNumber"),
      profileImageData: formData.get("profileImageData"),
    };
    
    console.log("[REGISTER] Raw form data:", rawData);
    
    const validatedData = registrationFormSchema.parse(rawData);
    
    console.log("[REGISTER] Validated data:", validatedData);
    
    // Convert username to email for internal use
    const email = usernameToEmail(validatedData.username);
    console.log("[REGISTER] Form validated:", { username: validatedData.username, email });

    // Rate limiting: 10 attempts per 15 minutes per email
    const { success } = await rateLimit(
      `register:${email}`,
      RATE_LIMIT_ATTEMPTS,
      RATE_LIMIT_WINDOW_MS
    );
    
    if (!success) {
      console.warn(`[REGISTER] Rate limit exceeded for ${email}`);
      return { 
        status: "failed",
        error: "Too many registration attempts. Please try again in 15 minutes."
      };
    }

    let [user] = await getUser(email);
    console.log("[REGISTER] User lookup result:", { 
      userExists: !!user,
      email: email
    });

    if (user) {
      console.log("[REGISTER] User already exists, returning user_exists");
      return { status: "user_exists" } as RegisterActionState;
    } else {
      console.log("[REGISTER] Creating new user:", { email });
      
      // Prepare profile data - only include non-empty optional fields
      const profileData: Record<string, string> = {
        fullName: validatedData.fullName,
      };
      
      if (validatedData.notMytxEmail && validatedData.notMytxEmail.trim()) {
        profileData.notMytxEmail = validatedData.notMytxEmail;
      }
      
      if (validatedData.phoneNumber && validatedData.phoneNumber.trim()) {
        profileData.phoneNumber = validatedData.phoneNumber;
      }
      
      if (validatedData.profileImageData && validatedData.profileImageData.trim()) {
        profileData.profileImageUrl = validatedData.profileImageData;
      }
      
      await createUser(email, validatedData.password, profileData);
      console.log("[REGISTER] User created successfully");

      // IMPORTANT: Do NOT sign in user yet
      // User MUST complete 2FA setup before they can log in
      // Return success to trigger 2FA setup modal
      console.log("[REGISTER] Returning success status - user must complete 2FA setup");
      return { 
        status: "success",
        data: { email }
      };
    }
  } catch (error) {
    console.error("[REGISTER] Error occurred:", error);
    
    if (error instanceof z.ZodError) {
      console.error("[REGISTER] Validation error:", error.errors);
      return { status: "invalid_data" };
    }

    console.error("[REGISTER] Unknown error, full details:", {
      message: error instanceof Error ? error.message : String(error),
      error
    });
    return { 
      status: "failed",
      error: error instanceof Error ? error.message : "An error occurred during registration"
    };
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
