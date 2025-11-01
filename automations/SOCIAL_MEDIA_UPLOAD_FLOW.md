# Social Media Upload & Post Flow Documentation

## 🎯 Overview

The mytx.one Social Media Manager provides **two ways** to upload and share videos across all your social media platforms:

### Path 1: Upload First (Recommended)
Upload video → Google Drive → Add metadata → Post to all platforms

### Path 2: Use Existing Link (Quick)
Already have Google Drive link → Add metadata → Post to all platforms

Both paths converge into the same posting workflow ensuring consistent distribution.

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      mytx.one UI                                 │
│              /social/upload-video                                │
└─────────────────────────────────────────────────────────────────┘
                    │                           │
           Path 1: Upload              Path 2: Existing Link
                    │                           │
                    ▼                           │
┌────────────────────────────────────┐          │
│  Upload API Endpoint                │          │
│  /api/social/upload-to-drive        │          │
│  - Receives video file              │          │
│  - Uploads to Google Drive          │          │
│  - Returns sharable link            │          │
└────────────────────────────────────┘          │
                    │                           │
                    └───────────┬───────────────┘
                                ▼
                  ┌──────────────────────────┐
                  │  Post API Endpoint        │
                  │  /api/social/post-video   │
                  │  - Accepts driveLink      │
                  │  - title & caption        │
                  │  - source ("upload" or    │
                  │    "existing")            │
                  └──────────────────────────┘
                                │
                                ▼
                  ┌──────────────────────────┐
                  │  n8n Webhook Trigger      │
                  │  https://auto.mytx.co/    │
                  │  webhook/post-to-social   │
                  └──────────────────────────┘
                                │
                                ▼
              ┌─────────────────────────────────┐
              │  Data Extraction & Validation    │
              │  - Extract Google Drive file ID  │
              │  - Build download URL            │
              └─────────────────────────────────┘
                                │
                                ▼
              ┌─────────────────────────────────┐
              │  Upload to Blotato               │
              │  - Download from Google Drive    │
              │  - Upload to Blotato storage     │
              └─────────────────────────────────┘
                                │
                                ▼
      ┌─────────────────────────────────────────────────┐
      │          Platform Distribution (Parallel)        │
      │  ┌─────────────┬─────────────┬─────────────┐    │
      │  │  TikTok x4  │  Instagram  │  YouTube x2 │    │
      │  │             │     x4      │             │    │
      │  └─────────────┴─────────────┴─────────────┘    │
      │  ┌─────────────┬─────────────┬─────────────┐    │
      │  │  LinkedIn   │  Facebook   │  Twitter/X  │    │
      │  └─────────────┴─────────────┴─────────────┘    │
      │  ┌─────────────┐                                │
      │  │  Threads    │                                │
      │  └─────────────┘                                │
      └─────────────────────────────────────────────────┘
                                │
                                ▼
                  ┌──────────────────────────┐
                  │  Merge Results            │
                  │  - Success/Error tracking │
                  │  - Timeline: 10-15 min    │
                  └──────────────────────────┘
