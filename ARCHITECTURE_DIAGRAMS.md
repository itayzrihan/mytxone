# Architecture & Data Flow Diagrams

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER REGISTRATION FLOW                    │
└─────────────────────────────────────────────────────────────────┘

    Registration Page (/register)
           │
           ├─ Form: username, password, fullName, email, 
           │         phone, profileImageUrl
           │
           ↓
    Validation (Zod Schema)
           │
           ├─ Check username length (3-32 chars)
           ├─ Check password length (6+ chars)
           ├─ Check fullName (2+ chars)
           ├─ Check email format
           ├─ Check phone length (5+ chars)
           └─ Check profileImageUrl (valid URL, optional)
           │
           ↓
    Database: createUser()
           │
           ├─ Store: email, password (hashed)
           ├─ Store: fullName
           ├─ Store: notMytxEmail (from form email)
           ├─ Store: phoneNumber
           └─ Store: profileImageUrl
           │
           ↓
    2FA Setup (Mandatory)
           │
           ↓
    User Can Login ✅
```

---

## Meeting Attendees Display Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   VIEWING MEETING ATTENDEES                      │
└─────────────────────────────────────────────────────────────────┘

    Meeting Creator
           │
           └─ Goes to: /owned-meetings
                    │
                    ↓
           My Meetings Page
                    │
              Meeting Cards
                    │
           ┌───────────────────┐
           │ Meeting Title     │
           │ Date/Time         │
           │ Attendee Count    │
           │ [View Attendees]← Click here
           │ [Join Meeting]    │
           └───────────────────┘
                    │
                    ↓
           AttendeesModal Opens
                    │
                    ├─ Fetches: /api/meetings/{id}/attendees
                    │
                    ↓
           API Validation
                    │
                    ├─ Check: User is authenticated
                    ├─ Check: User is meeting creator
                    └─ Return: 401/403 if invalid
                    │
                    ↓
           Database Query
                    │
          SELECT user data
            FROM meetingAttendee
           JOIN user
          WHERE meetingId = {id}
                    │
                    ↓
           Return Attendee List
                    │
                ┌─────────────────────────┐
                │ Attendees Displayed:    │
                │ ├─ Profile Image        │
                │ ├─ Full Name            │
                │ ├─ Email (notMytxEmail) │
                │ ├─ Phone Number         │
                │ └─ [Total Count]        │
                └─────────────────────────┘
```

---

## Database Schema Relationships

```
┌──────────────────────┐         ┌──────────────────────┐
│       User           │         │      Meeting         │
├──────────────────────┤         ├──────────────────────┤
│ id (PK)              │         │ id (PK)              │
│ email                │         │ title                │
│ password             │         │ userId (FK)          │
│ fullName  (NEW)      │         │ startTime            │
│ phoneNumber (NEW)    │         │ endTime              │
│ notMytxEmail (NEW)   │         │ ...                  │
│ profileImageUrl(NEW) │         └──────────────────────┘
│ role                 │                  ▲
│ subscription         │                  │
│ ...                  │                  │ 1
└──────────────────────┘                  │
        ▲                                 │
        │                          ┌──────────────────────┐
        │ N                        │  MeetingAttendee     │
        │                          ├──────────────────────┤
        └──────────────────────────│ id (PK)              │
                                   │ meetingId (FK)       │
                                   │ userId (FK)          │
                                   │ guestName            │
                                   │ guestEmail           │
                                   │ registrationStatus   │
                                   │ attendanceStatus     │
                                   └──────────────────────┘
```

---

## Registration Form Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    REGISTRATION FORM STRUCTURE                   │
└─────────────────────────────────────────────────────────────────┘

AuthForm Component Props:
├─ action: handleSubmit function
├─ children: SubmitButton
├─ defaultUsername: ""
└─ includeProfileFields: true ← Toggle for profile fields

