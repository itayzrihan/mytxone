# Testing PayPal Subscription Integration

## Prerequisites

1. **PayPal Business Account** with sandbox access
2. **Environment Variables** set in `.env.local`:
   ```
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_sandbox_client_id
   PAYPAL_CLIENT_SECRET=your_sandbox_client_secret
   NEXT_PUBLIC_PAYPAL_MODE=sandbox
   NEXT_PUBLIC_PAYPAL_PLAN_ID_MEMBER_BASIC=P-1NS15766Y7070154NNEIQCAI
   NEXT_PUBLIC_PAYPAL_PLAN_ID_MEMBER_PRO=P-6GS155471J0551515NEIQCNI
   ```

## Step-by-Step Testing

### Test 1: User Registration & Subscription

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **Create a new account**:
   - Go to `http://localhost:3000/register`
   - Sign up with a test email (e.g., `testuser@example.com`)

3. **Navigate to Create Meeting**:
   - Go to `http://localhost:3000/mytx/create-meeting`
   - Should see upgrade wall

4. **Open browser console**:
   - Press `F12` or `Cmd+Option+J`
   - Keep it open to see logs

### Test 2: PayPal Modal & Subscription

1. **Click "CREATE A MEETING"**:
   - Shows pricing plans

2. **Select Basic plan**:
   - Click "TRY FOR FREE"
   - PayPal modal opens

3. **Fill form**:
   - Meeting Name: "Test Meeting"
   - Click "Subscribe" button

4. **PayPal Popup**:
   - Should open PayPal login
   - Use sandbox buyer account (created in PayPal dashboard)
   - Approve subscription

5. **Check console logs**:
   - Should see: `POST /api/paypal/subscription`
   - Should see: PayPal verification logs
   - Should see: Database update logs

### Test 3: Verify Subscription Status

1. **After approval**, run in browser console:
   ```javascript
   checkMySubscription()
   ```

2. **Expected output**:
   ```
   === Current Subscription Status ===
   Email: testuser@example.com
   Plan: basic
   Is Active: true
   User ID: [uuid]
   Created At: [date]
   Updated At: [recent-date]
   ===================================
   ```

3. **Page should reload** after 1-2 seconds

4. **Verify upgrade wall is gone**:
   - Navigate to create-community page
   - Should show create community dialog, not upgrade wall

### Test 4: Check PayPal Subscription Details

1. **Get subscription ID from earlier alert** or console logs:
   - Format: `I-XXXXXXXXX`
   - Example: `I-WTSU02NUPY7M`

2. **Check PayPal subscription status**:
   ```javascript
   checkPayPalSubscription('I-WTSU02NUPY7M')
   ```

3. **Expected output**:
   ```
   === PayPal Subscription Status ===
   Subscription ID: I-WTSU02NUPY7M
   Status: ACTIVE
   Plan ID: P-1NS15766Y7070154NNEIQCAI
   Start Time: 2025-11-09T10:00:00Z
   Next Billing: 2025-12-09T10:00:00Z
   ===================================
   ```

### Test 5: API Endpoints Direct Testing

1. **Check user subscription via API**:
   ```bash
   curl -X GET http://localhost:3000/api/user/subscription \
     -H "Cookie: [your-session-cookie]"
   ```

2. **Check PayPal subscription via API**:
   ```bash
   curl -X GET "http://localhost:3000/api/paypal/subscription?subscriptionId=I-WTSU02NUPY7M" \
     -H "Cookie: [your-session-cookie]"
   ```

3. **Manually verify subscription (POST)**:
   ```bash
   curl -X POST http://localhost:3000/api/paypal/subscription \
     -H "Content-Type: application/json" \
     -H "Cookie: [your-session-cookie]" \
     -d '{
       "subscriptionId": "I-WTSU02NUPY7M",
       "planType": "basic"
     }'
   ```

## Server Logs to Watch

### Successful Flow Logs

```
[API] POST /api/paypal/subscription received
[PAYPAL] Requesting access token...
[PAYPAL] Access token obtained: eyJhbGciOi...
[PAYPAL] Verifying subscription I-WTSU02NUPY7M...
[PAYPAL] Subscription status: ACTIVE
[DB] Updating user 123-456-789 subscription to 'basic'
[DB] Successfully updated user subscription
[API] Subscription activation successful
```

