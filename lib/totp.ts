import crypto from "crypto";

// Get encryption key from environment
const ENCRYPTION_KEY = process.env.TOTP_ENCRYPTION_KEY;
const ALGORITHM = "aes-256-gcm";

// Validate encryption key is set
if (!ENCRYPTION_KEY) {
  console.warn(
    "⚠️  TOTP_ENCRYPTION_KEY not set. 2FA will not work. Set it to a 32-byte hex string."
  );
}

/**
 * Encrypt a TOTP secret using AES-256-GCM
 * Returns encrypted string, IV, and auth tag as a JSON payload
 */
export function encryptSecret(secret: string): string {
  if (!ENCRYPTION_KEY) {
    throw new Error("TOTP_ENCRYPTION_KEY is not configured");
  }

  const key = Buffer.from(ENCRYPTION_KEY, "hex");
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(secret, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  // Return combined encrypted payload
  return JSON.stringify({
    encrypted,
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
  });
}

/**
 * Decrypt a TOTP secret
 */
export function decryptSecret(encryptedPayload: string): string {
  if (!ENCRYPTION_KEY) {
    throw new Error("TOTP_ENCRYPTION_KEY is not configured");
  }

  const key = Buffer.from(ENCRYPTION_KEY, "hex");
  const { encrypted, iv, authTag } = JSON.parse(encryptedPayload);

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(iv, "hex")
  );

  decipher.setAuthTag(Buffer.from(authTag, "hex"));

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * Verify a TOTP code against a secret
 * Simple HOTP/TOTP verification
 */
export function verifyTOTPCode(secret: string, token: string): boolean {
  try {
    // Decode base32 secret
    const secretBuffer = base32Decode(secret);

    // Get current and adjacent time steps
    const timeStep = 30; // TOTP time step in seconds
    const now = Math.floor(Date.now() / 1000);

    // Check current, previous, and next time windows (window=1)
    for (let i = -1; i <= 1; i++) {
      const counter = Math.floor((now + i * timeStep) / timeStep);
      const code = generateHOTPCode(secretBuffer, counter);

      if (code === token) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error verifying TOTP code:", error);
    return false;
  }
}

/**
 * Generate HOTP code for a given counter value
 */
function generateHOTPCode(secretBuffer: Buffer, counter: number): string {
  const hmac = crypto.createHmac("sha1", secretBuffer);
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigInt64BE(BigInt(counter));

  const digest = hmac.update(counterBuffer).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const code =
    (digest[offset] & 0x7f) << 24 |
    (digest[offset + 1] & 0xff) << 16 |
    (digest[offset + 2] & 0xff) << 8 |
    (digest[offset + 3] & 0xff);

  return (code % 100000000).toString().padStart(8, "0");
}

/**
 * Decode base32 string to buffer
 */
function base32Decode(str: string): Buffer {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const cleanStr = str.replace(/=/g, "").toUpperCase();
  const bits = cleanStr
    .split("")
    .map((c) => {
      const index = alphabet.indexOf(c);
      if (index === -1) throw new Error(`Invalid base32 character: ${c}`);
      return index.toString(2).padStart(5, "0");
    })
    .join("");

  const bytes = [];
  for (let i = 0; i < bits.length; i += 8) {
    bytes.push(parseInt(bits.substr(i, 8), 2));
  }

  return Buffer.from(bytes);
}

/**
 * Encode buffer to base32 string
 */
function base32Encode(buffer: Buffer): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const bits = buffer
    .reduce((acc, byte) => acc + byte.toString(2).padStart(8, "0"), "")
    .padEnd(Math.ceil(buffer.length * 8 / 5) * 5, "0");

  let result = "";
  for (let i = 0; i < bits.length; i += 5) {
    result += alphabet[parseInt(bits.substr(i, 5), 2)];
  }

  return result;
}

/**
 * Generate a TOTP secret for a user
 * Returns base32-encoded secret
 */
export function generateTOTPSecret(): string {
  // Generate 20 random bytes for the secret (RFC 4226 recommendation)
  const randomBytes = crypto.randomBytes(20);
  return base32Encode(randomBytes);
}

/**
 * Create deep link URL for Simple TOTP (Legitate)
 * Lets Simple TOTP generate the seed automatically (recommended)
 */
export function createTOTPDeepLink(
  email: string,
  callbackUrl: string,
  serviceName: string = "mytx.one"
): string {
  const params = new URLSearchParams({
    action: "add",
    service: serviceName,
    account: email,
    callback: callbackUrl,
  });

  return `https://legitate.com/dashboard/simple-totp?${params.toString()}`;
}

/**
 * Validate timestamp from callback to prevent replay attacks
 */
export function validateCallbackTimestamp(
  timestamp: string,
  maxAgeMsec: number = 60000
): boolean {
  try {
    const callbackTime = parseInt(timestamp);
    const now = Date.now();

    // Check if callback is within acceptable time window
    if (Math.abs(now - callbackTime) > maxAgeMsec) {
      console.warn("Callback timestamp too old");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error validating callback timestamp:", error);
    return false;
  }
}

/**
 * Hash recovery codes for storage (like passwords)
 */
export async function hashRecoveryCodes(
  codes: string[]
): Promise<string[]> {
  const bcrypt = await import("bcrypt-ts");

  const hashedCodes = await Promise.all(
    codes.map((code) => bcrypt.hash(code, 10))
  );

  return hashedCodes;
}

/**
 * Verify a recovery code against hashed codes
 */
export async function verifyRecoveryCode(
  code: string,
  hashedCodes: string[]
): Promise<number | null> {
  const bcrypt = await import("bcrypt-ts");

  for (let i = 0; i < hashedCodes.length; i++) {
    const isMatch = await bcrypt.compare(code, hashedCodes[i]);
    if (isMatch) {
      return i; // Return index of matched code
    }
  }

  return null;
}

/**
 * Generate random alphanumeric recovery codes
 */
export function generateRecoveryCodes(count: number = 10): string[] {
  const codes: string[] = [];

  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(6).toString("hex").toUpperCase();
    codes.push(code);
  }

  return codes;
}

/**
 * Get setup URL with deep link format for verification
 */
export function getTOTPSetupURL(
  baseUrl: string,
  email: string,
  serviceName: string = "mytx.one"
): string {
  const callbackUrl = `${baseUrl}/api/auth/totp-callback`;
  return createTOTPDeepLink(email, callbackUrl, serviceName);
}
