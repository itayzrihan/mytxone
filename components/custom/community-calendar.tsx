"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, MapPin, Video, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface CommunityCalendarProps {
  communityId: string;
}

export function CommunityCalendar({ communityId }: CommunityCalendarProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch(`/api/communities/${communityId}/events?upcoming=true`);
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        }
      } catch (error) {
        console.error("Error loading events:", error);
        toast.error("Failed to load events");
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [communityId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <CalendarIcon className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
        <p className="text-zinc-400 text-lg">No upcoming events</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id} className="bg-zinc-900/50 border-white/10 p-6 hover:border-cyan-500/50 transition">
            <div className="flex gap-6">
              {/* Date Box */}
              <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex flex-col items-center justify-center text-white">
                <span className="text-2xl font-bold">
                  {format(new Date(event.startTime), "dd")}
                </span>
                <span className="text-xs uppercase">
                  {format(new Date(event.startTime), "MMM")}
                </span>
              </div>

              {/* Event Details */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">{event.title}</h3>
                <p className="text-zinc-400 mb-4">{event.description}</p>

                <div className="space-y-2 text-sm text-zinc-400">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {format(new Date(event.startTime), "PPp")} - {format(new Date(event.endTime), "p")}
                  </div>

                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                  )}

                  {event.meetingLink && (
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      <a
                        href={event.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline"
                      >
                        Join Virtual Meeting
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-4">
                  <span className="text-sm text-zinc-400">
                    {event.attendeeCount} attending
                  </span>
                  <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition">
                    RSVP
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