```

---

## 🔧 Technical Implementation

### Frontend Components

#### 1. Main Page: `/app/social/upload-video/page.tsx`
```typescript
- Dual-tab interface (Upload vs Existing Link)
- Upload form for video files
- Existing link form
- Real-time status updates
- Progress indicators
- Platform list display
```

#### 2. Upload Form Component: `/components/custom/upload-video-form.tsx`
```typescript
Features:
- Drag & drop video upload
- File browser button
- Title and caption inputs
- Upload progress bar
- Success/error states
- Automatic form reset after success
```

### Backend APIs

#### 1. Google Drive Upload API
**Endpoint:** `POST /api/social/upload-to-drive`

**Request (FormData):**
```javascript
{
  file: File,           // Video file
  title: string,        // Video title
  caption: string,      // Video description
  fileName: string      // File name for Google Drive
}
```

**Response:**
```json
{
  "success": true,
  "fileId": "1A2B3C4D5E6F...",
  "driveLink": "https://drive.google.com/file/d/...",
  "downloadLink": "https://drive.google.com/uc?export=download&id=...",
  "title": "Video Title",
  "caption": "Video Caption",
  "message": "Video uploaded successfully to Google Drive and made public"
}
```

**Requirements:**
- Environment Variables:
  - `GOOGLE_SERVICE_ACCOUNT_JSON` - Service account credentials
  - `GOOGLE_DRIVE_FOLDER_ID` - Target folder for uploads
- File is automatically set to "Anyone with the link" permissions

#### 2. Post to Social API
**Endpoint:** `POST /api/social/post-video`

**Request (JSON):**
```json
{
  "driveLink": "https://drive.google.com/file/d/...",
  "title": "Video Title",
  "caption": "Video Caption",
  "source": "upload" | "existing"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Video sent to all social platforms",
  "workflowId": "abc123",
  "platforms": [
    "tiktok_itay_zrihan",
    "tiktok_itay_tech",
    "tiktok_itay_zrihan_warmed",
    "tiktok_spammer",
    "instagram_sales_growth",
    "instagram_itay_zrihan",
    "instagram_itay_chi",
    "instagram_itay_zrihan_official",
    "youtube_itay_zrihan",
    "youtube_mytx",
    "linkedin",
    "facebook",
    "twitter",
    "threads"
  ],
  "estimatedPostingTime": "10-15 minutes",
  "note": "Your video is being posted to all platforms with staggered delays"
}
```

**Requirements:**
- Environment Variable:
  - `N8N_WEBHOOK_URL` - n8n webhook endpoint URL

### n8n Workflow

**File:** `automations/blotato-api-dual-trigger.json`

**Triggers:**
1. **Path 2 Webhook:** `/webhook/post-to-social`
   - For existing Google Drive links
   - Direct API calls from external sources

2. **Path 1 Webhook:** `/webhook/upload-and-post`
   - After video upload to Google Drive
   - From mytx.one UI upload flow

**Workflow Steps:**
1. **Extract & Normalize Data**
   - Parse `driveLink`, `title`, `caption`
   - Extract Google Drive file ID using regex
   - Add `source` tracking

2. **Validate Input**
   - Ensure single item processing
   - Validate required fields

3. **Build Download URL**
   - Convert Drive link to download URL format
   - `https://drive.google.com/uc?export=download&id={fileId}`

4. **Upload to Blotato**
   - Download video from Google Drive
   - Upload to Blotato CDN
   - Get media reference ID

5. **Post to Platforms (Parallel)**
   - TikTok: 4 accounts
   - Instagram: 4 accounts
   - YouTube: 2 channels
   - LinkedIn: 1 account
   - Facebook: 1 page
   - Twitter/X: 1 account
   - Threads: 1 account

6. **Merge Results**
   - Collect all platform responses
   - Track success/errors
   - Completion status

**Error Handling:**
- Each platform node continues on error
- Failed posts don't block others
- All results merged for reporting

---

## 🚀 User Flow Examples

### Example 1: Upload New Video

1. Admin navigates to `/social/upload-video`
2. Selects "Path 1: Upload & Post"
3. Drags video file into upload zone
4. Fills in title: "My Amazing Video"
5. Fills in caption: "Check out this great content!"
6. Clicks "Upload to Google Drive"
7. Progress bar shows 0% → 100%
8. Success message: "Video uploaded to Google Drive!"
9. "Post to Social Media" button appears
10. Clicks "Post to 13+ Social Media Accounts"
11. Workflow triggered
12. Status: "Posting in Progress! ~10-15 minutes"
13. Video posted to all platforms with delays

### Example 2: Use Existing Link

1. Admin navigates to `/social/upload-video`
2. Selects "Path 2: Use Existing Link"
3. Pastes Google Drive link
4. Fills in title and caption
5. Clicks "Post to 13+ Social Media Accounts"
6. Workflow triggered immediately
7. Video posted to all platforms

---

## 🔐 Authentication & Permissions

### mytx.one Authentication
- All pages require user login
- Social Media Manager is **admin-only**
- Access controlled via `shouldShowAdminElements` and `viewMode === "admin"`

### Google Drive Permissions
- Service Account must have:
  - Write access to target folder
  - Permission to set file permissions
- Uploaded files automatically set to "Anyone with the link"

### n8n/Blotato Credentials
- Blotato API key stored in n8n credentials
- All platform accounts pre-configured in Blotato
- No user-side credential management needed

---

## 📝 Environment Variables

Add these to `.env.local`:

