"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock, Users } from "lucide-react";
import { getCategoryLabel } from "@/lib/categories";

export interface MeetingCardData {
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

interface MeetingCardProps {
  meeting: MeetingCardData;
  formatDate: (dateString: string) => string;
  formatTime: (dateString: string) => string;
  isRegistered?: boolean;
  onRegister?: () => void;
  onUnregister?: () => void;
  showActions?: boolean;
  onClick?: () => void;
}

export function MeetingCard({
  meeting,
  formatDate,
  formatTime,
  isRegistered = false,
  onRegister,
  onUnregister,
  showActions = true,
  onClick,
}: MeetingCardProps) {
  return (
    <div
      onClick={onClick}
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
        {showActions && (
          <>
            {isRegistered ? (
              <div className="flex gap-2">
                <div className="flex-1 bg-green-500/20 border border-green-500/50 text-green-300 rounded-lg py-2 px-3 text-sm font-medium flex items-center justify-center">
                  ✓ You are registered
                </div>
                {onUnregister && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUnregister();
                    }}
                    size="sm"
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50"
                    variant="outline"
                  >
                    Unregister
                  </Button>
                )}
              </div>
            ) : (
              onRegister && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRegister();
                  }}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                  disabled={meeting.maxAttendees !== null && meeting.attendeeCount >= meeting.maxAttendees}
                >
                  {meeting.maxAttendees !== null && meeting.attendeeCount >= meeting.maxAttendees
                    ? "Full"
                    : "Register"}
                </Button>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}
