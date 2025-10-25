# Rate Limiting & Error Handling Implementation

## Overview
Enhanced the authentication system with comprehensive rate limiting and improved error handling across all auth flows (login, registration, 2FA setup).

## Changes Made

### 1. Enhanced `app/(auth)/actions.ts`

#### Added Rate Limiting Imports
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
```

#### Initialized Ratelimit Instance
```typescript
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "15 m"),
});
```

#### Updated `LoginActionState` Interface
- Added `error?: string` field to pass specific error messages to UI
- Now returns: `{ status, error? }`

#### Updated `RegisterActionState` Interface
- Added `error?: string` field for error messages
- Added `data?: { email: string }` to pass email to UI for 2FA modal setup

#### Rate Limiting in `login()` Action
- **Rate Limit**: 10 attempts per 15 minutes per email
- **Key Format**: `login:{email}`
- **Response on Limit Exceeded**:
  ```typescript
  {
    status: "failed",
    error: "Too many login attempts. Please try again in 15 minutes."
  }
  ```

#### Rate Limiting in `register()` Action
- **Rate Limit**: 10 attempts per 15 minutes per email
- **Key Format**: `register:{email}`
- **Response on Limit Exceeded**:
  ```typescript
  {
    status: "failed",
    error: "Too many registration attempts. Please try again in 15 minutes."
  }
  ```

#### Enhanced Error Responses
- Success returns email: `{ status: "success", data: { email } }`
- Errors include specific messages for user feedback

### 2. Updated `app/(auth)/login/page.tsx`

#### Improved Error Display in useEffect
```typescript
if (state.status === "failed") {
  toast.error(state.error || "Invalid credentials!");
}
```

- Now displays specific error messages from server actions
- Falls back to generic message if no error provided
- Handles rate limiting feedback: "Too many login attempts..."

### 3. Updated `app/(auth)/register/page.tsx`

#### Enhanced State Updates
```typescript
useEffect(() => {
  if (state.status === "failed") {
    toast.error(state.error || "Failed to create account");
  } else if (state.status === "success") {
    setEmail(state.data?.email || email);
    setHasPendingRegistration(true);
    setShow2FASetup(true);
  }
}, [state, router]);
```

- Displays rate limiting errors to user
- Uses email from server response for 2FA setup
- Maintains email state even if form clears

### 4. Enhanced `components/custom/two-fa-setup-modal.tsx`

#### Improved HTTP Status Handling
```typescript
const handleSetup2FA = async () => {
  const response = await fetch("/api/auth/setup-2fa", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: userEmail, token: userEmail }),
  });

  const data = await response.json();

  if (response.status === 429) {
    toast.error("Too many 2FA setup attempts. Please try again later.");
  } else if (response.status === 401) {
    toast.error("Authentication failed. Please try logging in again.");
  } else if (data.deepLink) {
    toast.success("Redirecting to 2FA setup...");
    window.open(data.deepLink, "_blank");
  }
};
```

- Handles 429 (rate limited) responses
- Handles 401 (unauthorized) responses  
- Specific, actionable error messages for users

## Rate Limiting Configuration

### Authentication Actions
- **Limit**: 10 attempts per 15 minutes
- **Applies To**: Login & Registration forms
- **Key Format**: `{action}:{email}`
- **Purpose**: Prevent brute force attacks on credentials

### 2FA Verification Endpoints
- **Limit**: 5 attempts per 15 minutes per email (existing)
- **Applies To**: TOTP code verification
- **Purpose**: Prevent TOTP code brute force attacks

## Error Message Flow

### Login Flow
```
User enters credentials → Rate limit check
├─ Limit exceeded → { status: "failed", error: "Too many login attempts..." }
└─ Passed → Validate credentials
   ├─ Invalid → { status: "failed", error: "Invalid credentials!" }
   └─ Valid → Check 2FA
      ├─ Not enabled → Create session
      └─ Enabled → { status: "2fa_required" }
```

### Registration Flow
```
User submits form → Rate limit check
├─ Limit exceeded → { status: "failed", error: "Too many registration attempts..." }
└─ Passed → Validate form data
   ├─ Invalid → { status: "invalid_data" }
   └─ Valid → Check if user exists
      ├─ Exists → { status: "user_exists" }
      └─ New → Create user → { status: "success", data: { email } }
```

### 2FA Setup Flow
```
User clicks "Enable 2FA" → POST /api/auth/setup-2fa
├─ 429 (Too many attempts) → "Too many 2FA setup attempts..."
├─ 401 (Unauthorized) → "Authentication failed..."
└─ 200 (Success) → Open Legitate deep link
```

## UI/UX Improvements

### Toast Notifications
- Rate limiting: "Too many [action] attempts. Please try again in 15 minutes."
- 2FA setup rate limit: "Too many 2FA setup attempts. Please try again later."
- Authentication errors: Specific, actionable messages
- Success: "Account created successfully!"

### User Guidance
- Clear error messages help users understand what went wrong
- Time-based feedback ("in 15 minutes") is more helpful than generic "try again"
- Distinct messages for different failure modes (rate limit vs. invalid credentials)

## Security Benefits

1. **Brute Force Protection**: Rate limiting prevents rapid credential guessing
2. **Account Enumeration Resistance**: Same error message for non-existent vs. wrong password
3. **Resource Protection**: Limits server load from attack attempts
4. **Distributed Attack Mitigation**: Per-email rate limiting via Redis
5. **Compliance**: Aligns with OWASP authentication best practices

## Configuration

### Redis/Upstash Setup (Required)
Ensure environment variables are configured:
```
UPSTASH_REDIS_REST_URL=<your-url>
UPSTASH_REDIS_REST_TOKEN=<your-token>
```

### Rate Limit Tuning
To adjust limits, modify in `app/(auth)/actions.ts`:
```typescript
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "15 m"), // 10 attempts per 15 minutes
});
```

## Testing Checklist

- [ ] Register account → See 2FA setup modal → Enable 2FA works
- [ ] Login with valid 2FA → Session created
- [ ] Attempt login 11 times in 15 min → See rate limit error
- [ ] Attempt registration 11 times in 15 min → See rate limit error
- [ ] Invalid credentials → See "Invalid credentials!" message
- [ ] Non-existent account register → Works
- [ ] Existing account register → See "Account already exists"
- [ ] 2FA setup rate limiting → After 5 failed TOTP attempts in 15 min

## Implementation Notes

1. **Email-based Identification**: Registration flow uses email as token for 2FA setup (can be enhanced to JWT in production)
2. **Dual-path Rate Limiting**: Protects both page forms and API endpoints
3. **Error Message Security**: Specific enough for users, generic enough to prevent enumeration
4. **Fallback Handling**: All error states include fallback messages if server doesn't provide specific text

## Future Enhancements

- [ ] Account lockout after N failed attempts (currently just rate limited)
- [ ] Recovery codes for 2FA backup
- [ ] Email notification on suspicious login attempts
- [ ] Geographic-based anomaly detection
- [ ] Device fingerprinting for session validation
- [ ] Webhook notifications for security events