### Error Flow Logs

```
[PAYPAL] Subscription status: APPROVAL_PENDING
[API] ERROR: Subscription not yet active, status: APPROVAL_PENDING
```

## Common Issues & Solutions

### Issue: "Subscription status is APPROVAL_PENDING"

**Cause**: PayPal hasn't activated the subscription yet
**Solution**: 
- Wait 30 seconds and try again
- Check PayPal dashboard to see subscription status
- Try refreshing and re-approving

### Issue: "Failed to authenticate with PayPal"

**Cause**: Missing or wrong `PAYPAL_CLIENT_SECRET`
**Solution**:
```bash
# Verify environment variable is set
echo $PAYPAL_CLIENT_SECRET

# Check .env.local has correct secret
cat .env.local | grep PAYPAL_CLIENT_SECRET
```

### Issue: "Subscription not found or invalid"

**Cause**: Wrong subscription ID or PayPal API down
**Solution**:
- Verify subscription ID is correct (starts with I-)
- Check PayPal status page
- Try creating a new subscription

### Issue: "Failed to save subscription" (500 error)

**Cause**: Database error
**Solution**:
- Check database connection
- Check server logs for detailed error
- Verify user exists in database
- Try manual database update

### Issue: "Unauthorized" (401 error)

**Cause**: Not logged in
**Solution**:
- Make sure you're logged in
- Check if session cookie exists
- Log out and log back in

## Database Verification

### Check user subscription directly in database

```sql
-- Check user subscription
SELECT id, email, subscription, updated_at 
FROM "User" 
WHERE email = 'testuser@example.com';

-- Should show: subscription = 'basic' or 'pro'
```

### If subscription is still 'free' after approval

```sql
-- Manually update for testing (don't do in production)
UPDATE "User" 
SET subscription = 'basic' 
WHERE email = 'testuser@example.com';
```

## Network Tab Debugging

1. **Open DevTools Network tab** (F12 → Network)
2. **Perform subscription flow**
3. **Look for these requests**:

   - ✅ `POST /api/paypal/subscription` → 200 OK
     - Check Response tab for success object
   - ✅ `https://api.sandbox.paypal.com/v1/oauth2/token` → 200 OK
   - ✅ `https://api.sandbox.paypal.com/v1/billing/subscriptions/I-xxx` → 200 OK

4. **If any fail**, check response body for error details

## Checklist for Full Test

- [ ] Account created successfully
- [ ] PayPal modal opens
- [ ] Can fill community/meeting name
- [ ] PayPal button works
- [ ] PayPal popup appears
- [ ] Can approve payment
- [ ] `checkMySubscription()` shows correct plan
- [ ] Page reloads automatically
- [ ] Upgrade wall is gone
- [ ] Can create resource without limits
- [ ] Plan shows as "basic" or "pro" everywhere
- [ ] API endpoints return correct data

## Testing Different Scenarios

### Test Scenario: Pro Plan
1. Change `modalPlan` to 'pro' in code (temporarily)
2. Or select Pro plan in the UI
3. Repeat all tests above
4. Verify: `checkMySubscription()` shows "pro"

### Test Scenario: Payment Failure
1. Use PayPal declined card number in sandbox
2. Verify error handling in onApprove
3. Verify user still on "free" plan

### Test Scenario: Multiple Users
1. Create multiple test accounts
2. Subscribe each with different plans
3. Verify each user only sees their own plan
4. Verify database has correct plan for each

## Performance Testing

### Check how long subscription takes to save

In browser console:
```javascript
const start = performance.now();
const result = await fetch('/api/paypal/subscription', {...});
const end = performance.now();
console.log(`Subscription save took: ${(end - start).toFixed(2)}ms`);
```

Should be < 5000ms (5 seconds)

## Cleanup After Testing

```sql
-- Delete test users
DELETE FROM "User" WHERE email LIKE 'testuser%@example.com';

-- Reset subscriptions
UPDATE "User" SET subscription = 'free' WHERE email LIKE 'test%';
```

## Resources

- [PayPal Sandbox Setup](https://developer.paypal.com/dashboard/)
- [PayPal REST API Docs](https://developer.paypal.com/docs/api/subscriptions/v1/)
- [PayPal Test Cards](https://developer.paypal.com/tools/sandbox/card-testing/)
