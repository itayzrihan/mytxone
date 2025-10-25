# 2FA System Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER'S DEVICE                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐         ┌──────────────────┐                │
│  │ Web Browser      │         │ Authenticator    │                │
│  │ /login or        │         │ App              │                │
│  │ /settings        │         │ (Google Auth,    │                │
│  │                  │         │  Authy, etc.)    │                │
│  └────────┬─────────┘         └──────────────────┘                │
│           │                            │                           │
│           │ [1] Enable 2FA             │ [6] Scan QR Code         │
│           │                            │                           │
└───────────┼────────────────────────────┼──────────────────────────┘
            │                            │
            │                            │
    ┌───────▼────────────────────────────▼──────────┐
    │  YOUR APP (mytx.one)                         │
    ├──────────────────────────────────────────────┤
    │                                              │
    │  [TwoFASetupModal]                           │
    │  Displays setup UI                           │
    │  │                                            │
    │  ├─ POST /api/auth/setup-2fa ──────┐         │
    │  │                                   │         │
    │  └─ Returns deepLink to Legitate    │         │
    │     (redirect to step [3])          │         │
    │                                      │         │
    │  [TwoFAVerificationForm]             │         │
    │  Displays TOTP input                 │         │
    │  │                                    │         │
    │  ├─ POST /api/auth/verify-2fa        │         │
    │  │  Body: { totpCode: "123456" }     │         │
    │  │  [Rate Limit: 5 attempts/15 min]  │         │
    │  │                                    │         │
    │  └─ Returns { success: true }        │         │
    │     or error response                 │         │
    │                                      │         │
    └──────────────────────────────────────┼────────┘
                                           │
            ┌──────────────────────────────▼────────┐
            │  LEGITATE (Simple TOTP Service)       │
            │  https://legitate.com                 │
            ├───────────────────────────────────────┤
            │                                       │
            │  [3] Display QR Code Setup UI         │
            │      (step [2] redirects here)        │
            │  │                                     │
            │  ├─ Generate TOTP Secret (Base32)    │
            │  │                                     │
            │  └─ [4] Return Secret via Callback    │
            │      GET /api/auth/totp-callback      │
            │      with secret parameter            │
            │                                       │
            └───────────────────────────────────────┘
                           │
                           │ [5] Callback with secret
                           │
         ┌─────────────────▼──────────────────┐
         │  /api/auth/totp-callback           │
         ├────────────────────────────────────┤
         │                                    │
         │  1. Validate timestamp             │
         │  2. Encrypt secret (AES-256-GCM)  │
         │  3. Store encrypted secret         │
         │  4. Update user.totpEnabled=true  │
         │                                    │
         └──────────┬───────────────────────┘
                    │
         ┌──────────▼──────────┐
         │ PostgreSQL Database │
         │                     │
         │ User Table:         │
         │ • totpSecret (enc)  │
         │ • totpEnabled       │
         │ • totpSeedId        │
         │ • totpSetupCompleted│
         │                     │
         └─────────────────────┘
```

## Login Flow with 2FA

```
┌──────────────────────────────────────────────────────────────────┐
│                        LOGIN PROCESS                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User enters email + password                                   │
│  │                                                               │
│  ├─ POST /api/auth/credentials                                  │
│  │                                                               │
│  ├─ NextAuth verifies password ✓                                │
│  │                                                               │
│  ├─ GET /api/auth/check-2fa?email=...                          │
│  │                                                               │
│  ├─ Is 2FA enabled? ─────────────┬──── NO ─────┐              │
│  │                                │              │              │
│  │ YES                            │              ▼              │
│  │                                │         Login complete ✓   │
│  │                                │              │              │
│  ▼                                │              ▼              │
│  Show TwoFAVerificationForm       │         Redirect to dash    │
│  │                                │                             │
│  ├─ User opens authenticator app  │                             │
│  ├─ Gets current 6-digit code     │                             │
│  ├─ Enters code in form            │                             │
│  │                                │                             │
│  ├─ POST /api/auth/verify-2fa     │                             │
│  │  Body: { totpCode: "123456" }  │                             │
│  │                                │                             │
│  ├─ Rate limit check ─────────────┬──── Limited ──┐            │
│  │  (5 attempts / 15 min)        │                │            │
│  │                               │                ▼            │
│  │  Decryption:                  │          Error: Too many    │
│  │  - Get encrypted secret       │          attempts            │
│  │  - Decrypt with env key       │          Wait 15 min         │
│  │  - Get plain base32 secret    │                             │
│  │                               │                             │
│  │  TOTP Verification:           │                             │
│  │  - Generate 6-digit codes for │                             │
│  │    current ±30 second window  │                             │
│  │  - Compare with user input    │                             │
│  │                               │                             │
│  ├─ Code matches? ──────────┬────── NO ──┐                    │
│  │                          │            │                    │
│  │ YES                      │            ▼                    │
│  │                          │      Error: Invalid code        │
│  │                          │      Try again                  │
│  │                          │                                 │
│  └──┬──────────────────────┘                                 │
│     │                                                         │
│     ▼                                                         │
│  Return { success: true }                                     │
│  │                                                            │
│  └─ Login complete ✓                                          │
│     Redirect to dashboard                                     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow: 2FA Setup to Verification

