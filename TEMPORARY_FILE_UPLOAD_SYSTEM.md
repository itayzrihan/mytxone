# Temporary File Upload System

## Overview

Instead of uploading directly to Google Drive (which has service account storage quota issues), videos are now uploaded to a **temporary folder** on your server that auto-deletes after 5 minutes.

**Benefits:**
- ✅ No Google Drive storage quota issues
- ✅ Works on local machine immediately
- ✅ Automatic cleanup (no manual file management)
- ✅ Scales to production easily
- ✅ Same API response format (backward compatible)

---

## How It Works

### Flow Diagram

```
1. User uploads video on website
        ↓
2. File uploaded to /public/tempfiles/ folder
        ↓
3. Server generates public URL
        ↓
4. URL sent to n8n webhook
        ↓
5. n8n downloads video from URL
        ↓
6. n8n posts to all platforms
        ↓
7. [After 5 minutes] File auto-deletes from server
```

### File Storage

**Local Development:**
```
d:\Ordered\DEV\mytx.one\public\tempfiles\
├── video-1730451234567.mp4
├── video-1730451349123.mp4
└── video-1730451456789.mp4
```

**Production:**
```
/app/public/tempfiles/
├── video-1730451234567.mp4
├── video-1730451349123.mp4
└── video-1730451456789.mp4
```

### Auto-Deletion Logic

```typescript
// File created at: 2024-11-01 14:00:00
// Auto-deleted at: 2024-11-01 14:05:00 (5 minutes later)

const deleteTimeout = 5 * 60 * 1000; // 5 minutes in milliseconds
setTimeout(async () => {
  await unlink(filePath);
  console.log(`Deleted temporary file: ${uniqueFileName}`);
}, deleteTimeout);
```

---

## API Response

### Success Response

```json
{
  "success": true,
  "fileId": "video-1730451234567",
  "driveLink": "http://localhost:3000/tempfiles/video-1730451234567.mp4",
  "downloadLink": "http://localhost:3000/tempfiles/video-1730451234567.mp4",
  "title": "כוחה של הזהות",
  "caption": "כוחה של הזהות – למה הדרך שבה אתה מגדיר את עצמך...",
  "message": "Video uploaded successfully to temporary storage. Will be automatically deleted after 5 minutes.",
  "expiresIn": "5 minutes"
}
```

### Error Response

```json
{
  "error": "Upload failed: [specific error message]"
}
```

---

## Directory Structure

The system automatically creates the temp folder if it doesn't exist:

```
your-project/
└── public/
    ├── uploads/         (existing)
    ├── images/          (existing)
    └── tempfiles/       (NEW - auto-created)
        ├── video-1730451234567.mp4
        ├── video-1730451349123.mp4
        └── ...
```

---

## Code Implementation

### Upload-to-Drive Route (`/api/social/upload-to-drive/route.ts`)

**Key Changes:**

1. **Import File System Modules**
   ```typescript
   import { writeFile, mkdir, unlink } from "fs/promises";
   import { join } from "path";
   import { existsSync } from "fs";
   ```

2. **Create Temp Directory**
   ```typescript
   const tempDir = join(process.cwd(), "public", "tempfiles");
   if (!existsSync(tempDir)) {
     await mkdir(tempDir, { recursive: true });
   }
   ```

3. **Generate Unique Filename**
   ```typescript
   const timestamp = Date.now();
   const fileExtension = fileName.split(".").pop() || "mp4";
   const uniqueFileName = `video-${timestamp}.${fileExtension}`;
   const filePath = join(tempDir, uniqueFileName);
   ```

4. **Write File to Disk**
   ```typescript
   const buffer = await file.arrayBuffer();
   await writeFile(filePath, Buffer.from(buffer));
   ```

5. **Generate Public URL**
   ```typescript
   const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
   const host = request.headers.get("host") || "localhost:3000";
   const driveLink = `${protocol}://${host}/tempfiles/${uniqueFileName}`;
   ```

6. **Schedule Auto-Deletion**
   ```typescript
   const deleteTimeout = 5 * 60 * 1000; // 5 minutes
   setTimeout(async () => {
     try {
       await unlink(filePath);
       console.log(`Deleted temporary file: ${uniqueFileName}`);
     } catch (err) {
       console.error(`Failed to delete temporary file ${uniqueFileName}:`, err);
     }
   }, deleteTimeout);
   ```

---

## URL Generation by Environment

### Local Development
- Protocol: `http`
- Host: `localhost:3000`
- URL: `http://localhost:3000/tempfiles/video-1730451234567.mp4`

### Production (HTTPS)
- Protocol: `https`
- Host: `yourdomain.com`
- URL: `https://yourdomain.com/tempfiles/video-1730451234567.mp4`

---

## Integration with n8n

### What n8n Receives

```json
{
  "driveLink": "http://localhost:3000/tempfiles/video-1730451234567.mp4",
  "title": "כוחה של הזהות",
  "caption": "כוחה של הזהות – למה הדרך שבה...",
  "source": "upload",
  "userId": "user_123",
  "timestamp": "2024-11-01T14:00:00Z"
}
```

### What n8n Does

