import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Outlook Addin - Professional Presentation',
  description: 'Professional presentation for Outlook Addin Pinning solution - comprehensive 1-hour meeting guide',
  robots: {
    index: false,
    follow: false,
  },
};

export default function OutlookAddinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* This layout will hide navbar/footer for outlook-addin presentation page */
    <div className="flex-1 w-full h-screen">
      {children}
    </div>
  );
}
