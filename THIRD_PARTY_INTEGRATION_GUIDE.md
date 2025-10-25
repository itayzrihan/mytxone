# Third-Party 2FA Registration Integration Guide

**Version**: 1.0  
**Date**: October 25, 2025  
**Status**: Production Ready

---

## Overview

This guide explains how to integrate **mytx.one's 2FA registration system** for third-party applications. The integration uses registration tokens and deep linking to enable seamless 2FA setup with automatic callback to your external application.

### Key Features

✅ **Registration Tokens** - Track registrations across redirects  
✅ **Deep Linking** - Seamless TOTP setup experience  
✅ **Automatic Callbacks** - External apps receive completion status  
✅ **TOTP Code Delivery** - Get the current code for immediate verification  
✅ **Encrypted Secrets** - Secrets securely transmitted and stored  
✅ **Error Handling** - Comprehensive error reporting  

---

## Complete Integration Flow

```
┌──────────────────────┐
│ Third-Party App      │
│ User Registration    │
└──────────┬───────────┘
           │ (1) Create user account
           │ (2) Generate regToken
           ▼
┌──────────────────────────────────┐
│ Call POST /api/auth/setup-2fa    │
│ - email: user@example.com        │
│ - token: email                   │
│ - callbackUrl: your-app.com/...  │
└──────────┬───────────────────────┘
           │ (3) Returns deep link with regToken
           ▼
┌──────────────────────────────────┐
│ Redirect to Simple TOTP          │
│ Deep Link with regToken          │
│ User authenticates / creates acc │
│ Accepts TOTP setup               │
└──────────┬───────────────────────┘
           │ (4) Generate TOTP code & seed
           │ (5) Redirect to callback
           ▼
┌──────────────────────────────────┐
│ mytx.one Callback Handler        │
│ /api/auth/totp-callback          │
│ - Verifies regToken              │
│ - Stores encrypted seed          │
│ - Redirects to external callback  │
└──────────┬───────────────────────┘
           │ (6) Redirect to external app
           │ with all callback parameters
           ▼
┌──────────────────────────────────┐
│ Third-Party App Callback Handler │
│ Receives:                        │
│ - regToken (identifies user)     │
│ - seed (TOTP secret)             │
│ - code (6-digit TOTP code)       │
│ - seedId (reference)             │
│ Complete registration            │
└──────────────────────────────────┘
```

---

## Step 1: Create User Account

In your third-party application, create a user account:

```javascript
// Node.js / Express example
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  // Create user in your database
  const user = await User.create({
    email,
    password: hashPassword(password),
    totpEnabled: false, // Not yet enabled
  });

  res.json({
    userId: user.id,
    email: user.email,
  });
});
```

---

## Step 2: Call mytx.one Setup-2FA Endpoint

After creating the user, call mytx.one's setup endpoint to get a deep link:

### Endpoint

```
POST https://mytx.one/api/auth/setup-2fa
```

### Request Body

```json
{
  "email": "user@example.com",
  "token": "user@example.com",
  "callbackUrl": "https://your-app.com/auth/totp-callback"
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | ✅ Yes | User's email address |
| `token` | string | ✅ Yes | Verification token (currently use email for simplicity) |
| `callbackUrl` | string | ❌ No | Your callback URL (if not provided, uses mytx.one default) |

### Response

```json
{
  "success": true,
  "deepLink": "https://legitate.com/dashboard/simple-totp?action=add&service=mytx.one&account=user@example.com&callback=https://your-app.com/auth/totp-callback&regToken=reg_1729892400000_abc123xyz",
  "registrationToken": "reg_1729892400000_abc123xyz",
  "message": "Redirect to this URL to set up 2FA"
}
```

### Implementation Examples

#### JavaScript / Node.js

```javascript
async function initiate2FA(email, callbackUrl) {
  const response = await fetch('https://mytx.one/api/auth/setup-2fa', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      token: email, // Simple validation
      callbackUrl, // Your callback URL
    }),
  });

  const data = await response.json();

  if (data.success) {
    // Store the registration token (optional, for tracking)
    await saveRegistrationToken({
      userId: currentUser.id,
      token: data.registrationToken,
      createdAt: new Date(),
    });

    // Redirect user to setup 2FA
    window.location.href = data.deepLink;
  } else {
    console.error('Failed to initiate 2FA:', data.error);
  }
}

// Usage
initiate2FA('user@example.com', 'https://your-app.com/auth/totp-callback');
```

#### Python / Flask

```python
import requests