```bash
# n8n Webhook URL
N8N_WEBHOOK_URL=https://auto.mytx.co/webhook/post-to-social

# Google Drive Configuration
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
GOOGLE_DRIVE_FOLDER_ID=1A2B3C4D5E6F7G8H9I0J

# Existing configurations
GOOGLE_GENERATIVE_AI_API_KEY=...
AUTH_SECRET=...
POSTGRES_URL=...
KV_URL=...
```

---

## 🎨 UI Features

### Glassmorphic Design
- Transparent backgrounds with backdrop blur
- Neon cyan/blue accents
- Smooth transitions and animations
- Mobile responsive

### Status Indicators
- **Idle:** Normal state
- **Uploading:** Progress bar with percentage
- **Success:** Green checkmark with confirmation
- **Error:** Red alert with error message
- **Posting:** Blue info box with timeline

### Platform Display
- Grid layout showing all 14 accounts
- Platform name + account count
- Example: "TikTok - 4 accounts"

---

## 🧪 Testing

### Test Path 1 (Upload)
```bash
1. Login as admin user
2. Navigate to /social/upload-video
3. Upload a test video (MP4, < 60MB)
4. Add title: "Test Video Upload"
5. Add caption: "Testing the upload flow"
6. Click Upload → Wait for success
7. Click Post → Check n8n execution history
```

### Test Path 2 (Existing Link)
```bash
1. Login as admin user
2. Navigate to /social/upload-video
3. Switch to "Use Existing Link" tab
4. Paste: https://drive.google.com/file/d/12RWEwBnjrro7_0eqgIlmwfPs7-sEUAqc/view?usp=drive_link
5. Add title and caption
6. Click Post → Check n8n execution history
```

### Verify Results
- Check n8n execution history: `https://auto.mytx.co/`
- Verify posts appear on each platform
- Timeline: 10-15 minutes for all platforms

---

## 🐛 Troubleshooting

### Issue: "Upload failed"
**Cause:** Google Drive API credentials missing or invalid
**Solution:** 
- Verify `GOOGLE_SERVICE_ACCOUNT_JSON` is valid JSON
- Check service account has folder write permissions
- Ensure folder ID is correct

### Issue: "Workflow trigger failed"
**Cause:** n8n webhook URL incorrect or workflow not active
**Solution:**
- Verify `N8N_WEBHOOK_URL` is correct
- Check workflow is activated (toggle ON in n8n)
- Test webhook directly with cURL

### Issue: "Posts not appearing"
**Cause:** Blotato API credentials expired or platform disconnected
**Solution:**
- Check n8n execution history for errors
- Verify Blotato account connections
- Re-authenticate platform accounts in Blotato

### Issue: "File too large"
**Cause:** Video exceeds platform limits
**Solution:**
- Keep videos under 60MB
- For larger files, use cloud storage + direct URL
- Compress video before upload

---

## 📊 Platform Specifications

| Platform | Accounts | Max Duration | Max Size | Format |
|----------|----------|--------------|----------|--------|
| TikTok | 4 | 10 min | 287 MB | MP4 |
| Instagram | 4 | 60 sec | 100 MB | MP4 |
| YouTube | 2 | Unlimited | 128 GB | Multiple |
| LinkedIn | 1 | 10 min | 200 MB | MP4 |
| Facebook | 1 | 240 min | 10 GB | Multiple |
| Twitter/X | 1 | 2:20 min | 512 MB | MP4 |
| Threads | 1 | 5 min | 1 GB | MP4 |

**Note:** Blotato handles format conversion automatically

---

## 🔄 Future Enhancements

1. **Scheduled Posting**
   - Queue videos for future posting
   - Calendar view of scheduled posts

2. **Platform Selection**
   - Choose specific platforms per video
   - Custom account groups

3. **Batch Upload**
   - Upload multiple videos at once
   - Bulk metadata entry

4. **Analytics Dashboard**
   - View post performance
   - Track engagement metrics

5. **Template Library**
   - Save caption templates
   - Hashtag sets
   - Common titles

---

## 📞 Support

For issues or questions:
- Check n8n execution history first
- Review error messages in UI
- Verify environment variables
- Test with known-good video file
- Contact Blotato support for platform-specific issues

---

## 🎉 Summary

The Social Media Manager provides a unified interface to:
- ✅ Upload videos to Google Drive
- ✅ Post to 13+ social accounts instantly
- ✅ Track posting progress
- ✅ Handle errors gracefully
- ✅ Support both new uploads and existing links

**Result:** One-click distribution to all your social media platforms! 🚀
