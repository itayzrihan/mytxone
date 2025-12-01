'use client';

import OutlookPresentationExample from '@/components/outlook-addin-example/OutlookPresentationExample';

export default function OutlookAddinExamplePage() {
  return (
    <div 
      className="w-full h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden font-heebo"
      dir="rtl"
    >
      <OutlookPresentationExample />
    </div>
  );
}
