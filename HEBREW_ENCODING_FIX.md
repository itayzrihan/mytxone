# Hebrew Text Encoding Fix for Webhook Tests

## Problem
When sending Hebrew text via PowerShell's `Invoke-WebRequest`, the characters arrive as `?????` instead of actual Hebrew text. This is a **character encoding issue**, not an n8n workflow issue.

## Root Cause
PowerShell's default text encoding for HTTP requests may not preserve UTF-8 Hebrew characters properly. The data needs to be explicitly encoded as UTF-8 bytes.

---

## Solution 1: Fixed PowerShell Script (Recommended)

Use this script to properly encode Hebrew text as UTF-8:

```powershell
# Create the body object
$bodyObject = @{
    driveLink = "https://drive.google.com/file/d/12RWEwBnjrro7_0eqgIlmwfPs7-sEUAqc/view?usp=drive_link"
    title = "כוחו של השם הפרטי"
    caption = "כוחו של השם הפרטי איך שימוש בשם יוצר חיבור מיידי והשפעה רגשית."
}

# Convert to JSON with UTF-8 encoding
$body = ConvertTo-Json $bodyObject -Depth 10
$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)

# Send the request with UTF-8 body
$response = Invoke-WebRequest -Uri "https://auto.mytx.co/webhook/post-to-social" `
    -Method POST `
    -ContentType "application/json; charset=utf-8" `
    -Body $bodyBytes `
    -UseBasicParsing

Write-Host "Response:" 
Write-Host $response.Content
```

**Key changes:**
- ✅ Convert JSON to string first: `ConvertTo-Json`
- ✅ Encode string as UTF-8 bytes: `[System.Text.Encoding]::UTF8.GetBytes()`
- ✅ Set `charset=utf-8` in Content-Type header
- ✅ Pass bytes as Body instead of string

---

## Solution 2: Use Node.js (Most Reliable)

Run: `node test-webhook-hebrew.js`

```bash
node test-webhook-hebrew.js
```

This ensures proper UTF-8 encoding at the protocol level.

---

## Solution 3: Use curl (Alternative)

If curl is installed on your system:

```bash
curl -X POST https://auto.mytx.co/webhook/post-to-social \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{"driveLink":"https://drive.google.com/file/d/12RWEwBnjrro7_0eqgIlmwfPs7-sEUAqc/view?usp=drive_link","title":"כוחו של השם הפרטי","caption":"כוחו של השם הפרטי איך שימוש בשם יוצר חיבור מיידי והשפעה רגשית."}'
```

---

## How It Works (Technical Details)

### Before (Broken):
```powershell
$body = ConvertTo-Json @{ title = "כוחו של השם הפרטי" }
# PowerShell passes this as a string directly
# Encoding: system default (often Windows-1252 or similar)
# Result: Server receives "?????"
```

### After (Fixed):
```powershell
$bodyString = ConvertTo-Json @{ title = "כוחו של השם הפרטי" }
$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($bodyString)
# PowerShell passes UTF-8 encoded bytes
# Server interprets as UTF-8: "כוחו של השם הפרטי" ✅
```

---

## Testing Checklist

### Test 1: Verify n8n receives Hebrew correctly

1. Run the fixed PowerShell script or Node.js script
2. Go to n8n workflow execution history
3. Check the webhook trigger output
4. Look for `title` and `caption` fields
5. Hebrew text should display properly: ✅ "כוחו של השם הפרטי"

### Test 2: Verify workflow processes data correctly

1. Check the "Extract & Normalize Data" node output
2. Verify `caption` and `title` fields have Hebrew text
3. Verify `final_google_drive_url` extracts the file ID correctly

### Test 3: Verify posts are created

1. Wait for delays to complete (0-2 minutes)
2. Check social media accounts for new posts
3. Verify captions and titles show Hebrew text correctly

---

## Files Created

- `test-webhook-hebrew.ps1` - PowerShell version (recommended)
- `test-webhook-hebrew.bat` - Batch/curl version
- `test-webhook-hebrew.js` - Node.js version (most reliable)

---

## Important Notes

1. **Encoding matters**: Always use UTF-8 when working with Hebrew
2. **Content-Type header**: Include `; charset=utf-8`
3. **Byte encoding**: Pass `[System.Text.Encoding]::UTF8.GetBytes()` result
4. **Console display**: PowerShell console might not display Hebrew, but the data is correct

---

## Verification Command

To verify the data was sent correctly, check the n8n execution details:
- The webhook trigger should show the body with Hebrew text
- Look for `"title": "כוחו של השם הפרטי"` in the execution output

If you see this in the n8n execution, the encoding is working! 🎉

---

## Reference

- **PowerShell Encoding**: https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/convertto-json
- **UTF-8 in HTTP**: RFC 7231, RFC 3629
- **Hebrew Unicode**: U+05D0 to U+05FF
