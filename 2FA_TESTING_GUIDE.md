# 🧪 2FA Testing Guide

## Fixed Issues ✅

### Database Connection Issue
**Problem**: `ECONNRESET` when trying to register
**Root Cause**: `queries.ts` was forcing `?sslmode=require` even when using local SSH tunnel
**Solution**: Modified `getDb()` to check if `sslmode` already exists in connection URL before appending

### Connection Flow
```
Local App → SSH Tunnel (port 53332) → Remote PostgreSQL (85.215.209.220:5432)
                                    (Connection is unencrypted locally, SSH handles the encryption)
```

---

## Test Procedure

### Step 1: Register Account

1. **Open browser**: http://localhost:3000/register
2. **Fill form**:
   - Email: `test@example.com`
   - Password: `password123`
3. **Watch console** for logs:
   ```
   [REGISTER] Starting registration process
   [REGISTER] Form validated: { email: 'test@example.com' }
   [DB] Connecting to database: postgresql://mytxonepost:***@localhost:53332/mytxone?sslmode=disable
   [REGISTER] User lookup result: { userExists: false, email: 'test@example.com' }
   [REGISTER] Creating new user: { email: 'test@example.com' }
   [REGISTER] User created successfully
   [REGISTER] Attempting to sign in user
   [REGISTER] Sign in successful
   [REGISTER] Returning success status
   ```
4. **Expected**: Should see success toast and 2FA setup modal appears

### Step 2: Enable 2FA

1. **Modal appears** after registration: "Add 2FA to your account"
2. **Click "Enable 2FA"** button
3. **Redirected** to Legitate (https://legitate.com/dashboard/simple-totp)
4. **Scan QR Code** with authenticator app (Google Authenticator, Authy, etc.)
5. **Complete setup** on Legitate
6. **Browser callback** happens automatically
7. **Check database** - should see 2FA enabled:
   ```sql
   SELECT email, totp_enabled, totp_setup_completed 
   FROM "User" 
   WHERE email = 'test@example.com';
   ```
   Expected result: `totp_enabled = true`, `totp_setup_completed = timestamp`

### Step 3: Log Out

1. **Navigate** to home page or account settings
2. **Click logout** button
3. **Verify** redirected to login page

### Step 4: Log Back In with 2FA

1. **Go to**: http://localhost:3000/login
2. **Enter credentials**:
   - Email: `test@example.com`
   - Password: `password123`
3. **Watch console** for 2FA detection:
   ```
   [LOGIN] Starting login process
   [LOGIN] Form validated: { email: 'test@example.com' }
   [DB] Connecting to database: postgresql://mytxonepost:***@localhost:53332/mytxone?sslmode=disable
   [LOGIN] User lookup result: { userExists: true, totpEnabled: true }
   [LOGIN] User has 2FA enabled, returning 2fa_required
   ```
4. **Expected**: Login form disappears, "Verify 2FA Code" form appears
5. **Get code** from authenticator app (8 digits)
6. **Enter code** in the 2FA form
7. **Submit** and verify login succeeds

### Step 5: Test Edge Cases

#### Wrong Code
1. Log out again
2. Try logging in with wrong code
3. **Expected**: Error message appears

#### Rate Limiting (5+ wrong attempts)
1. Try entering wrong code 5+ times
2. **Expected**: "Too many attempts, please try again later" error after 5th attempt
3. **Note**: Should automatically unblock after 15 minutes or you can clear Redis

#### Expired Code
1. Wait 30+ seconds
2. Enter old code
3. **Expected**: Code rejected (TOTP codes expire after 30 seconds)

---

## Console Logs to Watch For

### Registration Success
```
[REGISTER] Starting registration process
[REGISTER] Form validated: { email: '...' }
[REGISTER] User lookup result: { userExists: false, ... }
[REGISTER] Creating new user: ...
[REGISTER] User created successfully
[REGISTER] Attempting to sign in user
[REGISTER] Sign in successful
[REGISTER] Returning success status
```

### 2FA Required During Login
```
[LOGIN] Starting login process
[LOGIN] Form validated: { email: '...' }
[LOGIN] User lookup result: { userExists: true, totpEnabled: true }
[LOGIN] User has 2FA enabled, returning 2fa_required
```

### Successful Login Without 2FA
```
[LOGIN] Starting login process
[LOGIN] Form validated: { email: '...' }
[LOGIN] User lookup result: { userExists: true, totpEnabled: false }
[LOGIN] No 2FA enabled, proceeding with normal login
[LOGIN] Sign in successful
```

---

## Database Connection Log

After fix, you should see:
```
[DB] Connecting to database: postgresql://mytxonepost:***@localhost:53332/mytxone?sslmode=disable
```

This means:
- ✅ Connection string has `sslmode=disable` (no SSL locally)
- ✅ Connecting to `localhost:53332` (SSH tunnel)
- ✅ Database credentials properly masked in logs

---

## SSH Tunnel Status

Should see on startup:
```
🔍 Checking for existing tunnels...
✅ PostgreSQL tunnel is running on port 53332
✅ Redis tunnel is running on port 6189
✅ All tunnels already active! Proceeding with dev server...
```

---

## Troubleshooting

### Issue: Still getting ECONNRESET
1. Check tunnels running: `netstat -ano | findstr :53332`
2. Check SSH processes: `Get-Process ssh`
3. Restart dev server: Stop and run `npm run dev` again
4. Check connection string in `.env.local` has `sslmode=disable`

### Issue: 2FA Modal Not Showing
1. Check registration returned `success` status
2. Check browser console for errors
3. Verify user was created in database
4. Try refreshing page

### Issue: Authenticator Code Not Working
1. Check authenticator app time is synced (Settings → Time synchronization)
2. Try a different authenticator app
3. Check 8-digit format (should be all numbers)
4. Make sure you're within 30-second window

### Issue: Rate Limit Blocking
1. Clear Redis or wait 15 minutes
2. Use different email address
3. Check UPSTASH_REDIS credentials in `.env.local`

---

## Files Modified

| File | Changes |
|------|---------|
| `db/queries.ts` | Fixed SSL mode handling in `getDb()` |
| `app/(auth)/actions.ts` | Added comprehensive logging to login/register |
| `app/(auth)/login/page.tsx` | Integrated 2FA verification form |
| `app/(auth)/register/page.tsx` | Integrated 2FA setup modal |

---

## Next Steps After Successful Test

1. ✅ Verify all test cases pass
2. ✅ Check database has 2FA data correctly
3. ✅ Verify rate limiting works
4. ✅ Test with multiple accounts
5. ✅ Remove debug console.log statements before production
6. ✅ Deploy to production with proper environment variables

---

## Production Checklist

Before deploying to production:

- [ ] Remove/minimize `console.log` statements
- [ ] Set `TOTP_ENCRYPTION_KEY` in production environment
- [ ] Verify SSH tunnels or direct connection works in production
- [ ] Test 2FA end-to-end in production
- [ ] Enable proper monitoring for failed 2FA attempts
- [ ] Document 2FA setup for users
- [ ] Create password reset flow that requires 2FA verification
- [ ] Test account recovery with backup codes (optional enhancement)

---

**You're all set!** Go test and enjoy your 2FA implementation! 🎉
