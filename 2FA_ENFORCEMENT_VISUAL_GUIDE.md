# 2FA Login Enforcement - Visual Flow Diagrams

## Flow 1: Registration (Already Implemented)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         REGISTRATION FLOW                            │
└─────────────────────────────────────────────────────────────────────┘

    User
     │
     │ Visits /register
     ▼
┌──────────────────┐
│  Register Page   │
│  Enter username  │
│  Enter password  │
│  Enter profile   │
└────────┬─────────┘
         │ Click "Sign Up"
         ▼
┌──────────────────┐
│  Backend Action  │
│  ✓ Validate data │
│  ✓ Create user   │
│  ✓ NO session    │
└────────┬─────────┘
         │ Return status: "success"
         ▼
┌──────────────────┐
│  Frontend        │
│  Show 2FA Modal  │
│  🔒 MANDATORY    │
│  Cannot close    │
└────────┬─────────┘
         │ User clicks "Enable 2FA"
         ▼
┌──────────────────┐
│  New Window      │
│  → Legitate.com  │
│  Show QR code    │
└────────┬─────────┘
         │ User scans with app
         ▼
┌──────────────────┐
│  Callback        │
│  /totp-callback  │
│  ✓ Store secret  │
│  ✓ Encrypt data  │
│  ✓ Set enabled   │
└────────┬─────────┘
         │ Redirect
         ▼
┌──────────────────┐
│  Confirmation    │
│  /totp-confirm   │
│  ✓ Success page  │
└────────┬─────────┘
         │ Redirect to /login
         ▼
┌──────────────────┐
│  Login Page      │
│  User must login │
│  with 2FA code   │
└──────────────────┘
```

---

## Flow 2: Login WITHOUT 2FA (NEW - Enforced)

```
┌─────────────────────────────────────────────────────────────────────┐
│              LOGIN WITHOUT 2FA - FORCED SETUP                        │
└─────────────────────────────────────────────────────────────────────┘

    User (has account, NO 2FA)
     │
     │ Visits /login
     ▼
┌──────────────────┐
│  Login Page      │
│  Enter username  │
│  Enter password  │
└────────┬─────────┘
         │ Click "Sign In"
         ▼
┌──────────────────┐
│  Backend Action  │
│  ✓ Validate cred │
│  ✓ Check 2FA     │
│  ❌ NOT enabled  │
└────────┬─────────┘
         │ totpEnabled = false
         ▼
┌──────────────────┐
│  Backend Action  │
│  ✓ Sign in user  │
│  ✓ Create session│
│  Return status:  │
│  "2fa_required"  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Frontend        │
│  Detect status   │
│  Redirect to     │
│  /enable-2fa     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Enable-2FA Page │
│  ✓ Load session  │
│  ✓ Get email     │
│  Show 2FA Modal  │
│  🔒 MANDATORY    │
│  Cannot close    │
└────────┬─────────┘
         │ User clicks "Enable 2FA"
         ▼
┌──────────────────┐
│  New Window      │
│  → Legitate.com  │
│  Show QR code    │
└────────┬─────────┘
         │ User scans with app
         ▼
┌──────────────────┐
│  Callback        │
│  /totp-callback  │
│  ✓ Store secret  │
│  ✓ Encrypt data  │
│  ✓ Set enabled   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Enable-2FA Page │
│  ⏳ Polling...   │
│  Check every 2s  │
└────────┬─────────┘
         │ Detect totpEnabled = true
         ▼
┌──────────────────┐
│  Redirect Home   │
│  ✓ Full reload   │
│  ✓ Update session│
│  ✓ Access granted│
└──────────────────┘
```

---

## Flow 3: Login WITH 2FA (Normal Flow)

```
┌─────────────────────────────────────────────────────────────────────┐
│                LOGIN WITH 2FA - NORMAL FLOW                          │
└─────────────────────────────────────────────────────────────────────┘

    User (has account, HAS 2FA)
     │
     │ Visits /login
     ▼
