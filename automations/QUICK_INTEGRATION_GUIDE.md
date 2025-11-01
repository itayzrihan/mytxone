# Quick Integration Guide

## 🚀 Quick Start (5 minutes)

### Step 1: Get Your Webhook URL

1. Open n8n
2. Go to Workflows → "Blotato Social Media Poster"
3. Click **"API Webhook Trigger"** node (lightning bolt icon on the left)
4. Click the **"Webhook"** tab
5. Copy the URL under "Webhook URL"

Example: `https://your-n8n-instance.com/webhook/post-to-social`

---

### Step 2: Make Your First API Call

Replace `YOUR_WEBHOOK_URL` and add your Google Drive link:

```bash
curl -X POST YOUR_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{
    "driveLink": "https://drive.google.com/file/d/YOUR_FILE_ID/view",
    "title": "My First Video",
    "caption": "Posted via API! 🚀"
  }'
```

**Done!** Your video is now posting to all platforms automatically.

---

## 📱 Integration Methods

### Method 1: Simple HTML Button

Create a simple form on your website:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Post to Social Media</title>
</head>
<body>
    <h1>Post to All Platforms</h1>
    <form id="postForm">
        <input type="text" id="driveLink" placeholder="Google Drive Link" required>
        <input type="text" id="title" placeholder="Video Title" required>
        <textarea id="caption" placeholder="Caption/Description" required></textarea>
        <button type="submit">Post to All Platforms</button>
    </form>

    <script>
        document.getElementById('postForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const data = {
                driveLink: document.getElementById('driveLink').value,
                title: document.getElementById('title').value,
                caption: document.getElementById('caption').value
            };

            const response = await fetch('YOUR_WEBHOOK_URL', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            alert(result.success ? 'Posted successfully!' : 'Error: ' + result.error);
        });
    </script>
</body>
</html>
```

---

### Method 2: Node.js Backend

```javascript
// server.js
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Your webhook URL (store in environment variable)
const WEBHOOK_URL = process.env.WEBHOOK_URL;

