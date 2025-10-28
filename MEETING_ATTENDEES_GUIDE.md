# Meeting Attendees Management Guide

## Overview
This implementation adds the ability for meeting creators to view all registered attendees for their meetings, including detailed attendee information collected during registration.

## Features

### 1. Enhanced User Registration
Users now provide additional profile information during registration:
- **Full Name** (required)
- **Email Address** (stored as `notMytxEmail`, required)
- **Phone Number** (required)
- **Profile Image URL** (optional)

This information is stored in the `User` table and associated with each attendee.

### 2. Attendees Modal
A new modal component displays all attendees for a meeting with:
- Profile image (with fallback avatar)
- Full name
- Email address
- Phone number
- Total attendee count

### 3. View Attendees Button
In the "Manage your created meetings" screen (`/owned-meetings`):
- Each meeting card now has a "View Attendees" button
- Shows the count of registered attendees in the button
- Clicking opens a modal with full attendee details
- Only the meeting creator can view attendees

## Implementation Details

### Database Schema
**User Table** - New Fields:
```
- full_name: varchar(255)
- phone_number: varchar(20)
- not_mytx_email: varchar(255)
- profile_image_url: text
```

### Components

#### `AttendeesModal` Component
**Location**: `components/custom/attendees-modal.tsx`

Displays attendee information in a modal dialog:
- Fetches attendees from `/api/meetings/{id}/attendees` endpoint
- Shows profile image, name, email, and phone for each attendee
- Displays total attendee count
- Loading and empty states

**Props**:
- `isOpen: boolean` - Controls modal visibility
- `onOpenChange: (open: boolean) => void` - Callback when modal state changes
- `meetingId: string` - ID of the meeting
- `meetingTitle?: string` - Title of the meeting (optional)

### API Endpoint

#### `GET /api/meetings/[id]/attendees`
**Location**: `app/api/meetings/[id]/attendees/route.ts`

Returns list of attendees for a specific meeting.

**Authorization**: Only the meeting creator can view attendees

**Response**: Array of attendee objects
```typescript
{
  id: string;
  fullName: string | null;
  notMytxEmail: string | null;
  phoneNumber: string | null;
  profileImageUrl: string | null;
}[]
```

**Error Responses**:
- `401 Unauthorized` - User is not authenticated
- `403 Forbidden` - User is not the meeting creator
- `404 Not Found` - Meeting doesn't exist
- `500 Internal Server Error` - Server error

### UI Updates

#### Owned Meetings Page (`/owned-meetings`)
**Location**: `app/owned-meetings/page.tsx`

Updated meeting card footer to include:
- "View Attendees" button with attendee count
- Maintains existing "Join Meeting" button (if meeting URL exists)
- Both buttons displayed side-by-side in the card footer

### State Management

**New States** in OwnedMeetingsPage:
- `isAttendeesModalOpen: boolean` - Controls modal visibility
- `selectedMeetingForAttendees: Meeting | null` - Selected meeting for viewing attendees

**New Functions**:
- `openAttendeesModal(meeting: Meeting)` - Opens attendees modal for a meeting

## User Flow

### Viewing Meeting Attendees

1. Creator navigates to "My Meetings" (`/owned-meetings`)
2. Creator sees list of their created meetings
3. Each meeting card displays:
   - Meeting details (title, type, date, time)
   - Number of registered attendees
   - "View Attendees" button
4. Creator clicks "View Attendees" button
5. Modal opens showing:
   - All registered attendees
   - Each attendee's profile information:
     - Profile picture (if provided)
     - Full name
     - Email address
     - Phone number
   - Total attendee count

## Security Considerations

1. **Authorization**: Only meeting creators can view attendees for their meetings
2. **Email Verification**: Email addresses are validated during registration
3. **Data Privacy**: Attendee information is only visible to the meeting creator
4. **User Consent**: Users explicitly provide their phone number and email during registration

## Example Usage

