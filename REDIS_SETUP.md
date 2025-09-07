# Redis/KV Setup for Rate Limiting

This application uses Vercel KV (Redis) for rate limiting to prevent API abuse. The rate limiting is optional and will be automatically disabled if Redis credentials are not configured.

## Development Setup (Optional)

For local development, you can run the application without Redis. Rate limiting will be automatically disabled, and you'll see logs indicating this:

```
[Chat API] Redis credentials not found, rate limiting disabled for development
[External API] Redis credentials not found, rate limiting disabled
```

## Production Setup (Recommended)

For production deployments, especially on Vercel, you should set up Redis for proper rate limiting:

### 1. Create a Vercel KV Database

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project
3. Go to the "Storage" tab
4. Click "Create Database"
5. Select "KV" (Redis-compatible)
6. Choose your region and create the database

### 2. Configure Environment Variables

Vercel will automatically add these environment variables to your project:

```bash
KV_REST_API_URL=https://your-redis-url.upstash.io
KV_REST_API_TOKEN=your-redis-token
```

For local development, if you want to test with Redis:

1. Copy the values from your Vercel project settings
2. Add them to your `.env.local` file:

```bash
KV_REST_API_URL=https://your-redis-url.upstash.io
KV_REST_API_TOKEN=your-redis-token
```

### 3. Alternative: Direct Upstash Setup

If you're not using Vercel KV, you can create a Redis database directly with Upstash:

1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a new Redis database
3. Copy the REST API URL and Token
4. Set the environment variables as shown above

## Rate Limiting Configuration

The application implements two separate rate limits:

- **Chat API** (`/api/chat`): 200 requests per day per user
- **External API** (`/api/external/v1`): 200 requests per day per API key

These limits can be adjusted in the respective route files:

- `app/(chat)/api/chat/route.ts`
- `app/api/external/v1/route.ts`

## Troubleshooting

### Error: `getaddrinfo ENOTFOUND`

This error typically occurs when:

1. Redis credentials are invalid or expired
2. The Redis instance was deleted
3. Network connectivity issues

**Solution**: The application now gracefully handles this by disabling rate limiting when Redis is unavailable.

### Rate Limiting Not Working

If rate limiting isn't working:

1. Check that `KV_REST_API_URL` and `KV_REST_API_TOKEN` are set
2. Verify the Redis database is active
3. Check the application logs for Redis initialization messages

### Local Development Issues

For local development, simply leave the Redis environment variables unset. The application will work normally without rate limiting.
