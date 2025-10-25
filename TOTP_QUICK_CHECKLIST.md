# ✅ 2FA/TOTP Implementation Checklist

## What's Already Done ✅

- ✅ Database schema with TOTP fields
- ✅ TOTP encryption library (`lib/totp.ts`)
- ✅ API endpoints for setup, callback, verification
- ✅ React components for UI
- ✅ 8-digit TOTP code support
- ✅ Rate limiting (5 attempts per 15 minutes)

---

## What You Need To Do 🔧

### Phase 1: Environment Setup (5 min)

- [ ] Generate 32-byte encryption key
- [ ] Add `TOTP_ENCRYPTION_KEY` to `.env.local`
- [ ] Verify other env vars exist:
  - [ ] `UPSTASH_REDIS_REST_URL`
  - [ ] `UPSTASH_REDIS_REST_TOKEN`
  - [ ] `NEXTAUTH_URL`
  - [ ] `NEXTAUTH_SECRET`

### Phase 2: Database Migration (10 min)

- [ ] Run `npm run build`
- [ ] Verify migration succeeded
- [ ] Check database shows TOTP fields

### Phase 3: Wire Login (15 min)

**File**: `app/(auth)/actions.ts`

- [ ] Import `getUser` function
- [ ] Add `2fa_required` status to `LoginActionState`
- [ ] Check if user has `totpEnabled` after password validation
- [ ] Return `2fa_required` if 2FA is on

**File**: `app/(auth)/login/page.tsx`

- [ ] Import `TwoFAVerificationForm`
- [ ] Add state for `show2FA` and `userEmail`
- [ ] Update useEffect to detect `2fa_required`
- [ ] Conditionally render 2FA form vs login form

### Phase 4: Wire Registration (10 min)

**File**: `app/(auth)/register/page.tsx`

- [ ] Import `TwoFASetupModal`
- [ ] Add state for `show2FASetup`
- [ ] Update useEffect to show modal after success
- [ ] Show modal optionally (can skip)

### Phase 5: Testing (20 min)

- [ ] Register new account
- [ ] Enable 2FA (scan QR code)
- [ ] Verify code from authenticator
- [ ] Log out
- [ ] Log back in with password
- [ ] Enter 2FA code
- [ ] Verify successful login
- [ ] Test wrong code (should error)
- [ ] Test rate limiting (5+ wrong codes)

---

## Code Examples Quick Reference

### Check for 2FA in Login

```typescript
const [user] = await getUser(validatedData.email);

if (user && user.totpEnabled) {
  return { 
    status: "2fa_required",
    userEmail: validatedData.email
  };
}
```

### Show 2FA Form in UI

```typescript
{show2FA ? (
  <TwoFAVerificationForm 
    userEmail={userEmail}
    onSuccess={() => router.refresh()}
  />
) : (
  <AuthForm action={handleSubmit}>
    {/* existing form */}
  </AuthForm>
)}
```

---

## File Structure

```
✅ Infrastructure Complete:
lib/totp.ts                          ✅ Encryption & verification
app/api/auth/setup-2fa/route.ts      ✅ Initiate setup
app/api/auth/totp-callback/route.ts  ✅ Receive secret
app/api/auth/verify-2fa/route.ts     ✅ Verify code
components/custom/two-fa-setup-modal.tsx      ✅ Setup UI
components/custom/two-fa-verification-form.tsx ✅ Verify UI
db/schema.ts                         ✅ TOTP fields

🔧 TODO - Wire Together:
app/(auth)/actions.ts                🔧 Add 2FA check
app/(auth)/login/page.tsx            🔧 Show 2FA form
app/(auth)/register/page.tsx         🔧 Show setup modal
.env.local                           🔧 Add encryption key
```

---

## Time Estimates

- Environment setup: **5 minutes**
- Database migration: **10 minutes**
- Wire login: **15 minutes**
- Wire registration: **10 minutes**
- Testing: **20 minutes**

**Total: ~60 minutes** to full 2FA!

---

## Key Concepts

### TOTP (Time-based One-Time Password)
- 8-digit code
- Changes every 30 seconds
- Based on current time
- Works with any authenticator app

### Encryption
- TOTP secret stored encrypted (AES-256-GCM)
- Encryption key from environment
- Decrypted only when verifying

### Rate Limiting
- 5 wrong attempts allowed
- Blocks for 15 minutes after
- Prevents brute force attacks

### Flow
```
Register → Enable 2FA → Get QR Code → Scan → Store Secret
    ↓
Login → Email + Password → Check 2FA → Show Form → Enter Code → Verify → Success
```

---

## Support Files

- **Full guide**: `TOTP_IMPLEMENTATION_COMPLETE.md`
- **Existing code**: Check files in infrastructure
- **TOTP logic**: `lib/totp.ts` (read comments)

---

## Green Flags (You're On Track)

✅ Encryption key generated  
✅ Environment vars configured  
✅ Database migration succeeded  
✅ Login checks for 2FA  
✅ 2FA form shows when needed  
✅ Code verifies successfully  
✅ Wrong codes show errors  
✅ Rate limiting works  

---

Start with **Phase 1** → **Phase 2** → **Phase 3** → **Phase 4** → **Phase 5**

Each phase takes 5-20 minutes. Good luck! 🚀
