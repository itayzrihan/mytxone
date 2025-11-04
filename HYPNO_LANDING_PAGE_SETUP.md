# Hypnosis E-Book Landing Page - Setup Guide

## Overview
A beautiful, mysterious landing page for your e-book "להפנט את היקום" (Hypnotize the Universe) with lead capture functionality.

## Files Created

### 1. **Database Schema** (`/db/schema.ts`)
Added the `hypnosisLead` table with the following fields:
- `id`: UUID primary key
- `fullName`: Visitor's full name
- `email`: Email address
- `phoneNumber`: Phone number
- `allowMarketing`: Boolean for marketing consent
- `allowHypnosisKnowledge`: Boolean for hypnosis knowledge consent
- `ebookSent`: Tracks if e-book was sent
- `ebookSentAt`: Timestamp when e-book was sent
- `source`: Marketing source tracking (defaults to "hypno-landing")
- `notes`: Additional notes field
- `createdAt` & `updatedAt`: Timestamps

### 2. **API Endpoint** (`/app/api/hypnosis/leads/route.ts`)
POST endpoint that:
- Validates form data (required fields, email format, phone format)
- Saves leads to the database
- Returns success/error responses
- Includes error handling and logging

### 3. **Landing Page** (`/app/hypno/page.tsx`)
Features:
- 🎨 **Mystical Dark Theme**: Purple, indigo, and pink gradients with glass-morphism effects
- ✨ **Animated Background**: Floating orbs and cursor-tracking glow effects
- 📱 **Responsive Design**: Works beautifully on mobile and desktop
- 📝 **Lead Capture Form**: Collects name, email, phone with consent checkboxes
- 🎯 **Real-time Validation**: Email and phone validation
- 🔐 **Privacy-Focused**: Hebrew + English text integration
- 💫 **Smooth Animations**: Framer Motion for elegant transitions

## Setup Instructions

### Step 1: Run Database Migration
```bash
npm run migrate
# or
pnpm migrate
```

This will create the `HypnosisLead` table in your PostgreSQL database.

### Step 2: Verify API Route
The API endpoint is now available at:
```
POST /api/hypnosis/leads
```

### Step 3: Test the Landing Page
Visit:
```
http://localhost:3000/hypno
```

## API Request Example

```json
{
  "fullName": "אברהם כהן",
  "email": "abraham@example.com",
  "phoneNumber": "+972501234567",
  "allowMarketing": true,
  "allowHypnosisKnowledge": true
}
```

## API Response

**Success (201):**
```json
{
  "success": true,
  "message": "Lead successfully saved! Check your email for the free e-book.",
  "leadId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error (400/500):**
```json
{
  "error": "Error message describing what went wrong"
}
```

## Database Queries

Query all leads:
```sql
SELECT * FROM "HypnosisLead" ORDER BY "createdAt" DESC;
```

Query marketing-consented leads:
```sql
SELECT * FROM "HypnosisLead" WHERE allow_marketing = true;
```

Query for follow-up (e-book not yet sent):
```sql
SELECT * FROM "HypnosisLead" WHERE ebook_sent = false;
```

## Features Implemented

✅ **Beautiful UI** - Dark, mysterious theme with mystical animations  
✅ **Form Validation** - Real-time email and phone validation  
✅ **Database Storage** - Secure lead capture in PostgreSQL  
✅ **API Integration** - RESTful endpoint for form submissions  
✅ **Responsive Design** - Mobile-first approach  
✅ **Hebrew Support** - Bilingual content (Hebrew & English)  
✅ **Error Handling** - Comprehensive error messages  
✅ **Consent Tracking** - Marketing and knowledge consent fields  
✅ **Animation Effects** - Framer Motion for smooth interactions  
✅ **Marketing Tracking** - Source field for analytics  

## Next Steps (Optional)

1. **Email Integration**: Set up automated e-book delivery via email service
2. **Analytics**: Track conversion rates and lead sources
3. **CRM Integration**: Connect to your CRM system
4. **Confirmation Emails**: Send confirmation emails to leads
5. **Follow-up Sequences**: Create automated follow-up email campaigns
6. **Lead Scoring**: Track which leads engage with the content

## Styling

The page uses:
- **Tailwind CSS**: For responsive, utility-first styling
- **Framer Motion**: For smooth animations and transitions
- **Glass-morphism**: For modern, frosted glass effects
- **Gradient Backgrounds**: For mystical purple/pink/indigo theme

## Dark Mode

The landing page is optimized for dark mode with:
- High contrast text (white on dark backgrounds)
- Subtle glowing effects
- Translucent elements with backdrop blur
- Gradient overlays for depth

## Mobile Optimization

- Responsive grid layout
- Touch-friendly form inputs
- Optimized animations for performance
- Mobile-first design approach

---

**Author**: Itay Zrihan  
**Book Title**: להפנט את היקום (Hypnotize the Universe)  
**Landing Page**: `/hypno`
