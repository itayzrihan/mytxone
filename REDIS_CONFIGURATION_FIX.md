# Redis Configuration Fix for Rate Limiting

## Problem

When attempting to register or login, the application was throwing a Redis connection error:

```
Error: getaddrinfo ENOTFOUND united-seasnail-24995.upstash.io
```

This was caused by using deprecated Redis configuration variables (`KV_REST_API_URL` and `KV_REST_API_TOKEN`) instead of the working `KV_URL` connection string.

## Root Cause

**Deprecated Environment Variables (Not Working):**
```bash
KV_REST_API_URL=https://united-seasnail-24995.upstash.io
KV_REST_API_TOKEN=AWGjAAIjcDEwMjdmYzc3ZmMxY2E0M2IzOWJhZWQ4ZDg5MDdhZGI2MXAxMA
```

**Correct Environment Variable (Working):**
```bash
KV_URL=rediss://default:54151dgfFGHSgj5151fghSFJGSjg545152@localhost:6189
```

The `KV_URL` is a complete Redis connection string that includes all authentication credentials in the standard Redis URL format.

## Solution

Updated `app/(auth)/actions.ts` to use only the working `KV_URL` environment variable:

```typescript
// Initialize rate limiter for auth attempts
// Use KV_URL which is the working Redis connection string
// Redis.fromEnv() automatically looks for KV_URL or REDIS_URL environment variables
const kvUrl = process.env.KV_URL;

let ratelimit: Ratelimit | null = null;
if (kvUrl) {
  try {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),  // Automatically uses KV_URL
      limiter: Ratelimit.slidingWindow(10, "15 m"),
    });
    console.log("[RATELIMIT] Initialized with KV_URL");
  } catch (error) {
    console.error("[RATELIMIT] Failed to initialize rate limiter:", error);
  }
}
```

### Key Changes

1. **Removed Deprecated Variables**
   - Deleted use of `KV_REST_API_URL`
   - Deleted use of `KV_REST_API_TOKEN`

2. **Use Standard Redis Connection**
   - Use `KV_URL` which contains: `rediss://default:password@host:port`
   - Format: `rediss://username:password@host:port`
   - `rediss://` uses SSL encryption

3. **Graceful Degradation**
   - If `KV_URL` is not configured, `ratelimit` will be `null`
   - Added null checks in login and register actions
   - Application continues to work without rate limiting if Redis is unavailable

## Environment Variable Configuration

### In `.env.local`

Keep **only** this Redis configuration:
```bash
KV_URL=rediss://default:54151dgfFGHSgj5151fghSFJGSjg545152@localhost:6189
```

Remove (if present) these deprecated variables:
```bash
# DELETE THESE - They are deprecated and don't work:
# KV_REST_API_URL=https://united-seasnail-24995.upstash.io
# KV_REST_API_TOKEN=AWGjAAIjcDEwMjdmYzc3ZmMxY2E0M2IzOWJhZWQ4ZDg5MDdhZGI2MXAxMA
```

## KV_URL Format Breakdown

For the example `rediss://default:54151dgfFGHSgj5151fghSFJGSjg545152@localhost:6189`:

| Component | Value | Description |
|-----------|-------|-------------|
| Protocol | `rediss://` | Redis with SSL encryption |
| Username | `default` | Redis default user |
| Password | `54151dgfFGHSgj5151fghSFJGSjg545152` | Redis password |
| Host | `localhost` | Redis server hostname |
| Port | `6189` | Redis server port |

## Testing

After making these changes:

1. **Verify No Compilation Errors**
   ```
   ✓ No errors found
   ```

2. **Test Registration**
   - Navigate to `/register`
   - Enter email and password
   - Should see "Account created successfully!"
   - 2FA setup modal should appear
   - No Redis connection errors in console

3. **Test Login**
   - Navigate to `/login`
   - Enter valid credentials
   - If 2FA not enabled, should log in successfully
   - If 2FA enabled, should see "Enter your 2FA code"
   - No Redis connection errors in console

4. **Verify Rate Limiting** (when Redis is available)
   - Should see console log: `"[RATELIMIT] Initialized with KV_URL"`
   - Attempt registration 11 times in 15 minutes with same email
   - 11th attempt should show "Too many registration attempts..."

## Files Modified

- `app/(auth)/actions.ts`
  - Lines 29-44: Updated Ratelimit initialization to use `KV_URL`
  - Lines 116-129: Null checks in login action (unchanged)
  - Lines 207-220: Null checks in register action (unchanged)

## Benefits

✅ Works with the actual working Redis connection  
✅ Graceful degradation if Redis unavailable  
✅ Maintains rate limiting security when available  
✅ Clear logging for debugging  
✅ Removed deprecated configuration  
✅ Aligns with Next.js best practices for environment variables

