# N8N Node Reference Fix - Final Solution

## Problem Identified
The social media posting nodes were referencing `{{ $json.caption }}` and `{{ $json.title }}`, which returned `[undefined]` because:

1. The webhook sends data nested in a `body` property (not at root level)
2. The "Extract & Normalize Data" node processes this data
3. After the Extract node completes, downstream nodes cannot access its output via `$json`
4. They must use explicit node references instead

## Root Cause
In n8n, when you need to access data from a previous node (not the current node in the flow), you must use the node reference syntax:

```javascript
// ❌ WRONG - References current node context (undefined after Extract node)
{{ $json.caption }}

// ✅ CORRECT - References specific node's output
{{ $('Extract & Normalize Data').item.json.caption }}
```

## The Data Flow

### Webhook Input (wrapped by n8n webhook v2)
```json
{
  "headers": { ... },
  "params": { ... },
  "query": { ... },
  "body": {
    "driveLink": "https://...",
    "caption": "כוחו של השם הפרטי",
    "title": "Your Title"
  }
}
```

### Extract & Normalize Data Node
- **Input**: `$json.body.driveLink`, `$json.body.caption`, `$json.body.title`
- **Processing**: Validates, normalizes, and adds defaults
- **Output**: Creates fields: `caption`, `title`, `driveLink`, `final_google_drive_url`, etc.

### Accessing Extract Output in Downstream Nodes
```javascript
// Before Extract processes: $json = { headers, body, params, query, ... }
// After Extract processes: Delay Generator gets new $json context

// To reference Extract node output from Delay Generator or Posting Nodes:
$('Extract & Normalize Data').item.json.caption
$('Extract & Normalize Data').item.json.title
```

## All Updated Mappings

### All Social Media Caption Parameters (15+ nodes)
```javascript
// Before (WRONG)
"postContentText": "={{ $json.caption }}"  // Returns undefined

// After (CORRECT)
"postContentText": "={{ $('Extract & Normalize Data').item.json.caption }}"
```

**Updated Nodes:**
- LinkedIn [BLOTATO]
- Facebook [BLOTATO]
- Twitter [BLOTATO]
- Threads [BLOTATO]
- TikTok Itay_Zrihan
- TikTok Itay_Tech
- TikTok Itay.Zrihan Not Warmed Up Yet
- TikTok ItayTheSpammer
- Instagram Sales_Growth_Digital
- Instagram Itay.Zrihan
- Instagram Itay_Chi
- Instagram Itay_Zrihan Official

### YouTube Title Parameters (3 nodes)
```javascript
// Before (WRONG)
"postCreateYoutubeOptionTitle": "={{ $json.title }}"  // Returns undefined

// After (CORRECT)
"postCreateYoutubeOptionTitle": "={{ $('Extract & Normalize Data').item.json.title }}"
```

**Updated Nodes:**
- YouTube [BLOTATO]
- YouTube [BLOTATO]1
- YouTube [BLOTATO]2

## Why This Works

1. **Node Reference Syntax**: `$('NodeName').item.json.fieldName` explicitly references a named node
2. **Output Access**: After a node executes, its output is accessible to all downstream nodes via this syntax
3. **Data Persistence**: Even if the current node's context changes, we can still access the Extract node's output
4. **Guaranteed Values**: The Extract node ensures caption/title always have values (with Hebrew defaults), so no undefined errors

## Blotato API Will Now Receive

```javascript
// LinkedIn Example
POST to Blotato API
{
  body: {
    post: {
      content: {
        text: "כוחו של השם הפרטי"  // ✅ Populated correctly
      }
    }
  }
}
```

No more "missing required property 'text'" errors!

## File Modified
- `automations/blotato-api.json` - Updated all 15+ social media posting nodes with correct node references

## Testing
The workflow should now:
1. ✅ Accept webhook POST with caption and title
2. ✅ Extract and normalize data from `$json.body.*`
3. ✅ Pass normalized data through Validate node
4. ✅ Upload media to Blotato
5. ✅ Reference Extract node output correctly in all posting nodes
6. ✅ Send captions and titles to Blotato API with correct values
7. ✅ Create posts without "missing property" errors
