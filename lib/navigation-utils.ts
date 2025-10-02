// Hook to determine if navbar/footer should be hidden
import { usePathname, useSearchParams } from "next/navigation";

export function useHideNavigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Always hide for teleprompter
  if (pathname.includes("/teleprompter")) {
    return true;
  }
  
  // Hide for old create route (if it still exists)
  if (pathname === "/mytx/create") {
    return true;
  }
  
  // For new routes, we'll let the individual components decide
  // by using a URL parameter or other mechanism
  if (pathname === "/mytx/create-meeting" || pathname === "/mytx/create-community") {
    // Check if we're showing the upgrade wall (you could use a URL param or other method)
    // For now, we'll return false to show navbar/footer by default
    // The upgrade wall component itself can use CSS to hide them if needed
    return false;
  }
  
  return false;
}