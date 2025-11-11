# Subscription Check - Quick Commands

Copy and paste these into browser console (F12):

## Check Current User Subscription
```javascript
checkMySubscription()
```
Shows: Email, Plan (basic/pro/free), User ID, Dates, Is Active status

## Check PayPal Subscription Status
```javascript
checkPayPalSubscription('I-WTSU02NUPY7M')
```
Replace with actual subscription ID from alert message

## Quick API Checks

### Check DB Subscription (Terminal/PowerShell)
```bash
# Windows PowerShell
$headers = @{"Cookie"="[your-session]"}
Invoke-WebRequest -Uri "http://localhost:3000/api/user/subscription" -Headers $headers | ConvertTo-Json
```

### Check PayPal Subscription (Terminal/PowerShell)
```bash
# Windows PowerShell
$subscriptionId = "I-WTSU02NUPY7M"
$headers = @{"Cookie"="[your-session]"}
Invoke-WebRequest -Uri "http://localhost:3000/api/paypal/subscription?subscriptionId=$subscriptionId" -Headers $headers | ConvertTo-Json
```

## Database Check (SQL)

```sql
-- Check if subscription was saved
SELECT email, subscription, updated_at 
FROM "User" 
WHERE email = 'your-email@example.com';

-- Should show: subscription = 'basic' or 'pro' (not 'free')
-- Should show: updated_at = recent timestamp
```

## What Each Status Means

| Status | Meaning |
|--------|---------|
| free | No subscription |
| basic | Basic plan (5 items, limited features) |
| pro | Pro plan (unlimited items, all features) |

## Expected Subscription Flow Timeline

1. **0s**: User clicks "TRY FOR FREE"
2. **5s**: User approves PayPal payment
3. **5-10s**: `onApprove` callback runs
4. **5-15s**: PayPal verification completes
5. **15-20s**: Database updates
6. **~20s**: Success alert shows
7. **22s**: Page reloads
8. **25s**: Upgrade wall disappears

## Troubleshooting Quick Reference

| Problem | Check |
|---------|-------|
| Still on "free" plan | Run `checkMySubscription()` |
| Wrong PayPal status | Run `checkPayPalSubscription('ID')` |
| Subscription ID format | Should start with `I-` followed by letters |
| No success message | Check browser console for errors (F12) |
| Page didn't reload | Reload manually with F5 |
| Different plan than expected | Check `modalPlan` in code |

## Files with Changes

```
✅ New API: app/api/paypal/subscription/route.ts
✅ Fixed UI: components/custom/upgrade-plan-wall.tsx
✅ Enhanced API: app/api/user/subscription/route.ts
✅ Debug tools: lib/subscription-debug.ts
✅ User passing: app/mytx/create-*.tsx
```

## Key URLs

- Create Meeting: http://localhost:3000/mytx/create-meeting
- Create Community: http://localhost:3000/mytx/create-community
- My Meetings: http://localhost:3000/owned-meetings
- My Communities: http://localhost:3000/communities?filter=owned

## PayPal Test Credentials

Available in PayPal Sandbox Dashboard:
- Sandbox Business Account (seller)
- Sandbox Buyer Account (test user)
- Test Credit Cards

## Need More Help?

Check these files in order:
1. SUBSCRIPTION_FIX_SUMMARY.md - Overview of changes
2. SUBSCRIPTION_FLOW_GUIDE.md - Visual flow diagram
3. SUBSCRIPTION_TESTING_GUIDE.md - Detailed testing steps
4. PAYPAL_SUBSCRIPTION_FIX.md - Complete technical documentation
