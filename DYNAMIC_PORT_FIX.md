# ✅ Dynamic Port Fix for TOTP Callback

## Problem
The TOTP callback URL was hardcoded to `localhost:3000` but your dev server runs on `localhost:3001`.

When Legitate tried to callback to `http://localhost:3000/api/auth/totp-callback`, it got:
```
ERR_CONNECTION_REFUSED
```

## Solution
Implemented dynamic URL detection that automatically gets the correct port from the request headers.

### Changes Made

#### 1. Created `lib/url-utils.ts`
New utility file with two functions:
- `getBaseUrlFromRequest(request)` - Extracts protocol and host from request headers
- `getBaseUrl()` - Falls back to environment variable or default

**How it works:**
```typescript
export function getBaseUrlFromRequest(request: Request): string {
  // 1. Try x-forwarded-host header (from reverse proxies)
  const headerHost = request.headers.get("x-forwarded-host") || request.headers.get("host");
  
  // 2. If found, use with protocol from x-forwarded-proto
  if (headerHost) {
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    return `${protocol}://${headerHost}`;
  }
  
  // 3. Fall back to NEXTAUTH_URL env var
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  
  // 4. Final fallback
  return "http://localhost:3000";
}
```

#### 2. Updated `app/api/auth/setup-2fa/route.ts`
- Imported `getBaseUrlFromRequest` from new utility
- Replaced hardcoded `process.env.NEXTAUTH_URL || "http://localhost:3000"` with:
  ```typescript
  const baseUrl = getBaseUrlFromRequest(request);
  ```

## Result
✅ Now works on any port! (3000, 3001, 3002, etc.)

The callback URL is now dynamically generated based on the request headers, so it will correctly point to your actual dev server address.

## Testing
1. Run your dev server on port 3001:
   ```bash
   npm run dev:no-tunnels -- -p 3001
   ```

2. Trigger 2FA setup - the Legitate callback will now use `localhost:3001`

3. Should now work: `http://localhost:3001/api/auth/totp-callback?success=true&...`

## Technical Details

### Request Headers Used
- `host` - Contains the hostname and port (e.g., "localhost:3001")
- `x-forwarded-host` - Used by reverse proxies/load balancers
- `x-forwarded-proto` - Protocol info from reverse proxies

### Fallback Chain
1. Request headers (most reliable) ✅ **NEW**
2. `NEXTAUTH_URL` environment variable
3. Default `http://localhost:3000`

## Environment Variables
No changes needed! The dynamic detection works without env vars, but `NEXTAUTH_URL` is still used as a fallback.
