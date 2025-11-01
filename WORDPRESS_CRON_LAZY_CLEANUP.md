# WordPress-Cron Style Cleanup (Lazy Cleanup)

## Overview

Temp files are cleaned up **on-demand** (like WordPress cron), not on a schedule. This is **much more efficient**:

**Traditional Approach:**
- ❌ Every 1 minute, server scans folder
- ❌ Every 1 minute, checks file ages
- ❌ Continuous resource usage
- ❌ 1440+ cleanup operations per day

**WordPress-Cron Approach (NEW):**
- ✅ Only clean up when someone uploads
- ✅ No scheduled background jobs
- ✅ Minimal resource usage
- ✅ Scales with usage, not time

---

## How It Works

### Timeline Example

```
14:00:00 - User 1 uploads video
         └─ Cleanup runs: "Check for old files"
            └─ No old files found
         └─ New file uploaded

14:00:05 - User 2 uploads video
         └─ Cleanup runs: "Check for old files"
            └─ No old files found
         └─ New file uploaded

14:05:10 - User 3 uploads video
         └─ Cleanup runs: "Check for old files"
            └─ Finds User 1's file (5 min 10 sec old)
            └─ DELETES User 1's file
         └─ New file uploaded

14:30:00 - Server running idle (NO uploads)
         └─ NO cleanup jobs run
         └─ Server not wasting resources ✅

15:00:00 - User 4 uploads video
         └─ Cleanup runs: "Check for old files"
            └─ Finds User 2's file (60 min old)
            └─ DELETES User 2's file
         └─ New file uploaded
```

---

## Code Flow

### When User Uploads Video

```
1. User uploads video
        ↓
2. API route receives request
        ↓
3. [NEW] Run cleanup of old files
        └─ Scan /public/tempfiles
        └─ Check each file's age
        └─ Delete files > 5 minutes old
        ↓
4. Upload new video file
        ↓
5. Return URL to user
        ↓
6. File will auto-delete when next person uploads (after 5 min)
```

### Cleanup Function

```typescript
// File: /lib/temp-file-cleanup.ts

export async function cleanupOldTempFiles() {
  const files = await readdir(TEMP_DIR);
  const now = Date.now();
  
  for (const file of files) {
    const stats = await stat(file);
    const fileAge = now - stats.mtimeMs;
    
    // Delete if older than 5 minutes
    if (fileAge > MAX_FILE_AGE_MS) {
      await unlink(file);
      console.log(`[TempFileCleanup] Deleted: ${file}`);
    }
  }
}
```

### Upload Route Integration

```typescript
// File: /app/api/social/upload-to-drive/route.ts

export async function POST(request: Request) {
  // ... validation ...
  
  try {
    // WordPress-cron style: Clean up old files before uploading new one
    await cleanupOldTempFiles();
    
    // Then upload new file
    // ...
  }
}
```

---

## Performance Comparison

| Metric | Traditional | WordPress-Cron |
|--------|-------------|-----------------|
| Cleanup frequency | Every 1 minute | Every upload |
| Uploads per day | 100 | 100 |
| Cleanup operations | 1440 | ~100 |
| **Reduction** | **1x** | **14x fewer** |
| | | **operations** |
| Disk I/O (1hr idle) | 60 scans | 0 scans |
| **Resource saved** | **None** | **High** |

**Example:** With 100 uploads/day:
- Traditional: 1440 unnecessary scans when nobody is uploading
- WordPress-Cron: 0 unnecessary scans ✅

---

## Console Output

### User Uploads Video

```
POST /api/social/upload-to-drive 200 in 1234ms
[FileUpload] Starting cleanup of old temp files...
[TempFileCleanup] Deleted old file: video-1730451234567.mp4 (301s old)
[TempFileCleanup] Cleaned up 1 old files
[FileUpload] File saved: video-1730451349123.mp4
```

### No Old Files Found

```
POST /api/social/upload-to-drive 200 in 456ms
[FileUpload] Starting cleanup of old temp files...
[FileUpload] File saved: video-1730451456789.mp4
```

### Server Idle (Nothing Happens)

```
[No activity - no cleanup operations]
[No disk I/O - server completely idle]
```

---

## Edge Cases

### Case 1: Multiple Uploads in Quick Succession

```
14:00:00 - User A uploads
         └─ Cleanup runs (no old files)
         └─ File A saved

14:00:01 - User B uploads
         └─ Cleanup runs (File A only 1 sec old, skip)
         └─ File B saved

14:00:02 - User C uploads
         └─ Cleanup runs (Files A, B only 2 sec old, skip)
         └─ File C saved
```

**Result:** ✅ Each file gets 5 full minutes before deletion

### Case 2: Server Idle for Hours

