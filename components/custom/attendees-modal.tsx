"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { Mail, Phone, User } from "lucide-react";

interface Attendee {
  id: string;
  fullName: string | null;
  notMytxEmail: string | null;
  phoneNumber: string | null;
  profileImageUrl: string | null;
}

interface AttendeesModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  meetingId: string;
  meetingTitle?: string;
}

export function AttendeesModal({
  isOpen,
  onOpenChange,
  meetingId,
  meetingTitle = "Meeting",
}: AttendeesModalProps) {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && meetingId) {
      fetchAttendees();
    }
  }, [isOpen, meetingId]);

  const fetchAttendees = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/meetings/${meetingId}/attendees`);
      if (!response.ok) throw new Error("Failed to fetch attendees");
      const data = await response.json();
      setAttendees(data);
    } catch (error) {
      console.error("Error fetching attendees:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 border-white/20 text-white max-w-2xl max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Meeting Attendees</DialogTitle>
          <DialogDescription className="text-zinc-400">
            {meetingTitle}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-zinc-400">Loading attendees...</p>
          </div>
        ) : attendees.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-zinc-400">No attendees registered yet</p>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {attendees.map((attendee) => (
              <div
                key={attendee.id}
                className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all"
              >
                <div className="flex gap-4">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    {attendee.profileImageUrl ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-cyan-400/30 to-blue-600/30">
                        <Image
                          src={attendee.profileImageUrl}
                          alt={attendee.fullName || "Attendee"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-600/30 flex items-center justify-center">
                        <User className="w-6 h-6 text-cyan-400" />
                      </div>
                    )}
                  </div>

                  {/* Attendee Info */}
                  <div className="flex-1 min-w-0">
                    {attendee.fullName && (
                      <p className="text-white font-semibold text-sm mb-1">
                        {attendee.fullName}
                      </p>
                    )}

                    <div className="space-y-1.5">
                      {attendee.notMytxEmail && (
                        <div className="flex items-center gap-2 text-xs text-zinc-300">
                          <Mail className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                          <span className="truncate">{attendee.notMytxEmail}</span>
                        </div>
                      )}
                      {attendee.phoneNumber && (
                        <div className="flex items-center gap-2 text-xs text-zinc-300">
                          <Phone className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                          <span>{attendee.phoneNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="text-xs text-zinc-500 text-center pt-4 border-t border-white/10">
              Total: {attendees.length} {attendees.length === 1 ? "attendee" : "attendees"}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
