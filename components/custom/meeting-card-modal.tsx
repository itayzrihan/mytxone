"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MeetingCard, MeetingCardData } from "./meeting-card";

interface MeetingCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: MeetingCardData | null;
  formatDate: (dateString: string) => string;
  formatTime: (dateString: string) => string;
  isRegistered?: boolean;
  onRegister?: () => void;
  onUnregister?: () => void;
  showActions?: boolean;
}

export function MeetingCardModal({
  isOpen,
  onClose,
  meeting,
  formatDate,
  formatTime,
  isRegistered,
  onRegister,
  onUnregister,
  showActions = true,
}: MeetingCardModalProps) {
  if (!meeting) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-transparent border-none shadow-none p-0 max-w-lg">
        <MeetingCard
          meeting={meeting}
          formatDate={formatDate}
          formatTime={formatTime}
          isRegistered={isRegistered}
          onRegister={onRegister}
          onUnregister={onUnregister}
          showActions={showActions}
        />
      </DialogContent>
    </Dialog>
  );
}
