# 🔐 Complete TOTP 2FA Implementation Guide - Step by Step

## Current Status ✅

All infrastructure files are already in place:
- ✅ `lib/totp.ts` - TOTP library with encryption
- ✅ `app/api/auth/setup-2fa/route.ts` - Setup endpoint
- ✅ `app/api/auth/totp-callback/route.ts` - Legitate callback
- ✅ `app/api/auth/verify-2fa/route.ts` - Verification endpoint
- ✅ `components/custom/two-fa-setup-modal.tsx` - Setup UI
- ✅ `components/custom/two-fa-verification-form.tsx` - Verification UI
- ✅ `db/schema.ts` - Database schema with TOTP fields

**What's left**: Wire everything together in your auth flow!

---

## Step-by-Step Implementation

### STEP 1: Generate Encryption Key (5 minutes)

First, generate a 32-byte hex encryption key for AES-256-GCM:

**Option A: Using PowerShell (Windows)**
```powershell
$key = [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes(32)
$hex = [BitConverter]::ToString($key) -replace '-'
Write-Host $hex
```

**Option B: Using Node.js (Cross-platform)**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Result**: You'll get a 64-character hex string (example):
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

---

### STEP 2: Configure Environment Variables (5 minutes)

Add to your `.env.local`:

```bash
# TOTP Encryption Key (from Step 1)
TOTP_ENCRYPTION_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2

# Redis (for rate limiting - should already exist)
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here

# NextAuth (should already exist)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here
```

**Verify**: Test the env variables are loaded:
```bash
node -e "console.log('TOTP_ENCRYPTION_KEY:', process.env.TOTP_ENCRYPTION_KEY?.substring(0, 8) + '...')"
```

---

### STEP 3: Run Database Migration (10 minutes)

The schema already has TOTP fields. Apply to your database:

```bash
npm run build
```

This will:
1. Run `tsx db/safe-migrate` - applies schema changes
2. Build Next.js
3. Run manifest fixes

**Output**: Should see "✅ Migration completed successfully" or similar

**If error**: Check that your database is accessible and credentials are correct

---

### STEP 4: Wire 2FA into Login Flow (15 minutes)

Update `app/(auth)/actions.ts` to check for 2FA after password validation:

**Current Code:**
```typescript
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
    // ... error handling
  }
};
```

**Update to:**
```typescript
export interface LoginActionState {
  status: "idle" | "in_progress" | "success" | "failed" | "invalid_data" | "2fa_required";
  totpRequired?: boolean;
  userEmail?: string;
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

    // Check if user has 2FA enabled
    const [user] = await getUser(validatedData.email);
    
    if (user && user.totpEnabled) {
      // User has 2FA - they'll need to verify code
      // Store email temporarily for verification step
      return { 
        status: "2fa_required",
        totpRequired: true,
        userEmail: validatedData.email
      };
    }

    // No 2FA - proceed with normal login
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
```

---

### STEP 5: Add TOTP Verification Step in Login Page (15 minutes)

Update `app/(auth)/login/page.tsx` to show 2FA form when needed:

**Add to imports:**
```typescript
import { TwoFAVerificationForm } from "@/components/custom/two-fa-verification-form";
```

**Add state for 2FA:**
```typescript
const [show2FA, setShow2FA] = useState(false);
const [userEmail, setUserEmail] = useState("");
```

**Update useEffect to handle 2fa_required:**
```typescript
useEffect(() => {
  if (state.status === "failed") {
    toast.error("Invalid credentials!");
  } else if (state.status === "invalid_data") {
    toast.error("Failed validating your submission!");
  } else if (state.status === "2fa_required") {
    // Show 2FA verification form
    setUserEmail(state.userEmail || email);
    setShow2FA(true);
  } else if (state.status === "success") {
    router.refresh();
  }
}, [state.status, router, email]);
```

**Update render to show 2FA form:**
```typescript
return (
  <div className="flex h-screen w-screen items-center justify-center bg-background">
    <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
      {show2FA ? (
        <>
          <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
            <h3 className="text-xl font-semibold dark:text-zinc-50">Verify 2FA Code</h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Enter the 8-digit code from your authenticator
            </p>
          </div>
          <TwoFAVerificationForm 
            userEmail={userEmail}
            onSuccess={() => router.refresh()}
          />
        </>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
            <h3 className="text-xl font-semibold dark:text-zinc-50">Sign In</h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Use your email and password to sign in
            </p>
          </div>
          <AuthForm action={handleSubmit} defaultEmail={email}>
            <SubmitButton>Sign in</SubmitButton>
            <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
              {"Don't have an account? "}
              <Link
                href="/register"
                className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
              >
                Sign up
              </Link>
              {" for free."}
            </p>
          </AuthForm>
        </>
      )}
    </div>
  </div>
);
```

---

### STEP 6: Add 2FA Setup Modal to Registration (10 minutes)

Update `app/(auth)/register/page.tsx`:

**Add to imports:**
```typescript
import { TwoFASetupModal } from "@/components/custom/two-fa-setup-modal";
```

**Add state:**
```typescript
const [show2FASetup, setShow2FASetup] = useState(false);
```

**Update useEffect:**
```typescript
useEffect(() => {
  if (state.status === "failed") {
    toast.error("Registration failed!");
  } else if (state.status === "invalid_data") {
    toast.error("Invalid email or password!");
  } else if (state.status === "user_exists") {
    toast.error("User already exists!");
  } else if (state.status === "success") {
    // Show 2FA setup modal (optional)
    setShow2FASetup(true);
    // Or redirect immediately
    // router.refresh();
  }
}, [state.status, router]);
```

