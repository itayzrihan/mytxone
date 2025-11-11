# PayPal-First Subscription Architecture

## 🎯 Core Principle

**Single Source of Truth: PayPal API**

- ✅ **Primary**: PayPal API subscription status (real, verified)
- 🗄️ **Database**: Cache/sync point (optional, for reference)
- 🔧 **Admin Override**: Only admins can force a plan via database for testing

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     User Application                         │
│                                                              │
│  Components need to know: "What plan is this user?"         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  useUserPlan() Hook        │
        │  (Primary entry point)     │
        └────────────┬───────────────┘
                     │
     ┌───────────────┴──────────────────┐
     │                                  │
     ▼                                  ▼
┌──────────────────┐         ┌─────────────────────┐
│  Is User Admin?  │         │ Regular User Flow   │
│                  │         │                     │
│  YES ────────┐   │         │ 1. Check PayPal API │
│              │   │         │ 2. Cache to DB      │
│              ▼   │         │ 3. Return tier      │
│         ┌─────────┐        │                     │
│         │ Database│        └─────────────────────┘
│         │  Field  │
│         └─────────┘
│              │
└──────────────┼────────────────────────────────────┘
               │
               ▼
        ┌─────────────────┐
        │  userPlan       │
        │  ('free'|'basic'│
        │   |'pro')       │
        └─────────────────┘
```

---

## 📋 Flow for Regular Users

```
1. User Component calls useUserPlan()
   ↓
2. Hook checks if user is authenticated
   ↓
3. Hook calls PayPal API: /api/paypal/subscription/check
   ↓
4. Backend fetches from PayPal (subscription status)
   ↓
5. Map PayPal status to plan tier:
   - No subscription → 'free'
   - ACTIVE + basic plan → 'basic'
   - ACTIVE + pro plan → 'pro'
   ↓
6. Update database subscription field (for sync/reference)
   ↓
7. Return userPlan to component
```

---

## 🔧 Flow for Admin Users (Testing)

```
1. Admin Component calls useUserPlan()
   ↓
2. Hook checks if user is admin
   ↓
3. Admin flag set → use database subscription field
   ↓
4. Return database plan directly (bypass PayPal)
   ↓
   
   Note: Admin can manually set database field to test:
   - UPDATE User SET subscription = 'pro' WHERE id = '...'
```

---

## 📁 Files to Create/Modify

### New Files to Create:

1. **`lib/paypal-subscription-check.ts`**
   - Function to verify subscription with PayPal API
   - Maps PayPal status to tier
   - Handles errors gracefully

2. **`lib/admin-context.ts`** (if needed)
   - Context to track if current user is admin
   - Used by useUserPlan to decide: PayPal vs Database

3. **`app/api/paypal/subscription/check/route.ts`**
   - New endpoint (separate from existing `/api/paypal/subscription`)
   - Checks PayPal and returns current plan
   - Does NOT save to database

### Files to Modify:

1. **`components/custom/user-plan-context.tsx`**
   - Modify `useUserPlan()` to call `/api/paypal/subscription/check`
   - Add admin override logic

2. **`lib/use-subscription.ts`**
   - Might not need changes (already handles auth)

3. **`app/api/user/subscription/route.ts`**
   - Call PayPal endpoint instead of just returning database

---

## 🔄 Key Differences from Current

### Current (Database-First):
```typescript
const subscription = user.subscription; // from database
return subscription; // 'free', 'basic', 'pro'
```

### New (PayPal-First):
```typescript
// Check PayPal for truth
const paypalStatus = await verifyWithPayPal(user.id);
const subscription = mapPayPalToTier(paypalStatus);

// Only if admin:
if (user.isAdmin) {
  const dbOverride = user.subscription; // can override for testing
  if (dbOverride) return dbOverride;
}

return subscription; // real PayPal truth
```

---

## 🔐 Security Implications

✅ **More Secure**:
- Cannot tamper with plan by just updating database
- PayPal is the authority
- Prevents cheating by manual DB updates

✅ **Admin Testing**:
- Admins CAN set database field for testing
- Normal users cannot

⚠️ **Edge Cases**:
- What if PayPal API is down? → Use cached database value with timestamp
- What if no subscription in PayPal? → Default to 'free'

---

## 📊 Plan Mapping

| PayPal Status | Plan Type | Our Tier |
|---------------|-----------|----------|
| No subscription | - | `'free'` |
| ACTIVE | basic_plan_id | `'basic'` |
| ACTIVE | pro_plan_id | `'pro'` |
| APPROVAL_PENDING | any | `'free'` (wait for ACTIVE) |
| SUSPENDED | any | `'free'` (subscription paused) |
| EXPIRED | any | `'free'` (ended) |

---

## 🚀 Implementation Steps

1. Create `paypal-subscription-check.ts` utility
2. Create `/api/paypal/subscription/check` endpoint
3. Modify `useUserPlan()` hook to use PayPal
4. Add admin override logic
5. Update API endpoints
6. Test end-to-end
7. Delete old database-based subscription code (optional)

---

## 🧪 Testing Scenarios

| Scenario | Expected | How to Test |
|----------|----------|------------|
| Free user (no subscription) | 'free' tier | User with no PayPal subscription |
| Basic subscriber | 'basic' tier | PayPal returns ACTIVE + basic plan |
| Pro subscriber | 'pro' tier | PayPal returns ACTIVE + pro plan |
| Admin override | Can force any tier | Set DB field while isAdmin=true |
| PayPal API down | Use cached value | Simulate API error |

---

## 🔗 Related Files

Current PayPal integration:
- `app/api/paypal/subscription/route.ts` - Saves subscription (POST)
- `components/custom/upgrade-plan-wall.tsx` - Subscription modal
- `lib/use-subscription.ts` - Current hook (needs modification)
- `components/custom/user-plan-context.tsx` - Plan context

---

## ⚡ Performance Considerations

- **Cache**: Store PayPal check result with TTL (5-10 minutes)
- **Background**: Could refresh in background every N minutes
- **Fallback**: Use database cache if PayPal is slow/down
- **Rate Limiting**: PayPal has rate limits, implement caching

---

## 🎓 Key Takeaway

**PayPal is now the ground truth.** The database subscription field becomes:
- A cache of the last known PayPal status
- A testing/override field for admins only
- No longer used for regular users

This ensures:
✅ Real subscription status (no cheating)
✅ Always in sync with PayPal
✅ Admin testing capability
✅ More secure and trustworthy