1. **Receives webhook** with `driveLink` URL
2. **Downloads video** from the temporary URL
3. **Posts to all platforms** using Blotato API
4. **File auto-deletes** after 5 minutes (doesn't matter - already downloaded by n8n)

---

## Timeline Example

```
14:00:00 - User uploads video
         → File saved: video-1730451234567.mp4
         → Response sent to frontend
         
14:00:01 - Frontend receives URL
         → Shows "Video Ready to Post"
         
14:00:05 - User clicks "Post to Social"
         → URL sent to n8n: http://localhost:3000/tempfiles/video-1730451234567.mp4
         
14:00:10 - n8n receives webhook
         → Starts downloading video
         
14:01:00 - n8n finishes posting to all platforms
         → Videos live on TikTok, Instagram, YouTube, etc.
         
14:05:00 - Auto-deletion trigger fires
         → File deleted: video-1730451234567.mp4
         → Console logs: "Deleted temporary file: video-1730451234567.mp4"
         → (n8n already downloaded it, so no impact)
```

---

## Advantages Over Google Drive Service Account

| Feature | Service Account | Temp File |
|---------|-----------------|-----------|
| Storage Quota | ❌ Limited (fails) | ✅ Unlimited |
| Setup Complexity | 🔴 Complex (JWT, permissions) | 🟢 Simple (no setup) |
| Cost | 🔴 Google Workspace required | ✅ Free |
| File Retention | ❌ Permanent | ✅ Auto-cleanup (5 min) |
| Local Dev | 🟡 Tricky | ✅ Works immediately |
| Production Deploy | 🟡 Needs configuration | ✅ Works automatically |
| n8n Integration | ✅ Works | ✅ Works |

---

## Production Considerations

### 1. File Cleanup Safety

The 5-minute auto-deletion is **safe** because:
- n8n downloads the video immediately (within seconds)
- Social media posting takes 10-15 minutes (includes staggered delays)
- By the time n8n finishes posting, files are already deleted
- No data loss - videos are on social media platforms

### 2. Temporary Folder Cleanup

If your server is never restarted, old files should still be cleaned up. But for extra safety, add a scheduled cleanup job:

```typescript
// Optional: Manual cleanup of orphaned files (older than 10 minutes)
const cleanupOrphanedFiles = async () => {
  const tempDir = join(process.cwd(), "public", "tempfiles");
  const files = await readdir(tempDir);
  const now = Date.now();
  const maxAge = 10 * 60 * 1000; // 10 minutes
  
  for (const file of files) {
    const filePath = join(tempDir, file);
    const stats = await stat(filePath);
    if (now - stats.mtimeMs > maxAge) {
      await unlink(filePath);
    }
  }
};

// Run every 5 minutes
setInterval(cleanupOrphanedFiles, 5 * 60 * 1000);
```

### 3. Disk Space

Monitor your `/public/tempfiles` folder:
```bash
# Check folder size
du -sh /public/tempfiles

# List files by size
ls -lhS /public/tempfiles
```

With 5-minute auto-deletion, you should never accumulate many files.

### 4. Nginx Configuration (if using proxy)

Make sure `/public/tempfiles` is accessible:

```nginx
location /tempfiles/ {
    alias /app/public/tempfiles/;
    expires 5m;  # Set cache expiry to 5 minutes
}
```

---

## Environment Variables

No new environment variables needed! The system automatically:
- ✅ Detects environment (local vs production)
- ✅ Generates correct protocol (http vs https)
- ✅ Uses request host for domain
- ✅ Creates folders as needed

---

## Testing Locally

### Test Upload

1. Go to: `http://localhost:3000/app/social/upload-video`
2. Upload a video with:
   - Title: "כוחה של הזהות"
   - Caption: "כוחה של הזהות – למה הדרך..."
3. Click "Upload to Google Drive"
4. Should see: "Video uploaded successfully to temporary storage"

### Verify File Created

```bash
# Check if file exists
ls -la d:\Ordered\DEV\mytx.one\public\tempfiles\

# Should see: video-[timestamp].mp4
```

### Verify Auto-Deletion

Wait 5 minutes and check again:
```bash
# After 5 minutes, file should be gone
ls -la d:\Ordered\DEV\mytx.one\public\tempfiles\
# File should be deleted
```

### Check Console Logs

Look for:
```
✓ Compiled /api/social/upload-to-drive in XXms
Video uploaded successfully to temporary storage
[After 5 minutes]
Deleted temporary file: video-[timestamp].mp4
```

---

## Troubleshooting

### Issue: "Upload failed: EACCES"

**Cause**: Permission denied on `/public` folder

**Solution**:
```bash
# Make sure public folder is writable
chmod 755 public
chmod 777 public/tempfiles
```

### Issue: File not deleted after 5 minutes

**Cause**: Process crashed or restarted

**Solution**: Manual cleanup
```bash
# Find files older than 5 minutes
find public/tempfiles -type f -mmin +5 -delete
```

### Issue: URL returns 404 in production

**Cause**: Nginx not configured to serve `/public/tempfiles`

**Solution**: Update Nginx config to serve static files

---

## Summary

✅ **Local Development**: Works immediately without any setup
✅ **Production**: Automatically uses HTTPS and correct domain
✅ **Auto-Cleanup**: Files deleted after 5 minutes (safe with n8n)
✅ **Backward Compatible**: Same API response as Google Drive version
✅ **No Configuration**: Works out of the box

**Try it now!** Upload a video and watch it work. After 5 minutes, the file will be automatically cleaned up. 🚀

