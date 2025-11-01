# Upload to Google Drive Flow - Complete Breakdown

## TL;DR (Quick Answer)

**Yes, exactly!** Your flow is:
```
[User uploads video on website]
        ↓
[Your site uploads to Google Drive]
        ↓
[Gets back shareable link]
        ↓
[Sends link + title + caption to n8n]
        ↓
[n8n posts to all 13+ platforms]
```

---

## Complete Step-by-Step Flow

### **Phase 1: User Uploads Video on Website**

**Location**: `/app/social/upload-video/page.tsx`

```typescript
// User fills out form:
File: video.mp4
Title: "כוחה של הזהות"
Caption: "כוחה של הזהות – למה הדרך שבה אתה מגדיר את עצמך..."

// User clicks "Upload to Google Drive"
// Component calls:
const response = await fetch("/api/social/upload-to-drive", {
  method: "POST",
  body: formData  // Contains: file, title, caption, fileName
});
```

---

### **Phase 2: Your Backend Receives Upload Request**

**Location**: `/api/social/upload-to-drive/route.ts`

**Step 1: Authentication Check** ✅
```typescript
const session = await auth();

if (!session?.user) {
  return { error: "Unauthorized" };  // Only authenticated users can upload
}
```

**Step 2: Extract Form Data** ✅
```typescript
const formData = await request.formData();
const file = formData.get("file");           // video.mp4 binary
const title = formData.get("title");         // "כוחה של הזהות"
const caption = formData.get("caption");     // "כוחה של הזהות – למה..."
const fileName = formData.get("fileName");   // "video.mp4"
```

**Step 3: Validate Input** ✅
```typescript
const validatedData = UploadSchema.safeParse({
  file,
  title,
  caption,
  fileName,
});
// All fields must be present and correct type
```

---

### **Phase 3: Get Google Drive Authentication**

**Location**: `/api/social/upload-to-drive/route.ts` (Lines 68-84)

**Step 1: Load Credentials from Environment** ✅
```typescript
const googleServiceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
const googleDriveFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

// These are set in your .env.local:
// GOOGLE_SERVICE_ACCOUNT_JSON = { service account credentials }
// GOOGLE_DRIVE_FOLDER_ID = "1ABC123..." (your designated folder)
```

**Step 2: Get Access Token from Google** ✅
```typescript
const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    client_id: serviceAccount.client_id,
    client_secret: serviceAccount.client_secret,
    refresh_token: serviceAccount.refresh_token || "",
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: "",
  }),
});

const tokenData = await tokenResponse.json();
const accessToken = tokenData.access_token;  // ← Used for all Drive API calls
```

**What This Does:**
- Uses your **Google Service Account** (a special bot account you created)
- Requests temporary access token from Google
- This token has permission to upload files to your Drive

---

### **Phase 4: Upload Video File to Google Drive**

**Location**: `/api/social/upload-to-drive/route.ts` (Lines 92-119)

**Step 1: Prepare File & Metadata** ✅
```typescript
const fileBuffer = await file.arrayBuffer();  // Convert file to binary
const fileData = new FormData();

// Create metadata object
const metadata = {
  name: fileName,                            // "video.mp4"
  mimeType: file.type,                       // "video/mp4"
  parents: [googleDriveFolderId],            // Upload to designated folder
  description: `Title: ${title}\nCaption: ${caption}`,  // Store title & caption in Drive
};

// Add metadata and file to FormData
fileData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
fileData.append("file", new Blob([fileBuffer], { type: file.type }));
```

**Step 2: Send to Google Drive API** ✅
```typescript
const uploadResponse = await fetch(
  "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,  // ← Your temporary token
    },
    body: fileData,  // ← File + metadata
  }
);

const uploadedFile = await uploadResponse.json();
const fileId = uploadedFile.id;  // ← Google Drive's ID for this file
// Example: "1FZD36524kANhcR6HAaZHoAbtl-PQS0Cc"
```

