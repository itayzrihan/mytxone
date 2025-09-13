"use client";

import { useState } from "react";

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
  const [currentPage, setCurrentPage] = useState(1);

  // Generate 37 sample meeting cards (30 for page 1, 7 for page 2)
  const generateMeetings = (): MeetingCard[] => {
    const meetingTitles = [
      "Mandarin Blueprint Lite", "Mellovator Fam University", "Tech Innovation Hub", 
      "Creative Writing Circle", "Startup Founders Network", "Digital Marketing Masters",
      "Photography Enthusiasts", "Fitness Community", "Cooking Masterclass", "Book Club Society",
      "Music Production Lab", "Web Development Bootcamp", "Data Science Forum", "AI & ML Collective",
      "Graphic Design Studio", "Travel Adventures Group", "Investment Strategies", "Mindfulness Circle",
      "Gaming Community", "Language Exchange", "Art & Creativity Hub", "Business Networking",
      "Cryptocurrency Traders", "Sustainable Living", "Mental Health Support", "Career Development",
      "Real Estate Investors", "Content Creators", "Freelancer Network", "Remote Work Community",
      "Film Making Society", "Public Speaking Club", "Yoga & Wellness", "Pet Lovers United",
      "Food & Nutrition", "Home Gardening", "Personal Finance"
    ];

    const descriptions = [
      "Join our amazing community and connect with like-minded individuals who share your passion.",
      "A supportive environment for learning, growing, and achieving your goals together.",
      "Exclusive access to expert knowledge, resources, and networking opportunities.",
      "Transform your skills with hands-on workshops and mentorship from industry leaders.",
      "Connect with professionals and enthusiasts in a vibrant, engaging community.",
      "Master new skills with comprehensive courses and real-world application projects."
    ];

    return Array.from({ length: 37 }, (_, i) => ({
      id: (i + 1).toString(),
      thumbnail: "/images/placeholder-thumbnail.jpg",
      userImage: "/images/placeholder-user.jpg",
      title: meetingTitles[i % meetingTitles.length],
      description: descriptions[i % descriptions.length],
      attendees: Math.floor(Math.random() * 5000) + 100,
      price: Math.random() > 0.3 ? `$${Math.floor(Math.random() * 50) + 5}/month` : "Free"
    }));
  };

  const allMeetings = generateMeetings();
  
  // Pagination logic - Fixed calculations
  const totalPages = Math.ceil((allMeetings.length - 30) / 7) + 1; // Always 2 pages for 30 cards (30 + 7 = 37 total)
  
  const getCurrentPageMeetings = () => {
    if (currentPage === 1) {
      return allMeetings.slice(0, 30);
    } else {
      const startIndex = 30 + (currentPage - 2) * 7;
      return allMeetings.slice(startIndex, startIndex + 7);
    }
  };

  const currentMeetings = getCurrentPageMeetings();

  const formatAttendees = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="mt-8 mb-8">
      {/* Meeting Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentMeetings.map((meeting: MeetingCard) => (
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
                  <h3 className="text-white font-semibold text-lg leading-tight group-hover:text-cyan-400 transition-colors duration-300">
                    {meeting.title}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4 h-20 overflow-hidden">
                <p className="text-zinc-300 text-base leading-relaxed">
                  {meeting.description.length > 120 
                    ? `${meeting.description.substring(0, 120)}...` 
                    : meeting.description}
                </p>
              </div>

              {/* Footer: Attendees and Price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-zinc-300 text-sm">
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

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg px-6 py-2 
                     text-white font-medium transition-all duration-300 
                     hover:bg-white/10 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed
                     hover:shadow-lg hover:shadow-white/5"
        >
          Previous
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-sm">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg px-6 py-2 
                     text-white font-medium transition-all duration-300 
                     hover:bg-white/10 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed
                     hover:shadow-lg hover:shadow-white/5"
        >
          Next
        </button>
      </div>
    </div>
  );
}