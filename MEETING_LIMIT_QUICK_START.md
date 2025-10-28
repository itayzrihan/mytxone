# Meeting Limit Modal - Quick Start Guide

## 🚀 Quick Implementation (5 minutes)

### Step 1: Import the Component

```tsx
import { MeetingLimitModal } from "@/components/custom/meeting-limit-modal";
```

### Step 2: Add State

```tsx
const [showMeetingLimitModal, setShowMeetingLimitModal] = useState(false);
const [userMeetingCount, setUserMeetingCount] = useState(0);
```

### Step 3: Fetch User Meeting Count

```tsx
const fetchUserMeetingCount = async () => {
  try {
    const response = await fetch(`/api/user/plan?t=${new Date().getTime()}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (response.ok) {
      const data = await response.json();
      setUserMeetingCount(data.meetingCount || 0);
    }
  } catch (error) {
    console.error('Error fetching user meeting count:', error);
  }
};
```

### Step 4: Add Limit Check Logic

```tsx
const handleCreateClick = async () => {
  const meetingLimits = {
    free: 1,
    basic: 3,
    pro: Infinity,
  };

  await fetchUserMeetingCount();
  const limit = meetingLimits[userPlan];

  if (userMeetingCount >= limit) {
    setShowMeetingLimitModal(true);
    return;
  }

  // Show creation dialog
  setShowCreateMeetingDialog(true);
};
```

### Step 5: Render the Modal

```tsx
<MeetingLimitModal
  open={showMeetingLimitModal}
  onOpenChange={setShowMeetingLimitModal}
  currentCount={userMeetingCount}
  limit={userPlan === "free" ? 1 : userPlan === "basic" ? 3 : Infinity}
  plan={userPlan || "free"}
  onRemoveMeeting={() => {
    setShowMeetingLimitModal(false);
    // Optional: Navigate or refresh
  }}
/>
```

---

## 📋 Common Scenarios

### Scenario A: Upgrade Wall (Free User)

```tsx
// State
const [showMeetingLimitModal, setShowMeetingLimitModal] = useState(false);
const [userMeetingCount, setUserMeetingCount] = useState(0);

// Handler
const handleStartFreeClick = async () => {
  if (!user) {
    openAuthModal('login');
    return;
  }

  await fetchUserMeetingCount();
  
  if (userMeetingCount >= 1) {
    // Free user already has 1 meeting
    setShowMeetingLimitModal(true);
    return;
  }

  // Can create
  setShowCreateMeetingDialog(true);
};

// Button
<Button onClick={handleStartFreeClick}>
  START FREE
</Button>

// Modal
<MeetingLimitModal
  open={showMeetingLimitModal}
  onOpenChange={setShowMeetingLimitModal}
  currentCount={userMeetingCount}
  limit={1}
  plan="free"
  onRemoveMeeting={() => {
    setShowMeetingLimitModal(false);
    router.push('/owned-meetings');
  }}
/>
```

### Scenario B: Owned Meetings (Any Plan)

```tsx
// Handler
const handleCreateClick = () => {
  const meetingLimits = { free: 1, basic: 3, pro: Infinity };
  const limit = meetingLimits[userPlan] || 1;

  if (meetingCount >= limit) {
    setIsLimitModalOpen(true);
    return;
  }

  setIsCreateDialogOpen(true);
};

// Modal
<MeetingLimitModal
  open={isLimitModalOpen}
  onOpenChange={setIsLimitModalOpen}
  currentCount={meetingCount}
  limit={userPlan === "free" ? 1 : userPlan === "basic" ? 3 : Infinity}
  plan={userPlan || "free"}
/>
```

---

## 🎨 Customization Options

### Option 1: Custom Remove Action

```tsx
<MeetingLimitModal
  open={isOpen}
  onOpenChange={setIsOpen}
  currentCount={2}
  limit={3}
  plan="basic"
  onRemoveMeeting={() => {
    setIsOpen(false);
    // Custom logic: Send analytics, refresh list, etc.
    analytics.track('user_viewed_limit_modal');
    refreshMeetingList();
  }}
/>
```

### Option 2: Custom Mode

```tsx
<MeetingLimitModal
  open={isOpen}
  onOpenChange={setIsOpen}
  currentCount={2}
  limit={3}
  plan="basic"
  mode="warning"  // Instead of 'reached'
/>
```

### Option 3: Reuse for Other Features

```tsx
// Use the same modal for community limits, etc.
<MeetingLimitModal
  open={isOpen}
  onOpenChange={setIsOpen}
  currentCount={communitiesCreated}
  limit={3}
  plan={userPlan}
  onRemoveMeeting={() => {
    // Navigate to delete a community instead
    router.push('/my-communities');
  }}