app.post('/api/post-to-social', async (req, res) => {
    try {
        const { driveLink, title, caption } = req.body;

        const response = await axios.post(WEBHOOK_URL, {
            driveLink,
            title,
            caption
        });

        res.json({ success: true, data: response.data });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

Usage:
```bash
curl -X POST http://localhost:3000/api/post-to-social \
  -H "Content-Type: application/json" \
  -d '{
    "driveLink": "https://drive.google.com/file/d/...",
    "title": "My Video",
    "caption": "Check it out!"
  }'
```

---

### Method 3: Python Flask

```python
from flask import Flask, request, jsonify
import requests

app = Flask(__name__)
WEBHOOK_URL = "YOUR_WEBHOOK_URL"

@app.route('/api/post-to-social', methods=['POST'])
def post_to_social():
    try:
        data = request.json
        response = requests.post(WEBHOOK_URL, json={
            'driveLink': data['driveLink'],
            'title': data['title'],
            'caption': data['caption']
        })
        return jsonify({'success': True, 'data': response.json()})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=3000)
```

---

### Method 4: Discord Bot

```python
import discord
import requests
from discord.ext import commands

bot = commands.Bot(command_prefix='!')
WEBHOOK_URL = "YOUR_WEBHOOK_URL"

@bot.command(name='post')
async def post_to_social(ctx, drive_link, title, *, caption):
    try:
        response = requests.post(WEBHOOK_URL, json={
            'driveLink': drive_link,
            'title': title,
            'caption': caption
        })
        
        if response.json()['success']:
            await ctx.send(f"✅ Posted successfully!")
        else:
            await ctx.send(f"❌ Error: {response.json()['error']}")
    except Exception as e:
        await ctx.send(f"❌ Error: {str(e)}")

bot.run('YOUR_DISCORD_TOKEN')
```

Usage: `!post "https://drive.google.com/file/d/..." "Title" "Caption"`

---

### Method 5: Zapier Automation

1. Go to **Zapier.com** → Create a new Zap
2. **Trigger**: Choose anything (Form submission, Gmail, Spreadsheet update, etc.)
3. **Action**: Search for "Webhooks by Zapier" → **POST**
4. Configure:
   - **URL**: `YOUR_WEBHOOK_URL`
   - **Method**: POST
   - **Data**:
     ```
     driveLink: [select field from trigger]
     title: [select or type]
     caption: [select or type]
     ```
5. Test & Turn on

---

### Method 6: Make.com (formerly Integromat)

1. Go to **Make.com** → Create new scenario
2. Add **Trigger**: Choose your trigger source
3. Add **Module**: Search "HTTP" → Select "Make a request"
4. Configure:
   - **URL**: `YOUR_WEBHOOK_URL`
   - **Method**: POST
   - **Headers**: Add `Content-Type: application/json`
   - **Body**: 
     ```json
     {
       "driveLink": "value",
       "title": "value",
       "caption": "value"
     }
     ```
5. Map fields from your trigger
6. Save & Test

---

### Method 7: Google Sheets Script

```javascript
// Add this to Google Sheets script editor
function postToSocial(driveLink, title, caption) {
  const webhookUrl = "YOUR_WEBHOOK_URL";
  
  const payload = {
    driveLink: driveLink,
    title: title,
    caption: caption
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  };

  const response = UrlFetchApp.fetch(webhookUrl, options);
  return response.getContentText();
}

// Usage in sheet: =postToSocial(A1,B1,C1)
```

Then use in spreadsheet:
```
=postToSocial(A2, B2, C2)
```

---

### Method 8: IFTTT (If This Then That)

1. Go to **IFTTT.com** → Create new applet
2. **If**: Choose trigger (Gmail, Slack, Form submission, etc.)
3. **Then**: Search "Webhooks"
4. Select "Make a web request"
5. Configure:
   - **URL**: `YOUR_WEBHOOK_URL`
   - **Method**: POST
   - **Content Type**: application/json
   - **Body**:
     ```json
     {"driveLink": "VALUE", "title": "VALUE", "caption": "VALUE"}
     ```

---

## 🔧 Environment Variables

Store sensitive data safely:

### .env file
```
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/post-to-social
```

### Access in your code

**Node.js:**
```javascript
require('dotenv').config();
const webhookUrl = process.env.N8N_WEBHOOK_URL;
```

**Python:**
```python
import os
from dotenv import load_dotenv

load_dotenv()
webhook_url = os.getenv('N8N_WEBHOOK_URL')
```

---

## ✅ Testing Checklist

Before using in production:

- [ ] Got your webhook URL from n8n
- [ ] Tested with cURL or Postman
- [ ] Google Drive file is public (shareable link)
- [ ] File size is under 60MB
- [ ] Title and caption are not empty
- [ ] All social accounts are connected in Blotato
- [ ] n8n workflow toggle is ON
- [ ] Check execution logs for any errors

---

## 📊 Monitor Your Posts

### View in n8n

1. Open your workflow
2. Click "**Execution history**" tab
3. Click on any execution to see details:
   - Which platforms succeeded
   - Any errors
   - Processing time
   - Response data

### View in Blotato

1. Go to **my.blotato.com**
2. Click "**API Dashboard**"
3. See post history and any failures

---

## 🛠️ Troubleshooting

### "Webhook not found"
- Make sure the workflow is active (toggle ON in n8n)
- Copy the exact webhook URL from the API Webhook Trigger node

### "Invalid Google Drive link"
- Use full URL: `https://drive.google.com/file/d/FILE_ID/view`
- Not just the file ID

### "File not accessible"
- Right-click file in Google Drive
- Click Share
- Change to "Anyone with the link" → "Viewer"

### "Platform posting failed"
- Check Blotato account is connected
- Check social media account credentials in Blotato
- Wait 5-10 minutes (posts queue automatically)

---

## 📞 Support

- **Blotato Help**: Log into Blotato.com → Click Support (bottom right)
- **n8n Docs**: https://docs.n8n.io
- **API Issues**: Check n8n execution logs

---

**Last Updated:** November 1, 2025
