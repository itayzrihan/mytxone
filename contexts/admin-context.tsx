"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AdminContextType {
  shouldShowAdminElements: boolean;
  viewMode: "admin" | "user";
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [shouldShowAdminElements, setShouldShowAdminElements] = useState(false);
  const [viewMode, setViewMode] = useState<"admin" | "user">("user");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Check if user is actually an admin (database check)
        const adminResponse = await fetch("/api/auth/admin-status");
        if (adminResponse.ok) {
          const adminData = await adminResponse.json();

          if (adminData.isAdmin) {
            // If admin, check their current view mode
            const viewModeResponse = await fetch("/api/auth/view-mode");
            if (viewModeResponse.ok) {
              const viewModeData = await viewModeResponse.json();
              setViewMode(viewModeData.viewMode || "user");
              setShouldShowAdminElements(true);
            }
          } else {
            setShouldShowAdminElements(false);
            setViewMode("user");
          }
        } else {
          setShouldShowAdminElements(false);
          setViewMode("user");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setShouldShowAdminElements(false);
        setViewMode("user");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();

    // Listen for view-mode updates dispatched by toggle handlers
    const onViewModeUpdated = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail as string | undefined;
        if (detail === "admin" || detail === "user") {
          setViewMode(detail);
        } else {
          // If no detail provided, re-fetch the view-mode from the server
          (async () => {
            try {
              const resp = await fetch("/api/auth/view-mode");
              if (resp.ok) {
                const d = await resp.json();
                setViewMode(d.viewMode || "user");
              }
            } catch (err) {
              // ignore
            }
          })();
        }
      } catch (err) {
        // ignore malformed events
      }
    };

    window.addEventListener("view-mode-updated", onViewModeUpdated as EventListener);
    return () => {
      window.removeEventListener("view-mode-updated", onViewModeUpdated as EventListener);
    };
  }, []);

  return (
    <AdminContext.Provider value={{ shouldShowAdminElements, viewMode, isLoading }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