**What Google Returns:**
```json
{
  "kind": "drive#file",
  "id": "1FZD36524kANhcR6HAaZHoAbtl-PQS0Cc",
  "name": "video.mp4",
  "mimeType": "video/mp4"
  // ... other metadata
}
```

---

### **Phase 5: Make File Public (Share with Anyone)**

**Location**: `/api/social/upload-to-drive/route.ts` (Lines 121-135)

**Step 1: Grant Public Read Access** ✅
```typescript
await fetch(
  `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      role: "reader",      // ← Can view/download
      type: "anyone",      // ← Anyone with link
    }),
  }
);
```

**What This Does:**
- Changes file permissions from "only you" to "anyone with link"
- Allows n8n to download and process the video
- Allows social media platforms to fetch and display the video

---

### **Phase 6: Generate Shareable Links**

**Location**: `/api/social/upload-to-drive/route.ts` (Lines 137-141)

```typescript
const driveLink = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
// → https://drive.google.com/file/d/1FZD36524kANhcR6HAaZHoAbtl-PQS0Cc/view?usp=sharing

const downloadLink = `https://drive.google.com/uc?export=download&id=${fileId}`;
// → https://drive.google.com/uc?export=download&id=1FZD36524kANhcR6HAaZHoAbtl-PQS0Cc
```

**What These Do:**
- **driveLink**: Opens preview in Google Drive (what you share with people)
- **downloadLink**: Direct download link (what n8n uses to fetch video file)

---

### **Phase 7: Return Response to Website**

**Location**: `/api/social/upload-to-drive/route.ts` (Lines 143-154)

```typescript
return NextResponse.json({
  success: true,
  fileId: "1FZD36524kANhcR6HAaZHoAbtl-PQS0Cc",
  driveLink: "https://drive.google.com/file/d/1FZD36524kANhcR6HAaZHoAbtl-PQS0Cc/view?usp=sharing",
  downloadLink: "https://drive.google.com/uc?export=download&id=1FZD36524kANhcR6HAaZHoAbtl-PQS0Cc",
  title: "כוחה של הזהות",
  caption: "כוחה של הזהות – למה הדרך שבה אתה מגדיר את עצמך...",
  message: "Video uploaded successfully to Google Drive and made public",
});
```

---

### **Phase 8: Website Receives Upload Response**

**Location**: `/components/custom/upload-video-form.tsx` (Lines 119-131)

```typescript
const data = await response.json();

// Store uploaded video data in state
setUploadedVideoData({
  fileId: data.fileId,
  driveLink: data.driveLink,
  downloadLink: data.downloadLink,
  title: data.title,
  caption: data.caption,
});

// Show success message and display "Post to Social" button
setUploadStatus("success");
toast.success("Video uploaded to Google Drive successfully!");
```

---

### **Phase 9: User Sees "Video Ready to Post"**

**Location**: `/app/social/upload-video/page.tsx` (Lines 356-387)

Website displays:
```
✅ Video Ready!
Your video is uploaded to Google Drive. Now post it to all your social media accounts.

📌 Title: כוחה של הזהות
📝 Drive Link: https://drive.google.com/file/d/1FZ...

[Post to 13+ Social Media Accounts] ← New button appears
```

---

### **Phase 10: User Clicks "Post to Social"**

**Location**: `/app/social/upload-video/page.tsx` (Lines 350-365)

```typescript
const handlePostToSocial = async (
  driveLink,              // "https://drive.google.com/file/d/1FZD36524kANhcR6HAaZHoAbtl-PQS0Cc/view?usp=sharing"
  title,                  // "כוחה של הזהות"
  caption,                // "כוחה של הזהות – למה הדרך שבה אתה מגדיר את עצמך..."
  "upload"                // source: indicates this came from upload, not existing link
);

