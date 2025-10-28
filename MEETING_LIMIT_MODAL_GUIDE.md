# Meeting Limit Modal - Reusable Component Guide

## Overview

The `MeetingLimitModal` component is a reusable, plan-aware modal that manages meeting creation limits for users across different subscription tiers (Free, Basic, Pro).

## Component Location
`components/custom/meeting-limit-modal.tsx`

## Features

✅ **Plan-Aware**: Automatically customizes messages and features for Free (1 meeting) and Basic (3 meetings) users
✅ **Progress Tracking**: Visual progress bar showing current meetings vs limit
✅ **Upgrade Path**: Direct navigation to pricing page for plan upgrades
✅ **Flexible Modes**: Supports both 'reached' (user hit limit) and 'warning' modes
✅ **Customizable Callbacks**: Optional callbacks for removing meetings or other actions
✅ **Beautiful UI**: Glassmorphic design matching the app's aesthetic

## Component Props

```typescript
interface MeetingLimitModalProps {
  open: boolean;                    // Controls modal visibility
  onOpenChange: (open: boolean) => void;  // Callback to change visibility
  currentCount: number;             // Current active meetings count
  limit: number;                    // Maximum meetings allowed (1 for free, 3 for basic)
  plan: string;                     // User's plan ('free', 'basic', 'pro')
  onClose?: () => void;             // Optional close callback
  onRemoveMeeting?: () => void;     // Optional callback for "Remove a Meeting" action
  mode?: 'reached' | 'warning';    // Display mode (default: 'reached')
}
```

## Usage Examples

### Example 1: Free User Hitting Limit in Upgrade Wall

**Location**: `components/custom/upgrade-plan-wall.tsx`

When a free user clicks "START FREE" and already has 1 active meeting:

```tsx
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

### Example 2: Basic User Hitting Limit in Owned Meetings

**Location**: `app/owned-meetings/page.tsx`

When a basic user tries to create their 4th meeting:

```tsx
<MeetingLimitModal
  open={isLimitModalOpen}
  onOpenChange={setIsLimitModalOpen}
  currentCount={meetingCount}
  limit={3}
  plan="basic"
  mode="reached"
  onRemoveMeeting={() => {
    setIsLimitModalOpen(false);
  }}
/>
```

## Integration Points

### 1. **Upgrade Wall** (`components/custom/upgrade-plan-wall.tsx`)

**When to Show**: Free user clicks "START FREE" but has already created their 1 allowed meeting

**Flow**:
```
User clicks "START FREE"
    ↓
Check user's current meeting count via /api/user/plan
    ↓
If count >= 1 → Show MeetingLimitModal
    ↓
If count < 1 → Open CreateMeetingDialog
```

**Implementation**:
```tsx
const handleStartFreeClick = async () => {
  if (!user) {
    openAuthModal('login');
    return;
  }

  if (type === 'meeting') {
    await fetchUserMeetingCount();
    
    const currentCount = userMeetingCount;
    if (currentCount >= 1) {
      setShowMeetingLimitModal(true);
      return;
    }
  }

  setShowCreateMeetingDialog(true);
};
```

### 2. **Owned Meetings Page** (`app/owned-meetings/page.tsx`)

**When to Show**: User tries to create a new meeting but has reached their plan's limit

**Flow**:
```
User clicks "Create Meeting"
    ↓
Check if meetingCount >= limit for their plan
    ↓
If yes → Show MeetingLimitModal with options:
         - Remove a Meeting (close modal)
         - Upgrade Plan (navigate to /pricing)
    ↓
