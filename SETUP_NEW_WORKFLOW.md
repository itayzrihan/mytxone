# Setup: Deploy New API Workflow to n8n

## Current Status
❌ Webhook not yet active - The `blotato-api.json` workflow needs to be deployed to your n8n instance

## Steps to Deploy

### Step 1: Go to Your n8n Instance
Open: **https://auto.mytx.co/**

### Step 2: Import the New Workflow

1. Click on **"+ New"** button or go to **Workflows**
2. Click **"Import from file"** or **"Import from URL"**
3. Choose one of these options:

#### Option A: Import from File (Recommended)
1. Download `blotato-api.json` from your workspace
2. In n8n: Click **"Import"** → Select the file → Click **"Import"**

#### Option B: Import from Code
1. Open n8n
2. Click the menu icon (3 dots) in the top-left
3. Click **"Import"** → **"From Text"**
4. Copy the entire contents of `blotato-api.json`
5. Paste and click **"Import"**

### Step 3: Verify the Workflow

After importing, you should see:
- ✅ **API Webhook Trigger** node (lightning bolt icon)
- ✅ **Extract API Data** node
- ✅ **Validate Input** node
- ✅ **Upload Image/Video to BLOTATO** node
- ✅ Multiple platform-specific nodes (TikTok, Instagram, YouTube, etc.)

### Step 4: Activate the Workflow

1. In the top-right corner, find the **toggle button**
2. Click it to turn the workflow **ON** (should turn blue/green)
3. You should see: **"Workflow is now active"**

### Step 5: Get Your Webhook URL

1. Click on the **"API Webhook Trigger"** node (first node on the left)
2. Click the **"Webhook"** tab on the right panel
3. You should see:
   - **Webhook URL**: `https://auto.mytx.co/webhook/post-to-social`
   - Copy this URL - you'll use it for API calls

### Step 6: Test the Webhook

Once activated, test with this command:

**PowerShell:**
```powershell
$body = @{
    driveLink = "https://drive.google.com/file/d/12RWEwBnjrro7_0eqgIlmwfPs7-sEUAqc/view?usp=drive_link"
    title = "כוחו של השם הפרטי"
    caption = "כוחו של השם הפרטי – איך שימוש בשם יוצר חיבור מיידי והשפעה רגשית."
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://auto.mytx.co/webhook/post-to-social" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

**OR cURL (if available):**
```bash
curl -X POST https://auto.mytx.co/webhook/post-to-social \
  -H "Content-Type: application/json" \
  -d '{"driveLink":"https://drive.google.com/file/d/12RWEwBnjrro7_0eqgIlmwfPs7-sEUAqc/view?usp=drive_link","title":"כוחו של השם הפרטי","caption":"כוחו של השם הפרטי – איך שימוש בשם יוצר חיבור מיידי והשפעה רגשית."}'
```

### Step 7: Monitor Execution

1. In n8n, click the **"Execution history"** tab
2. Click on any execution to see:
   - ✅ Which platforms succeeded
   - ⚠️ Any errors
   - ⏱️ Processing time
   - 📊 Detailed logs for each step

---

## Troubleshooting

### "Workflow is not active"
→ Make sure to toggle the workflow ON (blue/green toggle in top-right)

### "Webhook not registered"
→ The workflow needs to be active first. Toggle it ON.

### "Can't find API Webhook Trigger node"
→ Make sure you imported the correct `blotato-api.json` file

### "Error uploading to Blotato"
→ Check your Blotato credentials in n8n:
1. Click any BLOTATO node
2. Verify the credentials are correct
3. Check that your Blotato API key is valid

### "File not accessible"
→ Make sure your Google Drive file is set to "Public":
1. Right-click the file in Google Drive
2. Click "Share"
3. Change to "Anyone with the link" → "Viewer"

---

## File Details

**Your New Workflow:**
- 📄 File: `blotato-api.json`
- 📍 Location: `d:\Ordered\DEV\mytx.one\automations\blotato-api.json`
- 🔧 Trigger: API Webhook (not scheduled)
- 📤 Output: Posts to 7+ social platforms

**Your Video:**
- 🎥 Title: כוחו של השם הפרטי
- 📝 Caption: כוחו של השם הפרטי – איך שימוש בשם יוצר חיבור מיידי והשפעה רגשית.
- 🔗 Google Drive: https://drive.google.com/file/d/12RWEwBnjrro7_0eqgIlmwfPs7-sEUAqc/view?usp=drive_link

---

## Next Steps

1. ✅ Deploy the workflow
2. ✅ Activate it (toggle ON)
3. ✅ Get your webhook URL
4. ✅ Test with your video
5. ✅ Monitor execution history
6. ✅ See posts appear on all platforms

---

**Once workflow is active, come back and run the test command!**

Last Updated: November 1, 2025