```
SETUP PHASE
═════════════════════════════════════════════════════════════════

1. User → "Enable 2FA"
2. POST /api/auth/setup-2fa
3. Server generates deep link with callback URL
4. Redirect to Legitate
5. User scans QR with Authenticator App
   └─ Stores secret locally on phone
6. Legitate generates secret
7. Legitate → GET /api/auth/totp-callback?secret=XXXXX&timestamp=XXX
8. Server encrypts secret
9. Server stores encrypted secret in database
10. User continues to app


VERIFICATION PHASE (At next login)
═════════════════════════════════════════════════════════════════

1. User enters email + password
2. Password verified ✓
3. Show TOTP input form
4. User opens Authenticator App
   └─ App generates current 6-digit code based on time
   └─ Code changes every 30 seconds
5. User enters code (e.g., "123456")
6. POST /api/auth/verify-2fa { totpCode: "123456" }
7. Server:
   ├─ Check rate limit (5 attempts / 15 min)
   ├─ Get encrypted secret from DB
   ├─ Decrypt with TOTP_ENCRYPTION_KEY
   ├─ Generate HOTP codes for current time window
   ├─ Compare generated codes with user input
   └─ Return success or error
8. If valid: Complete login ✓
9. If invalid: Show error, allow retry


KEY RELATIONSHIPS
═════════════════════════════════════════════════════════════════

Authenticator App          Legitate             Your Server
─────────────────          ────────             ────────────
   Has secret     ◄───── generates ────►    Encrypted in DB
    generates                                 Decrypted on verify
    6-digit codes                            Compared to user input
```

## Component Hierarchy

```
Login/Register Flow
    │
    ├─ AuthForm (existing)
    │  └─ Input email/password
    │
    ├─ TwoFASetupModal (new)
    │  ├─ Dialog component
    │  ├─ Enable button
    │  └─ Redirects to Legitate
    │
    └─ TwoFAVerificationForm (new)
       ├─ Card component
       ├─ Input field (6 digits)
       ├─ Verify button
       └─ Error display


Settings Page
    │
    └─ AccountTwoFASettings (to implement)
       ├─ Enable/Disable toggle
       ├─ Uses TwoFASetupModal
       └─ Calls disable-2fa endpoint
```

## API Endpoint Interactions

```
Setup 2FA
═════════════════════════════════════════════════════════════════

User Browser                Server                      Legitate
     │                        │                            │
     │  POST /api/auth/setup-2fa                          │
     ├───────────────────────►│                            │
     │                        │                            │
     │                        │ Generate deep link         │
     │                        │ with callback URL          │
     │                        │                            │
     │  { deepLink: "https://legitate.com/..." }         │
     │◄───────────────────────┤                            │
     │                        │                            │
     │ Redirect to deepLink   │                            │
     ├────────────────────────────────────────────────────►│
     │                        │                            │
     │ [User scans QR code]   │                            │
     │                        │                            │
     │                        │ GET /api/auth/totp-callback│
     │                        │ ?success=true&secret=...   │
     │                        │◄────────────────────────────┤
     │                        │                            │
     │                        │ Encrypt & store secret     │
     │                        │ Update user record         │
     │                        │                            │
     │ Redirect to dashboard  │                            │
     │◄────────────────────────────────────────────────────┘
     │                        │


Verify TOTP Code
═════════════════════════════════════════════════════════════════

User Browser                Server              Redis
     │                        │                   │
     │  POST /api/auth/verify-2fa                │
     │  Body: { totpCode: "123456" }            │
     ├───────────────────────►│                   │
     │                        │                   │
     │                        │ Check rate limit │
     │                        ├──────────────────►│
     │                        │◄──────────────────┤
     │                        │ (5 attempts/15min)│
     │                        │                   │
     │                        │ Get encrypted secret
     │                        │ from DB           │
     │                        │                   │
     │                        │ Decrypt secret    │
     │                        │ Verify TOTP code  │
     │                        │                   │
     │  { success: true }     │                   │
     │◄───────────────────────┤                   │
     │                        │                   │
```