// Sends to:
const response = await fetch("/api/social/post-video", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    driveLink,
    title,
    caption,
    source: "upload",
  }),
});
```

---

### **Phase 11: Backend Sends to n8n Webhook**

**Location**: `/api/social/post-video/route.ts` (Lines 67-93)

```typescript
// Validate input
const validatedData = PostToSocialSchema.safeParse(body);

const { driveLink, title, caption, source } = validatedData.data;

// Get n8n webhook URL from environment
const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
// = "https://auto.mytx.co/webhook/post-to-social"

// Call n8n webhook to trigger workflow
const n8nResponse = await fetch(n8nWebhookUrl, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    driveLink: "https://drive.google.com/file/d/1FZD36524kANhcR6HAaZHoAbtl-PQS0Cc/view?usp=sharing",
    title: "כוחה של הזהות",
    caption: "כוחה של הזהות – למה הדרך שבה אתה מגדיר את עצמך...",
    source: "upload",
    userId: session.user.id,
    timestamp: new Date().toISOString(),
  }),
});
```

---

### **Phase 12: n8n Receives Webhook**

**Location**: n8n cloud instance (auto.mytx.co)

**n8n Webhook v2 Node receives:**
```json
{
  "driveLink": "https://drive.google.com/file/d/1FZD36524kANhcR6HAaZHoAbtl-PQS0Cc/view?usp=sharing",
  "title": "כוחה של הזהות",
  "caption": "כוחה של הזהות – למה הדרך שבה אתה מגדיר את עצמך...",
  "source": "upload",
  "userId": "user_123",
  "timestamp": "2024-11-01T14:30:00Z"
}
```

**n8n's Extract & Normalize Data node processes it:**
```javascript
// Accesses via: $json.body.*
{
  "driveLink": "1FZD36524kANhcR6HAaZHoAbtl-PQS0Cc",  // Extracted file ID
  "title": "כוחה של הזהות",
  "caption": "כוחה של הזהות – למה הדרך שבה אתה מגדיר את עצמך...",
  "final_google_drive_url": "https://drive.google.com/uc?export=download&id=1FZD36524kANhcR6HAaZHoAbtl-PQS0Cc"
}
```

---

### **Phase 13: n8n Posts to All Platforms**

**n8n sends to Blotato API which posts to:**

✅ **TikTok** (5 accounts):
- Itay_Zrihan
- Itay_Tech
- Not Warmed Up Yet
- ItayTheSpammer
- Spammer

✅ **Instagram** (4 accounts):
- Sales_Growth_Digital
- Itay.Zrihan
- Itay_Chi
- Itay_Zrihan Official

✅ **YouTube** (3 channels):
- Itay_Zrihan
- MyTx
- (Additional channel)

✅ **Other Platforms**:
- LinkedIn
- Facebook
- Twitter
- Threads

**Each post includes:**
- Video from: `https://drive.google.com/uc?export=download&id=1FZD36524kANhcR6HAaZHoAbtl-PQS0Cc`
- Title: כוחה של הזהות
- Caption: כוחה של הזהות – למה הדרך שבה אתה מגדיר את עצמך...

---

