
## API-Driven Social Media Posting System

```
┌─────────────────────────────────────────────────────────────────────┐
│                         YOUR INTEGRATIONS                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Your App  │  Website  │  Mobile  │  Zapier  │  Discord  │ Scripts │
│  or CLI    │  Form     │  App     │  Make.com│  Bot     │  cron   │
│                                                                       │
│                                                                       │
└──────────────────┬──────────────────────────────────────────────────┘
                   │
                   │  POST Request
                   │  {
                   │    "driveLink": "...",
                   │    "title": "...",
                   │    "caption": "..."
                   │  }
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    N8N WORKFLOW (WEBHOOK)                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  1. API Webhook Trigger  ─────────────────────────┐                 │
│     (Receives POST)                               │                 │
│                                                   ▼                 │
│  2. Extract API Data                        ┌─────────────┐         │
│     (Parse driveLink, title, caption)       │ Validate    │         │
│                                             │ Input       │         │
│                                             └──────┬──────┘         │
│                                                    │                 │
│                                                    ▼                 │
│  3. Upload to Blotato ◀────────────────────────────┘               │
│     (Download from Google Drive)                                    │
│                                                    │                 │
│                                                    ▼                 │
│  4. Post to Social Platforms                                        │
│     (With random 1-2 min delays between each)                       │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                   │
    ┌──────────────┼──────────────┬──────────────┬──────────────┐
    │              │              │              │              │
    ▼              ▼              ▼              ▼              ▼
 ┌─────┐       ┌────────┐    ┌──────┐      ┌─────────┐    ┌────────┐
 │     │       │        │    │      │      │         │    │        │
 │ TikTok  Instagram  YouTube LinkedIn  Facebook   Twitter Threads
 │(4 accts) (4 accts) (2 chs)
 │
 └──────────┬──────────┘
            │
            ▼
 [Your Social Media Accounts]
 ✅ Content Posted!
```

---

## Request Flow Diagram

```
┌──────────────────────────────────────┐
│  Your Application / Tool / Script    │
│  (Zapier, Make.com, Your App, etc)  │
└──────────────┬───────────────────────┘
               │
               │ 1. POST Request with:
               │    - Google Drive Link
               │    - Title
               │    - Caption
               │
               ▼
     ┌─────────────────────┐
     │  Internet / Network │
     └──────────┬──────────┘
                │
                │ 2. HTTPS Request
                │
                ▼
     ┌──────────────────────────┐
     │  Your n8n Server         │
     │  Webhook Endpoint        │
     └──────────┬───────────────┘
                │
                │ 3. Parse Request
                │
                ▼
     ┌──────────────────────────┐
     │  Extract API Data        │
     │  - Get Drive ID          │
     │  - Parse Title           │
     │  - Parse Caption         │
     └──────────┬───────────────┘
                │
                │ 4. Validate
                │
                ▼
     ┌──────────────────────────┐
     │  Download from Drive     │
     │  & Upload to Blotato     │
     └──────────┬───────────────┘
                │
                │ 5. Get Blotato URL
                │
                ▼
     ┌──────────────────────────┐
     │  Create Delay for each   │
     │  social platform (1-2min)│
     └──────────┬───────────────┘
                │
                ├─────────────────────────┐
                │                         │
                ▼                         │
     ┌──────────────────────┐             │
     │ Wait Random Time     │             │
     │ (1-2 minutes)        │             │
     └──────────┬───────────┘             │
                │                         │
                ▼                         │
     ┌──────────────────────┐             │
     │ Post to Platform     │             │
     │ (TikTok, Instagram,  │             │
     │  YouTube, etc)       │             │
     └──────────┬───────────┘             │
                │                         │
                ├─────────────────────────┘
                │
                ▼
     ┌──────────────────────────┐
     │  All Platforms Done      │
     │  ✅ POST SUCCESSFUL      │
     └──────────────────────────┘
```

---

## Data Flow

