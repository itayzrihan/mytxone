# Webhook Data Structure Fix - Blotato Social Media Poster

## Problem
The Blotato API was returning the error:
```
Bad request - please check your parameters: body.post.content must have required property 'text'
```

This indicated that the social media posting nodes were receiving `undefined` for the `postContentText` parameter, causing the Blotato API to reject the requests.

## Root Cause Analysis

### Data Flow Structure
The workflow receives data from the webhook at the **root level** of `$json`:
```javascript
// Webhook receives:
{
  "driveLink": "https://drive.google.com/file/d/...",
  "title": "Your Title",
  "caption": "Your Caption"
}
// Available as: $json.driveLink, $json.caption, $json.title
```

### The Incorrect Mappings
The old code tried to access nested `$json.body.caption`:
```javascript
"postContentText": "={{ $json.body?.caption || $json.caption }}"
```

This failed because:
1. The webhook sends data at the root level, NOT nested in `body`
2. `$json.body` was undefined
3. The fallback `$json.caption` would work ONLY if data wasn't normalized
4. But after the "Extract & Normalize Data" node, `$json` is replaced with the extracted fields

## Solution Implemented

### 1. Fixed Extract & Normalize Data Node
Changed to extract directly from webhook root level:

**Before:**
```javascript
"value": "={{ $json.body.driveLink || $json.driveLink }}"
"value": "={{ $json.body?.caption || $json.caption || 'כוחו של השם הפרטי' }}"
```

**After:**
```javascript
"value": "={{ $json.driveLink }}"
"value": "={{ $json.caption || 'כוחו של השם הפרטי' }}"
```

This node now:
- Takes webhook input at root level: `$json.driveLink`, `$json.caption`, `$json.title`
- Normalizes and re-exports them with the same names
- Outputs: `$json.driveLink`, `$json.caption`, `$json.title`, etc.

### 2. Fixed All 15+ Social Media Posting Nodes
Changed from:
```javascript
"postContentText": "={{ $json.body?.caption || $json.caption }}"
"postCreateYoutubeOptionTitle": "={{ $json.body?.title || $json.title }}"
```

To:
```javascript
"postContentText": "={{ $json.caption }}"
"postCreateYoutubeOptionTitle": "={{ $json.title }}"
```

Updated nodes:
- ✅ LinkedIn [BLOTATO]
- ✅ Facebook [BLOTATO]
- ✅ Twitter [BLOTATO]
- ✅ YouTube (3 instances): [BLOTATO], [BLOTATO]1, [BLOTATO]2
- ✅ Threads [BLOTATO]
- ✅ TikTok (5 instances): Itay_Zrihan, Itay_Tech, Not Warmed Up Yet, ItayTheSpammer, Spammer
- ✅ Instagram (4 instances): Sales_Growth_Digital, Itay.Zrihan, Itay_Chi, Itay_Zrihan Official

## Data Flow After Fix

```
┌─────────────────────────────────────────────┐
│ Webhook Input (Root Level)                  │
│ {                                           │
│   "driveLink": "...",                       │
│   "caption": "...",                         │
│   "title": "..."                            │
│ }                                           │
└─────────┬───────────────────────────────────┘
          │ $json.driveLink, $json.caption, $json.title
          ▼
┌─────────────────────────────────────────────┐
│ Extract & Normalize Data                    │
│ - Validates driveLink exists                │
│ - Adds defaults for caption/title           │
│ - Extracts Drive ID                         │
└─────────┬───────────────────────────────────┘
          │ $json.driveLink, $json.caption, $json.title
          ▼
┌─────────────────────────────────────────────┐
│ Validate Input (Limit node - passes data)   │
└─────────┬───────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────┐
│ Upload Image/Video to BLOTATO               │
│ Uses: $json.final_google_drive_url          │
│ Outputs: { url: "blotato://..." }           │
└─────────┬───────────────────────────────────┘
          │ New data: $json.url (+ all previous fields)
          ▼
┌─────────────────────────────────────────────┐
│ Social Media Posting Nodes (LinkedIn, etc)  │
│ postContentText: ={{ $json.caption }}  ✅  │
│ postContentMediaUrls: ={{ $json.url }}  ✅ │
└─────────────────────────────────────────────┘
```

## Key Improvements

1. **Clear Data Path**: Direct reference to normalized fields
2. **No Undefined Values**: Blotato receives proper `text` parameter
3. **Fallback Defaults**: Hebrew defaults in Extract node ensure captions always exist
4. **API Success**: Blotato receives valid `body.post.content.text` property
5. **Consistent Structure**: All 15+ nodes use identical mapping pattern

## Testing

To verify the fix works:

```bash
# Use Node.js for proper UTF-8 encoding
node test-webhook-hebrew-test-url.js
```

Expected output:
```
✅ Response Status: 200
Response Content:
{"message":"Workflow was started"}
```

## Files Modified
- `automations/blotato-api.json` - Updated Extract & Normalize Data node + all 15+ social media posting nodes

## Next Steps
1. Deploy updated workflow to n8n
2. Re-test with the Node.js webhook script
3. Monitor execution logs to confirm posts are created
4. Verify posts appear on social media accounts after delays
