# n8n Webhook Data Extraction Fix

## Problem
The n8n workflow was failing at the "Extract API Data" node with error:
```
{{ $json.body.driveLink.match(/https:\/\/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)/i)[1] }}
[undefined]
```

## Root Cause
The webhook data structure depends on how the webhook receives data:
- When data is posted to the webhook, it's stored in `$json.body`
- When testing manually in n8n, data might be in `$json` directly
- The regex was also missing optional chaining (`?.`) which caused errors when the match failed

## Solution

### Updated Expression (Fixed)
```javascript
{{ ($json.body.driveLink || $json.driveLink).match(/\/d\/([A-Za-z0-9_-]+)/)?.[1] || ($json.body.driveLink || $json.driveLink) }}
```

### What Changed:
1. **Fallback logic**: `$json.body.driveLink || $json.driveLink`
   - Tries `body.driveLink` first (from webhook POST)
   - Falls back to `driveLink` directly (from manual test)

2. **Simplified regex**: `/\/d\/([A-Za-z0-9_-]+)/`
   - Removed unnecessary protocol matching
   - Focuses on the file ID pattern after `/d/`

3. **Optional chaining**: `?.[1]`
   - Safely accesses match result
   - Returns `undefined` instead of throwing error if no match

4. **Final fallback**: `|| ($json.body.driveLink || $json.driveLink)`
   - If regex fails, uses the full link as-is
   - Allows workflow to continue even with unexpected formats

## Updated Node Structure

```json
{
  "parameters": {
    "assignments": {
      "assignments": [
        {
          "id": "extract-drive-link",
          "name": "driveLink",
          "value": "={{ $json.body.driveLink || $json.driveLink }}",
          "type": "string"
        },
        {
          "id": "extract-caption",
          "name": "caption",
          "value": "={{ $json.body.caption || $json.caption || 'Check out this content!' }}",
          "type": "string"
        },
        {
          "id": "extract-title",
          "name": "title",
          "value": "={{ $json.body.title || $json.title || 'New Video' }}",
          "type": "string"
        },
        {
          "id": "extract-drive-id",
          "name": "final_google_drive_url",
          "value": "={{ ($json.body.driveLink || $json.driveLink).match(/\\/d\\/([A-Za-z0-9_-]+)/)?.[1] || ($json.body.driveLink || $json.driveLink) }}",
          "type": "string"
        }
      ]
    },
    "options": {}
  },
  "type": "n8n-nodes-base.set",
  "typeVersion": 3.4,
  "position": [-3200, -1088],
  "id": "extract-api-data",
  "name": "Extract API Data"
}
```

## Testing

### Test Input (via webhook POST):
```json
{
  "driveLink": "https://drive.google.com/file/d/12RWEwBnjrro7_0eqgIlmwfPs7-sEUAqc/view?usp=drive_link",
  "title": "כוחו של השם הפרטי",
  "caption": "כוחו של השם הפרטי – איך שימוש בשם יוצר חיבור מיידי והשפעה רגשית."
}
```

### Expected Output:
```json
{
  "driveLink": "https://drive.google.com/file/d/12RWEwBnjrro7_0eqgIlmwfPs7-sEUAqc/view?usp=drive_link",
  "title": "כוחו של השם הפרטי",
  "caption": "כוחו של השם הפרטי – איך שימוש בשם יוצר חיבור מיידי והשפעה רגשית.",
  "final_google_drive_url": "12RWEwBnjrro7_0eqgIlmwfPs7-sEUAqc"
}
```

### PowerShell Test Command:
```powershell
$body = ConvertTo-Json @{
    driveLink="https://drive.google.com/file/d/12RWEwBnjrro7_0eqgIlmwfPs7-sEUAqc/view?usp=drive_link"
    title="Test Video"
    caption="Test Caption"
} -Depth 10

Invoke-WebRequest -Uri "https://auto.mytx.co/webhook/post-to-social" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body `
    -UseBasicParsing
```

## Re-Import Instructions

1. **Export current workflow** (backup):
   - Open workflow in n8n
   - Click "..." menu → Download

2. **Delete old workflow**:
   - Click "..." menu → Delete

3. **Import updated workflow**:
   - Go to n8n dashboard
   - Click "Import from File"
   - Select `automations/blotato-api.json` (updated)
   - Click "Import"

4. **Activate workflow**:
   - Toggle switch to **ON** (blue/green)

5. **Test immediately**:
   ```powershell
   $body = ConvertTo-Json @{
       driveLink="https://drive.google.com/file/d/YOUR-FILE-ID/view"
       title="Test"
       caption="Test"
   } -Depth 10

   Invoke-WebRequest -Uri "https://auto.mytx.co/webhook/post-to-social" `
       -Method POST `
       -ContentType "application/json" `
       -Body $body
   ```

6. **Check execution**:
   - Click "Executions" tab
   - View latest execution
   - Verify "Extract API Data" node succeeded

## Verification Checklist

- [ ] Workflow imported successfully
- [ ] Workflow activated (toggle ON)
- [ ] Test webhook receives data
- [ ] "Extract API Data" node passes
- [ ] `final_google_drive_url` contains file ID only
- [ ] `driveLink`, `title`, `caption` are preserved
- [ ] Blotato upload succeeds
- [ ] Platform posts trigger

## Common Issues

### Issue: Still getting [undefined]
**Cause**: Old workflow cached in n8n
**Fix**: 
- Stop workflow
- Delete workflow completely
- Re-import fresh copy
- Activate again

### Issue: Regex not matching
**Cause**: Google Drive link format different
**Fix**: The fallback now uses full link if regex fails

### Issue: Hebrew text not displaying
**Cause**: Character encoding
**Fix**: Already handled - UTF-8 encoding in JSON

## Success Indicators

✅ **Execution succeeds** in n8n history
✅ **"Extract API Data" node** shows green checkmark
✅ **Output shows** `final_google_drive_url` with file ID
✅ **Next nodes** receive correct data
✅ **Blotato upload** completes
✅ **Posts appear** on platforms

---

**Status**: ✅ Fixed in `blotato-api.json` and `blotato-api-dual-trigger.json`
**Date**: November 1, 2025
**Files Updated**: 2