```
User Input via API
  │
  ├─ driveLink: "https://drive.google.com/file/d/ABC123/view"
  ├─ title: "My Video Title"
  └─ caption: "Amazing content!"
  
  ▼
  
N8N Processing
  │
  ├─ Extract Google Drive ID: "ABC123"
  ├─ Validate inputs
  └─ Download media from Google Drive
  
  ▼
  
Blotato Processing
  │
  ├─ Upload media
  └─ Get Blotato URL
  
  ▼
  
Social Media Posting (Sequential with delays)
  │
  ├─ (Wait 1-2 min) ─→ Post to TikTok
  ├─ (Wait 1-2 min) ─→ Post to Instagram
  ├─ (Wait 1-2 min) ─→ Post to YouTube
  ├─ (Wait 1-2 min) ─→ Post to LinkedIn
  ├─ (Wait 1-2 min) ─→ Post to Facebook
  ├─ (Wait 1-2 min) ─→ Post to Twitter
  └─ (Wait 1-2 min) ─→ Post to Threads
  
  ▼
  
✅ All Posts Complete (~10-15 minutes total)
```

---

## Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     API LAYER                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Webhook Trigger                                          │  │
│  │ Receives: POST /webhook/post-to-social                 │  │
│  │ Returns: { success: bool, data: object }               │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────────┐
│               PROCESSING LAYER                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Data Extraction & Validation                             │  │
│  │ - Parse Google Drive link                                │  │
│  │ - Extract file ID                                        │  │
│  │ - Validate title & caption                               │  │
│  │ - Check for required fields                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Google Drive Integration                                 │  │
│  │ - Download media file                                    │  │
│  │ - Handle file streams                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────────┐
│               UPLOAD LAYER                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Blotato API Integration                                  │  │
│  │ - Upload media                                           │  │
│  │ - Get hosted URL                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────────┐
│           SOCIAL MEDIA POSTING LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Delay Generator & Wait Nodes (for each platform)         │  │
│  │ - Generate random 1-2 minute delay                       │  │
│  │ - Wait before posting                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Platform-Specific Posting                                │  │
│  │ - TikTok posting (4 accounts)                            │  │
│  │ - Instagram posting (4 accounts)                         │  │
│  │ - YouTube posting (2 channels)                           │  │
│  │ - LinkedIn, Facebook, Twitter, Threads (1 each)          │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────────┐
│            ERROR HANDLING & LOGGING                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Error Report Merge Nodes                                 │  │
│  │ - Collect errors from failed posts                       │  │
│  │ - Log execution details                                  │  │
│  │ - Available in execution history                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Timeline Diagram

```
Time Series for Single API Call:

Second 0:      API Request Received
               │
               ├─ Extract data
               ├─ Validate inputs
               ├─ Download from Google Drive
               │
Second 5-10:   Upload to Blotato
               │
               ├─ Generate delays for each platform
               │
Second 15-20:  Generate delay 1-2 min
               │  ╔══════════════════════════════════╗
               │  ║ Wait... 1-2 minutes randomly     ║
               │  ╚══════════════════════════════════╝
               │
Minute 1-3:    Post to TikTok #1
               ├─ Generate delay 1-2 min
               │  ╔══════════════════════════════════╗
               │  ║ Wait... 1-2 minutes randomly     ║
               │  ╚══════════════════════════════════╝
               │
Minute 2-4:    Post to Instagram #1
               ├─ Generate delay 1-2 min
               │  ╔══════════════════════════════════╗
               │  ║ Wait... 1-2 minutes randomly     ║
               │  ╚══════════════════════════════════╝
               │
Minute 3-5:    Post to YouTube #1
               ├─ Generate delay 1-2 min
               │  ╔══════════════════════════════════╗
               │  ║ Wait... 1-2 minutes randomly     ║
               │  ╚══════════════════════════════════╝
               │
...
(Continue for all platforms)
               │
Minute 10-15:  ✅ All Posts Complete!
               
Total Time: ~10-15 minutes for all platforms
```

---