def initiate_2fa(email, callback_url):
    response = requests.post(
        'https://mytx.one/api/auth/setup-2fa',
        json={
            'email': email,
            'token': email,
            'callbackUrl': callback_url
        }
    )

    data = response.json()

    if data.get('success'):
        # Store registration token
        save_registration_token({
            'userId': current_user.id,
            'token': data['registrationToken'],
            'createdAt': datetime.now()
        })

        # Redirect
        return redirect(data['deepLink'])
    else:
        return {'error': data.get('error')}
```

#### Java / Spring Boot

```java
@RestController
@RequestMapping("/auth")
public class AuthController {

    @PostMapping("/initiate-2fa")
    public ResponseEntity<?> initiate2FA(
            @RequestParam String email,
            @RequestParam String callbackUrl) {
        
        Map<String, String> request = Map.of(
            "email", email,
            "token", email,
            "callbackUrl", callbackUrl
        );
        
        RestTemplate restTemplate = new RestTemplate();
        Map response = restTemplate.postForObject(
            "https://mytx.one/api/auth/setup-2fa",
            request,
            Map.class
        );
        
        if ((Boolean) response.get("success")) {
            // Store registration token
            saveRegistrationToken(email, (String) response.get("registrationToken"));
            
            // Redirect
            return ResponseEntity.status(302)
                .header("Location", (String) response.get("deepLink"))
                .build();
        }
        
        return ResponseEntity.badRequest().body(response);
    }
}
```

---

## Step 3: User Completes 2FA Setup

User is redirected to mytx.one's TOTP setup page where they:

1. Log in / create account on mytx.one
2. See your app name and user email
3. Accept or reject TOTP setup
4. If accepting, enter their master PIN
5. System generates TOTP seed
6. Automatically redirected to your callback

**No action needed from your app at this step** - all happens on mytx.one.

---

## Step 4: Receive Callback

Your callback endpoint receives a GET request with all setup data:

### Callback URL Format

```
GET https://your-app.com/auth/totp-callback?
  success=true
  &regToken=reg_1729892400000_abc123xyz
  &seedId=seed_123
  &seed=JBSWY3DPEBLW64TMMQ======
  &code=123456
  &timestamp=1729892400000
```

### Callback Parameters

| Parameter | Type | When | Description |
|-----------|------|------|-------------|
| `success` | boolean | Always | `true` if setup successful, `false` if rejected |
| `regToken` | string | Always | Your registration token - use to identify user |
| `seed` | string | Success | Base32-encoded TOTP secret - store encrypted |
| `code` | string | Success | Current 6-digit TOTP code (valid for ~30 seconds) |
| `seedId` | string | Success | Internal seed ID from mytx.one |
| `timestamp` | number | Always | Unix milliseconds for timestamp validation |
| `error` | string | Failure | Error message if rejected |

### Implementation Examples

#### JavaScript / Node.js

```javascript
const express = require('express');
const app = express();

