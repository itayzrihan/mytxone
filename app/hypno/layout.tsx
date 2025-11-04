import { ReactNode } from "react";

export const metadata = {
  title: "Hypnosis & Personal Development | MyTx One",
  description: "Unlock your potential through hypnosis and personal development programs. Transform your mindset and achieve your goals.",
  keywords: "hypnosis, personal development, self-improvement, meditation, mindfulness",
  openGraph: {
    title: "Hypnosis & Personal Development | MyTx One",
    description: "Unlock your potential through hypnosis and personal development programs. Transform your mindset and achieve your goals.",
    url: "https://dg.mytx.co/hypno",
    type: "website",
    images: [
      {
        url: "https://dg.mytx.co/thumbails/hyno/hypno.jpg",
        width: 1200,
        height: 630,
        alt: "Hypnosis & Personal Development",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hypnosis & Personal Development | MyTx One",
    description: "Unlock your potential through hypnosis and personal development programs.",
    image: "https://dg.mytx.co/thumbails/hyno/hypno.jpg",
  },
};

export default function HypnoLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    /* This layout will hide navbar/footer for hypno pages */
    <div className="flex-1">
      {children}
    </div>
  );
}
