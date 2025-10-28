"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/contexts/admin-context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CalendarIcon, Clock, Users, MapPin } from "lucide-react";
import { convertFromUTC, getUserDeviceTimezone } from "@/lib/timezones";
import { getCategoryLabel } from "@/lib/categories";
import { useCategoryFilter } from "@/contexts/category-filter-context";

interface MeetingCard {
  id: string;
  thumbnail: string;
  userImage: string;
  title: string;
  description: string;
  attendees: number;
  price: string;
  typeOfPage: 'Meeting' | 'Community';
}

interface RealMeeting {
  id: string;
  title: string;
  description: string | null;
  meetingType: string;
  category: string;
  imageUrl: string | null;
  startTime: string;
  endTime: string;
  meetingUrl: string | null;
  maxAttendees: number | null;
  attendeeCount: number;
  status: string;
  registrationStatus?: string | null;
}

interface MeetingCardsProps {}

export function MeetingCards() {
  const { shouldShowAdminElements, viewMode } = useAdmin();
  const { data: session } = useSession();
  const { selectedCategories } = useCategoryFilter();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [allMeetings, setAllMeetings] = useState<MeetingCard[]>([]);
  const [realMeetings, setRealMeetings] = useState<RealMeeting[]>([]);
  const [isLoadingReal, setIsLoadingReal] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState<RealMeeting | null>(null);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [guestData, setGuestData] = useState({ name: "", email: "" });
  const [userTimezone, setUserTimezone] = useState<string>("");
  const [registeredMeetingIds, setRegisteredMeetingIds] = useState<Set<string>>(new Set());

  // Initialize user timezone on mount
  useEffect(() => {
    setUserTimezone(getUserDeviceTimezone());
  }, []);

  // Fetch user's registered meetings
  useEffect(() => {
    if (session?.user?.email) {
      fetchUserRegisteredMeetings();
    }
  }, [session?.user?.email]);

  const fetchUserRegisteredMeetings = async () => {
    try {
      const response = await fetch("/api/meetings?filter=attending");
      if (response.ok) {
        const data = await response.json();
        const registeredIds = new Set(data.map((m: RealMeeting) => m.id));
        setRegisteredMeetingIds(registeredIds);
      }
    } catch (error) {
      console.error("Error fetching registered meetings:", error);
    }
  };

  // Fetch real meetings from API
  useEffect(() => {
    fetchRealMeetings(selectedCategories);
  }, [selectedCategories]);

  const fetchRealMeetings = async (categories: string[] = []) => {
    try {
      let url = "/api/meetings?filter=public";
      if (categories.length > 0 && categories[0] !== "all") {
        url += `&categories=${categories.join(",")}`;
      }
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setRealMeetings(data);
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
    } finally {
      setIsLoadingReal(false);
    }
  };

  const handleRegister = async (meeting: RealMeeting) => {
    if (!session) {
      setSelectedMeeting(meeting);
      setIsRegisterDialogOpen(true);
      return;
    }

    // Direct registration for authenticated users
    try {
      const response = await fetch(`/api/meetings/${meeting.id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to register");
      }

      toast.success(result.message || "Successfully registered!");
      // Add to registered meetings set
      setRegisteredMeetingIds(prev => new Set([...prev, meeting.id]));
      fetchRealMeetings(selectedCategories);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleGuestRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMeeting) return;

    try {
      const response = await fetch(`/api/meetings/${selectedMeeting.id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: guestData.name,
          guestEmail: guestData.email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to register");
      }

      toast.success(result.message || "Successfully registered!");
      setIsRegisterDialogOpen(false);
      setGuestData({ name: "", email: "" });
      // Add to registered meetings set
      setRegisteredMeetingIds(prev => new Set([...prev, selectedMeeting.id]));
      fetchRealMeetings(selectedCategories);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleUnregister = async (meeting: RealMeeting) => {
    if (!confirm("Are you sure you want to unregister from this meeting?")) {
      return;
    }

    try {
      const response = await fetch(`/api/meetings/${meeting.id}/register`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to unregister");
      }

      toast.success("Successfully unregistered from meeting");
      // Remove from registered meetings set
      setRegisteredMeetingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(meeting.id);
        return newSet;
      });
      fetchRealMeetings(selectedCategories);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const formatDate = (dateString: string) => {
    // Convert from UTC to user's timezone, then format
    const localDateTime = convertFromUTC(dateString, userTimezone);
    const [date] = localDateTime.split("T");
    const [year, month, day] = date.split("-");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    // Convert from UTC to user's timezone, then format
    const localDateTime = convertFromUTC(dateString, userTimezone);
    const [, time] = localDateTime.split("T");
    const [hour, minute] = time.split(":");
    return `${hour}:${minute}`;
  };

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

    // Use seeded random generation for consistency
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    return Array.from({ length: 37 }, (_, i) => ({
      id: (i + 1).toString(),
      thumbnail: "/images/placeholder-thumbnail.jpg",
      userImage: "/images/placeholder-user.jpg",
      title: meetingTitles[i % meetingTitles.length],
      description: descriptions[i % descriptions.length],
      attendees: Math.floor(seededRandom(i * 123) * 5000) + 100,
      price: seededRandom(i * 456) > 0.3 ? `$${Math.floor(seededRandom(i * 789) * 50) + 5}/month` : "Free",
      typeOfPage: seededRandom(i * 999) > 0.5 ? 'Meeting' : 'Community'
    }));
  };

  // Generate meetings on client side to avoid hydration mismatch
  useEffect(() => {
    setAllMeetings(generateMeetings());
  }, []);
  
  // Only show mock cards if admin, otherwise show empty state
  const shouldShowMockCards = shouldShowAdminElements && viewMode === "admin";
  
  // Pagination logic - Fixed calculations
  const totalPages = allMeetings.length > 0 ? Math.ceil((allMeetings.length - 30) / 7) + 1 : 1; // Always 2 pages for 30 cards (30 + 7 = 37 total)
  
  const getCurrentPageMeetings = () => {
    if (allMeetings.length === 0) return [];
    if (!shouldShowMockCards) return []; // Don't show mock cards for non-admins
    if (currentPage === 1) {
      return allMeetings.slice(0, 30);
    } else {
      const startIndex = 30 + (currentPage - 2) * 7;
      return allMeetings.slice(startIndex, startIndex + 7);
    }
  };

  const currentMeetings = getCurrentPageMeetings();

  // Show loading state during hydration
  if (allMeetings.length === 0 && isLoadingReal) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-6">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  // Combine real meetings with mock cards for admins
  const displayMeetings = shouldShowMockCards 
    ? [...realMeetings, ...allMeetings]
    : realMeetings;

  // If there are real meetings OR admin is viewing mock data
  if (displayMeetings.length > 0) {
    return (
      <div className="mt-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayMeetings.map((item: any) => {
            // Check if this is a real meeting or a mock card
            const isRealMeeting = item.userId !== undefined;
            
            if (isRealMeeting) {
              // Render real meeting card
              const meeting = item as RealMeeting;
              return (
                <div
                  key={meeting.id}
                  className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group shadow-lg shadow-black/20"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gradient-to-br from-cyan-400/20 to-blue-600/20 flex items-center justify-center">
                    {meeting.imageUrl ? (
                      <Image src={meeting.imageUrl} alt={meeting.title} fill className="object-cover" />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                        <div className="relative z-10 text-white/50 text-5xl group-hover:text-white/70 transition-colors duration-300">
                          📅
                        </div>
                      </>
                    )}
                    {/* Meeting Type Badge */}
                    <div className="absolute top-3 right-3 bg-cyan-500/30 backdrop-blur-sm text-cyan-300 border border-cyan-400/20 rounded-lg px-2 py-1 text-xs font-medium capitalize">
                      {meeting.meetingType}
                    </div>
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 bg-purple-500/30 backdrop-blur-sm text-purple-300 border border-purple-400/20 rounded-lg px-2 py-1 text-xs font-medium">
                      {getCategoryLabel(meeting.category)}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-3">
                    {/* Title */}
                    <h3 className="text-white font-semibold text-lg leading-tight group-hover:text-cyan-400 transition-colors duration-300">
                      {meeting.title}
                    </h3>

                    {/* Description */}
                    {meeting.description && (
                      <p className="text-zinc-300 text-sm leading-relaxed line-clamp-2">
                        {meeting.description}
                      </p>
                    )}

                    {/* Meeting Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-zinc-300">
                        <CalendarIcon className="w-4 h-4 text-cyan-400" />
                        <span>{formatDate(meeting.startTime)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-300">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        <span>{formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-300">
                        <Users className="w-4 h-4 text-cyan-400" />
                        <span>
                          {meeting.attendeeCount} {meeting.attendeeCount === 1 ? 'attendee' : 'attendees'}
                          {meeting.maxAttendees && ` / ${meeting.maxAttendees} max`}
                        </span>
                      </div>
                    </div>

                    {/* Register/Registered Status */}
                    {registeredMeetingIds.has(meeting.id) ? (
                      <div className="flex gap-2">
                        <div className="flex-1 bg-green-500/20 border border-green-500/50 text-green-300 rounded-lg py-2 px-3 text-sm font-medium flex items-center justify-center">
                          ✓ You are registered
                        </div>
                        <Button
                          onClick={() => handleUnregister(meeting)}
                          size="sm"
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50"
                          variant="outline"
                        >
                          Unregister
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleRegister(meeting)}
                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                        disabled={meeting.maxAttendees !== null && meeting.attendeeCount >= meeting.maxAttendees}
                      >
                        {meeting.maxAttendees !== null && meeting.attendeeCount >= meeting.maxAttendees
                          ? "Full"
                          : "Register"}
                      </Button>
                    )}
                  </div>
                </div>
              );
            } else {
              // Render mock card for admin
              const mockCard = item as MeetingCard;
              const formatAttendees = (count: number): string => {
                if (count >= 1000) {
                  return `${(count / 1000).toFixed(1)}k`;
                }
                return count.toString();
              };

              return (
                <div
                  key={`mock-${mockCard.id}`}
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
                      #{mockCard.id.padStart(2, '0')}
                    </div>
                    {/* Type of page badge */}
                    <div className={`absolute top-3 right-3 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-medium ${
                      mockCard.typeOfPage === 'Meeting' 
                        ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/20' 
                        : 'bg-purple-500/30 text-purple-300 border border-purple-400/20'
                    }`}>
                      {mockCard.typeOfPage}
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
                          {mockCard.title}
                        </h3>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-4 h-20 overflow-hidden">
                      <p className="text-zinc-300 text-base leading-relaxed">
                        {mockCard.description.length > 120 
                          ? `${mockCard.description.substring(0, 120)}...` 
                          : mockCard.description}
                      </p>
                    </div>

                    {/* Footer: Attendees and Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-zinc-300 text-sm">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{formatAttendees(mockCard.attendees)} Members</span>
                      </div>
                      <div className="text-cyan-400 font-semibold text-base">
                        {mockCard.price}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>

        {/* Guest Registration Dialog */}
        <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
          <DialogContent className="bg-black/90 border-white/20 text-white">
            <DialogHeader>
              <DialogTitle>Register for Meeting</DialogTitle>
              <DialogDescription className="text-zinc-400">
                {selectedMeeting?.title}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleGuestRegister}>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="guestName">Name *</Label>
                  <Input
                    id="guestName"
                    value={guestData.name}
                    onChange={(e) => setGuestData({ ...guestData, name: e.target.value })}
                    required
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="guestEmail">Email *</Label>
                  <Input
                    id="guestEmail"
                    type="email"
                    value={guestData.email}
                    onChange={(e) => setGuestData({ ...guestData, email: e.target.value })}
                    required
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsRegisterDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600">
                  Register
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Show empty state for non-admins and when no real meetings exist
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">🎯</div>
      <h3 className="text-xl font-semibold text-white mb-2">No meetings available yet</h3>
      <p className="text-zinc-400">Check back soon for actual meetings and communities to join.</p>
    </div>
  );
}