Form Fields Rendered:
│
├─ [Input] Username
│   └─ Validators: 3-32 chars, required
│
├─ [Input] Full Name (if includeProfileFields=true)
│   └─ Validators: 2+ chars, required
│
├─ [Input] Email Address (if includeProfileFields=true)
│   └─ Validators: valid email format, required
│
├─ [Input] Phone Number (if includeProfileFields=true)
│   └─ Validators: 5+ chars, required
│
├─ [Input] Profile Image URL (if includeProfileFields=true)
│   └─ Validators: valid URL, optional
│
├─ [Input] Password
│   └─ Validators: 6+ chars, required
│
└─ [Button] Sign Up (submit)
```

---

## API Endpoint Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│          GET /api/meetings/[id]/attendees Endpoint              │
└─────────────────────────────────────────────────────────────────┘

Request:
    GET /api/meetings/{meetingId}/attendees
    Headers: Authorization (session)

Response Handler:
    │
    ├─ 1. Get Session
    │      └─ Extract current user email
    │
    ├─ 2. Query Database
    │      └─ Get meeting by ID
    │
    ├─ 3. Authorization Check
    │      └─ Verify user is meeting creator
    │
    ├─ 4. If unauthorized:
    │      ├─ 401: User not authenticated
    │      ├─ 403: User not meeting creator
    │      └─ 404: Meeting not found
    │
    └─ 5. If authorized:
           Query attendees with JOIN
           └─ Return attendee profile data

Response Body (200 OK):
    [
      {
        id: "uuid",
        fullName: "John Doe",
        notMytxEmail: "john@example.com",
        phoneNumber: "+1234567890",
        profileImageUrl: "https://..."
      },
      ...
    ]
```

---

## Component Lifecycle: AttendeesModal

```
┌─────────────────────────────────────────────────────────────────┐
│              ATTENDEES MODAL COMPONENT LIFECYCLE                 │
└─────────────────────────────────────────────────────────────────┘

Initial State:
    isOpen: false
    attendees: []
    isLoading: false

User Action: Click "View Attendees"
    │
    ↓
openAttendeesModal(meeting)
    │
    ├─ setSelectedMeetingForAttendees(meeting)
    └─ setIsAttendeesModalOpen(true)
    │
    ↓
Modal Mounts / Props Change
    │
    ├─ Check: isOpen === true
    ├─ Check: meetingId exists
    └─ Call: fetchAttendees()
    │
    ↓
fetchAttendees() starts
    │
    ├─ setIsLoading(true)
    ├─ Fetch: GET /api/meetings/{id}/attendees
    │
    ├─ On Success:
    │   ├─ setAttendees(data)
    │   └─ setIsLoading(false)
    │
    └─ On Error:
        └─ setIsLoading(false)
    │
    ↓
Modal Renders
    │
    ├─ If isLoading: Show "Loading..."
    ├─ If attendees.length === 0: Show "No attendees"
    └─ Else: Show attendee list
    │
    ↓
Each Attendee Card:
    │
    ├─ Profile Image (or Avatar fallback)
    ├─ Full Name
    ├─ Email (with Mail icon)
    └─ Phone (with Phone icon)
    │
    ↓
Total Count: "{count} attendees"
```

---

## State Management in OwnedMeetingsPage

```
┌─────────────────────────────────────────────────────────────────┐
│         STATE MANAGEMENT: OWNED MEETINGS PAGE                    │
└─────────────────────────────────────────────────────────────────┘

Page-Level State:

meetings[]
    ├─ Stores: All user's meetings
    └─ Updated: fetchMeetings()

isLoading: boolean
    ├─ true: While fetching meetings
    └─ false: Meetings loaded

isEditDialogOpen: boolean
    ├─ true: Edit dialog visible
    └─ false: Edit dialog hidden

selectedMeeting: Meeting | null
    ├─ Stores: Meeting being edited
    └─ Cleared: On cancel

isAttendeesModalOpen: boolean (NEW)
    ├─ true: Attendees modal visible
    └─ false: Attendees modal hidden

selectedMeetingForAttendees: Meeting | null (NEW)
    ├─ Stores: Meeting being viewed
    └─ Used: To fetch attendees

formData: EditForm
    ├─ Stores: Form field values
    └─ Updated: On input change
```

---

## User Story: Complete Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPLETE USER JOURNEY                         │
└─────────────────────────────────────────────────────────────────┘

