# PayPal-First Implementation Guide

## Phase 1: Database Schema Update ✅ DONE

### Changes Made:
1. Added `paypalSubscriptionId` field to User table
   - Stores the PayPal subscription ID (e.g., I-WTSU02NUPY7M)
   - Used to verify subscription status with PayPal

2. Updated `/api/paypal/subscription` POST route
   - Now saves `paypalSubscriptionId` when user subscribes
   - Database field updated with PayPal subscription ID

---

## Phase 2: Create PayPal Verification Utilities ✅ DONE

### Files Created:

**`lib/paypal-subscription-check.ts`**
- `checkPayPalSubscriptionStatus()` - Main function to verify with PayPal
- `getTierFromPayPalStatus()` - Maps PayPal status to our tier
- `isPaidTier()` - Helper to check if tier is paid
- `getResourceLimitForPayPalTier()` - Get limits based on tier

**`app/api/paypal/subscription/check/route.ts`** (NEW)
- GET endpoint to check current PayPal status
- Does NOT modify database
- Returns: PayPal-based plan tier + verification details

---

## Phase 3: Update Hooks to Use PayPal-First

### TODO: Modify `components/custom/user-plan-context.tsx`

**Current Flow:**
```typescript
// Returns database subscription field
const userPlan = user.subscription; // from DB
```

**New Flow:**
```typescript
// 1. Call PayPal verification endpoint
const response = await fetch('/api/paypal/subscription/check');
const { subscription: paypalTier } = await response.json();

// 2. Use PayPal tier as source of truth
const userPlan = paypalTier;

// 3. If admin, allow override from database
if (user.isAdmin && databaseOverride) {
  userPlan = databaseOverride;
}

return userPlan;
```

---

## Phase 4: Admin Override System

### For Admins to Test Different Plans:

**Option A: Direct Database Update**
```sql
-- Admin can manually set database field
UPDATE "User" 
SET subscription = 'pro' 
WHERE id = 'user-id' AND role = 'admin';
```

**Option B: Admin Panel (Future)**
- Create `/admin/subscription-override` page
- Allow admins to toggle plan for testing
- Clearly shows: "This is TEST MODE - using database value"

### Database Field Behavior:
- Regular users: **IGNORED** (PayPal is truth)
- Admin users: **USED** (for testing purposes)

---

## Phase 5: Caching Strategy (Optional)

### Current Approach:
- Check PayPal on every `useUserPlan()` call
- Not ideal for performance/rate limits

### Better Approach:
- Cache PayPal check result with TTL (5-10 minutes)
- Use database `subscription` field as cache
- Background refresh every N minutes

### Implementation:
```typescript
const PayPalCheckCache = {
  userId: 'user-id',
  tier: 'pro',
  checkedAt: Date.now(),
  ttl: 5 * 60 * 1000, // 5 minutes
};

// Check if cache is valid
if (Date.now() - cachedResult.checkedAt < ttl) {
  return cachedResult.tier; // Use cache
}

// Cache expired, fetch from PayPal
const fresh = await checkPayPalSubscriptionStatus();
```

---

## Phase 6: Error Handling

### PayPal API Down:
```
What happens?
1. Try to fetch from PayPal
2. API error → catch error
3. Fall back to database cached value
4. Return database tier (with warning)
```

### No PayPal Subscription:
```
What happens?
1. User has no paypalSubscriptionId
2. Return 'free' tier
3. No database fallback needed
```

### Invalid PayPal Status:
```
APPROVAL_PENDING → 'free' (wait for ACTIVE)
SUSPENDED → 'free' (subscription paused)
EXPIRED → 'free' (ended)
CANCELLED → 'free' (user cancelled)
ACTIVE → 'basic' or 'pro' (based on plan ID)
```

---

## Implementation Checklist

- [x] Add `paypalSubscriptionId` to User schema
- [x] Create `paypal-subscription-check.ts` utility
- [x] Create `/api/paypal/subscription/check` endpoint
- [x] Update POST `/api/paypal/subscription` to save paypalSubscriptionId
- [ ] Modify `useUserPlan()` hook to call PayPal endpoint
- [ ] Add admin override logic to `useUserPlan()`
- [ ] Update `user-plan-context.tsx` component
- [ ] Test end-to-end with PayPal sandbox
- [ ] Handle PayPal API errors gracefully
- [ ] Add caching layer (optional but recommended)
- [ ] Create admin testing interface (optional)
- [ ] Document for team
- [ ] Update tests

---

## Testing Scenarios

### Scenario 1: Regular User (No Subscription)
```
1. User logs in
2. useUserPlan() calls /api/paypal/subscription/check
3. PayPal check: no subscription found
4. Result: tier = 'free'
5. UI shows: Free plan features
```

### Scenario 2: Basic Subscriber
```
1. User logs in
2. useUserPlan() calls /api/paypal/subscription/check
3. PayPal check: ACTIVE + basic plan ID
4. Result: tier = 'basic'
5. UI shows: 3 resources limit
```

### Scenario 3: Admin Testing Pro Plan
```
1. Admin logs in
2. Admin manually updates DB: subscription = 'pro'
3. useUserPlan() calls /api/paypal/subscription/check
4. Detects: user.isAdmin = true && database override exists
5. Result: tier = 'pro' (from database)
6. UI shows: Unlimited resources (for testing)
```

### Scenario 4: PayPal API Down
```
1. User logs in
2. useUserPlan() tries /api/paypal/subscription/check
3. PayPal API error
4. Fallback to database: subscription = 'basic'
5. Result: tier = 'basic' (cached value)
6. UI shows: Last known subscription
```

---

## File Dependencies

```
useUserPlan()
    ↓
/api/paypal/subscription/check (NEW)
    ↓
paypal-subscription-check.ts (NEW)
    ↓
PayPal API
    ↓
Drizzle ORM
    ↓
User table (with paypalSubscriptionId)
```

---

## Key Variables/Fields

| Field | Location | Purpose |
|-------|----------|---------|
| `User.subscription` | Database | **Cache** of PayPal tier (for fallback) |
| `User.paypalSubscriptionId` | Database | PayPal subscription ID (I-XXXX) |
| `User.isAdmin` / `User.role` | Database | Determine if admin override allowed |
| PayPal status | PayPal API | **Source of truth** for subscription |

---

## Security Implications

✅ **More Secure:**
- Regular users cannot cheat by updating database
- PayPal is the authority
- Only admins can force plan (for testing)

⚠️ **Considerations:**
- Admin password protection for override
- Audit log for admin overrides
- Rate limiting on PayPal checks

---

## Rollback Plan

If something breaks:
1. Keep using database `subscription` field as fallback
2. Add feature flag to toggle: `USE_PAYPAL_FIRST=true/false`
3. Easy to revert to old behavior

---

## Next Steps

1. **Immediate**: Update `useUserPlan()` hook (Phase 3)
2. **Short-term**: Test with PayPal sandbox
3. **Medium-term**: Add caching layer
4. **Long-term**: Admin override UI + monitoring

