# Social Media Auto-Poster API Documentation

## Overview

This API endpoint allows you to trigger automatic posting of videos/images to all your social media platforms with a single API call. The system will:

1. Accept your Google Drive link, title, and caption
2. Extract the Google Drive file ID
3. Upload the media to Blotato
4. Post to all configured social platforms with automatic delays between posts
5. Return a success/error response

---

## Endpoint

**URL:** `https://your-n8n-instance.com/webhook/post-to-social`

**Method:** `POST`

**Content-Type:** `application/json`

---

## Request Format

### Basic Request

```json
{
  "driveLink": "https://drive.google.com/file/d/YOUR_FILE_ID/view",
  "title": "Your Video Title",
  "caption": "Your caption or description for social posts"
}
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `driveLink` | String | ✅ Yes | Full Google Drive link to your video or image. Example: `https://drive.google.com/file/d/1ABC123/view?usp=sharing` |
| `title` | String | ✅ Yes | Title of your video (used for YouTube). Can be any text. |
| `caption` | String | ✅ Yes | Caption/description to post on social platforms. Used for all platforms except YouTube. |

---

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Post queued successfully",
  "data": {
    "title": "Your Video Title",
    "caption": "Your caption",
    "driveId": "YOUR_FILE_ID",
    "timestamp": "2025-11-01T12:00:00Z"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Invalid Google Drive link format",
  "message": "Please provide a valid Google Drive URL"
}
```

---

## Example API Calls

### Using cURL

```bash
curl -X POST https://your-n8n-instance.com/webhook/post-to-social \
  -H "Content-Type: application/json" \
  -d '{
    "driveLink": "https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view",
    "title": "My Amazing Video",
    "caption": "Check out this new video! 🎥 #socialmedia #content"
  }'
```

### Using JavaScript (Fetch API)

```javascript
const postToSocial = async () => {
  const response = await fetch('https://your-n8n-instance.com/webhook/post-to-social', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      driveLink: 'https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view',
      title: 'My Amazing Video',
      caption: 'Check out this new video! 🎥 #socialmedia #content'
    })
  });

  const data = await response.json();
  console.log(data);
};

postToSocial();
```

### Using Python (requests)

```python
import requests
import json

url = 'https://your-n8n-instance.com/webhook/post-to-social'
payload = {
    'driveLink': 'https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view',
    'title': 'My Amazing Video',
    'caption': 'Check out this new video! 🎥 #socialmedia #content'
}

response = requests.post(url, json=payload)
print(response.json())
```

### Using Node.js (axios)

```javascript
const axios = require('axios');

