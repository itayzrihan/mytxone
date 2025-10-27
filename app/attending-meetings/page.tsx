"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CalendarIcon, UsersIcon, ClockIcon, XCircleIcon, CheckCircleIcon } from "lucide-react";

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
  registrationStatus: string;
  attendanceStatus: string;
}

export default function AttendingMeetingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      const response = await fetch("/api/meetings?filter=attending");
      if (!response.ok) throw new Error("Failed to fetch meetings");
      const data = await response.json();
      setMeetings(data);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      toast.error("Failed to load meetings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnregister = async (meetingId: string) => {
    if (!confirm("Are you sure you want to unregister from this meeting?")) return;

    try {
      const response = await fetch(`/api/meetings/${meetingId}/register`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to unregister");

      toast.success("Successfully unregistered from meeting");
      fetchMeetings();
    } catch (error) {
      toast.error("Failed to unregister from meeting");
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

  const getStatusBadge = (registrationStatus: string) => {
    switch (registrationStatus) {
      case "approved":
        return <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded flex items-center gap-1">
          <CheckCircleIcon className="h-3 w-3" />
          Approved
        </span>;
      case "registered":
        return <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">Pending Approval</span>;
      case "rejected":
        return <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded flex items-center gap-1">
          <XCircleIcon className="h-3 w-3" />
          Rejected
        </span>;
      case "cancelled":
        return <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded">Cancelled</span>;
      default:
        return null;
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Registered Meetings</h1>
        <p className="text-zinc-400">Meetings you&apos;re attending</p>
      </div>

      {meetings.length === 0 ? (
        <Card className="bg-white/5 border-white/10 text-center py-12">
          <CardContent>
            <CalendarIcon className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No registered meetings</h3>
            <p className="text-zinc-400 mb-4">Browse available meetings on the home page</p>
            <Button
              onClick={() => router.push("/")}
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              Browse Meetings
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
                <div className="flex gap-2 flex-wrap">
                  {getStatusBadge(meeting.registrationStatus)}
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
                {meeting.meetingUrl && meeting.registrationStatus === "approved" && (
                  <Button
                    asChild
                    size="sm"
                    className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
                  >
                    <a href={meeting.meetingUrl} target="_blank" rel="noopener noreferrer">
                      Join Meeting
                    </a>
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUnregister(meeting.id)}
                  className="flex-1 border-red-400/30 text-red-400 hover:bg-red-500/20"
                >
                  Unregister
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