app.get('/auth/totp-callback', async (req, res) => {
  const {
    success,
    regToken,
    seed,
    code,
    seedId,
    timestamp,
    error,
  } = req.query;

  try {
    // 1. Verify registration token matches a user
    const regRecord = await getRegistrationToken(regToken);
    if (!regRecord) {
      return res.status(400).json({ error: 'Invalid registration token' });
    }

    const userId = regRecord.userId;

    // 2. Check if setup was rejected
    if (success !== 'true') {
      console.log(`User ${userId} rejected 2FA setup: ${error}`);
      await cleanupFailedRegistration(userId);
      return res.redirect(`/register?error=${encodeURIComponent(error)}`);
    }

    // 3. Validate we have seed and code
    if (!seed || !code) {
      return res.status(400).json({ error: 'Missing seed or code' });
    }

    // 4. Verify TOTP code works (optional but recommended)
    const speakeasy = require('speakeasy');
    const isValid = speakeasy.totp.verify({
      secret: seed,
      encoding: 'base32',
      token: code,
      window: 1, // Allow ±30 seconds
    });

    if (!isValid) {
      console.warn(`TOTP code verification failed for user ${userId}`);
      return res.status(400).json({ error: 'TOTP code verification failed' });
    }

    // 5. Encrypt and store the TOTP seed
    const crypto = require('crypto');
    const key = process.env.TOTP_ENCRYPTION_KEY; // 32-byte hex string
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);

    let encrypted = cipher.update(seed, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    const encryptedSeed = `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;

    // 6. Update user with TOTP configuration
    await User.update(userId, {
      totpSecret: encryptedSeed,
      totpEnabled: true,
      totpSeedId: seedId,
      registrationComplete: true,
      updatedAt: new Date(),
    });

    // 7. Mark registration as successful
    await markRegistrationComplete(regToken);

    // 8. Send confirmation email
    await sendEmail({
      to: regRecord.email,
      subject: '2FA Setup Complete',
      template: 'totp_setup_complete',
    });

    // 9. Auto-login user (optional)
    const token = createAuthToken(userId);
    res.cookie('auth_token', token, { httpOnly: true, secure: true });

    // 10. Redirect to success page
    res.redirect(`/dashboard?welcome=true&totpCode=${code}`);
  } catch (error) {
    console.error('Error in TOTP callback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

#### Python / Flask

```python
from flask import request, redirect, jsonify
from datetime import datetime
import pyotp
import json

@app.route('/auth/totp-callback', methods=['GET'])
def totp_callback():
    success = request.args.get('success') == 'true'
    reg_token = request.args.get('regToken')
    seed = request.args.get('seed')
    code = request.args.get('code')
    seed_id = request.args.get('seedId')
    error = request.args.get('error')

    try:
        # 1. Verify registration token
        reg_record = get_registration_token(reg_token)
        if not reg_record:
            return jsonify({'error': 'Invalid registration token'}), 400

        user_id = reg_record['userId']

        # 2. Check if setup was rejected
        if not success:
            app.logger.info(f"User {user_id} rejected 2FA: {error}")
            cleanup_failed_registration(user_id)
            return redirect(f"/register?error={error}")

        # 3. Validate we have seed and code
        if not seed or not code:
            return jsonify({'error': 'Missing seed or code'}), 400

        # 4. Verify TOTP code works
        totp = pyotp.TOTP(seed)
        if not totp.verify(code):
            app.logger.warning(f"TOTP code verification failed for {user_id}")
            return jsonify({'error': 'TOTP code verification failed'}), 400

        # 5. Encrypt and store seed
        from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
        from cryptography.hazmat.backends import default_backend
        import os

        key = bytes.fromhex(os.getenv('TOTP_ENCRYPTION_KEY'))
        iv = os.urandom(16)

        cipher = Cipher(
            algorithms.AES(key),
            modes.GCM(iv),
            backend=default_backend()
        )
        encryptor = cipher.encryptor()
        encrypted = encryptor.update(seed.encode()) + encryptor.finalize()
        auth_tag = encryptor.tag

        encrypted_seed = f"{iv.hex()}:{auth_tag.hex()}:{encrypted.hex()}"

        # 6. Update user
        db.execute("""
            UPDATE users SET
                totp_secret = ?,
                totp_enabled = true,
                totp_seed_id = ?,
                registration_complete = true,
                updated_at = ?
            WHERE id = ?
        """, [encrypted_seed, seed_id, datetime.now(), user_id])

        # 7. Mark registration complete
        mark_registration_complete(reg_token)

        # 8. Send confirmation email
        send_email(
            to=reg_record['email'],
            subject='2FA Setup Complete',
            template='totp_setup_complete'
        )

        # 9. Auto-login
        auth_token = create_auth_token(user_id)
        response = redirect(f"/dashboard?welcome=true&totpCode={code}")
        response.set_cookie('auth_token', auth_token, httponly=True, secure=True)
        return response

    except Exception as e:
        app.logger.error(f"Error in TOTP callback: {e}")
        return jsonify({'error': 'Internal server error'}), 500
```

---

## Security Best Practices

### 1. Seed Encryption

Always encrypt the TOTP seed before storing:

```javascript
const crypto = require('crypto');

function encryptSeed(seed) {
  const key = Buffer.from(process.env.TOTP_ENCRYPTION_KEY, 'hex');
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(seed, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

function decryptSeed(encryptedData) {
  const [iv, authTag, encrypted] = encryptedData.split(':');
  const key = Buffer.from(process.env.TOTP_ENCRYPTION_KEY, 'hex');

  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(iv, 'hex')
  );

  decipher.setAuthTag(Buffer.from(authTag, 'hex'));

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
```

### 2. Token Validation

Validate registration tokens:

```javascript
function validateRegistrationToken(token) {
  // Check format: reg_TIMESTAMP_RANDOM
  if (!token.match(/^reg_\d+_[a-z0-9]+$/)) {
    return false;
  }

  // Check age (max 24 hours)
  const [, timestamp] = token.split('_');
  const age = Date.now() - parseInt(timestamp);
  const MAX_AGE = 24 * 60 * 60 * 1000;

  return age <= MAX_AGE;
}
```

### 3. TOTP Verification

Always verify TOTP code matches seed:

```javascript
const speakeasy = require('speakeasy');

function verifyTOTPCode(secret, token) {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1, // Allow ±30 seconds
  });
}
```

### 4. HTTPS Only

```javascript
// Middleware to enforce HTTPS
app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === 'production' &&
    req.header('x-forwarded-proto') !== 'https'
  ) {
    return res.status(400).json({ error: 'HTTPS required' });
  }
  next();
});
```

### 5. Rate Limiting

```javascript
const RateLimiter = require('express-rate-limit');