const postToSocial = async () => {
  try {
    const response = await axios.post('https://your-n8n-instance.com/webhook/post-to-social', {
      driveLink: 'https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view',
      title: 'My Amazing Video',
      caption: 'Check out this new video! 🎥 #socialmedia #content'
    });
    
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
};

postToSocial();
```

### Using Postman

1. Create a new POST request
2. Set URL to: `https://your-n8n-instance.com/webhook/post-to-social`
3. Go to "Body" tab → Select "raw" → Select "JSON" from dropdown
4. Paste:
```json
{
  "driveLink": "https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view",
  "title": "My Amazing Video",
  "caption": "Check out this new video! 🎥 #socialmedia #content"
}
```
5. Click "Send"

---

## Google Drive Link Examples

### Valid Formats

✅ `https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view`

✅ `https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view?usp=sharing`

✅ `https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J`

❌ `https://drive.google.com/drive/folders/1A2B3C4D5E6F7G8H9I0J` (This is a folder, not a file)

❌ `1A2B3C4D5E6F7G8H9I0J` (File ID alone won't work)

---

## Important Requirements

### Google Drive Setup

1. **File Must Be Public**: The video/image file in Google Drive must be set to "Anyone with the link can view"
   - Right-click file → Share → Change to "Viewer" access → "Anyone with the link"

2. **File Size Limit**: Maximum 60MB
   - For larger files, use Amazon S3 instead (contact Blotato support)

3. **Supported Formats**: MP4, WebM, OGG, MOV, MKV, AVI, FLV, WMV (video)
   - JPEG, PNG, GIF, WebP, SVG (images)

### Caption & Title Tips

- **Title** (used for YouTube): 100-200 characters recommended
- **Caption** (used for all platforms): 280-1000 characters works best
- Include relevant hashtags and emojis for better engagement
- Different platforms have different requirements (Twitter = 280 chars max, Instagram = unlimited)
- The system automatically adapts content for platform-specific limits

---

## Platform-Specific Information

### Posting Locations

Your content will be posted to:

- ✅ **TikTok** (4 accounts)
  - itay_zrihan
  - itay_tech
  - itay.zrihan (Not warmed up yet - limited posts)
  - itaythespammer

- ✅ **Instagram** (4 accounts)
  - itay_zrihan (Official)
  - itay.zrihan
  - itay_chi
  - sales_growth_digital

- ✅ **YouTube** (2 channels)
  - Itay Zrihan
  - Mytx

- ✅ **LinkedIn** (1 account)
  - Itay Zrihan

- ✅ **Facebook** (1 account)
  - Blotato page

- ✅ **Twitter/X** (1 account)
  - ItayZn

- ✅ **Threads** (1 account)
  - itay_zrihan

### Posting Delays

To avoid platform throttling and maintain engagement:
- Random 1-2 minute delays between platform posts
- Posts flow: TikTok → Instagram → YouTube → LinkedIn → Facebook → Twitter → Threads
- Total posting time: ~10-15 minutes

---

## Workflow Steps

When you send an API request, here's what happens:

```
1. API Request Received
   ↓
2. Extract Google Drive ID from link
   ↓
3. Extract Title & Caption
   ↓
4. Validate Inputs
   ↓
5. Download from Google Drive
   ↓
6. Upload to Blotato
   ↓
7. Post to each platform with delays:
   - Generate random delay (1-2 min)
   - Wait
   - Post
   - Repeat for next platform
   ↓
8. Error tracking for failed posts
```

---

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid Google Drive link format" | Link doesn't match expected pattern | Use the full Google Drive URL, not just the ID |
| "File not found or not accessible" | File is private or deleted | Make file public and ensure link is correct |
| "File too large" | Video/image > 60MB | Compress file or use S3 instead |
| "Invalid caption" | Empty or malformed caption field | Provide a non-empty caption string |
| "Blotato API error" | Issue uploading to Blotato | Check Blotato dashboard at my.blotato.com |

### Retry Behavior

- **Automatic retries**: Some platforms auto-retry failed posts 2-3 times
- **Manual retry**: Send the API request again if you see errors
- **Check errors**: View error logs in your n8n workflow execution history

---

## Rate Limiting

Currently: **No rate limit** (feel free to test!)

In production, consider limiting to:
- 1 request per minute to prevent overwhelming the system
- 100 requests per hour
- Contact your n8n admin for custom limits

---

## Getting Your Webhook URL

To find your full webhook URL:

1. Open your n8n instance
2. Open this workflow ("Blotato Social Media Poster")
3. Click "API Webhook Trigger" node
4. Click the "Webhook" tab
5. Copy the full URL

The URL format is: `https://your-n8n-instance.com/webhook/post-to-social`

---

## Monitoring & Debugging

### View Execution Logs

1. In n8n, go to "Execution history"
2. Click on the execution timestamp
3. See details of each step:
   - Which platforms succeeded
   - Error messages for failures
   - Upload URL from Blotato
   - Processing time

### Troubleshooting Checklist

- [ ] Google Drive file is set to "Public" (Anyone with link)
- [ ] Google Drive link is valid and file still exists
- [ ] File size is under 60MB
- [ ] Title is not empty
- [ ] Caption is not empty
- [ ] n8n workflow is active (check toggle in top-right)
- [ ] All social platform accounts are connected in Blotato
- [ ] Blotato API key is valid (check credentials)

---

## Support

### Need Help?

1. **Blotato Issues**: Log into Blotato.com → Click "Support" button (bottom right)
2. **n8n Issues**: Check n8n documentation at docs.n8n.io
3. **API Issues**: Check the error message in execution logs

### Dashboard Links

- **Blotato API Dashboard**: https://my.blotato.com/api-dashboard
- **Blotato Platform Docs**: https://help.blotato.com
- **Blotato Media Requirements**: https://help.blotato.com/api/media

---

## Advanced: Integration Examples

### Integration with Your App

If you have your own application, you can call this webhook from:

- **WordPress**: Use "Webhooks" plugin
- **Zapier**: Create a "Webhook by Zapier" action
- **Make (formerly Integromat)**: Use HTTP module
- **Custom Backend**: Make a simple POST request
- **Mobile App**: Use native networking libraries

### Zapier Integration Example

1. Create a Zap trigger (form submission, database update, etc.)
2. Add action: "Webhooks by Zapier" → "POST"
3. URL: `https://your-n8n-instance.com/webhook/post-to-social`
4. Data:
```json
{
  "driveLink": "YOUR_GOOGLE_DRIVE_URL",
  "title": "YOUR_TITLE",
  "caption": "YOUR_CAPTION"
}
```

---

## Version History

- **v1.0** (Nov 2025): Initial release
  - API-driven posting
  - Support for 7+ social platforms
  - Automatic delays between posts
  - Error tracking

---

**Last Updated:** November 1, 2025
