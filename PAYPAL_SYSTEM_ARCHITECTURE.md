# PayPal Integration System - Visual Architecture

## System Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                    USER NAVIGATES TO PAGE                        │
│                                                                  │
│  /create-community  /create-meeting  /owned-communities  etc    │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────────┐
         │    Page Component Renders         │
         │  calls useUserPlan() hook         │
         └────────────┬──────────────────────┘
                      │
                      ▼
      ┌──────────────────────────────────────────┐
      │   useUserPlan() Hook                     │
      │  (components/custom/user-plan-context)  │
      │                                         │
      │  Makes HTTP request to:                 │
      │  /api/paypal/subscription/check         │
      └────────────┬───────────────────────────┘
                   │
                   ▼
    ┌────────────────────────────────────────────────┐
    │  GET /api/paypal/subscription/check            │
    │                                                │
    │  1. Authenticate session                       │
    │  2. Get user record from database              │
    │  3. Retrieve paypalSubscriptionId              │
    │  4. Call checkPayPalSubscriptionStatus()       │
    │  5. Fetch meeting count from database          │
    │  6. Fetch community count from database        │
    │  7. Return response with verified tier         │
    └────────┬───────────────────────────────┬───────┘
             │                               │
             ▼                               ▼
    ┌──────────────────────┐      ┌──────────────────────┐
    │  PayPal API          │      │  Database            │
    │                      │      │                      │
    │  1. Get token        │      │  1. Read resource    │
    │  2. Query /billing/  │      │     counts           │
    │     subscriptions    │      │  2. Cache tier for   │
    │  3. Verify ACTIVE    │      │     fallback         │
    │  4. Get plan ID      │      │  3. Check if admin   │
    │  5. Map to tier      │      │     (for override)   │
    └──────────┬───────────┘      └──────────┬───────────┘
               │                            │
               │ tier: "basic"              │ counts
               │ status: "ACTIVE"           │
               └────────┬────────────────────┘
                        │
                        ▼
    ┌────────────────────────────────────────────────────┐
    │  Response Object                                   │
    │  {                                                 │
    │    subscription: "basic",      ← From PayPal      │
    │    isActive: true,             ← From PayPal      │
    │    isPaid: true,               ← Derived          │
    │    paypalStatus: {...},        ← Full PayPal data │
    │    lastVerified: "2025-01-10", ← Timestamp        │
    │    databaseSubscription: "basic", ← For compare   │
    │    meetingCount: 2,            ← From database    │
    │    communityCount: 1           ← From database    │
    │  }                                                 │
    └────────┬──────────────────────────────────────────┘
             │
             ▼
    ┌────────────────────────────────────────┐
    │  Hook Updates State                    │
    │  setUserPlan("basic")                  │
    │  setMeetingCount(2)                    │
    │  setCommunityCount(1)                  │
    │  setIsLoading(false)                   │
    └────────┬───────────────────────────────┘
             │
             ▼
    ┌────────────────────────────────────────┐
    │  Component Receives Updated State      │
    │  {                                      │
    │    userPlan: "basic",                  │
    │    meetingCount: 2,                    │
    │    communityCount: 1,                  │
    │    isLoading: false,                   │
    │    refreshPlan: () => {...}            │
    │  }                                      │
    └────────┬───────────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────────────┐
    │  Page Renders Based on Verified Tier    │
    │                                          │
    │  if (userPlan === 'free') {              │
    │    → Show Upgrade Wall                  │
    │    → Show "Upgrade to create" message   │
    │  }                                       │
    │  else if (userPlan === 'basic') {       │
    │    → Check limits (3 resources)         │
    │    → Show "New" button (if count < 3)   │
    │    → Show count: "2 of 3"               │
    │  }                                       │
    │  else if (userPlan === 'pro') {         │
    │    → Show "New" button (unlimited)      │
    │    → Show count: "2 of Unlimited"       │
    │  }                                       │
    └──────────────────────────────────────────┘
```

---

## Error Handling & Fallback Flow

```
┌─────────────────────────────────┐
│  /api/paypal/subscription/check │
└────────┬────────────────────────┘
         │
         ▼
    ┌─────────────────────────────┐
    │  Try PayPal API Call        │
    │  checkPayPalSubscriptionStatus()
    └────────┬────────────────────┘
             │
      ┌──────┴──────┐
      │             │
    SUCCESS      FAILURE
      │             │
      ▼             ▼
  ┌────────┐   ┌──────────────────────┐
  │PayPal  │   │  Catch Error         │
  │Tier    │   │                      │
  └────────┘   │  Fall back to        │
               │  database.           │
               │  subscription        │
               │                      │
               └──────────┬───────────┘
                          │
                          ▼
                  ┌──────────────────┐
                  │ Return Database  │
                  │ Subscription     │
                  │ (cached value)   │
                  └──────────────────┘
```

---

## Admin Override Flow

```
User makes request to /api/paypal/subscription/check
       │
       ▼
Check: if (user.isAdmin && user.subscription) ?
       │
   ┌───┴───┐
   │       │
  YES      NO
   │       │
   ▼       ▼
Return   Check PayPal
DB Value  API
(Override)
   │       │
   └───┬───┘
       │
       ▼
Return to Component
```

**Admin Override Allows**:
- Testing different plan tiers without PayPal subscription
- Quick plan changes during debugging
- Temporary access for support purposes

---

## 5 Pages Using PayPal Verification

```
        User Session
             │
      ┌──────┴──────┬─────────┬──────────┬───────────┐
      │             │         │          │           │
      ▼             ▼         ▼          ▼           ▼
 Create         Create    Owned      Upgrade     Browse
