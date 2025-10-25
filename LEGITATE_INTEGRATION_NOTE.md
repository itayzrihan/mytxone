# 📧 Message for Legitate (If Needed)

## TL;DR
✅ **No changes needed on Legitate side!**

Your callback URL remains:
```
http://localhost:3001/api/auth/totp-callback
```

---

## If Legitate Support Asks About Our Setup

### Response Template

> We've updated our TOTP callback flow for better UX. Here's what we're doing:
>
> 1. **Legitate calls** our endpoint at: `http://localhost:3001/api/auth/totp-callback`
> 2. **We process** the TOTP secret and encrypt it
> 3. **We redirect** to our confirmation page: `http://localhost:3001/auth/totp-confirmation`
> 4. **Users see** a beautiful confirmation screen and auto-login
>
> The callback URL stays the same, so no integration changes needed on your end.

---

## If They Ask What Parameters We Need

### Required Parameters from Legitate
✅ All the same as before:

```
GET /api/auth/totp-callback?
  success=true
  seed=HBRBFIPVKQJSFBKZVT5N6CSARVX3E6S5    (TOTP secret in Base32)
  seedId=68fd3c9e6a870bb837aaedb1          (unique seed ID)
  code=53185128                             (current 6-digit code)
  timestamp=1761426591031                  (Unix timestamp)
  regToken=reg_1761426585261_k7kurb92e8h  (our registration token)
```

**Nothing changes** - same format, same parameters.

---

## If They Ask About Our New Confirmation URL

### Response

> Our confirmation page (`/auth/totp-confirmation`) is internal. It's not something Legitate needs to know about. 
>
> You just need to POST/GET to `/api/auth/totp-callback` as usual. We handle the rest internally.

---

## Network Diagram (For Documentation)

```
┌─────────────────────────────────┐
│   User's Authenticator App      │
│      (Google Authenticator)     │
└────────────────┬────────────────┘
                 │ scans QR code
                 ▼
┌─────────────────────────────────┐
│     Legitate Platform           │
│   (Simple TOTP Service)         │
└────────────────┬────────────────┘
                 │ generates secret
                 │ calls callback
                 ▼
┌─────────────────────────────────┐
│  /api/auth/totp-callback        │
│  (validates & encrypts secret)  │
└────────────────┬────────────────┘
                 │ processes successfully
                 ▼
┌─────────────────────────────────┐
│ /auth/totp-confirmation         │
│  (beautiful UI page)            │
│  - Loading spinner              │
│  - Success message              │
│  - Auto-redirect to app         │
└─────────────────────────────────┘
```

---

## Callback URL Reference

### Production
```
https://mytx.one/api/auth/totp-callback
```

### Development
```
http://localhost:3001/api/auth/totp-callback
```

### Your Internal (No Need to Tell Legitate)
```
http://localhost:3001/auth/totp-confirmation
```

---

## Bottom Line

**Tell Legitate**: Nothing! ✅

Keep using the same callback URL. We've just improved what happens on our end after Legitate calls us.
