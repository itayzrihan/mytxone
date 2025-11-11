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
import { Users, MapPin } from "lucide-react";
import { getCategoryLabel } from "@/lib/categories";
import { useCategoryFilter } from "@/contexts/category-filter-context";

interface CommunityCard {
  id: string;
  thumbnail: string;
  userImage: string;
  title: string;
  description: string;
  members: number;
  price: string;
  typeOfPage: 'Community';
}

interface RealCommunity {
  id: string;
  title: string;
  description: string | null;
  communityType: string;
  category: string;
  imageUrl: string | null;
  memberCount: number;
  isPublic: boolean;
  requiresApproval: boolean;
  status: string;
}

interface CommunityCardsProps {
  filter?: string; // 'owned', 'joined', or 'public' (default)
}

export function CommunityCards({ filter = "public" }: CommunityCardsProps) {
  const { shouldShowAdminElements, viewMode } = useAdmin();
  const { data: session } = useSession();
  const { selectedCategories } = useCategoryFilter();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [allCommunities, setAllCommunities] = useState<CommunityCard[]>([]);
  const [realCommunities, setRealCommunities] = useState<RealCommunity[]>([]);
  const [isLoadingReal, setIsLoadingReal] = useState(true);
  const [selectedCommunity, setSelectedCommunity] = useState<RealCommunity | null>(null);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [guestData, setGuestData] = useState({ name: "", email: "" });
  const [joinedCommunityIds, setJoinedCommunityIds] = useState<Set<string>>(new Set());

  // Initialize communities on mount
  useEffect(() => {
    setAllCommunities(generateCommunities());
  }, []);

  // Fetch user's joined communities
  useEffect(() => {
    if (session?.user?.email) {
      fetchUserJoinedCommunities();
    }
  }, [session?.user?.email]);

  const fetchUserJoinedCommunities = async () => {
    try {
      const response = await fetch("/api/communities?filter=joined");
      if (response.ok) {
        const data = await response.json() as RealCommunity[];
        const joinedIds = new Set<string>(data.map((c: RealCommunity) => c.id));
        setJoinedCommunityIds(joinedIds);
      }
    } catch (error) {
      console.error("Error fetching joined communities:", error);
    }
  };

  // Fetch real communities from API
  useEffect(() => {
    fetchRealCommunities(selectedCategories);
  }, [selectedCategories, filter]);

  const fetchRealCommunities = async (categories: string[] = []) => {
    try {
      let url = `/api/communities?filter=${filter}`;
      if (filter === "public" && categories.length > 0 && categories[0] !== "all") {
        url += `&categories=${categories.join(",")}`;
      }
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setRealCommunities(data);
      }
    } catch (error) {
      console.error("Error fetching communities:", error);
    } finally {
      setIsLoadingReal(false);
    }
  };

  const handleJoin = async (community: RealCommunity) => {
    if (!session) {
      setSelectedCommunity(community);
      setIsJoinDialogOpen(true);
      return;
    }

    // Direct join for authenticated users
    try {
      const response = await fetch(`/api/communities/${community.id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to join");
      }

      toast.success(`Successfully joined ${community.title}`);
      setJoinedCommunityIds(prev => new Set(prev).add(community.id));
      fetchRealCommunities(selectedCategories);
    } catch (error: any) {
      toast.error(error.message || "Failed to join community");
    }
  };

  const handleLeave = async (community: RealCommunity) => {
    try {
      const response = await fetch(`/api/communities/${community.id}/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to leave");
      }

      toast.success(`Left ${community.title}`);
      setJoinedCommunityIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(community.id);
        return newSet;
      });
      fetchRealCommunities(selectedCategories);
    } catch (error: any) {
      toast.error(error.message || "Failed to leave community");
    }
  };

  const handleDelete = async (community: RealCommunity) => {
    if (!confirm(`Are you sure you want to delete "${community.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/communities/${community.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete");
      }

      toast.success(`Community "${community.title}" deleted successfully`);
      fetchRealCommunities(selectedCategories);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete community");
    }
  };

  const handleGuestJoin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCommunity) return;

    if (!guestData.name.trim() || !guestData.email.trim()) {
      toast.error("Please provide both name and email");
      return;
    }

    try {
      const response = await fetch(`/api/communities/${selectedCommunity.id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: guestData.name,
          guestEmail: guestData.email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to join");
      }

      toast.success(`Successfully joined ${selectedCommunity.title}`);
      setIsJoinDialogOpen(false);
      setGuestData({ name: "", email: "" });
      fetchRealCommunities(selectedCategories);
    } catch (error: any) {
      toast.error(error.message || "Failed to join community");
    }
  };

  // Seeded random function for consistent mock data
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Generate 37 sample community cards (30 for page 1, 7 for page 2)
  const generateCommunities = (): CommunityCard[] => {
    const communityTitles = [
      "Mandarin Blueprint Lite", "Mellovator Fam University", "Tech Innovation Hub", 
      "Creative Writing Circle", "Startup Founders Network", "Digital Marketing Masters",
      "Photography Enthusiasts", "Fitness Community", "Cooking Masterclass", "Book Club Society",
      "Music Production Lab", "Web Development Bootcamp", "Data Science Forum", "AI & ML Collective",
      "Graphic Design Studio", "Travel Adventures Group", "Investment Strategies", "Mindfulness Circle",
      "Gaming Community", "Language Exchange", "Art & Creativity Hub", "Business Networking",
      "Cryptocurrency Traders", "Sustainable Living", "Mental Health Support", "Career Development",
      "Real Estate Investors", "Content Creators", "Freelancer Network", "Remote Work Community",
      "Wellness & Yoga", "Film & Cinema Club", "Sports Fanatics", "Pet Lovers Unite",
      "Home Gardening", "Science & Discovery", "Fashion Forward"
    ];

    const descriptions = [
      "Connect with like-minded individuals and grow together in our vibrant community",
      "Join passionate members sharing knowledge and experiences",
      "A space for collaboration, learning, and building meaningful connections",
      "Engage in discussions, events, and exclusive content",
      "Be part of something bigger - community that cares and supports",
      "Discover, learn, and thrive with fellow enthusiasts",
    ];

    return Array.from({ length: 37 }, (_, i) => ({
      id: `community-${i + 1}`,
      thumbnail: `/images/placeholder-${(i % 5) + 1}.jpg`,
      userImage: "/images/placeholder-user.jpg",
      title: communityTitles[i % communityTitles.length],
      description: descriptions[i % descriptions.length],
      members: Math.floor(seededRandom(i * 123) * 5000) + 100,
      price: seededRandom(i * 456) > 0.3 ? `$${Math.floor(seededRandom(i * 789) * 50) + 5}/month` : "Free",
      typeOfPage: 'Community'
    }));
  };
  
  // Only show mock cards if admin, otherwise show empty state
  const shouldShowMockCards = shouldShowAdminElements && viewMode === "admin";
  
  // Pagination logic - Fixed calculations
  const totalPages = allCommunities.length > 0 ? Math.ceil((allCommunities.length - 30) / 7) + 1 : 1; // Always 2 pages for 30 cards (30 + 7 = 37 total)
  
  const getCurrentPageCommunities = () => {
    if (allCommunities.length === 0) return [];
    if (!shouldShowMockCards) return []; // Don't show mock cards for non-admins
    if (currentPage === 1) {
      return allCommunities.slice(0, 30);
    } else {
      const startIndex = 30 + (currentPage - 2) * 7;
      return allCommunities.slice(startIndex, startIndex + 7);
    }
  };

  const currentCommunities = getCurrentPageCommunities();

  // Show loading state during hydration
  if (allCommunities.length === 0 && isLoadingReal) {
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

  // Combine real communities with mock cards for admins
  const displayCommunities = shouldShowMockCards 
    ? [...realCommunities, ...allCommunities]
    : realCommunities;

  // If there are real communities OR admin is viewing mock data
  if (displayCommunities.length > 0) {
    return (
      <div className="mt-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCommunities.map((item: any) => {
            // Check if this is a real community or a mock card
            const isRealCommunity = item.userId !== undefined;
            
            if (isRealCommunity) {
              // Render real community card
              const community = item as RealCommunity;
              return (
                <div
                  key={community.id}
                  className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group shadow-lg shadow-black/20"
                  onClick={() => router.push(`/communities/${community.id}`)}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gradient-to-br from-purple-400/20 to-pink-600/20 flex items-center justify-center">
                    {community.imageUrl ? (
                      <Image src={community.imageUrl} alt={community.title} fill className="object-cover" />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                        <div className="relative z-10 text-white/50 text-5xl group-hover:text-white/70 transition-colors duration-300">
                          👥
                        </div>
                      </>
                    )}
                    {/* Community Type Badge */}
                    <div className="absolute top-3 right-3 bg-purple-500/30 backdrop-blur-sm text-purple-300 border border-purple-400/20 rounded-lg px-2 py-1 text-xs font-medium capitalize">
                      {community.communityType}
                    </div>
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 bg-cyan-500/30 backdrop-blur-sm text-cyan-300 border border-cyan-400/20 rounded-lg px-2 py-1 text-xs font-medium">
                      {getCategoryLabel(community.category)}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-3">
                    {/* Title */}
                    <h3 className="text-white font-semibold text-lg leading-tight group-hover:text-cyan-400 transition-colors duration-300">
                      {community.title}
                    </h3>

                    {/* Description */}
                    {community.description && (
                      <p className="text-zinc-300 text-sm leading-relaxed line-clamp-2">
                        {community.description}
                      </p>
                    )}

                    {/* Community Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-zinc-300">
                        <Users className="w-4 h-4 text-cyan-400" />
                        <span>{community.memberCount} members</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3">
                      {filter === "owned" ? (
                        <div className="flex gap-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/communities/${community.id}/edit`);
                            }}
                            className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(community);
                            }}
                            className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-400/30"
                          >
                            Delete
                          </Button>
                        </div>
                      ) : joinedCommunityIds.has(community.id) ? (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLeave(community);
                          }}
                          className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-400/30"
                        >
                          Leave Community
                        </Button>
                      ) : (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoin(community);
                          }}
                          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                        >
                          Join Community
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            } else {
              // Render mock community card
              const mockCard = item as CommunityCard;
              return (
                <div
                  key={mockCard.id}
                  className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group shadow-lg shadow-black/20"
                  onClick={() => {
                    toast.info("This is a demo community. Real communities coming soon!");
                  }}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gradient-to-br from-purple-400/20 to-pink-600/20 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
                    <div className="relative z-10 text-white/40 text-6xl group-hover:text-white/60 transition-colors duration-300">
                      👥
                    </div>
                    {/* Demo Badge */}
                    <div className="absolute top-3 right-3 bg-purple-500/30 backdrop-blur-sm text-purple-300 border border-purple-400/20 rounded-lg px-2 py-1 text-xs font-medium">
                      Community
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    {/* User Image and Title */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400/30 to-pink-600/30 flex items-center justify-center flex-shrink-0">
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

                    {/* Footer: Members and Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-zinc-300 text-sm">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        <span>{mockCard.members.toLocaleString()} members</span>
                      </div>
                      <div className="text-cyan-400 font-semibold text-sm">
                        {mockCard.price}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>

        {/* Guest Join Dialog */}
        <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
          <DialogContent className="bg-black/90 backdrop-blur-md border-white/20">
            <DialogHeader>
              <DialogTitle className="text-white">Join {selectedCommunity?.title}</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Enter your details to join this community. You can create an account later to manage your memberships.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleGuestJoin}>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name" className="text-white">Name</Label>
                  <Input
                    id="name"
                    value={guestData.name}
                    onChange={(e) => setGuestData({ ...guestData, name: e.target.value })}
                    placeholder="Your name"
                    className="bg-white/5 border-white/20 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={guestData.email}
                    onChange={(e) => setGuestData({ ...guestData, email: e.target.value })}
                    placeholder="your.email@example.com"
                    className="bg-white/5 border-white/20 text-white"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600">
                  Join Community
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Show empty state for non-admins and when no real communities exist
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">🌐</div>
      <h3 className="text-xl font-semibold text-white mb-2">No communities available yet</h3>
      <p className="text-zinc-400">Check back soon for communities to join.</p>
    </div>
  );
}
