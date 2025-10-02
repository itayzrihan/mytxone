import { Toaster } from "sonner";

import BackgroundGlow from "@/components/custom/BackgroundGlow";
import { ThemeProvider } from "@/components/custom/theme-provider";
import { AuthWrapper } from "@/components/custom/auth-wrapper";

export default function CreateCommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthWrapper>
        <BackgroundGlow />
        <Toaster position="top-center" />
        
        {/* This layout will conditionally show/hide navbar based on the content */}
        {/* The upgrade wall will hide navbar/footer, placeholder pages will show them */}
        <div className="flex-1">
          {children}
        </div>
        
      </AuthWrapper>
    </ThemeProvider>
  );
}