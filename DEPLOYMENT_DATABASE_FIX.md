# Deployment Database Connection Fix

## Issue

The deployment was failing during the Next.js build phase with the following error:

```
TypeError: Invalid URL
input: 'undefined?sslmode=require'

> Build error occurred
Error: Failed to collect page data for /api/custom-content-types
```

## Root Cause

Two database query files were initializing the PostgreSQL connection **at module load time** instead of **lazily on first use**:

1. **`db/custom-items-queries.ts`** (line 10):
   ```typescript
   let client = postgres(`${process.env.POSTGRES_URL!}?sslmode=require`);
   export let db = drizzle(client, { schema });
   ```

2. **`db/quote-queries.ts`** (lines 19-21):
   ```typescript
   const connectionString = process.env.POSTGRES_URL!;
   const pool = postgres(connectionString, { max: 1 });
   const db = drizzle(pool, { schema });
   ```

### Why This Caused Build Failures

During the Next.js production build process (`next build`):
- Next.js attempts to pre-render pages and collect page data
- When it imports API routes (like `/api/custom-content-types`), it loads the database query modules
- If environment variables are not set during build time (which is common in CI/CD), `process.env.POSTGRES_URL` is `undefined`
- The connection string becomes `"undefined?sslmode=require"`, which is an invalid URL
- This causes the build to fail before the app can even start

## Solution

Implemented **lazy database initialization** pattern (already used in `db/queries.ts`) for both files:

### Pattern Used

```typescript
// Lazy database initialization
let client: ReturnType<typeof postgres> | null = null;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getDb() {
  if (!dbInstance) {
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!dbUrl) {
      throw new Error("DATABASE_URL or POSTGRES_URL environment variable is not set");
    }
    client = postgres(`${dbUrl}?sslmode=require`);
    dbInstance = drizzle(client, { schema });
  }
  return dbInstance;
}

// Export a proxy that lazily initializes the db
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(target, prop) {
    return (getDb() as any)[prop];
  }
});
```

### Benefits

1. **Build-time safety**: Database connection is only created when actually used at runtime
2. **Environment flexibility**: Build process can complete without database credentials
3. **Runtime validation**: Clear error message if credentials are missing at runtime
4. **Consistency**: All database query files now use the same pattern

## Files Modified

1. ✅ `db/custom-items-queries.ts` - Fixed eager initialization
2. ✅ `db/quote-queries.ts` - Fixed eager initialization
3. ✅ `db/queries.ts` - Already using lazy initialization (no changes needed)
4. ✅ `db/definition-queries.ts` - Already using `getDb()` from queries.ts (no changes needed)
5. ✅ `db/protocol-queries.ts` - Already using `getDb()` from queries.ts (no changes needed)
6. ✅ `db/favorites-queries.ts` - Already using `getDb()` from queries.ts (no changes needed)

## Next Steps

1. **Commit and push** the changes to GitHub
2. **Redeploy** the application - the build should now succeed
3. **Verify** environment variables are properly set in your deployment platform (Dokploy):
   - `DATABASE_URL` or `POSTGRES_URL` should be set with your PostgreSQL connection string
   - Format: `postgresql://user:password@host:port/database?sslmode=require`

## Deployment Configuration Checklist

Ensure these environment variables are set in your Dokploy deployment:

- ✅ `DATABASE_URL` or `POSTGRES_URL` - PostgreSQL connection string
- ✅ `AUTH_SECRET` - NextAuth secret key
- ✅ `GOOGLE_GENERATIVE_AI_API_KEY` - Google AI API key
- ✅ Any other application-specific environment variables

## Testing Locally

To test the fix locally:

```powershell
# Remove environment variable temporarily
$env:POSTGRES_URL = $null

# Try to build
pnpm run build:production

# Build should succeed (might show warnings about missing Firebase config)
# Runtime errors only occur when database queries are actually executed
```

## Related Documentation

- See `DATABASE_DOCUMENTATION.md` for database schema and query patterns
- See `DEPLOYMENT_FIXES.md` for other deployment-related fixes
