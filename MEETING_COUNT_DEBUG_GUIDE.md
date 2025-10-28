# Meeting Count Debug Guide

## Issue
Meeting count is returning `0` even though users have created meetings. Meetings page shows meetings correctly but the limit modal doesn't trigger.

## Root Cause Analysis

The issue likely falls into one of these categories:

### Scenario 1: Meetings Aren't Being Saved with UserID
**Signs in logs:**
- `/api/meetings` POST shows: `✅ MEETING CREATED` but `userId: null`
- `/api/meetings?filter=owned` returns 0 meetings
- `/api/user/plan` shows `Total meetings in DB for user: 0`

**Fix:**
- Check if `userData.id` is being set correctly when creating meetings
- Verify auth session is working

### Scenario 2: UserId Mismatch
**Signs in logs:**
- `/api/meetings` POST shows userId that matches
- `/api/meetings?filter=owned` shows meetings with `ownedMeetingsCount: X`
- `/api/user/plan` shows `Total meetings in DB for user: 0` but meetings exist
- User IDs don't match between different queries

**Fix:**
- Verify the userId is consistent across all queries
- Check if there's a UUID encoding/decoding issue

### Scenario 3: Date/Time Comparison Issue
**Signs in logs:**
- `/api/user/plan` shows meetings in DB with `isUpcoming: false` for all
- Current time appears way in the past or future
- Timezone conversion issues

**Fix:**
- Check if database timestamps are in correct timezone
- Verify `new Date()` comparison works with database timestamps

---

## How to Debug

### Step 1: Create a Meeting
1. Go to owned-meetings page
2. Click "Create Meeting"
3. Fill form with meeting at least 1 hour in future
4. Submit

**Check server logs for:**
```
=== CREATE MEETING - EXISTING COUNTCHECK ===
User: theking@mytx.one ID: [UUID]
Plan: basic
Existing active meetings: [number]
=== END CHECK ===

✅ MEETING CREATED: {
  meetingId: [UUID],
  title: "...",
  userId: [UUID],
  startTime: [ISO],
  endTime: [ISO]
}
```

**Check browser for:**
- Owned meetings page loads and shows new meeting in the list

### Step 2: Refresh User Plan
1. Hard refresh page (Ctrl+Shift+R)
2. Wait for page to load

**Check server logs for:**
```
=== MEETING COUNT DEBUG ===
User ID: [UUID]
Current time: [ISO with Z]
Email: theking@mytx.one

Total meetings in DB for user: [should be 1+]

First 5 meetings:
  [1] Meeting Title {
    id: [UUID],
    userId: [UUID],
    userIdMatches: true,  ← CRITICAL: should be true
    endTime: [value],
    endTimeISO: [ISO],
    isUpcoming: true,     ← CRITICAL: should be true
    ...
  }

Active meetings (endTime >= now): [should match total if upcoming]
=== END DEBUG ===

✅ Retrieved plan for theking@mytx.one: basic with 1 meetings
```

### Step 3: Try to Create Second Meeting
1. Click "Create Meeting" again
2. Note if modal appears or dialog opens

**Check server logs for:**
```
=== CREATE MEETING - EXISTING COUNT CHECK ===
User: theking@mytx.one ID: [UUID]
Plan: basic
Existing active meetings: 1  ← Should show count
=== END CHECK ===
```

**Expected behavior:**
- If meeting 1 endTime is in future: Should allow creation (basic allows 3)
- If meeting 1 endTime is in past: Should count as 0 active, allow creation

---

## Critical Values to Compare

When debugging, look for these mismatches:

### Check 1: UserID Consistency
```
In POST /api/meetings:
  userId: [UUID-1]

In GET /api/meetings?filter=owned:
  Should show same [UUID-1]

In GET /api/user/plan:
  User ID: [UUID-1]
  Each meeting userId: should also be [UUID-1]
```

### Check 2: Time Comparison
```
Server current time: 2025-10-27T20:30:45.123Z
Meeting endTime: 2025-10-28T14:00:00.000Z

Is endTime > now?
2025-10-28T14:00:00 > 2025-10-27T20:30:45?
YES → should count as active
```

### Check 3: Count Progression
```
Create Meeting 1 → Active: 1
Create Meeting 2 → Active: 2
Create Meeting 3 → Active: 3
Try Create Meeting 4 → Should fail for Basic user
```

---

## Common Issues & Fixes

### Issue: All Meetings Show `isUpcoming: false`

**Cause**: Meeting endTime is in the past

**Fix**: 
- When creating meetings, ensure endTime is in the future
- Example: If now is Oct 27, 8 PM, set meeting to end at Oct 28, 4 PM

**Check:**
```
Meeting endTime: 2025-10-27T18:00:00.000Z (6 PM today)
Current time:   2025-10-27T20:30:45.123Z (8:30 PM today)

18:00 > 20:30? NO → Won't count as active
```

### Issue: `userIdMatches: false`

**Cause**: Meeting was created with different userId than current user

**Fix**:
- Verify you're logged in with same account
- Clear browser cache/cookies
- Log out and back in

### Issue: Meetings in DB but `ownedMeetingsCount: 0`

**Cause**: UserId filter not working, possibly UUID format issue

**Fix**:
- Check if UUID values are being compared correctly
- May need to cast UUID in query

---

## Log Interpretation Examples

### ✅ Working Correctly
```
Total meetings in DB for user: 2
  [1] My Meeting {
    userIdMatches: true,
    isUpcoming: true,    ← This is key!
  }
  [2] Another Meeting {
    userIdMatches: true,
    isUpcoming: true,    ← This is key!
  }
Active meetings (endTime >= now): 2
✅ Retrieved plan for theking@mytx.one: basic with 2 meetings
```

### ❌ Issue: Wrong User
```
Total meetings in DB for user: 2
  [1] My Meeting {
    userId: 00000000-0000-0000-0000-000000000001,
    userIdMatches: false,    ← PROBLEM!
  }
Active meetings (endTime >= now): 0
✅ Retrieved plan for theking@mytx.one: basic with 0 meetings
```

### ❌ Issue: Time in Past
```
Total meetings in DB for user: 2
  [1] My Meeting {
    userIdMatches: true,
    endTime: 2025-10-26T10:00:00.000Z,
    endTimeISO: 2025-10-26T10:00:00.000Z,
    nowISO: 2025-10-27T20:30:45.000Z,
    isUpcoming: false,       ← PROBLEM!
  }
Active meetings (endTime >= now): 0
```

---

## Next Steps

1. **Create a test meeting** with endTime at least 1 hour in future
2. **Hard refresh** the page (Ctrl+Shift+R)
3. **Check server console output** for the debug logs above
4. **Report the logs** that appear in the format shown above
5. **Identify which scenario matches** your situation
6. **Apply the corresponding fix**

---

## Quick Log Checklist

When you check the logs, verify these items:

- [ ] User ID matches across all endpoints
- [ ] Meeting endTime is in the future
- [ ] `isUpcoming: true` for future meetings
- [ ] `Active meetings count` matches total for future meetings
- [ ] User plan shows `basic` or `free` (not null)
- [ ] `/api/user/plan` returns correct meetingCount

If all these are true and you still don't see the modal, the issue is in the frontend limit check logic.

---

**Debug Mode: ENABLED ✅**

All API endpoints now logging detailed information. Check browser DevTools console and server terminal for output.
