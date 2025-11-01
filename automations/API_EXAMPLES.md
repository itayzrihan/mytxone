# API Examples & Code Snippets

Copy and paste these directly into your project!

---

## 🔗 Replace `YOUR_WEBHOOK_URL` with your actual webhook URL

Get it from n8n → Open workflow → Click "API Webhook Trigger" node → Copy URL from Webhook tab

---

## Example 1: Simple cURL (Terminal/Command Line)

### Basic Usage
```bash
curl -X POST YOUR_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{
    "driveLink": "https://drive.google.com/file/d/1ABC123/view",
    "title": "My Video Title",
    "caption": "Check out this amazing content!"
  }'
```

### With Multiple Videos (Batch)
```bash
#!/bin/bash

WEBHOOK_URL="YOUR_WEBHOOK_URL"

# Array of videos
declare -a videos=(
    "https://drive.google.com/file/d/ID1/view|Video 1 Title|Caption 1"
    "https://drive.google.com/file/d/ID2/view|Video 2 Title|Caption 2"
    "https://drive.google.com/file/d/ID3/view|Video 3 Title|Caption 3"
)

for video in "${videos[@]}"; do
    IFS='|' read -r driveLink title caption <<< "$video"
    
    echo "Posting: $title"
    
    curl -X POST "$WEBHOOK_URL" \
      -H "Content-Type: application/json" \
      -d "{
        \"driveLink\": \"$driveLink\",
        \"title\": \"$title\",
        \"caption\": \"$caption\"
      }"
    
    echo "✓ Posted: $title"
    sleep 2
done

echo "All posts completed!"
```

---

## Example 2: JavaScript (Browser / Node.js)

### Basic Fetch
```javascript
const postToSocial = async () => {
  const data = {
    driveLink: 'https://drive.google.com/file/d/1ABC123/view',
    title: 'My Video Title',
    caption: 'Check out this amazing content!'
  };

  const response = await fetch('YOUR_WEBHOOK_URL', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  const result = await response.json();
  console.log(result);
};

postToSocial();
```

### With Error Handling
```javascript
const postToSocial = async (driveLink, title, caption) => {
  try {
    const response = await fetch('YOUR_WEBHOOK_URL', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ driveLink, title, caption })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Posted successfully!');
      return result;
    } else {
      console.error('❌ Error:', result.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return null;
  }
};

// Usage
postToSocial(
  'https://drive.google.com/file/d/1ABC123/view',
  'My Video',
  'Amazing content!'
);
```

### Express.js Backend
```javascript
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

const WEBHOOK_URL = 'YOUR_WEBHOOK_URL';

app.post('/api/post-video', async (req, res) => {
  try {
    const { driveLink, title, caption } = req.body;

    // Validate inputs
    if (!driveLink || !title || !caption) {
      return res.status(400).json({ 
        error: 'Missing required fields: driveLink, title, caption' 
      });
    }

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ driveLink, title, caption })
    });

    const result = await response.json();
    res.json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### React Component
```jsx
import React, { useState } from 'react';

