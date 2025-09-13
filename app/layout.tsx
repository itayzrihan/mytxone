import { Metadata } from "next";
import { Toaster } from "sonner";

import BackgroundGlow from "@/components/custom/BackgroundGlow";
import { Navbar } from "@/components/custom/navbar-wrapper";
import { ThemeProvider } from "@/components/custom/theme-provider";
import { AuthWrapper } from "@/components/custom/auth-wrapper";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://gemini.vercel.ai"),
  title: "Next.js Gemini Chatbot",
  description: "Next.js chatbot template using the AI SDK and Gemini.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased relative">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthWrapper>
            <BackgroundGlow />
            <Toaster position="top-center" />
            <Navbar />
            
            {children}
          </AuthWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
