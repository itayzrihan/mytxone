# ✅ Registration Token Persistence Fix

## Problem
❌ **"Registration token not found or invalid"** error when Legitate calls back.

**Root Cause**: Registration tokens were stored **only in memory** using a `Map`. When your server restarts, rebuilds, or the process exits between:
1. User calling `/api/auth/setup-2fa` (token created)
2. Legitate calling back with the token (token is gone)

The token gets lost.

## Solution ✅
Migrated registration tokens from **in-memory storage to persistent database storage**.

### Changes Made

#### 1. **Database Schema** (`db/schema.ts`)
Added new `registrationToken` table:

```typescript
export const registrationToken = pgTable("RegistrationToken", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  userId: uuid("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  email: varchar("email", { length: 255 }).notNull(),
  serviceName: varchar("service_name", { length: 255 }).notNull(),
  callbackUrl: text("callback_url"),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  seedId: varchar("seed_id", { length: 255 }),
  totpSeed: text("totp_seed"), // Encrypted TOTP secret
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  completedAt: timestamp("completed_at"),
});
```

**Indexes for performance:**
- `token` - Fast lookup of tokens
- `user_id` - Find tokens by user
- `status` - Find pending/completed tokens

#### 2. **Migration File** (`lib/drizzle/0021_registration_token.sql`)
SQL to create the table in your database.

#### 3. **Registration Token Library** (`lib/registration-token.ts`)
Completely rewrote all functions to use the database:

**Before (in-memory):**
```typescript
const registrationTokenStore = new Map(); // ❌ Lost on restart
```

**After (database):**
```typescript
export async function createRegistrationToken(data) {
  const db = getDb();
  const result = await db.insert(registrationToken).values({...}).returning();
  // ✅ Persisted to database
}

export async function getRegistrationToken(token) {
  const db = getDb();
  const result = await db.select().from(registrationToken).where(eq(token, ...));
  // ✅ Retrieved from database
}

export async function updateRegistrationToken(token, updates) {
  const db = getDb();
  const result = await db.update(registrationToken).set(updates).where(eq(token, ...)).returning();
  // ✅ Updated in database
}
```

### Implementation Details

**Token Lifecycle:**
1. **Create** → `createRegistrationToken()` inserts to DB with status `pending`
2. **Retrieve** → `getRegistrationToken()` queries DB
3. **Update** → `updateRegistrationToken()` changes status to `completed` or `rejected`
4. **Validate** → `validateRegistrationToken()` checks DB + expiry + status
5. **Cleanup** → Expired tokens can be cleaned up with a scheduled job

**Expiry Handling:**
- Tokens expire after **24 hours** (configurable)
- When validating, if expired, status is set to `expired` in DB
- DB provides audit trail of token lifecycle

## How to Deploy

### Step 1: Run Migration
```bash
npm run build
```

This will:
- Generate updated types
- Apply the migration to your database (creates `RegistrationToken` table)

### Step 2: Test
1. Start your server: `npm run dev`
2. Try TOTP setup again
3. Legitate callback should now work even if server was restarted

### Step 3: Verify
Check your database for the new table:
```sql
SELECT * FROM "RegistrationToken";
```

## Benefits

| Aspect | Before | After |
|--------|--------|-------|
| **Durability** | Lost on restart ❌ | Persisted ✅ |
| **Server Restarts** | Breaks callbacks ❌ | Works fine ✅ |
| **Audit Trail** | None ❌ | Full history ✅ |
| **Multiple Servers** | Won't sync ❌ | Shared DB ✅ |
| **Scaling** | Doesn't scale ❌ | Horizontally scalable ✅ |

## Future Enhancements

Optional improvements:
1. **Cleanup Job** - Remove expired tokens older than X days
2. **Rate Limiting** - Limit failed attempts per user
3. **Notifications** - Alert on suspicious 2FA setup patterns
4. **Analytics** - Track 2FA adoption rates

## Troubleshooting

**Q: Still getting "token not found"?**
A: Ensure you ran `npm run build` to apply the migration.

**Q: Table doesn't exist?**
A: Check your database connection and run migration manually:
```bash
npm run build
```

**Q: Old tokens lingering in database?**
A: They'll expire automatically (24 hour TTL). Or add a cleanup script to remove tokens with status='expired' older than 7 days.

## Files Changed
- ✅ `db/schema.ts` - Added `registrationToken` table
- ✅ `lib/registration-token.ts` - Rewritten for database persistence
- ✅ `lib/drizzle/0021_registration_token.sql` - Migration SQL
