import { ReactNode } from "react";
import { Metadata } from "next";

const baseUrl = process.env.NEXTAUTH_URL || "https://dg.mytx.co";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "היפנוזה וההתפתחות אישית | MyTx One",
  description: "פתחו את הפוטנציאל שלכם דרך היפנוזה ותוכניות התפתחות אישית. שנו את המנטליות שלכם והשיגו את היעדים שלכם.",
  keywords: "היפנוזה, התפתחות אישית, שיפור עצמי, מדיטציה, מודעות",
  openGraph: {
    title: "היפנוזה וההתפתחות אישית | MyTx One",
    description: "פתחו את הפוטנציאל שלכם דרך היפנוזה ותוכניות התפתחות אישית. שנו את המנטליות שלכם והשיגו את היעדים שלכם.",
    url: `${baseUrl}/hypno`,
    type: "website",
    locale: "he_IL",
    images: [
      {
        url: `${baseUrl}/thumbails/hyno/hypno.jpg`,
        width: 1200,
        height: 630,
        alt: "היפנוזה וההתפתחות אישית",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "היפנוזה וההתפתחות אישית | MyTx One",
    description: "פתחו את הפוטנציאל שלכם דרך היפנוזה ותוכניות התפתחות אישית.",
    images: [`${baseUrl}/thumbails/hyno/hypno.jpg`],
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