## Visual Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          YOUR WEBSITE (Next.js)                          │
│                    /app/social/upload-video/page.tsx                     │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  User fills form:                                               │   │
│  │  - Video file (video.mp4)                                       │   │
│  │  - Title (כוחה של הזהות)                                        │   │
│  │  - Caption (כוחה של הזהות – למה הדרך שבה...)                   │   │
│  │  - Clicks "Upload to Google Drive"                              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                           │
│                              ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ UploadVideoForm Component                                       │   │
│  │ Creates FormData:                                               │   │
│  │ - file: [binary video data]                                     │   │
│  │ - title: "כוחה של הזהות"                                        │   │
│  │ - caption: "כוחה של הזהות – למה הדרך..."                       │   │
│  │ - fileName: "video.mp4"                                         │   │
│  │                                                                 │   │
│  │ fetch("/api/social/upload-to-drive", {                         │   │
│  │   method: "POST",                                               │   │
│  │   body: formData                                                │   │
│  │ })                                                              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              │ FormData
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              YOUR BACKEND API (Next.js Server)                          │
│            /api/social/upload-to-drive/route.ts                        │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ [1] Check Authentication                                         │ │
│  │ const session = await auth()                                     │ │
│  │ if (!session?.user) return error                                 │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                              │                                         │
│                              ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ [2] Extract & Validate FormData                                  │ │
│  │ file, title, caption, fileName                                   │ │
│  │ All fields must be present and correct type                      │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                              │                                         │
│                              ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ [3] Load Google Drive Credentials                                │ │
│  │ from environment variables:                                      │ │
│  │ - GOOGLE_SERVICE_ACCOUNT_JSON (service account creds)            │ │
│  │ - GOOGLE_DRIVE_FOLDER_ID (destination folder)                    │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                              │                                         │
│                              ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ [4] Get Google OAuth Token                                       │ │
│  │ fetch("https://oauth2.googleapis.com/token")                     │ │
│  │ Uses service account credentials to get accessToken              │ │
│  └──────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              │ accessToken
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        GOOGLE DRIVE API                                 │
│                   https://www.googleapis.com                            │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ [5] Upload File with Metadata                                    │ │
│  │ POST /upload/drive/v3/files?uploadType=multipart                 │ │
│  │                                                                  │ │
│  │ Headers: Authorization: Bearer ${accessToken}                    │ │
│  │                                                                  │ │
│  │ Body (multipart):                                                │ │
│  │ - metadata: { name, mimeType, parents, description }             │ │
│  │ - file: [binary video data]                                      │ │
│  │                                                                  │ │
│  │ Response:                                                        │ │
│  │ { id: "1FZD36524kANhcR6HAaZHoAbtl-PQS0Cc", ... }                │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                              │                                         │
│                              ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ [6] Make File Public                                             │ │
│  │ POST /drive/v3/files/${fileId}/permissions                       │ │
│  │                                                                  │ │
│  │ Body: { role: "reader", type: "anyone" }                         │ │
│  │                                                                  │ │
│  │ Result: Anyone with link can view/download                       │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                              │                                         │
│                              ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ [7] Generate Shareable Links                                     │ │
│  │                                                                  │ │
│  │ driveLink:                                                       │ │
│  │ https://drive.google.com/file/d/1FZD36524kANhcR6HAaZHoAbtl-    │ │
│  │ PQS0Cc/view?usp=sharing                                          │ │
│  │                                                                  │ │
│  │ downloadLink:                                                    │ │
│  │ https://drive.google.com/uc?export=download&id=1FZD36524kANh... │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                              │                                         │
│                              ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ [8] Return Success Response                                      │ │
│  │ {                                                                │ │
│  │   success: true,                                                 │ │
│  │   fileId: "1FZD36524kANhcR6HAaZHoAbtl-PQS0Cc",                  │ │
│  │   driveLink: "https://drive.google.com/file/d/...",              │ │
│  │   downloadLink: "https://drive.google.com/uc?...",               │ │
│  │   title: "כוחה של הזהות",                                        │ │
│  │   caption: "כוחה של הזהות – למה הדרך..."                        │ │
│  │ }                                                                │ │
│  └──────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              │ JSON Response
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          YOUR WEBSITE (Next.js)                          │
│                    /app/social/upload-video/page.tsx                     │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ [9] Receive Upload Response                                        │ │
│  │ const data = await response.json()                                 │ │
│  │                                                                    │ │
│  │ setUploadedVideoData({                                             │ │
│  │   fileId: "1FZD36524kANhcR6HAaZHoAbtl-PQS0Cc",                    │ │
│  │   driveLink: "https://drive.google.com/file/d/...",                │ │
│  │   title: "כוחה של הזהות",                                          │ │
│  │   caption: "כוחה של הזהות – למה הדרך..."                          │ │
│  │ })                                                                 │ │
│  │                                                                    │ │
│  │ Show: ✅ Video Ready to Post!                                     │ │
│  │       [Post to 13+ Social Media Accounts] button                   │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                              │                                           │
│                              ▼                                           │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ [10] User Clicks "Post to Social"                                  │ │
│  │                                                                    │ │
│  │ handlePostToSocial(                                                │ │
│  │   "https://drive.google.com/file/d/...",  ← driveLink            │ │
│  │   "כוחה של הזהות",                        ← title                 │ │
│  │   "כוחה של הזהות – למה הדרך...",          ← caption              │ │
│  │   "upload"                                ← source                │ │
│  │ )                                                                  │ │
│  │                                                                    │ │
│  │ fetch("/api/social/post-video", {                                 │ │
│  │   method: "POST",                                                  │ │
│  │   headers: { "Content-Type": "application/json" },                │ │
│  │   body: JSON.stringify({                                           │ │
│  │     driveLink,                                                     │ │
│  │     title,                                                         │ │
│  │     caption,                                                       │ │
│  │     source: "upload"                                               │ │
│  │   })                                                               │ │
│  │ })                                                                 │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              │ JSON (driveLink, title, caption)
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              YOUR BACKEND API (Next.js Server)                          │
│            /api/social/post-video/route.ts                             │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ [11] Validate & Prepare Data                                     │ │
│  │ const validatedData = PostToSocialSchema.safeParse(body)          │ │
│  │ const { driveLink, title, caption, source } = validatedData.data │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                              │                                         │
│                              ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ [12] Call n8n Webhook                                            │ │
│  │                                                                  │ │
│  │ const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL                │ │
│  │ // = "https://auto.mytx.co/webhook/post-to-social"               │ │
│  │                                                                  │ │
│  │ fetch(n8nWebhookUrl, {                                           │ │
│  │   method: "POST",                                                │ │
│  │   headers: { "Content-Type": "application/json" },               │ │
│  │   body: JSON.stringify({                                         │ │
│  │     driveLink: "https://drive.google.com/file/d/...",            │ │
│  │     title: "כוחה של הזהות",                                      │ │
│  │     caption: "כוחה של הזהות – למה הדרך...",                     │ │
│  │     source: "upload",                                            │ │
│  │     userId: "user_123",                                          │ │
│  │     timestamp: "2024-11-01T14:30:00Z"                            │ │
│  │   })                                                             │ │
│  │ })                                                               │ │
│  └──────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              │ Webhook POST
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     n8n CLOUD (auto.mytx.co)                            │
│                 blotato-api.json workflow                              │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ [13] Webhook v2 Node Receives:                                   │ │
│  │ {                                                                │ │
│  │   driveLink: "https://drive.google.com/file/d/...",              │ │
│  │   title: "כוחה של הזהות",                                        │ │
│  │   caption: "כוחה של הזהות – למה הדרך...",                       │ │
│  │   source: "upload",                                              │ │
│  │   userId: "user_123",                                            │ │
│  │   timestamp: "2024-11-01T14:30:00Z"                              │ │
│  │ }                                                                │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                              │                                         │
│                              ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ [14] Extract & Normalize Data Node:                              │ │
│  │ Accesses: $json.body.driveLink → extracts fileId                 │ │
│  │           $json.body.title                                       │ │
│  │           $json.body.caption                                     │ │
│  │                                                                  │ │
│  │ Output: {                                                        │ │
│  │   driveLink: "1FZD36524kANhcR6HAaZHoAbtl-PQS0Cc",               │ │
│  │   title: "כוחה של הזהות",                                        │ │
│  │   caption: "כוחה של הזהות – למה הדרך...",                       │ │
│  │   final_google_drive_url: "https://drive.google.com/uc?..."      │ │
│  │ }                                                                │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                              │                                         │
│                              ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ [15] Delay Generators (stagger posts)                            │ │
│  │ Wait 0-2 minutes before each batch                               │ │
│  │                                                                  │ │
│  │ Batch 1: TikTok accounts (5)                                     │ │
│  │ Delay: 2 minutes                                                 │ │
│  │ Batch 2: Instagram accounts (4)                                  │ │
│  │ Delay: 2 minutes                                                 │ │
│  │ Batch 3: YouTube channels (3)                                    │ │
│  │ Batch 4: LinkedIn, Facebook, Twitter, Threads                    │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                              │                                         │
│                              ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ [16] Social Media Posting Nodes                                  │ │
│  │ (15+ nodes total)                                                │ │
│  │                                                                  │ │
│  │ Each uses BLOTATO API with:                                      │ │
│  │ - title: {{ $('Extract & Normalize Data').item.json.title }}     │ │
│  │ - caption: {{ $('Extract & Normalize Data').item.json.caption }} │ │
│  │ - videoLink: (from Extract node output)                          │ │
│  │                                                                  │ │
│  │ Posts to:                                                        │ │
│  │ ✓ TikTok (5 accounts)                                            │ │
│  │ ✓ Instagram (4 accounts)                                         │ │
│  │ ✓ YouTube (3 channels)                                           │ │
│  │ ✓ LinkedIn                                                       │ │
│  │ ✓ Facebook                                                       │ │
│  │ ✓ Twitter                                                        │ │
│  │ ✓ Threads                                                        │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                              │                                         │
│                              ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ [17] BLOTATO API                                                 │ │
│  │ Receives requests with Hebrew text + video link                  │ │
│  │ Creates posts on all platforms                                   │ │
│  └──────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                   ✅ POSTS LIVE ON ALL PLATFORMS!
                   
           Videos with Hebrew titles & captions
                  live on all 13+ accounts
