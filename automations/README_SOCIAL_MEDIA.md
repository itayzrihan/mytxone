# Social Media Manager - README

## 🚀 Quick Start

### What It Does
Upload videos and instantly post them to **14 social media accounts** across **7 platforms** with a single click.

### Access
**URL:** https://mytx.one/social/upload-video  
**Access:** Admin users only

---

## 📋 Prerequisites

### Environment Variables
```bash
N8N_WEBHOOK_URL=https://auto.mytx.co/webhook/post-to-social
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
GOOGLE_DRIVE_FOLDER_ID=your-folder-id
```

### n8n Workflow
Import and activate: `automations/blotato-api-dual-trigger.json`

---

## 🎯 Two Ways to Post

### Path 1: Upload & Post (Recommended)
```
Upload video → Google Drive → Add title/caption → Post to all platforms
Time: 12-20 minutes total
```

### Path 2: Use Existing Link (Quick)
```
Paste Google Drive link → Add title/caption → Post to all platforms
Time: 10-15 minutes total
```

---

## 📱 Supported Platforms

| Platform | Accounts |
|----------|----------|
| TikTok | 4 |
| Instagram | 4 |
| YouTube | 2 |
| LinkedIn | 1 |
| Facebook | 1 |
| Twitter/X | 1 |
| Threads | 1 |
| **TOTAL** | **14** |

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `SOCIAL_MEDIA_MANAGER_QUICK_SETUP.md` | Setup guide (5 min) |
| `SOCIAL_MEDIA_UPLOAD_FLOW.md` | Complete technical docs |
| `SOCIAL_MEDIA_VISUAL_FLOW.txt` | Visual diagrams |
| `IMPLEMENTATION_SUMMARY_SOCIAL_MEDIA_MANAGER.md` | Full summary |

---

## 🛠️ Files Structure

```
app/
├── api/
│   └── social/
│       ├── upload-to-drive/
│       │   └── route.ts          # Google Drive upload API
│       └── post-video/
│           └── route.ts          # Social posting API
└── social/
    └── upload-video/
        └── page.tsx              # Main UI page

components/
└── custom/
    ├── upload-video-form.tsx     # Upload component
    ├── history.tsx               # Updated sidebar
    └── icons.tsx                 # Added ShareIcon

automations/
├── blotato-api-dual-trigger.json # n8n workflow
├── SOCIAL_MEDIA_MANAGER_QUICK_SETUP.md
├── SOCIAL_MEDIA_UPLOAD_FLOW.md
├── SOCIAL_MEDIA_VISUAL_FLOW.txt
├── IMPLEMENTATION_SUMMARY_SOCIAL_MEDIA_MANAGER.md
└── README_SOCIAL_MEDIA.md        # This file
```

---

## 🧪 Testing

### Test Upload Path
1. Login as admin
2. Go to `/social/upload-video`
3. Drag video file
4. Add title: "Test Video"
5. Add caption: "Testing upload"
6. Click "Upload to Google Drive"
7. Wait for success message
8. Click "Post to 13+ Social Media Accounts"
9. Check n8n execution history

### Test Existing Link Path
1. Switch to "Use Existing Link" tab
2. Paste: `https://drive.google.com/file/d/YOUR-FILE-ID/view`
3. Add title and caption
4. Click "Post to 13+ Social Media Accounts"
5. Check n8n execution history

---

## 🐛 Troubleshooting

### Upload Failed
**Cause:** Google Drive credentials issue  
**Fix:** Check `GOOGLE_SERVICE_ACCOUNT_JSON` and folder permissions

### Workflow Trigger Failed
**Cause:** n8n workflow not active or URL wrong  
**Fix:** Activate workflow in n8n, verify `N8N_WEBHOOK_URL`

### Posts Not Appearing
**Cause:** Blotato account disconnected  
**Fix:** Check n8n execution logs, re-authenticate accounts in Blotato

---

## 📞 Support

- **UI Issues:** Check admin access and authentication
- **Upload Issues:** Verify Google Drive configuration
- **Posting Issues:** Check n8n execution history
- **Platform Issues:** Check Blotato account connections

---

## 🎉 Features

✅ Drag & drop video upload  
✅ Real-time progress tracking  
✅ Automatic Google Drive upload  
✅ Public file sharing (auto)  
✅ Dual-path workflow  
✅ 14 social accounts  
✅ 7 platforms  
✅ Error resilience  
✅ Admin-only access  
✅ Glassmorphic UI  
✅ Mobile responsive  

---

## 🔮 Future Enhancements

- [ ] Scheduled posting
- [ ] Platform selection
- [ ] Batch upload
- [ ] Analytics dashboard
- [ ] Caption templates
- [ ] Video editor

---

## 📊 Performance

| Metric | Value |
|--------|-------|
| Upload time | 30s - 2min |
| Processing time | 1-2 min |
| Distribution time | 10-15 min |
| Total time (upload) | 12-20 min |
| Total time (existing) | 10-15 min |

---

## 🔐 Security

- User authentication required (NextAuth)
- Admin authorization enforced
- Service account credentials server-side only
- Google Drive files set to "Anyone with link"
- n8n webhook internal use only

---

## ✅ Status

**Status:** ✅ **PRODUCTION READY**  
**Version:** 1.0.0  
**Last Updated:** November 1, 2025  
**Deployment:** Ready to deploy  
**Testing:** Manual testing complete  

---

## 📖 API Reference

### Upload to Google Drive
```http
POST /api/social/upload-to-drive
Content-Type: multipart/form-data

{
  file: File,
  title: string,
  caption: string,
  fileName: string
}
```

### Post to Social Media
```http
POST /api/social/post-video
Content-Type: application/json

{
  "driveLink": "https://drive.google.com/file/d/...",
  "title": "Video Title",
  "caption": "Video Caption",
  "source": "upload" | "existing"
}
```

---

## 🎯 Quick Commands

### Test API with cURL
```bash
curl -X POST http://localhost:3000/api/social/post-video \
  -H "Content-Type: application/json" \
  -d '{
    "driveLink": "https://drive.google.com/file/d/ABC123/view",
    "title": "Test Video",
    "caption": "Test Caption"
  }'
```

### Test API with PowerShell
```powershell
$body = @{
    driveLink="https://drive.google.com/file/d/ABC123/view"
    title="Test Video"
    caption="Test Caption"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/social/post-video" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

---

**Made with ❤️ for mytx.one**  
**Happy Posting! 🚀**
