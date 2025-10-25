# Redis Configuration - Upstash REST API Setup (FINAL)

## Solution Summary

The correct approach for `@upstash/ratelimit` is to use the **Upstash REST API credentials**, not a direct Redis connection string.

### The Key Insight

- **`KV_URL`** = Direct Redis connection (for native Redis clients like `ioredis`)
- **`UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`** = Upstash REST API (for `@upstash/ratelimit`)

The `@upstash/ratelimit` library is designed to work with Upstash's REST API, NOT direct Redis connections.

## Correct Environment Configuration

### `.env.local`

```bash
# Upstash REST API - Required for @upstash/ratelimit
UPSTASH_REDIS_REST_URL=https://united-seasnail-24995.upstash.io
UPSTASH_REDIS_REST_TOKEN=AWGjAAIjcDEwMjdmYzc3ZmMxY2E0M2IzOWJhZWQ4ZDg5MDdhZGI2MXAxMA

# Direct Redis connection (for other Redis clients, optional)
# KV_URL=rediss://default:54151dgfFGHSgj5151fghSFJGSjg545152@localhost:6189
```

## Code Pattern (All Files)

All four files now use this standardized pattern:

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

let ratelimit: Ratelimit | null = null;

if (upstashUrl && upstashToken) {
  try {
    ratelimit = new Ratelimit({
      redis: new Redis({
        url: upstashUrl,
        token: upstashToken,
      }),
      limiter: Ratelimit.slidingWindow(10, "15 m"),
    });
    console.log("[RATELIMIT] Initialized with Upstash REST API");
  } catch (error) {
    console.error("[RATELIMIT] Failed to initialize:", error);
  }
}

// Usage with null check
if (ratelimit) {
  const { success } = await ratelimit.limit(`key:${identifier}`);
  if (!success) {
    return { status: "failed", error: "Rate limited" };
  }
}
```

## Files Updated

1. **`app/(auth)/actions.ts`** ✅
   - Uses `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
   - Rate limiting: 10 attempts per 15 minutes for login/register

2. **`app/aichat/api/chat/route.ts`** ✅
   - Uses `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
   - Rate limiting: 200 requests per day

3. **`app/api/external/v1/route.ts`** ✅
   - Uses `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
   - Rate limiting: 200 requests per day

4. **`app/api/chat/route.ts`** ✅
   - Uses `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
   - Rate limiting: 200 requests per day

5. **`.env.local`** ✅
   - Updated with correct Upstash REST API credentials
   - Commented out `KV_URL` (not needed for rate limiting)

## Why This Works

1. **REST API vs Direct Connection**
   - Upstash provides both REST API and direct Redis connection
   - `@upstash/ratelimit` library is designed for the REST API
   - REST API works reliably across different environments (local, production, etc.)
   - Direct connections may have network/firewall restrictions

2. **Credentials Required**
   - `UPSTASH_REDIS_REST_URL`: The Upstash API endpoint (e.g., `https://united-seasnail-24995.upstash.io`)
   - `UPSTASH_REDIS_REST_TOKEN`: The authentication token for the REST API

3. **Graceful Fallback**
   - If either variable is missing, rate limiting is disabled
   - App continues to work without rate limiting
   - Console logs indicate the issue

## Testing the Configuration

### 1. Verify Environment Variables
```bash
# PowerShell
echo $env:UPSTASH_REDIS_REST_URL
echo $env:UPSTASH_REDIS_REST_TOKEN

# Bash
echo $UPSTASH_REDIS_REST_URL
echo $UPSTASH_REDIS_REST_TOKEN
```

### 2. Test Registration
```
1. Go to http://localhost:3001/register
2. Enter email and password
3. Click "Sign Up"
4. Should see: "[RATELIMIT] Initialized with Upstash REST API" in console
5. Account should be created without Redis errors
```

### 3. Test Rate Limiting
```
1. Make 11 registration attempts with same email in quick succession
2. 11th attempt should show: "Too many registration attempts. Please try again in 15 minutes."
3. Try again after 15 minutes - should succeed
```

### 4. Check Server Logs
Expected log output:
```
[RATELIMIT] Initialized with Upstash REST API
[Chat API] Redis rate limiting initialized
[External API] Redis rate limiting initialized
```

## Upstash Dashboard

To get your Upstash credentials:

1. Go to https://console.upstash.com/
2. Select your Redis database
3. Copy the REST API credentials:
   - **REST URL** → `UPSTASH_REDIS_REST_URL`
   - **REST Token** → `UPSTASH_REDIS_REST_TOKEN`

## Common Errors and Fixes

### Error: "The 'token' property is missing or undefined"
**Cause**: `UPSTASH_REDIS_REST_TOKEN` not set  
**Fix**: Add `UPSTASH_REDIS_REST_TOKEN` to `.env.local`

### Error: "Failed to parse URL from /pipeline"
**Cause**: Invalid Redis configuration (likely mixing REST and direct connection)  
**Fix**: Use `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (not `KV_URL`)

### Rate limiting not working
**Cause**: Missing environment variables  
**Fix**: Ensure both `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set

### "Redis credentials not found"
**Cause**: One or both environment variables are missing  
**Fix**: Check `.env.local` and ensure variables are correctly named and valued

## Rate Limiting Limits

| Component | Limit | Window |
|-----------|-------|--------|
| Login | 10 attempts | 15 minutes |
| Register | 10 attempts | 15 minutes |
| Chat API | 200 requests | 1 day |
| External API | 200 requests | 1 day |
| AI Chat API | 200 requests | 1 day |

## Summary

✅ **Uses Upstash REST API** (correct for `@upstash/ratelimit`)  
✅ **All four components configured consistently**  
✅ **Graceful fallback when Redis unavailable**  
✅ **Clear logging for debugging**  
✅ **No compilation errors**  
✅ **Ready for testing and production**

The application is now properly configured for rate limiting with Upstash!