```

---

## Key Points to Remember

### 🔐 Security
- **Authentication**: Only logged-in users can upload
- **Google Service Account**: Backend-only credentials (never exposed to frontend)
- **Public Access**: File is intentionally made public so n8n + platforms can access it

### 📁 Storage
- **Videos stored**: In your designated Google Drive folder
- **Accessible via**: Shareable links (anyone with link can view/download)
- **Forever**: Videos remain in Drive unless you delete them

### 🔗 Linking
- **driveLink**: Pretty preview link (https://drive.google.com/file/d/...view?usp=sharing)
- **downloadLink**: Direct download link (https://drive.google.com/uc?export=download&id=...)
- **n8n uses**: downloadLink to fetch video for Blotato API

### 📤 Text Encoding
- **Hebrew text preserved**: Throughout entire flow
- **FormData**: UTF-8 encoding (browser native)
- **JSON**: UTF-8 encoding (JavaScript native)
- **Google Drive**: Stores with full Hebrew metadata

### ⏱️ Timeline
- **Upload to Drive**: ~5-30 seconds (depends on video size)
- **Post to platforms**: ~10-15 minutes (staggered with delays)
- **Total time**: ~15-20 minutes from upload to all platforms live

---

## Environment Variables Needed

For this flow to work, you need in `.env.local`:

```bash
# Google Drive Configuration
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account",...your credentials...}
GOOGLE_DRIVE_FOLDER_ID=1ABC123...

# n8n Webhook Configuration
N8N_WEBHOOK_URL=https://auto.mytx.co/webhook/post-to-social
```

---

## Summary

**Your complete flow is:**

```
1. User uploads video on website
   ↓
2. Your backend uploads to Google Drive (using service account)
   ↓
3. Google returns fileId + generates shareable links
   ↓
4. Your backend makes file public (anyone with link can access)
   ↓
5. Your backend sends driveLink + title + caption to n8n webhook
   ↓
6. n8n receives webhook, extracts data
   ↓
7. n8n posts to all 13+ social platforms via Blotato API
   ↓
8. ✅ Videos live on TikTok, Instagram, YouTube, LinkedIn, etc.
```

**The beauty**: User never directly interacts with Google Drive or n8n. They just upload to your website, and everything else is automated! 🚀