const callbackLimiter = new RateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: 'Too many callback attempts',
});

app.get('/auth/totp-callback', callbackLimiter, (req, res) => {
  // Callback handler
});
```

---

## Error Handling

### Common Scenarios

```javascript
// User rejected 2FA
if (success !== 'true') {
  return res.redirect(`/register?error=${encodeURIComponent(error)}`);
}

// Invalid registration token
if (!validateRegistrationToken(regToken)) {
  return res.status(400).json({ error: 'Invalid token' });
}

// Token expired (24+ hours)
if (!isTokenValid(regToken)) {
  return res.status(400).json({ error: 'Token expired' });
}

// TOTP code doesn't match
if (!verifyTOTPCode(seed, code)) {
  return res.status(400).json({ error: 'Code verification failed' });
}

// Missing required parameters
if (!seed || !code) {
  return res.status(400).json({ error: 'Incomplete callback data' });
}
```

---

## Testing & Validation

### Test Endpoints

#### 1. Initiate 2FA Setup

```bash
curl -X POST https://mytx.one/api/auth/setup-2fa \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "token": "test@example.com",
    "callbackUrl": "https://your-app.com/auth/totp-callback"
  }'
```

#### 2. Test Callback (Success)

```bash
curl "https://your-app.com/auth/totp-callback?\
success=true&\
regToken=reg_1729892400000_abc123xyz&\
seed=JBSWY3DPEBLW64TMMQ======&\
code=123456&\
seedId=seed_123&\
timestamp=$(date +%s)000"
```

#### 3. Test Callback (Rejection)

```bash
curl "https://your-app.com/auth/totp-callback?\
success=false&\
regToken=reg_1729892400000_abc123xyz&\
error=User+rejected"
```

---

## Environment Setup

### Required Environment Variables

```bash
# TOTP Encryption Key (32 bytes hex)
# Generate: openssl rand -hex 32
TOTP_ENCRYPTION_KEY=063cab6192d73e79ecbcf487f747b2a99d5b69fc6a255541359ccd7f3a896b6a

# Your app URL (for callback generation)
NEXTAUTH_URL=https://your-app.com

# Database
DATABASE_URL=postgresql://...
```

---

## Monitoring & Metrics

### Track These Events

```javascript
// Events to log
logEvent('2FA_INITIATED', { userId, email });
logEvent('2FA_ACCEPTED', { userId, seedId });
logEvent('2FA_REJECTED', { userId, reason: error });
logEvent('2FA_CODE_VERIFIED', { userId });
logEvent('2FA_COMPLETE', { userId });

// Metrics to track
metrics.setup_initiated_count++;
metrics.setup_completed_count++;
metrics.setup_rejected_count++;
metrics.code_verification_failed_count++;
```

---

## FAQ

### Q: How long is the registration token valid?
**A:** 24 hours. After that, the token expires and the user must restart the process.

### Q: Can I customize the TOTP seed?
**A:** Not currently. mytx.one generates it automatically. Future versions may support custom seeds.

### Q: What happens if the callback fails?
**A:** The TOTP setup will have been created in mytx.one but won't be linked in your app. User can retry or manually complete registration.

### Q: Can I use the same app for multiple users?
**A:** Yes! Each registration generates a unique token, so multiple concurrent setups are supported.

### Q: Is the TOTP code always valid?
**A:** No, TOTP codes are time-based and change every 30 seconds. The code in the callback is valid for ~30 seconds.

### Q: What if encryption key is lost?
**A:** You won't be able to decrypt stored seeds. Always backup encryption keys securely.

---

## Support

- **Documentation**: Check this guide
- **Examples**: See implementation examples above
- **Errors**: Check error messages and logs for details
- **Issues**: Contact support@mytx.one

---

## Changelog

### v1.0 (October 25, 2025)
- ✅ Initial release
- ✅ Registration token support
- ✅ Callback with TOTP code and seed
- ✅ Full encryption support
- ✅ Comprehensive implementation guide
