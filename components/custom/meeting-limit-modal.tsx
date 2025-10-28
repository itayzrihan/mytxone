"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

interface MeetingLimitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCount: number;
  limit: number;
  plan: string;
  onClose?: () => void;
  onRemoveMeeting?: () => void;
  mode?: 'reached' | 'warning'; // 'reached' = user hit the limit, 'warning' = about to attempt creation
}

/**
 * Reusable Meeting Limit Modal Component
 * 
 * This component displays when users have reached or are attempting to exceed their meeting creation limit.
 * Works for both free (1 meeting) and basic (3 meetings) users.
 * 
 * Usage:
 * - Free users: Shown when they try to create their 2nd meeting
 * - Basic users: Shown when they try to create their 4th meeting
 * - Shows current meeting count vs limit
 * - Provides options to delete an existing meeting or upgrade plan
 */
export function MeetingLimitModal({
  open,
  onOpenChange,
  currentCount,
  limit,
  plan,
  onClose,
  onRemoveMeeting,
  mode = 'reached'
}: MeetingLimitModalProps) {
  const router = useRouter();

  const handleRemoveMeeting = () => {
    if (onRemoveMeeting) {
      onRemoveMeeting();
    } else {
      onOpenChange(false);
    }
  };

  const handleUpgrade = () => {
    onOpenChange(false);
    router.push("/mytx/create-meeting");
  };

  const isFreeUser = plan === 'free';
  const isBasicUser = plan === 'basic';

  const getPlanDetails = () => {
    if (isFreeUser) {
      return {
        title: 'Free Plan Limit Reached',
        description: `Your Free plan allows ${limit} active meeting. To create more meetings, upgrade to Basic or Pro.`,
        nextPlan: 'Basic',
        icon: <AlertTriangle className="h-6 w-6 text-yellow-400" />,
        bgColor: 'bg-yellow-500/20',
      };
    }
    if (isBasicUser) {
      return {
        title: 'Basic Plan Limit Reached',
        description: `Your Basic plan allows ${limit} active meetings. To create unlimited meetings, upgrade to Pro.`,
        nextPlan: 'Pro',
        icon: <Zap className="h-6 w-6 text-orange-400" />,
        bgColor: 'bg-orange-500/20',
      };
    }
    return {
      title: 'Meeting Limit Reached',
      description: `You've reached the limit of ${limit} active meetings for the ${plan} plan.`,
      nextPlan: 'Upgrade',
      icon: <AlertTriangle className="h-6 w-6 text-yellow-400" />,
      bgColor: 'bg-yellow-500/20',
    };
  };

  const details = getPlanDetails();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 border-white/20 text-white max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 ${details.bgColor} rounded-full`}>
              {details.icon}
            </div>
            <DialogTitle className="text-xl">{details.title}</DialogTitle>
          </div>
          <DialogDescription className="text-zinc-400 text-sm">
            {details.description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Current Status */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-zinc-300">Current meetings:</span>
              <span className="text-white font-semibold">{currentCount}/{limit}</span>
            </div>
            <div className="mt-3 w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full ${
                  isFreeUser ? 'bg-yellow-400' : 'bg-orange-400'
                } transition-all duration-300`}
                style={{ width: `${(currentCount / limit) * 100}%` }}
              />
            </div>
          </div>

          {/* Benefits of upgrading */}
          <div className="space-y-2">
            <p className="text-white/80 text-xs font-semibold uppercase tracking-wide">
              Upgrade to {details.nextPlan}:
            </p>
            <ul className="space-y-1 text-xs text-zinc-300">
              {isFreeUser && (
                <>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    Create up to 3 active meetings
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    Advanced meeting features
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    Priority support
                  </li>
                </>
              )}
              {isBasicUser && (
                <>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    Unlimited active meetings
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    All pro features
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    24/7 premium support
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleRemoveMeeting}
            className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10"
          >
            Remove a Meeting
          </Button>
          <Button
            onClick={handleUpgrade}
            className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold"
          >
            Upgrade to {details.nextPlan}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