**Add to render:**
```typescript
{show2FASetup ? (
  <TwoFASetupModal 
    onClose={() => {
      setShow2FASetup(false);
      router.refresh();
    }}
  />
) : (
  // ... existing register form
)}
```

---

### STEP 7: Test the Complete Flow (20 minutes)

#### Test 2FA Setup

1. **Register new account**
   ```bash
   npm run dev
   ```
   - Go to http://localhost:3000/register
   - Create account with test@example.com / password123

2. **Set up 2FA**
   - Click "Enable 2FA"
   - Scan QR code with Google Authenticator / Authy
   - Enter 8-digit code
   - Should see success message

3. **Verify in database**
   ```sql
   SELECT email, totp_enabled, totp_setup_completed FROM "User" 
   WHERE email = 'test@example.com';
   ```
   - Should show: `totp_enabled = true`, `totp_setup_completed = timestamp`

#### Test 2FA Login

1. **Log out and log back in**
   - Go to /login
   - Enter email and password
   - Should now show "Verify 2FA Code" form
   - Enter code from authenticator
   - Should log in successfully

2. **Test rate limiting**
   - Try entering wrong code 5+ times
   - Should see "Too many attempts" error
   - Wait 15 minutes or edit Redis to reset

3. **Test edge cases**
   - Use expired code (wait 30+ seconds)
   - Use code from wrong account
   - Leave code blank
   - All should show appropriate errors

---

## Architecture Overview

```
Login Request
    ↓
[Email + Password]
    ↓
Credentials valid?
    ├─ NO → Return failed
    └─ YES → Check if 2FA enabled?
        ├─ NO → Return success, log in
        └─ YES → Return "2fa_required"
             ↓
        [Show 2FA Form]
             ↓
        [User enters code from authenticator]
             ↓
        POST /api/auth/verify-2fa
             ↓
        Decrypt stored secret
             ↓
        Generate expected code for current window
             ↓
        Code matches?
             ├─ YES → Log in user, return success
             └─ NO → Increment attempt counter
                 ↓
             5 attempts in 15 min?
                 ├─ NO → Show error, try again
                 └─ YES → Block and show rate limit error
```

---

## Database Schema (Already in Place)

```sql
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS totp_secret text;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS totp_enabled boolean DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS totp_seed_id varchar(255);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS totp_setup_completed timestamp;
```

---

## API Endpoints (Already Created)

### 1. POST `/api/auth/setup-2fa`
- Generates TOTP secret
- Returns deep link to Legitate for QR code
- User scans QR code with authenticator app

### 2. GET `/api/auth/totp-callback`
- Legitate calls this after user generates secret
- Receives encrypted secret
- Stores in database
- Sets `totp_enabled = true`

### 3. POST `/api/auth/verify-2fa`
- Receives 8-digit code from user
- Decrypts stored secret
- Verifies code matches current time window
- Rate-limited (5 attempts per 15 minutes)
- Returns success/failure

---

## Environment Variables Checklist

- [ ] `TOTP_ENCRYPTION_KEY` - 32-byte hex string
- [ ] `UPSTASH_REDIS_REST_URL` - Redis URL
- [ ] `UPSTASH_REDIS_REST_TOKEN` - Redis token
- [ ] `NEXTAUTH_URL` - http://localhost:3000 (dev)
- [ ] `NEXTAUTH_SECRET` - Random secret
- [ ] Database connected and migration run

---

## File Changes Summary

| File | Changes |
|------|---------|
| `app/(auth)/actions.ts` | Add 2FA check after password validation |
| `app/(auth)/login/page.tsx` | Show 2FA form when `status === "2fa_required"` |
| `app/(auth)/register/page.tsx` | Show 2FA setup modal after success |
| `.env.local` | Add `TOTP_ENCRYPTION_KEY` |

---

## Troubleshooting

### Issue: "TOTP_ENCRYPTION_KEY not found"
**Solution**: Check `.env.local` has the key and dev server restarted

### Issue: "Too many attempts" on first try
**Solution**: Redis rate limiter from previous attempts, wait 15 min or clear Redis

### Issue: Code never verifies
**Solution**: 
1. Check authenticator time is in sync
2. Check TOTP_ENCRYPTION_KEY is correct
3. Check database has correct encrypted secret

### Issue: Database migration fails
**Solution**: 
1. Check database credentials
2. Check PostgreSQL is running
3. Check network connection to DB

---

## Testing Checklist

- [ ] Environment variables configured
- [ ] Database migration successful
- [ ] Register new account
- [ ] Enable 2FA during registration
- [ ] Scan QR code with authenticator
- [ ] Verify code on registration completes
- [ ] Log out
- [ ] Log back in with email/password
- [ ] See 2FA verification form
- [ ] Enter code from authenticator
- [ ] Successfully log in
- [ ] Test wrong code (see error)
- [ ] Test rate limiting (5+ wrong attempts)
- [ ] Verify database shows 2FA enabled
- [ ] Test with another account (optional)

---

## Next Steps

1. **Read through the code**:
   - `lib/totp.ts` - Understand the encryption/verification logic
   - `app/api/auth/verify-2fa/route.ts` - See how verification works
   - `components/custom/two-fa-verification-form.tsx` - See UI

2. **Implement Steps 4-6** - Wire it into your auth flow

3. **Test thoroughly** - Follow the testing checklist

4. **Deploy** - Push to production with proper env variables

---

## Support

For questions about specific implementations:
- TOTP logic: See `lib/totp.ts` comments
- API details: See route files in `app/api/auth/`
- UI components: See component files
- Database: See `db/schema.ts`

Good luck! 🚀