```
14:00:00 - User uploads, cleanup runs (no old files)

[Server idle for 4 hours]
[Zero cleanup operations]

18:00:00 - User uploads, cleanup runs
         └─ Original file is now 4 hours old
         └─ Way older than 5 minutes → DELETE ✅
```

**Result:** ✅ Old files eventually cleaned up, no wasted resources

### Case 3: No Uploads All Day

```
[Server running]
[No uploads all day]
[No cleanup operations]
[Server using minimal resources]
```

**Result:** ✅ Server completely idle, zero wasted cleanup ops

---

## File Lifecycle

```
14:00:00
├─ User uploads video-1730451234567.mp4
├─ File saved to: /public/tempfiles/video-1730451234567.mp4
└─ Status: ACTIVE

14:00:01 to 14:05:00
├─ File exists and accessible
├─ Can be downloaded from: http://localhost:3000/tempfiles/video-1730451234567.mp4
├─ n8n can download it for posting
└─ Status: ACTIVE

14:05:00+
├─ File is >= 5 minutes old
├─ Will be deleted on next upload attempt
└─ Status: ELIGIBLE FOR DELETION

14:05:30 - Someone uploads another video
├─ Cleanup runs
├─ Finds video-1730451234567.mp4 is 5.5 minutes old
├─ DELETE ✅
└─ Status: DELETED
```

---

## Why This is Better

### 1. Resource Efficiency

**Traditional (Every 1 minute):**
```
Day 1:  1440 cleanup ops
Day 7:  10,080 cleanup ops
Month:  43,200 cleanup ops
Year:   525,600 cleanup ops ❌
```

**WordPress-Cron (On-demand):**
```
Day 1:  100 cleanup ops (100 uploads)
Day 7:  700 cleanup ops (700 uploads)
Month:  3000 cleanup ops (3000 uploads)
Year:   36,500 cleanup ops ✅
```

**Savings: ~14x fewer operations!**

### 2. Predictable Performance

- No surprise cleanup spike at :00 of every minute
- Server resources only used during actual uploads
- Better for production under load

### 3. Scales with Usage

- 10 uploads/day = 10 cleanups
- 10,000 uploads/day = 10,000 cleanups
- Perfect for auto-scaling environments

### 4. Simpler Code

- No need for `setInterval`
- No need for instrumentation hooks
- No global state management
- Just run cleanup before upload ✅

---

## Testing

### Test 1: Verify Old Files Are Deleted

```bash
# Upload first video
curl -X POST http://localhost:3000/api/social/upload-to-drive \
  -F "file=@video1.mp4" \
  -F "title=First" \
  -F "caption=Desc"

# Check file exists
ls -la public/tempfiles/
# Should show: video-XXX1.mp4

# Wait 5 minutes and upload second video
# (Wait exactly 5+ minutes)

curl -X POST http://localhost:3000/api/social/upload-to-drive \
  -F "file=@video2.mp4" \
  -F "title=Second" \
  -F "caption=Desc"

# Check files
ls -la public/tempfiles/
# Should show: video-XXX2.mp4
# Should NOT show: video-XXX1.mp4 ✅ DELETED
```

### Test 2: Verify No Cleanup When Not Uploading

```bash
# Upload file
curl -X POST http://localhost:3000/api/social/upload-to-drive ...

# Watch server logs
npm run dev

# Wait 10 minutes without uploading
# [You should see NO cleanup operations in logs]

# Check file still exists
ls -la public/tempfiles/
# File should still be there (not auto-deleted)

# Upload again
curl -X POST http://localhost:3000/api/social/upload-to-drive ...

# Now cleanup runs and deletes old file
```

### Test 3: Check Console Logs

```
[FileUpload] Starting cleanup of old temp files...
[TempFileCleanup] Deleted old file: video-1730451234567.mp4 (301s old)
[TempFileCleanup] Cleaned up 1 old files
```

---

## Configuration

No configuration needed! The system:
- ✅ Automatically detects environment (local vs production)
- ✅ Uses correct protocol and host
- ✅ Stores files in `/public/tempfiles`
- ✅ Cleans up on each upload

**Optional:** In `.env.local`, you can override the cleanup age if needed:
```bash
# This is not in the current code, but could be added:
TEMP_FILE_MAX_AGE_MINUTES=5
```

---

## Summary

✅ **WordPress-Cron Style**
- Cleanup runs on-demand (when uploading)
- No scheduled background jobs
- Zero wasted resources during idle time
- Perfect for all deployment scenarios

✅ **Benefits**
- 14x fewer cleanup operations
- Better performance during peak load
- Simpler code
- Scales with actual usage

✅ **How It Works**
1. User uploads video
2. Cleanup checks for old files (> 5 min)
3. Deletes old files
4. Saves new file
5. Done!

✅ **Production Ready**
- Works on local machine
- Works in production
- Automatic resource cleanup
- Zero configuration needed

This is the most efficient approach! 🚀

