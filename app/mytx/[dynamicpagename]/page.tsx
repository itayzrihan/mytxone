import { notFound } from "next/navigation";
import { Metadata } from "next";
import { DynamicMeetingLanding } from "@/components/custom/dynamic-meeting-landing";

type GalleryItem = {
  id: string;
  type: 'video' | 'image';
  src: string;
  thumbnail?: string;
  title?: string;
  duration?: string;
};

type MeetingData = {
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
  backgroundVideo: string;
  thumbnailImage: string;
  poweredBy: string;
  gallery?: GalleryItem[];
};

// This could be expanded to fetch real meeting data
async function getMeetingData(dynamicpagename: string): Promise<MeetingData | null> {
  // For now, return mock data. In the future, this would fetch from a database
  // based on the dynamic page name
  const mockMeetings: Record<string, MeetingData> = {
    "mandarin-blueprint-lite": {
      title: "Mandarin Blueprint Lite",
      subtitle: "skool.com/mandarin-blueprint-free",
      description: "A community for anyone with a dream of speaking fluent Mandarin. Join now for free courses, downloads, live events, and an incredible community!",
      memberCount: "22.2k",
      onlineCount: "37",
      adminCount: "26",
      isPrivate: true,
      isFree: true,
      instructor: "Phil Crimmins",
      hasVerifiedBadge: true,
      features: [
        "Read, understand, and speak basic Chinese in 30 Days or less (for real!).",
        "Network with a thriving community of 20,000+ learners.",
        "Build the habit. Get addicted to learning Chinese.",
        "Start your journey to fluency"
      ],
      backgroundVideo: "/videos/mandarin-preview.mp4",
      thumbnailImage: "/images/mandarin-thumbnail.jpg",
      poweredBy: "skool"
    },
    "example": {
      title: "Tech Innovators Hub",
      subtitle: "mytx.ai/tech-innovators-hub",
      description: "A dynamic community for technology enthusiasts, entrepreneurs, and innovators. Connect with like-minded individuals, share ideas, and build the future together!",
      memberCount: "15.8k",
      onlineCount: "142",
      adminCount: "8",
      isPrivate: false,
      isFree: true,
      instructor: "Sarah Chen",
      hasVerifiedBadge: true,
      features: [
        "Connect with top tech professionals and entrepreneurs worldwide.",
        "Access exclusive startup resources and investor connections.",
        "Join weekly innovation workshops and hackathon events.",
        "Get mentorship from industry leaders and successful founders.",
        "Showcase your projects and get valuable feedback from peers."
      ],
      backgroundVideo: "/videos/tech-hub-preview.mp4",
      thumbnailImage: "/images/tech-hub-thumbnail.jpg",
      poweredBy: "MyTX",
      gallery: [
        {
          id: "video-1",
          type: "video" as const,
          src: "/videos/tech-hub-preview.mp4",
          thumbnail: "/images/tech-hub-thumbnail.jpg",
          title: "Community Overview",
          duration: "3:45"
        },
        {
          id: "video-2",
          type: "video" as const,
          src: "/videos/startup-workshop.mp4",
          thumbnail: "/images/startup-workshop-thumb.jpg",
          title: "Startup Workshop",
          duration: "15:32"
        },
        {
          id: "image-1",
          type: "image" as const,
          src: "/images/innovation-lab.jpg",
          title: "Innovation Lab"
        },
        {
          id: "video-3",
          type: "video" as const,
          src: "/videos/hackathon-highlights.mp4",
          thumbnail: "/images/hackathon-thumb.jpg",
          title: "Hackathon Highlights",
          duration: "8:21"
        },
        {
          id: "image-2",
          type: "image" as const,
          src: "/images/networking-event.jpg",
          title: "Networking Event"
        },
        {
          id: "video-4",
          type: "video" as const,
          src: "/videos/mentor-sessions.mp4",
          thumbnail: "/images/mentor-sessions-thumb.jpg",
          title: "Mentor Sessions",
          duration: "12:15"
        },
        {
          id: "image-3",
          type: "image" as const,
          src: "/images/project-showcase.jpg",
          title: "Project Showcase"
        }
      ]
    }
  };

  return mockMeetings[dynamicpagename as keyof typeof mockMeetings] || null;
}

interface PageProps {
  params: {
    dynamicpagename: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { dynamicpagename } = params;
  const meetingData = await getMeetingData(dynamicpagename);

  if (!meetingData) {
    return {
      title: "Meeting Not Found | MyTX",
      description: "The meeting page you're looking for doesn't exist.",
    };
  }

  return {
    title: `${meetingData.title} | MyTX`,
    description: meetingData.description,
    openGraph: {
      title: meetingData.title,
      description: meetingData.description,
      images: meetingData.thumbnailImage ? [meetingData.thumbnailImage] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meetingData.title,
      description: meetingData.description,
      images: meetingData.thumbnailImage ? [meetingData.thumbnailImage] : [],
    },
  };
}

export default async function DynamicMeetingPage({ params }: PageProps) {
  const { dynamicpagename } = params;
  
  // Get meeting data based on the dynamic page name
  const meetingData = await getMeetingData(dynamicpagename);
  
  if (!meetingData) {
    notFound();
  }

  return <DynamicMeetingLanding meetingData={meetingData} pageName={dynamicpagename} />;
}

// Generate static params for known meeting pages (optional)
export async function generateStaticParams() {
  // Return known meeting page names for static generation
  return [
    { dynamicpagename: 'mandarin-blueprint-lite' },
    { dynamicpagename: 'example' },
    // Add more meeting pages as they are created
  ];
}