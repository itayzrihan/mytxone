import { Metadata } from "next";
import { Toaster } from "sonner";

import BackgroundGlow from "@/components/custom/BackgroundGlow";
import { Navbar } from "@/components/custom/navbar-wrapper";
import { ThemeProvider } from "@/components/custom/theme-provider";
import { AuthWrapper } from "@/components/custom/auth-wrapper";
import { Footer } from "@/components/custom/footer";
import { GlassNav } from "@/components/custom/glass-nav";

import "./globals.css";

const baseUrl = process.env.NEXTAUTH_URL || "https://mytx.one";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "MYTX.one - AI-Powered Digital Services",
  description: "Professional AI-powered digital services platform for content creation, automation, and business solutions.",
  icons: {
    icon: [
      { url: '/images/LOGO-APP-ORIGINAL.png', type: 'image/png' },
    ],
    apple: [
      { url: '/images/LOGO-APP-ORIGINAL.png', type: 'image/png' },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased relative min-h-screen flex flex-col">
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
            
            <main className="flex-1">
              {children}
            </main>
            
            <Footer />
            <GlassNav />
          </AuthWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
