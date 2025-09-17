import { auth } from "@/app/(auth)/auth";
import { generateUUID } from "@/lib/utils";
import { CategoryCapsules } from "@/components/custom/category-capsules";
import { MeetingCards } from "@/components/custom/meeting-cards";
import { SearchBar } from "@/components/custom/search-bar";
import { MusicPlayer, NavigationDock, GlassSearch, SmallGlassSearch, AppDock } from "@/components/glassmorphism";

export default async function Page() {
  const session = await auth();

  return (
    <div className="flex flex-col min-h-screen p-4 pt-16">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-2">
          Meet new people
        </h1>
        <p className="text-lg mb-8">
          <span className="text-zinc-300">or </span>
          <span className="text-cyan-400">create a new meeting</span>
        </p>
        
        {/* Search Bar with Glass Morphism */}
        <div className="mb-8">
          <SearchBar variant="full" />
        </div>
        
        <CategoryCapsules />
      </div>
      
      {/* Meeting Cards - Full width on desktop */}
      <div className="w-full max-w-6xl mx-auto px-4 mb-8">
        <MeetingCards />
      </div>

      {/* Glassmorphism UI Elements - positioned after meeting cards and pagination */}
      <div className="p-4 space-y-4">
        {/* Mobile Container with Music Player and Navigation */}
        <div className="container--mobile mx-auto">
          <div className="flex flex-col gap-4">
            <MusicPlayer />
            <div className="container--inline">
              <NavigationDock />
              <GlassSearch />
            </div>
          </div>
        </div>
        
        {/* Small Search - positioned separately */}
        <div className="container--small mx-auto">
          <SmallGlassSearch />
        </div>
        
        {/* App Dock */}
        <div className="container mx-auto max-w-md">
          <AppDock />
        </div>
      </div>
    </div>
  );
}