Community      Meeting   Communities   Wall     Communities
   │             │         │          │           │
   └──────────────┴─────────┴──────────┴───────────┘
                         │
                         ▼
              useUserPlan() Hook
                         │
                         ▼
        /api/paypal/subscription/check
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
    PayPal API      Database         Counts
     (Verify)      (Fallback)    (Meetings/Communities)
```

---

## Data Types & Flow

```
┌─────────────────────────────────────┐
│  useUserPlan Context                │
│  ─────────────────────────────────  │
│  userPlan:      "free"|"basic"|"pro"│
│  meetingCount:  number              │
│  communityCount: number             │
│  isLoading:     boolean             │
│  refreshPlan:   () => Promise<void> │
└─────────────────────────────────────┘
           ▲
           │
    ┌──────┴────────┐
    │               │
    ▼               ▼
Component 1    Component 2
Calls it...    Calls it...
```

---

## Before vs After Data Source

### BEFORE (Database-only)

```
Component
    │
    ▼
useUserPlan()
    │
    ▼
/api/user/plan
    │
    ▼
SELECT subscription 
FROM user
    │
    ▼
"basic"
    │
    ▼
Component shows basic tier
(NOT VERIFIED WITH PAYPAL)
```

### AFTER (PayPal-first)

```
Component
    │
    ▼
useUserPlan()
    │
    ▼
/api/paypal/subscription/check
    │
    ▼
Verify with PayPal API:
- Get access token
- Fetch subscription details
- Check status = ACTIVE
- Map plan ID to tier
    │
    ▼
tier: "basic"
(VERIFIED WITH PAYPAL)
    │
    ▼
Component shows basic tier
(VERIFIED & TRUSTED)
```

---

## Security Comparison

```
BEFORE (Database-only)                AFTER (PayPal-first)
──────────────────────────          ──────────────────────

User: "I'm pro"                     User: "I'm pro"
   │                                   │
   ▼                                   ▼
Database: pro                       PayPal API
   │                                   │
   ▼                                   ▼
✗ Trust database                    ✓ Verify subscription
                                       status = ACTIVE
Result:                             Result:
Can be manipulated                  Cannot be cheated
```

---

## Response Time Distribution

```
Endpoint Call: /api/paypal/subscription/check
│
├─ Authenticate session: ~5ms
├─ Database lookup (user): ~10ms
├─ PayPal get token: ~200ms
├─ PayPal fetch subscription: ~250ms
├─ Database count (meetings): ~5ms
├─ Database count (communities): ~5ms
└─ Response assembly: ~5ms
  ─────────────────────
  Total: ~480ms (typical)
```

---

## Tier Determination Logic

```
From PayPal API:
  subscription.status
       │
   ┌───┴─────────────────┐
   │                     │
ACTIVE              NOT ACTIVE
   │                     │
   ▼                     ▼
Get planId          Return "free"
   │
┌──┴──┐
│     │
▼     ▼
basic_plan_id = "basic"
pro_plan_id = "pro"
unknown = "basic" (safe default)
```

---

## Admin Testing Flow

```
Admin wants to test "pro" features
           │
           ▼
Set in database:
user.subscription = "pro"
(Direct SQL or admin panel)
           │
           ▼
Admin navigates to page
           │
           ▼
useUserPlan() called
           │
           ▼
/api/paypal/subscription/check
           │
           ▼
Check: if (user.isAdmin) ?
           │
      ┌────┴────┐
      │         │
     YES       NO
      │         │
      ▼         ▼
   Return   Check PayPal
   "pro"       API
   (DB)     (PayPal)
      │         │
      └────┬────┘
           │
           ▼
Admin sees "pro" tier
(Testing successful)
```

---

## Cache Strategy (Future Optimization)

```
Component requests tier
       │
       ▼
Check Redis cache
       │
   ┌───┴────┐
   │        │
 HIT       MISS
   │        │
   ▼        ▼
Return   Call PayPal
cached    API
tier      │
   │      ├─ Get response
   │      ├─ Store in Redis
   │      │  (TTL: 5 mins)
   │      └─ Return tier
   │      │
   └──┬───┘
      │
      ▼
Component receives tier
(Faster if cached)
```

---

## Error Codes & Meanings

```
200 OK
└─ Successful verification

401 Unauthorized
└─ User not authenticated

404 Not Found
└─ User not found in database

500 Server Error
└─ PayPal API error
└─ Database error
└─ Falls back to database value
```

---

## Success Indicators

✅ System working when:
```
Free User: Can't create resources
          → Sees upgrade wall
          
Basic User: Can create up to limit (3)
           → Sees create button
           → Sees count: "2 of 3"
           
Pro User: Can create unlimited
         → Sees create button
         → Sees count: "5 of Unlimited"

PayPal Change: Reflected within seconds
              → Cancellation enforced immediately
```

---

## Summary: The Complete Flow

```
1. User navigates to page
2. Page loads and calls useUserPlan()
3. Hook fetches /api/paypal/subscription/check
4. Endpoint verifies with PayPal API
5. PayPal returns subscription status
6. Endpoint maps status to tier
7. Endpoint returns tier + counts
8. Hook updates component state
9. Component renders based on verified tier
10. User sees correct UI (create/upgrade/unlimited)

All pages: create-community, create-meeting, owned-communities, 
           upgrade-wall, communities
All use: Same flow above
Result: PayPal-first verification ✅
```

