# 🎯 Complete TOTP 2FA Implementation - START HERE

## What You Have

**Complete infrastructure for 2FA with TOTP (8-digit codes)**:
- ✅ Encryption library with AES-256-GCM
- ✅ 3 API endpoints (setup, callback, verify)
- ✅ 2 React UI components
- ✅ Database schema with TOTP fields
- ✅ Rate limiting (5 attempts per 15 min)
- ✅ 8-digit code support

## What You Need To Do

**Wire everything into your auth flow** (3 files to edit, ~60 minutes total)

---

## Quick Start (7 Steps, 60 minutes)

### Step 1: Generate Encryption Key (2 min) ⚡

**PowerShell:**
```powershell
$key = [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes(32)
[BitConverter]::ToString($key) -replace '-'
```

**Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Result**: Copy the 64-character hex string

### Step 2: Configure Environment (2 min) ⚡

Add to `.env.local`:
```bash
TOTP_ENCRYPTION_KEY=<paste_your_key_here>
```

### Step 3: Run Migration (5 min) ⚡

```bash
npm run build
```

Expected: `✅ Migration completed successfully`

### Step 4: Update Login Action (15 min) 🔧

**File**: `app/(auth)/actions.ts`

**Find this code:**
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
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }

    return { status: "failed" };
  }
};
```

**Add this import at top:**
```typescript
import { getUser } from "@/db/queries";
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
      // 2FA is enabled - user needs to verify code
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

### Step 5: Update Login Page UI (10 min) 🔧

**File**: `app/(auth)/login/page.tsx`

**Add import:**
```typescript
import { TwoFAVerificationForm } from "@/components/custom/two-fa-verification-form";
```

**Add state in component:**
```typescript
const [show2FA, setShow2FA] = useState(false);
const [userEmail, setUserEmail] = useState("");
```

**Update useEffect to handle 2FA:**
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

### Step 6: Add 2FA Setup to Registration (10 min) 🔧

**File**: `app/(auth)/register/page.tsx`

**Add import:**
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
  }
}, [state.status, router]);
```

**Update render:**
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

### Step 7: Test Complete Flow (15 min) ✅

```bash
npm run dev
```

**Test Registration:**
1. Go to http://localhost:3000/register
2. Create account: test@example.com / password123
3. See 2FA setup modal (or skip)
4. Click "Enable 2FA" (optional)
5. Scan QR code with authenticator app
6. Enter 8-digit code
7. Should see success

**Test Login:**
1. Log out (go to home and logout)
2. Go to /login
3. Enter email and password
4. Should now see "Enter 2FA Code" form
5. Get code from authenticator
6. Enter code (8 digits)
7. Should log in successfully!

**Test Edge Cases:**
1. Try wrong code → See error
2. Try 5+ wrong codes → See rate limit error
3. Try code from previous minute → Should not work
4. Wait 30+ seconds → Code expires

---

## Files Changed Summary

| File | Changes |
|------|---------|
| `app/(auth)/actions.ts` | Add `2fa_required` status, check `totpEnabled` |
| `app/(auth)/login/page.tsx` | Show 2FA form when needed |
| `app/(auth)/register/page.tsx` | Show 2FA setup modal (optional) |
| `.env.local` | Add `TOTP_ENCRYPTION_KEY` |

---

## Important Notes

### Encryption Key
- Generate once, store securely
- 32 bytes = 64 hex characters
- Never commit to git
- Same key needed in all environments

### Database
- Migration adds 4 columns to User table
- No data loss (all new columns)
- Reversible if needed

### Authenticator App
- User can use ANY RFC 6238 TOTP app
- Google Authenticator
- Microsoft Authenticator
- Authy
- FreeOTP
- Etc.

### Rate Limiting
- 5 wrong attempts allowed
- 15-minute block after
- Uses Redis (Upstash)
- Prevents brute force attacks

---

## Troubleshooting

### "TOTP_ENCRYPTION_KEY not found"
1. Check `.env.local` has the key
2. Restart `npm run dev`
3. Verify spelling and format

### "Code never verifies"
1. Check authenticator time is synced
2. Verify encryption key is correct
3. Check you're entering 8 digits
4. Try code within 30-second window

### "Rate limit error on first try"
1. Redis still has old attempts
2. Wait 15 minutes or clear Redis
3. Or use different test email

### "Database migration fails"
1. Check PostgreSQL is running
2. Check credentials in env
3. Check network connection
4. Check database exists

---

## Next Steps

1. **Generate encryption key** (2 min)
2. **Add to .env.local** (2 min)
3. **Run migration** (5 min)
4. **Edit 3 auth files** (35 min)
5. **Test flow** (15 min)

**Total: ~1 hour to production-ready 2FA!** 🎉

---

## Support Files

- **Detailed Guide**: `TOTP_IMPLEMENTATION_COMPLETE.md`
- **Checklist**: `TOTP_QUICK_CHECKLIST.md`
- **Visual**: `TOTP_VISUAL_GUIDE.txt`
- **Summary**: `TOTP_IMPLEMENTATION_SUMMARY.md`

---

## Code Reference

**Check if 2FA is enabled:**
```typescript
if (user?.totpEnabled) { /* 2FA is on */ }
```

**Show 2FA form:**
```tsx
{show2FA && <TwoFAVerificationForm userEmail={email} />}
```

**Verify code:**
```bash
POST /api/auth/verify-2fa
Body: { totpCode: "12345678" }
```

---

**You're ready!** Start with Step 1 and follow through. You'll have full 2FA working in about an hour. 🚀

Questions? Check the detailed guide files or review the existing infrastructure code (all well-commented).

Good luck! 💪
