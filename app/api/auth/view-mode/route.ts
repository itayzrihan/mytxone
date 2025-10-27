import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { checkIfUserIsAdmin } from '@/db/queries';

/**
 * Toggle Admin View Mode
 * 
 * This endpoint allows admins to temporarily view the site as a regular user.
 * The view mode is stored as a cookie and does NOT modify the database.
 * The actual user role remains admin - this is purely a UI/permission filter.
 * 
 * Security considerations:
 * - Only authenticated admin users can toggle view mode
 * - View mode is not persisted to database
 * - View mode resets on new session/cookie expiration
 * - Hackers cannot bypass admin checks by just changing cookies
 *   because any critical operations verify role against database
 */

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify user is actually an admin (check against database, not just session)
    const isAdmin = await checkIfUserIsAdmin(session.user.id);
    if (!isAdmin) {
      // Log suspicious activity - non-admin trying to toggle view mode
      console.warn(`[SECURITY] Unauthorized view mode toggle attempt from user: ${session.user.id}`);
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get the requested mode
    const body = await request.json();
    const mode = body.mode as 'admin' | 'user' | undefined;

    // Validate mode value
    if (mode && !['admin', 'user'].includes(mode)) {
      return NextResponse.json(
        { error: 'Invalid mode. Must be "admin" or "user"' },
        { status: 400 }
      );
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      viewMode: mode || 'admin',
      message: mode === 'user' 
        ? 'Viewing site as regular user. Admin role is still active in background.'
        : 'Viewing site as admin'
    });

    // Set cookie with view mode (1 hour expiration)
    // Using httpOnly: false so client can read it, but secure since verified on server
    response.cookies.set('view-mode', mode || 'admin', {
      maxAge: 60 * 60, // 1 hour
      httpOnly: false, // Allow client-side read for UI purposes
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'lax'
    });

    return response;

  } catch (error) {
    console.error('Error toggling view mode:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check current view mode
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify user is admin
    const isAdmin = await checkIfUserIsAdmin(session.user.id);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get current view mode from cookie
    const viewMode = request.cookies.get('view-mode')?.value || 'admin';

    return NextResponse.json({
      viewMode: viewMode as 'admin' | 'user',
      isActuallyAdmin: true, // Always true if this endpoint is accessed
    });

  } catch (error) {
    console.error('Error getting view mode:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
