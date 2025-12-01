'use client';

import OutlookPresentation from '@/components/outlook-addin/OutlookPresentation';

export default function OutlookAddinPage() {
  return (
    <div 
      className="w-full h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden font-heebo"
      dir="rtl"
    >
      <OutlookPresentation />
    </div>
  );
}
