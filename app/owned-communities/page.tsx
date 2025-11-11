"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PlusIcon, Trash2Icon, Edit2Icon, UsersIcon, FolderIcon } from "lucide-react";
import { CreateCommunityDialog } from "@/components/custom/create-community-dialog";
import { CommunityLimitModal } from "@/components/custom/community-limit-modal";
import { useUserPlan } from "@/components/custom/user-plan-context";
import { getLimitForPlan, isFreePlan } from "@/lib/plan-utils";

interface Community {
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
  tags: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export default function OwnedCommunitiesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { userPlan, communityCount, isLoading: isPlanLoading, refreshPlan } = useUserPlan();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    communityType: "learning",
    category: "business",
    isPublic: true,
    requiresApproval: false,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchCommunities();
    }
  }, [status, router]);

  const fetchCommunities = async () => {
    try {
      const response = await fetch("/api/communities?filter=owned");
      if (!response.ok) throw new Error("Failed to fetch communities");
      const data = await response.json();
      setCommunities(data);
      // Refresh plan to update community count
      await refreshPlan();
    } catch (error) {
      console.error("Error fetching communities:", error);
      toast.error("Failed to load communities");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCommunity) return;

    try {
      const response = await fetch(`/api/communities/${selectedCommunity.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update community");

      toast.success("Community updated successfully!");
      setIsEditDialogOpen(false);
      setSelectedCommunity(null);
      resetForm();
      fetchCommunities();
    } catch (error) {
      toast.error("Failed to update community");
    }
  };

  const handleDeleteCommunity = async (communityId: string) => {
    if (!confirm("Are you sure you want to delete this community?")) return;

    try {
      const response = await fetch(`/api/communities/${communityId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete community");

      toast.success("Community deleted successfully!");
      fetchCommunities();
    } catch (error) {
      toast.error("Failed to delete community");
    }
  };

  const openEditDialog = (community: Community) => {
    setSelectedCommunity(community);
    setFormData({
      title: community.title,
      description: community.description || "",
      communityType: community.communityType,
      category: community.category,
      isPublic: community.isPublic,
      requiresApproval: community.requiresApproval,
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      communityType: "learning",
      category: "business",
      isPublic: true,
      requiresApproval: false,
    });
  };

  const handleCreateClick = () => {
    // Define community limits
    const communityLimits = {
      free: 1,
      basic: 3,
      pro: Infinity,
    };

    const limit = getLimitForPlan(userPlan);

    // If user is on free plan, redirect to create-community page
    if (isFreePlan(userPlan)) {
      // Check if free user has reached their limit
      if (communityCount >= limit) {
        setIsLimitModalOpen(true);
        return;
      }
      router.push("/mytx/create-community");
    } else {
      // For basic and pro users, check limit before opening modal
      if (userPlan === "basic" && communityCount >= limit) {
        setIsLimitModalOpen(true);
        return;
      }
      // Pro users or users under limit can create
      setIsCreateDialogOpen(true);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (status === "loading" || isLoading || isPlanLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="h-20"></div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Communities</h1>
          <p className="text-zinc-400">Manage your created communities</p>
        </div>
        <Button 
          className="bg-cyan-500 hover:bg-cyan-600 text-white"
          onClick={handleCreateClick}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Community
        </Button>
      </div>

      {/* Create Community Dialog - Only for Basic/Pro users */}
      {userPlan !== "free" && (
        <CreateCommunityDialog 
          open={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen}
          onSuccess={fetchCommunities}
          userPlan={userPlan || "free"}
        />
      )}

      {/* Community Limit Modal */}
      <CommunityLimitModal
        open={isLimitModalOpen}
        onOpenChange={setIsLimitModalOpen}
        currentCount={communityCount}
        limit={getLimitForPlan(userPlan)}
        plan={userPlan || "free"}
        onRemoveCommunity={() => {
          // Close the modal and let user delete from the list
          setIsLimitModalOpen(false);
        }}
      />

      {communities.length === 0 ? (
        <Card className="bg-white/5 border-white/10 text-center py-12">
          <CardContent>
            <FolderIcon className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No communities yet</h3>
            <p className="text-zinc-400 mb-4">Create your first community to get started</p>
            <Button
              onClick={handleCreateClick}
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Community
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {communities.map((community) => (
            <Card key={community.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg mb-1">{community.title}</CardTitle>
                    <CardDescription className="text-cyan-400 text-sm capitalize">
                      {community.communityType} • {community.category}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditDialog(community)}
                      className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
                    >
                      <Edit2Icon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteCommunity(community.id)}
                      className="h-8 w-8 p-0 text-zinc-400 hover:text-red-400"
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {community.description && (
                  <p className="text-sm text-zinc-400 line-clamp-2">{community.description}</p>
                )}
                <div className="flex items-center text-sm text-zinc-300">
                  <UsersIcon className="mr-2 h-4 w-4 text-cyan-400" />
                  {community.memberCount} {community.memberCount === 1 ? 'member' : 'members'}
                </div>
                <div className="flex items-center text-sm text-zinc-300">
                  Created {formatDate(community.createdAt)}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {community.isPublic && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Public</span>
                  )}
                  {community.requiresApproval && (
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">Requires Approval</span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded ${
                    community.status === 'active' ? 'bg-blue-500/20 text-blue-400' :
                    community.status === 'inactive' ? 'bg-gray-500/20 text-gray-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {community.status}
                  </span>
                </div>
                {community.tags && community.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {community.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                    {community.tags.length > 3 && (
                      <span className="text-xs text-zinc-500">+{community.tags.length - 3} more</span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-black/90 border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Community</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Update your community details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateCommunity}>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="edit-communityType">Community Type *</Label>
                <Select value={formData.communityType} onValueChange={(value) => setFormData({ ...formData, communityType: value })}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="learning">Learning</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="hobby">Hobby</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-isPublic"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="edit-isPublic">Make community public</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-requiresApproval"
                  checked={formData.requiresApproval}
                  onChange={(e) => setFormData({ ...formData, requiresApproval: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="edit-requiresApproval">Require approval for members</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
