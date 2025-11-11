# Community System Documentation

## Overview
A complete social community platform with Facebook-like features, courses, events, leaderboard, and member management.

## Features Implemented

### 1. Database Schema
Complete database structure with the following tables:

#### Core Tables
- **Community**: Main community information
- **CommunityMember**: Member relationships and roles
- **CommunityPost**: Social feed posts with media support
- **CommunityComment**: Nested comments on posts
- **CommunityPostReaction**: Like/reaction system for posts
- **CommunityCommentReaction**: Like/reaction system for comments

#### Extended Features
- **CommunityCourse**: Course management system
- **CommunityCourseLesson**: Individual course lessons
- **CommunityCourseEnrollment**: Track student enrollments and progress
- **CommunityEvent**: Event/calendar system
- **CommunityEventAttendee**: Track event RSVPs
- **CommunityLeaderboard**: Gamification and member rankings

### 2. API Routes

#### Community Management
- `GET /api/communities` - List all communities (with filters)
- `POST /api/communities` - Create new community
- `GET /api/communities/[id]` - Get single community
- `DELETE /api/communities/[id]` - Delete community

#### Posts & Social Feed
- `GET /api/communities/[id]/posts` - Get community posts (paginated)
- `POST /api/communities/[id]/posts` - Create new post
- `GET /api/communities/[id]/posts/[postId]` - Get single post
- `PATCH /api/communities/[id]/posts/[postId]` - Update post
- `DELETE /api/communities/[id]/posts/[postId]` - Delete post

#### Comments
- `GET /api/communities/[id]/posts/[postId]/comments` - Get post comments (nested)
- `POST /api/communities/[id]/posts/[postId]/comments` - Add comment

#### Reactions
- `GET /api/communities/[id]/posts/[postId]/reactions` - Get post reactions
- `POST /api/communities/[id]/posts/[postId]/reactions` - Toggle reaction

#### Courses
- `GET /api/communities/[id]/courses` - List community courses
- `POST /api/communities/[id]/courses` - Create new course

#### Events
- `GET /api/communities/[id]/events` - List events (supports ?upcoming=true)
- `POST /api/communities/[id]/events` - Create new event

#### Members
- `GET /api/communities/[id]/members` - List community members

#### Leaderboard
- `GET /api/communities/[id]/leaderboard` - Get leaderboard rankings

### 3. UI Components

#### Main Components
- **CommunityHeader**: Top header with logo, search, chat, notifications, profile
- **CommunityTabs**: Navigation tabs (Feed, Courses, Calendar, Members, Leaderboard, About)
- **CommunityFeed**: Social feed with infinite scroll
- **CreatePost**: Rich post creation with media upload
- **PostCard**: Individual post display with comments and reactions

#### Tab Components
- **CommunityCourseList**: Course listing and enrollment
- **CommunityCalendar**: Event calendar with RSVP
- **CommunityMembers**: Member directory with search
- **CommunityLeaderboard**: Rankings and gamification
- **CommunityAbout**: Community information and rules

### 4. Page Structure
```
/communities/[id]
├── Header (Logo, Search, Actions)
├── Tabs (6 navigation options)
└── Dynamic Content (Based on active tab)
```

## Key Features

### Social Feed System
- ✅ Create posts with text content
- ✅ Upload multiple media files (images/videos)
- ✅ Like/reaction system
- ✅ Nested comments with replies
- ✅ Edit and delete posts
- ✅ Pinned posts
- ✅ Infinite scroll pagination

### Media Upload
- Supports images and videos
- Maximum 5 files per post
- Preview before posting
- Remove individual media items

### Engagement Features
- Like button with toggle
- Comment system with nested replies
- Share functionality (UI ready)
- Real-time engagement counts

### Course System
- Course listings with thumbnails
- Enrollment tracking
- Progress monitoring
- Instructor information
- Price display (free/paid)