export default function PostToSocial() {
  const [driveLink, setDriveLink] = useState('');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('YOUR_WEBHOOK_URL', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driveLink, title, caption })
      });

      const result = await response.json();

      if (result.success) {
        setMessage('✅ Posted to all platforms!');
        setDriveLink('');
        setTitle('');
        setCaption('');
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Post to All Social Platforms</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Google Drive Link:</label>
          <input
            type="url"
            value={driveLink}
            onChange={(e) => setDriveLink(e.target.value)}
            placeholder="https://drive.google.com/file/d/..."
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Video Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter video title"
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Caption:</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Enter caption/description"
            required
            style={{ width: '100%', padding: '8px', minHeight: '100px' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Posting...' : 'Post to All Platforms'}
        </button>
      </form>

      {message && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24',
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}
    </div>
  );
}
```

---

## Example 3: Python

### Basic Usage
```python
import requests
import json

webhook_url = 'YOUR_WEBHOOK_URL'

payload = {
    'driveLink': 'https://drive.google.com/file/d/1ABC123/view',
    'title': 'My Video Title',
    'caption': 'Check out this amazing content!'
}

response = requests.post(webhook_url, json=payload)
result = response.json()

if result.get('success'):
    print('✅ Posted successfully!')
else:
    print(f"❌ Error: {result.get('error')}")
```

### With Error Handling
```python
import requests
import json
from datetime import datetime

def post_to_social(drive_link, title, caption):
    """Post a video to all social platforms"""
    
    webhook_url = 'YOUR_WEBHOOK_URL'
    
    payload = {
        'driveLink': drive_link,
        'title': title,
        'caption': caption
    }
    
    try:
        response = requests.post(
            webhook_url,
            json=payload,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                print(f"✅ [{datetime.now()}] Posted successfully!")
                print(f"   Title: {title}")
                return True
            else:
                print(f"❌ Error: {result.get('error')}")
                return False
        else:
            print(f"❌ HTTP Error {response.status_code}")
            return False
            
    except requests.exceptions.Timeout:
        print("❌ Request timed out")
        return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

# Usage
success = post_to_social(
    'https://drive.google.com/file/d/1ABC123/view',
    'My Video Title',
    'Check out this amazing content!'
)
```

### Batch Processing from CSV
```python
import csv
import requests
import time

webhook_url = 'YOUR_WEBHOOK_URL'

# Read from CSV file
with open('videos.csv', 'r') as file:
    reader = csv.DictReader(file)
    
    for row in reader:
        drive_link = row['drive_link']
        title = row['title']
        caption = row['caption']
        
        payload = {
            'driveLink': drive_link,
            'title': title,
            'caption': caption
        }
        
        print(f"Posting: {title}")
        
        response = requests.post(webhook_url, json=payload)
        result = response.json()
        
        if result.get('success'):
            print(f"✅ Posted: {title}")
        else:
            print(f"❌ Error: {result.get('error')}")
        
        time.sleep(2)  # Wait 2 seconds between posts

print("All videos processed!")
```

### Flask API Wrapper
```python
from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

WEBHOOK_URL = 'YOUR_WEBHOOK_URL'

@app.route('/api/post', methods=['POST'])
def post_video():
    data = request.get_json()
    
    # Validate
    required = ['driveLink', 'title', 'caption']
    if not all(k in data for k in required):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Post to social
    response = requests.post(WEBHOOK_URL, json=data)
    result = response.json()
    
    return jsonify(result), 200 if result.get('success') else 400

@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({'status': 'API is running'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

---

## Example 4: cURL with saved file

### Create `post.sh`
```bash
#!/bin/bash

# Configuration
WEBHOOK_URL="YOUR_WEBHOOK_URL"
DRIVE_LINK="$1"
TITLE="$2"
CAPTION="$3"

# Validate inputs
if [ -z "$DRIVE_LINK" ] || [ -z "$TITLE" ] || [ -z "$CAPTION" ]; then
    echo "Usage: ./post.sh '<drive_link>' '<title>' '<caption>'"
    exit 1
fi

# Send request
echo "Posting: $TITLE"

curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"driveLink\": \"$DRIVE_LINK\",
    \"title\": \"$TITLE\",
    \"caption\": \"$CAPTION\"
  }" \
  --silent \
  --show-error

echo -e "\n✓ Request sent!"
```

### Usage
```bash
chmod +x post.sh
./post.sh "https://drive.google.com/file/d/1ABC123/view" "My Video" "Great content!"
```

---

## Example 5: PowerShell (Windows)

```powershell
# Save as post-to-social.ps1

param(
    [string]$DriveLink = "",
    [string]$Title = "",
    [string]$Caption = ""
)

$WebhookUrl = "YOUR_WEBHOOK_URL"

# Validate
if (-not $DriveLink -or -not $Title -or -not $Caption) {
    Write-Host "Usage: .\post-to-social.ps1 -DriveLink '<url>' -Title '<title>' -Caption '<caption>'"
    exit 1
}

$Body = @{
    driveLink = $DriveLink
    title = $Title
    caption = $Caption
} | ConvertTo-Json

Write-Host "Posting: $Title"

$Response = Invoke-WebRequest -Uri $WebhookUrl `
    -Method POST `
    -ContentType "application/json" `
    -Body $Body

$Result = $Response.Content | ConvertFrom-Json

if ($Result.success) {
    Write-Host "✓ Posted successfully!"
} else {
    Write-Host "✗ Error: $($Result.error)"
}
```

### Usage
```powershell
.\post-to-social.ps1 -DriveLink "https://drive.google.com/file/d/1ABC123/view" -Title "My Video" -Caption "Content!"
```

---

## Example 6: Google Apps Script

```javascript
function postToSocial(driveLink, title, caption) {
  const webhookUrl = 'YOUR_WEBHOOK_URL';
  
  const payload = {
    driveLink: driveLink,
    title: title,
    caption: caption
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(webhookUrl, options);
  const result = JSON.parse(response.getContentText());

  if (result.success) {
    Logger.log('✓ Posted successfully!');
    return result;
  } else {
    Logger.log('✗ Error: ' + result.error);
    throw new Error(result.error);
  }
}

// Usage in Google Sheets
// Put this in a cell: =postToSocial(A2,B2,C2)
```

---

## Example 7: Scheduled Posting (Node.js)

```javascript
const fetch = require('node-fetch');
const cron = require('node-cron');

const WEBHOOK_URL = 'YOUR_WEBHOOK_URL';

// Videos to post at specific times
const schedules = [
  {
    time: '09:00',  // 9 AM daily
    video: {
      driveLink: 'https://drive.google.com/file/d/1ABC/view',
      title: 'Morning Video',
      caption: 'Good morning! Check this out!'
    }
  },
  {
    time: '18:00',  // 6 PM daily
    video: {
      driveLink: 'https://drive.google.com/file/d/2DEF/view',
      title: 'Evening Video',
      caption: 'Evening vibes!'
    }
  }
];

// Schedule posts
schedules.forEach(schedule => {
  cron.schedule(`0 ${schedule.time.split(':')[0]} * * *`, async () => {
    try {
      console.log(`Posting at ${schedule.time}: ${schedule.video.title}`);
      
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schedule.video)
      });

      const result = await response.json();
      console.log(result.success ? '✓ Posted!' : `✗ Error: ${result.error}`);
    } catch (error) {
      console.error('Error:', error.message);
    }
  });

  console.log(`✓ Scheduled post at ${schedule.time}`);
});

console.log('Scheduler running...');
```

---

## Example 8: Postman Collection

```json
{
  "info": {
    "name": "Social Media Poster API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Post to Social Platforms",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"driveLink\": \"https://drive.google.com/file/d/YOUR_FILE_ID/view\",\n  \"title\": \"My Video Title\",\n  \"caption\": \"Amazing content! Check it out!\"\n}"
        },
        "url": {
          "raw": "YOUR_WEBHOOK_URL",
          "protocol": "https",
          "path": ["webhook", "post-to-social"]
        }
      },
      "response": []
    }
  ]
}
```

---

## Common Test Cases

### Test 1: Valid Post
```json
{
  "driveLink": "https://drive.google.com/file/d/1ABC123XYZ_valid/view",
  "title": "Test Video",
  "caption": "Testing the API!"
}
```

### Test 2: Missing Caption
```json
{
  "driveLink": "https://drive.google.com/file/d/1ABC123/view",
  "title": "Test Video"
}
```
Expected: Error message

### Test 3: Invalid Drive Link
```json
{
  "driveLink": "not-a-valid-link",
  "title": "Test",
  "caption": "Test"
}
```
Expected: Error about invalid format

---

**Copy any example above and replace `YOUR_WEBHOOK_URL` with your actual URL from n8n!**

Last Updated: November 1, 2025
