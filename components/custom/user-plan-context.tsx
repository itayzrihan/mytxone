"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";

type UserPlan = "free" | "basic" | "pro" | null;

interface UserPlanContextType {
  userPlan: UserPlan;
  meetingCount: number;
  communityCount: number;
  isLoading: boolean;
  refreshPlan: () => Promise<void>;
}

const UserPlanContext = createContext<UserPlanContextType | undefined>(undefined);

export function UserPlanProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [userPlan, setUserPlan] = useState<UserPlan>(null);
  const [meetingCount, setMeetingCount] = useState<number>(0);
  const [communityCount, setCommunityCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const fetchAbortRef = useRef<AbortController | null>(null);

  const fetchUserPlan = useCallback(async () => {
    try {
      // Cancel previous request if still pending
      if (fetchAbortRef.current) {
        fetchAbortRef.current.abort();
      }
      
      fetchAbortRef.current = new AbortController();
      const timestamp = new Date().getTime();
      const url = `/api/paypal/subscription/check?t=${timestamp}`;
      
      const response = await fetch(url, {
        method: 'GET',
        cache: "no-store",
        signal: fetchAbortRef.current.signal,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserPlan(data.subscription || "free");
        setMeetingCount(data.meetingCount || 0);
        setCommunityCount(data.communityCount || 0);
      } else {
        setUserPlan("free");
        setMeetingCount(0);
        setCommunityCount(0);
      }
    } catch (error) {
      // Don't log abort errors
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error("Error fetching user plan:", error);
      }
      setUserPlan("free");
      setMeetingCount(0);
      setCommunityCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Wait for session to be fully loaded
    if (status === "loading") {
      setIsLoading(true);
      return;
    }

    // Only fetch when we have an authenticated session with user data
    if (status === "authenticated" && session?.user?.email) {
      fetchUserPlan();
    } else if (status === "unauthenticated") {
      setUserPlan("free");
      setMeetingCount(0);
      setCommunityCount(0);
      setIsLoading(false);
    }
  }, [status, session?.user?.email, fetchUserPlan]);

  const refreshPlan = useCallback(async () => {
    setIsLoading(true);
    await fetchUserPlan();
  }, [fetchUserPlan]);

  return (
    <UserPlanContext.Provider value={{ userPlan, meetingCount, communityCount, isLoading, refreshPlan }}>
      {children}
    </UserPlanContext.Provider>
  );
}

export function useUserPlan() {
  const context = useContext(UserPlanContext);
  if (context === undefined) {
    throw new Error("useUserPlan must be used within a UserPlanProvider");
  }
  return context;
}
