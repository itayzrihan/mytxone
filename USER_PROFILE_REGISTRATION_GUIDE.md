# User Profile Registration Enhancement Guide

## Overview
This document describes the implementation of extended user profile collection during registration, allowing the app to gather more information about users during sign-up.

## Changes Made

### 1. Database Schema Updates
**File**: `db/schema.ts`

Added four new fields to the `User` table:
- `fullName: varchar(255)` - User's full name
- `phoneNumber: varchar(20)` - User's phone number
- `notMytxEmail: varchar(255)` - User's external email address (separate from username email)
- `profileImageUrl: text` - URL to user's profile image

### 2. Database Migration
**File**: `lib/drizzle/0024_add_user_profile_fields.sql`

Migration script that adds the four new columns to the User table:
```sql
ALTER TABLE "User" ADD COLUMN "full_name" varchar(255);
ALTER TABLE "User" ADD COLUMN "phone_number" varchar(20);
ALTER TABLE "User" ADD COLUMN "not_mytx_email" varchar(255);
ALTER TABLE "User" ADD COLUMN "profile_image_url" text;
```

### 3. Registration Form UI Updates
**File**: `components/custom/auth-form.tsx`

Enhanced the `AuthForm` component with:
- New optional prop: `includeProfileFields: boolean`
- When enabled, displays additional form fields:
  - Full Name (required)
  - Email Address (required)
  - Phone Number (required)
  - Profile Image URL (optional)

### 4. Registration Page Updates
**File**: `app/(auth)/register/page.tsx`

Updated the registration page to pass `includeProfileFields={true}` to the AuthForm component.

### 5. Registration Action Updates
**File**: `app/(auth)/actions.ts`

Enhanced the `register` action to:
- Accept profile fields from form data
- Validate new fields with Zod schema
- Pass profile data to `createUser` function
- Fields are required: fullName, notMytxEmail, phoneNumber
- Field is optional: profileImageUrl

**Updated Schema**:
```typescript
const registrationFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(32, "Username must not exceed 32 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  notMytxEmail: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(5, "Phone number must be valid"),
  profileImageUrl: z.string().url("Invalid URL").optional(),
});
```

### 6. Database Query Updates
**File**: `db/queries.ts`

Updated the following functions to handle new profile fields:
- `createUser()` - Now accepts optional `profileData` parameter
- `getAllUsers()` - Includes new fields in select
- `getUserById()` - Includes new fields in select
- `updateUserRole()` - Includes new fields in returning statement
- `updateUserSubscription()` - Includes new fields in returning statement

**createUser function signature**:
```typescript
export async function createUser(
  email: string,
  password: string,
  profileData?: {
    fullName?: string;
    notMytxEmail?: string;
    phoneNumber?: string;
    profileImageUrl?: string;
  }
)
```

## User Flow

### Current Registration Process
1. User navigates to `/register` page
2. User fills in:
   - Username (converted to email internally)
   - Full Name
   - Email Address (stored in `notMytxEmail` field)
   - Phone Number
   - Profile Image URL (optional)
   - Password
3. Form data is submitted to `register` action
4. User account is created with all profile information
5. User is redirected to 2FA setup modal (mandatory)
6. After 2FA setup, user can log in

### Available Data
When the user logs in or their profile is accessed, the following information is available:
- `email` - Generated username email (e.g., john_doe@mytx.one)
- `notMytxEmail` - User's actual email address
- `fullName` - User's full name
- `phoneNumber` - User's phone number
- `profileImageUrl` - URL to user's profile picture

## Next Steps

### Displaying Attendee Information
To show attendee information in the "Manage your created meetings" screen:

1. Update the meeting view to display registered attendees
2. Show attendee details: fullName, notMytxEmail, phoneNumber, profileImageUrl
3. Creator can see list of all registered attendees for their meetings

### Implementation Details
The attendee information is now available in the User table and can be joined with MeetingAttendee table to display attendee information.

## Example Usage

### Fetching User with Profile
```typescript
const user = await getUserById(userId);
console.log(user.fullName); // "John Doe"
console.log(user.notMytxEmail); // "john@example.com"
console.log(user.phoneNumber); // "+1234567890"
console.log(user.profileImageUrl); // "https://example.com/image.jpg"
```

### Creating User with Profile
```typescript
await createUser("john_doe@mytx.one", hashedPassword, {
  fullName: "John Doe",
  notMytxEmail: "john@example.com",
  phoneNumber: "+1234567890",
  profileImageUrl: "https://example.com/image.jpg"
});
```

## Security Considerations
- Profile information is stored securely in the database
- Phone numbers are stored as-is (consider encryption for future)
- Email addresses (notMytxEmail) are validated before storing
- Profile image URLs are validated as proper URLs
- All user data is treated as confidential

## Testing Recommendations
1. Create new user account with all profile fields
2. Verify all fields are stored correctly in database
3. Test with missing optional fields (profileImageUrl)
4. Verify profile information appears correctly in user dashboard
5. Test that attendee information is retrievable in meeting screens
