import { useState, useEffect } from 'react';

interface AdminStatus {
  isAdmin: boolean;
  viewMode: 'admin' | 'user';
  shouldShowAdminElements: boolean; // isAdmin && viewMode === 'admin'
  shouldShowViewModeToggle: boolean; // isAdmin (regardless of view mode)
  isLoading: boolean;
}

/**
 * Custom hook to manage admin status and view mode
 *
 * This hook provides a centralized way to check:
 * - If user is actually an admin (from database)
 * - Current view mode (from cookie)
 * - Whether to show admin UI elements
 * - Whether to show view mode toggle
 *
 * Usage:
 * const { shouldShowAdminElements, shouldShowViewModeToggle, viewMode } = useAdminStatus(userId);
 */
export function useAdminStatus(userId?: string): AdminStatus {
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewMode, setViewMode] = useState<'admin' | 'user'>('admin');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        // Check if user is actually an admin (database check)
        const adminResponse = await fetch('/api/auth/admin-status');
        if (adminResponse.ok) {
          const adminData = await adminResponse.json();
          setIsAdmin(adminData.isAdmin);

          // If admin, check their current view mode
          if (adminData.isAdmin) {
            const viewModeResponse = await fetch('/api/auth/view-mode');
            if (viewModeResponse.ok) {
              const viewModeData = await viewModeResponse.json();
              setViewMode(viewModeData.viewMode || 'admin');
            }
          }
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
    
      // Listen for view-mode updates dispatched by toggle handlers
      const onViewModeUpdated = (e: Event) => {
        try {
          const detail = (e as CustomEvent).detail as string | undefined;
          if (detail === 'admin' || detail === 'user') {
            setViewMode(detail);
          } else {
            // If no detail provided, re-fetch the view-mode from the server
            (async () => {
              try {
                const resp = await fetch('/api/auth/view-mode');
                if (resp.ok) {
                  const d = await resp.json();
                  setViewMode(d.viewMode || 'admin');
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

      window.addEventListener('view-mode-updated', onViewModeUpdated as EventListener);
      return () => {
        window.removeEventListener('view-mode-updated', onViewModeUpdated as EventListener);
      };
 
  }, [userId]);

  return {
    isAdmin,
    viewMode,
    shouldShowAdminElements: isAdmin && viewMode === 'admin',
    shouldShowViewModeToggle: isAdmin,
    isLoading,
  };
}