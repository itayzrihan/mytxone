# 2FA Registration Integration - Quick Reference

## 1. 3-Step Integration Flow

```
Your App          mytx.one            Simple TOTP
    │                │                      │
    ├─ Register User ─│                      │
    │                │                      │
    ├─ POST /setup-2fa ──────────────────┐  │
    │                │  (returns deepLink)   │
    │                └────────────────────┤  │
    │                                   │  │
    │◄─ deepLink (with regToken)◄───────┘  │
    │                                      │
    ├─ Redirect to deepLink ─────────────────►│
    │                                      │  │
    │                            User accepts│
    │                          Generate seed  │
    │                          Generate code  │
    │                                      │  │
    │◄─ Callback (with seed,code,regToken)◄──┤
    │                                      │  │
    ├─ Store encrypted seed                │  │
    ├─ Mark 2FA enabled                    │  │
    └─ Complete registration              │  │
```

## 2. Your App: Initiate 2FA Setup

### Request

```
POST https://mytx.one/api/auth/setup-2fa
Content-Type: application/json

{
  "email": "user@example.com",
  "token": "user@example.com",
  "callbackUrl": "https://your-app.com/auth/totp-callback"
}
```

### Response

```json
{
  "success": true,
  "deepLink": "https://legitate.com/dashboard/simple-totp?action=add&...",
  "registrationToken": "reg_1729892400000_abc123xyz"
}
```

### Code

```javascript
// JavaScript
const response = await fetch('https://mytx.one/api/auth/setup-2fa', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email,
    token: email,
    callbackUrl: 'https://your-app.com/auth/totp-callback'
  })
});

const data = await response.json();
window.location.href = data.deepLink; // Redirect to setup
```

## 3. Receive Callback from mytx.one

### Callback URL (GET request)

```
https://your-app.com/auth/totp-callback?
  success=true
  &regToken=reg_1729892400000_abc123xyz
  &seed=JBSWY3DPEBLW64TMMQ======
  &code=123456
  &seedId=seed_123
  &timestamp=1729892400000
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `success` | bool | Setup successful? |
| `regToken` | string | Token to identify user |
| `seed` | string | Base32 TOTP secret |
| `code` | string | Current 6-digit code |
| `seedId` | string | Internal ID |
| `timestamp` | number | Unix milliseconds |

### Handle Callback

```javascript
// Node.js/Express
app.get('/auth/totp-callback', async (req, res) => {
  const { success, regToken, seed, code } = req.query;

  if (success === 'true' && seed && code) {
    // 1. Identify user by regToken (lookup in your DB)
    const user = await findUserByRegToken(regToken);

    // 2. Verify TOTP code (check it matches seed)
    const speakeasy = require('speakeasy');
    if (!speakeasy.totp.verify({
      secret: seed,
      encoding: 'base32',
      token: code,
      window: 1
    })) {
      return res.status(400).json({ error: 'Code invalid' });
    }

    // 3. Encrypt and store seed
    const encrypted = encryptSeed(seed);
    await User.update(user.id, {
      totpSecret: encrypted,
      totpEnabled: true
    });

    // 4. Complete registration
    res.redirect(`/dashboard?welcome=true`);
  } else {
    // User rejected
    res.redirect(`/register?error=Rejected`);
  }
});
```

## 4. Encrypt TOTP Secret

### Node.js

```javascript
const crypto = require('crypto');

