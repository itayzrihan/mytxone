import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { checkIfUserIsAdmin } from '@/db/queries';

/**
 * Middleware to check if the current user is an admin
 * This is a server-side security check that should be used on all admin routes
 * 
 * @param request - The Next.js request object
 * @returns Response with 403 if not admin, or continues to next() if admin
 */
export async function withAdminAuth(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse> | NextResponse
): Promise<NextResponse> {
  try {
    // Get the current session
    const session = await auth();
    
    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user has admin role
    const isAdmin = await checkIfUserIsAdmin(session.user.id);
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // User is authenticated and has admin role, proceed with the request
    return handler(request);
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Server action wrapper to ensure only admins can execute certain actions
 * This provides an additional layer of security for server actions
 * 
 * @param action - The server action to wrap with admin authentication
 * @returns Wrapped action that checks admin status before execution
 */
export function withAdminActionAuth<T extends any[], R>(
  action: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      // Get the current session
      const session = await auth();
      
      // Check if user is authenticated
      if (!session?.user?.id) {
        throw new Error('Authentication required');
      }

      // Check if user has admin role
      const isAdmin = await checkIfUserIsAdmin(session.user.id);
      
      if (!isAdmin) {
        throw new Error('Admin access required');
      }

      // User is authenticated and has admin role, execute the action
      return await action(...args);
    } catch (error) {
      console.error('Admin action auth error:', error);
      throw error;
    }
  };
}

/**
 * React component wrapper to check admin status on the client side
 * Note: This is for UX only - server-side checks are still required for security
 * 
 * @param userId - The current user's ID
 * @returns Promise<boolean> indicating if user is admin
 */
export async function isCurrentUserAdmin(userId: string): Promise<boolean> {
  try {
    return await checkIfUserIsAdmin(userId);
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}