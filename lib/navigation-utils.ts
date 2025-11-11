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
  
  // Hide for create meeting and create community pages
  if (pathname === "/mytx/create-meeting" || pathname === "/mytx/create-community") {
    return false;
  }
  
  // Hide for individual community pages (but not the communities list)
  if (pathname.startsWith("/communities/") && pathname !== "/communities") {
    return true;
  }
  
  return false;
}