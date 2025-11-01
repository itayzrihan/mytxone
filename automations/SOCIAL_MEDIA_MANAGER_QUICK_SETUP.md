# Social Media Manager - Quick Setup Guide

## ⚡ 5-Minute Setup

### Step 1: Add Environment Variables
Add to `.env.local`:
```bash
# n8n Webhook
N8N_WEBHOOK_URL=https://auto.mytx.co/webhook/post-to-social

# Google Drive Setup
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account",...full JSON here...}
GOOGLE_DRIVE_FOLDER_ID=your-folder-id-here
```

### Step 2: Import n8n Workflow
1. Go to https://auto.mytx.co/
2. Click "Import from File"
3. Select `automations/blotato-api-dual-trigger.json`
4. Click "Import"
5. Toggle workflow **ON** (blue/green toggle in top-right)

### Step 3: Test the System
```bash
# Test upload path
1. Login as admin
2. Go to /social/upload-video
3. Upload a video
4. Click "Post to Social Media"

# Test existing link path
1. Switch to "Use Existing Link" tab
2. Paste a Google Drive link
3. Add title and caption
4. Click "Post to Social Media"
```

### Step 4: Verify Posting
- Open n8n: https://auto.mytx.co/
- Click "Executions" tab
- Watch workflow execute (10-15 minutes)
- Check social media accounts for posts

---

## 🔑 Google Drive Service Account Setup

### Create Service Account
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select/Create Project
3. Enable "Google Drive API"
4. Create Service Account:
   - **IAM & Admin** → **Service Accounts**
   - Click "Create Service Account"
   - Name: `mytx-social-uploader`
   - Click "Create and Continue"
5. Generate JSON Key:
   - Click on created service account
   - **Keys** tab → **Add Key** → **Create New Key**
   - Select **JSON**
   - Download file

### Share Google Drive Folder
1. Create folder in Google Drive
2. Right-click → **Share**
3. Add service account email (from JSON: `client_email`)
4. Set permission: **Editor**
5. Copy folder ID from URL:
   - URL: `https://drive.google.com/drive/folders/1A2B3C4D5E6F7G8H9I0J`
   - Folder ID: `1A2B3C4D5E6F7G8H9I0J`

### Add to Environment
```bash
# Copy entire JSON content (one line, no line breaks)
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"...","private_key_id":"..."}

# Use folder ID from URL
GOOGLE_DRIVE_FOLDER_ID=1A2B3C4D5E6F7G8H9I0J
```

---

## 🚀 Usage Examples

### PowerShell: Direct API Call
```powershell
# Post existing Google Drive link
$body = ConvertTo-Json @{
    driveLink="https://drive.google.com/file/d/YOUR-FILE-ID/view"
    title="My Video Title"
    caption="Video description here"
} -Depth 10

Invoke-WebRequest -Uri "http://localhost:3000/api/social/post-video" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body `
    -UseBasicParsing
```

### cURL: Direct API Call
```bash
curl -X POST http://localhost:3000/api/social/post-video \
  -H "Content-Type: application/json" \
  -d '{
    "driveLink": "https://drive.google.com/file/d/YOUR-FILE-ID/view",
    "title": "My Video Title",
    "caption": "Video description here"
  }'
```

### JavaScript: From Web App
```javascript
async function postToSocial(driveLink, title, caption) {
  const response = await fetch('/api/social/post-video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ driveLink, title, caption, source: 'existing' })
  });
  
  const data = await response.json();
  console.log('Posted to platforms:', data.platforms);
  return data;
}
```

---

## 📱 Access Points

### UI Access (Admin Only)
1. Login to mytx.one
2. Open sidebar menu (☰)
3. Click **"Social Media Manager"**
4. Choose upload path

### API Access (Programmatic)
```
POST /api/social/post-video
Content-Type: application/json

{
  "driveLink": "https://drive.google.com/file/d/...",
  "title": "Video Title",
  "caption": "Video Caption"
}
```

### n8n Webhook (External)
```
POST https://auto.mytx.co/webhook/post-to-social
Content-Type: application/json

{
  "driveLink": "https://drive.google.com/file/d/...",
  "title": "Video Title",
  "caption": "Video Caption"
}
```

---

## ✅ Checklist

**Environment Setup:**
- [ ] `N8N_WEBHOOK_URL` added to `.env.local`
- [ ] Google Service Account created
- [ ] `GOOGLE_SERVICE_ACCOUNT_JSON` added to `.env.local`
- [ ] Google Drive folder created and shared
- [ ] `GOOGLE_DRIVE_FOLDER_ID` added to `.env.local`

**n8n Configuration:**
- [ ] Workflow imported: `blotato-api-dual-trigger.json`
- [ ] Workflow activated (toggle ON)
- [ ] Blotato credentials configured
- [ ] Webhook URL accessible

**UI Testing:**
- [ ] Can access `/social/upload-video` as admin
- [ ] Video upload works (Path 1)
- [ ] Existing link works (Path 2)
- [ ] Posts trigger successfully

**Platform Verification:**
- [ ] TikTok accounts (4) connected in Blotato
- [ ] Instagram accounts (4) connected in Blotato
- [ ] YouTube channels (2) connected in Blotato
- [ ] LinkedIn, Facebook, Twitter, Threads connected

---

## 🎯 Supported Platforms

✅ **TikTok** (4 accounts)
- itay_zrihan
- itay_tech
- itay.zrihan
- itaythespammer

✅ **Instagram** (4 accounts)
- itay_zrihan
- itay.zrihan
- itay_chi
- sales_growth_digital

✅ **YouTube** (2 channels)
- Itay Zrihan
- Mytx

✅ **Other Platforms** (1 each)
- LinkedIn
- Facebook
- Twitter/X
- Threads

**Total:** 14 social media accounts

---

## 🐛 Common Issues

### "Upload failed" → Check Google credentials
```bash
# Verify service account JSON is valid
echo $GOOGLE_SERVICE_ACCOUNT_JSON | python -m json.tool

# Verify folder ID
echo $GOOGLE_DRIVE_FOLDER_ID
```

### "Workflow trigger failed" → Check n8n
```bash
# Test webhook directly
curl -X POST https://auto.mytx.co/webhook/post-to-social \
  -H "Content-Type: application/json" \
  -d '{"driveLink":"test","title":"test","caption":"test"}'

# Should return: {"message":"Workflow was started"}
```

### "Posts not appearing" → Check Blotato
1. Go to n8n executions
2. Find recent execution
3. Check error messages
4. Verify platform connections in Blotato

---

## 📊 Expected Timeline

| Step | Duration |
|------|----------|
| Upload to Google Drive | 30 sec - 2 min |
| n8n workflow trigger | Instant |
| Blotato video upload | 1-2 min |
| Post to all platforms | 10-15 min |
| **Total Time** | **12-20 min** |

*Note: Platforms post with staggered 1-2 minute delays to avoid rate limiting*

---

## 🎉 You're Ready!

The Social Media Manager is now set up and ready to:
- ✅ Upload videos to Google Drive
- ✅ Post to 14 social accounts automatically
- ✅ Handle both new uploads and existing links
- ✅ Track progress and status

**Next Steps:**
1. Upload your first test video
2. Verify posts appear on all platforms
3. Start using it for production content!

🚀 **Happy Posting!**
