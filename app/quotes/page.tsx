import { auth } from '@/app/(auth)/auth';
import { redirect } from 'next/navigation';
import { QuoteDashboard } from '@/components/quotes/quote-dashboard';

export default async function QuotesPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/aichat?auth=required');
  }

  return (
    <div className="min-h-screen pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <QuoteDashboard currentUser={{ 
          id: session.user.id, 
          email: session.user.email || '' 
        }} />
      </div>
    </div>
  );
}