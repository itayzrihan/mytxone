# 2FA Quick Setup Checklist

## Prerequisites
- [ ] Node.js installed
- [ ] TypeScript configured
- [ ] NextAuth configured
- [ ] Database configured (PostgreSQL)
- [ ] Upstash Redis account (for rate limiting)

## Step 1: Generate Encryption Key (2 minutes)

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output. You'll need it in Step 2.

## Step 2: Set Environment Variables (1 minute)

Add to `.env.local`:

```env
# Paste output from step 1 here
TOTP_ENCRYPTION_KEY=<paste_32_byte_hex_string_here>

# Your NextAuth URL
NEXTAUTH_URL=http://localhost:3000

# Get these from upstash.com
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

## Step 3: Run Database Migration (3 minutes)

```bash
npm run build
```

This will:
- Migrate database schema
- Add TOTP fields to user table
- Create necessary tables

**Note**: If using a separate database for development, ensure you have permission to run migrations.

## Step 4: Choose Integration Type (2 minutes)

Read `TWO_FA_INTEGRATION_GUIDE.md` and decide:
- **Option 1**: Two-step modal after login ← Recommended
- **Option 2**: Offer during registration
- **Option 3**: Add to account settings

Each has example code in the guide.

## Step 5: Update Auth Forms (Optional, 10-15 minutes)

If you chose Option 1 or 2:

1. Update login page (Option 1) or register page (Option 2)
2. Add the 2FA modal/form component
3. Implement the flow logic
4. Test with example account

See `TWO_FA_INTEGRATION_GUIDE.md` for exact code.

## Step 6: Test Setup (10 minutes)

### Quick Test

1. Go to your app settings
2. Click "Enable 2FA" (if you added it)
3. You'll be redirected to Legitate
4. Scan QR code with:
   - Google Authenticator
   - Authy
   - Microsoft Authenticator
   - (Any authenticator app)
5. Complete setup
6. Check database - you should see encrypted secret stored

### Verify Test

1. Login with email/password
2. If 2FA enabled, enter 6-digit code from app
3. You should see "Verification successful"
4. Login should complete

### Edge Cases

- [ ] Test invalid code (should fail)
- [ ] Test 6+ codes (should rate limit)
- [ ] Wait 15 minutes and retry (should work)
- [ ] Test disable 2FA (should work)

## Step 7: Deploy to Production (Optional)

When ready to go live:

1. Ensure `NEXTAUTH_URL=https://yourdomain.com`
2. Regenerate encryption key for production:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. Update production `.env` with new key
4. Ensure HTTPS is enabled
5. Test one more time in production
6. Monitor logs for errors

## Troubleshooting

### "TOTP_ENCRYPTION_KEY is not configured"
- Add key to `.env.local`
- Restart dev server with `npm run dev`

### "Redis connection error"
- Check `UPSTASH_REDIS_REST_URL` is correct
- Check `UPSTASH_REDIS_REST_TOKEN` is correct
- Test connection with curl

### Database migration fails
- Ensure PostgreSQL is running
- Check database credentials
- Check user has migration permissions
- Try: `npm run build` again

### Callback not received from Legitate
- Check CORS settings
- Verify `NEXTAUTH_URL` is correct
- Check firewall isn't blocking callbacks
- See if implemented polling fallback

### "Too many attempts" after 5 tries
- Rate limiting is working
- Wait 15 minutes before retrying
- This is by design for security

## What Each Component Does

### `lib/totp.ts`
- Encrypts/decrypts TOTP secrets
- Generates and verifies TOTP codes
- Manages timestamp validation
- Handles base32 encoding

### `app/api/auth/setup-2fa/route.ts`
- Receives 2FA setup request
- Generates Legitate deep link
- Returns link to redirect user to

### `app/api/auth/totp-callback/route.ts`
- Receives callback from Legitate
- Encrypts and stores the secret
- Updates user record

### `app/api/auth/verify-2fa/route.ts`
- Verifies TOTP code during login
- Rate limits attempts (5 per 15 min)
- Returns success/error

### Components
- `TwoFASetupModal`: UI for enabling 2FA
- `TwoFAVerificationForm`: UI for entering code

## Documentation

After setup, read these in order:

1. `TWO_FA_SUMMARY.md` - Overview of what was added
2. `TWO_FA_IMPLEMENTATION.md` - Technical deep dive
3. `TWO_FA_INTEGRATION_GUIDE.md` - Integration examples

## Need Help?

### Error in logs?
→ Check `TWO_FA_IMPLEMENTATION.md` Troubleshooting section

### How to integrate?
→ See `TWO_FA_INTEGRATION_GUIDE.md` with step-by-step examples

### Want more features?
→ See "Future Enhancements" in `TWO_FA_IMPLEMENTATION.md`

### Security questions?
→ See "Security Features" and "Compliance" in `TWO_FA_IMPLEMENTATION.md`

## Timeline

- **Setup**: 5-10 minutes
- **Testing**: 10-15 minutes
- **Integration**: 15-30 minutes
- **Deployment**: 5 minutes
- **Total**: ~45 minutes to production-ready

## Going Live

### Before Launch
- [ ] All tests passing
- [ ] Environment variables set
- [ ] Database migrated
- [ ] HTTPS enabled
- [ ] Monitoring configured
- [ ] Documentation reviewed

### Launch Day
- [ ] Make 2FA optional (not required)
- [ ] Monitor error logs
- [ ] Check rate limiting works
- [ ] Verify callbacks are received
- [ ] Test with 10+ users

### Post-Launch
- [ ] Collect user feedback
- [ ] Monitor adoption rate
- [ ] Check error patterns
- [ ] Plan Phase 2 if needed

## Next Phases (Optional)

### Phase 2: Recommended
- Prompt users to enable 2FA
- Show security benefits
- Track adoption metrics

### Phase 3: Required
- Enforce 2FA for all users
- Phase by user type (admin first)
- Provide recovery options

### Phase 4: Advanced
- Recovery codes
- Trusted devices
- FIDO2 keys
- SMS fallback

## Success Criteria

✅ 2FA Setup Complete When:
- [ ] User can enable 2FA
- [ ] Secret is encrypted and stored
- [ ] User can verify codes during login
- [ ] Rate limiting prevents brute force
- [ ] Codes expire after 30 seconds
- [ ] Disable 2FA works
- [ ] All tests pass
- [ ] No errors in logs

## Support

For issues:
1. Check documentation files
2. Review error messages
3. Check Upstash Redis connection
4. Verify environment variables
5. Check logs for details

---

**You're all set!** Run `npm run dev` and test your 2FA implementation.

Questions? See the documentation files or check logs for errors.
