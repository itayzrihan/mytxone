import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'איתי דילן זיונץ זריהן - Full-Stack Developer',
  description: 'מפתח Full-stack עם ניסיון של מעל 10 שנים בפיתוח מערכות מובייל, אפליקציות חכמות, AI ובינה מלאכותית. מומחה ב-React, React Native, Python, Golang, Rust ועיצוב UI/UX.',
  openGraph: {
    title: 'איתי דילן זיונץ זריהן - Full-Stack Developer',
    description: 'מפתח Full-stack עם ניסיון של מעל 10 שנים בפיתוח מערכות מובייל, אפליקציות חכמות, AI ובינה מלאכותית. מומחה ב-React, React Native, Python, Golang, Rust ועיצוב UI/UX.',
    images: ['/images/resume.jpg'],
    locale: 'he_IL',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'איתי דילן זיונץ זריהן - Full-Stack Developer',
    description: 'מפתח Full-stack עם ניסיון של מעל 10 שנים בפיתוח מערכות מובייל, אפליקציות חכמות, AI ובינה מלאכותית.',
    images: ['/images/resume.jpg'],
  },
  other: {
    'whatsapp:title': 'איתי דילן זיונץ זריהן - Full-Stack Developer',
    'whatsapp:description': 'מפתח Full-stack עם ניסיון של מעל 10 שנים | React, React Native, Python, AI & ML',
  },
};

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* This layout will hide navbar/footer for resume page */
    <div className="flex-1">
      {children}
    </div>
  );
}