If no → Show CreateMeetingDialog
```

**Implementation**:
```tsx
const handleCreateClick = () => {
  const meetingLimits = {
    free: 1,
    basic: 3,
    pro: Infinity,
  };

  const limit = meetingLimits[userPlan as keyof typeof meetingLimits] || 1;

  if (userPlan === "free" && meetingCount >= limit) {
    setIsLimitModalOpen(true);
    return;
  }

  if (userPlan === "basic" && meetingCount >= limit) {
    setIsLimitModalOpen(true);
    return;
  }

  setIsCreateDialogOpen(true);
};
```

## Backend Integration

The modal relies on the `/api/user/plan` endpoint to fetch:
- User's current subscription plan
- Current meeting count (active meetings only)

**Endpoint**: `app/api/user/plan/route.ts`

```typescript
// Returns:
{
  plan: "free" | "basic" | "pro",
  meetingCount: number  // Only counts upcoming/ongoing meetings
}
```

## Modal Display Logic

### Plan-Specific Content

**Free User**:
- Title: "Free Plan Limit Reached"
- Limit: 1 meeting
- Icon: ⚠️ Yellow alert triangle
- Upgrade benefits:
  - Create up to 3 active meetings
  - Advanced meeting features
  - Priority support

**Basic User**:
- Title: "Basic Plan Limit Reached"
- Limit: 3 meetings
- Icon: ⚡ Orange lightning bolt
- Upgrade benefits:
  - Unlimited active meetings
  - All pro features
  - 24/7 premium support

### Progress Bar

Visual representation of meeting usage:
- Shows: `currentCount / limit`
- Color: Yellow for free, Orange for basic
- Updates dynamically

## Best Practices

### ✅ DO

1. **Fetch fresh count before showing modal**
   ```tsx
   await fetchUserMeetingCount();
   if (currentCount >= limit) {
     setShowMeetingLimitModal(true);
   }
   ```

2. **Provide callback handlers**
   ```tsx
   <MeetingLimitModal
     onRemoveMeeting={() => {
       setIsModalOpen(false);
       // Navigate to meetings or refresh
     }}
   />
   ```

3. **Use consistent limit values**
   ```tsx
   const meetingLimits = {
     free: 1,
     basic: 3,
     pro: Infinity,
   };
   ```

### ❌ DON'T

1. **Don't hardcode limits in components**
   - Always fetch from backend or use centralized constants

2. **Don't show modal without user context**
   - Ensure user data is available before checking limits

3. **Don't forget to refresh count**
   - Meeting count can change if user deletes meetings

## Customization

### Styling

The component uses Tailwind CSS with a dark theme. To customize:

**Modal background**: `bg-black/90`
**Border**: `border-white/20`
**Icons**: Modify `AlertTriangle` or `Zap` icons

```tsx
// In the component:
<div className={`p-2 ${details.bgColor} rounded-full`}>
  {details.icon}
</div>
```

### Text Content

Modify the `getPlanDetails()` function to customize:
- Titles
- Descriptions
- Benefits list
- Icon selection

```tsx
const getPlanDetails = () => {
  if (isFreeUser) {
    return {
      title: 'Free Plan Limit Reached',
      description: '...',
      nextPlan: 'Basic',
      icon: <AlertTriangle />,
      bgColor: 'bg-yellow-500/20',
    };
  }
  // ... more plans
};
```

## Testing Checklist

- [ ] Free user with 1 meeting clicks "START FREE" → Shows limit modal
- [ ] Free user with 0 meetings clicks "START FREE" → Opens create dialog
- [ ] Basic user with 3 meetings clicks "Create Meeting" → Shows limit modal
- [ ] Basic user with <3 meetings clicks "Create Meeting" → Opens create dialog
- [ ] Pro user with 10 meetings can still create → Shows create dialog
- [ ] "Remove a Meeting" button closes modal
- [ ] "Upgrade Plan" button navigates to /pricing
- [ ] Modal displays correct meeting count and limit
- [ ] Progress bar fills correctly
- [ ] Modal closes when clicking outside or X button

## Related Files

- Backend API: `app/api/user/plan/route.ts`
- Upgrade Wall: `components/custom/upgrade-plan-wall.tsx`
- Owned Meetings: `app/owned-meetings/page.tsx`
- User Plan Context: `components/custom/user-plan-context.tsx`
- Create Meeting Dialog: `components/custom/create-meeting-dialog.tsx`

## Future Enhancements

1. **Email Notification**: Notify users when approaching limit
2. **Analytics**: Track how many users hit limits and upgrade
3. **Limit Increase Offer**: Show special offers when near limit
4. **Graduated Notifications**: Warn at 80%, 95%, and 100% of limit
5. **Meeting Archival**: Suggest archiving old meetings instead of deletion

## Questions?

For questions or improvements to this component, refer to:
- Component code: `components/custom/meeting-limit-modal.tsx`
- Implementation examples in upgrade wall and owned meetings pages