function encryptSeed(seed) {
  const key = Buffer.from(process.env.TOTP_ENCRYPTION_KEY, 'hex');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  let encrypted = cipher.update(seed, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
}
```

### Python

```python
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
import os

def encrypt_seed(seed):
    key = bytes.fromhex(os.getenv('TOTP_ENCRYPTION_KEY'))
    iv = os.urandom(16)
    
    cipher = Cipher(algorithms.AES(key), modes.GCM(iv))
    encryptor = cipher.encryptor()
    encrypted = encryptor.update(seed.encode()) + encryptor.finalize()
    tag = encryptor.tag
    
    return f"{iv.hex()}:{tag.hex()}:{encrypted.hex()}"
```

## 5. Verify TOTP Code

```javascript
const speakeasy = require('speakeasy');

function verifyCode(seed, code) {
  return speakeasy.totp.verify({
    secret: seed,
    encoding: 'base32',
    token: code,
    window: 1  // ±30 seconds
  });
}
```

## 6. Setup Environment

```bash
# Generate encryption key
openssl rand -hex 32

# Add to .env
TOTP_ENCRYPTION_KEY=063cab6192d73e79ecbcf487f747b2a99d5b69fc6a255541359ccd7f3a896b6a
NEXTAUTH_URL=https://your-app.com
```

## 7. Security Checklist

- ✅ Use HTTPS for callbacks
- ✅ Encrypt seeds before storing
- ✅ Verify TOTP code against seed
- ✅ Validate registration token
- ✅ Rate limit callback endpoint
- ✅ Log all 2FA events
- ✅ Backup encryption key securely

## 8. Test Registration Token Flow

```bash
# 1. Initiate setup
curl -X POST https://mytx.one/api/auth/setup-2fa \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","token":"test@example.com"}'

# 2. Get deepLink from response, redirect user

# 3. After user completes, test callback
curl "https://your-app.com/auth/totp-callback?\
success=true&\
regToken=reg_1729892400000_xyz&\
seed=JBSWY3DPEBLW64TMMQ======&\
code=123456&\
seedId=seed_123&\
timestamp=$(date +%s)000"
```

## 9. Error Handling

```javascript
// User rejected
if (success !== 'true') {
  // Redirect to error page
  res.redirect(`/register?error=User rejected`);
}

// Invalid token
if (!validateToken(regToken)) {
  res.status(400).json({ error: 'Invalid token' });
}

// Code mismatch
if (!verifyCode(seed, code)) {
  res.status(400).json({ error: 'Code mismatch' });
}

// Missing data
if (!seed || !code) {
  res.status(400).json({ error: 'Incomplete data' });
}
```

## 10. Common Issues

| Issue | Fix |
|-------|-----|
| "Invalid token" | Token expired after 24h, restart |
| "Code mismatch" | Seed doesn't match code, verify encryption |
| "Callback not received" | Check HTTPS, CORS, firewall |
| "User not found" | Verify email before calling setup-2fa |
| "Seed verification failed" | Use same encryption key everywhere |

## Architecture

```
Your Backend:
├─ /api/register          → Create user
├─ /api/setup-2fa         → Call mytx.one endpoint
└─ /auth/totp-callback    → Receive completion

mytx.one:
├─ /api/auth/setup-2fa    → Generate regToken + deepLink
└─ /api/auth/totp-callback → Store seed + redirect to callback

Simple TOTP (Legitate):
├─ Dashboard              → Show setup UI
└─ Callback Handler       → Redirect to mytx.one callback

User Flow:
1. Create account on your app
2. Redirected to Simple TOTP for 2FA
3. Complete setup on Simple TOTP
4. Redirected back to your app callback
5. Registration complete
```

## Response Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Setup initiated successfully | Redirect user |
| 400 | Invalid parameters | Fix request |
| 401 | Authentication failed | Re-authenticate |
| 404 | User not found | Register first |
| 429 | Rate limited | Wait and retry |
| 500 | Server error | Contact support |

## Deep Link Format

```
https://legitate.com/dashboard/simple-totp?
  action=add                              (always "add")
  &service=mytx.one                       (your app name)
  &account=user@example.com               (user email)
  &callback=https://mytx.one/callback     (mytx.one callback)
  &regToken=reg_1729892400000_xyz        (your registration token)
```

---

## Reference Links

- **Full Guide**: See `THIRD_PARTY_INTEGRATION_GUIDE.md`
- **Setup-2FA Endpoint**: `POST /api/auth/setup-2fa`
- **Callback Endpoint**: `GET /api/auth/totp-callback`
- **Registration Token**: Format `reg_TIMESTAMP_RANDOM`
- **Encryption**: AES-256-GCM

---

**Version**: 1.0  
**Last Updated**: October 25, 2025
