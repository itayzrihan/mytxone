import { auth } from '@/app/(auth)/auth';
import { redirect } from 'next/navigation';
import { checkIfUserIsAdmin } from '@/db/queries';
import AdminDashboard from '@/components/admin/admin-dashboard';

export default async function AdminPage() {
  // Server-side authentication and authorization check
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/login');
  }

  // Check if user is admin
  const isAdmin = await checkIfUserIsAdmin(session.user.id);
  
  if (!isAdmin) {
    // Redirect to home page with error - users should not see admin routes
    redirect('/?error=unauthorized');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <AdminDashboard currentUser={{ 
        id: session.user.id, 
        email: session.user.email || '' 
      }} />
    </div>
  );
}