[NEW USER]
    │
    └─ Clicks "Sign Up"
           │
           ├─ Fills: username = "johndoe"
           ├─ Fills: fullName = "John Doe"        (NEW)
           ├─ Fills: email = "john@example.com"   (NEW)
           ├─ Fills: phone = "+1234567890"        (NEW)
           ├─ Fills: imageUrl = "https://..."     (NEW, optional)
           └─ Fills: password = "securepass"
           │
           ├─ Validation passes
           │
           ├─ Database: createUser() stores all fields
           │
           ├─ 2FA setup required
           │
           └─ User created & ready to login

[USER LOGS IN]
    │
    └─ Browses meetings on home page
           │
           ├─ Sees meeting cards
           ├─ Clicks "Register"
           │
           ├─ Registration status updates
           │   ├─ Stores meetingId in Set
           │   ├─ Button changes to "Already registered"
           │   └─ Shows "Unregister" button
           │
           └─ User registered

[MEETING CREATOR]
    │
    └─ Goes to /owned-meetings
           │
           ├─ Sees meeting cards
           ├─ Sees attendee count: "View Attendees (3)"
           └─ Clicks button
           │
           ├─ Modal opens
           │
           ├─ API checks: "Are you the creator?"
           │ ├─ YES: Return attendees ✅
           │ └─ NO: Return 403 ❌
           │
           ├─ Sees attendee list:
           │   ├─ John's profile pic
           │   ├─ John Doe
           │   ├─ john@example.com
           │   └─ +1234567890
           │
           └─ Can see all attendee info!
```

---

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                     TECH STACK OVERVIEW                          │
└─────────────────────────────────────────────────────────────────┘

Frontend:
├─ React 18+ with TypeScript
├─ Next.js 15 (App Router)
├─ Tailwind CSS (Styling)
├─ Shadcn/ui (Components)
└─ Lucide Icons

Backend:
├─ Next.js API Routes
├─ Server-side Rendering
├─ NextAuth.js (Auth)
└─ Zod (Validation)

Database:
├─ PostgreSQL
├─ Drizzle ORM
├─ PostGIS (optional)
└─ Connection Pooling

Deployment:
├─ Vercel (Production)
├─ SSH Tunnels (Development)
└─ Redis (Caching)

Development:
├─ TypeScript
├─ ESLint
├─ Git/GitHub
└─ pnpm (Package Manager)
```

---

## Error Handling Flows

```
┌─────────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING SCENARIOS                      │
└─────────────────────────────────────────────────────────────────┘

GET /api/meetings/[id]/attendees Errors:

401 Unauthorized
    ├─ Cause: User not logged in
    ├─ Response: { error: "Unauthorized" }
    └─ UI: Show login prompt

403 Forbidden
    ├─ Cause: User not meeting creator
    ├─ Response: { error: "You don't have permission..." }
    └─ UI: Show permission denied message

404 Not Found
    ├─ Cause: Meeting doesn't exist
    ├─ Response: { error: "Meeting not found" }
    └─ UI: Show "Meeting not found"

500 Internal Error
    ├─ Cause: Server error
    ├─ Response: { error: "Failed to fetch attendees" }
    └─ UI: Show "Error loading attendees"

Registration Validation Errors:

Invalid Username
    ├─ Reason: Length not 3-32
    └─ Message: "Username must be 3-32 characters"

Invalid Email
    ├─ Reason: Not valid email format
    └─ Message: "Invalid email address"

Invalid Phone
    ├─ Reason: Length < 5
    └─ Message: "Phone number must be valid"

Invalid Image URL
    ├─ Reason: Not valid URL format
    └─ Message: "Invalid URL"
```

---

## Summary

This comprehensive architecture shows:

✅ **User Registration**: Captures profile information  
✅ **Database Design**: Properly normalized schema  
✅ **API Security**: Authorization on all endpoints  
✅ **Component Flow**: Clear state management  
✅ **Error Handling**: Proper error responses  
✅ **User Experience**: Complete journey mapping  

All components work together seamlessly to provide a secure, efficient, and user-friendly system for managing meeting attendees!

---

**Created**: October 28, 2025  
**Architecture Version**: 1.0  
**Status**: ✅ Complete
