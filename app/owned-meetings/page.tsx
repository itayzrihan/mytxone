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
import { PlusIcon, Trash2Icon, Edit2Icon, CalendarIcon, UsersIcon, ClockIcon } from "lucide-react";
import { CreateMeetingDialog } from "@/components/custom/create-meeting-dialog";
import { MeetingLimitModal } from "@/components/custom/meeting-limit-modal";
import { AttendeesModal } from "@/components/custom/attendees-modal";
import { useUserPlan } from "@/components/custom/user-plan-context";

interface Meeting {
  id: string;
  title: string;
  description: string | null;
  meetingType: string;
  imageUrl: string | null;
  startTime: string;
  endTime: string;
  timezone: string;
  meetingUrl: string | null;
  maxAttendees: number | null;
  isPublic: boolean;
  requiresApproval: boolean;
  status: string;
  tags: string[] | null;
  attendeeCount: number;
  createdAt: string;
}

export default function OwnedMeetingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { userPlan, meetingCount, isLoading: isPlanLoading, refreshPlan } = useUserPlan();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [isAttendeesModalOpen, setIsAttendeesModalOpen] = useState(false);
  const [selectedMeetingForAttendees, setSelectedMeetingForAttendees] = useState<Meeting | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    meetingType: "webinar",
    startTime: "",
    endTime: "",
    timezone: "UTC",
    meetingUrl: "",
    maxAttendees: "",
    isPublic: true,
    requiresApproval: false,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchMeetings();
    }
  }, [status, router]);

  const fetchMeetings = async () => {
    try {
      const response = await fetch("/api/meetings?filter=owned");
      if (!response.ok) throw new Error("Failed to fetch meetings");
      const data = await response.json();
      setMeetings(data);
      // Refresh plan to update meeting count
      await refreshPlan();
    } catch (error) {
      console.error("Error fetching meetings:", error);
      toast.error("Failed to load meetings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMeeting) return;

    try {
      const response = await fetch(`/api/meetings/${selectedMeeting.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null,
        }),
      });

      if (!response.ok) throw new Error("Failed to update meeting");

      toast.success("Meeting updated successfully!");
      setIsEditDialogOpen(false);
      setSelectedMeeting(null);
      resetForm();
      fetchMeetings();
    } catch (error) {
      toast.error("Failed to update meeting");
    }
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    if (!confirm("Are you sure you want to delete this meeting?")) return;

    try {
      const response = await fetch(`/api/meetings/${meetingId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete meeting");

      toast.success("Meeting deleted successfully!");
      fetchMeetings();
    } catch (error) {
      toast.error("Failed to delete meeting");
    }
  };

  const openEditDialog = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setFormData({
      title: meeting.title,
      description: meeting.description || "",
      meetingType: meeting.meetingType,
      startTime: new Date(meeting.startTime).toISOString().slice(0, 16),
      endTime: new Date(meeting.endTime).toISOString().slice(0, 16),
      timezone: meeting.timezone,
      meetingUrl: meeting.meetingUrl || "",
      maxAttendees: meeting.maxAttendees?.toString() || "",
      isPublic: meeting.isPublic,
      requiresApproval: meeting.requiresApproval,
    });
    setIsEditDialogOpen(true);
  };

  const openAttendeesModal = (meeting: Meeting) => {
    setSelectedMeetingForAttendees(meeting);
    setIsAttendeesModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      meetingType: "webinar",
      startTime: "",
      endTime: "",
      timezone: "UTC",
      meetingUrl: "",
      maxAttendees: "",
      isPublic: true,
      requiresApproval: false,
    });
  };

  const handleCreateClick = () => {
    // Define meeting limits
    const meetingLimits = {
      free: 1,
      basic: 3,
      pro: Infinity,
    };

    const limit = meetingLimits[userPlan as keyof typeof meetingLimits] || 1;

    // If user is on free plan, redirect to create-meeting page
    if (userPlan === "free") {
      // Check if free user has reached their limit
      if (meetingCount >= limit) {
        setIsLimitModalOpen(true);
        return;
      }
      router.push("/mytx/create-meeting");
    } else {
      // For basic and pro users, check limit before opening modal
      if (userPlan === "basic" && meetingCount >= limit) {
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
          <h1 className="text-3xl font-bold text-white mb-2">My Meetings</h1>
          <p className="text-zinc-400">Manage your created meetings</p>
        </div>
        <Button 
          className="bg-cyan-500 hover:bg-cyan-600 text-white"
          onClick={handleCreateClick}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Meeting
        </Button>
      </div>

      {/* Create Meeting Dialog - Only for Basic/Pro users */}
      {userPlan !== "free" && (
        <CreateMeetingDialog 
          open={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen}
          onSuccess={fetchMeetings}
        />
      )}

      {/* Meeting Limit Modal */}
      <MeetingLimitModal
        open={isLimitModalOpen}
        onOpenChange={setIsLimitModalOpen}
        currentCount={meetingCount}
        limit={userPlan === "free" ? 1 : userPlan === "basic" ? 3 : Infinity}
        plan={userPlan || "free"}
        mode="reached"
        onRemoveMeeting={() => {
          // Close the modal and let user delete from the list
          setIsLimitModalOpen(false);
        }}
      />

      {meetings.length === 0 ? (
        <Card className="bg-white/5 border-white/10 text-center py-12">
          <CardContent>
            <CalendarIcon className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No meetings yet</h3>
            <p className="text-zinc-400 mb-4">Create your first meeting to get started</p>
            <Button
              onClick={handleCreateClick}
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Meeting
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {meetings.map((meeting) => (
            <Card key={meeting.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg mb-1">{meeting.title}</CardTitle>
                    <CardDescription className="text-cyan-400 text-sm capitalize">
                      {meeting.meetingType}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditDialog(meeting)}
                      className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
                    >
                      <Edit2Icon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteMeeting(meeting.id)}
                      className="h-8 w-8 p-0 text-zinc-400 hover:text-red-400"
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {meeting.description && (
                  <p className="text-sm text-zinc-400 line-clamp-2">{meeting.description}</p>
                )}
                <div className="flex items-center text-sm text-zinc-300">
                  <ClockIcon className="mr-2 h-4 w-4 text-cyan-400" />
                  {formatDate(meeting.startTime)}
                </div>
                <div className="flex items-center text-sm text-zinc-300">
                  <UsersIcon className="mr-2 h-4 w-4 text-cyan-400" />
                  {meeting.attendeeCount} {meeting.attendeeCount === 1 ? 'attendee' : 'attendees'}
                  {meeting.maxAttendees && ` / ${meeting.maxAttendees} max`}
                </div>
                <div className="flex gap-2">
                  {meeting.isPublic && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Public</span>
                  )}
                  {meeting.requiresApproval && (
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">Requires Approval</span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded ${
                    meeting.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' :
                    meeting.status === 'live' ? 'bg-red-500/20 text-red-400' :
                    meeting.status === 'completed' ? 'bg-gray-500/20 text-gray-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {meeting.status}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => openAttendeesModal(meeting)}
                  className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-400/30"
                  variant="outline"
                >
                  View Attendees ({meeting.attendeeCount})
                </Button>
                {meeting.meetingUrl && (
                  <Button
                    asChild
                    size="sm"
                    className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-400/30"
                  >
                    <a href={meeting.meetingUrl} target="_blank" rel="noopener noreferrer">
                      Join Meeting
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-black/90 border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Meeting</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Update your meeting details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateMeeting}>
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
                <Label htmlFor="edit-meetingType">Meeting Type *</Label>
                <Select value={formData.meetingType} onValueChange={(value) => setFormData({ ...formData, meetingType: value })}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="webinar">Webinar</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="demo">Demo</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="meeting">General Meeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-startTime">Start Time *</Label>
                  <Input
                    id="edit-startTime"
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-endTime">End Time *</Label>
                  <Input
                    id="edit-endTime"
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-meetingUrl">Meeting URL</Label>
                <Input
                  id="edit-meetingUrl"
                  type="url"
                  value={formData.meetingUrl}
                  onChange={(e) => setFormData({ ...formData, meetingUrl: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-maxAttendees">Max Attendees</Label>
                <Input
                  id="edit-maxAttendees"
                  type="number"
                  min="1"
                  value={formData.maxAttendees}
                  onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-isPublic"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="edit-isPublic">Make meeting public</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-requiresApproval"
                  checked={formData.requiresApproval}
                  onChange={(e) => setFormData({ ...formData, requiresApproval: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="edit-requiresApproval">Require approval</Label>
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

      {/* Attendees Modal */}
      <AttendeesModal
        isOpen={isAttendeesModalOpen}
        onOpenChange={setIsAttendeesModalOpen}
        meetingId={selectedMeetingForAttendees?.id || ""}
        meetingTitle={selectedMeetingForAttendees?.title}
      />
    </div>
  );
}