## Deployment Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                   YOUR DOMAIN                                   │
│  (e.g., https://your-n8n-instance.com)                         │
└────────────────────┬───────────────────────────────────────────┘
                     │
        ┌────────────┴──────────────┐
        │                           │
        ▼                           ▼
   ┌─────────┐                 ┌─────────┐
   │ n8n     │                 │ SSL/TLS │
   │ Server  │ ◄───────────────│ Cert    │
   │         │   (HTTPS)       │         │
   └────┬────┘                 └─────────┘
        │
        │ Webhook
        │ /webhook/post-to-social
        │
   ┌────┴────────────────────────────────────┐
   │                                          │
   ▼                                          ▼
┌─────────────┐                      ┌──────────────┐
│ Google      │◄─────DownloadMedia──│  Blotato     │
│ Drive       │       UploadMedia    │ API         │
│             │─────────────────────►│             │
└─────────────┘                      └──────────────┘
                                           │
                                           ▼
                                    ┌──────────────────────┐
                                    │ Social Platforms     │
                                    │ • TikTok             │
                                    │ • Instagram          │
                                    │ • YouTube            │
                                    │ • LinkedIn           │
                                    │ • Facebook           │
                                    │ • Twitter            │
                                    │ • Threads            │
                                    └──────────────────────┘
```

---

## Scalability View

```
Single Request:
┌─────────┐
│ Request │ ─→ Processing ─→ Posting ─→ ✅ Done
└─────────┘    (~10-15 min)

Multiple Sequential Requests:
┌─────────┐
│ Request │ ─→ Processing ─→ Posting ───┐
└─────────┘    (~10-15 min)              │
                                         ▼
                                    ✅ Done
                                    
┌─────────┐
│ Request │ ─→ Processing ─→ Posting ───┐
└─────────┘    (~10-15 min)              │
                                         ▼
                                    ✅ Done
(Queued automatically by n8n)

Concurrent Requests:
┌─────────┐        ┌─────────┐        ┌─────────┐
│Request 1│───────│Request 2│───────│Request 3│
└─────────┘        └─────────┘        └─────────┘
    │                   │                   │
    └─────────┬─────────┴─────────┬─────────┘
              │                   │
        (All run in parallel in separate n8n executions)
```

---

## Security Considerations

```
┌─────────────────────────────────────────────────────┐
│            SECURITY LAYERS                           │
├─────────────────────────────────────────────────────┤
│                                                      │
│ 1. HTTPS Only                                        │
│    └─ All requests encrypted in transit              │
│                                                      │
│ 2. Webhook Validation (Optional)                     │
│    └─ Can add authentication if needed               │
│                                                      │
│ 3. Rate Limiting (Optional)                          │
│    └─ Can limit requests per IP/hour                 │
│                                                      │
│ 4. Google Drive File Access                          │
│    └─ Requires file to be public (you control this)  │
│                                                      │
│ 5. Blotato API Keys                                  │
│    └─ Securely stored in n8n credentials             │
│                                                      │
│ 6. Execution Logs                                    │
│    └─ Only visible to workflow owners                │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## Integration Ecosystem

```
                    ┌──────────────────────┐
                    │ N8N Webhook Endpoint │
                    └──────────┬───────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
    ┌─────────────┐   ┌──────────────┐   ┌─────────────┐
    │ Zapier      │   │ Make.com     │   │ Your App    │
    │ Workflows   │   │ Scenarios    │   │ Backend API │
    └─────────────┘   └──────────────┘   └─────────────┘
          │                    │                    │
          ├────────────────────┼────────────────────┤
          ▼                    ▼                    ▼
    ┌──────────────────────────────────────────────┐
    │ Google Sheets │ Forms │ CMS │ Database       │
    │ Email │ Slack │ Discord │ Custom Sources    │
    └──────────────────────────────────────────────┘
```

---

## Comparison: Before vs After Architecture

```
BEFORE (Scheduled):
┌──────────────────┐
│  Google Sheets   │
│  (Data Source)   │
└────────┬─────────┘
         │
         │ Every 8 hours
         ▼
┌──────────────────┐
│  N8N Scheduled   │
│  Trigger         │
└────────┬─────────┘
         │
         ▼
┌──────────────────────┐
│ Process & Post       │
│ (Time-based)         │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Social Platforms    │
│  Update Sheets       │
└──────────────────────┘


AFTER (API-Driven):
┌──────────────────┐
│ Your Tool/App    │
│ (Any source)     │
└────────┬─────────┘
         │
         │ Instant API Call
         ▼
┌──────────────────┐
│  N8N Webhook     │
│  Trigger         │
└────────┬─────────┘
         │
         ▼
┌──────────────────────┐
│ Process & Post       │
│ (Request-based)      │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Social Platforms    │
│  ✅ Done!            │
└──────────────────────┘
```

---

**Architecture Version:** 1.0  
**Last Updated:** November 1, 2025  
**Status:** ✅ Production Ready