### Frontend - Opening Attendees Modal
```typescript
const openAttendeesModal = (meeting: Meeting) => {
  setSelectedMeetingForAttendees(meeting);
  setIsAttendeesModalOpen(true);
};

// In JSX:
<Button onClick={() => openAttendeesModal(meeting)}>
  View Attendees ({meeting.attendeeCount})
</Button>

<AttendeesModal
  isOpen={isAttendeesModalOpen}
  onOpenChange={setIsAttendeesModalOpen}
  meetingId={selectedMeetingForAttendees?.id || ""}
  meetingTitle={selectedMeetingForAttendees?.title}
/>
```

### Backend - Fetching Attendees
```typescript
// GET /api/meetings/[meetingId]/attendees
const response = await fetch(`/api/meetings/${meetingId}/attendees`);
const attendees = await response.json();

// Returns:
[
  {
    id: "user-id",
    fullName: "John Doe",
    notMytxEmail: "john@example.com",
    phoneNumber: "+1234567890",
    profileImageUrl: "https://example.com/image.jpg"
  },
  // ... more attendees
]
```

## Styling

### Color Scheme
- Primary buttons: Cyan (`bg-cyan-500/20`, `text-cyan-400`)
- Attendees button: Purple (`bg-purple-500/20`, `text-purple-400`)
- Modal: Dark background with glass morphism effect

### Components Used
- Custom modal with scroll support
- Image component with fallback avatar
- Responsive grid layout
- Utility icons (Mail, Phone, User)

## Database Migration

Migration file: `lib/drizzle/0024_add_user_profile_fields.sql`

Adds four new columns to the User table for profile information.

To apply migration:
```bash
npx drizzle-kit migrate
```

## Testing Checklist

- [ ] User can register with all profile fields
- [ ] All profile fields are stored in database
- [ ] Meeting creator can click "View Attendees" button
- [ ] Attendees modal opens and displays attendee list
- [ ] Attendee information is correctly displayed (name, email, phone, image)
- [ ] Modal shows total attendee count
- [ ] Non-creators cannot access attendee information via API
- [ ] Empty attendee list shows appropriate message
- [ ] Profile images load correctly (or show fallback avatar)
- [ ] Modal scrolls for many attendees

## Future Enhancements

1. **Export Attendee List**
   - Export attendees to CSV or PDF
   - Include contact information

2. **Attendee Filtering**
   - Filter by registration status (approved, pending, rejected)
   - Search attendees by name or email

3. **Attendee Management**
   - Approve/reject registrations that require approval
   - Send messages/emails to attendees
   - Download contact list

4. **Analytics**
   - Track attendance rates
   - Generate attendance reports
   - Monitor registration trends

5. **Integration**
   - Sync attendee data with CRM
   - Export to email marketing tools
   - Calendar integrations

## Related Files

### Frontend Components
- `components/custom/attendees-modal.tsx` - Attendees display modal
- `app/owned-meetings/page.tsx` - Updated meeting management page
- `components/custom/auth-form.tsx` - Updated registration form

### Backend/Database
- `app/api/meetings/[id]/attendees/route.ts` - Attendees API endpoint
- `db/schema.ts` - Updated User table schema
- `db/queries.ts` - Updated query functions
- `lib/drizzle/0024_add_user_profile_fields.sql` - Database migration

### Configuration
- `app/(auth)/actions.ts` - Updated registration action
- `app/(auth)/register/page.tsx` - Updated registration page

## Support & Troubleshooting

### Issue: API returns 403 Forbidden
**Solution**: Ensure you're logged in as the meeting creator. Only creators can view their meeting's attendees.

### Issue: Attendees modal doesn't load
**Solution**: Check browser console for errors. Ensure the meeting ID is correct and the meeting exists.

### Issue: Profile images not displaying
**Solution**: Verify the image URL is valid and publicly accessible. The component will show a fallback avatar if image fails to load.

### Issue: Phone numbers not displaying correctly
**Solution**: Phone numbers are stored as-is. Consider formatting during display if needed in future versions.
