"use client";

interface MeetingCard {
  id: string;
  thumbnail: string;
  userImage: string;
  title: string;
  description: string;
  attendees: number;
  price: string;
}

interface MeetingCardsProps {}

export function MeetingCards() {
  // Sample meeting data
  const meetings: MeetingCard[] = [
    {
      id: "1",
      thumbnail: "/images/placeholder-thumbnail.jpg",
      userImage: "/images/placeholder-user.jpg",
      title: "Mandarin Blueprint Lite",
      description: "A community for anyone with a dream of speaking fluent Mandarin. Join now for free courses, downloads, live events, and more resources to accelerate your language learning journey.",
      attendees: 22200,
      price: "Free"
    },
    {
      id: "2",
      thumbnail: "/images/placeholder-thumbnail.jpg",
      userImage: "/images/placeholder-user.jpg",
      title: "Mellovator Fam University",
      description: "Upgrade your circle with Mellovator Fam University! Real support. Real encouragement. Real transformation. The community that helps you level up every aspect of your life.",
      attendees: 204,
      price: "$9/month"
    },
    {
      id: "3",
      thumbnail: "/images/placeholder-thumbnail.jpg",
      userImage: "/images/placeholder-user.jpg",
      title: "Tech Innovation Hub",
      description: "Join fellow tech enthusiasts and innovators in our weekly meetups. Share ideas, collaborate on projects, and build the future together with like-minded professionals.",
      attendees: 1500,
      price: "$15/month"
    },
    {
      id: "4",
      thumbnail: "/images/placeholder-thumbnail.jpg",
      userImage: "/images/placeholder-user.jpg",
      title: "Creative Writing Circle",
      description: "A supportive community for aspiring and established writers. Share your work, get feedback, participate in writing challenges, and improve your craft together.",
      attendees: 856,
      price: "$12/month"
    },
    {
      id: "5",
      thumbnail: "/images/placeholder-thumbnail.jpg",
      userImage: "/images/placeholder-user.jpg",
      title: "Startup Founders Network",
      description: "Connect with fellow entrepreneurs, share experiences, and get advice from successful founders. Monthly networking events and mentorship opportunities included.",
      attendees: 2400,
      price: "$25/month"
    },
    {
      id: "6",
      thumbnail: "/images/placeholder-thumbnail.jpg",
      userImage: "/images/placeholder-user.jpg",
      title: "Digital Marketing Masters",
      description: "Master the art of digital marketing with expert-led workshops, case studies, and hands-on projects. From SEO to social media, we cover it all.",
      attendees: 3200,
      price: "$20/month"
    }
  ];

  const formatAttendees = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className="mt-8 mb-8">
      {/* Meeting Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group shadow-lg shadow-black/20"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gradient-to-br from-cyan-400/20 to-blue-600/20 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
              <div className="relative z-10 text-white/50 text-5xl group-hover:text-white/70 transition-colors duration-300">
                📸
              </div>
              {/* Card number badge */}
              <div className="absolute top-3 left-3 bg-black/30 backdrop-blur-sm rounded-lg px-2 py-1 text-white/70 text-xs font-medium">
                #{meeting.id.padStart(2, '0')}
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4">
              {/* User Image and Title */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-600/30 flex items-center justify-center flex-shrink-0">
                  <div className="text-white/70 text-xl">👤</div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-base leading-tight group-hover:text-cyan-400 transition-colors duration-300">
                    {meeting.title}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4 h-20 overflow-hidden">
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {meeting.description.length > 120 
                    ? `${meeting.description.substring(0, 120)}...` 
                    : meeting.description}
                </p>
              </div>

              {/* Footer: Attendees and Price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-zinc-500 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{formatAttendees(meeting.attendees)} Members</span>
                </div>
                <div className="text-cyan-400 font-semibold text-base">
                  {meeting.price}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}