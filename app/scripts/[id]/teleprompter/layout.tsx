import { Toaster } from "sonner";

import BackgroundGlow from "@/components/custom/BackgroundGlow";
import { ThemeProvider } from "@/components/custom/theme-provider";
import { AuthWrapper } from "@/components/custom/auth-wrapper";

export default function TeleprompterLayout({
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
        
        {/* Custom layout without navbar - no main wrapper, prevent body scrolling */}
        <div className="fixed inset-0 overflow-hidden">
          {children}
        </div>
        
      </AuthWrapper>
    </ThemeProvider>
  );
}