## Database Schema

```
User Table
═══════════════════════════════════════════════════════════════

Column                  Type            Purpose
────────────────────    ──────────────  ─────────────────────
id                      UUID            Primary key
email                   VARCHAR(64)     User email
password                VARCHAR(64)     Hashed password
role                    VARCHAR(20)     'user' or 'admin'
subscription            VARCHAR(20)     'free', 'basic', 'pro'
created_at              TIMESTAMP       Account creation
updated_at              TIMESTAMP       Last update

NEW TOTP FIELDS:
totp_secret             TEXT            Encrypted TOTP secret
                                        Format: { encrypted, iv, authTag }
                                        Algorithm: AES-256-GCM
totp_enabled            BOOLEAN         Default: false
                                        true = 2FA is active
totp_seed_id            VARCHAR(255)    Reference ID from Legitate
totp_setup_completed    TIMESTAMP       When 2FA was completed
```

## Encryption Flow

```
Plain Secret (from Legitate)
      │
      │ AES-256-GCM Encryption
      ├─ Generate random IV (16 bytes)
      ├─ Generate auth tag
      └─ Encrypt with TOTP_ENCRYPTION_KEY
      │
      ▼
Encrypted Payload
{
  "encrypted": "a1b2c3d4...",  (hex string)
  "iv": "1a2b3c4d...",         (hex string)  
  "authTag": "e5f6g7h8..."     (hex string)
}
      │
      │ Store in Database
      ▼
totp_secret TEXT field
in User table


REVERSE FLOW (At Login)
═════════════════════════════════════════════════════════════════

Encrypted Payload from DB
      │
      │ Parse JSON
      │ Extract encrypted, iv, authTag
      │
      │ AES-256-GCM Decryption
      ├─ Use TOTP_ENCRYPTION_KEY
      ├─ Verify auth tag (integrity check)
      └─ Decrypt with IV
      │
      ▼
Plain Secret (base32)
      │
      │ Generate HOTP codes for ±30 seconds
      ├─ Decode base32 to binary
      ├─ Calculate HMAC-SHA1
      └─ Extract 6-digit code
      │
      ▼
Compare with user input
      │
      ├─ Match: ✓ Login allowed
      └─ No match: ✗ Show error, retry
```

## Deployment Architecture

```
Development                Production
═════════════════════     ═════════════════════════════════

localhost:3000            https://mytx.one
   │                          │
   ├─ .env.local              ├─ Environment variables
   │  ├─ TOTP_ENCRYPTION_KEY  │  ├─ TOTP_ENCRYPTION_KEY (prod)
   │  ├─ NEXTAUTH_URL         │  ├─ NEXTAUTH_URL
   │  └─ UPSTASH_REDIS_...    │  └─ UPSTASH_REDIS_...
   │                          │
   ├─ PostgreSQL (local)      ├─ PostgreSQL (managed)
   │  └─ Dev database         │  └─ Production database
   │                          │
   ├─ Upstash Redis           ├─ Upstash Redis
   │  └─ Dev instance         │  └─ Prod instance
   │                          │
   ├─ Legitate               ├─ Legitate
   │  └─ same service         │  └─ same service
   │                          │
   └─ Next.js dev server      └─ Next.js production
      @ 3000                     @ 3000 (behind reverse proxy)
```

## Security Layers

```
Layer 1: ENCRYPTION
═════════════════════════════════════════════════════════════════
AES-256-GCM
  ├─ 256-bit key (32 bytes)
  ├─ Galois/Counter Mode (GCM)
  ├─ Authentication tag (integrity verification)
  └─ Random IV (prevents pattern analysis)


Layer 2: RATE LIMITING
═════════════════════════════════════════════════════════════════
5 attempts per 15 minutes per user
  ├─ Redis sliding window
  ├─ Per user ID
  ├─ HTTP 429 on limit
  └─ Prevents brute force


Layer 3: TIMESTAMP VALIDATION
═════════════════════════════════════════════════════════════════
Callback timestamp must be within 60 seconds
  ├─ Prevents replay attacks
  ├─ Server-side validation
  ├─ Reject old callbacks
  └─ Secure random values


Layer 4: CODE VERIFICATION
═════════════════════════════════════════════════════════════════
HMAC-SHA1 with ±30 second window
  ├─ RFC 6238 standard
  ├─ 6-digit numeric codes
  ├─ 30-second time step
  ├─ Window = 3 time steps (current ± 30s)
  └─ Handles clock skew
```

---

This architecture provides enterprise-grade security with clear separation of concerns, proper encryption, rate limiting, and integration with Legitate for a seamless user experience.