### Event Calendar
- Upcoming events display
- RSVP system
- Virtual meeting links
- Location support
- Attendee count

### Member Management
- Member directory
- Role indicators (Admin, Moderator, Member)
- Search functionality
- Join dates

### Leaderboard
- Point-based ranking system
- Top 3 special highlighting
- Activity metrics (posts, comments, reactions)
- Badge system
- Engagement tracking

## Database Schema Details

### Community Points System
Points are calculated based on:
- Posts created: +10 points
- Comments made: +5 points
- Reactions received: +2 points
- Courses completed: +50 points
- Events attended: +20 points

### Member Roles
- **Admin**: Full control, can moderate
- **Moderator**: Can moderate content
- **Member**: Standard member privileges

### Post Features
- Content (text)
- Media (images/videos via URLs)
- Like count
- Comment count
- Share count
- Pinned status
- Edited flag

## Usage Example

### Creating a Community
```typescript
POST /api/communities
{
  "title": "Web Developers United",
  "description": "A community for web developers",
  "communityType": "learning",
  "category": "technology",
  "imageUrl": "https://...",
  "isPublic": true,
  "requiresApproval": false,
  "tags": ["javascript", "react", "nodejs"]
}
```

### Creating a Post
```typescript
POST /api/communities/[id]/posts
{
  "content": "Hello everyone! Check out my new project.",
  "mediaUrls": ["https://...", "https://..."],
  "mediaTypes": ["image", "video"]
}
```

### Adding a Comment
```typescript
POST /api/communities/[id]/posts/[postId]/comments
{
  "content": "Great post!",
  "parentCommentId": null  // or comment ID for replies
}
```

### Reacting to a Post
```typescript
POST /api/communities/[id]/posts/[postId]/reactions
{
  "reactionType": "like"  // Toggle on/off
}
```

## Styling
- Glass morphism design
- Gradient backgrounds
- Responsive layout
- Mobile-friendly tabs
- Dark theme optimized
- Cyan/Blue accent colors

## Next Steps (Optional Enhancements)
1. Real-time updates with WebSockets
2. Push notifications
3. Direct messaging
4. Video/Audio posts
5. Live streaming
6. Polls and surveys
7. File attachments
8. Emoji reactions (beyond like)
9. Post sharing to other communities
10. Analytics dashboard
11. Moderation tools
12. Report system
13. Auto-moderation with AI
14. Community insights

## File Structure
```
app/
├── communities/
│   ├── [id]/
│   │   └── page.tsx (Main dynamic page)
│   └── page.tsx (Community list)
└── api/
    └── communities/
        ├── route.ts
        └── [id]/
            ├── route.ts
            ├── posts/
            ├── courses/
            ├── events/
            ├── members/
            └── leaderboard/

components/custom/
├── community-header.tsx
├── community-tabs.tsx
├── community-feed.tsx
├── create-post.tsx
├── post-card.tsx
├── community-course-list.tsx
├── community-calendar.tsx
├── community-members.tsx
├── community-leaderboard.tsx
└── community-about.tsx

db/
└── schema.ts (Enhanced with all community tables)
```

## Testing Checklist
- [ ] Create a community
- [ ] View community page
- [ ] Create a post with text
- [ ] Create a post with media
- [ ] Like a post
- [ ] Comment on a post
- [ ] Reply to a comment
- [ ] View courses tab
- [ ] View events tab
- [ ] View members tab
- [ ] View leaderboard tab
- [ ] View about tab
- [ ] Search members
- [ ] Load more posts (pagination)

## Dependencies Added
- `date-fns` (for date formatting)
- `sonner` (for toast notifications)
- `next-auth` (for session management)
- Existing UI components (Button, Card, Input, Textarea)

## Notes
- Some UI components may need radix-ui packages installed (`@radix-ui/react-avatar`)
- Media upload uses existing `/api/upload` endpoint
- Session management uses next-auth
- All routes are protected and require authentication
- Member checking ensures only members can post
