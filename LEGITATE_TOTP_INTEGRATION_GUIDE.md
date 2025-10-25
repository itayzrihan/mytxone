# Complete Legitate TOTP Integration Guide

> **Last Updated:** October 26, 2025  
> **Author:** mytx.one Development Team  
> **Version:** 1.0.0

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture & Flow Diagrams](#architecture--flow-diagrams)
3. [Environment Setup](#environment-setup)
4. [Database Schema](#database-schema)
5. [Core Libraries & Utilities](#core-libraries--utilities)
6. [API Routes](#api-routes)
7. [Frontend Components](#frontend-components)
8. [Authentication Flow](#authentication-flow)
9. [Security Features](#security-features)
10. [Testing Guide](#testing-guide)
11. [Deployment Checklist](#deployment-checklist)
12. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This guide documents the complete implementation of **TOTP (Time-based One-Time Password)** two-factor authentication using **Legitate's Simple TOTP** service integrated into the mytx.one platform.

### Key Features

- ✅ **Mandatory 2FA** for all new registrations
- ✅ **Popup-based setup** (like PayPal/Google OAuth)
- ✅ **Dynamic code verification** with smart UI
- ✅ **Encrypted secret storage** (AES-256-GCM)
- ✅ **Rate limiting** (5 attempts per 15 minutes)
- ✅ **Registration token system** for tracking setups
- ✅ **TOTP standard compliance** (RFC 6238)
- ✅ **Beautiful confirmation pages**
- ✅ **Cross-domain callback support**

### Technology Stack

- **Backend:** Next.js 15 API Routes, TypeScript
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** NextAuth.js
- **2FA Provider:** Legitate Simple TOTP
- **Encryption:** AES-256-GCM (Node.js crypto)
- **Rate Limiting:** Redis (Upstash)
- **UI:** React, TailwindCSS, Radix UI

---

## 🏗️ Architecture & Flow Diagrams

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         mytx.one Platform                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │   Frontend   │◄────►│  API Routes  │◄────►│   Database   │  │
│  │  Components  │      │ (Next.js)    │      │ (PostgreSQL) │  │
│  └──────────────┘      └──────────────┘      └──────────────┘  │
│         │                      │                                 │
│         │                      │                                 │
│         ▼                      ▼                                 │
│  ┌──────────────┐      ┌──────────────┐                        │
│  │ Auth Modals  │      │  TOTP Utils  │                        │
│  │ & Forms      │      │  (lib/totp)  │                        │
│  └──────────────┘      └──────────────┘                        │
│                               │                                  │
└───────────────────────────────┼──────────────────────────────────┘
                                │
                                │ HTTPS
                                ▼
                    ┌──────────────────────┐
                    │  Legitate Platform   │
                    │  Simple TOTP Service │
                    └──────────────────────┘
```

### Registration Flow (2FA Setup)

```
┌─────────┐                 ┌─────────┐                 ┌──────────┐
│  User   │                 │ mytx.one│                 │ Legitate │
└────┬────┘                 └────┬────┘                 └────┬─────┘
     │                           │                           │
     │ 1. Register (email/pass)  │                           │
     ├──────────────────────────►│                           │
     │                           │                           │
     │ 2. Show 2FA Setup Modal   │                           │
     │◄──────────────────────────┤                           │
     │                           │                           │
     │ 3. Click "Enable 2FA"     │                           │
     ├──────────────────────────►│                           │
     │                           │                           │
     │                           │ 4. Generate RegToken      │
     │                           │    POST /api/auth/        │
     │                           │    setup-2fa              │
     │                           ├───────────┐               │
     │                           │           │               │
     │                           │◄──────────┘               │
     │                           │                           │
     │ 5. Return Deep Link       │                           │
     │◄──────────────────────────┤                           │
     │                           │                           │
     │ 6. Open Popup Window      │                           │
     │   (600x700px, centered)   │                           │
     ├───────────────────────────┼──────────────────────────►│
     │                           │                           │
     │                           │                           │ 7. Display QR
     │                           │                           │    & Secret
     │◄──────────────────────────┼───────────────────────────┤
     │                           │                           │
     │ 8. Scan with Authenticator│                           │
     │    (Google Auth, Authy)   │                           │
     │                           │                           │
     │ 9. Confirm Setup          │                           │
     ├───────────────────────────┼──────────────────────────►│
     │                           │                           │
     │                           │  10. Callback with Secret │
     │                           │◄──────────────────────────┤
     │                           │     GET /api/auth/        │
     │                           │     totp-callback         │
     │                           │     ?success=true&seed=XX │
     │                           ├───────────┐               │
     │                           │           │ 11. Encrypt   │
     │                           │           │     & Store   │
     │                           │◄──────────┘               │
     │                           │                           │
     │ 12. Redirect to           │                           │
     │     Confirmation Page     │                           │
     │◄──────────────────────────┤                           │
     │                           │                           │
     │ 13. Show Success ✅       │                           │
     │    Auto-redirect to Login │                           │
     │                           │                           │
```

### Login Flow (2FA Verification)

```
┌─────────┐                 ┌─────────┐                 ┌──────────┐
│  User   │                 │ mytx.one│                 │ Legitate │
└────┬────┘                 └────┬────┘                 └────┬─────┘
     │                           │                           │
     │ 1. Enter Email/Password   │                           │
     ├──────────────────────────►│                           │
     │                           │                           │
     │                           │ 2. Check if 2FA Enabled   │
     │                           ├───────────┐               │
     │                           │           │               │
     │                           │◄──────────┘               │
     │                           │                           │
     │ 3. Request 2FA Code       │                           │
     │◄──────────────────────────┤                           │
     │                           │                           │
     │ 4. Show "Get Code" Button │                           │
     │                           │                           │
     │ 5. Click "Get Code"       │                           │
     │   Opens Legitate Popup    │                           │
     ├───────────────────────────┼──────────────────────────►│
     │                           │                           │
     │                           │                           │ 6. Display
     │                           │                           │    Current Code
     │◄──────────────────────────┼───────────────────────────┤
     │                           │                           │
     │ 7. Copy Code (8 digits)   │                           │
     │                           │                           │
     │ 8. Paste Code in Form     │                           │
     │   (Button changes to      │                           │
     │    "Verify")              │                           │
     │                           │                           │
     │ 9. Click "Verify"         │                           │
     ├──────────────────────────►│                           │
     │                           │                           │
     │                           │ 10. Decrypt Secret        │
     │                           │     Verify TOTP Code      │
     │                           ├───────────┐               │
     │                           │           │               │
     │                           │◄──────────┘               │
     │                           │                           │
     │ 11. Create Session        │                           │
     │     Redirect to Dashboard │                           │
     │◄──────────────────────────┤                           │
     │                           │                           │
```

### Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    2FA Setup Data Flow                        │
└──────────────────────────────────────────────────────────────┘

User Registration
      │
      ▼
┌─────────────┐
│ Create User │  (email, hashed password)
│ in Database │
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│ Generate RegToken│  (reg_TIMESTAMP_RANDOM)
│ Store in DB      │  (userId, email, status: pending)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Build Deep Link  │  https://legitate.com/dashboard/simple-totp
│ with Parameters  │  ?action=add&service=mytx.one&account=email
│                  │  &callback=CALLBACK_URL&regToken=TOKEN
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ User Scans QR    │  Authenticator App (Google Auth, Authy)
│ in Legitate     │  Generates TOTP codes (8 digits, 30s expiry)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Legitate Callback│  GET /api/auth/totp-callback
│                  │  ?success=true&seed=BASE32_SECRET&seedId=ID
│                  │  &code=12345678&regToken=TOKEN&timestamp=TS
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Validate RegToken│  Check: exists, pending, not expired
│ Validate Time    │  Check: timestamp within 60s
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Encrypt Secret   │  AES-256-GCM with TOTP_ENCRYPTION_KEY
│ (seed)           │  Output: {encrypted, iv, authTag}
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Update User      │  totpSecret: encrypted_data
│ Table            │  totpEnabled: true
│                  │  totpSeedId: seedId
│                  │  totpSetupCompleted: NOW()
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Update RegToken  │  status: completed
│ Table            │  completedAt: NOW()
│                  │  seedId: seedId
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Redirect to      │  /auth/totp-confirmation
│ Confirmation Page│  Shows success UI & auto-redirects
└──────────────────┘
```

---

