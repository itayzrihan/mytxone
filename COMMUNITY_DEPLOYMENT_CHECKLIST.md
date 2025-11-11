# Community System - Deployment Checklist

## 📋 Pre-Deployment Checklist

### 1. Database Setup
- [ ] Run database migration to create new tables
  ```bash
  npm run db:push
  # or
  npx drizzle-kit push:pg
  ```

- [ ] Verify all tables exist:
  - Community
  - CommunityMember
  - CommunityPost
  - CommunityComment
  - CommunityPostReaction
  - CommunityCommentReaction
  - CommunityCourse
  - CommunityCourseLesson
  - CommunityCourseEnrollment
  - CommunityEvent
  - CommunityEventAttendee
  - CommunityLeaderboard

### 2. Dependencies
- [ ] Verify required packages are installed:
  ```bash
  npm install date-fns sonner
  ```

- [ ] Optional: Install Radix UI Avatar for better avatars
  ```bash
  npm install @radix-ui/react-avatar
  ```

### 3. Environment Variables
- [ ] Ensure database connection string is set
- [ ] Verify authentication is configured
- [ ] Check file upload endpoint is working (`/api/upload`)

### 4. Testing Checklist

#### Basic Functionality
- [ ] Navigate to `/communities`
- [ ] Create a new community
- [ ] Navigate to community page `/communities/[id]`
- [ ] Verify header displays correctly

#### Feed Tab
- [ ] Create a text-only post
- [ ] Create a post with image
- [ ] Create a post with video
- [ ] Like a post
- [ ] Unlike a post (toggle)
- [ ] Add a comment
- [ ] Reply to a comment
- [ ] View nested comments
- [ ] Scroll to load more posts

#### Courses Tab
- [ ] View courses list (may be empty initially)
- [ ] Create a course (needs admin access)
- [ ] View course details

#### Calendar Tab
- [ ] View upcoming events (may be empty)
- [ ] Create an event (needs permission)
- [ ] RSVP to an event

#### Members Tab
- [ ] View all members
- [ ] Search for members
- [ ] View member roles

#### Leaderboard Tab
- [ ] View rankings (may be empty initially)
- [ ] Check point calculations
- [ ] Verify top 3 highlighting

#### About Tab
- [ ] View community description
- [ ] Check member count
- [ ] View tags
- [ ] Read community rules

### 5. Performance Checks
- [ ] Test page load time
- [ ] Verify image/video loading
- [ ] Check pagination performance
- [ ] Test search functionality
- [ ] Verify mobile responsiveness

### 6. Security Checks
- [ ] Authentication required for posting
- [ ] Only members can create posts
- [ ] Only post owners can edit/delete
- [ ] Verify role-based permissions
- [ ] Check XSS protection
- [ ] Validate file upload limits

### 7. UI/UX Validation
- [ ] Header displays on all screen sizes
- [ ] Tabs scroll horizontally on mobile
- [ ] Search bar works properly
- [ ] Notifications bell is clickable
- [ ] Avatar fallbacks display correctly
- [ ] Loading states show properly
- [ ] Error messages are clear
- [ ] Toast notifications work

## 🔧 Configuration Options

### Post Settings
```typescript
// In create-post.tsx
const MAX_MEDIA_FILES = 5;  // Adjustable
const ALLOWED_IMAGE_TYPES = ["image/*"];
const ALLOWED_VIDEO_TYPES = ["video/*"];
```

### Pagination Settings
```typescript
// In community-feed.tsx
const POSTS_PER_PAGE = 10;  // Adjustable
```

### Points System
```typescript
// In schema comments
POST_POINTS = 10
COMMENT_POINTS = 5
REACTION_POINTS = 2
COURSE_COMPLETE_POINTS = 50
EVENT_ATTEND_POINTS = 20
```

## 🚀 Deployment Steps

### 1. Local Testing
```bash
# Start development server
npm run dev

# Open browser
http://localhost:3000/communities
```

### 2. Build for Production
```bash
# Run production build
npm run build

# Test production build locally
npm run start
```

### 3. Deploy to Platform
```bash
# For Vercel
vercel --prod

# For other platforms, follow their deployment guides
```

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module '@/components/ui/avatar'"
**Solution**: Avatar component created at `components/ui/avatar.tsx`

### Issue: "Failed to load posts"
**Solution**: 
1. Check database tables exist
2. Verify API routes are accessible
3. Check authentication is working

### Issue: "Media upload fails"
**Solution**:
1. Verify `/api/upload` endpoint exists
2. Check file size limits
3. Verify upload directory permissions

### Issue: "Comments not loading"
**Solution**:
1. Check post ID is valid
2. Verify comments API route
3. Check database relations

### Issue: "Leaderboard empty"
**Solution**: Leaderboard populates as users engage. Create posts/comments to generate data.

## 📊 Monitoring

### Metrics to Track
- [ ] Page load time
- [ ] API response times
- [ ] Media upload success rate
- [ ] User engagement (posts/day)
- [ ] Error rates
- [ ] Active communities count

### Database Queries to Monitor
```sql
-- Most active communities
SELECT title, member_count FROM "Community" ORDER BY member_count DESC LIMIT 10;

-- Total posts count
SELECT COUNT(*) FROM "CommunityPost";

-- Top contributors
SELECT user_id, points FROM "CommunityLeaderboard" ORDER BY points DESC LIMIT 10;
```

## 🔄 Post-Deployment

### Immediate Actions
- [ ] Test critical user flows
- [ ] Monitor error logs
- [ ] Check database performance
- [ ] Verify media uploads work
- [ ] Test on multiple devices

### First Week
- [ ] Gather user feedback
- [ ] Monitor engagement metrics
- [ ] Check for performance bottlenecks
- [ ] Review error patterns
- [ ] Optimize slow queries

### Ongoing Maintenance
- [ ] Regular database backups
- [ ] Monitor disk space (media storage)
- [ ] Update dependencies
- [ ] Review security issues
- [ ] Optimize performance

## 🎯 Success Metrics

### Week 1 Goals
- [ ] 10+ active communities
- [ ] 100+ posts created
- [ ] 500+ comments
- [ ] 1000+ reactions

### Month 1 Goals
- [ ] 50+ communities
- [ ] 1000+ posts
- [ ] 5000+ comments
- [ ] Active daily users

## 📞 Support Resources

### Documentation Files
- `COMMUNITY_SYSTEM_DOCUMENTATION.md` - Complete system docs
- `COMMUNITY_IMPLEMENTATION_SUMMARY.md` - Quick reference
- `COMMUNITY_ARCHITECTURE_DIAGRAM.md` - Visual architecture

### Code Locations
- Pages: `/app/communities/[id]/page.tsx`
- API: `/app/api/communities/`
- Components: `/components/custom/community-*.tsx`
- Schema: `/db/schema.ts`

## ✅ Final Verification

Before marking complete:
- [ ] All database tables created
- [ ] All API routes responding
- [ ] All UI components rendering
- [ ] Authentication working
- [ ] File uploads functional
- [ ] Mobile responsive
- [ ] Performance acceptable
- [ ] No console errors
- [ ] Documentation reviewed

---

**System Status**: ✅ Ready for Deployment

**Last Updated**: November 10, 2025

**Version**: 1.0.0
