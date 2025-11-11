# PayPal Subscription Flow - Quick Reference

## Complete Flow Diagram

```
USER FLOW:
┌─────────────────────────────────────────────────────────────────┐
│ 1. User clicks "TRY FOR FREE"                                    │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. PayPal Modal opens with subscription form                     │
│    - Meeting/Community name field                               │
│    - PayPal button                                              │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. User fills in name and clicks PayPal button                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. PayPal popup appears for approval                            │
│    (User logs in and approves payment)                          │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. onApprove() callback triggered with subscriptionID           │
│    (Previous: just showed alert - BUG!)                         │
│    (Now: calls our API to verify and save - FIXED!)            │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. Frontend calls: POST /api/paypal/subscription                │
│    Body: { subscriptionId, planType }                           │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. Backend: Generate PayPal access token                        │
│    POST https://api.sandbox.paypal.com/v1/oauth2/token         │
│    Headers: Basic auth with client_id:client_secret            │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 8. Backend: Verify subscription with PayPal                     │
│    GET https://api.sandbox.paypal.com/v1/billing/subscriptions │
│    Response includes: status, planId, customId, etc.           │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 9. Check subscription status is ACTIVE                          │
│    If status != ACTIVE: Return error                            │
│    If status == ACTIVE: Proceed to save                         │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 10. Update database: Set user.subscription = 'basic' or 'pro'   │
│     UPDATE User SET subscription = planType                     │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 11. Return success response with subscription details           │
│     { success: true, subscription: {...} }                      │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 12. Frontend: Show success message                              │
│     alert("Subscription activated!")                            │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 13. Frontend: Close modal and reload page after 1.5 seconds     │
│     window.location.reload()                                    │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 14. Page reloads with new subscription status                   │
│     /api/user/plan now returns plan: 'basic'                   │
│     User can now create first meeting/community                 │
└─────────────────────────────────────────────────────────────────┘
```

## API Endpoints Summary

### ✅ POST /api/paypal/subscription
**Purpose**: Save and verify PayPal subscription

**Request**:
```json
{
  "subscriptionId": "I-WTSU02NUPY7M",
  "planType": "basic"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "subscription": {
    "id": "user-uuid",
    "email": "user@mytx.one",
    "plan": "basic",
    "paypalSubscriptionId": "I-WTSU02NUPY7M",
    "activatedAt": "2025-11-09T10:00:00Z"
  }
}
```

**Response (Error)**:
```json
{
  "error": "Subscription status is APPROVAL_PENDING. Please wait for PayPal to activate it.",
  "subscriptionId": "I-WTSU02NUPY7M",
  "status": "APPROVAL_PENDING"
}
```

### ✅ GET /api/paypal/subscription?subscriptionId=xxxxx
**Purpose**: Check PayPal subscription status

**Response**:
```json
{
  "subscriptionId": "I-WTSU02NUPY7M",
  "status": "ACTIVE",
  "planId": "P-1NS15766Y7070154NNEIQCAI",
  "customId": "user@mytx.one",
  "startTime": "2025-11-09T10:00:00Z",
  "nextBillingTime": "2025-12-09T10:00:00Z"
}
```

### ✅ GET /api/user/subscription
**Purpose**: Check current user's subscription in database

**Response**:
```json
{
  "subscription": "basic",
  "email": "user@mytx.one",
  "userId": "uuid-here",
  "fullName": "User Name",
  "isActive": true,
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-11-09T10:00:00Z"
}
```

### ✅ GET /api/user/plan
**Purpose**: Check user's plan and resource limits

**Response**:
```json
{
  "plan": "basic",
  "meetingCount": 2,
  "communityCount": 1
}
```

## Browser Console Commands

```javascript
// Check if subscription was saved to database
checkMySubscription()

// Check PayPal subscription status
checkPayPalSubscription('I-WTSU02NUPY7M')

// Manually trigger plan refresh
location.reload()
```

## Key Changes Made

| File | Change | Impact |
|------|--------|--------|
| `app/api/paypal/subscription/route.ts` | NEW | POST to verify & save, GET to check status |
| `components/custom/upgrade-plan-wall.tsx` | FIXED | onApprove now saves subscription |
| `app/api/user/subscription/route.ts` | ENHANCED | Returns more details |
| `lib/use-subscription.ts` | ENHANCED | Returns full user object |
| `app/mytx/create-*.tsx` | FIXED | Pass full user with email |

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success ✅ |
| 400 | Invalid input or subscription not ready |
| 401 | Not authenticated |
| 404 | User or subscription not found |
| 500 | Server error |

## When Subscription Becomes Active

PayPal subscriptions typically have this status lifecycle:

1. **APPROVAL_PENDING** → User hasn't approved yet (shouldn't happen if onApprove called)
2. **APPROVED** → User approved, payment authorized but not yet charged
3. **ACTIVE** → Subscription is active and billing ✅ (This is what we wait for)
4. **SUSPENDED** → Subscription was suspended
5. **CANCELLED** → User cancelled
6. **EXPIRED** → Subscription expired

We **only accept ACTIVE** status to prevent charging issues.