┌──────────────────┐
│  Login Page      │
│  Enter username  │
│  Enter password  │
└────────┬─────────┘
         │ Click "Sign In"
         ▼
┌──────────────────┐
│  Backend Action  │
│  ✓ Validate cred │
│  ✓ Check 2FA     │
│  ✅ IS enabled   │
└────────┬─────────┘
         │ totpEnabled = true
         ▼
┌──────────────────┐
│  Backend Action  │
│  ❌ NO sign in   │
│  Return status:  │
│  "2fa_required"  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Frontend        │
│  Show 2FA input  │
│  Enter 8-digit   │
│  code from app   │
└────────┬─────────┘
         │ User enters code
         ▼
┌──────────────────┐
│  Backend API     │
│  verify-2fa-int  │
│  ✓ Check code    │
│  ✓ Rate limit    │
└────────┬─────────┘
         │ Code valid
         ▼
┌──────────────────┐
│  Backend API     │
│  signin-with-2fa │
│  ✓ Create session│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Redirect Home   │
│  ✓ Access granted│
└──────────────────┘
```

---

## Flow 4: TwoFAGuard Protection (Always Active)

```
┌─────────────────────────────────────────────────────────────────────┐
│              2FA GUARD - PROTECTION LAYER                            │
└─────────────────────────────────────────────────────────────────────┘

    User navigates to ANY page
     │
     ▼
