# Community System - Quick Reference

## 🚀 Quick Start

### Access a Community
```
URL: /communities/[community-id]
```

### Component Import Examples
```typescript
import { CommunityHeader } from "@/components/custom/community-header";
import { CommunityFeed } from "@/components/custom/community-feed";
import { PostCard } from "@/components/custom/post-card";
```

## 📡 API Endpoints Cheat Sheet

### Communities
```typescript
GET    /api/communities              // List all
POST   /api/communities              // Create
GET    /api/communities/[id]         // Get one
DELETE /api/communities/[id]         // Delete
```

### Posts
```typescript
GET    /api/communities/[id]/posts           // List
POST   /api/communities/[id]/posts           // Create
GET    /api/communities/[id]/posts/[postId]  // Get
PATCH  /api/communities/[id]/posts/[postId]  // Update
DELETE /api/communities/[id]/posts/[postId]  // Delete
```

### Engagement
```typescript
GET  /api/communities/[id]/posts/[postId]/comments   // Get comments
POST /api/communities/[id]/posts/[postId]/comments   // Add comment
GET  /api/communities/[id]/posts/[postId]/reactions  // Get reactions
POST /api/communities/[id]/posts/[postId]/reactions  // Toggle reaction
```

### Other Features
```typescript
GET  /api/communities/[id]/courses      // List courses
GET  /api/communities/[id]/events       // List events
GET  /api/communities/[id]/members      // List members
GET  /api/communities/[id]/leaderboard  // Get rankings
```

## 🎨 Component Props Quick Reference

### CommunityHeader
```typescript
<CommunityHeader 
  community={{
    ...communityData,
    memberCount: number
  }}
/>
```

### CommunityTabs
```typescript
<CommunityTabs 
  activeTab="feed" | "courses" | "calendar" | "members" | "leaderboard" | "about"
  onTabChange={(tab) => setActiveTab(tab)}
/>
```

### CommunityFeed
```typescript
<CommunityFeed 
  communityId={string}
/>
```

### CreatePost
```typescript
<CreatePost 
  communityId={string}
  onPostCreated={() => void}
/>
```

### PostCard
```typescript
<PostCard 
  post={postData}
  communityId={string}
  onUpdate={() => void}
/>
```

## 🗄️ Database Quick Reference

### Tables Created
1. `Community` - Main community data
2. `CommunityMember` - Member relationships
3. `CommunityPost` - Posts in feed
4. `CommunityComment` - Comments on posts
5. `CommunityPostReaction` - Likes/reactions on posts
6. `CommunityCommentReaction` - Likes on comments
7. `CommunityCourse` - Course listings
8. `CommunityCourseLesson` - Individual lessons
9. `CommunityCourseEnrollment` - Student enrollments
10. `CommunityEvent` - Calendar events
11. `CommunityEventAttendee` - Event RSVPs
12. `CommunityLeaderboard` - User rankings

### Key Relationships
```
Community
  ├─ has many → Posts
  ├─ has many → Members
  ├─ has many → Courses
  ├─ has many → Events
  └─ has many → Leaderboard entries

Post
  ├─ has many → Comments
  └─ has many → Reactions

Comment
  ├─ has many → Replies (self-referential)
  └─ has many → Reactions
```

## 🎯 Common Code Patterns

### Fetching Community Data
```typescript
const response = await fetch(`/api/communities/${id}`);
const community = await response.json();
```

### Creating a Post
```typescript
const response = await fetch(`/api/communities/${id}/posts`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    content: "Hello world!",
    mediaUrls: ["url1", "url2"],
    mediaTypes: ["image", "video"]
  })
});
```

### Adding a Comment
```typescript
const response = await fetch(
  `/api/communities/${id}/posts/${postId}/comments`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: "Great post!",
      parentCommentId: null  // or commentId for reply
    })
  }
);
```

### Toggle Reaction
```typescript
const response = await fetch(
  `/api/communities/${id}/posts/${postId}/reactions`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reactionType: "like" })
  }
);
```

## 🎨 Styling Classes

### Common Patterns
```css
/* Glass morphism card */
bg-zinc-900/50 border-white/10 backdrop-blur-xl

/* Gradient button */
bg-gradient-to-r from-cyan-500 to-blue-600

/* Hover effects */
hover:bg-white/10 hover:text-cyan-400

/* Avatar fallback */
bg-gradient-to-br from-purple-500 to-pink-600
```

## 🔑 Key Features Summary

| Feature | Status | Component |
|---------|--------|-----------|
| Community Header | ✅ | `CommunityHeader` |
| Tab Navigation | ✅ | `CommunityTabs` |
| Social Feed | ✅ | `CommunityFeed` |
| Create Posts | ✅ | `CreatePost` |
| Media Upload | ✅ | Built into `CreatePost` |
| Comments | ✅ | Part of `PostCard` |
| Reactions | ✅ | Part of `PostCard` |
| Courses | ✅ | `CommunityCourseList` |
| Events | ✅ | `CommunityCalendar` |
| Members | ✅ | `CommunityMembers` |
| Leaderboard | ✅ | `CommunityLeaderboard` |
| About | ✅ | `CommunityAbout` |

## 📱 Responsive Breakpoints

```typescript
// Mobile first approach
sm:  640px   // Small devices
md:  768px   // Medium devices
lg:  1024px  // Large devices
xl:  1280px  // Extra large
2xl: 1536px  // 2X Extra large
```

## 🎯 Points System

| Action | Points |
|--------|--------|
| Create Post | +10 |
| Add Comment | +5 |
| Receive Reaction | +2 |
| Complete Course | +50 |
| Attend Event | +20 |

## 🛠️ Useful Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Push database changes
npm run db:push

# Generate migration
npx drizzle-kit generate:pg

# Open Drizzle Studio
npx drizzle-kit studio
```

## 🐛 Debug Tips

### Check Authentication
```typescript
import { auth } from "@/app/(auth)/auth";
const session = await auth();
console.log("User:", session?.user);
```

### Check Database Query
```typescript
const posts = await db
  .select()
  .from(communityPost)
  .where(eq(communityPost.communityId, id));
console.log("Posts found:", posts.length);
```

### Check API Response
```typescript
console.log("Response status:", response.status);
console.log("Response data:", await response.json());
```

## 📚 Documentation Files

1. **COMMUNITY_SYSTEM_DOCUMENTATION.md** - Complete documentation
2. **COMMUNITY_IMPLEMENTATION_SUMMARY.md** - Implementation overview
3. **COMMUNITY_ARCHITECTURE_DIAGRAM.md** - System architecture
4. **COMMUNITY_DEPLOYMENT_CHECKLIST.md** - Deployment guide
5. **COMMUNITY_QUICK_REFERENCE.md** - This file

## 🚨 Important Notes

1. **Authentication Required**: All POST/PATCH/DELETE operations require valid session
2. **Member Check**: Only community members can create posts
3. **File Upload**: Uses existing `/api/upload` endpoint
4. **Pagination**: Default 10 posts per page, adjustable
5. **Media Limit**: Max 5 files per post
6. **Nested Comments**: Supports unlimited nesting depth
7. **Reaction Toggle**: Same reaction twice = remove

## 🎉 You're All Set!

The community system is fully implemented and ready to use. Navigate to `/communities/[id]` to see it in action!

For detailed information, refer to the comprehensive documentation files listed above.
