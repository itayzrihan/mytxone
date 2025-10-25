/**
 * Utility functions for URL handling
 */

/**
 * Get the base URL from request headers or environment
 * Dynamically detects the correct protocol and host
 * 
 * @param request - The incoming request object
 * @returns The base URL (e.g., "http://localhost:3001" or "https://example.com")
 */
export function getBaseUrlFromRequest(request: Request): string {
  // Try to get from request headers (most reliable for dynamic ports)
  const headerHost = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (headerHost) {
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    return `${protocol}://${headerHost}`;
  }

  // Fall back to environment variable
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }

  // Final fallback
  return "http://localhost:3000";
}

/**
 * Get the base URL without needing request context
 * Useful in server components or utilities
 * 
 * @returns The base URL from environment or default
 */
export function getBaseUrl(): string {
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  return "http://localhost:3000";
}