┌──────────────────┐
│  TwoFAGuard      │
│  Loads on every  │
│  page in app     │
└────────┬─────────┘
         │
         ▼
     Excluded path?
    (/login, /register, /enable-2fa, /api/*)
         │
    ┌────┴────┐
    │         │
   YES       NO
    │         │
    │         ▼
    │    Check session
    │         │
    │    ┌────┴────┐
    │    │         │
    │   Auth?    Not auth
    │    │         │
    │    │         └──► Allow (NextAuth handles)
    │    │
    │    ▼
    │  Call /api/auth/check-2fa-status
    │    │
    │    ▼
    │  totpEnabled?
    │    │
    │    ┌────┴────┐
    │    │         │
    │   YES       NO
    │    │         │
    │    │         ▼
    │    │    🚨 Redirect to /enable-2fa
    │    │
    │    ▼
    └──► Allow access
         │
         ▼
    Render page
```

---

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      COMPONENT HIERARCHY                             │
└─────────────────────────────────────────────────────────────────────┘

app/layout.tsx
  └─ SessionProvider
      └─ ThemeProvider
          └─ AdminProvider
              └─ UserPlanProvider
                  └─ AuthWrapper
                      └─ AuthProvider
                          └─ TwoFAGuard ⭐ NEW
                              │
                              ├─ Check session
                              ├─ Check excluded paths
                              ├─ Call check-2fa-status API
                              └─ Redirect if needed
                              │
                              └─ {children} (all app pages)
```

---

## File Interaction Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FILE INTERACTION MAP                              │
└─────────────────────────────────────────────────────────────────────┘

USER LOGIN
    │
    ▼
app/(auth)/login/page.tsx
    │
    ├─ Calls: login() action
    │   │
    │   ▼
    │   app/(auth)/actions.ts
    │   │
    │   ├─ Query: getUser()
    │   │   └─ db/queries.ts
    │   │
    │   ├─ Check: user.totpEnabled
    │   │
    │   └─ Return: status
    │
    ├─ If status = "2fa_setup_required"
    │   │
    │   └─ Redirect to: /enable-2fa
    │
    └─ If status = "2fa_required"
        │
        └─ Show: TwoFAVerificationForm


/enable-2fa PAGE
    │
    ▼
app/(auth)/enable-2fa/page.tsx
    │
    ├─ Fetch session email
    │   └─ /api/auth/session
    │
    ├─ Render: TwoFASetupModal (mandatory)
    │   └─ components/custom/two-fa-setup-modal.tsx
    │       │
    │       └─ Calls: /api/auth/setup-2fa
    │           │
    │           └─ Opens: Legitate.com
    │
    └─ Poll: /api/auth/check-2fa-status
        │
        └─ When enabled: Redirect to /


2FA GUARD
    │
    ▼
components/custom/two-fa-guard.tsx
    │
    ├─ useSession() - Get current session
    │
    ├─ Check excluded paths
    │
    ├─ If authenticated:
    │   │
    │   └─ Call: /api/auth/check-2fa-status
    │       │
    │       └─ app/api/auth/check-2fa-status/route.ts
    │           │
    │           ├─ Get session
    │           ├─ Query: getUser()
    │           └─ Return: { totpEnabled }
    │
    └─ If !totpEnabled:
        │
        └─ Redirect to: /enable-2fa
```

---

## State Management Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                     STATE MANAGEMENT                                 │
└─────────────────────────────────────────────────────────────────────┘

DATABASE STATE (user table)
    │
    ├─ totpEnabled: boolean ⭐ KEY FIELD
    ├─ totpSecret: text (encrypted)
    ├─ totpSeedId: text
    └─ totpSetupCompleted: timestamp


BACKEND STATE (actions.ts)
    │
    └─ LoginActionState
        │
        ├─ status: "2fa_setup_required" ⭐ NEW
        ├─ status: "2fa_required"
        ├─ status: "2fa_verified"
        ├─ status: "success"
        ├─ status: "failed"
        └─ status: "invalid_data"


FRONTEND STATE (components)
    │
    ├─ login/page.tsx
    │   ├─ show2FA: boolean
    │   └─ totpSeedId: string | null
    │
    ├─ enable-2fa/page.tsx
    │   ├─ userEmail: string
    │   ├─ isLoading: boolean
    │   └─ isPolling: boolean
    │
    └─ two-fa-guard.tsx
        ├─ isChecking: boolean
        └─ userHas2FA: boolean | null


SESSION STATE (NextAuth)
    │
    ├─ user.id
    ├─ user.email
    └─ user.name
```

---

## API Endpoints Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        API ENDPOINTS                                 │
└─────────────────────────────────────────────────────────────────────┘

Authentication Required:
    ✅ /api/auth/check-2fa-status [GET]
       └─ Returns: { totpEnabled: boolean }

    ✅ /api/auth/setup-2fa [POST]
       └─ Returns: { deepLink: "https://..." }

    ✅ /api/auth/verify-2fa [POST]
       └─ Body: { totpCode }
       └─ Returns: { success: boolean }

No Authentication (Login Flow):
    ❌ /api/auth/verify-2fa-internal [POST]
       └─ Body: { email, totpCode }
       └─ Returns: { success: boolean }

    ❌ /api/auth/signin-with-2fa [POST]
       └─ Body: { email, password }
       └─ Creates session

Callbacks (Special):
    ⚠️ /api/auth/totp-callback [GET]
       └─ Params: success, seed, seedId, code, regToken
       └─ Stores encrypted secret

    ⚠️ /api/auth/totp-confirmation [POST]
       └─ Body: { regToken, seed, seedId, code }
       └─ Finalizes setup
```

---

## Decision Tree

```
┌─────────────────────────────────────────────────────────────────────┐
│                      DECISION TREE                                   │
└─────────────────────────────────────────────────────────────────────┘

User attempts login
    │
    ▼
Is user in database?
    │
    ├─ NO → Return "failed"
    │
    └─ YES
        │
        ▼
    Is totpEnabled = true?
        │
        ├─ NO
        │   │
        │   ▼
        │   Sign in user (create session)
        │   │
        │   ▼
        │   Return status: "2fa_setup_required"
        │   │
        │   ▼
        │   Frontend redirects to /enable-2fa
        │   │
        │   ▼
        │   Show mandatory 2FA modal
        │   │
        │   ▼
        │   User completes setup
        │   │
        │   ▼
        │   Set totpEnabled = true
        │   │
        │   ▼
        │   Redirect to home
        │   │
        │   ▼
        │   ✅ ACCESS GRANTED
        │
        └─ YES
            │
            ▼
            Return status: "2fa_required"
            │
            ▼
            Show 2FA code input
            │
            ▼
            User enters code
            │
            ▼
            Verify code
            │
            ├─ Invalid → Show error
            │
            └─ Valid
                │
                ▼
                Create session
                │
                ▼
                ✅ ACCESS GRANTED
```

---

## Security Layers

```
┌─────────────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                                 │
└─────────────────────────────────────────────────────────────────────┘

Layer 1: Backend Validation
    ├─ Check credentials
    ├─ Verify totpEnabled status
    └─ Enforce 2FA requirement

Layer 2: Frontend Guard (TwoFAGuard)
    ├─ Check on every page load
    ├─ Redirect if !totpEnabled
    └─ Prevent manual bypass

Layer 3: Session Management
    ├─ No session until 2FA complete
    ├─ (Exception: /enable-2fa needs session)
    └─ Session includes verified email

Layer 4: API Rate Limiting
    ├─ 5 attempts per 15 min
    ├─ Per user/email
    └─ Prevent brute force

Layer 5: Encryption
    ├─ AES-256-GCM
    ├─ Secrets never in plaintext
    └─ Decrypt only during verification

Layer 6: Modal Lock
    ├─ Cannot close
    ├─ Cannot bypass
    └─ Must complete setup
```

---

## Timeline: User Journey

```
┌─────────────────────────────────────────────────────────────────────┐
│                    USER JOURNEY TIMELINE                             │
└─────────────────────────────────────────────────────────────────────┘

NEW USER (Registration):
    T+0s    Register account
    T+1s    See 2FA modal (mandatory)
    T+5s    Click "Enable 2FA"
    T+6s    Legitate window opens
    T+15s   Scan QR code
    T+20s   Setup complete
    T+21s   Redirect to confirmation
    T+23s   Redirect to login
    T+25s   Login with 2FA code
    T+30s   ✅ Access granted


EXISTING USER WITHOUT 2FA (Login):
    T+0s    Enter credentials
    T+1s    Backend checks: !totpEnabled
    T+2s    Session created
    T+3s    Redirected to /enable-2fa
    T+4s    See 2FA modal (mandatory)
    T+5s    Click "Enable 2FA"
    T+6s    Legitate window opens
    T+15s   Scan QR code
    T+20s   Setup complete
    T+22s   Page polling detects enabled
    T+23s   Redirect to home
    T+24s   ✅ Access granted


EXISTING USER WITH 2FA (Normal Login):
    T+0s    Enter credentials
    T+1s    Backend checks: totpEnabled ✅
    T+2s    Show 2FA code input
    T+5s    Enter 8-digit code
    T+6s    Code verified
    T+7s    Session created
    T+8s    ✅ Access granted
```

---

## Edge Cases Handled

```
┌─────────────────────────────────────────────────────────────────────┐
│                     EDGE CASES HANDLED                               │
└─────────────────────────────────────────────────────────────────────┘

1. User closes setup window
   └─ Still on /enable-2fa page
   └─ Can click "Enable 2FA" again
   └─ Cannot bypass (TwoFAGuard blocks)

2. User manually navigates to /
   └─ TwoFAGuard detects !totpEnabled
   └─ Redirects back to /enable-2fa
   └─ Cannot access any page

3. User clears cookies during setup
   └─ Session lost
   └─ Redirected to /login
   └─ Must login again
   └─ Setup process repeats

4. Setup fails/errors
   └─ User can retry
   └─ Error messages shown
   └─ Can click "Enable 2FA" again

5. Multiple tabs open
   └─ All tabs use same session
   └─ When 2FA enabled in one tab
   └─ Other tabs detect via polling
   └─ All tabs redirect to home

6. Slow network
   └─ Polling continues
   └─ Loading indicators shown
   └─ User waits for detection

7. User already has 2FA
   └─ Login shows code input
   └─ No redirect to /enable-2fa
   └─ Normal flow proceeds

8. API endpoint fails
   └─ Error logged to console
   └─ User sees error message
   └─ Can retry setup
```

This visual documentation provides clear diagrams of all flows and interactions in the 2FA enforcement system!
