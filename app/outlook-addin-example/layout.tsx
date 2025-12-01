import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Outlook Addin Presentation - Example',
  description: 'Example presentation page for Outlook Addin Pinning solution',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
