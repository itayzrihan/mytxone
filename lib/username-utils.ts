/**
 * Username to Email Conversion Utility
 * 
 * Handles conversion between usernames and @mytx.one emails
 * Supports both formats:
 * - "username" -> "username@mytx.one"
 * - "username@mytx.one" -> "username@mytx.one"
 */

export const MYTX_DOMAIN = "mytx.one";
export const MYTX_EMAIL_DOMAIN = `@${MYTX_DOMAIN}`;

/**
 * Convert username to full email address
 * Supports both formats:
 * - "john" -> "john@mytx.one"
 * - "john@mytx.one" -> "john@mytx.one"
 */
export function usernameToEmail(input: string): string {
  if (!input) return "";
  
  const trimmed = input.trim().toLowerCase();
  
  // If already has @mytx.one, return as-is
  if (trimmed.endsWith(MYTX_EMAIL_DOMAIN)) {
    return trimmed;
  }
  
  // If has @ but different domain, reject (could be extended later)
  if (trimmed.includes("@")) {
    return trimmed; // Keep as-is, let backend validate
  }
  
  // Just username, append @mytx.one
  return `${trimmed}${MYTX_EMAIL_DOMAIN}`;
}

/**
 * Extract username from email
 * "john@mytx.one" -> "john"
 */
export function emailToUsername(email: string): string {
  if (!email) return "";
  
  const trimmed = email.trim().toLowerCase();
  
  if (trimmed.endsWith(MYTX_EMAIL_DOMAIN)) {
    return trimmed.substring(0, trimmed.length - MYTX_EMAIL_DOMAIN.length);
  }
  
  return trimmed;
}

/**
 * Validate username format
 * - 3-32 characters
 * - Only alphanumeric, dots, hyphens, underscores
 * - Cannot start/end with dot or hyphen
 */
export function isValidUsername(username: string): boolean {
  if (!username) return false;
  
  const trimmed = username.trim();
  
  // Length check
  if (trimmed.length < 3 || trimmed.length > 32) {
    return false;
  }
  
  // Pattern: alphanumeric, dots, hyphens, underscores
  // Cannot start/end with dot or hyphen
  const pattern = /^[a-z0-9]([a-z0-9._-]*[a-z0-9])?$/i;
  
  return pattern.test(trimmed);
}

/**
 * Validate username with error message
 */
export function validateUsernameWithMessage(username: string): {
  valid: boolean;
  error?: string;
} {
  const trimmed = username.trim();
  
  if (!trimmed) {
    return { valid: false, error: "Username is required" };
  }
  
  if (trimmed.length < 3) {
    return { valid: false, error: "Username must be at least 3 characters" };
  }
  
  if (trimmed.length > 32) {
    return { valid: false, error: "Username must not exceed 32 characters" };
  }
  
  if (!/^[a-z0-9]([a-z0-9._-]*[a-z0-9])?$/i.test(trimmed)) {
    return {
      valid: false,
      error: "Username can only contain letters, numbers, dots, hyphens, and underscores",
    };
  }
  
  if (trimmed.includes("..") || trimmed.includes("--")) {
    return { valid: false, error: "Username cannot contain consecutive dots or hyphens" };
  }
  
  return { valid: true };
}

/**
 * Parse user input (username or email)
 * Returns the full email address
 */
export function parseUserInput(input: string): {
  username: string;
  email: string;
} {
  const email = usernameToEmail(input);
  const username = emailToUsername(email);
  
  return { username, email };
}