/>
```

---

## 🔍 Debugging

### Check Component Props

```tsx
// Console output
console.log('MeetingLimitModal Props:', {
  currentCount: userMeetingCount,
  limit: meetingLimit,
  plan: userPlan,
  open: showModal
});
```

### Verify API Response

```tsx
const fetchUserMeetingCount = async () => {
  const response = await fetch(`/api/user/plan?t=${Date.now()}`);
  const data = await response.json();
  
  console.log('API Response:', data);
  // Should show: { plan: "free"|"basic"|"pro", meetingCount: number }
};
```

### Test Meeting Count Fetch

```tsx
// Quick test in console
fetch('/api/user/plan?t=' + Date.now())
  .then(r => r.json())
  .then(d => console.log('Meeting Count:', d.meetingCount))
```

---

## ✅ Testing Checklist

- [ ] **Free User at Limit**
  - Plan: free, Count: 1, Limit: 1
  - Expected: Modal shows "Free Plan Limit Reached"
  
- [ ] **Free User Under Limit**
  - Plan: free, Count: 0, Limit: 1
  - Expected: Dialog opens (no modal)
  
- [ ] **Basic User at Limit**
  - Plan: basic, Count: 3, Limit: 3
  - Expected: Modal shows "Basic Plan Limit Reached"
  
- [ ] **Basic User Under Limit**
  - Plan: basic, Count: 2, Limit: 3
  - Expected: Dialog opens (no modal)
  
- [ ] **Pro User (Always Allowed)**
  - Plan: pro, Count: 10, Limit: Infinity
  - Expected: Dialog opens (no modal)
  
- [ ] **Modal Buttons**
  - Remove: Closes and optionally navigates
  - Upgrade: Goes to /pricing
  
- [ ] **Progress Bar**
  - Shows correct count/limit ratio
  - Colors correctly (yellow/orange)

---

## 🆘 Common Issues

### Issue: Modal Shows Wrong Plan

**Solution**: Ensure `plan` prop matches user's actual plan
```tsx
// Check this is correct
console.log('User Plan:', userPlan); // Should be 'free', 'basic', or 'pro'
```

### Issue: Meeting Count Not Updating

**Solution**: Ensure fetch is called before checking
```tsx
// ✅ DO this:
await fetchUserMeetingCount();  // Wait for result
if (userMeetingCount >= limit) { ... }

// ❌ DON'T do this:
fetchUserMeetingCount();  // Fire and forget
if (userMeetingCount >= limit) { ... }  // Still old value!
```

### Issue: Modal Never Shows

**Solution**: Check the limit calculation
```tsx
// Verify meeting limit
const meetingLimits = {
  free: 1,
  basic: 3,
  pro: Infinity,  // ← Make sure pro is Infinity
};

// Pro users should never show modal
if (userPlan === 'pro') {
  // This limit will be Infinity, so modal never shows
}
```

### Issue: Button Doesn't Respond

**Solution**: Check if handler is being called
```tsx
const handleCreateClick = () => {
  console.log('Handler called!');  // Add debug logging
  // ... rest of code
};
```

---

## 📚 Related Files

- **Component**: `components/custom/meeting-limit-modal.tsx`
- **Examples**: `components/custom/upgrade-plan-wall.tsx`
- **Examples**: `app/owned-meetings/page.tsx`
- **Full Guide**: `MEETING_LIMIT_MODAL_GUIDE.md`

---

## 💡 Pro Tips

### Tip 1: Always Await Fetch

```tsx
// ✅ GOOD
const handleClick = async () => {
  await fetchUserMeetingCount();  // Wait!
  if (userMeetingCount >= limit) { ... }
};

// ❌ BAD
const handleClick = () => {
  fetchUserMeetingCount();  // Doesn't wait
  if (userMeetingCount >= limit) { ... }  // Using stale value
};
```

### Tip 2: Provide Callback for Better UX

```tsx
// Better user experience:
<MeetingLimitModal
  onRemoveMeeting={() => {
    setShowModal(false);
    router.push('/owned-meetings');  // Guide them
  }}
/>
```

### Tip 3: Use for Multiple Features

```tsx
// Same component for meetings, communities, etc.
// Just adjust the limit and callbacks
<MeetingLimitModal
  limit={getFeatureLimit(feature)}  // Dynamic limit
  onRemoveMeeting={() => navigate(`/my-${feature}`)}
/>
```

---

## 🎓 Learning Path

1. **Start**: Read this Quick Start Guide (5 min)
2. **Learn**: Check the full guide `MEETING_LIMIT_MODAL_GUIDE.md` (10 min)
3. **Review**: Look at usage in `upgrade-plan-wall.tsx` (5 min)
4. **Review**: Look at usage in `owned-meetings/page.tsx` (5 min)
5. **Implement**: Add to your component (10 min)
6. **Test**: Test all scenarios (10 min)
7. **Done**: Ship it! 🚀

---

**Need Help?** Check the full guide or look at the example implementations in the files listed above.
