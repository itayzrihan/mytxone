# Dynamic Meeting Landing Pages

This directory contains the dynamic meeting landing page system for MyTX.

## Structure

```
/mytx/
├── [dynamicpagename]/
│   ├── page.tsx           # Main dynamic page
│   ├── not-found.tsx      # 404 page for invalid meetings
│   └── loading.tsx        # Loading state page
└── create/
    └── page.tsx           # Create meeting page (placeholder)
```

## Features

### Dynamic Meeting Pages (`/mytx/[dynamicpagename]`)

- **Glassmorphism Design**: Consistent with the main application's design language
- **Responsive Layout**: Works on all device sizes
- **SEO Optimized**: Automatic metadata generation for each meeting
- **Video Integration**: Support for background videos and preview content
- **Member Statistics**: Real-time display of member counts and activity
- **Feature Lists**: Customizable benefits and features
- **Call-to-Action**: Prominent join buttons with glassmorphism styling

### Styling

The pages use a glassmorphism design pattern with:
- `bg-white/5 backdrop-blur-md` - Main glass containers
- `border border-white/10` - Subtle borders
- `shadow-2xl shadow-black/20` - Depth and elevation
- Gradient backgrounds and buttons
- Smooth transitions and hover effects

### Example URLs

- `/mytx/example` - Sample tech community (Tech Innovators Hub)
- `/mytx/mandarin-blueprint-lite` - Sample Mandarin learning community
- `/mytx/create` - Meeting creation interface (coming soon)

### Discovery

Meeting discovery happens on the main page (`/`) which serves as the central hub for browsing and finding meetings.

### Data Structure

Each meeting page expects data in this format:

```typescript
interface MeetingData {
  title: string;
  subtitle: string;
  description: string;
  memberCount: string;
  onlineCount: string;
  adminCount: string;
  isPrivate: boolean;
  isFree: boolean;
  instructor: string;
  hasVerifiedBadge: boolean;
  features: string[];
  backgroundVideo?: string;
  thumbnailImage?: string;
  poweredBy: string;
}
```

### Sample Data

Currently includes two example meetings:

1. **Tech Innovators Hub** (`/mytx/example`)
   - Tech community for entrepreneurs and innovators
   - 15.8k members, 142 online, 8 admins
   - Public, free community
   - Instructor: Sarah Chen

2. **Mandarin Blueprint Lite** (`/mytx/mandarin-blueprint-lite`)
   - Language learning community
   - 22.2k members, 37 online, 26 admins
   - Private, free community
   - Instructor: Phil Crimmins

### Future Enhancements

1. **Database Integration**: Replace mock data with real database queries
2. **Admin Dashboard**: Allow meeting creators to customize their pages
3. **Member Management**: Real-time member statistics and management
4. **Video Hosting**: Integrated video hosting and streaming
5. **Analytics**: Page views, member engagement, and conversion tracking
6. **Custom Domains**: Allow custom domains for meeting pages
7. **Themes**: Multiple glassmorphism theme options

### Assets

Required assets should be placed in:
- `/public/videos/` - Background and preview videos
- `/public/images/` - Thumbnails and meeting logos

### Navigation Integration

The dynamic pages are integrated with the main navigation through:
- Sidebar "Create new meeting" button
- Main page meeting cards (serves as discovery)
- Search functionality (future enhancement)

## Technical Notes

- Built with Next.js 14+ App Router
- Uses Tailwind CSS for styling
- TypeScript for type safety
- Responsive design principles
- SEO-friendly with automatic sitemap generation
- Performance optimized with static generation where possible